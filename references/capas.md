> Regra vigente (15/11/2026): um único modelo e fundo de sumário em todo o deck; paleta fixa 60/30/10; título 26pt e subtítulo 14pt, sem reduzir fonte. As composições de `contraexemplos_huawei.md` são vetadas; `faixasNumeradasArco` não pode ser usada no modo Insper Jr. Exemplos legados abaixo não substituem estas regras.

# Capas (modelos copiados das referencias do usuario)

Leia **sempre** antes de montar a capa. Regra do usuario (2026-11-11): **na capa a estrutura e copiada literalmente**, porque ja funciona. So se adaptam imagens, logos, cores (paleta do deck) e textos do caso. Nao invente capa nova, nao misture modelos, nao "melhore" a composicao. A capa **nao tem barra lateral** nem moldura.

Cada modelo esta em `scripts/capas.js`; as imagens de referencia ficam em `assets/capas/ref_<modelo>.jpg` (abra com Read para ver o original antes de montar). As marcas que aparecem nas referencias sao so documentacao: nunca entram num deck.

```javascript
deck.capa({
  modelo: 'ondas_foto',                         // obrigatorio
  titulo: 'Mergers & Acquisitions 2025.2',      // nome do trabalho (obrigatorio)
  subtitulo: 'AgroInsper',                      // opcional
  integrantes: ['Nome 1', 'Nome 2'],
  creditos: [['Em parceria com', 'Nome'], ['Coordenador', 'Nome']],   // head, coordenador, parceria...
  empresas: [{ nome: 'Bunge', logo: 'bunge.png' }, { nome: 'Kepler Weber', logo: null }],   // padrao: cfg.logos.analisada
  logos: { apresentador: 'grupo.png', parceiro: 'condere.png' },      // padrao do apresentador: cfg.logos.apresentador
  imagem: 'silos.jpg', tema: null, imagemDescricao: 'silos a noite', foco: [0.5, 0.6],
  rodape: null,                                 // linha extra (curso, data), opcional
  logosNegativos: true,                         // padrao: logo PNG escuro com fundo transparente vira branco nos modelos escuros
});
```

## Como escolher o modelo (pelo contexto do caso)

| Modelo | Referencia | Use quando | Precisa de |
|---|---|---|---|
| `foto_lateral` | Rede D'Or, *Investment Thesis* | O negocio tem uma cena forte para mostrar (hospital, fabrica, loja, operacao); tese ou analise de uma empresa | foto horizontal da operacao; logo da empresa (versao branca) |
| `circulo` | Nu, *Insper Asset Management* | Marca forte e reconhecivel, sem foto boa; empresa digital/servicos; o logo e a imagem | logo da empresa (branca); quem apresenta entra como texto |
| `ondas_foto` | Bunge & Kepler Weber, *M&A AgroInsper* | Duas empresas (M&A, parceria, comparacao) ou ativo fisico grande (silo, porto, planta); muitos creditos (parceria, coordenacao, trainees) | foto do ativo (fica escurecida); 1 ou 2 logos |
| `recomendacao` | Vibra, *CFA Research Challenge* | Relatorio de equity com recomendacao (compra/venda), preco-alvo e upside; fundo branco | ticker, data, recomendacao, preco-alvo, upside; foto de produto **recortada em PNG sem fundo** |
| `radial` | Agrion, *AgroInsper Credito* | Sem foto; credito, consultoria, apresentacao final; visual mais tecnologico | logo da empresa e do grupo (brancas); opcional logo de parceiro |

Varie entre decks quando o contexto permitir mais de um modelo (preferencia do usuario: variacao entre decks, nao 100% diferente). Diga na entrega qual modelo foi usado e por que, em uma linha, para o usuario poder pedir outro. Se o modelo exige algo que nao veio (foto, ticker), use placeholder/`[DADO: ...]` e liste na pendencia; nao troque de modelo so para esconder a lacuna sem avisar.

## Anatomia de cada modelo (o que e copiado)

**`foto_lateral`**: painel escuro em degrade (dominante -> escuro) na esquerda, que se dissolve na foto da direita (foto tingida com a dominante, faixa diagonal translucida). Logo grande da empresa em branco no meio-esquerda (y ~2,6). Logo pequeno de quem apresenta + nome do trabalho (20-22pt, branco) logo abaixo. Integrantes ("A | B") e creditos ("Head: X") em 12pt no canto inferior esquerdo. `subtitulo` aparece sob o titulo, mais claro.

**`circulo`**: fundo do quase-preto para a dominante com ondas organicas na dominante; circulo preto central (4,5 pol) com sombra difusa. Dentro, de cima para baixo: `titulo` (13pt; `*palavra*` vira italico, como "*Insper* Asset Management"), logo grande da empresa, fio fino branco, integrantes ("A | B"), creditos em italico. Logo de quem apresenta, se houver, pequeno na base do circulo.

**`ondas_foto`**: foto em tela cheia escurecida; faixa preta ondulada no topo (diagonal no canto esquerdo, onda que desce ate o centro e sobe ao canto direito, recorte no topo) com as logos ("A & B" ou uma so), fio fino e `titulo | subtitulo` em negrito; faixa preta ondulada na base com o 1o credito ("Em parceria com X", rotulo em negrito italico), linha em branco, demais creditos e "`rotuloIntegrantes`: nomes". Fios brancos finos contornam as ondas. Logo de parceiro no canto superior direito (pequeno), de quem apresenta no inferior direito.

