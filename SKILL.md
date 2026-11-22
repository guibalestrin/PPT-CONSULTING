---
name: "slides-consultoria-br"
description: "Cria slides de consultoria em PowerPoint (.pptx), em portugues, no padrao dos projetos Insper Jr (mercadologico, operacional, marketing/7Ps, financeiro de viabilidade), com revelacao progressiva, imagens e cards. Use para slides, deck ou entrega de consultoria."
---

# Slides de consultoria

Objetivo: deck em portugues que quem olha de fora nao percebe que foi feito por IA e que parece feito por um consultor da Insper Jr: organizacao, layout e forma de apresentar a informacao aprendidos dos decks Insper Jr do usuario (padrao desde 15/11/2026). As referencias valem pela **organizacao da informacao**, nunca pelo assunto, pela divisao exata ou pelas cores. Rodar a skill 100 vezes no mesmo pedido deve dar 100 decks no mesmo padrao de qualidade e todos diferentes.

## Escopo da skill: so consultoria Insper Jr

- **Sempre modo Insper Jr (nunca passe `modo` no config):** projetos de consultoria Insper Jr (mercadologico, operacional, marketing/7Ps, financeiro de viabilidade, pitch). Antes do primeiro slide, ler **`references/insperjr_padrao.md`**, a tabela **"Formas do framework"** deste arquivo (gramatica visual, revelacao progressiva, imagens, o que nao copiar) e as secoes do escopo em **`references/conteudo_escopos.md`** (o que cada escopo precisa provar e quais ferramentais usar). Titulo fixo de 26pt, subtitulo fixo de 14pt, corpo 11-12pt, 40 a 220 palavras por pagina, imagem/ilustracao grande permitida, cards com faixa (`formas.cardIJ`), placeholders de midia (`formas.midia`), revelacao progressiva (`deck.revelar`).
- **Fora do escopo:** equity research, M&A, valuation de empresa listada e credito. Se o usuario pedir isso, avise em uma frase que a skill nao cobre. Ignore o modo `financeiro` do codigo e as regras de densidade 9/8/7pt. Os slides de mercado financeiro da biblioteca (`assets/referencias/mercado_financeiro/`) **nao sao fora de escopo: servem de inspiracao de ORGANIZACAO** (caixa a esquerda com elementos a direita, blocos numerados, cadeia, mapa/foto, leitura de dado), nunca de assunto, densidade ou grafico copiado. Como usar: `references/estruturas_mercado.md`.
- O escopo Financeiro do Insper Jr (viabilidade do plano: premissas, receita, investimento, DRE, caixa, WACC/FCFF, valuation do plano) segue `conteudo_escopos.md` e a gramatica Insper Jr (`ijtheo_*`, `ijg5_*`, `ijg7_*`). Para ele, abra tambem slides de `mercado_financeiro/leitura_do_dado_e_destaque` e `fluxo_cadeia_e_linha_do_tempo` so para aprender a organizacao e a anotacao do dado, mantendo a gramatica Insper Jr.
- As regras abaixo que citam 9pt, 100 a 300 palavras, "2 a 4 exhibits" e "3 linhas" sao do legado financeiro e NAO se aplicam; valem os limites de `insperjr_padrao.md` (secao 2). Todo o resto (briefing, vetos Starbucks, proibicoes, fontes, placeholders, decidir, QA, entrega) vale nos dois modos.

## Identidade fixa da apresentação (revisão de 15/11/2026)

- Um único modelo de sumário por PowerPoint, escolhido ou sorteado uma vez e mantido nas revisões. Só o item ativo muda. Não alternar modelo, fundo, paleta, posições nem tipografia entre seções. Dimensionar pelo maior fluxo antes do sorteio.
- Uma única paleta conectada de três cores para todo o deck, capa e sumários: `paleta: { base60, secundaria30, destaque10 }`. Aproximadamente 60% para a base visual, 30% para apoio e 10% para ênfase. Branco ou grafite podem ser a base. Tons e neutros derivam dessas cores. A proporção orienta a composição, não é uma medição exata de pixels; fotografias e logos mantêm suas cores naturais. Não criar cor por seção.
- Tipografia fixa: título de conteúdo e de sumário 26pt; subtítulo de slide 14pt; cabeçalho de bloco 13,5pt; apoio de bloco 11,5pt; título de item do sumário 16pt e descrição 11,5pt. Se o título ficar longo, reescrever para caber em uma linha; nunca encolher a fonte. Subtítulo pode ter até duas linhas na caixa prevista, sem invadir o conteúdo.
- Ler `references/contraexemplos_huawei.md` e abrir os quatro prints antes de compor e revisar. Não recriar as composições reprovadas. `faixasNumeradasArco` é vetada no modo Insper Jr, mesmo que ainda exista no catálogo legado.
- Atualizar ou corrigir a própria skill não é um novo trabalho de slides: não iniciar briefing de deck nem exigir entrega de PPTX. Alterar os scripts, as referências e os controles afetados e testar o comportamento.

## Contrato de inicio e entrega (obrigatorio)

- **Antes de comecar cada novo trabalho, fazer as perguntas no painel de perguntas do Claude (`AskUserQuestion`) e aguardar a resposta.** Ler a secao "Padroes que dispensam pergunta" desta skill antes de perguntar (ela prevalece sobre `references/briefing.md`, que so serve de apoio); o formato do painel esta no proximo item. Nao pesquisar o tema, propor a narrativa, escrever conteudo, copiar assets, sortear estilos, executar o build ou gerar slides antes de concluir o briefing. Ler a propria skill e os anexos para identificar o que ja foi informado e permitido.
- **Fazer as perguntas pelo painel de perguntas do Claude (ferramenta `AskUserQuestion`), nao em texto corrido.** Ao executar a skill, depois de ler `references/briefing.md` (sem pesquisar nada antes), a PRIMEIRA acao e abrir esse painel. Se a ferramenta estiver diferida, carregue-a com ToolSearch (`select:AskUserQuestion`) e chame em seguida. O painel aceita 1 a 4 perguntas por chamada, 2 a 4 opcoes por pergunta (o usuario sempre pode digitar outra resposta em "Other"), `header` de ate 12 caracteres. Como o briefing tem mais itens, faca **ate 3 chamadas seguidas, sem texto entre elas** (so uma frase curta antes da primeira), e depois encerre o turno e aguarde:
  - **Chamada 1 (visual, 4 perguntas):** (a) *Barra lateral*: opcoes `Sortear entre as 7`, `A. Facetas low-poly`, `E. Chevrons`, `G. Curva com contorno`; na pergunta liste as 7 (A, B, E, F, G, H, I) e diga que B, F, H e I podem ser digitadas em Other; (b) *Paleta*: se o usuario ja mandou logos ou cores, ofereca 2 ou 3 paletas derivadas delas (três cores em hex com papéis de base 60%, apoio 30% e destaque 10%) e `Vou informar as cores`; sem logos, `Sugira opcoes depois de eu mandar as logos`; (c) *Fonte*: `Montserrat`, `Gill Sans MT`, `Dubai` (avisar que Montserrat precisa estar instalada); (d) *Dados*: `Pesquise por mim`, `Tenho os dados e vou anexar`, `Misto: anexo parte e voce pesquisa o resto`.
  - **Chamada 2 (estrutura, ate 2 perguntas):** escopo(s) e pergunta do cliente (`Mercadologico`, `Operacional`, `Marketing / 7Ps`, `Financeiro`; multiSelect), quantidade de slides (ex.: `5`, `8`, `12`, `Proponha a estrutura`). **NUNCA perguntar objetivo/publico, secoes do deck nem modelo de capa:** vale o que esta em "Padroes que dispensam pergunta".
  - **Chamada 3 (identificacao, so o que ainda faltar):** nome do trabalho e subtitulo, integrantes (sempre perguntar), empresa analisada, logos e fotos (`Vou anexar agora`, `Deixe como placeholder`). Para texto livre use opcoes de atalho (`Vou digitar`, `Deixe placeholder`) e o usuario escreve em Other.
  - Pule qualquer pergunta cuja resposta ja esteja no pedido ou nos anexos; nunca pergunte duas vezes a mesma coisa nem reaproveite briefing de outro trabalho. Se o pedido ja trouxer tudo, mostre o resumo e use o painel para a confirmacao (`Pode seguir` / `Quero ajustar`).
  - Se `AskUserQuestion` realmente nao existir na sessao (execucao agendada, sem tela), faca as mesmas perguntas em uma unica mensagem de texto agrupada por assunto. Isso so vale como fallback; com a ferramenta disponivel, o painel e obrigatorio. Estas instrucoes prevalecem sobre a frase "perguntas em texto" de `references/briefing.md`.
  - Depois das respostas, devolva o resumo do briefing (5 a 8 linhas, com a lista de titulos dos slides se a estrutura for sua) e confirme pelo painel (`Pode seguir` / `Quero ajustar`). Resposta que ja confirma e manda seguir dispensa nova rodada. A primeira resposta deve conter o painel ou a confirmacao; uma mensagem de progresso nao substitui essa etapa.
