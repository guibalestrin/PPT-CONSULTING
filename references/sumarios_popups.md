> Regra vigente (15/11/2026): um único modelo e fundo de sumário em todo o deck; paleta fixa 60/30/10; título 26pt e subtítulo 14pt, sem reduzir fonte. As composições de `contraexemplos_huawei.md` são vetadas; `faixasNumeradasArco` não pode ser usada no modo Insper Jr. Exemplos legados abaixo não substituem estas regras.

# Sumários e pop-ups (formato dos decks de referência)

Aprendido dos 12 PDFs (M&A Bunge×Kepler, Nubank, Tech, Vivara, Agrion, Kepler, Vibra, Hermès) e do PPTX anexo. Não são moldes de slide: são peças. Escolha o estilo pelo deck e use um estilo por projeto (varie entre projetos).

## 1. Sumários

Os sumários que o usuário separou estão em `assets/referencias/sumario/`: agrion_p002 (pílulas de contorno fino), mabg_p002 (paralelogramos inclinados), tech_p004 (itens com quadrado romano sobre fundo escuro) e kepl3_p010 (forma grande + itens com círculo romano) são de mercado; ijg5_p002 e ijg7_p002 são Insper Jr (numeral em hexágono e arco ligando as barras). Abra 2 antes de cada `deck.sumario` (`sortear_referencias.py --sumario --n 2`); o estilo desenhado sai do sorteio do deck.

Regra de todas as referências: **o item da vez fica aceso e os outros esmaecidos** (cinza claro, nunca outra cor). O mesmo sumário reaparece antes de cada seção com o item seguinte aceso. Numeral romano (I, II) ou 01/02/03; contorno fino; sem cartão arredondado e sem ícone em círculo colorido.

| Tipo | Referência | Chamada |
|---|---|---|
| Transição de seção | M&A "Presentation Index", Agrion "Sumário" | `deck.sumario('Setor', { estilo })`: lista as seções do deck e acende a atual |
| Pilares da tese | Nubank "Growth Pillars", Vivara "Investment Summary", M&A "Deal Rationales" | `deck.sumario(secao, { estilo, titulo, apoio, itens: [{ titulo, desc, icone? }], ativo })`; `ativo: null` = todos acesos (1ª aparição) |
| Índice | Nubank/Vivara "Presentation Summary / Appendix index" | `deck.indice(secao, { titulo, grupos: [{ titulo, itens: [{ texto, slide }] }], colunas })`; cada item vira link para o slide (`slide` = número final) |
| Resumo executivo | M&A p. 3 | `deck.resumoExecutivo(secao, { titulo, conclusoes: [f1, f2], itens: [{ cab, sub, desenhar(s, area) }] })`: 2 ou 4 mini-exhibits numerados, uma frase-conclusão em negrito sobre cada faixa. É slide de conteúdo: exige `deck.decidir` |
| Recomendação | Nubank p. 39 | monte com `tiraFatos`/`numeroTexto`/`faixaConclusao` (preço atual, alvo, upside, TIR, MOIC) |

Estilos de `estilo` (todos **slide cheio, na cor fixa escolhida da paleta do projeto**: `fundo: 'escuro' (padrao) | 'claro' | 'dominante' | 'destaque' | hex`, `fundo2` para degrade, ou `fundoSumario` no config; em `scripts/sumario_cores.js`):
- `'circulos'`: numerais romanos em circulos de contorno fino, escalonados. Vetado em 22/11/2026 e **liberado de novo em 23/11/2026**: o sumario Audemars Piguet (circulos + foto recortada a direita com fio e faixa da logo, `fotoDireitaFio`) foi aprovado como "perfeito". Referencia: `aprovado_ap_circulos_foto.jpg`.
- `'pilulas'` (Agrion p002): pilulas de contorno fino escalonadas, circulo com numeral a esquerda.
- `'paralelogramos'` (M&A / mabg p002): barras inclinadas escalonadas, numeral e titulo em italico; aceita `imagem` de fundo (escurecida).
- `'cartoes'` (Vivara p007): ate 5 cartoes retos 01/02/03 lado a lado; o da vez em branco, os demais so contorno.
**Composição e moldura (23/11/2026):** a foto do assunto entra em `fotoEsquerda`, `fotoDireita` ou `fotoFundo` (sorteado; sem foto, `cheio`), sempre dissolvida no fundo por degradê, sem corte seco. Título "Sumário" (esquerda, centro, direita ou nenhum), fios em cima e embaixo e logo de quem apresenta são opcionais e sorteados uma vez por deck (`molduraSumario`). A logo da empresa analisada (`logos.analisada`) fica sobre a foto, numa sombra em degradê, sem faixa recortada (exceto em `fotoDireitaFio`, so com circulos, que e a montagem aprovada do AP com faixa escura). Reprovados: pilulas + foto recortada (Bluefit) e paralelogramos sobre foto de produto em tela cheia (AP fotoFundo); prints em `assets/contraexemplos/sumario_reprovado_*.png`. Referências: kepl3_p010 e ex_sumario (imagem à esquerda), mabg_p002 (foto de fundo), agrion_p002 (título grande à direita), tech_p004 (sem fios).
Item da vez na cor de texto cheia com contorno grosso; os demais na dominante ajustada ao fundo (contraste >= 4 em fundo escuro, >= 3 em fundo claro). Sem `estilo`, `deck.sumario` reutiliza o modelo único salvo no projeto. Só o item ativo muda; paleta, fundo, posições e tipografia permanecem. A lista vem de `fluxos.js`.

