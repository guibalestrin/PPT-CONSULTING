> Regra vigente (15/11/2026): um único modelo e fundo de sumário em todo o deck; paleta fixa 60/30/10; título 26pt e subtítulo 14pt, sem reduzir fonte. As composições de `contraexemplos_huawei.md` são vetadas; `faixasNumeradasArco` não pode ser usada no modo Insper Jr. Exemplos legados abaixo não substituem estas regras.

# Banco de arranjos: como decidir a organizacao de cada slide

> **Regra atual (2026-11-11, 2a rodada):** tabelas, setas/conectores, diagramas com formas e icones de linha estao **liberados no formato das referencias** (`gramatica.md`, `exhibits.md`). Continuam vetados: grafico de DADOS desenhado com formas (`barrasPirulito`, `barras100`, `ponteDecomposicao`), `listaFitas`, `setaCurva`, fio vertical antes do titulo do slide e os habitos de IA (`gramatica.md` secao 7). Todo grafico de dados e NATIVO (`formas.grafico` / `s.addChart`).

Leia **sempre**, antes de montar cada slide de conteudo, **depois de `gramatica.md`** (que traz o repertorio por funcao da informacao e o procedimento completo). Este arquivo existe para que o slide seja organizado a partir do **conteudo que existe**, e nao a partir de um molde. As composicoes prontas (`composicoes.js`) sao UM exemplo entre varios, nao o ponto de partida.

## 1. O processo (obrigatorio, um slide por vez)

Antes de propor candidatos, abrir os dois negativos em `contraexemplos_starbucks.md`. Eliminar candidatos que reproduzam tabela descritiva + ranking + comentario em caixa (Starbucks 5), ou grafico + foto-banner + paragrafos sem segunda prova analitica (Starbucks 6). Nao considerar um arranjo adequado apenas porque combina 2 a 4 objetos ou usa funcoes desta skill.


1. **Mensagem**: escreva em uma frase o que o cliente deve lembrar deste slide (vira o titulo-conclusao).
2. **Inventario do conteudo**: liste o que voce realmente tem, com fonte: numeros (quantos? tem serie no tempo? tem comparacao?), texto/argumento, processo ou etapas, lugares, pessoas, produtos, imagens reais. Marque o que **falta**. O arranjo nasce desta lista.
3. **Tipo de informacao dominante**: escolha o tipo da secao 3 (overview, mercado, desempenho, concorrencia, modelo/processo, riscos, geografia, recomendacao, portfolio). Um slide pode misturar, mas um tipo manda.
4. **Alternativas**: considere **pelo menos 2 arranjos** do banco (secao 3) ou um arranjo novo seu. Para cada um, diga em uma linha por que serve ou por que foi descartado (ex.: "Lc descartado: nao ha mapa nem foto para a terceira coluna").
5. **Escolha e registro**: escolha um e registre com `deck.decidir({...})` (secao 5). O registro e obrigatorio e o build avisa se faltar.
6. **Variacao**: o arranjo escolhido precisa ser **diferente do slide anterior** (divisao ou forma principal) e, se o usuario enviou o registro de um deck anterior, **diferente do usado antes para o mesmo tipo de slide**. Se o melhor arranjo para o conteudo for o mesmo de antes, varie a forma principal ou a divisao e diga por que.

## 2. Regras contra enchimento (o molde nao manda no conteudo)

- **Minimos e maximos das funcoes sao do molde, nao do conteudo.** Se o conteudo tem 2 etapas, use 2; se tem 7, divida em dois blocos ou escolha outra forma. Nunca invente um item, um KPI ou um subtitulo para completar uma grade.
- **Bloco sem conteudo real some**: mude a divisao (`'2c'` em vez de `'3c'`, `'1'` em vez de `'L'`) em vez de preencher com texto generico.
- **Dado que falta vira `[DADO: ...]` ou o bloco sai**; nao vira palpite nem aproximacao sem fonte.
- **Foto ou mapa que nao existe** nao justifica uma coluna de placeholder: se a imagem e essencial ao arranjo, o placeholder fica e entra na pendencia; se nao e, escolha outro arranjo.
- Antes de entregar, releia cada bloco e pergunte: "se eu tirasse isto, o slide perderia algo?" Se nao, tire.
- Voce pode **criar arranjos e formas novas** no `build_deck.js` (com `deck.pres`, `deck.COR`, `formas.tom`). O banco abaixo e ponto de partida, nao limite.

## 3. Banco de arranjos por tipo de informacao

Cada linha: divisao (`deck.blocos`), formas (`formas.js` e `elementos.js`; assinaturas em `formas.md` e `referencias.md`), quando usar e quando nao.

