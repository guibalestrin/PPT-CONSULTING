#!/usr/bin/env python3
"""sortear_referencias.py -- sorteia quais slides de referencia abrir com Read, para que o estudo mude a cada execucao.

A biblioteca e a PASTA ./referencias (copia de assets/referencias). O sorteio le as subpastas, entao o que esta em cada pasta
e exatamente o que pode sair. Nao ha lista escondida no codigo: mover um slide de pasta muda o sorteio.

  referencias/insper_jr/<tipo>/             padrao Insper Jr, por TIPO DE INFORMACAO (diagnostico, publico, canais, financeiro...)
  referencias/mercado_financeiro/<estrutura>/  decks de mercado financeiro, por ESTRUTURA DE ORGANIZACAO (inspiram o arranjo, nunca o assunto)
  referencias/sumario/                      sumarios e transicoes

Uso (na pasta de trabalho):
  python3 -I sortear_referencias.py --inicial                      # 5 Insper Jr (theo, g5, g7, case) + 2 estruturas de mercado
  python3 -I sortear_referencias.py --tipo canais --n 3            # 3 Insper Jr do tipo "canais"
  python3 -I sortear_referencias.py --estrutura caixa_esquerda_elementos_direita --n 2
  python3 -I sortear_referencias.py --tipo publico --estrutura blocos_numerados_lado_a_lado   # 2 de cada pasta (use --n para mudar)
  python3 -I sortear_referencias.py --sumario --n 2
  python3 -I sortear_referencias.py --tipos                        # lista todas as pastas, com quantidade
  python3 -I sortear_referencias.py --listar canais                # lista os arquivos de uma pasta

Os sorteados ficam em referencias_vistas.txt e nao se repetem ate a pasta acabar. Abra TODAS as imagens com Read e cite os ids
(nome do arquivo sem .jpg) em deck.decidir({ referencias: [...] }). Sortear nao dispensa olhar.
"""
import argparse, os, random, sys

ap = argparse.ArgumentParser()
ap.add_argument('--inicial', action='store_true'); ap.add_argument('--tipo'); ap.add_argument('--estrutura')
ap.add_argument('--sumario', action='store_true'); ap.add_argument('--n', type=int, default=2)
ap.add_argument('--tipos', action='store_true'); ap.add_argument('--listar'); ap.add_argument('--pasta', default='referencias')
a = ap.parse_args()
if not os.path.isdir(a.pasta): sys.exit(f'pasta "{a.pasta}" nao encontrada: cp -r <skill>/assets/referencias ./referencias')

# pasta -> [(id, caminho)]
PASTAS = {}
for raiz, _, fs in os.walk(a.pasta):
    jpgs = sorted(f for f in fs if f.lower().endswith('.jpg'))
    if jpgs:
        rel = os.path.relpath(raiz, a.pasta).replace(os.sep, '/')
        PASTAS[rel] = [(f[:-4], os.path.join(raiz, f)) for f in jpgs]
def grupo(rel): return rel.split('/')[0]
def achar(nome, grupo_=None):
    c = [r for r in PASTAS if (r.split('/')[-1] == nome) and (grupo_ is None or grupo(r) == grupo_)]
    if not c: sys.exit(f'pasta "{nome}" nao existe; use --tipos')
    return c[0]

if a.tipos:
    for rel in sorted(PASTAS): print(f'{len(PASTAS[rel]):3d}  {rel}')
    sys.exit(0)
if a.listar:
    rel = achar(a.listar)
    for i, c in PASTAS[rel]: print(c)
    sys.exit(0)

vistas_arq = 'referencias_vistas.txt'
vistas = set(open(vistas_arq).read().split()) if os.path.exists(vistas_arq) else set()
def tirar(rel, n):
    todos = PASTAS[rel]
    novos = [x for x in todos if x[0] not in vistas] or todos
    random.shuffle(novos)
    # decks diferentes primeiro (prefixo antes do _p)
    sel = []
    for x in novos:
        if x[0].split('_')[0] not in [y[0].split('_')[0] for y in sel]: sel.append(x)
    sel += [x for x in novos if x not in sel]
    return sel[:n]

escolha = []
if a.inicial:
    ij = [x for r in PASTAS if grupo(r) == 'insper_jr' for x in PASTAS[r]]
    if not ij: sys.exit('nenhuma referencia Insper Jr em ' + a.pasta)
    for pref, k in (('ijtheo_', 2), ('ijg5_', 1), ('ijg7_', 1), ('ijcase_', 1)):
        c = [x for x in ij if x[0].startswith(pref) and x[0] not in vistas] or [x for x in ij if x[0].startswith(pref)]
        random.shuffle(c); escolha += c[:k]
    est = [r for r in PASTAS if grupo(r) == 'mercado_financeiro']; random.shuffle(est)
    for r in est[:2]: escolha += tirar(r, 1)
else:
    alvos = []
    if a.tipo: alvos += [achar(t.strip(), 'insper_jr') for t in a.tipo.split(',')]
    if a.estrutura: alvos += [achar(t.strip(), 'mercado_financeiro') for t in a.estrutura.split(',')]
    if a.sumario: alvos.append('sumario')
    if not alvos: sys.exit('informe --inicial, --tipo, --estrutura ou --sumario (ou --tipos para listar)')
    for r in alvos: escolha += tirar(r, a.n)
open(vistas_arq, 'a').write(' '.join(i for i, _ in escolha) + ' ')
for i, c in escolha: print(c)
