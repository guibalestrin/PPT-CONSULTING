# Referencias de organizacao (decks enviados pelo usuario)

> **Atualizacao 2026-11-11 (2a rodada):** a leitura completa dos 12 PDFs + PPTX esta em `gramatica.md` (regras) e `exhibits.md` (pecas novas, ja na densidade de 9pt). Este arquivo continua valendo como catalogo de slides do Agrion e do Kepler e como referencia das assinaturas de `elementos.js`. Onde ele disser que tabela, seta ou icone estao proibidos, vale a regra nova: liberados no formato das referencias. `tabela` passou a ser a de `exhibits.js`.

Leia **sempre** que for montar o miolo. Aqui esta o que os decks de referencia fazem para ficar limpos e faceis de apresentar ao cliente, e qual funcao reproduz cada coisa. O foco do usuario e **consultoria** (os exemplos de equity valem pela organizacao, nao pelo assunto).

Os elementos ficam em `scripts/elementos.js` e sao somados a `deck.formas` automaticamente (`formas.painelAba(s, {...})`). Assinaturas na secao 4.

> Regra atual: tabelas, setas/conectores, diagramas e icones de linha liberados no formato das referencias (`gramatica.md`, `exhibits.md`); vetados: grafico de dados com formas (`barrasPirulito`, `barras100`, `ponteDecomposicao`), `listaFitas`, `setaCurva` e o titulo `destaque`.

1. O que todos os slides de referencia tem em comum

1. **O slide se le em tres niveis.** Titulo-conclusao (o que o cliente deve lembrar) -> titulo de cada bloco, tambem como conclusao ("A Asia e o maior consumidor de fertilizantes", nunca "Consumo mundial") -> exhibit com unidade e fonte. Quem le so os titulos dos blocos entende o slide
2. **Cada bloco tem a mesma anatomia**: titulo do bloco (frase curta com conclusao) + subtitulo cinza com contexto, unidade e periodo ("Producao total de graos e area plantada (Mi Ton e Mi Ha)") + exhibit + anotacao do so-what presa ao exhibit
3. **Poucos blocos, bem separados**: 2 a 4 por slide, com respiro largo entre eles; nada encosta na borda do bloco vizinho
4. **Um padrao de cabecalho por deck** (sempre igual em todos os slides): marcador + frase (Agrion), aba escura sobre painel (Agrion setor), ou titulo escuro com subtitulo cinza sublinhado (Kepler). Configure com `estiloCabecalho`
5. **A cor carrega significado**: a cor dominante marca a empresa, a serie ou o item que importa; o resto e cinza. Destaque = uma coisa so por exhibit (a barra do Brasil mais clara, a fatia da empresa no treemap, o ano da pandemia sombreado)
6. **Anotacao no lugar da explicacao**: em vez de paragrafo, uma caixa tracejada ou um rotulo apontando para o dado ("A participacao relativamente baixa reflete um setor pulverizado"; "Desde 1977 a produtividade cresceu 224%")
7. **Ligacoes visuais entre blocos**: conector de zoom (trapezio cinza) do total para o detalhe, linha pontilhada em cotovelo de um numero para o grafico que o explica, seta entre etapas. O olho segue a historia sem o apresentador precisar apontar
8. **Rotulos direto no dado**: valor dentro ou em cima da barra, rotulo de linha em caixa, legenda curta junto da serie; sem eixo de valores e sem grade
9. **Texto curto e em negrito seletivo**: frases de uma linha, palavras-chave na cor dominante; nenhum paragrafo com mais de 3 linhas, exceto no painel de descricao da empresa
10. **Imagem real quando o assunto e fisico**: foto de satelite, mapa, foto do executivo, foto do produto. Na skill isso vira foto (biblioteca ou web) ou placeholder; nunca desenho improvisado

**Icones**: liberados em 2026-11-11 so como as referencias usam (de linha, pequenos, uma cor, identificando etapa ou ativo): `formas.icone` em `exhibits.md`. Nunca em circulo colorido nem um por bullet.

## 2. Catalogo dos slides de referencia

