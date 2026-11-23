#!/usr/bin/env python3
"""qa_deck.py -- verificacoes automaticas do deck (complementam o olhar visual, nao o substituem).

Uso: python3 qa_deck.py deck.pptx [--fonte "Gill Sans MT"] [--ttf regular.ttf] [--ttf-bold bold.ttf]

Confere: lacunas (quadrante ou card com pouco conteudo e vazio grande dentro: ERRO), grade de 4+ cards identicos (ERRO), divisao 'livre' em mais de 2 slides (ERRO); fonte unica; texto abaixo de 7pt; densidade (palavras por slide); habitos de IA (setas gordas, cards identicos); hierarquia (titulo maior que todo outro texto do slide); formas fora da area
util; possivel estouro de texto (estimativa, exata com --ttf); e lista as pendencias por slide (placeholders e [DADO: ...]).
Sai com codigo 1 se houver ERRO.
"""
import argparse, json, os, re, sys, zipfile, colorsys
from lxml import etree
try: sys.stdout.reconfigure(encoding='utf-8')   # Windows: acentos legiveis no console
except Exception: pass

A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
P = 'http://schemas.openxmlformats.org/presentationml/2006/main'
NS = {'a': A, 'p': P}
EMU = 914400.0

ap = argparse.ArgumentParser()
ap.add_argument('deck'); ap.add_argument('--modo', choices=['insperjr', 'financeiro']); ap.add_argument('--fonte'); ap.add_argument('--ttf'); ap.add_argument('--ttf-bold')
args = ap.parse_args()

# modo do deck (moldura.js grava modo_deck.txt ao lado do .pptx): 'insperjr' (padrao) tem texto maior, slides mais leves e
# revelacao progressiva (paginas com VEU sao copias com estado); 'financeiro' mantem os limites antigos (9pt, 100-300 palavras).
# 22/11/2026: o modo 'financeiro' foi removido; --modo e modo_deck.txt sao ignorados.
MODO = 'insperjr'
IJ = True

_fontes = {}
def medir(t, sz, bold):
    """largura em polegadas: exata com .ttf, senao estimativa (um pouco menos conservadora que a do moldura.js)"""
    arq = args.ttf_bold if bold else args.ttf
    if arq:
        from PIL import ImageFont
        f = _fontes.get(arq) or _fontes.setdefault(arq, ImageFont.truetype(arq, 100))
        return f.getlength(t) * sz / 100 / 72
    return len(t) * sz * (0.57 if bold else 0.51) / 72

def numero(n): return int(re.search(r'(\d+)\.xml$', n).group(1))

def caixa(e):
    x = e.find('p:spPr/a:xfrm', NS)
    if x is None: x = e.find('p:xfrm', NS)
    if x is None: return None
    off, ext = x.find('a:off', NS), x.find('a:ext', NS)
    if off is None or ext is None: return None
    return int(off.get('x')) / EMU, int(off.get('y')) / EMU, int(ext.get('cx')) / EMU, int(ext.get('cy')) / EMU

def paragrafos(sp):
    out = []
    for p in sp.findall('p:txBody/a:p', NS):
        runs = []
        for r in p.findall('a:r', NS):
            rpr = r.find('a:rPr', NS)
            sz = int(rpr.get('sz')) / 100 if rpr is not None and rpr.get('sz') else 18.0
            runs.append((r.findtext('a:t', default='', namespaces=NS), sz, rpr is not None and rpr.get('b') == '1'))
        out.append(runs)
    return out

def linhas_de(runs, largura):
    """linhas que um paragrafo ocupa na largura dada"""
    toks = [(w, sz, b) for t, sz, b in runs for w in re.findall(r'\S+\s*', t)]
    if not toks: return 0
    linhas, atual = 1, 0.0
    for w, sz, b in toks:
        lw, tw = medir(w.rstrip(), sz, b), medir(w, sz, b)
        if atual + lw > largura and atual > 0: linhas += 1; atual = tw
        else: atual += tw
    return linhas

def altura_necessaria(paras, largura):
    total = 0.0
    for runs in paras:
        toks = [(w, sz, b) for t, sz, b in runs for w in re.findall(r'\S+\s*', t)]
        if not toks: continue
        linhas, atual = 1, 0.0
        for w, sz, b in toks:
            lw, tw = medir(w.rstrip(), sz, b), medir(w, sz, b)
            if atual + lw > largura and atual > 0: linhas += 1; atual = tw
            else: atual += tw
        total += linhas * max(sz for _, sz, _ in toks) * 1.2 / 72
    return total

