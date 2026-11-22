#!/usr/bin/env python3
"""Varre todo texto do .pptx (slides, layouts, graficos) atras de caracteres vetados: travessao, meia-risca, sinal de menos, ponto medio.
Imprime um achado por linha; saida vazia = limpo. Uso: python3 -I vetos_texto.py deck.pptx"""
import sys, re, zipfile
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass
VET = {'\u2014': 'travessao', '\u2013': 'meia-risca', '\u2212': 'sinal de menos', '\u00b7': 'ponto medio', '\u2015': 'barra horizontal', '\u2012': 'risca numerica', '\u2022': 'bolinha usada como separador'}
def main(arq, so_slides=False):
    out = []
    with zipfile.ZipFile(arq) as z:
        for n in sorted(z.namelist()):
            if not re.match(r'ppt/(slides|charts)/[^/]+\.xml$', n): continue
            x = z.read(n).decode('utf8', 'ignore')
            for m in re.finditer(r'<(?:a:t|c:v)>([^<]*)</(?:a:t|c:v)>', x):
                tx = m.group(1)
                if tx.startswith('[') and ('LOGO' in tx or 'IMAGEM' in tx or 'MOCKUP' in tx or 'VIDEO' in tx): pass
                for ch, nome in VET.items():
                    if ch in tx:
                        if ch == '\u2022' and not re.search(r'\S\s*\u2022\s*\S', tx): continue   # bolinha de lista nao e separador
                        out.append(f'  {n.split("/")[-1]}: {nome} em "{tx[:70]}"')
    print('\n'.join(out))
if __name__ == '__main__': main(sys.argv[1])