- **Aguardar de verdade:** encerrar a resposta inicial e esperar o usuario responder. Nao fazer perguntas e continuar produzindo no mesmo turno. Silencio, tempo decorrido ou ferramenta sem resposta nao sao confirmacao. Se ainda faltar uma decisao essencial, perguntar novamente so o que falta.
- Depois das respostas, resumir o briefing e pedir confirmacao. Se o usuario ja confirmar as escolhas e mandar seguir na propria resposta, considerar confirmado e executar sem outra rodada. Manter o briefing confirmado nas revisoes do mesmo trabalho; perguntar apenas sobre nova ambiguidade que altere o escopo.
- Somente um pedido **explicito** do usuario para seguir sem perguntas ou decidir por ele dispensa essa espera; um pedido curto, urgente ou com quantidade de slides nao e dispensa. Nesse caso, registrar as escolhas e lacunas. Nao inventar dados.
- **Toda entrega de slides, inclusive previa de um unico slide ou revisao, deve incluir um arquivo `.pptx` real, editavel, validado e acessivel por link.** O usuario nao precisa pedir esse formato. PNG, PDF, texto, roteiro, codigo e registro de decisoes sao complementos e nunca substituem o PowerPoint. A resposta de briefing ainda nao e uma entrega de slides.
- Nao perguntar qual formato entregar nem oferecer gerar o PPTX depois. Se houver falha de geracao, corrigir e tentar novamente; se o ambiente impedir a entrega, explicar o impedimento e nao anunciar sucesso nem apresentar uma imagem como entrega concluida.

## Padroes que dispensam pergunta

O usuario ja decidiu estes itens; nao pergunte, aplique e registre no resumo do briefing.

- **Publico:** sempre o cliente que contratou a consultoria. **Objetivo:** responder a pergunta do cliente do escopo (a pergunta continua sendo perguntada na chamada 2).
- **Modelo de capa:** escolha sozinho pelo contexto (`references/capas.md`) e diga qual no resumo; o que faltar vira placeholder.
- **Fluxo do escopo (obrigatorio):** todo escopo pedido traz o proprio fluxo de apresentacao, definido em `scripts/fluxos.js`. Ele e (1) a faixa de etapas **abaixo da linha divisoria de todo slide de conteudo** (etapa atual em negrito na dominante), (2) o arquivo **`fluxo_<escopo>.md`** gerado ao lado do `.pptx` (ordem, o que cada etapa deve conter, em quais slides aparece) e (3) pelo menos 1 slide de conteudo por escopo, senao o build falha; etapa sem slide gera aviso e entra no arquivo. Configure com `escopos: ['marketing']` (um ou mais, na ordem mercadologico, operacional, marketing, financeiro; o build recusa config sem `escopos`). Com varios escopos o rodape de cada slide mostra so o fluxo do escopo daquele slide. Etapas extras pedidas pelo usuario entram em `secoes` (as padrao precisam estar todas, na ordem). O usuario edita a ordem depois no PowerPoint. Entregue os `fluxo_*.md` junto com o `.pptx`.

| Escopo | Fluxo (faixa abaixo da linha) | O que cada etapa contem |
|---|---|---|
| `mercadologico` | Internacional > Nacional > Concorrencial > Tendencias > Riscos | cenario global; Brasil; quadro por concorrente e praticas a adotar; tendencias com implicacao; riscos e mitigacao, com o fecho situacao atual > dor do mercado > o que o mercado deseja (e onde e viavel) |
| `operacional` | Estrategias Operacionais > Fluxo de Entrada e Saida > Estrutura da Loja > Organograma > Jornada do Cliente > Fluxograma | variaveis, criterios competitivos, pilares, atracao e perda; fluxo do cliente, canais, fornecedores e CD; padrao de loja e ponto; pessoas e papeis; jornada presencial e online; processo e linha do tempo |
| `marketing` | Diagnostico > STP > Marketing Mix | 5Cs; clusters, persona, posicionamento, pilares, Golden Circle e branding; 7Ps (Produto, Praca, Processos, Evidencia fisica, Pessoas, Promocao, Preco) e retorno financeiro das iniciativas |
| `financeiro` | Premissas > Receitas e Custos > Investimento > Resultado e Caixa > Valuation | demanda, ticket, markup; build-up da receita, CMV, OPEX, unit economics; CAPEX, estoque, depreciacao; EBITDA a lucro liquido, caixa, divida, balanco; WACC, FCFF, DCF, TIR, VPL |

A ordem e o ponto de partida: cada slide escolhe o proprio arranjo pelo conteudo (nao repita estrutura). Mercadologico, Marketing e Financeiro seguem o que o usuario definiu; o fluxo Operacional segue o sumario do deck Grupo 7, e os agrupamentos dos itens dentro de cada etapa sao sugestao editavel.

## Vetos visuais do usuario: Starbucks, slides 5 e 6

**Nao criar slides no padrao dos slides 5 e 6 de Starbucks_Brasil_Analise_Mercadologica.pptx. O usuario reprovou os dois como desalinhados e com "cara de Claude".** Aplicar o veto a qualquer tema, empresa, paleta ou fonte. Nao usar esses slides como referencia positiva nem considerar os demais slides do deck aprovados por ausencia de critica.

Antes de escolher o arranjo e novamente na revisao visual, ler `references/contraexemplos_starbucks.md` e **abrir as duas imagens reprovadas** de `assets/contraexemplos/`. Comparar com as referencias positivas. Se a composicao reproduzir o mecanismo de um contraexemplo, recompor o miolo; trocar apenas cor, foto, borda, fonte, ordem das colunas ou tamanho nao resolve.

- **Veto do slide 5:** tabela larga de frases por marca + ranking simples abaixo + paragrafo e caixa de "leitura competitiva". Nao transformar descricao de concorrentes em tabela para parecer analise, nem usar texto conclusivo como segundo exhibit.
- **Veto do slide 6:** grafico de barras de pesquisa em uma metade + foto de produto na outra + paragrafos explicativos abaixo e nota metodologica conectada a uma barra. Nao contar foto contextual, paragrafo e nota de metodologia como provas analiticas independentes.
- **Condicao para entregar:** os exhibits precisam demonstrar a conclusao com evidencias especificas e articuladas. Anotacao deve mostrar uma leitura do dado; amostra, respostas multiplas e limites de inferencia vao em legenda ou rodape. Foto continua permitida como prova concreta, nao como preenchimento de meia pagina.

## PROTOCOLO (executar somente depois do briefing confirmado)

0. **Formas novas, sempre (rodada 3)**: no inicio de TODO deck, grave o bloco de codigo da secao "Formas fieis as referencias" como `formas_novas.js` na pasta de trabalho e carregue-o no build (`const N = require('./formas_novas.js')(pres, COR, F)`). Nao use `piramide3D` nem `funilPrismas`. Hierarquia/prioridade: `N.piramideFacetada`; conversao/perda por etapas: `N.funilTroncos`; visao geral de empresa ou setor: slide com `N.cardGrande` (UM unico card com tudo dentro) + `N.sanfona` + `N.linhaTempoFitas`; noticia ou site: `N.mockupNavegador`; coluna de graficos ao lado de texto: `N.cardGraficosAlto`. Em todo deck de 5+ slides use ao menos 2 dessas formas quando o conteudo permitir, variando entre decks, e registre em `deck.decidir` qual foi usada. Antes de entregar, rode `grep -c "piramide3D\|funilPrismas" build_deck.js`: se for maior que 0, refaca o slide.
1. **Copie a biblioteca visual**: `cp -r <skill>/assets/referencias ./referencias` (subpastas `insper_jr/<tipo>`, `mercado_financeiro/<estrutura>` e `sumario`; o que cada pasta contem esta em `referencias/INDICE.md`). O build falha sem ela.
2. **Antes do primeiro slide**: leia `referencias/INDICE.md`, `references/insperjr_padrao.md` e `references/estruturas_mercado.md` e rode `python3 -I sortear_referencias.py --inicial` (5 slides Insper Jr dos decks Theo, Grupo 5, Grupo 7 e case + 2 estruturas de mercado de pastas diferentes); **abra todos com Read**. Para cada slide de conteudo: (a) `python3 -I sortear_referencias.py --tipo <pasta_insper_jr> --n 2` com o tipo de informacao do slide (`abertura`, `diagnostico`, `publico`, `concorrencia`, `posicionamento`, `oferta_preco`, `canais`, `promocao`, `experiencia`, `operacao`, `financeiro`, `prova`, `revelacao`); (b) `python3 -I sortear_referencias.py --estrutura <pasta_de_mercado> --n 1` com a estrutura que a mensagem pede (tabela de escolha em `estruturas_mercado.md`); antes de cada `deck.sumario`, `--sumario --n 2`. Os dois sorteios cabem em uma chamada: `--tipo canais --estrutura caixa_esquerda_elementos_direita`. Os sorteados ficam em `referencias_vistas.txt`; sortear nao dispensa olhar. `--tipos` lista as pastas, `--listar <pasta>` lista os arquivos. Objetivo: aprender como foi construido (mensagem, divisao, anotacao, estrutura), nao copiar. O `deck.decidir` aceita os ids de qualquer pasta (nome do arquivo sem `.jpg`).
3. **Sorteio**: acontece sozinho no `moldura.js` (secao "Sorteio"). Nao escolha estilo por gosto nem por "o que parece melhor".
4. **Cada slide de conteudo**: descartar os padroes visuais reprovados em `references/contraexemplos_starbucks.md`; entao mensagem em uma frase (vira o titulo-conclusao) → inventario do que existe → funcao de cada item → exhibit principal (maior area) → 2 arranjos candidatos → escolha → `deck.decidir` (o build rejeita sem 2 referencias existentes, `aprendi`, 2+ exhibits e 2 alternativas). Detalhe em `references/arranjos.md` e `references/gramatica.md` secao 8.
   - **Antes de fechar o arranjo, consulte a tabela "Formas do framework"**: se a mensagem do slide e hierarquia, funil, camadas, pilares que se somam, etapas ou destaque, excluindo formas explicitamente reprovadas, a forma correspondente entra entre os 2 arranjos candidatos (e em `formas` do `deck.decidir` se escolhida). Se nenhuma serve, siga sem forcar.