### 3.1 Overview da empresa ("quem e e como funciona")

| Arranjo | Divisao | Formas | Usar quando | Nao usar quando |
|---|---|---|---|---|
| Descricao + numeros + mapa | `'Lc'` | `painelAba` (faixa), `estruturaAcionaria` ou grafico nativo de rosca, `listaNumeros`, mapa/foto via `deck.imagem` | Ha texto de descricao, estrutura societaria ou de share e uma imagem real | Nao ha mapa ou foto para a coluna da direita |
| Numeros em destaque + duas provas | `'1+2'` | `linhaValores` (3 a 6) no topo; embaixo texto com bullets (modelo) e `anotacao` (ponto de atencao) | Os numeros contam a historia sozinhos | Os numeros nao tem comparacao nem periodo |
| Um exhibit dominante + leituras | `'L'` | Grafico ou mapa grande; a direita `manchetes` e `listaNumeros` | Um dado (presenca por regiao, grafico por segmento) explica a empresa | Nao ha exhibit forte |
| Lista de numeros por negocio + manchetes | `'2c'` com `pesos: [3, 2]` | grafico NATIVO de barras ordenadas (empresa em destaque) ou `listaNumeros`, `manchetes`, `caixaFita` | Varias linhas de negocio ou marcas comparaveis | Menos de 3 linhas comparaveis |
| Pessoas e lideranca | `'2c'` | `faixaNome`, `manchetes`, `deck.imagem` | A lideranca ou o fundador faz parte da tese | Nao ha foto autorizada |
| Composicao aprovada `overviewEmpresa` | `'2c'` | cadeia (3 a 5 etapas reais), 4+ KPIs, destaque com foto | Cadeia de valor com 3+ etapas que existem de fato, 4+ KPIs e uma foto | Cadeia curta, poucos KPIs ou sem foto (vira enchimento) |

### 3.2 Mercado: tamanho e estrutura

| Arranjo | Divisao | Formas | Usar quando | Nao usar quando |
|---|---|---|---|---|
| Tres angulos + tendencia | `'3+1'` | `painelAba` por angulo, um grafico por painel, faixa de baixo com area de duas series | Tres medidas distintas do mercado (tamanho, crescimento, estrutura) e uma tendencia | So ha um ou dois dados |
| Share + decomposicao | `'L'` | grafico NATIVO (rosca ou barras ordenadas; `percentStacked` para composicao) | Participacao de mercado confiavel e atual | Share sem fonte atual ou com bases diferentes |
| Total e detalhe | `'L'` com zoom | Exhibit do total, `conectorZoom`, paineis de detalhe | Um total que se abre em partes | O detalhe e igual ao total |
| Ranking / benchmark | `'1'` ou `'2c'` | grafico NATIVO de barras ordenadas (empresa em destaque) ou `listaNumeros`, barras ordenadas destacando a empresa | Comparar a empresa com varios pares na mesma metrica | Metricas diferentes por par |
| Matriz de quatro fatores | `'2x2'` | Um exhibit diferente por quadrante | Quatro forcas ou fatores com peso parecido | Um fator domina |

### 3.3 Desempenho financeiro e series no tempo

| Arranjo | Divisao | Formas | Usar quando | Nao usar quando |
|---|---|---|---|---|
| Valor + margem + leitura | `'2c'` (pesos 3:2 ou 2:1) | Combo colunas + linha (`graficos.md`), `lajesEmpilhadas`, `caixaFita` | Receita e um indicador relativo (margem, alavancagem) | Nao ha indicador relativo |
| Ponte de resultado | `'1'` | cascata NATIVA (colunas empilhadas com base invisivel) + `caixaFormula` | Mostrar de onde vem o resultado (receita a lucro) | Dados de custo nao confirmados |
| Evento sobre a serie | `'1'` | Linha ou area, `faixaPeriodo`, `anotacao`, `seloVariacao` | Um fato (aquisicao, crise) explica a curva | Serie sem evento relevante |
| Componentes lado a lado | `'2c'` ou `'3c'` | Colunas agrupadas (ex.: volume x preco), `anotacao` | Decompor o crescimento em causas | So um componente |
| Composicao do total | `'2f'` | grafico NATIVO `percentStacked` ou colunas empilhadas + `manchetes` | O mix mudou entre periodos | Mix estavel |

### 3.4 Concorrencia

