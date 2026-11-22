// fluxos.js -- fluxo de apresentacao de cada escopo (fonte unica). Quem pede um escopo recebe, obrigatoriamente:
//   1. o fluxo desse escopo na faixa abaixo da linha divisoria de TODO slide de conteudo (secao atual em negrito na dominante);
//   2. um arquivo fluxo_<escopo>.md ao lado do .pptx, com a ordem, o que cada etapa deve conter e em quais slides ela aparece;
//   3. pelo menos 1 slide de conteudo por escopo pedido (o build falha sem isso) e aviso para etapa sem slide.
// A ordem e o conteudo sao os definidos pelo usuario (decks Theo, Grupo 5, Grupo 7 e case); ele edita a ordem depois no PowerPoint.
// Etapas extras sao permitidas (config `secoes`), mas as padrao precisam estar todas, na ordem.
// Varios escopos: concatenados na ordem mercadologico, operacional, marketing, financeiro; o rodape de cada slide mostra so o fluxo do
// escopo a que o slide pertence.
const fs = require('fs');
const path = require('path');

const ORDEM = ['mercadologico', 'operacional', 'marketing', 'financeiro'];
const FLUXOS = {
  mercadologico: {
    nome: 'Mercadológico',
    pergunta: 'O mercado comporta e premia a proposta da empresa?',
    etapas: [
      ['Internacional', ['cenário global do setor e referências de mercados maduros', 'tamanho, crescimento e o que já funciona lá fora']],
      ['Nacional', ['tamanho e crescimento no Brasil', 'perfil do consumidor, regiões e regulação']],
      ['Concorrencial', ['quadro por concorrente e mapa competitivo', 'práticas que a empresa pode adotar']],
      ['Tendências', ['tendências do macroambiente e do setor', 'implicação de cada uma para a empresa']],
      ['Riscos', ['riscos de mercado, regulatórios e operacionais', 'mitigação de cada risco', 'fecho: situação atual, dor do mercado e o que o mercado deseja (e onde é viável, se houver escolha de cidade ou região)']],
    ],
  },
  operacional: {
    nome: 'Operacional',
    pergunta: 'A operação entrega a proposta com a capacidade, o custo e a qualidade necessários?',
    etapas: [
      ['Estratégias Operacionais', ['variáveis operacionais', 'critérios competitivos: baixa relevância, qualificadores e ganhadores', 'pilares de desempenho: onde se diferencia e onde evolui', 'atração e perda de clientes']],
      ['Fluxo de Entrada e Saída', ['fluxo do cliente na loja e por que essa estrutura', 'canais: digital, site/app, fidelidade', 'fornecedores e centro de distribuição']],
      ['Estrutura da Loja', ['padrão de loja', 'ponto comercial']],
      ['Organograma', ['estrutura de pessoas, papéis e responsabilidades']],
      ['Jornada do Cliente', ['jornada presencial e online, com pontos de atrito e melhorias']],
      ['Fluxograma', ['processo ponta a ponta', 'linha do tempo de implantação']],
    ],
  },
  marketing: {
    nome: 'Marketing',
    pergunta: 'Como a marca se posiciona e vende para o público certo?',
    etapas: [
      ['Diagnóstico', ['5Cs: Companhia, Consumidores, Concorrentes, Colaboradores e Contexto']],
      ['STP', ['clusters de público e cluster prioritário', 'persona', 'posicionamento e 3 pilares', 'Golden Circle', 'branding: um slide por pilar']],
      ['Marketing Mix', ['7Ps na ordem: Produto, Praça, Processos, Evidência física, Pessoas, Promoção, Preço', 'retorno financeiro das iniciativas (liga o Marketing ao Financeiro)']],
    ],
  },
  financeiro: {
    nome: 'Financeiro',
    pergunta: 'O plano se paga e cria valor?',
    etapas: [
      ['Premissas', ['demanda, ticket e markup']],
      ['Receitas e Custos', ['build-up da receita', 'CMV e OPEX', 'unit economics, se for rede']],
      ['Investimento', ['CAPEX, estoque e depreciação']],
      ['Resultado e Caixa', ['EBITDA, EBIT e lucro líquido, com tributário', 'caixa, dívida e balanço']],
      ['Valuation', ['WACC, FCFF e perpetuidade', 'DCF, TIR, VPL e EV', 'valor criado pelo plano']],
    ],
  },
};
const norm = (t) => String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
const idDe = (e) => { const n = norm(e); const r = ORDEM.find(o => norm(FLUXOS[o].nome) === n || o === n || (n === 'marketing7ps' || n === '7ps') && o === 'marketing'); if (!r) throw new Error(`escopo desconhecido: "${e}". Use: ${ORDEM.join(', ')}`); return r; };

