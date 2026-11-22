# Biblioteca de imagens

Pasta das imagens que o usuario aprovou e tem direito de usar (fotos de fachada, escritorio, setor, produto etc.).
O catalogo comeca vazio. Imagens entram por cadastro manual (abaixo) ou por `scripts/baixar_imagem.py` (web, quando ha rede; registra sozinho). A skill nunca inventa arte; sem imagem, vira placeholder.

## Como cadastrar

1. Coloque o arquivo (jpg, png ou webp) nesta pasta.
2. Acrescente uma entrada em `catalogo.json`:

```json
[
  { "arquivo": "magalu_fachada.jpg", "temas": ["magazine luiza fachada", "varejo"], "descricao": "Fachada da sede", "fonte": "Press kit da empresa" }
]
```

- `temas`: palavras que o deck usa em `deck.imagem(s, { tema: '...' })` ou `deck.capa({ tema: '...' })`. So casa tema **exato** (sem diferenca de maiusculas): a skill nao adivinha.
- `fonte`: de onde veio e a licenca; todo uso fica na lista de pendencias para o usuario confirmar.

## Como a skill usa

`deck.imagem` procura nesta ordem: arquivo informado -> tema no catalogo -> placeholder `[IMAGEM: ...]`. A imagem e recortada para
preencher a area (use `foco: [fx, fy]` de 0 a 1 para escolher a parte que fica) e o recorte nao distorce.