| Arranjo | Divisao | Formas | Usar quando | Nao usar quando |
|---|---|---|---|---|
| A x B espelhado | `'2c'` | `comparativoEspelhado` | Duas empresas em 3 a 5 atributos | Mais de duas empresas |
| Antes x depois ou nos x eles | `'2c'` | grafico NATIVO de barras agrupadas | Mesma metrica para dois lados ou dois periodos | Metricas diferentes |
| Benchmark em barras | `'1'` | grafico NATIVO de barras ordenadas (empresa em destaque) ou `listaNumeros` | Varios pares, varias metricas | Poucos dados por par |
| Posicionamento | `'2c'` | Dispersao ou bolhas (`addChart`), `manchetes` | Duas dimensoes explicam a posicao | Sem duas dimensoes comparaveis |
| Estrategias diferentes | `'2f'` | `fasesDegrau` ou `manchetes` por player | A tese e como cada um compete, nao quanto | A tese e numerica |

### 3.5 Modelo de negocio, estrategia e processo

| Arranjo | Divisao | Formas | Usar quando | Nao usar quando |
|---|---|---|---|---|
| Etapas em sequencia | `'1'` ou `'2c'` | `faixasNumeradasArco` (3 a 5) | Etapas reais e ordenadas | Menos de 3 etapas reais |
| Afunilamento | `'2c'` | `funilPrismas` | Conversao ou filtro progressivo | Nao ha perda entre etapas |
| Pilares que somam | `'1'` | `colunasEquacao` (A + B + C = resultado) | Proposta de valor com componentes | Componentes nao se somam |
| Evolucao por fases | `'2f'` | `fasesDegrau` (sem seta), `cardsTracejados` | Roadmap ou historia em fases | Sem fases claras |
| Componentes e processos | `'2c'` | `cubosLinhasGuia` ou `tubosTampa` | 2 a 4 componentes paralelos | Itens sem relacao |

### 3.6 Riscos e pontos de atencao

| Arranjo | Divisao | Formas | Usar quando | Nao usar quando |
|---|---|---|---|---|
| Matriz | `'2x2'` | Um risco por quadrante, `chamadaConector` | Riscos classificaveis em duas dimensoes | Menos de 4 riscos |
| Risco, evidencia, resposta | `'1'` | grafico NATIVO de barras ordenadas (empresa em destaque) ou `listaNumeros` | Cada risco tem prova e mitigacao | Sem mitigacao conhecida |
| Causa e consequencia | `'2f'` | `caixaFormula` + `cardsTracejados` | Cadeia de efeitos | Riscos independentes |
| Manchetes + notas | `'2c'` | `manchetes`, `anotacao` | 2 a 4 riscos curtos | Riscos que pedem numeros |

### 3.7 Geografia e ativos fisicos

| Arranjo | Divisao | Formas | Usar quando | Nao usar quando |
|---|---|---|---|---|
| Mapa grande + manchetes | `'2c'` com `pesos` | `deck.imagem` (mapa), `manchetes` | O lugar e a mensagem | Nao ha mapa real |
| Mapa -> foto | `'L'` | `conectorZoom`, `deck.imagem`, `anotacao` | Zoom de uma regiao ou ativo | Sem foto do ativo |
| Regioes em barras + lista de numeros | `'2c'` | grafico NATIVO de barras ordenadas (empresa em destaque) ou `listaNumeros`, barras ordenadas | Numeros por regiao | Dados regionais incompletos |
| Ativos com foto | `'3c'` | `cardsProduto` ou `cardsParalelogramo` | Fabricas ou lojas com foto | Fotos nao disponiveis |

### 3.8 Recomendacao e plano de acao

| Arranjo | Divisao | Formas | Usar quando | Nao usar quando |
|---|---|---|---|---|
| Fases + consequencias | `'2f'` | `fasesDegrau`, `cardsTracejados` | Plano em fases com entregas | Sem ordem temporal |
| Prioridades em camadas | `'2c'` | `piramide3D`, `manchetes` | Base x topo, o que vem primeiro | Itens com o mesmo peso |
| Iniciativas que somam | `'1'` | `colunasEquacao` | Varias iniciativas levam a um resultado | Iniciativas independentes |
| Priorizacao | `'1'` | grafico NATIVO de barras ordenadas (empresa em destaque) ou `listaNumeros` + `caixaFita` | Muitas opcoes a ordenar | Menos de 4 opcoes |
| Sequencia ligada | `'1'` | `cardsLigados` | 2 a 4 acoes encadeadas | Acoes paralelas |

### 3.9 Portfolio de produtos e marcas

