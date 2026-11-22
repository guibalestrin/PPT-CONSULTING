> Regra vigente (15/11/2026): um único modelo e fundo de sumário em todo o deck; paleta fixa 60/30/10; título 26pt e subtítulo 14pt, sem reduzir fonte. As composições de `contraexemplos_huawei.md` são vetadas; `faixasNumeradasArco` não pode ser usada no modo Insper Jr. Exemplos legados abaixo não substituem estas regras.

# Organizacao do deck e do miolo

Escolha a divisao pelo **peso de cada exhibit** (`gramatica.md` secao 3: o exhibit que prova a mensagem leva a maior area; use `pesos`, `alturas`, `larguras`), e varie entre slides vizinhos. **Nao ha limite de formas por slide**: use as que a mensagem pedir e organize da melhor maneira. Um slide, uma mensagem; mais de quatro blocos = dividir em dois slides.

## Estrutura do deck

O fluxo do escopo (`escopos` no config, `scripts/fluxos.js`) define as etapas: aparecem abaixo da linha divisoria de todo slide e geram `fluxo_<escopo>.md`. `deck.sumario(etapa)` lista as etapas do escopo da etapa.

1. `deck.capa(...)`
2. Para cada secao: `deck.sumario(secao)` e depois os slides da secao (`deck.novoSlide(secao)`)

## Capa

`deck.capa({ modelo, titulo, ... })`: ver `references/capas.md`. A estrutura de cada modelo e copiada literalmente das capas de referencia do usuario; sem barra lateral, linha divisoria, fluxo ou numero de pagina. `integrantes` e sempre perguntado ao usuario.

## Sumario / transicao

`deck.sumario(secao, { titulo?, descricoes?, imagem?, tema?, imagemDescricao? })`

Desenha um slide cheio em qualquer cor (`sumario_cores.js`; `fundo: 'escuro' | 'claro' | 'dominante' | 'destaque' | hex`; estilo sorteado dentro do conjunto do deck: circulos, pilulas, paralelogramos ou cartoes) com todos os topicos numerados e o da vez aceso; `imagem` vira foto de fundo com veu escuro (ou placeholder). O **fluxo do rodape destaca o mesmo topico** (o fluxo e desenhado em cada slide). `descricoes` (ou `descricoes` no config) acrescenta uma linha de apoio em cada topico. Coloque um sumario antes do primeiro slide de cada secao, inclusive a primeira.

## Divisao do miolo em quadrantes

Area util: x 0,9 a 12,73; y 1,3 a 6,36, com 0,34 pol entre colunas e 0,2 entre linhas (densidade das referencias). `deck.blocos(s, tipo, itens, opcoes)` divide, desenha os cabecalhos (com numeral romano e linha fina) e **devolve as areas internas** `{ x, y, w, h }` para preencher com formas, graficos, tabelas ou imagens.

```javascript
const [a, b, c] = deck.blocos(s, '1+2', [{ cab: 'Tese', sub: 'Conclusao' }, { cab: 'Prova 1' }, { cab: 'Prova 2', sub: '...' }]);
```

| Tipo | Divisao | Quando usar |
|---|---|---|
| `'1'` | um bloco | exhibit grande (grafico, tabela, mapa) + callout |
| `'2c'` | duas colunas (`pesos: [2, 1]` muda a proporcao) | comparacao; "o que e" e "onde atua"; grafico largo + coluna de leitura |
| `'3c'` / `'4c'` | tres ou quatro colunas | pilares, opcoes ou etapas |
| `'2f'` / `'3f'` | duas ou tres faixas empilhadas (`alturas`) | causa e efeito; fato e numero |
| `'2x2'` | quatro quadrantes | matriz, quatro fatores, quatro empresas |
| `'1+2'` | um bloco largo em cima, dois embaixo | tese em cima, duas provas embaixo |
| `'2+1'` | dois em cima, um largo embaixo | dois dados e a conclusao |
| `'L'` | bloco alto a esquerda + `n` empilhados a direita (`n: 2` ou `3`; `pesos` das larguras) | resumo/contexto + exhibits |
| `'Linv'` | `n` empilhados a esquerda + bloco alto a direita | exhibits + resumo |
| `'3+1'` | tres paineis em cima + faixa larga embaixo (`alturas` padrao `[1.6, 1]`) | tamanho e estrutura de mercado: um angulo por painel + a tendencia embaixo |
| `'Lc'` | coluna alta + `n` empilhados no meio + coluna alta (`pesos` padrao `[1, 1.15, 1]`) | overview da empresa: descricao \| numeros e estrutura \| mapa |