z = zipfile.ZipFile(args.deck)
nomes = z.namelist()
slides = sorted([n for n in nomes if re.match(r'ppt/slides/slide\d+\.xml$', n)], key=numero)
erros, avisos, infos, pend = [], [], [], {}
sumarios = set()
conteudo_idx, slides_com_tabela = [], []
tamanhos_titulo = []
GENERICOS = re.compile(r'^(an[aá]lise|vis[aã]o geral|overview|panorama|introdu[cç][aã]o|contexto|resumo|conclus[oõ]es?|agenda|principais)\b', re.I)
estilos_sumario = []   # (slide, estilo) lidos dos nomes dos objetos do sumario escuro
BRACKET = re.compile(r'\[(?:DADO|IMAGEM|FOTO|LOGO|GRAFICO|GRÁFICO|ICONE|ÍCONE|VIDEO|VÍDEO|MOCKUP)\b[^\]]*\]')

# ---- fonte unica (slides, layouts, graficos) ----
usadas = set()
for n in nomes:
    if re.match(r'ppt/(slides|slideLayouts|charts)/[^/]+\.xml$', n):
        usadas |= {f for f in re.findall(r'typeface="([^"]*)"', z.read(n).decode('utf8', 'ignore')) if f and not f.startswith('+')}
import subprocess
_v = subprocess.run([sys.executable, '-I', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'vetos_texto.py'), args.deck], capture_output=True, text=True, encoding='utf-8', env=dict(os.environ, PYTHONIOENCODING='utf-8')).stdout.strip()
for _l in _v.splitlines(): erros.append('texto vetado (travessao, meia-risca, menos ou ponto medio): ' + _l.strip())
if len(usadas) > 1: erros.append(f'mais de uma fonte no deck: {sorted(usadas)}')
if args.fonte and usadas and usadas != {args.fonte}: erros.append(f'fonte esperada "{args.fonte}", encontrada {sorted(usadas)}')
infos.append(f'fontes encontradas: {sorted(usadas) or "(so a do tema)"}')

