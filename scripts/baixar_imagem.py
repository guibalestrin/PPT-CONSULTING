#!/usr/bin/env python3
"""baixar_imagem.py -- baixa UMA imagem da web para assets/imagens e registra no catalogo.json.

Uso: python3 baixar_imagem.py URL --tema "sprite embalagem" --fonte "Wikimedia Commons, CC BY-SA 4.0" [--descricao "..."] [--pasta imagens] [--min 900]
Codigos de saida: 0 ok | 3 sem rede ou URL recusada | 4 imagem ruim (nao e imagem, pequena demais) | 2 uso errado.
So biblioteca padrao. Nao dimensiona nem recorta: deck.imagem faz isso. Se sair com 3 ou 4, deixe o placeholder e liste o termo de busca e a URL nas pendencias.
"""
import argparse, json, os, re, struct, sys, unicodedata, urllib.request

def dims(b):
    if b[:8] == b'\x89PNG\r\n\x1a\n': return struct.unpack('>II', b[16:24])
    if b[:2] == b'\xff\xd8':
        i = 2
        while i + 9 < len(b):
            if b[i] != 0xff: i += 1; continue
            m = b[i + 1]
            if 0xc0 <= m <= 0xcf and m not in (0xc4, 0xc8, 0xcc): return (struct.unpack('>H', b[i + 7:i + 9])[0], struct.unpack('>H', b[i + 5:i + 7])[0])
            i += 2 + struct.unpack('>H', b[i + 2:i + 4])[0]
    if b[:4] == b'RIFF' and b[8:12] == b'WEBP':
        if b[12:16] == b'VP8X': return (1 + int.from_bytes(b[24:27], 'little'), 1 + int.from_bytes(b[27:30], 'little'))
        if b[12:16] == b'VP8 ': return (struct.unpack('<H', b[26:28])[0] & 0x3fff, struct.unpack('<H', b[28:30])[0] & 0x3fff)
    return None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('url'); ap.add_argument('--tema', required=True); ap.add_argument('--fonte', required=True)
    ap.add_argument('--descricao', default=''); ap.add_argument('--pasta', default='imagens'); ap.add_argument('--min', type=int, default=900, help='lado maior minimo em px')
    a = ap.parse_args()
    try:
        req = urllib.request.Request(a.url, headers={'User-Agent': 'Mozilla/5.0 (slides-consultoria-br)'})
        with urllib.request.urlopen(req, timeout=30) as r:
            tipo = r.headers.get('Content-Type', ''); dados = r.read(25_000_000)
    except Exception as e:
        print(f'SEM REDE/RECUSADO: {e}. Deixe o placeholder e liste a URL e o termo de busca nas pendencias.', file=sys.stderr); sys.exit(3)
    ext = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp'}.get(tipo.split(';')[0].strip().lower())
    d = dims(dados)
    if not ext or not d:
        print(f'NAO E IMAGEM UTIL (tipo {tipo!r}); so jpg, png ou webp. SVG: baixe o PNG.', file=sys.stderr); sys.exit(4)
    if max(d) < a.min:
        print(f'IMAGEM PEQUENA: {d[0]}x{d[1]} (minimo {a.min}px no maior lado); pixela no slide.', file=sys.stderr); sys.exit(4)
    slug = re.sub(r'[^a-z0-9]+', '_', unicodedata.normalize('NFKD', a.tema.lower()).encode('ascii', 'ignore').decode()).strip('_') or 'imagem'
    os.makedirs(a.pasta, exist_ok=True)
    nome = f'{slug}.{ext}'; n = 2
    while os.path.exists(os.path.join(a.pasta, nome)): nome = f'{slug}_{n}.{ext}'; n += 1
    open(os.path.join(a.pasta, nome), 'wb').write(dados)
    cat_arq = os.path.join(a.pasta, 'catalogo.json')
    cat = json.load(open(cat_arq, encoding='utf8')) if os.path.exists(cat_arq) else []
    cat.append({'arquivo': nome, 'temas': [a.tema], 'descricao': a.descricao, 'fonte': a.fonte, 'url': a.url, 'origem': 'web'})
    json.dump(cat, open(cat_arq, 'w', encoding='utf8'), ensure_ascii=False, indent=2)
    print(f'ok: {nome} ({d[0]}x{d[1]}) registrado em {cat_arq} com tema "{a.tema}"')

main()