// resolver(cfg): valida cfg.escopos e devolve { escopos: [{ id, nome, secoes, conteudo }], porSecao, todas }
function resolver(cfg) {
  if (!Array.isArray(cfg.escopos) || !cfg.escopos.length) throw new Error(`config: informe "escopos" (um ou mais de: ${ORDEM.join(', ')}). O fluxo do escopo vai abaixo da linha divisoria de todo slide e gera o arquivo fluxo_<escopo>.md (references/fluxos.md).`);
  const ids = [...new Set(cfg.escopos.map(idDe))].sort((a, b) => ORDEM.indexOf(a) - ORDEM.indexOf(b));
  const escopos = ids.map(id => {
    const F = FLUXOS[id], padrao = F.etapas.map(e => e[0]);
    let secoes = padrao;
    const custom = Array.isArray(cfg.secoes) && ids.length === 1 ? cfg.secoes : (cfg.secoes && !Array.isArray(cfg.secoes) ? cfg.secoes[id] : null);
    if (custom) {
      let k = -1;
      padrao.forEach(p => { const j = custom.findIndex((c, i) => i > k && norm(c) === norm(p)); if (j < 0) throw new Error(`config.secoes do escopo ${F.nome}: falta a etapa "${p}" (ou ela esta fora de ordem). Fluxo padrao: ${padrao.join(' > ')}. Etapas extras sao permitidas.`); k = j; });
      secoes = custom.slice();
    }
    const conteudo = {}; F.etapas.forEach(([n, c]) => { const nome = secoes.find(s => norm(s) === norm(n)); conteudo[nome] = c; });
    return { id, nome: F.nome, pergunta: F.pergunta, secoes, conteudo };
  });
  if (Array.isArray(cfg.secoes) && ids.length > 1) throw new Error('config.secoes como lista so vale com 1 escopo; com varios, use { marketing: [...], financeiro: [...] } ou omita (fluxo padrao).');
  const porSecao = {}, todas = [];
  escopos.forEach(e => e.secoes.forEach(s => { if (porSecao[s]) throw new Error(`etapa "${s}" repetida entre escopos`); porSecao[s] = e; todas.push(s); }));
  return { escopos, porSecao, todas };
}

// gerar(dir, fluxo, slides): grava fluxo_<escopo>.md e valida (>= 1 slide por escopo; aviso por etapa sem slide).
// slides: [{ secao, n }] com n = numero do slide no arquivo final
function gerar(dir, fluxo, slides, arquivoPptx, op = {}) {   // op.gravarMd: grava fluxo_<escopo>.md (16/11/2026: desligado por padrao, nao entregar .md)
  const saidas = [];
  fluxo.escopos.forEach(e => {
    const meus = slides.filter(s => e.secoes.includes(s.secao));
    if (!meus.length) throw new Error(`escopo ${e.nome}: nenhum slide de conteudo nas etapas ${e.secoes.join(', ')}. O escopo pedido precisa de pelo menos 1 slide com o fluxo abaixo da linha divisoria.`);
    const L = [`# Fluxo da apresentação: ${e.nome}`, '', `Pergunta do cliente: ${e.pergunta}`, '', `Faixa abaixo da linha divisória de cada slide: ${e.secoes.join('  |  ')}`, `Arquivo: ${path.basename(arquivoPptx)}`, '',
      '| # | Etapa | O que precisa conter | Slides |', '|---|---|---|---|'];
    const vazias = [];
    e.secoes.forEach((sec, i) => {
      const ns = slides.filter(s => s.secao === sec).map(s => s.n);
      if (!ns.length) vazias.push(sec);
      L.push(`| ${i + 1} | ${sec} | ${(e.conteudo[sec] || ['etapa extra pedida pelo usuário']).join('; ')} | ${ns.length ? [...new Set(ns)].join(', ') : '(sem slide)'} |`);
    });
    if (vazias.length) { L.push('', `Atenção: etapas sem slide: ${vazias.join(', ')}. Se foram dispensadas pelo usuário, avise na entrega; senão, acrescente.`); console.warn(`AVISO fluxo ${e.nome}: etapas sem slide: ${vazias.join(', ')}`); }
    if (op.gravarMd) { const arq = path.join(dir, `fluxo_${e.id}.md`); fs.writeFileSync(arq, L.join('\n') + '\n'); saidas.push(arq); }
  });
  if (saidas.length) console.log('fluxo(s) do escopo gravado(s): ' + saidas.map(a => path.basename(a)).join(', '));
  return saidas;
}
module.exports = { ORDEM, FLUXOS, resolver, gerar, idDe };