# ---- por slide ----
for n in slides:
    idx = numero(n)
    root = etree.fromstring(z.read(n))
    titulo_sz, outros, palavras = None, [], 0
    nomes_slide, titulo_txt, longos = set(), '', []
    if b'umario_' in z.read(n) or b'GR_sumario' in z.read(n) or b'SUM_' in z.read(n): sumarios.add(idx)
    for tag, est in (('SUM_circulo', 'circulos'), ('SUM_pilula', 'pilulas'), ('SUM_paralelogramo', 'paralelogramos'), ('SUM_cartao', 'cartoes'), ('SUM_faixa', 'faixas_logo'), ('SUM_hexagono', 'hexagonos_arco'), ('SUM_trilha_marca', 'trilha_pergunta'), ('SUM_losango', 'losangos_celular'), ('SUM_marcador', 'objeto_marcadores')):
        if tag.encode() in z.read(n): estilos_sumario.append((idx, est)); break
    eh_capa = any((e.find('.//p:cNvPr', NS) is not None and e.find('.//p:cNvPr', NS).get('name') == 'CAPA_TITULO') for e in root.iter('{%s}sp' % P))
    # ---- habitos de IA que as referencias NAO tem (tabelas, setas, diagramas e icones foram liberados em 2026-11-11, desde que no
    #      formato das referencias: scripts/exhibits.js) ----
    ARROW = re.compile(r'^(rightArrow|leftArrow|upArrow|downArrow|notchedRightArrow|stripedRightArrow|curvedRightArrow|curvedLeftArrow|uturnArrow|bentUpArrow)$')
    n_setas, redondos = 0, []
    for sp in root.iter('{%s}sp' % P):
        cn = sp.find('.//p:cNvPr', NS); nm = cn.get('name') if cn is not None else ''
        if nm.startswith(('BL_', 'BARRA', 'MARC_', 'GR_marcador')) or eh_capa: continue
        g = sp.find('p:spPr/a:prstGeom', NS)
        if g is not None and ARROW.match(g.get('prst', '')): n_setas += 1
        bx = caixa(sp)
        if g is not None and g.get('prst') == 'roundRect' and bx and bx[2] > 1.6 and bx[3] > 0.9: redondos.append(bx)
    if n_setas: avisos.append(f'slide {idx}: {n_setas} seta(s) em bloco (forma "Arrow"): as referencias usam conector fino com ponta, colchete ou chevron de linha do tempo, nunca seta gorda')
    if len(redondos) >= 3 and max(b[2] for b in redondos) - min(b[2] for b in redondos) < 0.05:
        avisos.append(f'slide {idx}: {len(redondos)} cards arredondados identicos lado a lado: e o padrao de IA que as referencias nao usam (troque por blocos sem caixa, tabela ou painel unico)')
    for e in root.iter('{%s}sp' % P, '{%s}pic' % P, '{%s}graphicFrame' % P):
        c = e.find('.//p:cNvPr', NS); nome = c.get('name') if c is not None else ''
        nomes_slide.add(nome)
        cx = caixa(e)
        paras = paragrafos(e) if e.tag == '{%s}sp' % P else []
        for runs in paras:
            for t, sz, b in runs:
                for m in BRACKET.findall(t): pend.setdefault(idx, []).append(m)
                if nome == 'TITULO': titulo_sz = sz; titulo_txt += t
                elif len(t.strip()) > 2: outros.append(sz); palavras += len(t.split())
                if len(t.strip()) > 2 and sz < 7: erros.append(f'slide {idx}: texto com {sz:g}pt (minimo 7pt, so para micro-rotulos) em "{nome}": "{t.strip()[:40]}"')
        # limites da area util (pula titulo, apoio, fontes e a capa)
        if cx and not eh_capa and idx not in sumarios and nome not in ('TITULO', 'APOIO', 'FONTES', 'NOTAS', 'FLUXO') and not nome.startswith(('BL_', 'MARC_', 'GR_marcador', 'Slide Number', 'VEU', 'FAIXA_pergunta')) and not nome.endswith('_sombra'):
            x, y, w, h = cx
            if x < 0.64 - 0.05 or x + w > 12.78 + 0.05 or y + h > 6.75 + 0.05: avisos.append(f'slide {idx}: "{nome or e.tag.split("}")[1]}" fora da area util (x {x:.2f}-{x + w:.2f}, y {y:.2f}-{y + h:.2f})')
        if cx and (cx[0] + cx[2] > 13.34 or cx[1] + cx[3] > 7.51): erros.append(f'slide {idx}: "{nome}" ultrapassa a borda do slide')
        # possivel estouro de texto
        bp = e.find('p:txBody/a:bodyPr', NS)
        if cx and paras and bp is not None and bp.get('wrap') != 'none':
            ins = lambda k, d: int(bp.get(k, d)) / EMU
            disp_w = cx[2] - ins('lIns', 91440) - ins('rIns', 91440); disp_h = cx[3] - ins('tIns', 45720) - ins('bIns', 45720)
            if disp_w > 0.1 and any(t.strip() for r in paras for t, _, _ in r):
                nec = altura_necessaria(paras, disp_w)
                if nome not in ('TITULO', 'APOIO', 'FONTES', 'NOTAS', 'FLUXO') and idx not in sumarios and not eh_capa:
                    for runs in paras:
                        nl = linhas_de(runs, disp_w)
                        if (5 <= nl <= 6) if IJ else (4 <= nl <= 5): longos.append(nl)
                if nec > disp_h + 0.05: avisos.append(f'slide {idx}: possivel estouro em "{nome}": precisa ~{nec:.2f} pol, tem {disp_h:.2f} ("{"".join(t for r in paras for t, _, _ in r)[:40]}")')
    if titulo_sz is not None:
        mx = max(outros, default=0)
        tamanhos_titulo.append(titulo_sz)
        if titulo_sz <= mx and 'FAIXA_pergunta' not in nomes_slide: erros.append(f'slide {idx}: titulo ({titulo_sz:g}pt) nao e maior que o maior texto do slide ({mx:g}pt): perde hierarquia')
    elif not eh_capa and idx not in sumarios:
        avisos.append(f'slide {idx}: sem titulo (objeto TITULO)')
    # Contêineres de itens não podem invadir o item vizinho, mesmo nos sumários.
    containers=[]
    for sp in root.iter('{%s}sp' % P):
        cn=sp.find('.//p:cNvPr',NS); nm=cn.get('name','') if cn is not None else ''
        bx=caixa(sp)
        if re.match(r'^SUM_(circulo|pilula|paralelogramo|cartao|faixa|hexagono|trilha|losango|marcador)\d+$',nm) and bx: containers.append((nm,bx))
        if nm in ('APOIO','CAB_TITULO','CAB_SUBTITULO','SUM_item_titulo','SUM_item_desc','SUM_titulo'):
            esperado={'APOIO':14,'CAB_TITULO':13.5,'CAB_SUBTITULO':11.5,'SUM_item_titulo':16,'SUM_item_desc':11.5,'SUM_titulo':26}[nm]
            for runs in paragrafos(sp):
                if any(tx.strip() and sz!=esperado for tx,sz,_ in runs): erros.append(f'slide {idx}: {nm} fora do tamanho padrao {esperado}pt')
    for j,(na,a) in enumerate(containers):
        for nb,b in containers[j+1:]:
            if min(a[0]+a[2],b[0]+b[2])-max(a[0],b[0])>0.015 and min(a[1]+a[3],b[1]+b[3])-max(a[1],b[1])>0.015:
                erros.append(f'slide {idx}: itens de sumario sobrepostos: {na} e {nb}')
    # densidade: os slides de conteudo das referencias tem de 100 a 300 palavras e corpo de 8 a 10pt
    if titulo_sz is not None and not eh_capa:
        n_graf = len(root.findall('.//{%s}graphicFrame' % P))
        revel = 'VEU' in nomes_slide or any(nm_.startswith('POPUP_') for nm_ in nomes_slide)
        n_pic0 = len(root.findall('.//{%s}pic' % P))
        if not revel and idx not in sumarios and ((IJ and palavras < 30 and n_graf + n_pic0 < 1) or (not IJ and palavras < 60 and n_graf < 2)): avisos.append(f'slide {idx}: so {palavras} palavras e {n_graf} grafico(s)/tabela(s): ralo para o padrao das referencias' + (' Insper Jr (40 a 220 palavras, ou imagem grande explicada)' if IJ else ' (100 a 300 palavras por slide de conteudo)'))
        # cara de IA: slide-tabela, graficos crus sem anotacao, exhibit unico
        gf = root.findall('.//{%s}graphicFrame' % P)
        n_tab = sum(1 for g in gf if g.find('.//a:tbl', NS) is not None)
        n_ch = sum(1 for g in gf if b'chart' in etree.tostring(g))
        n_pic = len(root.findall('.//{%s}pic' % P))
        anota = b'prst="ellipse"' in z.read(n)
        for sp2 in root.iter('{%s}sp' % P, '{%s}cxnSp' % P):
            if sp2.find('.//a:prstDash', NS) is not None:
                bx2 = caixa(sp2)
                if bx2 is None or not (bx2[3] < 0.02 and bx2[2] > 3.0): anota = True   # tracejado que nao e fio separador longo
        conteudo_idx.append(idx)
        if idx not in sumarios:
            if palavras > (260 if IJ else 300): avisos.append(f'slide {idx}: {palavras} palavras (referencias: ' + ('40 a 220 nos decks Insper Jr' if IJ else '100 a 300; so os mais densos chegam a 450') + '): divida o slide ou corte texto')
            if 'FONTES' not in nomes_slide: avisos.append(f'slide {idx}: sem "Fontes:" no rodape (deck.fontes): toda pagina das referencias tem fonte')
            if longos: avisos.append(f'slide {idx}: {len(longos)} unidade(s) de texto com ' + ('5 a 6 linhas; nos decks Insper Jr o maximo por unidade e 4' if IJ else '4 a 5 linhas; fora do painel de descricao da empresa (6 a 9 linhas) o maximo e 3'))
            palavras_t = titulo_txt.split()
            if len(palavras_t) <= 4 or (GENERICOS.match(titulo_txt.strip()) and ':' not in titulo_txt):
                avisos.append(f'slide {idx}: titulo "{titulo_txt.strip()[:60]}" parece rotulo ou anuncio, nao conclusao (verbo + dado + consequencia)')
        if n_tab: slides_com_tabela.append(idx)
        if n_tab > 1: avisos.append(f'slide {idx}: {n_tab} tabelas no mesmo slide; nas referencias e no maximo 1 (e so para demonstracao, comparaveis, transacoes ou premissas)')
        if n_tab and not n_ch and not n_pic and idx not in sumarios: avisos.append(f'slide {idx}: slide so de tabela: com cara de IA fora de demonstracao financeira; combine com grafico anotado, mapa, citacao ou cadeia (assets/referencias/INDICE.md)')
        if n_ch and not anota and idx not in sumarios: avisos.append(f'slide {idx}: {n_ch} grafico(s) sem nenhuma anotacao (colcheteCagr, nota tracejada, elipse, linhaRef): toda leitura de grafico das referencias vem anotada')
        if not revel and ((IJ and n_ch + n_tab + n_pic < 1 and palavras < 50) or (not IJ and n_ch + n_tab + n_pic < 2 and palavras < 160)) and idx not in sumarios: avisos.append(f'slide {idx}: um unico exhibit e pouco texto: as referencias combinam 2 a 4 exhibits diferentes por slide')
        grandes = [z_ for z_ in outros if z_ > (16.5 if IJ else 12.5)]
        if len(grandes) > 6: avisos.append(f'slide {idx}: {len(grandes)} textos grandes no miolo: o corpo das referencias e ' + ('11-12pt (Insper Jr)' if IJ else '9pt (legenda 8pt)') + '; numero grande so 1 ou 2 por bloco')

