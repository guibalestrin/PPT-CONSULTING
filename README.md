# PPT-CONSULTING by guibalestrin

Skill do Claude (`slides-consultoria-br`) que monta decks de consultoria em PowerPoint (.pptx) no padrão dos projetos Insper Jr: mercadológico, operacional, marketing/7Ps e financeiro de viabilidade. O texto sai em português, com revelação progressiva, cards e imagens.

A skill entrega o **sketch completo do projeto** (fluxo do escopo, organização de cada slide, exhibits desenhados) para o consultor preencher dados e análises. Ela constrói **um slide por vez**: mostra a prévia, espera a aprovação ou o ajuste e só então segue para o próximo.

## Como usar

**No Claude (app ou claude.ai):** baixe o ZIP da [última release](../../releases) ou gere um com `_dev/empacotar.ps1`. Depois vá em Configurações > Capacidades > Skills e envie o ZIP.

**No Claude Code:** clone o repositório dentro da pasta de skills. A skill passa a usar sempre a versão do repositório; um `git pull` atualiza.
```powershell
git clone https://github.com/guibalestrin/PPT-CONSULTING "$HOME\.claude\skills\slides-consultoria-br"
```

Requisitos: Node.js com `pptxgenjs`, Python com `lxml` (Pillow opcional) e PowerPoint para a prévia (ou LibreOffice). No Windows, `scripts/preparar.ps1` confere tudo e prepara a pasta do deck.

## Estrutura

| Pasta | O que tem |
|---|---|
| `SKILL.md` | Instruções que o Claude segue: briefing, protocolo, fluxo slide a slide, regras e entrega |
| `references/` | Regras detalhadas: gramática visual, escopos, vetos, aprendizados do usuário |
| `scripts/` | Motor do deck (`moldura.js` + módulos), QA (`qa_deck.py`), prévia (`renderizar.ps1`), feedback (`feedback.py`) |
| `assets/referencias/` | Slides de referência por tipo de informação, sorteados a cada deck |
| `assets/contraexemplos/` | Composições reprovadas (o que não fazer) |
| `_dev/` | Ferramentas de quem mantém a skill (empacotar o ZIP); não entra no ZIP |

## Como contribuir

1. Faça um fork, ou peça acesso de colaborador ao dono do repositório.
2. Crie uma branch: `git checkout -b minha-melhoria`.
3. Teste antes de propor:
   - `scripts\preparar.ps1 -Destino <pasta de teste>`;
   - `node build_deck.js`;
   - `py qa_deck.py <deck>.pptx`, que precisa terminar sem ERRO;
   - `renderizar.ps1 -Deck <deck>.pptx`, para olhar a folha de contato.
4. Abra um Pull Request explicando o que mudou e por quê. Anexe o antes e depois da prévia quando mexer em visual.

Regras da casa:
- **Feedback do dono vale como regra.** Mudança que contradiz `references/aprendizados.md` precisa ser combinada antes.
- **Toda regra nova precisa de trava.** Regra só em texto se perde: sempre que der, implemente no `qa_deck.py` ou no código, não só no `SKILL.md`.
- **Não suba deck de cliente** nem dado confidencial no repositório.
