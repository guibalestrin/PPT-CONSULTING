// Verifica a geometria pública de todos os modelos, sem criar slides ou instalar dependências.
// Uso: node validar_sumarios.js
const assert = require('assert');
const tom = (h,f) => {
  const n=parseInt(h,16);
  return [16,8,0].map(k=>{const v=(n>>k)&255;return Math.round(f>=0?v+(255-v)*f:v*(1+f)).toString(16).padStart(2,'0');}).join('');
};
const engine=require('./sumario_cores.js')({
  pres:{shapes:{}},COR:{dom:'C8102E',dest:'252B33',texto:'333333'},
  F:'Montserrat',formas:{larguraTexto:()=>1},tom,cfg:{}
});
let total=0;
for(const style of engine.ESTILOS){
  const max=engine.MAXN[style];
  for(let n=1;n<=max;n++){
    const rects=engine.layout(style,n);
    assert.equal(rects.length,n);
    engine.validar(rects);
    assert.deepStrictEqual(rects,engine.layout(style,n));
    total++;
  }
}
assert.throws(()=>engine.layout('cartoes',6));
assert.throws(()=>engine.layout('circulos',0));
assert.throws(()=>engine.validar([{x:1,y:2,w:3,h:1},{x:2,y:2,w:3,h:1}]));
console.log('OK: '+total+' geometrias deterministicas, sem sobreposicao ou estouro.');