# ---- geometria (22/11/2026, revisada): LACUNAS, nao percentual do slide ----
# O usuario aceita slide com menos area ocupada (diagrama com respiro, escada, imagem com margem). O que nao aceita e LACUNA:
# um quadrante ou um card com 1 frase e o resto em branco. Por isso o QA mede DENTRO de cada quadrante (blocos_deck.json,
# gravado pelo moldura.js) e DENTRO de cada card/painel preenchido, nao o slide inteiro.
MX0, MX1, MY1, PASSO, FOLGA = 0.64, 12.78, 6.75, 0.05, 0.10
IGNORAR = ('TITULO', 'APOIO', 'FONTES', 'NOTAS', 'FLUXO')
RET = ('rect', 'roundRect', 'snip1Rect', 'snip2SameRect', 'round1Rect', 'round2SameRect')
LACUNA_BLOCO, LACUNA_CARD, VAZIO_MIN = 0.45, 0.40, 0.35   # ocupacao minima do conteudo e maior vazio tolerado (fracao da area)

def caixa_g(e):
    x = e.find('p:grpSpPr/a:xfrm', NS) if e.tag == '{%s}grpSp' % P else None
    if x is None: return caixa(e)
    off, ext = x.find('a:off', NS), x.find('a:ext', NS)
    return int(off.get('x')) / EMU, int(off.get('y')) / EMU, int(ext.get('cx')) / EMU, int(ext.get('cy')) / EMU

