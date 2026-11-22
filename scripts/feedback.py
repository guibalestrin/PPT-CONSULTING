#!/usr/bin/env python3
"""feedback.py -- registra a resposta do usuario a previa de cada slide (fluxo slide a slide).

Uso:
  py feedback.py --slide 4 --status aprovado
  py feedback.py --slide 4 --status ajustar --comentario "o quadrante da direita ficou vazio; trocar a tabela por grafico"
  py feedback.py --resumo            (mostra o que ja foi aprovado e o que foi pedido)

Grava uma linha por resposta em feedback_slides.jsonl, ao lado do deck. Esse arquivo e o dado de aprendizado da skill:
o comentario vai LITERAL (palavras do usuario, sem resumir), junto com o titulo e as decisoes do slide (registro_decisoes.json).
Nao e entregue ao usuario.
"""
import argparse, json, os, sys, datetime
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

ap = argparse.ArgumentParser()
ap.add_argument('--slide', type=int)
ap.add_argument('--status', choices=['aprovado', 'ajustar', 'reprovado'])
ap.add_argument('--comentario', default='')
ap.add_argument('--titulo', default='')
ap.add_argument('--rodada', type=int, help='quantas vezes este slide ja foi mostrado (1 = primeira previa)')
ap.add_argument('--pasta', default='.')
ap.add_argument('--resumo', action='store_true')
a = ap.parse_args()
arq = os.path.join(a.pasta, 'feedback_slides.jsonl')

if a.resumo:
    linhas = [json.loads(l) for l in open(arq, encoding='utf-8')] if os.path.exists(arq) else []
    ult = {}
    for l in linhas: ult[l['slide']] = l
    for s in sorted(ult):
        l = ult[s]; print(f"slide {s}: {l['status']} (rodada {l.get('rodada') or '?'})" + (f" | {l['comentario']}" if l['comentario'] else ''))
    print(f"{sum(1 for l in ult.values() if l['status'] == 'aprovado')} aprovado(s) de {len(ult)} mostrado(s); {len(linhas)} resposta(s) no total")
    sys.exit(0)

if not a.slide or not a.status: ap.error('informe --slide e --status (ou --resumo)')
rodada = a.rodada
if rodada is None and os.path.exists(arq):
    rodada = 1 + sum(1 for l in open(arq, encoding='utf-8') if json.loads(l).get('slide') == a.slide)
decisao = None
reg = os.path.join(a.pasta, 'registro_decisoes.json')
if os.path.exists(reg) and a.titulo:
    try: decisao = next((d for d in json.load(open(reg, encoding='utf-8')) if d.get('mensagem') == a.titulo or d.get('slide') == a.titulo), None)
    except Exception: decisao = None
reg_l = {'data': datetime.datetime.now().isoformat(timespec='seconds'), 'slide': a.slide, 'status': a.status, 'rodada': rodada or 1,
         'comentario': a.comentario, 'titulo': a.titulo,
         'arranjo': (decisao or {}).get('arranjo'), 'divisao': (decisao or {}).get('divisao'), 'formas': (decisao or {}).get('formas')}
with open(arq, 'a', encoding='utf-8') as f: f.write(json.dumps(reg_l, ensure_ascii=False) + '\n')
print(f'registrado: slide {a.slide} {a.status} (rodada {reg_l["rodada"]})')
