# Fonte única da skill `slides-consultoria-br`

Esta pasta (`skill/`) é a **única fonte** da skill. Ela é versionada com git. A cópia instalada no Claude é só o resultado do ZIP gerado daqui.

## Como mudar a skill
1. Edite os arquivos aqui (nunca a cópia instalada em `AppData\Local\Claude-Data\...`: ela é substituída a cada upload e as mudanças feitas nela se perdem, como aconteceu com o feedback de 16/11/2026).
2. Teste: `scripts\preparar.ps1 -Destino <pasta de teste>`, `node build_deck.js`, `py qa_deck.py <deck>.pptx`, `renderizar.ps1 -Deck <deck>.pptx`.
3. Faça o commit: `git add -A` e depois `git commit -m "o que mudou"`.
4. Gere o ZIP: `powershell -ExecutionPolicy Bypass -File _dev\empacotar.ps1`. O ZIP vai para `..\dist\`.
5. Suba no Claude: Configurações > Capacidades > Skills > substituir `slides-consultoria-br`.

## Versões antigas
- `..\arquivo_versoes\2026-11-18_slides-consultoria-br.zip`: a versão instalada até 22/11/2026 (base da auditoria).
- Cópias que ficaram fora daqui e podem ser apagadas quando quiser: `~\.codex\skills\slides-consultoria-br` (de 11/11), `~\Downloads\slides-consultoria-br.zip` (igual à de 18/11) e `Desktop\Skill-Slide-Consultoria.zip` (de 15/11, só na nuvem do OneDrive).
