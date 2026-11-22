const fs = require('fs');
const path = require('path');
module.exports = function(cfg, cor, cwd=process.cwd()) {
  const hex = x => { x=String(x).replace(/^#/,'').toUpperCase(); if(!/^[0-9A-F]{6}$/.test(x))throw new Error('Cor invalida: '+x); return x; };
  const p = cfg.paleta || {};
  const identidade = { paleta:{base60:hex(p.base60 || 'FFFFFF'), secundaria30:hex(p.secundaria30 || cor.escuro), destaque10:hex(p.destaque10 || cor.dom)}, proporcao:[60,30,10], tipografia:{titulo:26,subtitulo:14,bloco:13.5,apoioBloco:11.5}, modeloSumario:null };
  if(new Set(Object.values(identidade.paleta)).size!==3)throw new Error('Defina tres cores distintas para os papeis 60/30/10.');
  const arq=path.join(cwd,'identidade_visual.json');
  let anterior; try{anterior=JSON.parse(fs.readFileSync(arq,'utf8'));}catch(e){}
  if(anterior && JSON.stringify(anterior.paleta)!==JSON.stringify(identidade.paleta) && !cfg.atualizarIdentidade)throw new Error('A paleta do projeto ja esta fixada. Alterar somente a pedido do usuario, com atualizarIdentidade:true.');
  const salvar=()=>fs.writeFileSync(arq,JSON.stringify(identidade,null,2)+'\n');
  salvar(); return {dados:identidade,salvar};
};
