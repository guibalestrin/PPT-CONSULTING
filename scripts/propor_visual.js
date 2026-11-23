#!/usr/bin/env node
// propor_visual.js -- sorteia (uma vez por projeto) o MODELO DE CAPA e o ESTILO DE SUMARIO que sao compativeis com os elementos
// que a empresa analisada tem, e grava em estilo_deck.json. Rode ANTES do resumo do briefing, para propor ao usuario.
//   node propor_visual.js --silhueta supermercado --elementos foto,fotos,objetoPng --itens 6 [--evitar circulo,radial] [--refazer capa|sumario|tudo]
// --silhueta  objeto ou setor (carrinho, supermercado, luxo, vinho...; lista em silhuetas.js). Habilita objeto_marca e objeto_marcadores.
// --elementos o que EXISTE para esta empresa: foto (foto da operacao/fachada), fotos (3 fotos de produto/ambiente), objetoPng (embalagem/produto
//             recortado em PNG), recomendacao (relatorio de equity com preco-alvo). Sem o elemento, o modelo que o exige nao e sorteado.
// --itens     quantos itens tera o sumario (etapas do fluxo do escopo; padrao 6)
// --evitar    modelos usados no deck anterior do usuario (so e respeitado se sobrar alternativa)
// Saida: JSON em stdout com a proposta, os elegiveis e o que foi mantido; nada e redesenhado se ja houver sorteio (use --refazer).
const S = require('./sorteio.js');
const SIL = require('./silhuetas.js')({ shapes: {} });
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const lista = (v) => String(v || '').split(',').map(x => x.trim()).filter(Boolean);
const silhueta = arg('silhueta') ? SIL.resolver(arg('silhueta')) : null;
if (arg('silhueta') && !silhueta) { console.error(`silhueta desconhecida: "${arg('silhueta')}". Objetos: ${SIL.NOMES.join(', ')}`); process.exit(2); }
const el = { silhueta }; lista(arg('elementos')).forEach(k => { el[k] = true; });
const n = Number(arg('itens', 6)), evitar = lista(arg('evitar')), refazer = arg('refazer', ''), salvo = S.lerEstilo();
const novo = {};
if (refazer === 'capa' || refazer === 'tudo' || !salvo.modeloCapa) novo.modeloCapa = S.sortearCapa(el, evitar);
if (refazer === 'sumario' || refazer === 'tudo' || !salvo.estiloSumario || !S.sumariosElegiveis(n, el).includes(salvo.estiloSumario)) {
  const e = S.sortearSumario(n, el, evitar); Object.assign(novo, { estiloSumario: e, sumarios: [e] });
}
const final = Object.keys(novo).length ? S.gravarEstilo(novo) : salvo;
console.log(JSON.stringify({ capa: final.modeloCapa, sumario: final.estiloSumario, silhueta, elegiveis: { capas: S.capasElegiveis(el), sumarios: S.sumariosElegiveis(n, el) },
  origem: { capa: novo.modeloCapa ? 'sorteado' : 'mantido', sumario: novo.estiloSumario ? 'sorteado' : 'mantido' } }, null, 2));
