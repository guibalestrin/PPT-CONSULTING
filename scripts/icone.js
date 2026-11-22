// icone.js -- gera o PNG de um icone de LINHA (react-icons) numa cor. Chamado por exhibits.js (formas.icone).
// Uso: node icone.js "tb/TbTruck" 2E6B4F saida.png [px]
// Familias de linha que combinam com os decks de referencia: tb (Tabler), lu (Lucide), fi (Feather), pi (Phosphor: nomes "...Light").
// Sai com codigo 3 se o icone nao existe e 4 se faltar react-icons/sharp: quem chama deixa um placeholder.
const path = require('path');
const [, , ref, cor, out, px = '256'] = process.argv;
function req(m) {
  try { return require(m); } catch (e) {
    const g = require('child_process').execSync('npm root -g').toString().trim();
    return require(path.join(g, m));
  }
}
let React, renderToStaticMarkup, sharp, pack;
const [lib, nome] = String(ref || '').split('/');
try { React = req('react'); ({ renderToStaticMarkup } = req('react-dom/server')); sharp = req('sharp'); pack = req('react-icons/' + lib); }
catch (e) { console.error('icone.js: faltam react, react-dom, react-icons ou sharp (' + e.message.split('\n')[0] + ')'); process.exit(4); }
if (!pack[nome]) { console.error(`icone.js: "${ref}" nao existe em react-icons`); process.exit(3); }
const svg = renderToStaticMarkup(React.createElement(pack[nome], { color: '#' + cor, size: px }));
sharp(Buffer.from(svg)).png().toFile(out).then(() => process.exit(0)).catch(e => { console.error(e.message); process.exit(4); });
