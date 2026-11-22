# Imagens, icones, placeholders e tipografia

## 2. Imagens, icones e placeholders

**Busca de imagens na web (opcional, tenta e cai para placeholder).** Quando o assunto tem material visual (produto, marca, fabrica, fachada, setor), busque 1 a 3 candidatas por espaco de imagem com WebSearch/image_search, priorizando press kit oficial da empresa, Wikimedia Commons e bancos livres (Unsplash, Pexels). Para cada escolhida rode `python3 baixar_imagem.py URL --tema "<tema exato usado no deck>" --fonte "<origem e licenca>" --descricao "..."` (grava em `imagens/` e registra no catalogo; recusa o que nao e jpg/png/webp ou tem menos de 900 px). Depois use `deck.imagem(s, { tema: '<mesmo tema>' })` e credite no `deck.fontes` ("Imagem: Wikimedia Commons"). Se o script sair com codigo 3 (sem rede) ou 4 (imagem ruim), NAO insista nem improvise: deixe o placeholder e ponha na pendencia o termo de busca e as URLs candidatas. Nao baixe fotos de pessoas publicas; descarte marca d'agua de banco de imagens. Toda imagem vinda da web entra na lista de pendencias para o usuario confirmar uso e licenca. Nota: o shell costuma nao ter internet; o usuario pode liberar dominios (ex.: upload.wikimedia.org, images.unsplash.com, images.pexels.com) em Configuracoes > Capacidades > acesso a rede.

**Icones: so de linha, pequenos, de uma cor, e so onde as referencias usam** (liberado em 2026-11-11): dentro do no de uma cadeia de valor, ao lado de um item que e um ativo ou etapa fisica, numa lista curta de 3 a 4 fatos. `formas.icone(s, { x, y, d, nome: 'tb/TbTruck' })` (`references/exhibits.md`). Continua vetado o uso de IA: icone em circulo colorido, um icone por bullet, grade de cards com icone. Sem `react-icons`/`sharp` no ambiente o icone vira placeholder; nao desenhe icone com formas.

**Imagens: o usuario prefere fotos.** `deck.imagem(s, { x, y, w, h, caminho?, tema?, descricao? })` resolve nesta ordem: arquivo informado -> biblioteca (`assets/imagens/catalogo.json`, so casa tema exato) -> placeholder `[IMAGEM: ...]`. A imagem e recortada para preencher a area sem distorcer (`foco: [fx, fy]` escolhe a parte que fica). Toda imagem que veio da biblioteca vai na lista de pendencias para o usuario confirmar. Voce nao gera imagens, e nao desenha com formas uma imitacao de foto, mapa, ilustracao, logo, retrato ou produto (fica amador).

Construcao do slide (barra, formas do miolo, graficos e tabelas nativos com dados reais, anotacoes, diagramas de analise: secao 5) voce faz normalmente. Grafico sem dado confirmado vira `[GRAFICO: ...]`; numero, citacao ou nome sem fonte vira `[DADO: ...]` na cor de alerta.

Animacoes: ainda nao implementadas (o usuario mencionou interesse, mas nao definiu quais). Nao improvise.

**Tipografia (lista fechada, uma fonte no deck inteiro):**

| Fonte aprovada | Observacao |
|---|---|
| **Gill Sans MT** | Office (Windows e Mac). Regular, Bold, Italic |
| **Dubai** | Windows 10/11; no Mac depende das fontes do Office (avise). Light, Regular, Medium, Bold |
| **Montserrat** | Fonte de 7 dos 13 decks de referencia (Kepler, M&A, Orizon, Vivara, Vibra, Hermes, Agrion). Gratuita (Google Fonts); precisa estar instalada na maquina de quem abre, senao o PowerPoint substitui: avise |

**Proibidas** (padrao do Claude): Calibri, Arial, Aptos, Georgia, Times New Roman, Cambria, Helvetica. A lista so cresce com aprovacao do usuario. A mesma fonte vale para titulo, textos, graficos (`'+mn-lt'`), rodape e numero; hierarquia por tamanho, peso e cor. Essas fontes nao existem no ambiente de renderizacao: peca os .ttf (instale com `mkdir -p ~/.fonts && cp *.ttf ~/.fonts/ && fc-cache -f` e passe `fonteTtf`/`fonteTtfBold` ao `moldura.js`); sem eles, deixe ~15% de folga nas caixas e avise que a previa e aproximada.
