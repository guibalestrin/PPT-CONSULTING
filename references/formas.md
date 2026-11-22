> Regra vigente (15/11/2026): um único modelo e fundo de sumário em todo o deck; paleta fixa 60/30/10; título 26pt e subtítulo 14pt, sem reduzir fonte. As composições de `contraexemplos_huawei.md` são vetadas; `faixasNumeradasArco` não pode ser usada no modo Insper Jr. Exemplos legados abaixo não substituem estas regras.

# Biblioteca de formas do miolo (`scripts/formas.js`)

As formas abaixo vem do repertorio do usuario (`assets/framework_formas.pptx`, ja incorporado: cada forma virou uma funcao de `formas.js`; renderizadas em `assets/mostruario_formas.jpg`). **Para saber qual usar em cada tipo de conteudo, veja a tabela "Formas do framework" no `SKILL.md`.** Use as funcoes de `formas.js` em vez de desenhar do zero. Elas sao referencia, nao limite: combine, adapte e crie variacoes no mesmo espirito. Para uma variacao nova, escreva uma funcao nova no `build_deck.js` (use `deck.pres`, `deck.COR`, `formas.tom`, `formas.sombra`), sem editar `formas.js`.

> **Regra atual (2026-11-11, 2a rodada):** tabelas, setas/conectores, diagramas com formas e icones de linha estao **liberados no formato das referencias** (`gramatica.md`, `exhibits.md`). Continuam vetados: grafico de DADOS desenhado com formas (`barrasPirulito`, `barras100`, `ponteDecomposicao`), `listaFitas`, `setaCurva`, fio vertical antes do titulo do slide e os habitos de IA (`gramatica.md` secao 7). Todo grafico de dados e NATIVO (`formas.grafico` / `s.addChart`). As pecas no formato das referencias estao em `exhibits.md`; este arquivo cobre o repertorio proprio do usuario (`formas.js`), que continua valido e tem o texto reduzido automaticamente para a densidade de 9pt.

## O que evitar (cara de IA)

Retangulos arredondados lado a lado com numero grande em negrito e rotulo embaixo (cards de KPI); grade de caixas identicas; icone em circulo + texto em linhas (e icones em geral); retangulo com faixa colorida numa borda.

## O que da cara humana

- **Profundidade com sombra dura**: bloco solido deslocado atras da forma, faces 3D com o lado mais escuro, fitas que dobram para tras
- **Rotulos presos a forma**: etiqueta sobreposta a borda, fita saindo da caixa, linha-guia pontilhada com traco no fim
- **Sequencia visivel**: arco com pontos, chips hexagonais numa linha, numeros dentro de losangos ou hexagonos
- **Numero integrado a forma**, em tamanho contido, com o texto ao lado
- **Degrade que esmaece** na ponta das faixas
- Sombra suave so como acabamento leve (`formas.sombra()`)

Regras: nao ha limite de formas por slide; use quantas a mensagem pedir e combine-as pela melhor organizacao (divisao em quadrantes em `organizacao.md`); cores so da paleta (tons claros e escuros dela); fotos dentro das formas viram imagem da biblioteca (`deck.imagem`) ou placeholder; icones so de linha e so como nas referencias (SKILL.md secao 2).

## Catalogo e assinaturas

Todas as funcoes recebem `(slide, { ... })`; medidas em polegadas; `runs` = string ou array de runs do pptxgenjs (destaque: `{ text, options: deck.B }`). Parametros com `?` sao opcionais.