Slides de seção escuros só com título (Appendix, Q&A) seguem o padrão de divisores da capa; não são sumário.

## 2. Pop-ups (painel emoldurado sobre o slide esmaecido)

Usado para **aprofundar um ponto sem sair do slide** (Agrion p. 5, 10, 16, 24; M&A "sem × com"). Sempre sobre um slide já montado, que fica visível por trás.

```js
const s = deck.novoSlide('Tese');  /* ...monte o slide normal... */
const [a, b] = deck.popup(s, { paineis: [
  { x: 0.95, y: 1.7, w: 5.6, h: 4.0, titulo: 'Área potencial (mi ha)', subtitulo: 'A área agrícola deve continuar crescendo' },
  { x: 6.9,  y: 1.7, w: 5.7, h: 4.0, titulo: 'Custo de produção (US$/acre)' }] });
deck.formas.grafico(s, { x: a.x, y: a.y, w: a.w, h: a.h, ... });   // desenhe dentro das áreas devolvidas
```
Formato fixo: véu branco ~84% sobre o slide inteiro (inclusive cabeçalho); painel branco com contorno preto 1,25pt; **sombra dura cinza** deslocada 0,1" para baixo e para a direita; **aba de título** na cor, sobre a borda de cima, texto branco em negrito 9,5pt, ponta cortada na diagonal (`diagonal: false` desliga). `subtitulo` = frase em negrito centralizada com fio embaixo (Agrion p. 10). `cor: 'escuro'` usa a cor escura na aba.
Regras: 1 ou 2 painéis (nunca 3), conteúdo de 2 a 3 itens ou 1 exhibit, mesma gramática do corpo (9/8pt). Se o ponto aprofundado está num exhibit atrás, ligue com `formas.conectorZoom`. Não use pop-up em slide que já está cheio de anotações; o pop-up é a atração do slide.

## 3. Esmaecer, revelar, faixa-pergunta

- `deck.esmaecer(s, rect?, nivel)`: véu sobre o slide ou sobre um retângulo.
- `deck.destacar(s, rects, ativo, nivel)`: **revelação progressiva** (Kepler, M&A "Deal Rationales"). Duplique o slide N vezes (função que desenha o slide + `destacar` com o bloco da vez) para o orador "abrir" um bloco por vez. Só use quando o deck for apresentado; em deck de leitura vira repetição.
- `deck.faixaPergunta(s, 'Pergunta?', { estilo: 'cinza' | 'cor' })`: **transição entre blocos de argumento** (Kepler p. 32: faixa cinza e texto grande; Nubank: faixa na cor, itálico branco, `*palavra*` em negrito). Desenhe o slide anterior numa função, chame-a de novo e aplique a faixa: o slide seguinte responde à pergunta. Máximo 1 a 3 por deck.

## 4. O que não fazer
- Sumário igual em todas as seções sem o item aceso mudando.
- Cartões arredondados com ícone em círculo (ver `cartoes`: retos, ícone de linha no pé).
- Pop-up sem véu, sem sombra dura ou sem aba; pop-up com 3+ painéis.
- Faixa-pergunta em todo slide (perde o efeito).
- Índice sem links: `slide` aponta o número final do slide.

## 5. Ainda não implementado
Pop-up em mockup de tablet/busca e nota-pop-up dentro de gráfico. 

## Validação do sumário

Executar `node scripts/validar_sumarios.js` para verificar as 35 geometrias suportadas. O build rejeita troca de modelo ou fundo dentro do deck; o QA confere sobreposição de contêineres, fontes fixas e famílias de cor dos preenchimentos nativos. A revisão renderizada continua obrigatória para conferir o texto, as relações visuais e os quatro contraexemplos Huawei. Proporção 60/30/10 deve ser julgada visualmente no conjunto; o código não afirma medir uma porcentagem exata de pixels.