| # | Mensagem do slide | Divisao do espaco | Elementos que organizam a informacao | Funcoes da skill |
|---|---|---|---|---|
| R1 | Quem e a empresa e onde atua | 2 colunas; a esquerda dividida em 2 faixas | Linha de produtos com colchete tracejado e etiqueta "one-stop-shop"; perfil do executivo (faixa com nome e cargo, foto, fitas em seta com 3 fatos); mapa com callouts circulares de status | `colchete`, `etiqueta`, `faixaNome`, `listaFitas`, `deck.imagem` (mapa/foto) |
| R2 | O produto rende mais | 2 colunas; a direita em 2 faixas | Painel emoldurado com barras nativas pareadas e legenda; caixa com aba com valor em etiqueta; comparativo espelhado com piramide central | `barrasPirulito`, `painelAba`, `linhaValores`, `comparativoEspelhado` |
| R3 | O setor e grande e pulverizado | 3 colunas com aba em cima + faixa larga embaixo (`'3+1'`) | Aba escura sobre painel claro, frase-tese com losango, um grafico por painel; faixa de baixo com area de duas series | `painelAba` (`estiloCabecalho: 'aba'`), `anotacao`, `seloVariacao`, `setaCurva` |
| R4 | O Brasil e um dos maiores mercados | Grafico grande a esquerda + 2 faixas a direita (`'L'`) | Ranking em colunas com o Brasil em tom diferente; rosca de detalhe ligada por seta curva e etiqueta "breakdown"; barras 100% Brasil x EUA com contorno tracejado mostrando a diferenca | `barras100`, `etiqueta`, `setaCurva` |
| R5 | A parceria viabilizou a fabrica | Imagem grande a esquerda + 2 faixas a direita | Foto de satelite anotada; logo + lista de fitas com fatos numericos; combo colunas + linha com rotulos em caixa | `deck.imagem`, `listaFitas`, grafico combo (`graficos.md`) |
| R6 | A divida tem cronograma claro | Painel grande a esquerda + 2 paineis de zoom a direita (`'Linv'` invertido / `'L'`) | Conector de zoom cinza do total para cada cronograma; caixa de nota; placeholder tracejado para ano sem valor | `conectorZoom`, `anotacao`, `faixaPeriodo` |
| R7 | A expansao dilui riscos | Faixa de cima: fases em degrau + tabela; faixa de baixo: 3 cards (`'2f'`) | Seta de progressao no topo; degraus que sobem e escurecem; tabela com cabecalho em faixa; cards com aba em degrade e borda tracejada, ligados por faixa cinza | `fasesDegrau`, `tabela` (`'faixa'`), `cardsTracejados` |
| R8 | O pais e potencia no agro | `'2x2'` (Kepler) | Lajes isometricas com linhas-guia; colunas empilhadas + linha com faixa de periodo e legenda com CAGR; tabela limpa de ranking; area de duas series | `lajesEmpilhadas`, `faixaPeriodo`, `tabela` (`'limpa'`), grafico de area |
| R9 | Graos sao a alavanca | `'2x2'` | Rosca 2015 -> rosca 2023 ampliada com funil e "+7 p.p."; area com caixa de explicacao; colunas com anos em destaque + manchetes; cascata com grupo destacado | `conectorZoom`, `anotacao`, `manchetes`, cascata (`graficos.md`) |
| R10 | Visao geral da empresa | 3 colunas: descricao alta \| meio em 2 faixas \| mapa alto (`'Lc'`) | Painel com faixa escura e bico ("Descricao da companhia"); treemap de market share; estrutura acionaria; ponte receita -> custos -> EBIT; cards de produto com foto; lista de numeros | `painelAba` (`'faixa'`), `treemap`, `estruturaAcionaria`, `ponteDecomposicao`, `cardsProduto`, `listaNumeros` |
| R11 | Crescimento resiliente | Grafico grande a esquerda + 2 faixas a direita (`'L'`) | Colunas empilhadas + linha de margem; faixa "reestruturacao" com notas; conector pontilhado da coluna para o painel da direita; caixa de formula escura | `faixaPeriodo` (`estilo: 'etiqueta', notas`), `anotacao`, `conectorZoom`, `caixaFormula` |
| R12 | Localizacao estrategica | Mapa alto a esquerda + imagem com zoom + grafico embaixo | Zoom do mapa para a foto emoldurada; manchetes ao lado da foto; colunas com nota ligada por conector; tabela de contagem | `conectorZoom`, `manchetes`, `anotacao`, `tabela` |

## 3. Como escolher a organizacao (mensagem -> arranjo)

**Esta tabela e so um atalho com o arranjo dos decks de referencia (uma opcao por mensagem). O processo de decisao, as regras contra enchimento e o banco completo (4 ou mais arranjos por tipo) estao em `arranjos.md`; decida por la, com 2+ alternativas.**

