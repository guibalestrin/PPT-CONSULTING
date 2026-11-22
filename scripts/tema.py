#!/usr/bin/env python3
"""tema.py -- grava as cores e o nome do tema no deck gerado pelo pptxgenjs e corrige defeitos conhecidos dele.

Uso: python3 tema.py deck.pptx tema.json [saida.pptx]
tema.json: { "name": "...", "colors": { dk1, lt1, dk2, lt2, accent1..accent6, hlink, folHlink } }  (hex de 6 digitos, sem #)

Por que existe: o pptxgenjs define so as duas fontes do tema e grava a paleta padrao do Office; sem este passo, qualquer cor
de esquema (accent1 etc.) vira azul/laranja do Office. Tambem:
- troca <c:crossesAt val="autoZero"/> por <c:crosses val="autoZero"/> (senao o PowerPoint oferece reparar o arquivo);
- recusa cor que nao tenha 6 digitos hex e traco de linha invalido (o PowerPoint tambem ofereceria reparar);
- remove as entradas de pasta do ZIP (nao sao partes do arquivo).
So usa a biblioteca padrao do Python. Reescreve o deck no lugar, a menos que um terceiro argumento nomeie outro arquivo.
"""
import json, re, shutil, sys, zipfile
from xml.sax.saxutils import escape

SLOTS = ['dk1', 'lt1', 'dk2', 'lt2', 'accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6', 'hlink', 'folHlink']
DASHES = ['solid', 'dot', 'dash', 'lgDash', 'dashDot', 'lgDashDot', 'lgDashDotDot', 'sysDash', 'sysDot', 'sysDashDot', 'sysDashDotDot']


def erro(msg):
    print(f'Erro: {msg} Nada foi alterado.', file=sys.stderr)
    sys.exit(1)


def main():
    if len(sys.argv) < 3:
        print('uso: python3 tema.py deck.pptx tema.json [saida.pptx]', file=sys.stderr); sys.exit(2)
    deck, tema_arq = sys.argv[1], sys.argv[2]
    saida = sys.argv[3] if len(sys.argv) > 3 else deck
    try:
        tema = json.load(open(tema_arq, encoding='utf8'))
    except Exception as e:
        erro(f'nao consegui ler {tema_arq} como JSON ({e}).')
    nome = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', str(tema.get('name', '')))
    if not nome: erro('theme.name e obrigatorio.')
    nome = escape(nome, {'"': '&quot;'})
    cores = tema.get('colors', tema)
    for k in SLOTS:
        if not re.fullmatch(r'[0-9A-Fa-f]{6}', str(cores.get(k, ''))):
            erro(f'theme.colors.{k} e {cores.get(k)!r}; precisa ter 6 digitos hex, sem "#" (campos: {" ".join(SLOTS)}).')

    z = zipfile.ZipFile(deck)
    arquivos = {n: z.read(n) for n in z.namelist() if not n.endswith('/')}   # entradas de pasta ficam de fora
    z.close()
    parte = 'ppt/theme/theme1.xml'
    if parte not in arquivos: erro(f'{deck} nao tem {parte}; este script e para decks gerados pelo pptxgenjs.')
    esquema = f'<a:clrScheme name="{nome}">' + ''.join(f'<a:{k}><a:srgbClr val="{str(cores[k]).upper()}"/></a:{k}>' for k in SLOTS) + '</a:clrScheme>'
    xml = re.sub(r'<a:clrScheme\b[\s\S]*?</a:clrScheme>', lambda m: esquema, arquivos[parte].decode('utf8'), count=1)
    if esquema not in xml: erro(f'{parte} nao tem <a:clrScheme> para substituir.')
    xml = re.sub(r'(<a:(?:theme|fontScheme)\b[^>]*?\bname=")[^"]*"', lambda m: f'{m.group(1)}{nome}"', xml)   # nenhum nome deve continuar "Office"
    arquivos[parte] = xml.encode('utf8')

    for n in list(arquivos):
        if not n.endswith('.xml'): continue
        t = arquivos[n].decode('utf8')
        ruim = re.search(r'<a:srgbClr val="((?![0-9A-Fa-f]{6}")[^"]*)"', t)
        if ruim:
            erro(f'{n} tem <a:srgbClr> com val={ruim.group(1)[:40]!r}, que nao tem 6 digitos hex. Em geral e uma cor de esquema passada a uma opcao que so aceita hex (grade, sombra, chartColors). Passe o hex de 6 digitos e gere de novo.')
        traco = [m for m in re.findall(r'<a:prstDash val="([^"]*)"', t) if m.strip() not in DASHES]
        if traco:
            erro(f'{n} tem <a:prstDash> com val={traco[0][:40]!r}, que nao e um estilo de traco, e o PowerPoint ofereceria reparar o arquivo. Use um destes: {" ".join(DASHES)}.')
        if '<c:crossesAt val="autoZero"/>' in t:
            arquivos[n] = t.replace('<c:crossesAt val="autoZero"/>', '<c:crosses val="autoZero"/>').encode('utf8')

    with zipfile.ZipFile(saida + '.tmp', 'w', zipfile.ZIP_DEFLATED) as out:
        for n, d in arquivos.items(): out.writestr(n, d)
    shutil.move(saida + '.tmp', saida)
    print(f'tema gravado em {saida}')


main()