5. **Depois de montar** (por lote de ate 3 slides, ver secao "Fidelidade das formas"): `qa_deck.py`, renderize e compare com as referencias (densidade, exhibits, anotacoes). Slide "limpo e bonito" e sinal de erro: as referencias sao densas. Conferir tambem os dois contraexemplos Starbucks: quantidade de exhibits, fonte correta e ausencia de erros tecnicos nao aprovam a composicao visual.

## Regras duras (o QA avisa, a trava barra)

- **Densidade**: titulo fixo de 26pt (reescrever se nao couber em uma linha), cabecalho de bloco 11pt, corpo 9pt, legenda/nota 8pt, micro-rotulo 7pt; 100 a 300 palavras por slide; nenhuma unidade de texto com mais de 3 linhas (so o painel de descricao da empresa passa); negrito em 2 a 5 palavras por frase.
- **Titulo afirma** (verbo + dado + consequencia). Nada de rotulo ("Analise de mercado") nem anuncio. Corpo afirma; ressalva vai numa nota curta no rodape (sem "hipoteses a validar" espalhadas).
- **Exhibits**: 2 a 4 diferentes por slide, um tipo por bloco, o principal com a maior area, nenhum quadrante vazio. Com pouco dado, 2 ou 3 blocos reais; sem dado, placeholder tracejado, nunca tabela de frases.
- **Todo grafico** e nativo (`formas.grafico`), sem grade nem eixo de valores, com rotulo direto e **1 a 3 anotacoes** (colcheteCagr, nota tracejada, elipse, faixa de periodo, linha de referencia) posicionadas pelo `plot` devolvido, variando o tipo entre graficos.
- **Uma cor dominante** + tons + cinzas; a cor marca uma coisa por exhibit. Miolo sem caixas; painel cinza so para aprofundamento (max. 1 ou 2 por slide).
- **Tabela** so para demonstracao, comparaveis, transacoes, ranking ou premissas: max. 1 por slide e < 25% dos slides.
- **Fonte em todo slide** (`deck.fontes`): fica no rodapé, abaixo da linha divisória, à direita do fluxo de seções e antes da logo. **Não existe rodapé de notas** (`deck.notas` foi removido): informação importante ou complementar vai para o apêndice ou para um slide seguinte de pop-up (`deck.revelar`). Numeros no padrao brasileiro, unidade junto, "E" em projetados, negativos entre parenteses em tabelas.
- **Prova externa** quando o assunto tiver: citacao com foto, recorte, foto do ativo, mapa (imagem ou placeholder descrito; nunca desenho improvisado).
- **Cards de organizacao sao permitidos e esperados** quando o slide pede explicar itens (pilares, frentes, canais, etapas, publicos): cards com titulo + texto curto, cards numerados/pilares, cards com icone de linha ou imagem no topo e caixas tracejadas de destaque (`cardsTracejados`, `painelAba`, `abas`, `fasesDegrau`), no formato dos decks de referencia (reto ou cantos discretos, cabecalho na cor do deck, sem sombra). Use todos os tipos que as referencias mostram, desde que facam sentido para o conteudo e encaixem na divisao do slide; varie o tipo de card entre slides.
- **Proibido** (denuncia IA): recomendacao final com tabela de texto + chips de KPI + roadmap de fases + faixa de conclusao; grade de cards identicos sem hierarquia (cards precisam variar de peso e ter conteudo diferente); **numero grande em fonte alta seguido de uma frase (`numeroTexto` em sequencia ou isolado como fecho de bloco)**; **lista vertical de pinos com texto corrido como unico conteudo de um quadrante (cara de bullet de Word)**; faixa colorida na lateral de cada card; sombra em tudo; seta gorda; fluxograma de caixas coloridas; 4 ou 5 cores vivas; paragrafo explicando o grafico; tudo simetrico; repetir estrutura de slide/sumario/sequencia de divisoes de outro deck. Detalhe do liberado/vetado e da recomendacao final: `references/vetos_e_recomendacao.md`. Contra-exemplo (Contem Cafe/Insper): `references/aprendizados.md`.
- **Nao assuma, sinalize**: dado, logo, nome ou numero que nao veio vira placeholder (`[DADO: ...]`, `[LOGO: ...]`, `[IMAGEM: ...]`) e entra na lista de pendencias.

## Fidelidade das formas e producao em lotes (rodada 2, 16/11/2026)

Feedback do usuario no teste Operacional (Café Brasa): o resultado geral foi satisfatorio, mas `funilPrismas`, `piramide3D` e `linhasCausaEfeito` sairam distorcidos em relacao ao que realmente existe nas referencias. Causa: as formas foram esticadas para preencher a area (hItem, gap, h, w maiores que o padrao) em vez de a divisao do slide ser pensada em volta delas. Regras novas:

1. **Antes de usar qualquer forma, abra `assets/mostruario_formas.jpg` e o slide `ij*` do mesmo tipo e compare.** A forma e usada nas proporcoes do mostruario: nao aumente `hItem`, `gap`, `h` ou `w` alem de uns 15% do padrao da assinatura. Se sobrar espaco, mude a divisao, junte outro exhibit ou aumente a imagem ao lado; nunca estique a forma. Pirâmide e funil agora usam `N.piramideFacetada` e `N.funilTroncos` (secao "Formas fieis as referencias"); `piramide3D` e `funilPrismas` estao aposentadas e nao entram mais em deck novo. Rotulo curto de 1 a 3 palavras, texto alinhado a esquerda da faixa.
2. **`linhasCausaEfeito` nao e uma lista solta.** No original (ijtheo_p047) o problema e a acao ficam DENTRO de um card cinza (`cardIJ` com fundo F2F2F2 ou painel sem faixa), com ilustracao ou foto grande no topo, icone grande de X vermelho / check verde ao lado do titulo em negrito, e abaixo duas colunas de 2 a 3 linhas de texto (causa) ligadas por seta preta longa ao efeito. Monte assim (um card por ideia, dois cards lado a lado, ou um por pagina de revelacao); nunca como linhas finas com seta pequena e vao grande no meio.
3. **Bug do `piramide3D` (aposentada):** nao se aplica a `N.piramideFacetada`, que ja escreve o rotulo em branco. Os sumarios desenham a logo do apresentador com `sizing contain`, que achata PNG quadrado e a deixa escura sobre fundo escuro: use no sumario uma versao branca com a proporcao da caixa (1,55 x 0,5) ou avise o usuario.
4. **Producao em lotes pequenos.** Muitos slides no mesmo prompt geram desalinhamento no fim. Monte e valide em lotes de ate 3 slides: build, `qa_deck.py`, renderizar (pdftoppm) e abrir cada slide em tamanho legivel, comparando com a referencia, antes do lote seguinte. Em pedidos com 6 ou mais slides, entregue o primeiro lote, peca aprovacao e so entao continue, a menos que o usuario peca tudo de uma vez.
5. **Ampliar o repertorio de organizacao, sempre variando.** Em cada deck, abra mais referencias do tipo (nao so 2) e use organizacoes diferentes entre slides: caixa a esquerda (UM unico retangulo alto, `N.cardGrande`, com o conteudo todo dentro) + quadrante a direita com grafico, imagem, card ou mapa (`deck.composicoes.caixaLateral` ou o slide de visao geral do item 7 abaixo, estrutura `caixa_esquerda_elementos_direita`), faixa de processo em cima + blocos embaixo, imagem protagonista com card ampliado, lista + painel de detalhe, blocos lado a lado com exhibits proprios, mapa/foto com legendas. Pense em pelo menos 1 slide por deck com a caixa lateral. O objetivo nao e repetir o mesmo resultado: cada rodada testa jeitos diferentes, o usuario aprova ou reprova e os reprovados viram contraexemplo.

## Formas fieis as referencias (rodada 3, 16/11/2026): receitas obrigatorias