O estilo dos cabecalhos vem de `estiloCabecalho` no config (sorteado 1x por projeto entre `'linha'`, `'marcador'`, `'sublinhado'`, `'aba'`, `'frase'` e `'texto'`; nenhum e padrao; ver `referencias.md` secao 5). Numeral romano so no estilo `'linha'`. **Quando o sorteio (ou o usuario) escolhe `'marcador'`, as divisoes em recortes da grade 2x2 (4, 3 e 2 quadrantes) tem layout pronto no slide master** (`deck.novoSlide(secao, { layout: 'Q4' })`, ver `SKILL.md` secao 5A): o titulo e o subtitulo de cada quadrante sao placeholders ao lado da barrinha, e `deck.livre(s)` devolve a area que o layout deixa livre. As demais divisoes (`'2c'`, `'3c'`, `'1+2'`, `'L'`...) desenham a barrinha no proprio slide. Bloco unico (`'1'`) nao leva marcador. Um item pode trocar o estilo so dele com `{ cab, sub, estilo: 'faixa' }`.

Opcoes: `pesos` (larguras relativas), `alturas` (alturas relativas), `n` (blocos empilhados no `'L'`), `numerar: false` (sem numerais romanos). Item `null` na lista = bloco sem cabecalho (devolve o retangulo inteiro). Divisao sob medida: `deck.grade({ linhas: [[1, 2], [1]], alturas: [1, 1.5] })` ou `{ colunas: [[1], [1, 1]], larguras: [1, 2] }`.

### Altura interna disponivel (com cabecalho e subtitulo)

| Divisao | Altura interna aproximada | Cabe |
|---|---|---|
| `'1'`, `'2c'`, `'3c'`, `'L'` (bloco alto) | ~4,4 pol | 2 exhibits empilhados, ou grafico + tabela, ou qualquer forma |
| `'2f'`, `'2x2'` | ~1,85 pol | um grafico com anotacao, tabela de 6 a 7 linhas, matriz, linha do tempo + recorte |
| `'3f'` | ~1,05 pol | tabela curta, equacao, linha do tempo, tira de fatos |
| `'L'` com `n: 3` (blocos a direita) | ~1,05 pol | grafico baixo sem legenda, premissas, numero + texto |

Sem `sub`, o cabecalho ocupa ~0,25 pol a menos. Um bloco alto pode ser subdividido com `deck.cabecalho(s, x, y, w, cab, sub, 'texto')` + exhibit. Quando a forma precisar de mais altura que o quadrante, mude a divisao em vez de comprimir a forma.

### Layouts de quadrantes do master x divisoes de `deck.blocos`

| Preciso de... | Use | Observacao |
|---|---|---|
| 4 blocos iguais | layout `Q4` | altura interna ~1,4 pol por quadrante: forma leve ou grafico baixo |
| 2 blocos em cima + 1 exhibit largo embaixo | layout `Q2T` e `deck.livre(s)` | o exhibit largo ocupa a faixa de baixo |
| 3 blocos com 1 canto livre para exhibit | `Q3E` ou `Q3D` | o canto livre e o `deck.livre(s)` |
| 2 blocos empilhados + 1 exhibit alto ao lado | `Q2E` (ou `Q2D` com `layouts: 'todos'`) | |
| Colunas de altura total, 1 bloco largo + 2, formato em L | divisoes de `deck.blocos` (`'2c'`, `'3c'`, `'1+2'`, `'L'`...) | barrinha desenhada no slide |
| 1 exhibit unico | layout base `'1'` | sem marcador |

## Composicoes prontas (funcoes em `composicoes.js`): UM arranjo entre varios, nao o padrao

Aprovadas pelo usuario, mas **so devem ser usadas quando o conteudo do slide encaixa sem enchimento** (ver `arranjos.md`: decisao por slide com 2+ alternativas, registrada em `deck.decidir`). Se voce estiver comprimindo ou inventando conteudo para caber, escolha outro arranjo. Repetir a mesma composicao em todo deck e exatamente o que o usuario nao quer.

- **Overview da empresa** (`deck.composicoes.overviewEmpresa(s, o)`, 2 colunas): esquerda = `faixasNumeradasArco` com a cadeia/modelo de negocio (`cadeia`, 2 a 5 itens reais) + `caixaEtiqueta` com um destaque (imagem + bullets, `destaque`); direita = `gradeKpiLosango` com 2 a 6 numeros-chave (`kpis`) + `chamadaConector` com o ponto de atencao (`atencao`). Use quando houver uma cadeia de valor real, varios KPIs e uma foto; senao prefira outro arranjo de `arranjos.md` secao 3.1
- **Financeiro** (`deck.composicoes.financeiro(s, o)`, grafico largo + leitura): esquerda = o grafico que voce desenha no callback `grafico(s, { x, y, w, h })` (combo colunas em degrade + linha de margem com rotulos em caixa) com `unidade` acima; direita = `lajesEmpilhadas` com 2 a 4 leituras (`leituras`) + `caixaFita` com a conclusao (`conclusao`)

## Divisoes basicas (referencia rapida)

- **Linha do tempo no topo + exhibits embaixo** (`'2f'` com `alturas: [1, 2]`): historia e numeros que a confirmam
- **Formato em L**: bloco alto a esquerda (resumo/contexto) + dois ou tres exhibits a direita

## Novos exemplos do usuario

(Acrescente aqui cada padrao de organizacao que o usuario enviar: nome, quando usar, divisao do espaco e quais formas preenchem cada bloco. Se o padrao se repetir, transforme em funcao de `composicoes.js`.)
