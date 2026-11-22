# Barra lateral

A barra e o elemento de assinatura do deck. `moldura.js` ja implementa **sete estilos (A, B, E, F, G, H, I)**, todos no sorteio. **Nao ha estilo padrao: a cada projeto novo o estilo e sorteado** entre os implementados (veja `estiloDaBarra()` em `moldura.js`; o sorteado fica em `estilo_barra.txt` na pasta do projeto). Todo estilo novo que for acrescentado ao objeto `BARRAS` entra no sorteio automaticamente. Leia este arquivo so para criar outro estilo do catalogo ou quando o usuario nomear um.

## Regras comuns (das referencias do usuario)

- Altura total do slide; base com largura minima de 0,5 pol (cobre o numero da pagina)
- **A barra nao precisa ser um retangulo.** O contorno direito e organico e pode avancar ate ~0,74 pol (titulo em x 0,9: pelo menos 0,15 de folga) com diagonais, ondas, lobulos, serrilhado, concavidades, bolhas ou curvas que seguem soltas para fora. **Nunca corte as formas numa linha vertical reta so para caber numa faixa fixa**: cada estilo tem a silhueta propria (veja a descricao de cada um)
- 3 a 6 camadas da mesma familia de cor (tons claros e escuros das cores do briefing; sem matizes novos)
- Degrade vertical em pelo menos uma camada; ao menos um elemento de movimento (diagonal, curva, onda)
- Opcional: 1 a 3 linhas finas brancas (0,5 a 1,25pt)
- **Nenhuma curva termina seca na lateral direita**: continue o desenho para fora da barra ate sair pela borda do slide, formando uma pequena bolha. Curva que encosta tangente na lateral e para deixa um "degrau" que parece corte
- Base escura nos ultimos ~1,5 pol, para o numero da pagina (branco) ter contraste
- Uma composicao por deck, identica em todos os slides

## Catalogo

- **A. Facetas low-poly** (implementado): triangulos e trapezios diagonais claros e escuros sobre base em degrade; contorno em cristal, com vertices em larguras diferentes
- **B. Brilho com riscos** (implementado): degrade forte (ex.: amarelo -> preto -> amarelo), faixas de luz diagonais e varias linhas finas paralelas no topo; lamina com borda direita diagonal e um risco que escapa para fora
- **E. Chevrons** (implementado): faixas em V alternando tons (verde-limao, medios, escuros), cortadas por um contorno ondulado; sem pontas de seta ou triangulos saindo
- **F. Camadas que esmaecem** (implementado): nucleo opaco em degrade (cor forte no topo, base escura) com borda ondulada e quatro camadas externas em onda, cada vez mais claras e transparentes, ate quase branco
- **G. Curva com contorno** (implementado): bolha clara no topo avancando para a direita com contorno branco; degrade claro -> dominante -> escuro; fuso vertical de brilho; curva longa com contorno branco + linha fina paralela separando a base quase preta, saindo pela borda inferior ate x ~0,74
- **H. Fuso concavo com borda** (implementado): faixa central com bordas concavas, degrade claro -> escuro, borda escura fina dos dois lados; a lateral direita se estreita no meio e uma linha de contorno segue solta ao lado
- **I. Linhas de contorno** (implementado): borda ondulada, curvas finas paralelas dentro e fora da base (saem pelo topo e pela base do slide) e uma faixa de luz acompanhando a onda

## Acrescentando um estilo ao sorteio

O jeito mais simples e acrescentar um metodo (ex.: `K(s) { ... }`; as letras C, D e J foram descartadas pelo usuario e nao devem ser recriadas) ao objeto `BARRAS` em `moldura.js`: ele entra no sorteio sozinho. Use os auxiliares `caminho` (aceita `corLinha` para linhas coloridas), `cub`, `amostra(f, y0, y1)` (pontos de um contorno x = f(y)) e `retBarra`, as constantes `BASE` (0,5) e `XMAX` (0,74), registre os degrades em `GRAD.BL_*` e renderize um zoom da faixa esquerda antes de dar o estilo como pronto.

## Criando outro estilo so para um projeto (`estiloBarra: 'custom'`)

Passe `barraCustom: (s, { caminho, cub, W, H, COR, GRAD, tom }) => { ... }` no config do `moldura.js`:

- `caminho(s, nome, pontos, { fechar, cor, linha, corLinha, transp })`: forma vetorial na caixa `x 0..W+0,5`, `y 0..7,5`. Pontos: `[x, y]` ou `cub(x, y, x1, y1, x2, y2)` (curva cubica). `fechar: true` + `cor` = forma cheia; sem `fechar` + `linha` = contorno (branco, ou a cor de `corLinha`)
- Nomes: `BL_*` para tudo; contornos e linhas finas com prefixo `BL_linha` (preservam o traco)
- Degrades: `GRAD.BL_nome = { ang, stops: [[pos%, cor, opacidade%], ...] }` (ang 90 = cima->baixo)
- `W` = 0,62 (largura), `H` = 7,5; o numero da pagina fica em y ~7,1, centralizado em W
- Desenhe da camada de tras para a da frente; confira num zoom de alta resolucao da faixa esquerda (topo e base)