O usuario reprovou `piramide3D` (plana, sem volume) e `funilPrismas` (prismas, nao e o funil usado no mercado) e enviou as referencias reais. Daqui em diante: pirâmide = `piramideFacetada`; funil = `funilTroncos`; e entram no repertorio `sanfona`, `mockupNavegador`, `cardGraficosAlto`, `linhaTempoFitas` e o slide de visao geral com card a esquerda. As formas antigas nao sao mais usadas (`piramide3D`, `funilPrismas`), a nao ser que o usuario peca. Para usar: grave o bloco de codigo abaixo como `formas_novas.js` na pasta de trabalho (junto dos outros scripts) e chame `const N = require('./formas_novas.js')(pres, COR, F)` (COR = { dom, escuro, texto, cinza } em hex sem #; F = fonte do deck). Medidas em polegadas, tudo forma nativa editavel. Com `deck.novoSlide`, passe o `s` do slide e as areas do `deck.blocos`; com pptxgenjs puro, use `pres.addSlide()`.

**O que cada forma e (geometria das imagens do usuario; nao esticar):**

1. **Pirâmide 3D facetada** (`N.piramideFacetada(s,{x,y,w,h,niveis:[{rot,sub}],cores})`, 3 a 4 niveis, topo para base). Cada nivel e um TRONCO DE PIRAMIDE visto de cima: a ponta do topo e uma pirâmide com ponta; os outros tem losango de topo (face de cima, mais escura) e losango de base. Tres faces com arestas BRANCAS finas (esquerda, direita, cima) e a aresta de tras da base aparece como duas linhas brancas em V invertido. Todos os troncos tem a mesma inclinacao (0,63 de largura por unidade de altura), ha um VAO branco entre niveis (19/125 da altura de um nivel) e o topo de cada tronco e um pouco mais largo que a base do de cima (sobra de ~10/125), deixando uma tira fina do losango visivel. Atras de cada nivel sai uma FAIXA retangular da mesma cor, na altura do nivel, comecando no eixo da pirâmide, cada uma mais longa que a de cima (0,80 / 0,94 / 1,00 da largura total); o rotulo fica dentro da faixa, a direita da lateral do tronco, alinhado a esquerda, branco, 1 a 3 palavras e, se quiser, uma linha curta embaixo. Cores: tres tons da paleta (destaque, destaque escuro, secundaria), uma por nivel; nao use degrade nem sombra. Proporcao: largura da pirâmide ~1,1 da altura; nunca estique.
2. **Funil de troncos de cone** (`N.funilTroncos(s,{x,y,wFunil,itens:[{rot,titulo,texto}]})`, 3 a 5 etapas). Cada etapa e um tronco de cone visto de cima: elipse de topo (mais escura, mesmo tom escurecido 38%), corpo com a base CURVA e uma ELIPSE BRANCA com sombra no meio do corpo contendo o rotulo curto (1 a 3 palavras). As etapas ficam empilhadas encostadas (a elipse da proxima cobre a base da anterior), largura 1 / 0,81 / 0,65 / 0,51 da primeira, cores do escuro para o claro (uma rampa da paleta). Texto de cada etapa a direita, com pontilhado saindo da elipse branca: titulo no destaque e uma linha de texto. Altura total = ~1,2 x a largura (wFunil 3,4 a 4,2 cabe no miolo). Se faltar espaco, reduza wFunil; nao estique em altura.
3. **Sanfona** (`N.sanfona(s,{x,y,w,h,segmentos:[{peso:275,alt:0.72},{dobra:true,peso:105},{peso:199,alt:1}],ocultarPrimeiro})`): fundo cinza dobrado em perspectiva: painel baixo, DOBRA (trapezio mais claro que liga a altura do baixo a do alto) e painel alto. Devolve as areas planas para colocar conteudo (texto no baixo, grafico ou imagem no alto). Pode encadear baixo-dobra-alto-dobra-baixo. Com `ocultarPrimeiro:true` desenha so a dobra e o painel alto (painel cinza do slide de visao geral, que parece sair do grafico ao lado).
4. **Mockup de navegador** (`N.mockupNavegador(s,{x,y,w,h,url,marca,titulo,texto})`): janela cinza clara com 3 bolinhas, barra de endereco com a URL, e conteudo branco com selo da marca, manchete em negrito e 1 a 2 linhas de texto. Use para noticia, site ou pagina digital da empresa (substitui o MOCKUP de celular quando o assunto e site/noticia). Marca generica, nunca logo real de terceiros sem o usuario mandar.
5. **Card alto de graficos** (`N.cardGraficosAlto(s,{x,y,w,h,secoes:[{titulo,linhas:[[texto,destaque]],tipo:'linha'|'barras',dados:[{r,v}]}]})`): coluna estreita e alta, branca, com bloco deslocado na cor de destaque a direita e embaixo; cada secao empilhada tem tracinho de destaque + titulo de leitura (a conclusao) + frase com palavras-chave em destaque + grafico pequeno com os valores em etiquetas arredondadas. 2 secoes por card. Serve ao lado de um texto ou foto.
6. **Linha do tempo em fitas** (`N.linhaTempoFitas(s,{x,y,w,itens:[{ano,texto}]})`): fitas paralelogramo encadeadas com o ano dentro, tom alternado e pequena dobra escura embaixo a esquerda; o texto de cada marco alterna em cima e embaixo, ligado por traco vertical fino. 4 a 6 marcos.
7. **Slide de visao geral com card a esquerda** (organizacao `caixa_esquerda_elementos_direita`, a mesma de `composicoes.caixaLateral`, em versao completa): titulo + subtitulo com a frase-chave em destaque; a esquerda UM UNICO CARD (um retangulo grande e alto, NUNCA dividido em varios blocos/cards separados) e todos os elementos entram DENTRO dele, empilhados: `const ci = N.cardGrande(s,{x,y,w,h})` desenha o corpo cinza claro (F2F2F2) com faixa escura em cima e embaixo e lateral direita em perspectiva (mesmo visual do card alto de graficos) e devolve a area interna `ci`; dentro dela vao, de cima para baixo, titulos com tracinho de destaque ("Sobre a empresa" com 3 linhas icone + frase curta em negrito, "I. ..." com mapa/imagem, "II. ..." com barras comparativas, a primeira barra na cor de destaque e as outras em cinza), separados so por espaco, sem caixas, bordas ou etiquetas internas; o card ocupa a altura toda do miolo a esquerda (cerca de 5,5 pol); no centro um grafico (pizza com legenda); a direita o PAINEL CINZA da sanfona (`ocultarPrimeiro:true`) com 2 graficos numerados ("IV.", "V."); embaixo a linha do tempo em fitas com 5 a 6 marcos; rodape com trilha de secoes e a fonte. Numerais romanos so nos titulos dos blocos de grafico. Use quando o conteudo for visao geral de empresa ou setor com 4 a 6 dados de tipos diferentes; nao use em todo deck e nao copie o texto do exemplo.

**Regras de uso:** (a) antes de montar, abra a imagem do usuario ou o mostruario e compare com o render; (b) use ao menos 2 destas formas novas em decks de 5+ slides quando o conteudo pedir (hierarquia, conversao, visao geral, noticia/site), variando entre decks, como manda o passo 0 do protocolo; (c) sempre confira no render que o texto da faixa/elipse cabe em uma linha e que a pirâmide mostra os losangos e as arestas brancas; (d) o QA do framework nao conhece estas formas: confira alinhamento a olho no render e mantenha 1 forma grande por quadrante.

```js
// formas_novas.js (gravar na pasta de trabalho)
module.exports = function (pres, COR, F) {
  const S = pres.shapes;
  const tom = (hex, f) => { const n = parseInt(hex, 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(f >= 0 ? v + (255 - v) * f : v * (1 + f))); return c.map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase(); };
  const txt = (s, t, o) => s.addText(t, Object.assign({ fontFace: F, margin: 0, isTextBox: true, valign: 'middle', color: COR.texto }, o));
  function poly(s, pts, opt) {
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys);
    const points = pts.map(p => ({ x: p[0] - x0, y: p[1] - y0 })); points.push({ close: true });
    s.addShape(S.CUSTOM_GEOMETRY, Object.assign({ x: x0, y: y0, w: Math.max(Math.max(...xs) - x0, 0.01), h: Math.max(Math.max(...ys) - y0, 0.01), points }, opt));
  }
  function seg(s, x1, y1, x2, y2, line) { s.addShape(S.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipV: (x2 - x1) * (y2 - y1) < 0, line }); }
  function piramideFacetada(s, { x, y, w, h, niveis, cores }) {
    const n = niveis.length, H = 125, g = 19, m = 0.63, sh = 10, k = 0.18, wt = [], wb = [];
    for (let i = 0; i < n; i++) { wt[i] = i === 0 ? 0 : wb[i - 1] + sh; wb[i] = wt[i] + m * H; }
    const natW = 2 * wb[n - 1], natH = (n - 1) * (H + g) + H + k * wb[n - 1], f = h / natH, cx = x + natW * f / 2;
    cores = cores || [COR.dom, tom(COR.dom, -0.4), COR.escuro, tom(COR.dom, 0.45)].slice(0, n);
    const X = (u) => cx + u * f, Y = (v) => y + v * f, ytop = (i) => i * (H + g), ybot = (i) => i * (H + g) + H;
    niveis.forEach((nv, i) => {
      const fim = x + w * (n === 1 ? 1 : 0.8 + 0.2 * i / (n - 1)), y0 = Y(ytop(i)), hh = H * f;
      s.addShape(S.RECTANGLE, { x: cx, y: y0, w: fim - cx, h: hh, fill: { color: cores[i] }, line: { type: 'none' } });
      const xt = X(wb[i]) + 0.18;
      txt(s, nv.sub ? [{ text: nv.rot, options: { bold: true, fontSize: 13, breakLine: true } }, { text: nv.sub, options: { fontSize: 10.5 } }] : [{ text: nv.rot, options: { bold: true, fontSize: 13 } }], { x: xt, y: y0, w: fim - xt - 0.15, h: hh, color: 'FFFFFF', align: 'left' });
    });
    const BR = { color: 'FFFFFF', width: 0.75 };
    for (let i = n - 1; i >= 0; i--) {
      const c = cores[i], Lt = [X(-wt[i]), Y(ytop(i))], Rt = [X(wt[i]), Y(ytop(i))], Bt = [X(0), Y(ytop(i) + k * wt[i])], Kt = [X(0), Y(ytop(i) - k * wt[i])];
      const Lb = [X(-wb[i]), Y(ybot(i))], Rb = [X(wb[i]), Y(ybot(i))], Fb = [X(0), Y(ybot(i) + k * wb[i])], Kb = [X(0), Y(ybot(i) - k * wb[i])];
      if (i > 0) poly(s, [Lt, Kt, Rt, Bt], { fill: { color: tom(c, -0.3) }, line: BR });
      poly(s, i === 0 ? [Bt, Lb, Fb] : [Lt, Bt, Fb, Lb], { fill: { color: c }, line: BR });
      poly(s, i === 0 ? [Bt, Fb, Rb] : [Bt, Rt, Rb, Fb], { fill: { color: c }, line: BR });
      seg(s, Lb[0], Lb[1], Kb[0], Kb[1], BR); seg(s, Kb[0], Kb[1], Rb[0], Rb[1], BR);
    }
  }
  function funilTroncos(s, { x, y, wFunil = 3.4, itens, cores, wLado = 4.2 }) {
    const n = itens.length, esc = [1, 0.812, 0.649, 0.509, 0.40], W0 = wFunil;
    cores = cores || [COR.escuro, tom(COR.dom, -0.25), COR.dom, tom(COR.dom, 0.5), tom(COR.dom, 0.7)].slice(0, n);
    const k = W0 / 687, pit = 203 * k, ry0 = 33 * k;
    itens.forEach((it, i) => {
      const W = W0 * esc[i], ry = ry0, cx = x + W0 / 2, cy = y + ry0 + i * pit, xi = cx - W / 2;
      const drop = 159 * k, wBase = W * 0.76, dx = (W - wBase) / 2, rb = ry0 * 0.75;
      s.addShape(S.CUSTOM_GEOMETRY, { x: xi, y: cy, w: W, h: drop + rb * 1.05, fill: { color: cores[i] }, line: { type: 'none' },
        points: [{ x: 0, y: 0 }, { x: dx, y: drop }, { x: W - dx, y: drop, curve: { type: 'cubic', x1: dx + wBase * 0.06, y1: drop + rb * 1.45, x2: W - dx - wBase * 0.06, y2: drop + rb * 1.45 } }, { x: W, y: 0 }, { close: true }] });
      s.addShape(S.OVAL, { x: xi, y: cy - ry, w: W, h: 2 * ry, fill: { color: tom(cores[i], -0.38) }, line: { type: 'none' } });
      const hw = W * (0.546 + 0.055 * i), hh = Math.max(0.36, 70 * k), yh = cy + drop * 0.56 - hh / 2;
      s.addShape(S.OVAL, { x: cx - hw / 2, y: yh, w: hw, h: hh, fill: { color: 'FFFFFF' }, line: { type: 'none' }, shadow: { type: 'outer', blur: 4, offset: 2, angle: 90, color: '000000', opacity: 0.3 } });
      txt(s, it.rot, { x: cx - hw / 2, y: yh, w: hw, h: hh, fontSize: 11, bold: true, color: COR.escuro, align: 'center' });
      if (it.titulo) {
        const yl = yh + hh / 2, xl = x + W0 + 0.25;
        seg(s, cx + hw / 2 + 0.08, yl, xl - 0.08, yl, { color: COR.cinza || 'A6A6A6', width: 0.75, dashType: 'sysDot' });
        txt(s, [{ text: it.titulo, options: { bold: true, fontSize: 12, color: COR.dom, breakLine: true } }, { text: it.texto || '', options: { fontSize: 10.5 } }], { x: xl, y: yl - 0.38, w: wLado, h: 0.76, align: 'left' });
      }
    });
  }
  function sanfona(s, { x, y, w, h, segmentos, cor = 'E3E3E3', ocultarPrimeiro = false }) {
    const tot = segmentos.reduce((a, b) => a + b.peso, 0), areas = []; let xi = x;
    segmentos.forEach((sg, i) => {
      const wi = w * sg.peso / tot, hi = h * (sg.alt || 1), yi = y + (h - hi) / 2;
      if (sg.dobra) { const a = segmentos[i - 1], b = segmentos[i + 1], ha = h * (a.alt || 1), hb = h * (b.alt || 1);
        poly(s, [[xi, y + (h - ha) / 2], [xi + wi, y + (h - hb) / 2], [xi + wi, y + (h + hb) / 2], [xi, y + (h + ha) / 2]], { fill: { color: tom(cor, 0.35) }, line: { type: 'none' } });
      } else { if (!(ocultarPrimeiro && i === 0)) s.addShape(S.RECTANGLE, { x: xi, y: yi, w: wi, h: hi, fill: { color: cor }, line: { type: 'none' } }); areas.push({ x: xi, y: yi, w: wi, h: hi }); }
      xi += wi;
    });
    return areas;
  }
  function mockupNavegador(s, { x, y, w, h, url, marca, titulo, texto, corMarca = 'C4170C' }) {
    s.addShape(S.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.06, fill: { color: 'F2F2F2' }, line: { color: 'BFBFBF', width: 0.75 } });
    ['FF5F57', 'FEBC2E', '28C840'].forEach((c, i) => s.addShape(S.OVAL, { x: x + 0.12 + i * 0.17, y: y + 0.1, w: 0.1, h: 0.1, fill: { color: c }, line: { type: 'none' } }));
    s.addShape(S.ROUNDED_RECTANGLE, { x: x + 0.12, y: y + 0.3, w: w - 0.4, h: 0.22, rectRadius: 0.05, fill: { color: 'FFFFFF' }, line: { color: 'D0D0D0', width: 0.5 } });
    txt(s, url, { x: x + 0.22, y: y + 0.3, w: w - 0.6, h: 0.22, fontSize: 7.5, color: '595959', align: 'left' });
    s.addShape(S.OVAL, { x: x + w - 0.2, y: y + 0.34, w: 0.12, h: 0.12, fill: { color: corMarca }, line: { type: 'none' } });
    const cy = y + 0.6;
    s.addShape(S.RECTANGLE, { x: x + 0.1, y: cy, w: w - 0.2, h: h - 0.7, fill: { color: 'FFFFFF' }, line: { type: 'none' } });
    s.addShape(S.RECTANGLE, { x: x + w / 2 - 0.22, y: cy + 0.08, w: 0.44, h: 0.26, fill: { color: corMarca }, line: { type: 'none' } });
    txt(s, marca, { x: x + w / 2 - 0.22, y: cy + 0.08, w: 0.44, h: 0.26, fontSize: 10, bold: true, color: 'FFFFFF', align: 'center' });
    txt(s, [{ text: titulo, options: { bold: true, fontSize: 10, breakLine: true } }, { text: texto, options: { fontSize: 8.5 } }], { x: x + 0.2, y: cy + 0.42, w: w - 0.4, h: h - 1.2, valign: 'top', align: 'left' });
  }
  function cardGraficosAlto(s, { x, y, w, h, secoes }) {
    s.addShape(S.RECTANGLE, { x: x + 0.07, y: y + 0.07, w, h, fill: { color: COR.dom }, line: { type: 'none' } });
    s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: 'FFFFFF' }, line: { color: 'D9D9D9', width: 0.5 } });
    const hs = (h - 0.2) / secoes.length;
    secoes.forEach((sc, i) => {
      const y0 = y + 0.12 + i * hs;
      s.addShape(S.RECTANGLE, { x: x + 0.12, y: y0 + 0.02, w: 0.07, h: 0.22, fill: { color: COR.dom }, line: { type: 'none' } });
      txt(s, sc.titulo, { x: x + 0.26, y: y0, w: w - 0.4, h: 0.26, fontSize: 11, bold: true, color: COR.dom, align: 'left' });
      txt(s, sc.linhas.map(([t, d]) => ({ text: t, options: { color: d ? COR.dom : COR.texto, bold: !!d } })), { x: x + 0.12, y: y0 + 0.28, w: w - 0.24, h: 0.34, fontSize: 9.5, align: 'left', valign: 'top' });
      const gx = x + 0.2, gw = w - 0.4, gy = y0 + 0.78, gh = hs - 1.12, d = sc.dados, mx = Math.max(...d.map(z => z.v)), mn = Math.min(...d.map(z => z.v)), pas = gw / d.length;
      const pill = (cx, cy, v) => { s.addShape(S.ROUNDED_RECTANGLE, { x: cx - 0.2, y: cy - 0.1, w: 0.4, h: 0.2, rectRadius: 0.04, fill: { color: COR.dom }, line: { type: 'none' } });
        txt(s, String(v).replace('.', ','), { x: cx - 0.2, y: cy - 0.1, w: 0.4, h: 0.2, fontSize: 8, bold: true, color: 'FFFFFF', align: 'center' }); };
      if (sc.tipo === 'linha') {
        const pts = d.map((z, j) => [gx + pas * (j + 0.5), gy + gh * 0.3 + (gh * 0.6) * (1 - (z.v - mn) / Math.max(mx - mn, 1e-6))]);
        pts.slice(1).forEach((p, j) => seg(s, pts[j][0], pts[j][1], p[0], p[1], { color: COR.escuro, width: 2 }));
        pts.forEach((p, j) => { s.addShape(S.OVAL, { x: p[0] - 0.04, y: p[1] - 0.04, w: 0.08, h: 0.08, fill: { color: COR.escuro }, line: { type: 'none' } }); pill(p[0], p[1] - 0.2, d[j].v); });
      } else {
        d.forEach((z, j) => { const bh = Math.max(0.12, gh * 0.8 * z.v / mx), bx = gx + pas * j + pas * 0.18;
          s.addShape(S.RECTANGLE, { x: bx, y: gy + gh - bh, w: pas * 0.64, h: bh, fill: { color: COR.escuro }, line: { type: 'none' } }); pill(bx + pas * 0.32, gy + gh - bh - 0.14, z.v); });
      }
      d.forEach((z, j) => txt(s, z.r, { x: gx + pas * j, y: gy + gh + 0.04, w: pas, h: 0.18, fontSize: 7.5, align: 'center' }));
      if (i < secoes.length - 1) seg(s, x + 0.12, y0 + hs - 0.04, x + w - 0.12, y0 + hs - 0.04, { color: 'E0E0E0', width: 0.5 });
    });
  }
  function cardGrande(s, { x, y, w, h, d = 0.1, bb = 0.14 }) {   // UM retangulo alto com os elementos dentro; devolve a area interna
    poly(s, [[x, y + d], [x + d, y], [x + w + d, y], [x + w, y + d]], { fill: { color: COR.escuro }, line: { type: 'none' } });
    poly(s, [[x + w, y + d], [x + w + d, y], [x + w + d, y + h - d], [x + w, y + h]], { fill: { color: 'BFBFBF' }, line: { type: 'none' } });
    s.addShape(S.RECTANGLE, { x, y: y + d, w, h: h - d, fill: { color: 'F2F2F2' }, line: { type: 'none' } });
    s.addShape(S.RECTANGLE, { x, y: y + h - bb, w, h: bb, fill: { color: COR.escuro }, line: { type: 'none' } });
    return { x: x + 0.15, y: y + d + 0.12, w: w - 0.3, h: h - d - bb - 0.24 };
  }
  function linhaTempoFitas(s, { x, y, w, itens, hFita = 0.5, hTexto = 0.6 }) {
    const n = itens.length, sl = 0.2, pas = (w - sl) / n, wf = pas + sl * 0.7;
    itens.forEach((it, i) => {
      const xi = x + i * pas, cor = i % 2 ? tom(COR.dom, -0.2) : COR.dom;
      poly(s, [[xi + sl, y], [xi + wf, y], [xi + wf - sl, y + hFita], [xi, y + hFita]], { fill: { color: cor }, line: { color: 'FFFFFF', width: 0.75 } });
      poly(s, [[xi, y + hFita], [xi + sl * 0.9, y + hFita], [xi + sl * 0.9, y + hFita + 0.1]], { fill: { color: COR.escuro }, line: { type: 'none' } });
      txt(s, it.ano, { x: xi + sl, y, w: wf - 2 * sl, h: hFita, fontSize: 13, bold: true, color: 'FFFFFF', align: 'center' });
      const cxm = xi + wf / 2, cima = i % 2 === 0;
      seg(s, cxm, cima ? y - 0.18 : y + hFita, cxm, cima ? y : y + hFita + 0.18, { color: COR.escuro, width: 1 });
      txt(s, it.texto, { x: cxm - pas * 0.5, y: cima ? y - 0.18 - hTexto : y + hFita + 0.2, w: pas, h: hTexto, fontSize: 9, align: 'center', valign: cima ? 'bottom' : 'top' });
    });
  }
  return { cardGrande, tom, poly, seg, piramideFacetada, funilTroncos, sanfona, mockupNavegador, cardGraficosAlto, linhaTempoFitas };
};
```

## Sorteio e sumários

`moldura.js` sorteia uma vez por projeto a barra lateral e a identidade tipográfica permitida. O cabeçalho Insper Jr é sempre marcador. O sumário tem UM modelo, salvo em `estilo_deck.json` e `identidade_visual.json`; não um conjunto para alternar. `estiloSumario` aceita `circulos`, `pilulas`, `paralelogramos` ou `cartoes` (até cinco itens). Configuração legada `estilosSumario` aceita somente uma opção. Projeto novo pode mudar; dentro da apresentação, manter.

Antes do primeiro sumário, abrir duas referências. As próximas transições reutilizam o mesmo modelo; só o destaque da etapa avança. `deck.sumario('Etapa')` calcula os itens a partir do fluxo. Títulos e descrições devem caber no tamanho fixo; encurtar o texto, não reduzir a fonte. Mais de seis etapas usam uma grade de duas colunas sem interseções, ou conteúdo dividido com o mesmo modelo e aprovação do escopo quando isso mudar a quantidade de slides.

O primeiro fundo, imagem e tratamento de cor do sumário ficam fixos no deck. Escolher exclusivamente dentro da paleta 60/30/10. Não variar fundo por seção. Detalhes em `references/sumarios_popups.md`.

## Vetos tipograficos e cabecalho (Insper Jr)

Nunca use travessao, meia-risca, sinal de menos nem ponto medio (caracteres U+2014, U+2013, U+2212, U+00B7) em nenhum texto, titulo, rotulo de grafico ou placeholder: dao cara de IA. Use "a" em faixas ("25 a 40"), hifen em rotulos ("D-60", "-8%") e "|" ou virgula como separador. O cabecalho de bloco e sempre a barrinha (`marcador`). `finalizar` falha e o QA acusa erro se sobrar algum. Detalhes em `references/insperjr_padrao.md`, secao 9.

## Formas do framework (candidatas por tipo de conteudo)

Sao 19 funcoes de `formas.js` (assinaturas em `references/formas.md`, imagem em `assets/mostruario_formas.jpg`). Funcionam no modo Insper Jr, ja saem na paleta e na escala do deck. **Sao candidatas, nao obrigacao**: cada slide escolhe o arranjo pelo conteudo e o deck nao repete a mesma forma em slides vizinhos. Quando a mensagem do slide cai em uma linha abaixo, a forma deve estar entre os 2 arranjos candidatos do `deck.decidir`.

| A mensagem do slide e... | Forma | Exemplos nas secoes padrao |
|---|---|---|
| Hierarquia, prioridade, base x topo (3 a 4 niveis) | `piramideFacetada` (receita em "Formas fieis as referencias"; `piramide3D` do framework esta REPROVADA: sai plana) | Criterios competitivos (baixa relevancia, qualificadores, ganhadores); necessidades da persona |
| Perda ou conversao progressiva entre etapas | `funilTroncos` (receita em "Formas fieis as referencias"; `funilPrismas` esta REPROVADO: nao e o funil que o pessoal usa) | Atracao e perda de clientes; fluxo do cliente na loja; retencao |
| Camadas ou 2 a 4 leituras do mesmo dado | `lajesEmpilhadas` | Pilares de desempenho (onde se diferencia, onde evolui); camadas de oferta |
| Agenda ou etapas numeradas | Outra estrutura de sequência baseada em referência positiva | `faixasNumeradasArco` foi reprovada; não usar |
| Itens paralelos que se SOMAM em um resultado | `colunasEquacao` | 3 pilares do STP e do branding; Golden Circle; proposta de valor |
| 3 pilares ou frentes ligados entre si | `cardsLigados` | Pilares da marca; frentes do plano |
| Dimensoes ou abas, com uma em foco | `chipsHexagonais` | Perfil, comportamento, dores e o que busca (persona) |
| Fases que andam em sequencia, com foto | `cardsParalelogramo` | Jornada do cliente; etapas da operacao |
| 2 a 4 componentes que formam um todo | `cubosLinhasGuia`, `tubosTampa` | Variaveis operacionais; composicao da receita |
| Um numero-chave com unidade e nota | `kpiLosango`, `gradeKpiLosango` | Retorno financeiro das iniciativas (so ao lado do grafico que o prova) |
| Texto ou imagem com titulo preso a borda | `caixaEtiqueta`, `cardAba`, `molduraDeslocada` | Card de concorrente; destaque de foto ou de grafico |
| Conclusao, ponto de atencao, tese e explicacao | `caixaFita`, `chamadaConector` | Fecho de bloco (nunca como faixa de conclusao de recomendacao) |
| Fala de especialista, cliente ou entrevistado | `cartaoCitacao` | Pesquisa com clientes; prova externa |
| Numero de secao ou bloco | `marcadorHexagonal` | Apendice, blocos numerados |

O `deck.finalizar` imprime quantas das 19 formas o deck usou e avisa quando um deck de 5+ slides nao usa nenhuma. Cuidado com o veto da recomendacao final: `caixaFita` e `chamadaConector` nao formam, junto com tabela, KPIs e roadmap, o slide de recomendacao (`vetos_e_recomendacao.md`). O `assets/exemplo_build_deck.js` mostra 5 slides de escopos diferentes, cada um com uma organizacao distinta, usando varias dessas formas.

## Materiais de origem ja incorporados (nao sao usados em tempo de execucao)

Alguns arquivos entraram uma unica vez e seu conteudo ja foi absorvido pela skill. Eles ficam so como registro de origem e nao precisam ser abertos para montar um deck.

- **`assets/framework_formas.pptx`** (10 slides do repertorio do usuario): cada forma virou uma funcao de `scripts/formas.js` (as 19 da tabela acima) e esta documentada em `references/formas.md`. O `assets/mostruario_formas.jpg` e a versao renderizada. Para criar forma nova, comece pelo PPTX; para usar, chame a funcao.
- **Decks de referencia Insper Jr** (Theo, Grupo 5, Grupo 7, case): viraram `assets/referencias/insper_jr/<tipo>/` (sorteadas pelo protocolo), `references/insperjr_padrao.md`, `conteudo_escopos.md` e a ordem padrao das secoes.
- **Reprovacoes do usuario** (Starbucks 5 e 6, 7 recortes Insper Jr): viraram `assets/contraexemplos/`, `proibicoes.js` e os vetos deste arquivo.
- **Slides de mercado financeiro** (equity research, M&A, project finance): viraram `assets/referencias/mercado_financeiro/<estrutura>/`, organizados pelo mecanismo de organizacao (nao pelo assunto) e documentados em `references/estruturas_mercado.md`. O codigo ganhou `deck.composicoes.caixaLateral` para a estrutura caixa a esquerda + elementos a direita. O modo `financeiro` do codigo e as densidades 9/8/7pt continuam fora de uso.
- **Pasta `sumario/`** (sumarios que o usuario separou): agora em `assets/referencias/sumario/`, sorteada com `--sumario` antes de cada `deck.sumario`.

## Vetos de estrutura de dados (Insper Jr)

O usuario reprovou 7 recortes (`assets/contraexemplos/ij_reprovado_*.png`): lista numerada, faixa de KPIs com fios, tres colunas "por que focar / por que nao / como" com cabecalho sublinhado, lista de categorias com fio, chips de valor. No modo Insper Jr as funcoes `tiraFatos`, `listaPinos`, `listaNumeros`, `listaCategorias`, `premissas` e `linhaValores` lancam erro. Use `blocoIcone`, `medidorCirculo`, `linhasCausaEfeito`, `painelLeitura`, `cardIJ`, `midia` e anotacao no grafico. Leia `references/contraexemplos_insperjr.md` (tabela de substituicao) antes de montar o primeiro slide.

## Revelacao progressiva (Insper Jr)

Decisao do usuario (15/11/2026): como nos PDFs Insper Jr, a revelacao e feita com **copias do slide com estados**, nao com animacao. `deck.revelar('Secao', n, (s, estado, ctx) => { ...desenha o slide inteiro...; if (!ctx.base) ctx.destacar(rects, estado) })` gera a pagina-base e n paginas (ate 6). `ctx.popup`, `ctx.esmaecer`, `formas.conectorZoom` e `formas.cardIJ` abrem o card ampliado. Um `deck.decidir` por slide revelado (com `revelacao: n`). As quatro formas, quando usar e quando nao usar: `insperjr_padrao.md`, secao 4.

## Imagens, videos e mockups (Insper Jr)

Ilustracao isometrica 3D, personas e icones coloridos gerados sao aceitos. A skill nao gera imagem: use `formas.midia(s, { tipo: 'IMAGEM'|'VIDEO'|'MOCKUP', descricao, moldura?: 'celular'|'notebook' })`, que desenha placeholder grande com o prompt/briefing da peca. Protótipos de site/app/campanha sao SEMPRE `[MOCKUP: ...]` (nao desenhar interface). Detalhe: `insperjr_padrao.md`, secao 5.

## Proporcao de grafico em consultoria

Parte da biblioteca legada e de mercado financeiro (muito grafico). O slide de consultoria NAO segue essa proporcao: ela varia por slide (diagnostico com mais dado; mix, marca, canais e recomendacoes com mais imagem, cards e texto explicativo). Regras:

- Grafico so quando o dado e central para a mensagem; nao force um grafico em todo slide nem um grafico por quadrante.
- Cada item explicado ganha estrutura visual propria: card com titulo e 2 a 3 linhas (o que, por que, resultado), imagem real ou placeholder grande descrito, esquema com formas das referencias (cadeia, jornada, 4Ps, matriz, mapa de posicionamento). Texto explicativo e esperado em consultoria, dentro do limite de 3 linhas por unidade e 100 a 300 palavras por slide.
- Quadrante de campanhas, produtos, canais ou publicos: imagens e cards, nunca lista de pinos com bullets curtos.
- Antes de montar, pergunte (ou leia nos anexos) se ha decks de consultoria de marketing de referencia; se o usuario anexar, extraia os padroes de cards, imagens e texto com `extrair_referencias.py` e registre em `deck.decidir`.
- A referencia principal e sempre um slide `insper_jr/` do mesmo tipo de informacao; os slides de `mercado_financeiro/` entram como segunda referencia, para a estrutura de organizacao (`estruturas_mercado.md`), sem trazer o grafico nem a densidade deles.
- Marketing, mercadologico e operacional usam mais imagem, card e esquema; o Financeiro usa grafico e quadro de numeros, sempre na gramatica Insper Jr.

## Estrutura do deck

1. **Capa**: um dos modelos de `references/capas.md`; a estrutura e copiada literalmente, so mudam imagens, logos, cores e textos do caso (troque tudo que e da marca da referencia).
2. Para cada etapa do fluxo do escopo: **sumario/transicao** + slides de conteudo (o fluxo aparece abaixo da linha em todos eles).
3. Moldura fixa em todo slide exceto a capa (barra lateral sorteada, linha divisoria que termina perto do logo inferior, fluxo de topicos, logos placeholder, pagina); **miolo variavel**. Logos do master sao so placeholders genericos.

## Build

```javascript
const deck = require('./moldura.js')({
  // sem `modo`: sempre Insper Jr
  fonte: 'Gill Sans MT', cor: { dom: '2E6B4F', dest: '263A33' },
  paleta: { base60: 'FFFFFF', secundaria30: '263A33', destaque10: '2E6B4F' },      // do briefing
  escopos: ['marketing'],   // obrigatorio: define o fluxo abaixo da linha e gera fluxo_marketing.md (Diagnostico, STP, Marketing Mix)
  logos: { analisada: null, apresentador: null },
  // estiloBarra, estiloCabecalho, estiloTitulo, corTitulo, corCabecalho, estiloSumario: omitido = SORTEADO UMA VEZ
});
const { formas, B } = deck;
deck.capa({ modelo: 'foto_lateral', titulo: '...', subtitulo: '...', integrantes: ['...'] });
deck.sumario('Diagnóstico');
const s = deck.novoSlide('Diagnóstico', { layout: 'Q3E' });          // layout opcional (quadrantes)
deck.titulo(s, 'Titulo-conclusao em uma linha', [{ text: 'Apoio com ' }, { text: 'destaque', options: B }]);
const [a, b] = deck.blocos(s, '2c', [{ cab: 'Conclusao', sub: 'Unidade, periodo' }, { cab: '...' }], { pesos: [1.3, 1] });
const p = formas.grafico(s, { tipo: 'colunas', x: a.x, y: a.y, w: a.w, h: a.h, categorias, series });
formas.colcheteCagr(s, { x1: p.cx(0), x2: p.cx(3), y: p.yTopo + 0.1, y1: p.cy(v0), y2: p.cy(v3), rotulo: 'CAGR 20%' });
deck.fontes(s, 'Fontes: ...');
deck.decidir({ slide, tipo, mensagem, arranjo, divisao: '2c', exhibits: [...], referencias: ['ijtheo_p047', 'orizon_p006'], aprendi: '...', alternativas: [{ arranjo, motivo }, { arranjo, motivo }] });
// Insper Jr: card com faixa + midia + revelacao
deck.revelar('Marketing Mix', 3, (s, e, ctx) => {
  deck.titulo(s, 'Praça: a loja física puxa a venda no 1º ano', 'Três canais com papéis diferentes');
  const rects = [0, 1, 2].map(i => ({ x: 0.9 + i * 3.95, y: 1.5, w: 3.7, h: 4.6 }));
  rects.forEach((r, i) => { const a = formas.cardIJ(s, Object.assign({ titulo: canais[i] }, r)); formas.midia(s, { x: a.x, y: a.y, w: a.w, h: 1.9, descricao: 'ilustração isométrica 3D de ...' }); deck.txt(s, textos[i], { x: a.x, y: a.y + 2.05, w: a.w, h: 1.2, fontSize: 9 }); });
  if (!ctx.base) ctx.destacar(rects, e);
  deck.fontes(s, 'Fontes: ...');
});
deck.finalizar('deck.pptx', estilosGraficos);
```

Passos: (1) `cp <skill>/scripts/* . && cp -r <skill>/assets/imagens . && cp -r <skill>/assets/referencias ./referencias` (`moldura.js` carrega sozinho os modulos `formas.js`, `exhibits.js`, `elementos.js`, `composicoes.js`, `capas.js`, `sumarios.js`, `sumario_cores.js`, `sorteio.js`, `proibicoes.js`, `icone.js` e chama `tema.py`, `barra_lateral.py`, `marcadores.py` e `graficos.py` no `finalizar`; por isso todos precisam estar na mesma pasta); (2) leia `references/gramatica.md` e `references/exhibits.md`, depois `capas.md`, `aprendizados.md`, `arranjos.md`, `organizacao.md`, `referencias.md`, `formas.md` (e `graficos.md` se houver cascata/dispersao); (3) escreva `build_deck.js` (modelo: `assets/exemplo_build_deck.js`, `assets/exemplo_sumarios_popups.js`); (4) `node build_deck.js` e `python3 qa_deck.py deck.pptx --fonte "<fonte>"`; (5) renderize e confira.

Composicoes prontas (`deck.composicoes`): `overviewEmpresa`, `financeiro` e `caixaLateral` (caixa a esquerda com a tese + 2 a 4 elementos ligados a direita; `assets/exemplo_build_deck.js`, slide 3b). Divisoes: `'1'`, `'2c'`, `'3c'`, `'4c'`, `'2f'`, `'3f'`, `'2x2'`, `'1+2'`, `'2+1'`, `'3+1'`, `'L'`, `'Linv'`, `'Lc'`. Exhibits (`exhibits.js`): `grafico`, `colcheteCagr`, `nota`, `elipse`, `tabela`, `sensibilidade`, `premissas`, `footballField`, `matrizRisco`, `equacao`, `linhaTempo`, `cenarios`, `cadeia`, `citacao`, `recorte`, `painel`, `listaPinos`, `numeroTexto`... Outras: `deck.livre`, `deck.imagem`, `deck.painel`, `deck.grade`, `deck.unidade`, `deck.cabecalho`, `deck.tom`, `deck.COR`, `deck.pres`. Funcoes vetadas (`proibicoes.js`) lancam erro.

Requisitos: node + `pptxgenjs`; Python com `lxml` (informe `python` no config ou a variável `PYTHON` quando o executável não se chamar `python3`) (e `Pillow` opcional); LibreOffice so para a previa. Sem rede no shell: nao instale pacotes; imagens/logos que faltarem viram placeholder.

## Tabela de leitura (leia so o que for usar)

| Arquivo | Quando |
|---|---|
| `references/contraexemplos_huawei.md` | Sempre: quatro composições reprovadas, incluindo a forma numerada em arco |
| `references/insperjr_padrao.md` | Sempre no modo Insper Jr (padrao): gramatica visual, revelacao, imagens, titulos, o que nao copiar, variacao |
| `references/contraexemplos_insperjr.md` | Sempre no modo Insper Jr: 7 estruturas reprovadas (com prints) e o que usar no lugar; abra `assets/contraexemplos/ij_reprovado_*.png` |
| `references/conteudo_escopos.md` | Sempre no modo Insper Jr: so as secoes do(s) escopo(s) do deck (mercadologico, operacional, 7Ps, financeiro) |
| `references/briefing.md` | Apoio opcional ao briefing; a secao "Padroes que dispensam pergunta" desta skill prevalece (publico, objetivo, capa e secoes nao se perguntam) |
| `references/gramatica.md` | Sempre antes de slide de conteudo |
| `references/arranjos.md`, `organizacao.md` | Decisao de organizacao e divisao em quadrantes |
| `references/exhibits.md`, `formas.md`, `graficos.md`, `referencias.md` | Assinaturas e receitas das pecas |
| `references/estruturas_mercado.md` | Sempre que escolher o arranjo de um slide: as 5 estruturas dos decks de mercado (caixa + elementos, blocos numerados, mapa/foto, cadeia, leitura do dado), quando usar e como replicar sem grafico |
| `assets/referencias/INDICE.md` | Uma vez, antes do primeiro slide: o que ha em cada pasta de referencia |
| `references/sumarios_popups.md` | Sumario, pilares, indice, resumo, pop-up, faixa-pergunta |
| `references/vetos_e_recomendacao.md` | Tabela, conector, icone, sumario, slide final de recomendacoes |
| `references/imagens_tipografia.md` | Imagens, icones, placeholders; fontes aprovadas (Gill Sans MT, Dubai, Montserrat; proibidas Calibri, Arial, Aptos, Georgia...) |
| `references/capas.md`, `barra.md` | Capa; barra lateral (so se o usuario nomear) |
| `references/aprendizados.md` | Sempre: preferencias consolidadas e feedback |
| `scripts/fluxos.js` | Fonte unica do fluxo de cada escopo (etapas do rodape e arquivo `fluxo_<escopo>.md`); edite aqui para mudar o fluxo |
| `scripts/sortear_referencias.py` | Protocolo passo 2: sorteia as referencias a abrir, lendo as pastas de `referencias/` (`--inicial`, `--tipo`, `--estrutura`, `--sumario`) |
| `scripts/extrair_referencias.py` | So quando o usuario anexar um deck novo de referencia (PDF ou PPTX): gera folhas de contato e inventario |
| `scripts/baixar_imagem.py` + `assets/imagens/LEIA-ME.md` | Imagem da web ou cadastro manual no `catalogo.json` (ver `imagens_tipografia.md`) |
| `assets/capas/ref_*.jpg` | Abrir com Read a capa do modelo escolhido, so para comparar a estrutura |
| `assets/mostruario_formas.jpg`, `assets/exemplos_gramatica.jpg` (o `framework_formas.pptx` e so origem, ja incorporado) | Ver as formas e as tecnicas de gramatica renderizadas antes de escolher exhibit (`formas.md`, `gramatica.md`) |
| `references/contraexemplos_starbucks.md` + `assets/contraexemplos/` | Sempre ao escolher o arranjo e na revisao visual: abrir os dois slides reprovados e evitar suas composicoes |

## Verificacao antes de entregar

- [ ] Um só modelo e fundo de sumário; itens sem interseção e alinhados, inclusive no maior fluxo.
- [ ] Paleta 60/30/10 mantida em capa, conteúdo e transições.
- [ ] Títulos/subtítulos padronizados; textos longos reescritos, sem redução automática.
- [ ] Quatro contraexemplos Huawei abertos e comparados; nenhum reproduzido.


- [ ] Perguntas feitas e briefing respondido e confirmado, ou dispensa explicita registrada.
- [ ] Config com `escopos`; o fluxo do escopo aparece abaixo da linha divisoria de todo slide de conteudo; `fluxo_<escopo>.md` gerado e entregue junto com o `.pptx`; etapas sem slide explicadas.
- [ ] `.pptx` gerado, existente e com tamanho maior que zero; pacote ZIP integro com `ppt/presentation.xml` e pelo menos um `ppt/slides/slideN.xml`; quantidade de slides conforme briefing.
- [ ] PowerPoint aberto por um leitor de PPTX ou renderizador, sem erro estrutural; textos, formas e graficos nativos editaveis, sem achatar cada slide em uma imagem.
- [ ] Arquivo final salvo e link de download do `.pptx` disponivel na resposta.

- [ ] Lendo so titulos e cabecalhos de bloco, a mensagem fecha?
- [ ] (Insper Jr) Cada slide tem pergunta/decisao, evidencia e implicacao (`conteudo_escopos.md`); nenhum framework entrou por obrigacao; os escopos usam premissas coerentes entre si (volume x capacidade x preco x caixa).
- [ ] (Insper Jr) Ao lado das imagens `ijtheo_*`, parece do mesmo tipo de deck: titulo grande + apoio, cards com faixa, imagem que prova algo, revelacao em 2 a 4 slides por secao, nada da secao 7 de `insperjr_padrao.md`.
- [ ] `formas_novas.js` carregado; nenhuma `piramide3D`/`funilPrismas` no build; pirâmide, funil, card grande unico e demais formas novas conferidos no render contra as imagens do usuario (sem esticar).
- [ ] A tabela "Formas do framework" foi consultada em cada slide; as formas que cabiam entraram nos arranjos candidatos e o log do build mostra o uso.
- [ ] Nenhuma pergunta sobre publico, objetivo, secoes ou capa foi feita; as secoes seguem a ordem padrao do escopo (ou a que o usuario mandou).
- [ ] Todo grafico com anotacao que diz a leitura, caindo no dado; fonte em todo slide; nenhuma "Notas:" no rodapé (ressalva vai para apêndice ou pop-up).
- [ ] Imagens dos contraexemplos Starbucks abertas e comparadas; nenhum slide repete a composicao do 5 ou do 6, mesmo com outra marca ou paleta. Foto, paragrafo e nota metodologica nao foram usados para simular exhibits independentes.
- [ ] Nada da lista "Proibido" e nenhum quadrante colavel no Word sem perder nada (teste do contra-exemplo).
- [ ] Sorteio feito e registrado; sumarios repetem o mesmo modelo, fundo, paleta e geometria; slides vizinhos com divisao e exhibit diferentes. Se o mesmo pedido fosse repetido, a sequencia sairia diferente?
- [ ] `qa_deck.py` sem erro; avisos tratados (titulo-rotulo, > 300 palavras, texto de 4+ linhas, sem fonte, divisao repetida, sumario com identidade inconsistente, grade em grafico).
- [ ] Capa na estrutura da referencia; logos como placeholders; paleta, secoes e fonte do briefing; nada estourando.

## Entrega

Entregar primeiro o link para **`<nome_do_trabalho>.pptx`**, ja gerado e validado, junto com o(s) **`fluxo_<escopo>.md`** de cada escopo pedido (obrigatorio). Incluir uma linha de contexto (modelo de capa, estilos sorteados e motivo da capa), previa quando disponivel, pendencias por slide e `registro_decisoes.md` como complementos. Se a fonte real nao estiver instalada, avisar que a previa e aproximada. Nao concluir apenas com previa, texto ou codigo, nem perguntar se o usuario quer receber o PPTX.

Pedir feedback sobre a organizacao dos slides. So alterar esta skill e suas referencias se o usuario solicitar a atualizacao; nao gerar nem entregar um ZIP da skill automaticamente ao terminar um deck.