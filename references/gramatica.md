> Regra vigente (15/11/2026): um único modelo e fundo de sumário em todo o deck; paleta fixa 60/30/10; título 26pt e subtítulo 14pt, sem reduzir fonte. As composições de `contraexemplos_huawei.md` são vetadas; `faixasNumeradasArco` não pode ser usada no modo Insper Jr. Exemplos legados abaixo não substituem estas regras.

# Gramática dos slides de referência

> Imagem de apoio: `assets/exemplos_gramatica.jpg` mostra as tecnicas desta gramatica renderizadas (abra com Read junto com as referencias sorteadas).

Leia **sempre, antes de montar qualquer slide de conteúdo**. Este arquivo é o que foi aprendido lendo página por página os decks de referência do usuário: 12 PDFs (Kepler Weber equity, M&A Bunge x Kepler, Project Finance Kepler, Vivara, Vibra, Nubank, Setorial Tech, Rede D'Or, Hermès, Agrion, Tenda FUCAPE, Tenda USP) e 1 PPTX editável (M&A Orizon x Solví), cerca de 1.550 slides.

**Não é um catálogo de moldes.** Não existe "o slide de overview" nem "o slide de mercado". Existe uma gramática: como o espaço é dividido, como um bloco é construído, como um dado é anotado, como o texto é escrito. O slide é composto na hora, a partir do conteúdo, com essas regras. Dois slides sobre o mesmo assunto devem sair diferentes se o conteúdo for diferente; e nenhum pode sair com cara de IA, porque todas as peças são as que analistas de verdade usam.

O usuário liberou tabelas, setas e conectores, diagramas com formas e ícones de linha com uma condição literal: *"tem que ser usado igual eles usam na apresentação, na mesma formatação, diagramação etc., porque senão fica com cara de Claude"*. Por isso cada peça abaixo traz a formatação exata, e as funções de `scripts/exhibits.js` já nascem nela (assinaturas em `exhibits.md`).

## 1. O que todos os decks têm em comum

| Invariante | Como aparece | Número observado |
|---|---|---|
| **Densidade alta** | O slide é lido, não só projetado. Cabe muita informação porque o texto é pequeno e os exhibits são compactos | 100 a 300 palavras por slide de conteúdo (mediana ~170); os mais densos chegam a 450 |
| **Tipografia pequena e hierárquica** | Título > apoio > cabeçalho de bloco > corpo > legenda > micro-rótulo | Título 20 a 24pt; apoio 10 a 12pt; cabeçalho de bloco 10 a 12pt; **corpo 9pt**; legenda, rótulo de dado e nota 8pt; micro (eixo, data, unidade) 7pt |
| **Três níveis de leitura** | Só os títulos dos slides contam a história; só os cabeçalhos dos blocos explicam o slide; o exhibit prova | Título-conclusão em 1 linha + apoio de 1 ou 2 linhas + 2 a 4 blocos |
| **Miolo sem caixas** | Os blocos são separados por espaço em branco e pelo cabeçalho, não por bordas. Painel (fundo cinza `F2F2F2`) só para um aprofundamento: zoom, premissas, citação, visão geral da empresa | No máximo 1 ou 2 painéis por slide; nunca um card por bloco |
| **2 a 4 exhibits por slide** | Um exhibit principal maior e 1 a 3 de apoio. Slides de 1 exhibit são raros (tabela grande, mapa, football field) | 2 exhibits ~45% dos slides; 3 ~25%; 4 ~20%; 1 ~10% |
| **Todo exhibit é anotado** | Colchete de CAGR, nota tracejada apontando o dado, elipse no valor, rótulo em caixa, faixa de período, linha de referência | 1 a 3 anotações por gráfico; quase nenhum gráfico "cru" |
| **Texto nunca é parágrafo solto** | Vira frase-tese de 1 ou 2 linhas, lista com pinos, premissas em chips, nota presa ao dado, tabela, citação. Parágrafo corrido só no painel de descrição da empresa (justificado, com negritos) | Máx. 3 linhas por unidade de texto fora desse painel |
| **Prova externa** | Citação de executivo ou especialista com foto, recorte de notícia, foto de campo, print de pesquisa própria | Em 1 de cada 4 ou 5 slides do corpo |
| **Uma cor, muitos cinzas** | Dominante + 1 destaque (tom claro ou cor complementar) + cinzas neutros. A cor marca o que importa: a empresa, a série principal, o resultado | Cinzas: `F2F2F2` painel, `D9D9D9` fio, `A6A6A6` série de apoio, `595959` texto de apoio |
| **Rodapé informativo** | "Fontes:" em toda página, abaixo da linha, à direita do fluxo; sem "Notas:" (ressalva vai para apêndice ou slide de pop-up) | `deck.fontes` |

## 2. Anatomia do bloco e as convenções de cabeçalho

Todo bloco tem: **cabeçalho (2 linhas) + exhibit + leitura presa ao exhibit**. O que muda de um deck para outro é só a convenção das 2 linhas. Escolha **uma por deck** e mantenha em todos os slides.

| Convenção | 1ª linha | 2ª linha | Decks | Na skill |
|---|---|---|---|---|
| **Conclusão + legenda** | Frase-conclusão curta em negrito ("Brasil tem um dos maiores déficits de armazenagem") | Nome do exhibit, unidade e período em cinza ("Capacidade instalada nas fazendas, % do total") | Kepler, M&A Bunge, Project Finance, Rede D'Or | `estiloCabecalho`: sorteado entre `'marcador'`, `'texto'`, `'linha'`, `'sublinhado'`, `'aba'` e `'frase'` (sem padrão); `cab` = conclusão, `sub` = legenda |
| **Exhibit + leitura** | Nome do exhibit com unidade em negrito ("EBITDA e Margem EBITDA (BRL Mi, %)") | Frase-conclusão em cinza ("Exploração do biogás permite crescimento da geração de caixa") | Orizon x Solví (PPTX), Agrion | mesmos estilos; `cab` = exhibit, `sub` = leitura |
| **Frase-tese + legenda itálica** | Frase em peso normal, 1 ou 2 linhas, com 2 a 5 palavras-chave em negrito na cor | Legenda em itálico pequeno na cor ("Número de clientes (MM)") | Nubank, Setorial Tech, Vivara, Vibra | `estilo: 'frase'`; `cab` = runs com negrito, `sub` = legenda |
| **Numeral + título** | "I. Título do bloco" com fio fino embaixo; dentro, sub-itens com círculo numerado | Legenda em itálico sublinhada | Rede D'Or, Hermès, M&A Bunge (sem fio) | `'linha'` (com fio) ou `numerarBlocos: true` |
| **Faixa cheia** | Título branco em faixa na cor, largura total do bloco | Nome do exhibit + unidade em cinza, e a conclusão numa tira clara no pé do bloco | Tenda FUCAPE, Tenda USP | item com `estilo: 'faixa'` + `faixaConclusao` |

Regras que valem em todas:

1. **A conclusão está sempre escrita**, na 1ª ou na 2ª linha. Um bloco só com rótulo ("Market share") não existe nas referências.
2. **A unidade e o período ficam no cabeçalho**, entre parênteses: "(R$ Mi)", "(% do volume, 2025)". Não repita em cima do gráfico.
3. **Colunas encadeadas por reticências** (Vivara, Vibra, Nubank, Tech): a frase do bloco da esquerda termina em "..." e a da direita começa com "...e por isso"; o slide vira uma frase só. Use quando o bloco da direita é consequência do da esquerda.
4. Cor do cabeçalho: escuro quase preto na maioria (`corCabecalho: 'escuro'`), na dominante em Nubank, Rede D'Or e Hermès (`'dom'`). O título do slide segue a mesma lógica (`corTitulo`).

## 3. Divisão do espaço

A divisão nasce do **peso de cada exhibit**, não de uma grade fixa. O que as referências fazem:

| Divisão | Quando aparece | Detalhe que importa |
|---|---|---|
| **2 colunas** (a mais comum) | Causa e consequência; dado e prova; série e composição | Raramente 50/50 exato: o exhibit que carrega a mensagem leva 55 a 65% |
| **2 x 2** | Quatro ângulos de mesmo peso (setor, panorama) | Cada quadrante com um tipo de exhibit **diferente** (coluna, barra, mapa, tabela); nunca quatro gráficos iguais |
| **Coluna estreita + grade** | Visão geral de empresa ou de setor | Coluna de 22 a 26% com painel de descrição (texto justificado, estrutura acionária, key financials); à direita, linha do tempo no topo e 2 a 3 exhibits |
| **1 exhibit grande + 2 empilhados** | Uma prova principal e duas de apoio | O grande fica à esquerda quando é a abertura do argumento, à direita quando é a conclusão |
| **Faixa em cima + blocos embaixo** (ou o inverso) | Processo, cadeia de valor ou linha do tempo que contextualiza os exhibits; tabela larga que detalha o gráfico de cima | A faixa ocupa 20 a 35% da altura |
| **3 colunas** | Três fatores paralelos (Kepler: três painéis com faixa; Hermès: três blocos numerados) | Cada coluna repete a mesma anatomia: título, 2 linhas de texto, mini-exhibit |
| **1 exhibit inteiro** | Football field, tabela de transações, mapa, demonstração financeira | Sempre com coluna de comentários, legenda ou nota ao lado; nunca só o exhibit |

Como decidir: liste os exhibits que o conteúdo dá, marque o principal, e dê a ele a maior área. Se sobrar um quadrante vazio, a divisão está errada: junte ou mude. `deck.blocos` e `deck.grade` aceitam pesos (`pesos`, `alturas`, `larguras`); use-os. Slides vizinhos não repetem a mesma divisão.

## 4. Repertório por função da informação

Este é o centro da gramática. Para cada **função** que uma informação cumpre, o que as referências usam (sempre mais de uma opção) e a formatação. Escolha pela informação que você tem; combine funções diferentes no mesmo slide.

### 4.1 Evolução no tempo

| Como as referências mostram | Formatação | Skill |
|---|---|---|
| Colunas com rótulo em cima e **colchete de CAGR** ligando o primeiro e o último ano | Colunas chapadas na dominante; sem eixo de valores e sem grade; rótulo 8pt negrito; colchete tracejado cinza com "CAGR 14%" entre dois pinos (Kepler, M&A) ou linha cheia com etiqueta preenchida (Nubank, Rede D'Or) | `grafico({ tipo: 'colunas' })` + `colcheteCagr` |
| Colunas + linha do indicador relativo (margem, % do total, crescimento) | A linha flutua acima das colunas; rótulos da linha **em caixinhas** preenchidas na cor da série; rótulos das colunas dentro ou em cima | `grafico({ tipo: 'combo' })` |
| Colunas empilhadas por segmento, total em negrito em cima | Segmento pequeno sem rótulo; marcos anotados sobre os anos ("3 aterros", "Aquisição X") em notas cinza | `grafico({ tipo: 'empilhado', totais: true })` + `nota` |
| Projeção | Anos com "E"; colunas projetadas em tom claro ou com contorno tracejado; colchetes separados para histórico e projeção | `projecaoDe: i` |
| Linha(s) de tendência | 1 a 3 linhas; a série da empresa na cor, pares em cinza; rótulo só nas pontas ou em caixinhas; logo ou nome na ponta da linha em vez de legenda | `grafico({ tipo: 'linha' })` |
| Área (uma grandeza que cresce) | Área translúcida com degradê; texto grande dentro ("Caixa líquido"); linha de referência tracejada | `grafico({ tipo: 'area' })` + `linhaRef` |
| Evento que explica a curva | Linha vertical tracejada com rótulo no topo; faixa cinza sobre o período ("Pandemia", "Reestruturação") | `marcoEvento`, `faixaPeriodo` |

### 4.2 Composição e participação

| Como | Formatação | Skill |
|---|---|---|
| Rosca com o ano ou o share no centro | Até 5 fatias; a da empresa na cor, o resto em tons e cinzas; legenda ao lado; frequentemente ligada por conector de zoom a um detalhe | `grafico({ tipo: 'rosca' })` + `conectorZoom` |
| Treemap (market share, receita por região) | Retângulos em tons da cor; rótulo "Nome, 48%" no canto inferior esquerdo de cada um; logos nos retângulos quando são empresas | `treemap` |
| Barra única empilhada horizontal como "tabela visual" | Uma barra de 100% com os percentuais dentro e os rótulos em cima ou embaixo | `grafico({ tipo: 'barrasEmpilhadas' })` |
| Colunas 100% comparando dois períodos ou duas empresas | Contorno tracejado mostrando a diferença | `grafico({ tipo: 'empilhado100' })` |
| Lista de categorias com barra-rótulo e % em chip (Hermès, Kepler "36% Farm") | Faixas horizontais com o percentual à esquerda e o texto dentro | `linhaValores` / `tabela` estilo `rotuloValor` |

### 4.3 Ranking e comparação entre pares

| Como | Formatação | Skill |
|---|---|---|
| Barras horizontais ordenadas, **a empresa na cor e os pares em cinza** | Rótulo à direita da barra; sem eixo; logos no lugar dos nomes quando houver | `grafico({ tipo: 'barras', destaque: [i] })` |
| Colunas por empresa com logo embaixo | Idem, vertical; coluna do par com contorno tracejado quando é estimativa | `grafico({ tipo: 'colunas', destaque })` |
| Tabela comparativa com logos (deals, comps, pares) | Cabeçalho com fio escuro; linhas com fio claro; a linha ou coluna da empresa com fundo claro; medianas em negrito no pé | `tabela({ estilo: 'limpa', colDestaque, destacar })` |
| A x B direto | Duas caixas com contorno fino e um "x" entre elas ("Vivara produz 80% x Monte Carlo 20%"); ou dois números grandes com seta de diferença | `equacao` com 2 termos, `numeroTexto` |
| Scorecard (critérios x empresas) | Tabela com checks ou notas; linha da empresa destacada | `tabela` |

### 4.4 Relação entre variáveis

Dispersão com **logos ou nomes nos pontos**, linha de tendência fina, caixa tracejada com "R² = 0,87", elipse tracejada no grupo que interessa (Kepler, Hermès, Vibra, Orizon). Quadrantes com cruz tracejada quando a leitura é "quem está em qual quadrante". Skill: `addChart` de dispersão + `elipse` + `nota`.

### 4.5 Do total para o detalhe (zoom)

O **conector de zoom** é a assinatura mais comum das referências: um trapézio cinza translúcido que abre de um elemento pequeno (uma coluna, uma fatia, um estado no mapa, uma linha de lista) para um painel de detalhe. Aparece em Kepler, Project Finance, FUCAPE, Rede D'Or, Vivara, Nubank, Tech, Orizon. Use quando o segundo exhibit é o detalhe de um pedaço do primeiro. Skill: `conectorZoom` + `painel`.

### 4.6 Decomposição lógica (como o número é formado)

| Como | Formatação | Skill |
|---|---|---|
| Equação em blocos: A × B − C = D | Blocos cinza com título pequeno e valor em negrito na cor; operadores grandes entre eles; o resultado no bloco na cor | `equacao` |
| Equação com mini-gráficos (DuPont, ROIC): gráfico ÷ gráfico = linha | Mini-gráficos sem eixo lado a lado com "×", "÷", "=" grandes | 2 a 4 `grafico` pequenos + operadores em texto 16pt |
| Ponte / cascata (EV → equity, preço atual → alvo) | Colunas flutuantes; primeira e última na cor escura; rótulos em cima; ao lado, o build-up do WACC em barras horizontais escalonadas | `grafico({ tipo: 'empilhado' })` com série-base invisível (`graficos.md`) |
| Caixa de fórmula | Faixa escura com a fórmula em itálico ("EVA = (ROIC − WACC) × Capital investido") | `caixaFormula` |

### 4.7 Sequência, processo, cadeia de valor

| Como | Formatação | Skill |
|---|---|---|
| Cadeia de valor em nós sobre um fio | Círculo de contorno fino com ícone de linha dentro; número pequeno entre os nós; chip na cor embaixo com o nome da etapa; colchete fino em cima agrupando etapas; as etapas em que a empresa atua em tom mais escuro | `cadeia` |
| Etapas em chevrons ou faixas que escurecem | 3 a 5 etapas; cada uma com título em negrito e 1 linha; usado para metodologia ("Coleta → Filtro → Estimativa") | `fasesDegrau`, `chipsHexagonais` |
| Passo a passo numerado ao lado de um diagrama | Círculos numerados pequenos + frase de 1 ou 2 linhas; os mesmos números marcados no diagrama | texto com numeração + imagem |
| Fluxo de estrutura (JV, CRA, financiamento) | Caixas de contorno fino com logos, setas finas com o percentual ou o fluxo escrito sobre a linha | `estruturaAcionaria`; caixas e `nota` com `ponta: 'seta'` |

### 4.8 Linha do tempo

Anos em **chips** sobre um fio horizontal, texto curto de 1 ou 2 linhas acima (ou alternando acima e abaixo quando há 5+ marcos), com a palavra-chave em negrito. Fica no topo do slide de visão geral, ocupando uma faixa baixa. Skill: `linhaTempo`.

### 4.9 Lugar e ativos físicos

Mapa do país ou do estado com os estados em tons da cor e **pins**; lista de números ao lado; zoom do mapa para uma foto de satélite ou para um cartão com logo e 2 bullets (Orizon, Kepler, M&A). Foto real do ativo com faixa de legenda. Mapas e fotos são sempre imagem (`deck.imagem`), nunca desenho com formas; sem imagem, placeholder descrito.

### 4.10 Quem é a empresa (snapshot)

Não é um slide de KPIs. É uma **coluna estreita** com: etiqueta de título ("Empresa in a Nutshell", "Company Overview"), parágrafo justificado de 6 a 9 linhas com negritos, mini estrutura acionária (3 caixas → logo) e tabela "Key Financials" zebrada de 4 a 6 linhas. À direita: linha do tempo, receita por segmento com marcos, margem, mapa ou liderança. Skill: `painelAba({ estilo: 'faixa' })` + texto + `estruturaAcionaria` + `tabela({ estilo: 'rotuloValor' })` + `linhaTempo` + gráficos.

### 4.11 Pessoas e governança

Fotos recortadas em linha com **faixa de nome e cargo** embaixo e os logos das empresas anteriores; organograma de comitês em caixas de contorno fino; composição da remuneração em colunas empilhadas. Skill: `faixaNome`, `deck.imagem`, `tabela`.

### 4.12 Voz externa

| Como | Formatação | Skill |
|---|---|---|
| Citação de executivo ou especialista | Foto recortada à esquerda; nome em negrito e cargo em cinza; **faixa escura em degradê** com a fala em itálico branco entre aspas, 2 a 4 linhas, palavras-chave em negrito | `citacao` |
| Recorte de notícia | Caixa branca com sombra leve; logo do veículo + manchete em negrito; fio; resumo de 2 linhas; data pequena à direita | `recorte` |
| Pesquisa de campo | Mosaico de fotos próprias; print da videochamada com o entrevistado e a frase ao lado; gráfico de barras da pesquisa com "+500 respostas" | `deck.imagem` + `nota` |

### 4.13 Premissas e resultado (modelagem)

Premissas em **linhas de rótulo cinza + valor em chip na cor + comentário com marcador**; a tabela do fluxo embaixo ou ao lado, ligada por conector de zoom; o resultado final **circulado com elipse tracejada**; uma tira-resumo no pé ("TIR nominal: 23,5% | Ke: 15,0%"). Skill: `premissas`, `tabela({ estilo: 'financeira' })`, `elipse`, `tiraFatos`.

### 4.14 Valuation

| Peça | Formatação | Skill |
|---|---|---|
| Football field | Faixa-título em degradê; uma linha por metodologia com rótulo em negrito à esquerda, barra do mínimo ao máximo e os dois valores nas pontas; **linha vertical tracejada do valor justo** com rótulo embaixo; coluna "Comentários" à direita com o que define máximo e mínimo | `footballField` |
| Sensibilidade | Mapa de calor em tons da cor (não verde e vermelho gritantes), eixos com rótulo em itálico, **célula-base com moldura escura**; tira de conclusão embaixo ("Upside maior que o custo de capital em 76% dos cenários") | `sensibilidade` + `faixaConclusao` |
| Cenários | 3 colunas com faixa de título (pessimista, base, otimista), 3 a 5 premissas com marcador, e o preço-alvo em caixa tracejada com o upside colorido | `cenarios` |
| Ponte até o preço | Equação em blocos ou cascata; ao lado, tira com WACC, g e TIR | `equacao`, `tiraFatos` |
| Recomendação | Faixa com "COMPRA", preço atual, preço-alvo e upside sobre o gráfico da cotação, alvo como linha tracejada projetada | gráfico de linha + `linhaRef` + `nota` |

### 4.15 Riscos

Matriz de **quadrados rotulados** (R1, M2, O1) sobre grade cinza ou cruz tracejada, eixos "Probabilidade" e "Impacto" com seta fina; ao lado, lista agrupada por categoria (título com fio ou faixa na cor da categoria), o risco mais relevante com fundo claro. Em decks longos, um slide por risco: a matriz esmaecida à esquerda e o detalhe do risco com mini-gráfico à direita. Skill: `matrizRisco` + `listaCategorias`.

### 4.16 Demonstrações financeiras e apêndice

Uma tabela por slide; título = nome da demonstração; cabeçalho na cor escura com os anos; projeção com fundo levemente cinza; totais em negrito com fio em cima; negativos entre parênteses; premissas em azul quando vier de planilha. O apêndice abre com um **índice** em colunas por tema e tem divisores de seção (slide escuro só com o título). Skill: `tabela({ estilo: 'financeira', totais, subitens, projecaoDe })`.

### 4.17 Resumo de tese e transições

Slide escuro com os pilares numerados em algarismos romanos dentro de círculos de contorno fino, cada um com título em negrito e 1 linha em itálico; reaparece antes de cada seção com o pilar da vez aceso e os outros esmaecidos. Entre blocos de argumento, uma **faixa-pergunta** ("Mas como a empresa se beneficia desse aumento?") sobre o slide anterior esmaecido. Na skill: `deck.sumario` (estilos e pilares), `deck.faixaPergunta`, `deck.popup`, `deck.destacar`; ver `references/sumarios_popups.md`.

## 5. Camada de anotação

É o que mais separa um slide de analista de um slide de IA. Regra: **todo gráfico leva pelo menos uma anotação que diz a leitura** e no máximo três. Posicione sempre pelo `plot` que `formas.grafico` devolve (`plot.cx(i)`, `plot.cy(valor)`), nunca no olho.

| Anotação | O que diz | Formato |
|---|---|---|
| Colchete de CAGR / variação | "Cresceu X% ao ano entre estes dois pontos" | Tracejado cinza com rótulo entre pinos, ou linha cheia com etiqueta na cor; pés sobre as colunas |
| Nota tracejada | A explicação de um ponto ("Alavancagem na recessão para capital de giro") | Caixa de borda tracejada na cor, texto 8pt centralizado, conector tracejado em cotovelo com ponta pequena |
| Nota cinza / etiqueta escura | Um fato sobre um ano ou barra ("3 aterros", "ICMS acrescenta 4 p.p.") | Caixa `F2F2F2` sem borda, ou etiqueta escura com texto branco |
| Elipse tracejada | "Olhe este valor" | Contorno tracejado na cor, sem preenchimento |
| Rótulo em caixa | Valor de uma linha sobre colunas | Caixinha preenchida na cor da série, texto branco 8pt negrito |
| Destaque de categoria | A empresa entre os pares; o ano que importa | Uma categoria na cor, as outras em cinza `BFBFBF` |
| Projeção | "Daqui para frente é estimativa" | Tom claro, contorno tracejado, anos com "E" |
| Faixa de período / marco | Um intervalo ou evento que explica a série | Retângulo cinza claro atrás do gráfico com rótulo; linha vertical tracejada com losango e rótulo |
| Linha de referência | Média, custo de capital, valor justo, capacidade | Tracejada na cor de destaque com rótulo em negrito na ponta |
| Conector de zoom | "Este pedaço, aberto" | Trapézio cinza translúcido até o painel de detalhe |
| Número grande ao lado | O dado-síntese do bloco ("31% do volume nos cinco maiores") | Número até 18pt na cor + frase 8,5pt; no máximo 1 ou 2 por bloco, sempre junto do exhibit |
| Tira de conclusão | A leitura do bloco inteiro | Faixa na cor (ou clara) com frase em negrito centralizada, no pé do bloco |

## 6. Texto

- **Título do slide**: conclusão em 1 linha, com verbo; número quando houver ("Valor justo de R$ 147 Mi fica dentro de todas as faixas"). Alternativa usada em slides de panorama: "Assunto: conclusão" ("Gestão de Resíduos: Altamente Informal e Fragmentada").
- **Apoio**: 1 ou 2 linhas que completam o título com o porquê; 1 trecho em negrito na cor no máximo.
- **Cabeçalho de bloco**: conforme a convenção do deck (seção 2). 6 a 12 palavras.
- **Negrito seletivo**: 2 a 5 palavras por frase, as que carregam o dado ou a consequência. Nunca a frase inteira.
- **Notas e legendas**: frases nominais curtas, sem ponto final.
- **Números**: padrão brasileiro, unidade junto ("R$ 2,3 Bi", "38% a.a.", "5,8x"), "E" nos anos projetados, negativos entre parênteses em tabelas.
- **Sobrescritos** para notas de rodapé: "RSU¹", e a explicação em slide de pop-up ou apêndice.
- O que não aparece nas referências: subtítulo genérico ("Visão geral", "Principais destaques"), frase de efeito sem dado, emoji, bullets de mais de 2 linhas, texto centralizado em bloco longo.

## 7. O que denuncia IA, e o que as referências fazem no lugar

**Veto visual obrigatorio:** ler `contraexemplos_starbucks.md` e abrir os slides 5 e 6 reprovados. Nao reproduzir tabela de frases + ranking + caixa de conclusao, nem grafico + foto-banner + paragrafos sem relacao analitica demonstrada. Nao usar nota de amostra ou respostas multiplas como insight conectado a uma barra. Contar foto e texto como objetos diferentes nao os transforma em provas diferentes.


| Padrão de IA | O que as referências fazem |
|---|---|
| Grade de 3 a 6 cards arredondados idênticos, cada um com ícone, título e 2 linhas | Blocos sem caixa com exhibits **diferentes**; ou uma tabela; ou um único painel com lista de pinos |
| Número gigante em card com rótulo embaixo, em série | Tabela "Key Financials"; `numeroTexto` isolado ao lado do gráfico; tira de fatos |
| Ícone dentro de círculo colorido ao lado de cada bullet | Ícone de linha pequeno, de uma cor, só onde ele identifica algo físico (etapa da cadeia, tipo de ativo); ou nenhum |
| Gráfico padrão: grade, eixo de valores, legenda embaixo, cores sortidas, sem anotação | Sem grade nem eixo, rótulo direto, uma cor + cinzas, anotado |
| Slide com 3 bullets grandes e muito branco | 2 a 4 exhibits, 100 a 300 palavras, corpo 9pt |
| Título-rótulo ("Análise de mercado") | Título-conclusão |
| Seta gorda entre caixas; fluxograma de caixas arredondadas coloridas | Fio fino com ponta pequena, colchete, conector de zoom, chevron só em linha do tempo ou metodologia |
| Tudo simétrico e do mesmo tamanho | Hierarquia: um exhibit maior, apoios menores; colunas de larguras diferentes |
| Faixa colorida na lateral de cada card; sombra suave em tudo | Contorno fino ou nenhum; sombra só no recorte de notícia |
| Paleta com 4 ou 5 cores vivas | Uma cor, seus tons e cinzas |
| Texto explicando o gráfico ao lado, em parágrafo | Nota presa ao dado e conclusão no cabeçalho |

## 8. Procedimento por slide

1. **Mensagem** em uma frase (vira o título).
2. **Inventário** do que existe de fato: séries, composições, comparações, lugares, pessoas, falas, notícias, premissas, resultados. Sem dado, sem bloco.
3. **Função** de cada item (seção 4). Para cada função, escolha a forma que o dado permite; se o deck já usou essa forma no slide anterior, pegue a outra.
4. **Peso**: qual exhibit prova a mensagem? Ele leva a maior área. Os outros são apoio.
5. **Divisão** (seção 3) proporcional aos pesos. Nenhum quadrante vazio, nenhum exhibit espremido.
6. **Cabeçalhos** na convenção do deck, com a conclusão escrita e a unidade.
7. **Anotação**: para cada gráfico, qual é a leitura? Escolha a anotação que a diz (seção 5).
8. **Prova externa**, se houver: citação ou notícia no bloco onde ela sustenta o argumento.
9. **Fontes e notas**.
10. **Dois testes** antes de seguir: (a) lendo só título e cabeçalhos, a mensagem fecha? (b) posto ao lado de um slide do Kepler, do Orizon ou do Vibra, este parece do mesmo autor? Se parece uma página de site ou um dashboard, refaça a divisão e troque cards por exhibits.

Registre com `deck.decidir` (arranjo escolhido e duas alternativas descartadas), como antes.

## 9. Os decks de referência

| Deck | Tema | Paleta | Convenção de cabeçalho | O que ensina |
|---|---|---|---|---|
| KEPL3 (equity, 157 p.) | Kepler Weber | Laranja + grafite | Conclusão + legenda sublinhada | Colchete de CAGR, nota tracejada, conector de zoom para painel cinza, três painéis com faixa, equação com gráficos, cenários |
| M&A Bunge x Kepler (131 p.) | JV em armazenagem | Azul + preto (laranja para a segunda empresa) | "I. Conclusão" + legenda | Coluna de overview + linha do tempo + grade; tabela de deals com logos; chips de variação; calendário de safra; football field com comentários |
| Project Finance Kepler (39 p.) | Aluguel de silos | Laranja + preto | Conclusão + legenda sublinhada | Slides mais densos; número grande + texto; term sheet; fluxograma numerado; tabelas financeiras com linha destacada |
| Orizon x Solví (PPTX, 129 s.) | M&A em resíduos | Verde | Exhibit + leitura | Layouts de quadrantes; fontes e notas; premissas em chips; elipse no resultado; citação em faixa; recorte de notícia; cadeia de valor; tudo com gráfico e tabela nativos |
| Vivara (158 p.) | Equity varejo | Salmão + grafite | Frase-tese + legenda | Colunas encadeadas por reticências; etiqueta escura; nota clara; funil; scorecard de cenários; equação de build-up |
| Vibra (198 p.) | Equity distribuição | Verde + amarelo | Frase + legenda itálica | Seção em itálico sobre o título; painel cinza com lista numerada e "main takeaway"; tira de fatos; tabela-ranking mínima; mapa de calor com zona destacada |
| Nubank (184 p.) e Setorial Tech (70 p.) | Fintechs | Roxo; azul-petróleo | Frase-tese + legenda itálica | Gráficos muito limpos; painel com aba; lista de pinos com fórmula; círculos proporcionais; banda de pergunta |
| Rede D'Or (101 p.) | Tese de investimento | Azul + turquesa | "I. Título" + fio + legenda | Rótulos em caixa; grupos de colunas em caixa tracejada com etiqueta; matriz de risco com detalhe por risco; equação EV → equity |
| Hermès (132 p.) | Equity luxo | Laranja + lilás | "I. Título" com sub-itens numerados | Três colunas densas; fotos de produto e de campo; citações em várias posições; pirâmide; tornado |
| Agrion (104 p.) | Crédito agro | Verde | Exhibit + leitura | Aba escura sobre painel; cenários em três faixas; cards tracejados ligados |
| Tenda FUCAPE (65 p.) e Tenda USP (85 p.) | Equity construção | Vermelho | Faixa cheia | Tira de conclusão no pé do bloco; número + rótulo; ciclo em chevrons; tabela com logos |

Para ver as páginas de um deck que o usuário anexar de novo, use `scripts/extrair_referencias.py` e registre o que for novo aqui (seção 4 ou 5) e em `exhibits.md`.