| Arranjo | Divisao | Formas | Usar quando | Nao usar quando |
|---|---|---|---|---|
| Lista de numeros com destaque | `'2c'` com `pesos: [3, 2]` | grafico NATIVO de barras ordenadas (empresa em destaque) ou `listaNumeros`, `manchetes` | Varias marcas com um indicador cada | Marcas sem indicador comparavel |
| Cards com foto | `'3c'` ou `'2x2'` | `cardsProduto` | Fotos reais disponiveis | Sem fotos |
| Share do portfolio | `'L'` | grafico NATIVO de rosca, `manchetes` | Peso de cada marca no total | Pesos nao confirmados |
| Ranking de marcas | `'1'` | Barras horizontais ordenadas + `anotacao` | Uma metrica por marca | Mais de 8 marcas |

## 4. Como combinar

- Um exhibit "pesado" por slide (grafico grande, mapa); os outros blocos sao leves.
- Titulos de bloco tambem sao conclusoes ("A America do Norte e a maior e esta estavel"), nunca rotulos.
- Varie entre slides vizinhos: se o anterior foi `'2c'` com grafico, o proximo pode ser `'1+2'`, `'L'` ou `'2f'`.
- Mesmo tipo de slide em decks diferentes pode (e deve) mudar de arranjo; o conteudo manda. Se o arranjo se repetir, a justificativa do registro precisa dizer por que o conteudo pediu o mesmo.

## 5. Registro de decisoes (`deck.decidir`)

No `build_deck.js`, depois de criar o slide e antes de `deck.finalizar`:

```javascript
deck.decidir({
  slide: 'Overview',                       // titulo curto do slide
  tipo: 'overview',                        // um tipo da secao 3
  mensagem: 'Frase que o cliente deve lembrar',
  arranjo: 'numeros em destaque + duas provas',
  divisao: '1+2',
  formas: ['linhaValores', 'anotacao'],
  alternativas: [                          // pelo menos 2
    { arranjo: 'Lc', motivo: 'descartado: nao ha mapa nem foto' },
    { arranjo: 'overviewEmpresa', motivo: 'descartado: so 2 etapas reais de cadeia' },
  ],
  motivo: 'Por que este arranjo serve ao conteudo deste slide',
});
```

`deck.finalizar` grava `registro_decisoes.json` e `registro_decisoes.md` ao lado do deck. Entregue o `.md` ao usuario: ele pode anexar o arquivo no proximo pedido, e voce passa o caminho em `historico` no config do `moldura.js` para o build avisar quando o mesmo tipo repetir o mesmo arranjo.

## 6. Arranjos vindos dos decks de referencia (2026-11-11)

Use como ponto de partida quando o conteudo for desse tipo; as pecas estao em `exhibits.md`. Continuam valendo as regras contra enchimento e a exigencia de 2+ alternativas.

| Conteudo que voce tem | Arranjo | Divisao | Pecas |
|---|---|---|---|
| Descricao da empresa, socios, 4 a 6 numeros, historia, receita por segmento | Coluna estreita de snapshot + linha do tempo + 2 a 3 graficos | `deck.grade({ colunas: [[1], [0.36, 1, 1]], larguras: [1, 3.1] })` | `painelAba` (faixa), `estruturaAcionaria`, `tabela` `rotuloValor`, `linhaTempo`, `grafico` |
| Quatro medidas de um setor | Um exhibit **diferente** por quadrante | layout `Q4` | `grafico` (combo, barras com destaque, colunas), `linhaTempo` + `recorte` |
| Premissas, projecao, fluxo e sensibilidade de uma tese | Premissas + grafico em cima; tabela + mapa de calor embaixo | layout `Q2T` + `deck.livre` | `premissas`, `grafico` com `projecaoDe`, `colcheteCagr`, `tabela` `financeira`, `elipse`, `sensibilidade` |
| Faixas de valor por metodologia + ponte + cenarios | Football field largo em cima; equacao, tira de fatos e cenarios embaixo | `'2f'` com `alturas: [1.25, 1]` | `footballField`, `equacao`, `tiraFatos`, `cenarios` |
| Riscos classificados + mitigantes | Matriz e lista a esquerda; cadeia ou grafico do risco principal e tabela a direita | `'L'` | `matrizRisco`, `listaCategorias`, `cadeia`, `tabela` `limpa` |
| Dois dados em que o segundo e consequencia do primeiro | Duas colunas com frases encadeadas por reticencias | `'2c'` com itens `estilo: 'frase'` | `grafico` + `marcoEvento`/`linhaRef`, `painel` + `listaPinos`, `faixaConclusao` |
| Um total e a abertura de um pedaco | Exhibit do total ligado por zoom ao painel de detalhe | `'2c'` com `pesos` | `grafico`, `conectorZoom`, `painel`, `listaPinos` ou `tabela` |
| Fala de executivo ou noticia que sustenta o dado | A prova entra no bloco do dado, nao em slide proprio | qualquer | `citacao`, `recorte` |
