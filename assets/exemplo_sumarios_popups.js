const deck = require('./moldura.js')({
  fonte: 'Montserrat', cor: { dom: '1F5C4A', dest: '6FBF9B' },
  escopos: ['marketing'],   // fluxo obrigatorio abaixo da linha: Diagnóstico | STP | Marketing Mix (gera fluxo_marketing.md)
  descricoes: { 'Diagnóstico': '5Cs da empresa e do mercado', STP: 'Público, posicionamento e pilares', 'Marketing Mix': 'Os 7Ps e o retorno das iniciativas' },
  logos: { analisada: null, apresentador: null }, // estilos sorteados (estilo_deck.json)

});
const { formas: f, B, COR } = deck; const N = { bold: true };
// EXEMPLO: em um deck real, abra as imagens de referencias/ (Read) e cite as que de fato consultou (2+), com os 2 a 4 exhibits do slide.
const dec = (slide, referencias = ['agrion_p010', 'orizon_p006'], exhibits = ['grafico anotado', 'painel']) => deck.decidir({ slide, tipo: 'teste', mensagem: slide, arranjo: slide, referencias, exhibits, aprendi: 'exemplo de teste: aplicacao do que as referencias ensinam (exhibits distintos, anotacao, destaque unico)', alternativas: [{ arranjo: 'a', motivo: 't' }, { arranjo: 'b', motivo: 't' }], motivo: 't' });
deck.capa({ modelo: 'foto_lateral', titulo: 'Teste', subtitulo: 'Sumarios e popups', integrantes: ['A'], creditos: [['Head', 'N']], imagem: null });
// transicao de secao: sem `estilo` o deck sorteia dentro do conjunto do projeto (nunca repete o da aparicao anterior)
deck.sumario('Diagnóstico', { fundo: 'claro' });          // qualquer cor: 'claro', 'escuro', 'dominante', 'destaque' ou hex
deck.sumario('STP', { fundo: '1F3A5F' });
deck.sumario('STP', { fundo: 'destaque', fundo2: '2E6B4F' });
// estilo nomeado (so quando o usuario pedir): os quatro escuros
deck.sumario('Marketing Mix', { });
// pilares da tese: itens proprios, ativo: null = todos acesos; escolhe estilo fora do conjunto da transicao quando possivel
deck.sumario('Marketing Mix', { titulo: 'Resumo da tese', itens: [
  { titulo: 'Modelo verticalizado', desc: 'Operar a própria cadeia dá *controle sobre custo* e margem' },
  { titulo: 'Marca forte', desc: 'Produto de qualidade e *alto reconhecimento* junto ao cliente' },
  { titulo: 'Expansão de lojas', desc: 'Atender mais mercado e capturar *maior rentabilidade*' }], ativo: 1 });
deck.sumario('Marketing Mix', { titulo: 'Pilares de crescimento', itens: [
  { titulo: 'Disrupção do banco tradicional', desc: 'Modelo digital com custo unitário otimizado e foco no cliente' },
  { titulo: 'Novas fronteiras', desc: 'Expansão para México e Colômbia com a mesma operação' },
  { titulo: 'Oportunidades de super app', desc: 'Venda cruzada, up-sell e evolução da receita por cliente' }], ativo: 0 });
function fundo(s) {   // slide base reutilizado nos pop-ups
  deck.titulo(s, 'Receita cresce 14% ao ano e a margem acompanha', [{ text: 'A expansão de fábricas é ' }, { text: 'financiada por dívida e aporte societário', options: B }]);
  const [a, b] = deck.blocos(s, '2c', [{ cab: 'Receita por cenário', sub: 'R$ Mi' }, { cab: 'Estrutura de capital', sub: 'Antes e depois do aporte' }]);
  f.grafico(s, { tipo: 'colunas', x: a.x, y: a.y, w: a.w, h: a.h, categorias: ['2024', '2025E', '2026E', '2027E', '2028E'], series: [{ nome: 'Receita', valores: [44, 91, 131, 189, 247] }], projecaoDe: 1 });
  f.grafico(s, { tipo: 'empilhado', x: b.x, y: b.y, w: b.w, h: b.h, categorias: ['Hoje', 'Pós-aporte'], series: [{ nome: 'Dívida', valores: [70, 55] }, { nome: 'Capital', valores: [30, 45] }] });
  deck.fontes(s, 'Fontes: dados ilustrativos');
}
// popup simples
{ const s = deck.novoSlide('STP'); fundo(s);
  const [p] = deck.popup(s, { paineis: [{ x: 1.4, y: 2.2, w: 7.6, h: 3.1, titulo: 'O início promissor: aporte societário' }] });
  const itens = [['Valor do aporte: R$ 50 milhões', 'O aporte ocorrerá em 2024 e complementará o caixa'], ['Share minoritário', 'Um novo investidor se tornará sócio da companhia'], ['Serão necessárias mais dívidas', 'O aporte não supre o capex total']];
  itens.forEach(([t, d], i) => f.listaPinos ? null : null);
  itens.forEach(([t, d], i) => s.addText([{ text: t, options: { bold: true, fontSize: 11, breakLine: true } }, { text: d, options: { fontSize: 9, color: COR.cinza } }], { x: p.x, y: p.y + 0.1 + i * 0.9, w: p.w * 0.55, h: 0.8, fontFace: 'Montserrat', margin: 0, valign: 'middle' }));
  const pg = f.grafico(s, { tipo: 'colunas', x: p.x + p.w * 0.6, y: p.y + 0.1, w: p.w * 0.4, h: p.h - 0.2, categorias: ['2023', '2024E'], series: [{ nome: 'Capital', valores: [100, 50000] }], destaque: [1], max: 60000 });
  dec('popup'); }
