// EXEMPLO (modo Insper Jr, o unico da skill): 5 slides de escopos diferentes, cada um com uma organizacao DIFERENTE, mostrando como as
// formas do framework (formas.md) entram junto com cardIJ, midia, grafico anotado e revelacao. Nao copie a estrutura: copie o metodo
// (mensagem -> funcao de cada item -> exhibit principal -> 2 arranjos candidatos -> escolha -> deck.decidir).
// Dados e nomes sao ilustrativos. Em um deck real, abra as imagens de referencias/ (Read) e cite as que de fato consultou (2+).
const deck = require('./moldura.js')({
  fonte: 'Montserrat', cor: { dom: '1F5C4A', dest: '6FBF9B' },
  escopos: ['operacional', 'marketing', 'financeiro'],   // o fluxo de cada escopo vai abaixo da linha divisoria e gera fluxo_<escopo>.md
  logos: { analisada: null, apresentador: null }, // estiloBarra, estiloCabecalho, estiloTitulo, corTitulo, estilosSumario: omitidos = SORTEADOS 1x por projeto
});
const { formas: f, B, COR } = deck;
const N = { bold: true };
deck.capa({ modelo: 'foto_lateral', titulo: 'Plano de expansao', subtitulo: 'Empresa Exemplo', integrantes: ['Nome 1', 'Nome 2'], creditos: [['Head', 'Nome']], imagem: null });

const dec = (o) => deck.decidir(Object.assign({ tipo: 'exemplo', referencias: ['ijtheo_p047', 'ijtheo_p085'],
  aprendi: 'exemplo: titulo-conclusao com apoio, imagem que prova a escolha e card com faixa; aplicado ao conteudo deste slide sem copiar a estrutura' }, o));

// ---------- 1. Mercadologico: piramide (criterios competitivos) + painel de leitura ----------
deck.sumario('Estratégias Operacionais');
{
  const s = deck.novoSlide('Estratégias Operacionais');
  deck.titulo(s, 'Preco virou qualificador: o cliente decide por atendimento', 'Criterios competitivos, do menos para o mais relevante');
  const [a, b] = deck.blocos(s, '2c', [{ cab: 'Tres niveis de relevancia', sub: 'Do topo (ganhadores) para a base (baixa relevancia)' }, { cab: 'O que isso muda para a empresa' }], { pesos: [1.25, 1] });
  f.piramide3D(s, { x: a.x, y: a.y + 0.1, w: a.w, h: a.h - 0.2, niveis: ['Ganhadores: atendimento e sortimento', 'Qualificadores: preco e prazo', 'Baixa relevancia: embalagem'] });
  f.painelLeitura(s, { x: b.x, y: b.y + 0.1, w: b.w - 0.1, h: b.h - 0.3, itens: [
    { titulo: 'Ganhadores', texto: 'Atendimento consultivo e variedade decidem a compra; ai esta a vantagem a defender.' },
    { titulo: 'Qualificadores', texto: 'Preco e prazo precisam estar na media do mercado, nao abaixo dela.' },
    { titulo: 'Baixa relevancia', texto: 'Embalagem e decoracao nao movem a decisao e podem receber menos verba.' }] });
  deck.fontes(s, 'Fontes: pesquisa com clientes (ilustrativa)');
  dec({ slide: 'Criterios competitivos', mensagem: 'Preco e qualificador; atendimento ganha', arranjo: 'piramide + painel de leitura', divisao: '2c', formas: ['piramide3D', 'painelLeitura'],
    exhibits: ['piramide3D', 'painelLeitura'], motivo: 'hierarquia de relevancia pede niveis empilhados, nao lista',
    alternativas: [{ arranjo: 'tabela de criterios por horizonte', motivo: 'sem horizonte de tempo nos dados' }, { arranjo: 'grafico de barras por criterio', motivo: 'nao ha nota numerica por criterio' }] });
}

// ---------- 2. Operacional: funil (atracao e perda de clientes) + midia ----------
deck.sumario('Fluxo de Entrada e Saída');
{
  const s = deck.novoSlide('Fluxo de Entrada e Saída');
  deck.titulo(s, 'A loja perde 8 em cada 10 visitantes antes do caixa', 'Atracao e perda de clientes ao longo da visita');
  const [a, b] = deck.blocos(s, '2f', [{ cab: 'Funil da visita', sub: 'Visitantes por mes e conversao entre etapas' }, { cab: 'Onde a loja perde o cliente' }], { pesos: [1, 1.1] });
  f.funilPrismas(s, { x: a.x, y: a.y + 0.2, w: a.w, itens: [['Entram na loja', '100 mil'], ['Provam o produto', '38 mil'], ['Compram', '19 mil']], hItem: 0.8 });
  f.midia(s, { x: b.x, y: b.y + 0.1, w: b.w, h: b.h - 0.2, tipo: 'IMAGEM', descricao: 'ilustracao isometrica 3D da loja com o ponto de perda (fila do caixa) em zoom' });
  deck.fontes(s, 'Fontes: contagem de fluxo em loja (ilustrativa)');
  dec({ slide: 'Funil da visita', mensagem: 'Perda concentrada antes do caixa', arranjo: 'funil + ilustracao da loja', divisao: '2f', formas: ['funilPrismas'],
    exhibits: ['funilPrismas', 'midia'], motivo: 'perda progressiva entre etapas e o caso classico do funil',
    alternativas: [{ arranjo: 'grafico de colunas por etapa', motivo: 'esconde a ideia de afunilamento' }, { arranjo: 'fluxograma de etapas', motivo: 'pede decisao em cada etapa, que nao existe aqui' }] });
}