def preenchido(e):
    sp = e.find('p:spPr', NS)
    if sp is None: return False
    if any(sp.find(t, NS) is not None for t in ('a:solidFill', 'a:gradFill', 'a:blipFill', 'a:pattFill')): return True
    ln = sp.find('a:ln', NS)
    return ln is not None and ln.find('a:noFill', NS) is None and ln.find('a:solidFill', NS) is not None

def maior_vazio(occ):
    """maior retangulo de celulas vazias (histograma): (area_celulas, i, j, w, h)"""
    ny, nx = len(occ), len(occ[0]) if occ else 0; alt = [0] * nx; melhor = (0, 0, 0, 0, 0)
    for j in range(ny):
        for i in range(nx): alt[i] = 0 if occ[j][i] else alt[i] + 1
        pilha = []
        for i in range(nx + 1):
            hh = alt[i] if i < nx else 0
            ini = i
            while pilha and pilha[-1][1] >= hh:
                ini, hp = pilha.pop()
                if hp * (i - ini) > melhor[0]: melhor = (hp * (i - ini), ini, j - hp + 1, i - ini, hp)
            pilha.append((ini, hh))
    return melhor

def elementos_do_slide(root):
    """lista de (nome, caixa, caixa_efetiva, preenchido, eh_card): texto sem fundo conta so a altura que o texto ocupa"""
    out = []
    for e in root.find('p:cSld/p:spTree', NS):
        if e.tag not in ('{%s}sp' % P, '{%s}pic' % P, '{%s}graphicFrame' % P, '{%s}grpSp' % P, '{%s}cxnSp' % P): continue
        c = e.find('.//p:cNvPr', NS); nome = c.get('name', '') if c is not None else ''
        if nome in IGNORAR or nome.startswith(('BL_', 'BARRA', 'MARC_', 'GR_marcador', 'Slide Number', 'VEU')): continue
        bx = caixa_g(e)
        if not bx or bx[2] * bx[3] > 0.9 * 13.333 * 7.5: continue
        x, y, w, h = bx; ef = bx; pre = e.tag != '{%s}sp' % P or preenchido(e); card = False
        if e.tag == '{%s}cxnSp' % P:
            ef = (x, y, max(w, 0.04), max(h, 0.04)); pre = True
        elif e.tag == '{%s}sp' % P:
            paras = paragrafos(e)
            tem_txt = any(t.strip() for r in paras for t, _, _ in r)
            if not pre:
                if not tem_txt: continue
                bp = e.find('p:txBody/a:bodyPr', NS)
                hh = min(h, altura_necessaria(paras, max(w - 0.2, 0.2)) + 0.1)
                anc = bp.get('anchor', 't') if bp is not None else 't'
                ef = (x, y + (h - hh) / 2 if anc == 'ctr' else (y + h - hh if anc == 'b' else y), w, hh)
            g = e.find('p:spPr/a:prstGeom', NS)
            card = (g is not None and g.get('prst') in RET and preenchido(e) and w * h >= 2.5 and min(w, h) >= 0.9
                    and not nome.endswith('_sombra') and not nome.startswith(('PH_', 'MIDIA_')) and e.find('p:spPr/a:blipFill', NS) is None)
        out.append((nome, bx, ef, pre, card, e))
    return out

