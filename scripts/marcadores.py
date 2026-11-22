#!/usr/bin/env python3
"""marcadores.py -- acabamento dos layouts do slide master. Uso: python3 marcadores.py deck.pptx spec.json

spec.json: { "topo": "RRGGBB", "g0": "RRGGBB", "g1": "RRGGBB" }  (peca de cima; base em degrade de g0 a g1)

Faz tres coisas, todas por nome de forma (as formas vem do moldura.js):
1. Nos layouts, os retangulos MARC_topo_N e MARC_base_N viram a barrinha de duas pecas que marca o titulo e o subtitulo de cada
   quadrante: topo escuro e base em degrade, separados por um corte diagonal (o pptxgenjs nao desenha geometria livre em layouts).
2. Nos layouts, os placeholders (TITULO, APOIO, Qn_TIT, Qn_SUB) recebem margem zero, a ancora do texto e alinhamento a esquerda.
   O pptxgenjs so grava isso nos slides; sem este passo, um slide NOVO criado pelo usuario a partir do layout sairia com o texto
   deslocado e o titulo centralizado.
3. Nos slides, remove placeholders que ficaram vazios (senao o PowerPoint mostra "Click to add text" sobrando na edicao).
"""
import json, re, shutil, sys, zipfile

deck, spec = sys.argv[1], json.load(open(sys.argv[2]))
z = zipfile.ZipFile(deck)
arquivos = {n: z.read(n) for n in z.namelist() if not n.endswith('/')}
z.close()

SP = re.compile(r'<p:sp>.*?</p:sp>', re.S)
NOME = re.compile(r'<p:cNvPr id="\d+" name="([^"]*)"')
# pontos da peca em 1000 x 1000 (fracao da largura e da altura da barrinha); o corte e paralelo nas duas pecas
PECAS = {
    'topo': [(0, 0), (1000, 0), (1000, 140), (0, 380)],
    'base': [(0, 560), (1000, 320), (1000, 1000), (0, 1000)],
}
ANCORA = {'TITULO': 'ctr', 'APOIO': 't'}   # os Qn_TIT ficam colados embaixo e os Qn_SUB em cima


def geometria(pts):
    p = ''.join(('<a:moveTo>' if i == 0 else '<a:lnTo>') + f'<a:pt x="{x}" y="{y}"/>' + ('</a:moveTo>' if i == 0 else '</a:lnTo>')
                for i, (x, y) in enumerate(pts))
    return ('<a:custGeom><a:avLst/><a:gdLst/><a:ahLst/><a:cxnLst/><a:rect l="0" t="0" r="r" b="b"/>'
            f'<a:pathLst><a:path w="1000" h="1000">{p}<a:close/></a:path></a:pathLst></a:custGeom>')


def degrade(c0, c1):
    return ('<a:gradFill rotWithShape="1"><a:gsLst>'
            f'<a:gs pos="0"><a:srgbClr val="{c0}"/></a:gs><a:gs pos="100000"><a:srgbClr val="{c1}"/></a:gs>'
            '</a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill>')


def marcador(sp, peca):
    sp = re.sub(r'<a:prstGeom prst="rect">.*?</a:prstGeom>', lambda m: geometria(PECAS[peca]), sp, count=1, flags=re.S)
    if peca == 'base':
        sp = re.sub(r'<a:solidFill>.*?</a:solidFill>', lambda m: degrade(spec['g0'], spec['g1']), sp, count=1, flags=re.S)
    return re.sub(r'<a:ln>.*?</a:ln>|<a:ln/>', '<a:ln><a:noFill/></a:ln>', sp, count=1, flags=re.S)


def ancora_de(nome):
    if nome in ANCORA: return ANCORA[nome]
    if nome.endswith('_TIT'): return 'b'
    if nome.endswith('_SUB'): return 't'
    return None


def tratar_layout(sp):
    m = NOME.search(sp)
    nome = m.group(1) if m else ''
    mm = re.match(r'MARC_(topo|base)_\d+$', nome)
    if mm: return marcador(sp, mm.group(1))
    a = ancora_de(nome)
    if a and '<p:ph' in sp:
        corpo = f'<a:bodyPr wrap="square" lIns="0" tIns="0" rIns="0" bIns="0" rtlCol="0" anchor="{a}">'
        sp = re.sub(r'<a:bodyPr[^>]*>', lambda x: corpo, sp, count=1)
        # alinhamento a esquerda no estilo do layout (o master padrao centraliza os placeholders do tipo title)
        return re.sub(r'<a:lvl1pPr(?![^>]*algn=)', '<a:lvl1pPr algn="l"', sp, count=1)
    return sp


def tratar_slide(sp):
    # placeholder sem nenhum texto: some do slide (o layout continua com ele)
    if '<p:ph' in sp and not any(t.strip() for t in re.findall(r'<a:t>([^<]*)</a:t>', sp)):
        return ''
    return sp


def ids_unicos(xml):
    """O pptxgenjs da sempre id 25 ao placeholder do numero da pagina; com 25 formas ou mais na parte, o id se repete.
    Renumera as repeticoes (nenhuma forma desta skill e referenciada por id)."""
    ids = re.findall(r'<p:cNvPr id="(\d+)"', xml)
    if len(ids) == len(set(ids)): return xml
    visto, prox = set(), max(int(i) for i in ids) + 1
    def troca(m):
        nonlocal prox
        if m.group(1) in visto:
            novo, prox = prox, prox + 1
            return f'<p:cNvPr id="{novo}"'
        visto.add(m.group(1))
        return m.group(0)
    return re.sub(r'<p:cNvPr id="(\d+)"', troca, xml)


for n in list(arquivos):
    if re.match(r'ppt/slideLayouts/slideLayout\d+\.xml$', n):
        x = arquivos[n].decode('utf8')
        if '<p:cSld name="Conteudo' in x:
            arquivos[n] = SP.sub(lambda m: tratar_layout(m.group(0)), x).encode('utf8')
    elif re.match(r'ppt/slides/slide\d+\.xml$', n):
        arquivos[n] = SP.sub(lambda m: tratar_slide(m.group(0)), arquivos[n].decode('utf8')).encode('utf8')
    if re.match(r'ppt/(slideLayouts/slideLayout|slides/slide)\d+\.xml$', n):
        arquivos[n] = ids_unicos(arquivos[n].decode('utf8')).encode('utf8')

with zipfile.ZipFile(deck + '.tmp', 'w', zipfile.ZIP_DEFLATED) as out:
    for n, d in arquivos.items(): out.writestr(n, d)
shutil.move(deck + '.tmp', deck)
print('marcadores e placeholders ajustados')
