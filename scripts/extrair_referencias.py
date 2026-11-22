#!/usr/bin/env python3
"""extrair_referencias.py -- prepara um deck de referencia (PDF ou PPTX) para estudo de layout.

Uso: python3 -I extrair_referencias.py deck.pdf [--saida refs] [--dpi 80] [--por-folha 6]

Gera em --saida:
  folha-NN.jpg     folhas de contato (6 slides por imagem, numerados) para a visao geral com Read
  pagina-NN.jpg    cada pagina, para abrir so as que trazem arranjo ou elemento novo
  textos.json      texto de cada pagina
  inventario.md    densidade de texto por pagina (palavras, linhas) e paginas provavelmente so com imagem
PPTX e convertido para PDF com o LibreOffice (soffice). Requisitos: pdftoppm/pdftotext (poppler) ou pypdfium2; Pillow.
"""
import argparse, json, os, shutil, subprocess, sys, tempfile

ap = argparse.ArgumentParser()
ap.add_argument('deck')
ap.add_argument('--saida', default='refs')
ap.add_argument('--dpi', type=int, default=80)
ap.add_argument('--por-folha', type=int, default=6)
a = ap.parse_args()

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit('Precisa de Pillow (pip install pillow).')

os.makedirs(a.saida, exist_ok=True)
tmp = tempfile.mkdtemp(prefix='refs-')
src = os.path.abspath(a.deck)

# ---- PPTX -> PDF ----
if src.lower().endswith(('.pptx', '.ppt', '.potx')):
    soffice = shutil.which('soffice') or shutil.which('libreoffice')
    if not soffice:
        sys.exit('Para PPTX preciso do LibreOffice (soffice). Exporte o deck como PDF e rode de novo.')
    subprocess.run([soffice, '--headless', '--convert-to', 'pdf', '--outdir', tmp, src], check=True, capture_output=True, timeout=300)
    pdfs = [f for f in os.listdir(tmp) if f.endswith('.pdf')]
    if not pdfs:
        sys.exit('A conversao do PPTX para PDF falhou.')
    src = os.path.join(tmp, pdfs[0])

# ---- paginas em imagem ----
paginas = []
if shutil.which('pdftoppm'):
    subprocess.run(['pdftoppm', '-r', str(a.dpi), '-jpeg', src, os.path.join(tmp, 'p')], check=True)
    for f in sorted(x for x in os.listdir(tmp) if x.startswith('p-') and x.endswith('.jpg')):
        paginas.append(Image.open(os.path.join(tmp, f)).convert('RGB'))
else:
    try:
        import pypdfium2 as pdfium
    except ImportError:
        sys.exit('Precisa de pdftoppm (poppler-utils) ou pypdfium2.')
    doc = pdfium.PdfDocument(src)
    for i in range(len(doc)):
        paginas.append(doc[i].render(scale=a.dpi / 72).to_pil().convert('RGB'))

for i, im in enumerate(paginas, 1):
    im.save(os.path.join(a.saida, f'pagina-{i:02d}.jpg'), quality=85)

# ---- textos ----
textos = []
for i in range(1, len(paginas) + 1):
    t = ''
    if shutil.which('pdftotext'):
        r = subprocess.run(['pdftotext', '-layout', '-f', str(i), '-l', str(i), src, '-'], capture_output=True, text=True)
        t = r.stdout
    else:
        try:
            import pypdfium2 as pdfium
            t = pdfium.PdfDocument(src)[i - 1].get_textpage().get_text_range()
        except Exception:
            t = ''
    textos.append(t.strip())
with open(os.path.join(a.saida, 'textos.json'), 'w', encoding='utf8') as f:
    json.dump([{'pagina': i + 1, 'texto': t} for i, t in enumerate(textos)], f, ensure_ascii=False, indent=1)

# ---- folhas de contato ----
def fonte(tam):
    for c in ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'):
        if os.path.exists(c):
            return ImageFont.truetype(c, tam)
    return ImageFont.load_default()

if paginas:
    cw = 640
    ch = int(cw * paginas[0].height / paginas[0].width)
    cols, f = 2, fonte(22)
    for k in range(0, len(paginas), a.por_folha):
        grupo = paginas[k:k + a.por_folha]
        linhas = (len(grupo) + cols - 1) // cols
        folha = Image.new('RGB', (cols * cw + (cols + 1) * 16, linhas * (ch + 40) + 16), 'white')
        d = ImageDraw.Draw(folha)
        for j, im in enumerate(grupo):
            x, y = 16 + (j % cols) * (cw + 16), 16 + (j // cols) * (ch + 40)
            folha.paste(im.resize((cw, ch)), (x, y + 30))
            d.text((x, y), f'pagina {k + j + 1}', fill=(40, 40, 40), font=f)
            d.rectangle([x - 1, y + 29, x + cw, y + 30 + ch], outline=(180, 180, 180))
        folha.save(os.path.join(a.saida, f'folha-{k // a.por_folha + 1:02d}.jpg'), quality=82)

# ---- inventario ----
with open(os.path.join(a.saida, 'inventario.md'), 'w', encoding='utf8') as f:
    f.write(f'# Inventario: {os.path.basename(a.deck)}\n\n{len(paginas)} paginas.\n\n| Pagina | Palavras | Linhas | Densidade | Primeira linha |\n|---|---|---|---|---|\n')
    for i, t in enumerate(textos, 1):
        pal, lin = len(t.split()), len([l for l in t.splitlines() if l.strip()])
        dens = 'so imagem?' if pal < 8 else 'leve' if pal < 80 else 'media' if pal < 200 else 'densa'
        prim = next((l.strip() for l in t.splitlines() if l.strip()), '')[:70].replace('|', '/')
        f.write(f'| {i} | {pal} | {lin} | {dens} | {prim} |\n')

shutil.rmtree(tmp, ignore_errors=True)
print(f'{len(paginas)} paginas -> {a.saida}/ (folha-*.jpg, pagina-*.jpg, textos.json, inventario.md)')