// ---------- 3. Marketing: STP (3 pilares = proposta de valor) + chamada ----------
deck.sumario('STP');
{
  const s = deck.novoSlide('STP');
  deck.titulo(s, 'Tres pilares sustentam o posicionamento de moda consultiva', 'Pilares do STP que somados formam a proposta de valor');
  const [a] = deck.blocos(s, '1', [{ cab: 'Pilares da marca' }]);
  f.colunasEquacao(s, { x: a.x, y: a.y + 0.1, w: a.w, h: a.h * 0.68, pilares: [['Base de relacionamento', 'COMUNIDADE ENGAJADA'], ['Experiencia de compra', 'DROPS E DIGITAL'], ['Proposta de valor', 'EXCLUSIVIDADE']], resultado: '[LOGO: marca]', imagens: ['grupo de clientes em evento', 'loja com colecao em destaque', 'peca exclusiva em close'] });
  f.chamadaConector(s, { x: a.x, y: a.y + a.h * 0.68 + 0.35, w: a.w, h: 0.9, rotulo: 'Ponto de atencao', runs: [{ text: 'Exclusividade so se sustenta se o ' }, { text: 'estoque limitado', options: N }, { text: ' for comunicado como escolha, nao como falta.' }] });
  deck.fontes(s, 'Fontes: analise do grupo (ilustrativa)');
  dec({ slide: 'Pilares do STP', mensagem: 'Tres pilares somados formam a proposta', arranjo: 'colunas-equacao + chamada', divisao: '1', formas: ['colunasEquacao', 'chamadaConector'],
    exhibits: ['colunasEquacao', 'chamadaConector'], motivo: 'pilares que se somam em um resultado pedem a leitura A + B + C = valor',
    alternativas: [{ arranjo: 'tres cards com faixa', motivo: 'perde a ideia de soma' }, { arranjo: 'cards ligados por circulos', motivo: 'sugere sequencia, e os pilares sao paralelos' }] });
}

// ---------- 3b. Marketing: caixa lateral + elementos relacionados (estrutura de mercado_financeiro/caixa_esquerda_elementos_direita, sem grafico) ----------
{
  const s = deck.novoSlide('Marketing Mix');
  deck.titulo(s, 'A loja fisica segue sendo o canal que prova a marca', 'Tese a esquerda; tres evidencias que a sustentam a direita');
  deck.composicoes.caixaLateral(s, {
    cabEsq: 'Tese do canal', cabDir: 'O que sustenta a tese',
    caixa: { titulo: 'Praca', itens: [
      { titulo: 'Loja como vitrine', texto: [{ text: 'O cliente que experimenta na loja compra mais e volta ao digital ja decidido.' }] },
      { titulo: 'Digital como retencao', texto: [{ text: 'App e CRM mantem o contato entre uma visita e a seguinte.' }] }] },
    satelites: [
      { tipo: 'card', titulo: 'Conversao na loja', texto: 'Quem prova a peca converte 3 vezes mais do que quem so navega no site.' },
      { tipo: 'midia', descricao: 'foto da vitrine da loja piloto com o fluxo de entrada marcado', midia: 'IMAGEM' },
      { tipo: 'bloco', icone: 'tb/TbDeviceMobile', titulo: 'Retencao no app', texto: 'Cupom pos-visita traz o cliente de volta em ate 30 dias.' }] });
  deck.fontes(s, 'Fontes: analise do grupo (ilustrativa)');
  dec({ slide: 'Canal: loja e digital', mensagem: 'A loja prova a marca e o digital retem', arranjo: 'caixa lateral com tese + 3 evidencias ligadas', divisao: '2c', formas: ['cardIJ', 'midia', 'blocoIcone'],
    exhibits: ['caixaEtiqueta', 'cardIJ', 'midia', 'blocoIcone'], referencias: ['orizon_p006', 'nubank_p024', 'ijtheo_p047'],
    aprendi: 'nos decks de mercado a caixa da esquerda concentra a tese em texto e os elementos da direita a provam; aqui os elementos viram card, foto e bloco com icone em vez de grafico',
    motivo: 'a mensagem e uma tese com tres provas de natureza diferente, que a estrutura caixa + satelites organiza sem tabela',
    alternativas: [{ arranjo: 'tres cards iguais lado a lado', motivo: 'perde a hierarquia entre tese e prova' }, { arranjo: 'grafico de barras por canal', motivo: 'nao ha serie numerica comparavel entre os canais' }] });
}