// popup duplo
{ const s = deck.novoSlide('STP'); fundo(s);
  const [p1, p2] = deck.popup(s, { paineis: [{ x: 0.95, y: 1.7, w: 5.6, h: 4.0, titulo: 'Área potencial (mi ha)', subtitulo: 'A área agrícola deve continuar crescendo' }, { x: 6.9, y: 1.7, w: 5.7, h: 4.0, titulo: 'Custo de produção (US$/acre)', subtitulo: 'Alto custo com fertilizantes por conta do solo' }] });
  f.grafico(s, { tipo: 'colunas', x: p1.x, y: p1.y, w: p1.w, h: p1.h, categorias: ['Muito boas', 'Degradadas', 'Boas'], series: [{ nome: 'x', valores: [19.4, 28, 252.2] }], destaque: [2] });
  f.grafico(s, { tipo: 'area', x: p2.x, y: p2.y, w: p2.w, h: p2.h, categorias: ['15/16', '17/18', '19/20', '21/22', '23/24'], series: [{ nome: 'Mato Grosso', valores: [88, 82, 95, 90, 78] }, { nome: 'Illinois', valores: [49, 42, 42, 71, 78] }] });
  dec('popup2'); }
// faixa pergunta
{ const s = deck.novoSlide('STP'); fundo(s); deck.faixaPergunta(s, 'E como a Empresa Exemplo reduz essa sazonalidade?'); dec('fp1'); }
{ const s = deck.novoSlide('STP'); fundo(s); deck.faixaPergunta(s, 'Mas como a empresa se *beneficia* desse aumento?', { estilo: 'cor' }); dec('fp2'); }
// revelacao progressiva
{ const s = deck.novoSlide('STP'); fundo(s); const [a, b] = deck.divisao('2c'); deck.destacar(s, [a, b], 0); dec('rev'); }
// indice
deck.indice('Marketing Mix', { titulo: 'Índice do apêndice', grupos: [
  { titulo: 'Setor', itens: ['Fluxo de resíduos', 'Mapa de aterros', 'Regulação', 'Preços por região'].map((t, i) => ({ texto: t, slide: 3 + i })) },
  { titulo: 'Companhia', itens: ['Linha do tempo', 'Estrutura societária', 'Receita por linha', 'Capex'].map(t => ({ texto: t, slide: 5 })) },
  { titulo: 'Financeiro', itens: ['DRE', 'Balanço', 'Fluxo de caixa', 'WACC', 'Sensibilidade'].map(t => ({ texto: t, slide: 6 })) },
  { titulo: 'Riscos', itens: ['Matriz de risco', 'Regulatório', 'Operacional'].map(t => ({ texto: t, slide: 7 })) }] });
// resumo executivo
{ const s = deck.resumoExecutivo('Diagnóstico', { titulo: 'Resumo: operadora com escala em setor pulverizado', conclusoes: ['O setor cresce 9% ao ano e abre espaço para consolidação', 'A escala da companhia converte crescimento em margem'],
  itens: [
    { cab: 'Volume tratado', sub: 'Mi ton', desenhar: (s, r) => f.grafico(s, { tipo: 'colunas', x: r.x, y: r.y, w: r.w, h: r.h, categorias: ['2021', '2023', '2025'], series: [{ nome: 'v', valores: [52, 66, 83] }] }) },
    { cab: 'Participação de mercado', sub: '% do volume', desenhar: (s, r) => f.grafico(s, { tipo: 'barras', x: r.x, y: r.y, w: r.w, h: r.h, categorias: ['A', 'Empresa', 'C'], destaque: [1], series: [{ nome: 's', valores: [9.4, 7.8, 5.9] }] }) },
    { cab: 'Margem EBITDA', sub: '%', desenhar: (s, r) => f.grafico(s, { tipo: 'linha', x: r.x, y: r.y, w: r.w, h: r.h, categorias: ['2023', '2024', '2025E'], series: [{ nome: 'm', valores: [19, 24, 29] }] }) },
    { cab: 'Preço-alvo', sub: 'R$ por ação', desenhar: (s, r) => f.grafico(s, { tipo: 'colunas', x: r.x, y: r.y, w: r.w, h: r.h, categorias: ['Atual', 'Alvo'], destaque: [1], series: [{ nome: 'p', valores: [22.1, 28.8] }] }) }] });
  dec('resumo'); }
deck.finalizar('teste_sum.pptx').then(() => console.log('ok'));