| O que o slide precisa mostrar | Arranjo de referencia | Divisao |
|---|---|---|
| Quem e a empresa (overview) | Painel de descricao + numeros + portfolio/estrutura (R10) ou produtos + pessoa + mapa (R1) | `'Lc'` ou `'2c'` |
| Tamanho e estrutura de um mercado | 3 paineis com aba, um angulo cada + faixa com a tendencia (R3) | `'3+1'` |
| Uma prova principal e duas de apoio | Exhibit grande + 2 menores (R4, R11) | `'L'` / `'Linv'` |
| Total e detalhe do total | Exhibit do total ligado por `conectorZoom` aos paineis de detalhe (R6, R12) | `'L'` com zoom |
| Comparar duas alternativas | `comparativoEspelhado` ou `formas.grafico` barras com 2 series (R2) | `'2c'` |
| Evolucao por fases / roadmap | `fasesDegrau` + tabela + `cardsTracejados` (R7) | `'2f'` |
| Quatro fatores de uma tese | Um exhibit diferente por quadrante (R8, R9) | `'2x2'` |
| Lugar, ativo fisico | Imagem/mapa grande + manchetes + 1 grafico (R5, R12) | `'2c'` com `pesos` |
| Ranking ou benchmark | Tabela limpa ou barras ordenadas com destaque (R8) | qualquer |

Regras de combinacao: um exhibit "pesado" (grafico grande, mapa, tabela longa) por slide; os outros blocos sao leves (lista, manchetes, KPIs). Varie o arranjo entre slides vizinhos, mas mantenha o mesmo `estiloCabecalho` no deck inteiro.

## 4. Assinaturas (`scripts/elementos.js`)

Todas recebem `(slide, { ... })`, medidas em polegadas; `runs` = string ou runs do pptxgenjs. Numeros passados como `number` saem no padrao brasileiro (`formas.fmt(1234.5)` -> "1.234,5").

| Funcao | Quando usar | Parametros | Espaco de referencia |
|---|---|---|---|
| `painelAba` | Painel com titulo em aba (ou faixa com bico); **devolve a area interna** | `x, y, w, h, titulo, estilo?: 'aba' \| 'faixa', marcador?: frase-tese, fundo?` | h >= 1,8 |
| `comparativoEspelhado` | A x B em 3 a 5 atributos, B favorecido | `x, y, w, esquerda: { titulo, itens }, direita: { titulo, itens }, hItem?=0.3, gap?=0.16, wCentro?=1.4` | 4 itens: ~2,2 pol |
| `linhaValores` | Um valor por categoria (3 a 6), sem icone | `x, y, w, itens: [{ rotulo, valor, nota? }], h?=1.0` | h 0,8 a 1,1 |
| `tabela` | Ranking, comps, DRE, contagens | `x, y, w, cabecalho, linhas, larguras?, estilo?: 'limpa' \| 'faixa', hLinha?=0.27, fonte?=10, italicoValores?, destacar?: [i], alinhar?` | (n+1) x 0,27 |
| `fasesDegrau` | 2 a 4 fases que evoluem (com seta de progressao) | `x, y, w, h, fases: [{ titulo, runs }], seta?: texto \| false, wFase?` | h >= 1,8 |
| `cardsTracejados` | 2 a 4 consequencias/etapas ligadas | `x, y, w, h, cards: [{ titulo, runs }], gap?=0.45` | h 1,2 a 1,6 |
| `conectorZoom` | Ligar total -> detalhe (desenhe **antes** do detalhe) | `de: {x,y,w,h}, para: {x,y,w,h}, lado?: 'direita' \| 'baixo', transp?=45, moldura?=true` | livre |
| `anotacao` | So-what preso ao dado, com ponto e conector em cotovelo | `x, y, w, h, runs, estilo?: 'tracejada' \| 'escura', alvo?: {x, y}, fonte?=10` | h 0,5 a 0,9 |
| `faixaPeriodo` | Periodo destacado num grafico (desenhe **antes** do grafico) | `x, y, w, h, rotulo, estilo?: 'texto' \| 'etiqueta', notas?: [string]` | sobre o grafico |
| `manchetes` | 2 a 4 ideias com frase curta em cor + descricao cinza | `x, y, w, itens: [[manchete, descricao]], pt?=14, gap?=0.18, hDesc?=0.42` | ~0,9 pol por item |
| `listaNumeros` | Numeros de escala em lista (substitui card de KPI) | `x, y, w, itens: [[valor, rotulo]], passo?=0.42, wValor?` | n x 0,42 |
| `seloVariacao` | Variacao acumulada sobre um grafico ("2022-2032E: +37%") | `x, y, rotulo, valor, h?=0.3` | pequeno |
| `etiqueta` | Rotulo solto em caixa ("BREAKDOWN DE INSUMOS") | `x, y, texto, cor?, fonte?=9` | 0,26 de altura |
| `colchete` | Agrupar itens de uma linha sob um nome | `x, y, w, rotulo?, alt?=0.18, marcas?: [x]` | 0,3 de altura |
| `caixaFormula` | Formula + leitura (EVA, ROIC, payback) | `x, y, w, h, formula, legenda?, runs?` | h ~1,6 |
| `estruturaAcionaria` | Socios -> empresa -> subsidiarias | `x, y, w, socios: [[nome, pct]], empresa, subsidiarias?: [[nome, pct]], hCaixa?=0.36` | ~2,1 pol com subsidiarias |
| `treemap` | Participacao de mercado (3 a 6 players) | `x, y, w, h, itens: [[rotulo, valor]], destaque?=0, sufixo?='%'` | h >= 1,5 |
| `cardsProduto` | 2 a 6 produtos/servicos com foto | `x, y, w, h, cards: [{ titulo, runs, caminho?, tema?, descricao? }], cols?=2` | cada card >= 1,0 pol de altura |
| `faixaNome` | Nome e cargo de executivo/entrevistado | `x, y, w, nome, cargo` | 0,62 de altura |


