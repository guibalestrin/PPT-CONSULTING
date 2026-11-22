# graficos.py  -- uso: python graficos.py deck.pptx estilos.json
import json, re, sys, zipfile, shutil
from lxml import etree
NS = {'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart', 'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}
def el(xml): return etree.fromstring(f'<r xmlns:c="{NS["c"]}" xmlns:a="{NS["a"]}">{xml}</r>')[0]
def fill_xml(o):
    if o.get('vazio'): return '<a:noFill/>'
    if 'grad' in o:
        gs = ''.join(f'<a:gs pos="{int(p*1000)}"><a:srgbClr val="{c}"><a:alpha val="{int(al*1000)}"/></a:srgbClr></a:gs>' for p, c, al in o['grad'])
        return f'<a:gradFill rotWithShape="1"><a:gsLst>{gs}</a:gsLst><a:lin ang="{int(o.get("ang", 90)*60000)}" scaled="0"/></a:gradFill>'
    if 'patt' in o:
        p = o['patt']
        return f'<a:pattFill prst="{p.get("prst", "wdUpDiag")}"><a:fgClr><a:srgbClr val="{p["fg"]}"/></a:fgClr><a:bgClr><a:srgbClr val="{p.get("bg", "FFFFFF")}"/></a:bgClr></a:pattFill>'
    if 'cor' in o: return f'<a:solidFill><a:srgbClr val="{o["cor"]}"/></a:solidFill>'
def ln_xml(l):
    dash = f'<a:prstDash val="{l["traco"]}"/>' if l.get('traco') else ''
    return f'<a:ln w="{int(l.get("larg", 2)*12700)}" cap="rnd"><a:solidFill><a:srgbClr val="{l["cor"]}"/></a:solidFill>{dash}<a:round/></a:ln>'
def insert_after(parent, new, names):  # respeita a ordem do schema
    pos = 0
    for i, ch in enumerate(parent):
        if etree.QName(ch).localname in names: pos = i + 1
    parent.insert(pos, new)
def apply(ser, o, is_line):
    sp = ser.find('c:spPr', NS)
    if sp is None:
        sp = el('<c:spPr/>'); insert_after(ser, sp, ['idx', 'order', 'tx'])
    f = fill_xml(o)
    if f and not is_line:
        for old in [e for e in sp if etree.QName(e).localname in ('solidFill', 'gradFill', 'pattFill', 'noFill')]: sp.remove(old)
        sp.insert(0, el(f))
    if 'linha' in o:
        for old in sp.findall('a:ln', NS): sp.remove(old)
        sp.insert(1 if len(sp) and etree.QName(sp[0]).localname.endswith('Fill') else 0, el(ln_xml(o['linha'])))
    if 'marcador' in o and is_line:
        m = o['marcador']; old = ser.find('c:marker', NS)
        if old is not None: ser.remove(old)
        insert_after(ser, el(f'<c:marker><c:symbol val="{m.get("simbolo", "circle")}"/><c:size val="{m.get("tam", 7)}"/><c:spPr><a:solidFill><a:srgbClr val="{m.get("fill", "FFFFFF")}"/></a:solidFill><a:ln w="{int(m.get("larg_borda", 1.75)*12700)}"><a:solidFill><a:srgbClr val="{m["borda"]}"/></a:solidFill></a:ln></c:spPr></c:marker>'), ['idx', 'order', 'tx', 'spPr'])
    if 'pontos' in o:
        for old in ser.findall('c:dPt', NS): ser.remove(old)
        for i in sorted(o['pontos'], key=int, reverse=True):
            inv = '' if is_line else '<c:invertIfNegative val="0"/>'
            insert_after(ser, el(f'<c:dPt><c:idx val="{i}"/>{inv}<c:bubble3D val="0"/><c:spPr>{fill_xml(o["pontos"][i]) or ""}</c:spPr></c:dPt>'), ['idx', 'order', 'tx', 'spPr', 'invertIfNegative', 'pictureOptions', 'marker'])
    dl = ser.find('c:dLbls', NS)
    if dl is not None and 'caixa' in o:
        cx = o['caixa']
        for old in dl.findall('c:spPr', NS): dl.remove(old)
        borda = f'<a:ln w="12700"><a:solidFill><a:srgbClr val="{cx["borda"]}"/></a:solidFill></a:ln>' if cx.get('borda') else '<a:ln><a:noFill/></a:ln>'
        insert_after(dl, el(f'<c:spPr><a:solidFill><a:srgbClr val="{cx["fill"]}"/></a:solidFill>{borda}</c:spPr>'), ['dLbl', 'delete', 'numFmt'])
        for clr in dl.findall('.//c:txPr//a:defRPr/a:solidFill/a:srgbClr', NS): clr.set('val', cx.get('texto', 'FFFFFF'))
    if dl is not None and 'posRotulo' in o:   # posicao do rotulo so desta serie: t (acima), b (abaixo), ctr, inEnd, outEnd, l, r
        pos = dl.find('c:dLblPos', NS)
        if pos is None:
            pos = el('<c:dLblPos val="t"/>'); insert_after(dl, pos, ['dLbl', 'delete', 'numFmt', 'spPr', 'txPr'])
        pos.set('val', o['posRotulo'])
    if dl is not None and 'rotulos' in o:
        for old in dl.findall('c:dLbl', NS): dl.remove(old)
        n = len(ser.findall('c:val//c:pt', NS))
        for i in reversed([i for i in range(n) if i not in o['rotulos']]):
            dl.insert(0, el(f'<c:dLbl><c:idx val="{i}"/><c:delete val="1"/></c:dLbl>'))
    if 'suave' in o and is_line:
        sm = ser.find('c:smooth', NS)
        if sm is None:
            sm = el('<c:smooth val="0"/>'); insert_after(ser, sm, ['idx', 'order', 'tx', 'spPr', 'marker', 'dPt', 'dLbls', 'trendline', 'errBars', 'cat', 'val'])
        sm.set('val', '1' if o['suave'] else '0')
deck, estilos = sys.argv[1], json.load(open(sys.argv[2], encoding='utf-8'))
z = zipfile.ZipFile(deck); files = {n: z.read(n) for n in z.namelist() if not n.endswith('/')}; z.close()
feitos = set()
for n in [n for n in files if re.match(r'ppt/charts/chart\d+\.xml$', n)]:
    files[n] = files[n].replace(b'typeface="Arial"', b'typeface="+mn-lt"')   # pptxgenjs fixa Arial nos graficos
    root = etree.fromstring(files[n])
    for ser in root.iter('{%s}ser' % NS['c']):
        nome = ser.findtext('c:tx//c:v', namespaces=NS)
        if nome in estilos:
            apply(ser, estilos[nome], etree.QName(ser.getparent()).localname in ('lineChart', 'scatterChart', 'radarChart')); feitos.add(nome)
    files[n] = etree.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)
with zipfile.ZipFile(deck + '.tmp', 'w', zipfile.ZIP_DEFLATED) as out:
    for n, d in files.items(): out.writestr(n, d)
shutil.move(deck + '.tmp', deck)
falt = set(estilos) - feitos
print(f'graficos: {len(feitos)} series formatadas' + (f'; NAO encontradas: {sorted(falt)}' if falt else ''))
