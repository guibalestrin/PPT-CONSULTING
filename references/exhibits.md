# Exhibits de referência (`scripts/exhibits.js`)

Leia **sempre que for montar o miolo**, depois de `gramatica.md`. São as peças no formato exato dos decks de referência, já na densidade certa (corpo 9pt, legenda 8pt, micro 7pt). Ficam em `deck.formas` junto com `formas.js` e `elementos.js`. Todas recebem `(slide, { ... })`, medidas em polegadas; `runs` = string ou runs do pptxgenjs (`{ text, options: { bold: true } }`).

Não são moldes de slide: cada uma resolve **uma função** da informação (`gramatica.md`, seção 4). O slide é a combinação que o conteúdo pedir.

## 1. Gráfico nativo com acabamento de referência

```javascript
const p = f.grafico(s, { tipo: 'colunas', x: a.x, y: a.y, w: a.w, h: a.h, categorias: ['2021', '2022', '2023'],
  series: [{ nome: 'Receita (R$ Mi)', valores: [520, 640, 760] }], folgaTopo: 0.25 });
f.colcheteCagr(s, { x1: p.cx(0), x2: p.cx(2), y: p.yTopo + 0.1, y1: p.cy(520), y2: p.cy(760), rotulo: 'CAGR 21%' });
```

| Parâmetro | O que faz |
|---|---|
| `tipo` | `'colunas'`, `'empilhado'`, `'empilhado100'`, `'barras'` (horizontais), `'barrasEmpilhadas'`, `'linha'`, `'area'`, `'rosca'`, `'combo'` (colunas + série com `tipo: 'linha'`) |
| `series` | `[{ nome, valores, cor?, tipo?: 'linha', tracejada? }]`. Sem `cor`, recebem dominante, destaque, escuro, cinza, nesta ordem. Par ou apoio: passe `cor: 'A6A6A6'` |
| `destaque: [i]` | Essas categorias ficam na cor; as outras, em cinza (a empresa entre os pares) |
| `projecaoDe: i` | Da categoria `i` em diante a série fica em tom claro (projeção) |
| `totais: true` | Em `'empilhado'`: total em negrito acima de cada coluna |
| `folgaTopo` | Fração extra do eixo reservada em cima para colchete e notas (0,2 a 0,35) |
| `max`, `min`, `formato`, `formatoLinha`, `legenda`, `gap`, `suave`, `rotulos`, `rotuloMin`, `layout`, `opcoes` | Ajustes finos; `opcoes` passa opções cruas do pptxgenjs |

Já vem com: sem eixo de valores e sem grade, eixo de categorias em fio cinza, textos 8pt, legenda pequena em cima, rótulo direto no dado (dentro e branco nas empilhadas, em cima nas simples, em caixinha na cor nas linhas), segmento pequeno sem rótulo, área translúcida. Cores chapadas, como em 9 dos 13 decks; para degradê vertical (M&A Bunge, Orizon), passe o estilo da série em `deck.finalizar` (`graficos.md`).

**Devolve `plot`**: `{ cx(i), cy(v), x0, x1, yTopo, yBase, passo }` em polegadas (em `'combo'`, também `cy2(v)` para a linha; em barras horizontais, `cy(i)` e `cx(v)`). Toda anotação sobre o gráfico é posicionada com ele. Nomes de série repetidos no deck são aceitos.

Cascata, dispersão e bolhas: `s.addChart` direto (receita em `graficos.md`), com o mesmo acabamento.

## 2. Camada de anotação