| Funcao | Quando usar | Parametros | Espaco de referencia |
|---|---|---|---|
| `faixasNumeradasArco` | VETADA no modo Insper Jr, composição Huawei 4 | Não chamar nem reconstruir | Usar outra estrutura positiva de etapas |
| `kpiLosango` | Um numero-chave (substitui card de numero grande) | `x, y, d?=0.72, valor, unidade, rotulo, nota, wTexto?=1.55` | ~0,8 x 2,6 pol |
| `gradeKpiLosango` | 2 a 6 KPIs em duas colunas defasadas com divisoria | `x, y, w, kpis: [{ valor, unidade, rotulo, nota }], passo?=0.86, defasagem?=0.2` | 6 KPIs em w 5,7: ~2,6 pol |
| `lajesEmpilhadas` | Hierarquia, camadas, 2 a 4 leituras de um dado | `x, y, w, itens: [[titulo, sub]], wLaje?=1.3, hLaje?=0.7, passo?=0.66` | 3 itens: ~2,0 pol |
| `piramide3D` | Niveis, prioridades, base x topo (3 a 4 niveis, do topo para a base) | `x, y, w, h, niveis: [rotulo], wPir?` | 3 niveis pedem h >= 2,4 |
| `funilPrismas` | Afunilamento, conversao (3 a 4 itens) | `x, y, w, itens: [[titulo, texto]], hItem?=0.62, gap?=0.12, wFunil?=1.5` | 3 itens: ~2,1 pol |
| `caixaEtiqueta` | Bloco de texto/imagem com titulo; devolve a area interna `{x,y,w,h}` | `x, y, w, h, etiqueta` | livre |
| `caixaFita` | Conclusao, destaque, nota | `x, y, w, h, fita, runs` | h ~1,0 |
| `cardAba` | Cards de conteudo (aba escura ou fita com pontas dobradas) | `x, y, w, h, titulo, runs, estilo?: 'barra' \| 'fita'` | livre |
| `molduraDeslocada` | Destacar imagem, grafico ou texto | `x, y, w, h, lado?: 'baixo' \| 'cima', cor?, colchete?, runs?` | livre |
| `chamadaConector` | "Ponto de atencao", tese -> explicacao | `x, y, w, h, wBloco?=1.55, rotulo, runs` | h ~1,1 |
| `chipsHexagonais` | Abas, dimensoes, etapas curtas, com uma ativa | `x, y, w, itens: [rotulo], ativo?=0, wChip?=1.45, hChip?=0.42` | 0,45 pol de altura |
| `marcadorHexagonal` | Numerar secao/bloco com numeral romano | `x, y, wLinha?=1.3, numeral` | pequeno |
| `cardsParalelogramo` | Etapas com foto (placeholder) | `x, y, w, h, itens: [[rotulo, descricaoDaFoto]]` | h ~2,0 |
| `cubosLinhasGuia` | 2 a 4 processos/componentes | `x, y, wTexto?=1.9, itens: [rotulo], lado?=0.75` | ~1,1 pol de altura |
| `tubosTampa` | Fluxos ou grandezas paralelas | `x, y, w, itens: [[rotulo, valorTexto]], hTubo?=0.42` | n x 0,42 pol |
| `colunasEquacao` | Proposta de valor A + B + C = resultado | `x, y, w, h, pilares: [[titulo, rotulo]], resultado, imagens?: [descricao]` (topo de cada coluna e placeholder de imagem) | h ~2,3 |
| `cartaoCitacao` | Fala de executivo/entrevistado | `x, y, w, h, citacao: [string \| { text, options }], nome, cargo` | h ~1,5 |
| `cardsLigados` | 2 a 4 cards em sequencia, costurados por circulos | `x, y, w, h, cards: [[titulo, runs]]` | livre |

Utilitarios: `formas.tom(hex, f)` (f > 0 clareia, f < 0 escurece), `formas.placeholder({ x, y, w, h, texto, nome })`, `formas.linhaGuia(slide, x1, y, x2)`, `formas.larguraTexto(txt, pt, negrito)`, `formas.sombra()`.

Degrades: formas com degrade recebem objectName `GR_*` e a especificacao vai em `formas.degrades`; `deck.finalizar()` aplica automaticamente. Numa forma nova sua, faca o mesmo: de um nome `GR_algo` e acrescente `formas.degrades.GR_algo = { ang, stops: [[pos%, cor, opacidade%], ...] }` (ang 0 = esquerda->direita, 90 = cima->baixo).

## Como cada forma e construida (para criar variacoes)

- **Faixas numeradas em arco**: arco fino cinza (custGeom aberto) com pontos; losango escuro com o numero sobreposto ao inicio de uma faixa arredondada (raio = metade da altura) com degrade horizontal que esmaece a direita
- **KPI em losango**: losango claro com losango escuro deslocado atras (borda-chevron); valor 14pt + unidade 8pt dentro; conector pontilhado ate rotulo e nota
- **Lajes empilhadas**: `CUBE` empilhados de baixo para cima, a de baixo mais larga, do escuro ao claro; linha-guia ate caixa da mesma cor
- **Piramide 3D**: camadas trapezoidais com face direita mais escura; cada camada continua numa faixa com ponta hexagonal
- **Funil de prismas**: prismas pentagonais decrescentes com faces de tons diferentes, ligados a barras longas
- **Caixa com etiqueta / fita / aba**: o rotulo e uma faixa preenchida sobreposta a borda, com sombra leve; a fita sai pela esquerda com triangulo de dobra
- **Moldura deslocada**: retangulo de cor deslocado atras de um retangulo branco com contorno; colchete pontilhado opcional
- **Bloco + conector**: bloco em degrade escuro, trapezio abrindo ate caixa de texto com moldura deslocada
- **Chips hexagonais**: `FLOWCHART_PREPARATION` sobre linha fina; ativo preenchido na cor forte
- **Cards paralelogramo**: `PARALLELOGRAM` claro sobre outro deslocado na cor dominante (borda grossa na direita/base)
- **Cubos / tubos**: cubos 3D sobrepostos com linhas para rotulos sublinhados; faixas empilhadas que terminam em ovais concentricas
- **Colunas-equacao**: faixa de titulos clara no topo, colunas em tons, "+" e "=" sobre as divisas
- **Cartao de citacao**: foto (placeholder) a esquerda, citacao em italico com palavras-chave em negrito na dominante, "Nome | Cargo"
- **Cards ligados**: cards com sombra dura deslocada e meias-luas concentricas aparecendo entre eles