// ---------- 4. Marketing: praca com revelacao progressiva (cardIJ + midia) ----------
{
  const canais = ['Loja fisica', 'Site e app', 'Fidelidade'];
  const textos = ['Puxa a venda no 1o ano e entrega a experiencia consultiva.', 'Amplia o alcance e acompanha o cliente apos a visita.', 'Traz o cliente de volta e alimenta a base de dados.'];
  deck.revelar('Marketing Mix', 3, (s, e, ctx) => {
    deck.titulo(s, 'Praca: a loja fisica puxa a venda no primeiro ano', 'Tres canais com papeis diferentes');
    const rects = [0, 1, 2].map(i => ({ x: 0.9 + i * 3.95, y: 1.5, w: 3.7, h: 4.6 }));
    rects.forEach((r, i) => {
      const a = f.cardIJ(s, Object.assign({ titulo: canais[i] }, r));
      f.midia(s, { x: a.x, y: a.y, w: a.w, h: 1.9, descricao: 'ilustracao isometrica 3D de ' + canais[i].toLowerCase() });
      deck.txt(s, textos[i], { x: a.x, y: a.y + 2.05, w: a.w, h: 1.2, fontSize: 10.5 });
    });
    if (!ctx.base) ctx.destacar(rects, e);
    deck.fontes(s, 'Fontes: analise do grupo (ilustrativa)');
  });
  dec({ slide: 'Praca', revelacao: 3, mensagem: 'A loja fisica puxa a venda', arranjo: 'tres cards com imagem e revelacao', divisao: 'livre', formas: ['cardIJ', 'midia'],
    exhibits: ['cardIJ', 'midia'], motivo: 'cada canal tem explicacao propria e merece acender sozinho',
    alternativas: [{ arranjo: 'chips hexagonais com uma aba ativa', motivo: 'canais precisam de imagem, nao so de rotulo' }, { arranjo: 'tabela de canais', motivo: 'vira tabela de frases (vetado)' }] });
}

// ---------- 5. Financeiro: grafico anotado + medidor + tubos de composicao ----------
deck.sumario('Valuation');
{
  const s = deck.novoSlide('Valuation');
  deck.titulo(s, 'O plano se paga em 3 anos e cria R$ 4 Mi de valor', 'Fluxo de caixa do projeto (R$ Mi) e composicao da receita');
  const [a, b] = deck.blocos(s, '2c', [{ cab: 'Caixa acumulado vira positivo no ano 3', sub: 'R$ Mi' }, { cab: 'A receita vem da loja' }], { pesos: [1.4, 1] });
  const p = f.grafico(s, { tipo: 'colunas', x: a.x, y: a.y, w: a.w, h: a.h, categorias: ['Ano 0', 'Ano 1', 'Ano 2', 'Ano 3', 'Ano 4'], series: [{ nome: 'Caixa acumulado', valores: [-6, -3.8, -1.2, 1.6, 4.0] }], destaque: [3], formato: '0.0' });
  f.nota(s, { x: a.x + 0.2, y: a.y + 0.1, w: 2.3, h: 0.55, runs: [{ text: 'Payback no ' }, { text: 'ano 3', options: N }], alvo: { x: p.cx(3) - 0.2, y: p.cy(1.6) - 0.05 }, estilo: 'tracejada', ponta: 'ponto' });
  f.medidorCirculo(s, { x: b.x, y: b.y + 0.1, d: 1.1, valor: '23%', rotulo: 'TIR do projeto', lado: 'direita', w: 1.8 });
  f.tubosTampa(s, { x: b.x, y: b.y + 1.7, w: b.w, itens: [['Loja fisica', '68% da receita'], ['Site e app', '24%'], ['Outros', '8%']] });
  deck.fontes(s, 'Fontes: modelo financeiro do grupo (ilustrativo)');
  dec({ slide: 'Retorno do plano', mensagem: 'Payback em 3 anos e TIR de 23%', arranjo: 'grafico anotado + medidor + tubos', divisao: '2c', formas: ['medidorCirculo', 'tubosTampa'],
    exhibits: ['grafico + nota', 'medidorCirculo', 'tubosTampa'], tipo: 'financeiro', motivo: 'o numero-chave (TIR) vira medidor ao lado do grafico que o prova; a composicao vira tubo',
    alternativas: [{ arranjo: 'tabela de DRE', motivo: 'a leitura do retorno some entre as linhas' }, { arranjo: 'faixa de KPIs', motivo: 'estrutura reprovada (tiraFatos)' }] });
}
deck.finalizar('teste.pptx').then(() => console.log('ok'));