**`recomendacao`**: fundo branco. Canto superior esquerdo: logo do organizador (`logos.parceiro`, ex.: CFA) ou, sem ele, o `titulo` em negrito. Logo da empresa + "(ticker)"; "Ultima atualizacao: data"; espaco; "Recomendacao: **COMPRA**" (24pt, palavra na cor de destaque); "Preco-alvo" e "Upside" lado a lado. A direita, foto de produto em pe, apoiada na faixa de rodape, na frente de um triangulo na dominante. Faixa escura de rodape com integrantes e logo de quem apresenta (branco). Parametro extra: `recomendacao: { ticker, data, recomendacao, precoAlvo, upside, rotulos? }` (rotulos em portugues por padrao; troque para ingles se o deck for em ingles).

**`radial`**: fundo em degrade horizontal do grafite para a dominante escurecida; leques de tracos finos (como onda de audio) na cor de destaque clara: um grande envolvendo o logo da empresa e tres nos cantos. Coluna esquerda centralizada: logo de quem apresenta, fio branco, `titulo` (negrito, 22pt, caixa alta curta funciona melhor) e `subtitulo`. Logo grande da empresa no centro do leque. Canto inferior esquerdo: nomes dos `creditos` em negrito e integrantes em regular, um por linha. Logo de parceiro no inferior direito.

## O que e estrutura (copiar) e o que e do caso (trocar)

Copiar = posicoes, proporcoes, ondas, circulo, leques, faixas, hierarquia de textos, tipo de elemento em cada lugar. **Trocar = todo elemento que carrega o contexto da referencia.** Nada da referencia vai para o deck: nem marca, nem foto, nem texto, nem o objeto que identifica o negocio dela.

| Modelo | Copiar (estrutura) | Trocar pelo caso (nunca manter o da referencia) |
|---|---|---|
| `foto_lateral` | painel em degrade que se dissolve na foto, logo grande a esquerda, titulo, creditos no rodape | foto (cena do negocio do caso, nao cirurgia), logo da empresa e do grupo, titulo, nomes |
| `circulo` | circulo preto com sombra, ondas, ordem dos textos dentro dele | logo da empresa, nome do grupo/trabalho, nomes; cores das ondas vem da paleta do caso |
| `ondas_foto` | faixas onduladas com fios, "A & B" no topo, creditos na base | foto do ativo do caso (nao silos), 1 ou 2 logos, parceiro, coordenacao, trainees |
| `recomendacao` | logo do organizador, ticker, recomendacao, preco-alvo/upside, objeto em pe sobre o triangulo, faixa de rodape | **o objeto em pe e o elemento visual do negocio do caso** (embalagem, produto, equipamento, fachada recortada, mascote da marca): a placa da BR so faz sentido para a Vibra. Cor do triangulo e do rodape = paleta do caso. Logo do organizador, ticker, data, valores |
| `radial` | degrade grafite, leques de tracos, coluna esquerda, logo grande no centro | logos, titulo, nomes; cor dos leques e do degrade vem da paleta |

**Elemento visual sem equivalente no caso.** Em `recomendacao`, sem um objeto recortado que represente a empresa, nao force: use outro modelo (`circulo` ou `radial` se so ha logo; `foto_lateral` se ha foto) e avise. Se o usuario ainda vai mandar o arquivo, deixe o placeholder descrito com o que serve naquele lugar ("embalagem do produto em PNG sem fundo"), nunca a imagem da referencia.

**As imagens em `assets/capas/ref_*.jpg` sao so para comparar a estrutura.** Nunca use, recorte ou recolora nada delas no deck. Em testes da skill, use logos e fotos neutros, nunca os da referencia.

## Logos e fotos

- Nos modelos escuros os logos precisam ser brancos. Com `logosNegativos: true` (padrao), PNG escuro com fundo transparente e recolorido para branco; JPG ou PNG sem transparencia fica como esta e gera aviso: peca ao usuario a versao negativa. Logo multicolorido recolorido vira silhueta branca: confirme com o usuario.
- `recomendacao` usa os logos nas cores originais (fundo branco), exceto o de quem apresenta, no rodape escuro.
- Fotos seguem a ordem de `deck.imagem` (arquivo -> biblioteca por tema exato -> placeholder). Placeholders da capa sao escuros nos modelos escuros, para nao estragar a composicao.
- `foco: [fx, fy]` escolhe a parte da foto que fica no recorte.

## Novos exemplos de capa

Se o usuario pedir para adicionar um novo modelo de capa a esta skill: (1) salve a imagem em `assets/capas/ref_<nome>.jpg`; (2) escreva a funcao do modelo em `scripts/capas.js` copiando a estrutura (posicoes medidas na imagem: px / 119,4 = polegadas no slide de 13,33 x 7,5), com as cores vindas da paleta (`COR.dom`, `COR.dest`, `COR.escuro`) e os textos/logos como parametros; (3) registre no `MODELOS`, nesta tabela e na anatomia; (4) teste com e sem arquivos (placeholders) e renderize; (5) salve a atualizacao da skill; entregue ZIP somente se solicitado. Se o pedido for apenas aplicar a capa em um deck, entregue o `.pptx` sem alterar esta skill.
