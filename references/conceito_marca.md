# Conceito visual da empresa (capa e sumário criativos)

Origem (23/11/2026): o usuário notou que as referências **usam elementos do caso para montar a capa e o sumário**: a capa da Hermès é uma embalagem (caixa, fita, lenço), a da Cimed é a caixa do remédio, o sumário da Kepler nasce da forma da logo, o da BTG é o celular do banco, o da Wine é a vinícola. A skill repetia modelos porque escolhia só pelo layout. Agora ela olha **a empresa analisada**, define o elemento dela e só então escolhe (por sorteio) entre os modelos que esse elemento comporta.

## Passo a passo (antes do resumo do briefing)

1. **Pesquisar a empresa** (site, produto, loja, embalagem, identidade, cores). Anotar o que a torna reconhecível.
2. **Dossiê visual em 5 linhas**: (a) objeto icônico do setor ou do produto; (b) elemento de identidade (padrão, monograma, forma da logo, cor); (c) ambiente (fachada, loja, fábrica, campo); (d) produto ou embalagem; (e) experiência (app, jornada, vitrine).
3. **Definir os elementos que EXISTEM** para este caso e quais arquivos o usuário mandou: `foto` (operação/fachada), `fotos` (3 de produto/ambiente), `objetoPng` (embalagem/produto recortado), `recomendacao` (relatório de equity) e `silhueta` (objeto do setor desenhado pela skill, ver tabela).
4. **Sortear a proposta**: `node propor_visual.js --silhueta <objeto|setor> --elementos foto,fotos,objetoPng --itens <n de etapas> [--evitar <modelos do deck anterior>]`. Só entram no sorteio os modelos cujo elemento da marca existe (`sorteio.js`). Grava em `estilo_deck.json`; o build reaproveita (`deck.capa` sem `modelo` usa o modelo sorteado).
5. **Mostrar no resumo do briefing** (2 linhas): `Capa: <modelo>, com <elemento da marca> (<arquivo, pesquisa ou placeholder>)` e `Sumário: <estilo>, <como usa o elemento do caso>`. Oferecer `Quero outra opção` no painel: roda `--refazer capa|sumario|tudo`. Não pedir aprovação de cada detalhe.
6. **Construir**: `silhueta` no config (vale para capa e sumário) e `deck.capa({ titulo, ... })` sem `modelo`.

## Setor → objeto → ideia

| Setor | `silhueta` | Capa (ideia) | Sumário (ideia) |
|---|---|---|---|
| Supermercado, varejo, atacado | `carrinho` | `objeto_marca`: carrinho no medalhão e padrão de carrinhos | `objeto_marcadores` (cada etapa é um carrinho) ou `faixas_logo` (faixas saindo do carrinho) |
| Moda, loja | `sacola` | `objeto_marca` | `objeto_marcadores` |
| Luxo, joalheria, presente, e-commerce | `caixa` | `fita_padrao`: fita com o nome da marca sobre padrão de caixas (a Hermès) ou `objeto_marca` | `faixas_logo` com a caixa |
| Vinho, bebidas | `garrafa` | `objeto_marca` ou `foto_onda_base` com o vinhedo | `trilha_pergunta` com a foto da vinícola |
| Banco, pagamentos | `cartao` | `objeto_marca` ou `poligonos_centro` | `losangos_celular` (tela do app com valores reais) |
| Fintech, app, tecnologia | `celular` | `poligonos_centro` | `losangos_celular` |
| Imobiliário, construção, shopping | `predio` / `casa` | `foto_onda_base` (fachada) | `faixas_logo` com o prédio |
| Agro, alimentos | `folha` | `foto_onda_base` (silo, lavoura) | `faixas_logo` (inicial ou folha) |
| Petróleo, saneamento, energia | `gota` / `raio` | `objeto_marca` ou `poligonos_centro` | `hexagonos_arco` (pilares) |
| Indústria | `engrenagem` | `radial` ou `objeto_marca` | `hexagonos_arco` |
| Logística, transporte | `caminhao` | `foto_onda_base` ou `objeto_marca` | `objeto_marcadores` |
| Aviação, turismo | `aviao` | `objeto_marca` | `trilha_pergunta` |
| Saúde | `cruz` | `foto_lateral` (operação) ou `objeto_marca` | `hexagonos_arco` |
| Educação, editora | `livro` | `objeto_marca` | `objeto_marcadores` |
| Remédio, higiene, consumo com embalagem icônica | (PNG) | `produto_onda` com a embalagem recortada | `faixas_logo` com a inicial |

A tabela é ponto de partida, não regra: o sorteio decide entre os modelos compatíveis. Setor sem objeto na lista: use o mais próximo ou não informe `silhueta` (o sorteio fica entre os modelos que não precisam dela).

## Regras

- **Objeto do setor, nunca a marca de outra empresa.** A silhueta é genérica (um carrinho, uma garrafa). Não desenhar logo, mascote, embalagem registrada nem produto de marca; se o usuário mandou a embalagem ou a foto da empresa, usar o arquivo dele (PNG recortado em `produto_onda`).
- **Nada da referência vai para o deck**: nem o cavalinho da Hermès, nem a caixa da Cimed. Vale o mecanismo (embalagem, objeto, padrão), não o objeto.
- **Variar entre decks**: passar `--evitar` com o modelo de capa e o estilo de sumário do deck anterior do usuário.
- **Uma ideia por deck**: capa e sumário compartilham o mesmo objeto (e as mesmas cores da paleta 60/30/10). Não misturar objetos.
- **Faltou o elemento**: placeholder `[IMAGEM: ...]` na lista de pendências; não trocar de modelo só para esconder a lacuna sem avisar.
- **Pop-ups e conteúdo** continuam sem ilustração decorativa: o objeto vive na capa e no sumário.