def ocupacao_em(rect, elems, excluir=()):
    """fracao de rect coberta pelas caixas efetivas dos elementos (com folga) e maior vazio dentro dele"""
    rx, ry, rw, rh = rect
    nx, ny = max(1, int(rw / PASSO)), max(1, int(rh / PASSO))
    occ = [[False] * nx for _ in range(ny)]
    for nome, bx, ef, pre, card, e in elems:
        if e in excluir: continue
        x, y, w, h = ef
        if x >= rx + rw or x + w <= rx or y >= ry + rh or y + h <= ry: continue
        if pre and e is not None and e.tag == '{%s}sp' % P:   # fundo ou sombra do proprio bloco/card: preenchimento que cobre quase tudo nao e conteudo
            ix = max(0, min(bx[0] + bx[2], rx + rw) - max(bx[0], rx)); iy = max(0, min(bx[1] + bx[3], ry + rh) - max(bx[1], ry))
            if ix * iy >= 0.75 * rw * rh: continue
        i0 = max(0, int((x - FOLGA - rx) / PASSO)); i1 = min(nx, int((x + w + FOLGA - rx) / PASSO) + 1)
        j0 = max(0, int((y - FOLGA - ry) / PASSO)); j1 = min(ny, int((y + h + FOLGA - ry) / PASSO) + 1)
        for j in range(j0, j1):
            linha = occ[j]
            for i in range(i0, i1): linha[i] = True
    tot = nx * ny
    a, vi, vj, vw, vh = maior_vazio(occ)
    return sum(map(sum, occ)) / tot, a / tot, (rx + vi * PASSO, ry + vj * PASSO, vw * PASSO, vh * PASSO)

_bl_arq = os.path.join(os.path.dirname(os.path.abspath(args.deck)), 'blocos_deck.json')
try: BLOCOS = json.load(open(_bl_arq, encoding='utf8')) if os.path.exists(_bl_arq) else {}
except Exception: BLOCOS = {}

for n in slides:
    idx = numero(n)
    root = etree.fromstring(z.read(n))
    nomes_s = {c.get('name') for c in root.iter('{%s}cNvPr' % P)}
    if idx in sumarios or 'CAPA_TITULO' in nomes_s or 'TITULO' not in nomes_s: continue
    elems = elementos_do_slide(root)
    # 1. slide inteiro: so informativo (diagrama com respiro e aceito)
    y0 = 1.25
    for e in root.iter('{%s}sp' % P):
        c = e.find('.//p:cNvPr', NS)
        if c is not None and c.get('name') == 'APOIO' and caixa(e): bx = caixa(e); y0 = max(y0, min(bx[1] + bx[3] + 0.05, 1.6))
    oc, vz, _ = ocupacao_em((MX0, y0, MX1 - MX0, MY1 - y0), elems)
    infos.append(f'slide {idx}: ocupacao {int(oc * 100)}% da area util; maior vazio {int(vz * 100)}%')
    # 2. quadrantes (blocos_deck.json): 1 frase e o resto em branco = lacuna
    lac = 0
    for k, r in enumerate(BLOCOS.get(str(idx), []), 1):
        if r['w'] * r['h'] < 1.5: continue
        o, v, (vx, vy, vw, vh) = ocupacao_em((r['x'], r['y'], r['w'], r['h']), elems)
        if o < LACUNA_BLOCO and v > VAZIO_MIN and min(vw, vh) >= 0.8:
            erros.append(f'slide {idx}: quadrante {k} com lacuna: o conteudo ocupa {int(o * 100)}% dele e sobra um vazio de {vw:.1f} x {vh:.1f} pol. Complete com exhibit, imagem ou card, junte com o quadrante vizinho ou mude a divisao'); lac += 1
    # 3. cards e paineis preenchidos: card grande com 1 linha dentro = lacuna
    vistos = []
    for nome, bx, ef, pre, card, e in elems:
        if not card: continue
        if any(abs(bx[0] - v[0]) < 0.15 and abs(bx[1] - v[1]) < 0.15 and abs(bx[2] - v[2]) < 0.15 and abs(bx[3] - v[3]) < 0.15 for v in vistos): continue   # sombra do mesmo card
        vistos.append(bx)
        o, v, (vx, vy, vw, vh) = ocupacao_em(bx, elems, excluir=(e,))
        # o texto do proprio card (cabecalho escrito nele) conta pela altura que ocupa
        paras = paragrafos(e)
        if any(t.strip() for r in paras for t, _, _ in r):
            hh = min(bx[3], altura_necessaria(paras, max(bx[2] - 0.2, 0.2)) + 0.1)
            o += (hh * bx[2]) / (bx[2] * bx[3]) * 0.9
        if o < LACUNA_CARD and v > VAZIO_MIN and min(vw, vh) >= 0.8:
            erros.append(f'slide {idx}: card/painel "{nome}" ({bx[2]:.1f} x {bx[3]:.1f} pol) com lacuna: o conteudo ocupa {int(o * 100)}% dele. Encha com exhibit, imagem ou texto estruturado, ou reduza o card e redistribua'); lac += 1
    # 4. sem quadrantes registrados: vazio grande no slide vira aviso (olhar no render)
    if not BLOCOS.get(str(idx)) and not lac:
        o, v, (vx, vy, vw, vh) = ocupacao_em((MX0, y0, MX1 - MX0, MY1 - y0), elems)
        if v > 0.15 and min(vw, vh) >= 1.5: avisos.append(f'slide {idx}: area vazia de {vw:.1f} x {vh:.1f} pol em x {vx:.1f}, y {vy:.1f}: confira no render se e respiro intencional ou lacuna')
    # 5. grade de cards identicos
    grupos = {}
    for nome, bx, ef, pre, card, e in elems:
        if card and bx[2] >= 1.2 and bx[3] >= 1.2: grupos.setdefault((round(bx[2] / 0.05), round(bx[3] / 0.05), round(bx[1] / 0.05)), set()).add(round(bx[0] / 0.05))
    grade = max((len(v) for v in grupos.values()), default=0)
    if grade >= 4: erros.append(f'slide {idx}: grade de {grade} cards identicos lado a lado (proibido: cara de IA). Varie o peso dos cards (um principal maior), use cards de tipos diferentes ou outra organizacao (references/arranjos.md)')
    # 6. modo sketch: titulo e hipotese com a lacuna dentro; exhibit desenhado, nao caixa vazia de analise
    tit = ''.join(t.text or '' for e in root.iter('{%s}sp' % P) if (e.find('.//p:cNvPr', NS) is not None and e.find('.//p:cNvPr', NS).get('name') == 'TITULO') for t in e.iter('{%s}t' % A)).strip()
    if re.match(r'^\[\s*T[IÍ]TULO', tit, re.I): erros.append(f'slide {idx}: titulo e so o placeholder "{tit[:40]}": escreva a hipotese de conclusao com a lacuna dentro (ex.: "A demanda cresce [DADO: % a.a.] e abre espaco para ...")')
    for e in root.iter('{%s}sp' % P):
        bx = caixa(e); tx = ''.join(t.text or '' for t in e.iter('{%s}t' % A)).strip()
        if bx and bx[2] * bx[3] >= 3.0 and re.match(r'^\[\s*AN[AÁ]LISE', tx, re.I) and len(tx) < 160:
            avisos.append(f'slide {idx}: caixa de {bx[2]:.1f} x {bx[3]:.1f} pol so com "{tx[:50]}": no sketch, desenhe o exhibit esqueleto (grafico com [DADO], quadro com as linhas certas) em vez de caixa vazia'); break

