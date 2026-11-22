# barra_lateral.py  -- uso: python barra_lateral.py deck.pptx specs.json
import json, re, sys, zipfile, shutil
deck, specs = sys.argv[1], json.load(open(sys.argv[2]))
z = zipfile.ZipFile(deck); files = {n: z.read(n) for n in z.namelist() if not n.endswith('/')}; z.close()
SP = re.compile(r'<p:sp>(?:(?!</p:sp>).)*?name="(BL_[^"]*)"(?:(?!</p:sp>).)*?</p:sp>', re.S)
def grad(s):
    gs = ''.join(f'<a:gs pos="{int(p*1000)}"><a:srgbClr val="{c}"><a:alpha val="{int(a*1000)}"/></a:srgbClr></a:gs>' for p, c, a in s['stops'])
    return f'<a:gradFill rotWithShape="1"><a:gsLst>{gs}</a:gsLst><a:lin ang="{int(s["ang"]*60000)}" scaled="0"/></a:gradFill>'
def tratar(xml, nome):
    m = re.search(r'<a:ln[ >/]', xml)  # contorno; nao confundir com <a:lnTo> do caminho
    pre, pos = (xml[:m.start()], xml[m.start():]) if m else (xml, '')
    if nome in specs:
        pre = re.sub(r'<a:solidFill>.*?</a:solidFill>', grad(specs[nome]), pre, count=1, flags=re.S)
    if pos and not nome.startswith('BL_linha'):
        pos = re.sub(r'<a:ln(?:\s[^>]*)?(?:/>|>.*?</a:ln>)', '<a:ln><a:noFill/></a:ln>', pos, count=1, flags=re.S)
    return pre + pos
slides = sorted(n for n in files if re.match(r'ppt/slides/slide\d+\.xml$', n))
barra = [tratar(m.group(0), m.group(1)) for m in SP.finditer(files[slides[0]].decode())]
for n in slides: files[n] = SP.sub('', files[n].decode()).encode()
nid = 900
for n in [n for n in files if re.match(r'ppt/slideLayouts/slideLayout\d+\.xml$', n)]:
    x = files[n].decode()
    if '<p:cSld name="Conteudo' not in x: continue   # so layouts de conteudo (a capa copia as referencias e nao tem barra)
    bloco = ''
    for b in barra:
        nid += 1; bloco += re.sub(r'<p:cNvPr id="\d+"', f'<p:cNvPr id="{nid}"', b, count=1)
    files[n] = re.sub(r'(</p:grpSpPr>)', lambda m: m.group(1) + bloco, x, count=1).encode()
# degrade em formas do miolo com nome GR_*, aplicado no proprio slide (sem mover)
GR = re.compile(r'<p:sp>(?:(?!</p:sp>).)*?name="(GR_[^"]*)"(?:(?!</p:sp>).)*?</p:sp>', re.S)
for n in slides:
    files[n] = GR.sub(lambda m: tratar(m.group(0), m.group(1)) if m.group(1) in specs else m.group(0), files[n].decode()).encode()
with zipfile.ZipFile(deck + '.tmp', 'w', zipfile.ZIP_DEFLATED) as out:
    for n, d in files.items(): out.writestr(n, d)
shutil.move(deck + '.tmp', deck)
