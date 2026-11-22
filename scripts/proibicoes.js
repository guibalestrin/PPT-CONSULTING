// proibicoes.js -- fonte unica do que esta PROIBIDO (moldura.js le este arquivo; chamar uma funcao listada aqui lanca erro).
//
// 2026-11-11 (2a rodada): o usuario LIBEROU tabelas, setas/conectores, diagramas feitos com formas e icones de linha, com uma
// condicao: "tem que ser usado igual eles usam na apresentacao, na mesma formatacao, diagramacao etc, porque senao fica com cara de
// Claude". Ou seja: o que estava proibido era o USO GENERICO desses elementos, nao os elementos. Por isso:
//   - use as versoes de scripts/exhibits.js (copiadas dos 12 PDFs + PPTX de referencia) e siga references/gramatica.md;
//   - as versoes antigas que nao existem nas referencias continuam bloqueadas aqui embaixo, com a substituta indicada.
// Grafico de DADOS (serie, composicao, ranking) continua sendo o NATIVO do PowerPoint (formas.grafico / addChart): nas referencias
// editaveis todo grafico e nativo. Formas so para diagramas de analise (football field, matriz de risco, equacao, cadeia, treemap).
// VETOS DE COMPOSICAO (11/11/2026): Starbucks slides 5 e 6 reprovados pelo usuario.
// Ler references/contraexemplos_starbucks.md e abrir assets/contraexemplos/*.png.
// Vetar tabela descritiva + ranking textual + conclusao em caixa; e grafico + foto-banner + paragrafos sem prova conectada.
// Sao vetos de composicao, nao de funcoes isoladas. A revisao visual deve verifica-los: este mapa nao detecta layouts.
module.exports = {
  funcoes: {
    listaFitas: { motivo: 'fitas com ponta de seta em serie nao existem nas referencias (e o habito de IA)', alternativa: 'listaPinos, premissas, manchetes ou bullets curtos dentro de um painel' },
    setaCurva: { motivo: 'arco solto entre colunas nao e como as referencias marcam variacao', alternativa: 'colcheteCagr (pinos ou pilula) ou nota com alvo' },
    barrasPirulito: { motivo: 'grafico de dados desenhado com formas', alternativa: 'formas.grafico({ tipo: "barras" ou "colunas" }) com 2 series' },
    barras100: { motivo: 'grafico de dados desenhado com formas', alternativa: 'formas.grafico({ tipo: "empilhado100" ou "barrasEmpilhadas" })' },
    ponteDecomposicao: { motivo: 'cascata desenhada com formas', alternativa: 'cascata nativa: formas.grafico({ tipo: "empilhado" }) com serie-base invisivel (graficos.md)' },
  },
  // Vetados SO no modo insperjr (o usuario reprovou em 15/11/2026: "todas essas estruturas de organizar e exibir dados deixam cara de AI").
  // Ver references/contraexemplos_insperjr.md (com os prints) para o que usar no lugar.
  funcoesInsperJr: {
    faixasNumeradasArco: { motivo: 'pilulas em degrade com losangos e arco numerado: composicao Huawei 4 explicitamente reprovada', alternativa: 'representar as etapas com outra estrutura de referencia positiva, sem reconstruir o mesmo mecanismo' },
    tiraFatos: { motivo: 'faixa cinza de KPIs separados por fios (R$ 2,3 Mi | 28% | -8%): parece painel generico de IA', alternativa: 'o numero como anotacao dentro do grafico que o prova (nota), medidorCirculo (um por exhibit) ou numero grande no titulo/apoio' },
    listaPinos: { motivo: 'lista numerada com numeros cinza grandes e uma linha de texto: cara de IA', alternativa: 'linhasCausaEfeito (icone, titulo, de -> para), blocoIcone ou cardIJ com imagem e frase curta' },
    listaNumeros: { motivo: 'lista de numeros em linhas, igual a painel de dados de IA', alternativa: 'grafico com anotacao, medidorCirculo ou painelLeitura' },
    listaCategorias: { motivo: 'linhas com titulo, etiqueta em italico e fio fino: cara de IA', alternativa: 'blocoIcone por item, ou cardIJ com faixa de titulo e imagem' },
    premissas: { motivo: 'rotulo cinza + chip de valor (tabela disfarcada): cara de IA', alternativa: 'a premissa escrita na frase de apoio, no proprio grafico (nota) ou em painelLeitura; premissa pesada vai no apendice' },
    linhaValores: { motivo: 'fileira de valores com fios, igual a tiraFatos', alternativa: 'nota no grafico, medidorCirculo ou painelLeitura' },
  },
  estilosCabecalho: [],
  // sumario: SEM vetos de cor ou fundo (liberado em 2026-11-15; deck.sumario aceita qualquer cor, ver sumario_cores.js).
  // fio vertical antes do TITULO do slide: o usuario vetou em 2026-11-11 e nao reviu (a barrinha 'marcador' dos quadrantes segue liberada)
  estilosTitulo: ['destaque'],
};