| Função | Quando usar | Parâmetros |
|---|---|---|
| `colcheteCagr` | Taxa entre dois pontos de uma série de colunas | `x1, x2` (centros: `p.cx`), `y` (altura do colchete), `y1, y2` (topos: `p.cy(valor)`), `rotulo`, `estilo: 'pinos'` (tracejado, Kepler/M&A) \| `'pilula'` (cheio com etiqueta, Nubank/Rede D'Or), `folga?=0.2` |
| `nota` | A leitura presa a um dado | `x, y, w, h, runs, alvo?: { x, y }`, `estilo: 'tracejada'` \| `'cinza'` \| `'escura'` \| `'clara'`, `ponta: 'seta'` \| `'ponto'` \| `'losango'` \| `'nenhuma'` |
| `elipse` | Circular o resultado numa tabela ou um ponto | `x, y, w, h, cor?` |
| `marcoEvento` | Evento sobre a série | `x` (`p.cx(i)`), `y0, y1`, `rotulo`, `lado?` |
| `linhaRef` | Média, custo de capital, valor justo | `x, y, w` (horizontal) ou `x, y, h` (vertical), `rotulo`, `cor?` |
| `faixaConclusao` | Leitura do bloco inteiro, no pé | `x, y, w, h?=0.3, runs, estilo: 'cor'` \| `'escura'` \| `'clara'` \| `'cinza'` |
| `conectorZoom` (`elementos.js`) | Total → detalhe | `de: {x,y,w,h}, para: {x,y,w,h}, lado?` (desenhe antes do painel de detalhe) |
| `faixaPeriodo` (`elementos.js`) | Período sombreado atrás do gráfico (desenhe antes do gráfico) | `x, y, w, h, rotulo` |

Ordem de desenho: `faixaPeriodo` → gráfico → colchete, notas, elipse, marcos.

## 3. Tabelas (nativas, editáveis no PowerPoint)

| Função | Quando usar | Parâmetros |
|---|---|---|
| `tabela` | Ver estilos abaixo | `x, y, w, cabecalho?, linhas, larguras?, estilo, hLinha?=0.22, fonte?=8, totais?: [i], subitens?: [i], destacar?: [i], colDestaque?: j, projecaoDe?: j, alinhar?, casas?, unidade?` |
| `sensibilidade` | Mapa de calor de duas premissas | `x, y, w, h, colunas: { rotulo, valores }, linhas: { rotulo, valores }, celulas: [[..]], base: [i, j], formato?: (v) => string` |
| `premissas` | Rótulo \| valor em chip \| comentário | `x, y, w, itens: [{ rotulo, valor, nota? }], titulos?: ['Premissas', 'Comentários'], hLinha?=0.26, wRotulo?, wValor?=0.85` |

Estilos de `tabela`:

- `'financeira'` (DRE, fluxo, sinergia): cabeçalho na cor escura com texto branco; linhas com fio claro; `totais` em negrito com fio em cima; `subitens` recuados em cinza; números negativos viram "(12)"; `destacar` pinta a linha-resultado; `projecaoDe` sombreia as colunas projetadas.
- `'limpa'` (ranking, deals, comps, mitigantes): cabeçalho em negrito com fio escuro embaixo; linhas com fio claro; sem preenchimento; `colDestaque` para a coluna-conclusão ("Pro Forma").
- `'faixa'` (comparativos com muitas colunas): cabeçalho cinza escuro, linhas zebradas.
- `'rotuloValor'` (key financials, WACC, term sheet): 2 colunas, rótulo à esquerda, valor em negrito à direita, zebra `F2F2F2`; sem cabeçalho.

Tabela não é enchimento: entra quando há 3+ itens com 2+ atributos, ou uma demonstração. Uma tabela por bloco; altura = `(linhas + 1) × hLinha`.

## 4. Diagramas de análise

| Função | Quando usar | Parâmetros |
|---|---|---|
| `footballField` | Faixas de valor por metodologia | `x, y, w, h, itens: [{ rotulo, min, max, cor?, comentarios?: [string] }], eixo: { min, max, passo? }, referencia?: { valor, rotulo }, titulos?: ['Equity value (R$ Mi)', 'Comentários']` |
| `matrizRisco` | Probabilidade x impacto | `x, y, w, h, riscos: [{ id, prob: 0..1, impacto: 0..1, cat? }], estilo: 'grade'` (Vibra) \| `'eixos'` (Vivara), `eixos?` |
| `listaCategorias` | Itens por categoria ao lado da matriz | `x, y, w, categorias: [{ titulo, itens: [[id, texto]] }], estilo: 'fio'` \| `'faixa'`, `destaque?: id` |
| `equacao` | Como um número é formado | `x, y, w, h?=0.7, termos: [{ titulo, valor?, sub? }], ops: ['×', '−', '='], estilo: 'cinza'` \| `'escura'` \| `'tracejada'` |
| `linhaTempo` | Marcos da história | `x, y, w, marcos: [{ ano, runs }], alternar?` (texto acima e abaixo, para 5+ marcos) |
| `cenarios` | Pessimista, base, otimista | `x, y, w, h, cenarios: [{ titulo, cor?, itens: [string], resultado?: { rotulo, valor, nota? } }]` |
| `cadeia` | Cadeia de valor ou processo | `x, y, w, etapas: [{ rotulo, icone?, destaque? }], grupos?: [{ de, ate, rotulo }]`. `destaque: true` = onde a empresa atua (escuro); `false` = fora do escopo (claro) |
| `treemap`, `estruturaAcionaria`, `caixaFormula`, `fasesDegrau`, `cardsTracejados` (`elementos.js`) | Share; sócios → empresa; fórmula; fases | assinaturas em `referencias.md`, seção 4 |

## 5. Texto estruturado e prova externa

| Função | Quando usar | Parâmetros |
|---|---|---|
| `painel` | Recipiente cinza de um aprofundamento (devolve a área interna) | `x, y, w, h, titulo?, estilo: 'etiqueta'` (rótulo na cor no canto) \| `'faixa'` (fio grosso em cima + título centrado) |
| `listaPinos` | 3 a 5 fatos ou razões em fio vertical | `x, y, w, itens: [runs \| { runs, sub }], passo?=0.44` (`sub` = linha derivada, ex.: "Taxa = 5x CDI") |
| `numeroTexto` | Um dado-síntese ao lado do exhibit | `x, y, w, valor, runs, pt?=20`. No máximo 1 ou 2 por bloco; nunca em série (viraria card de KPI) |
| `tiraFatos` | 3 a 5 números no pé do slide ou sob um diagrama | `x, y, w, h?=0.5, itens: [[valor, rotulo]]` |
| `citacao` | Fala de executivo ou especialista | `x, y, w, h, foto?, nome, cargo, fala, lado?`. Sem foto autorizada fica o placeholder; não baixe foto de pessoa |
| `recorte` | Notícia como prova | `x, y, w, h, veiculo` (texto ou `{ caminho }` da logo), `manchete, resumo, data?` |
| `abas` | Dois a quatro temas lado a lado (devolve `[{ x, w }]`) | `x, y, w, itens: [string]` |
| `icone` | Ícone de **linha**, pequeno, uma cor | `x, y, d?=0.3, nome: 'tb/TbTruck'`, `cor?`. Famílias: `tb` (Tabler), `lu` (Lucide), `fi` (Feather). Só onde identifica algo físico (etapa, ativo); nunca em círculo colorido nem em grade de cards. Sem `react-icons`/`sharp` no ambiente, vira placeholder `[ICONE: ...]` |

## 6. Receitas de combinação (exemplos, não moldes)

- **Gráfico + leitura lateral**: `grafico` em 60 a 65% da largura do bloco; ao lado, `nota` apontando o dado e `numeroTexto` embaixo dela.
- **Premissas → fluxo → resultado**: `premissas` à esquerda do gráfico; `tabela` financeira embaixo; `elipse` no resultado; `sensibilidade` ao lado.
- **Snapshot da empresa**: `deck.grade({ colunas: [[1], [0.36, 1, 1]], larguras: [1, 3.1] })`: coluna com `painelAba` (texto, `estruturaAcionaria`, `tabela` `rotuloValor`), faixa com `linhaTempo`, e dois níveis de gráficos com `deck.cabecalho(s, x, y, w, cab, sub, 'texto')`.
- **Risco**: `matrizRisco` + `listaCategorias` num bloco; a cadeia ou um gráfico do risco principal no outro; `tabela` limpa de mitigantes.
- **Valuation**: `footballField` com comentários em cima; `equacao` + `tiraFatos` + `cenarios` embaixo.

Sub-blocos dentro de uma área: `deck.cabecalho(s, x, y, w, cab, sub, estilo)` desenha o cabeçalho em qualquer ponto e devolve a altura usada (~0,45); o exhibit começa logo abaixo.

## 7. Armadilhas

- **Runs compartilhados**: o pptxgenjs altera os objetos de opções. `moldura.js` já clona os runs em todo `s.addText`; se você chamar `pres` direto em outro lugar, crie o objeto de novo a cada uso.
- **Rótulos decimais**: a prévia mostra ponto decimal nos rótulos do gráfico; no PowerPoint em português vira vírgula. Avise na entrega.
- **Anotação fora do lugar** é pior que nenhuma: confira na imagem renderizada se o pé do colchete e a ponta da nota caem no dado.
- **Altura mínima** de um gráfico com legenda e rótulos: ~1,5 pol; abaixo disso, tire a legenda (`legenda: false`) ou mude a divisão.