# Geometria negativa (ex.: LINE com h < 0): o PowerPoint recusa abrir o arquivo inteiro ("could not open the file"), mesmo com
# zip e QA ok. Aconteceu no deck Carrefour (22/11/2026). Para linha em qualquer direcao use deck.N.seg(s, x1, y1, x2, y2, line).
for sn in slides:
    for cx_, cy_ in re.findall(rb'<a:ext cx="(-?\d+)" cy="(-?\d+)"', z.read(sn)):
        if int(cx_) < 0 or int(cy_) < 0:
            erros.append(f'slide {numero(sn)}: forma com largura ou altura negativa (cx={int(cx_)}, cy={int(cy_)}): o PowerPoint nao abre o arquivo. Use N.seg ou confira y2 > y1'); break

# Cores de fotos e logos não entram na checagem; somente preenchimentos nativos grandes.
ident_arq=os.path.join(os.path.dirname(os.path.abspath(args.deck)),'identidade_visual.json')
if os.path.exists(ident_arq):
    ident=json.load(open(ident_arq,encoding='utf8'))
    def hsv(h):return colorsys.rgb_to_hsv(*(int(h[j:j+2],16)/255 for j in (0,2,4)))
    familias=[hsv(h) for h in ident['paleta'].values()]
    for sn in slides:
        rt=etree.fromstring(z.read(sn))
        for sp in rt.iter('{%s}sp' % P):
            bx=caixa(sp)
            if not bx or bx[2]*bx[3]<.2:continue
            for cor in sp.findall('p:spPr/a:solidFill/a:srgbClr',NS)+sp.findall('p:spPr/a:gradFill/a:gsLst/a:gs/a:srgbClr',NS):
                h,sa,v=hsv(cor.get('val'))
                if sa<.14 or v<.10:continue
                if not any(sb>=.14 and min(abs(h-hb),1-abs(h-hb))<.075 for hb,sb,vb in familias):
                    erros.append(f'slide {numero(sn)}: preenchimento fora das familias da paleta fixa: {cor.get("val")}')