Graficos com essas anotacoes: desenhe `faixaPeriodo` antes do `addChart`; `seloVariacao` e `anotacao` depois. Para posicionar sobre uma barra, calcule pelo `layout` da plotagem do grafico (fixe `layout: { x, y, w, h }` em fracoes) em vez de chutar coordenadas.

## 5. Estilos de cabecalho e de titulo (um por deck, no config do `moldura.js`)

| `estiloCabecalho` | Visual | Referencia |
|---|---|---|
| `'marcador'` (1 dos 6 sorteados; so e usado se sair no sorteio ou o usuario nomear) | Barrinha de duas pecas a esquerda (topo escuro + base em degrade, corte diagonal), titulo em negrito na dominante, subtitulo cinza; sem numeral. Nos layouts de quadrantes do master e em `deck.blocos` | mestre do usuario (DermoClinic) |
| `'linha'` | Titulo do bloco na dominante + fio embaixo + numeral romano ("1.", "2.") | estilo original da skill; tambem valido |
| `'texto'` | Titulo em negrito + subtitulo cinza, sem marcador (com `numerarBlocos: true` vira "I. Titulo") | Orizon, M&A Bunge |
| `'frase'` | Frase-tese em peso normal com negritos na cor (`cab` em runs) + legenda italica pequena | Nubank, Tech, Vivara, Vibra |
| `'sublinhado'` | Titulo escuro + subtitulo cinza sublinhado com unidade/periodo; sem numeral | Kepler |
| `'aba'` | Cada bloco vira `painelAba`; o `sub` vira a frase-tese com losango | Agrion (setor) |

`estiloTitulo: 'destaque'` (fio vertical a esquerda, Agrion) esta VETADO e o build recusa; estilos de titulo validos: `'padrao'`, `'assunto'`, `'italico'` (sorteados). Em `'padrao'`, os `*asteriscos*` escurecem a palavra. Um item de `deck.blocos` pode trocar o estilo pontualmente com `estilo` (`'linha'`, `'marcador'`, `'sublinhado'`, `'aba'` ou `'faixa'`), por exemplo um unico painel com faixa e bico num deck de cabecalho `'marcador'`.

## 6. Novos exemplos do usuario

Quando o usuario mandar um PDF ou PPTX de referencia:

1. `python3 -I extrair_referencias.py deck.pdf --saida refs` (PPTX e convertido sozinho). Gera folhas de contato (`folha-*.jpg`, 6 slides por imagem), cada pagina (`pagina-NN.jpg`), o texto (`textos.json`) e um inventario com a densidade de texto por pagina
2. Olhe as folhas de contato com Read para ter a visao geral; abra a pagina individual so dos slides que trazem um arranjo ou elemento novo
3. Para cada slide relevante, registre uma linha na tabela da secao 2 (mensagem, divisao, elementos, funcoes) e, se aparecer um elemento que a skill nao tem, escreva a funcao em `elementos.js` no mesmo estilo e acrescente na secao 4
4. Se um arranjo se repetir em 2 ou mais referencias, vire funcao em `composicoes.js`
5. Entregue a skill atualizada em ZIP com a pasta inteira (`SKILL.md`, `scripts/`, `references/`, `assets/`). O Claude nao atualiza a skill instalada sozinho: o usuario faz o upload em Configuracoes > Capacidades > Skills, substituindo a anterior

(Registre abaixo os padroes vindos de cada novo deck: nome do deck, paginas, o que acrescentou.)