for nc in nomes:
    if re.match(r'ppt/charts/chart\d+\.xml$', nc) and b'majorGridlines' in z.read(nc): avisos.append(f'{nc.split("/")[-1]}: grafico com linhas de grade; as referencias nao usam grade')
seq = [e for _, e in estilos_sumario]
if len(set(seq)) > 1: erros.append('sumarios com modelos diferentes: manter um unico modelo em toda a apresentacao')
if seq: infos.append('estilos de sumario: ' + ', '.join(seq))
# variedade: le registro_decisoes.json ao lado do deck (gravado por deck.finalizar)
reg = os.path.join(os.path.dirname(os.path.abspath(args.deck)), 'registro_decisoes.json')
if os.path.exists(reg):
    try:
        dec = json.load(open(reg, encoding='utf8'))
        divs = [str(d.get('divisao') or '').strip() for d in dec]
        for i in range(1, len(dec)):
            a_, b_ = dec[i - 1], dec[i]
            if divs[i] and divs[i] == divs[i - 1]: avisos.append(f'slides "{a_.get("slide")}" e "{b_.get("slide")}" (vizinhos) repetem a divisao "{divs[i]}": slides vizinhos nao repetem a divisao')
            ea, eb = {str(x).lower() for x in a_.get('exhibits', [])}, {str(x).lower() for x in b_.get('exhibits', [])}
            if ea and ea == eb: avisos.append(f'slides "{a_.get("slide")}" e "{b_.get("slide")}" usam exatamente os mesmos exhibits: varie a forma principal')
        n_livre = sum(1 for d in divs if d.lower() == 'livre')
        if n_livre > 2: erros.append(f'divisao "livre" em {n_livre} slides (maximo 2 por deck): informe em deck.decidir a divisao real (2c, 3c, 2x2, L, 1+2...) para o QA checar a variedade')
        usadas = [d for d in divs if d]
        if len(usadas) >= 4 and len(set(usadas)) < max(2, len(usadas) // 2): avisos.append(f'pouca variedade de divisoes: {len(set(usadas))} tipos em {len(usadas)} slides ({", ".join(sorted(set(usadas)))})')
        infos.append(f'variedade: {len(set(usadas))} divisoes distintas em {len(usadas)} slides de conteudo registrados')
    except Exception as ex: avisos.append(f'registro_decisoes.json ilegivel: {ex}')
else: avisos.append('registro_decisoes.json nao encontrado ao lado do deck: nao consegui checar a variedade entre slides')
sd = os.path.join(os.path.dirname(os.path.abspath(args.deck)), 'estilo_deck.json')
if os.path.exists(sd):
    try: infos.append('sorteio do deck: ' + json.dumps(json.load(open(sd, encoding='utf8')), ensure_ascii=False))
    except Exception: pass

if conteudo_idx and len(slides_com_tabela) / len(conteudo_idx) > 0.25:
    avisos.append(f'{len(slides_com_tabela)} de {len(conteudo_idx)} slides de conteudo tem tabela (> 25%): nos decks de referencia o corpo e feito de graficos anotados, mapas, cadeias e citacoes; tabela e excecao')
if len(set(tamanhos_titulo)) > 1: erros.append('titulos com tamanhos diferentes: reescrever os longos em vez de diminuir a fonte')
if IJ and any(v != 26 for v in tamanhos_titulo): erros.append('titulo de conteudo deve usar 26pt fixos')
if tamanhos_titulo:
    infos.append(f'tamanhos de titulo: {min(tamanhos_titulo):g} a {max(tamanhos_titulo):g}pt' + (' (variam bastante; considere encurtar os mais longos)' if max(tamanhos_titulo) - min(tamanhos_titulo) > 6 else ''))

# ---- placeholders de layout (logos) ----
for n in nomes:
    if re.match(r'ppt/slideLayouts/slideLayout\d+\.xml$', n):
        for m in BRACKET.findall(' '.join(re.findall(r'<a:t>([^<]*)</a:t>', z.read(n).decode('utf8', 'ignore')))): pend.setdefault('layouts', []).append(m)

print('=== QA do deck ===')
for i in infos: print('[INFO]  ' + i)
for a in avisos: print('[AVISO] ' + a)
for e in erros: print('[ERRO]  ' + e)
print('\n=== Pendencias por slide ===')
if not pend: print('(nenhuma)')
for k in sorted(pend, key=lambda k: (k == 'layouts', k if isinstance(k, int) else 0)):
    itens = list(dict.fromkeys(pend[k]))
    print(('layouts (todos os slides)' if k == 'layouts' else f'slide {k}') + ': ' + '; '.join(itens))
print(f'\n{len(erros)} erro(s), {len(avisos)} aviso(s)')
sys.exit(1 if erros else 0)
