# Memorial Técnico

## Sprint — Limite de Empates no Sorteio Inicial (v0.19.0-preview)

### Objetivo

Corrigir a experiência do sorteio inicial que permitia empates consecutivos ilimitados, causando repetições chatas. Aplicar um limite de 2 empates com desempate automático no 3º.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | **Modificado** — `startDrawSequence()` ganhou contador `tieCount`; no 3º empate consecutivo, escolhe vencedor aleatório com mensagem divertida |
| `CHANGELOG.md` | **Modificado** — Entrada v0.19.0 adicionada |
| `README.md` | **Modificado** — Versão v0.19.0, funcionalidades atuais |
| `docs/visao-geral.md` | **Modificado** — Sessão v0.19.0 |
| `docs/arquitetura.md` | **Modificado** — Seção "Sorteio Inicial" adicionada |
| `docs/regras-do-jogo.md` | **Modificado** — Regras do sorteio inicial documentadas |
| `docs/roadmap.md` | **Modificado** — Sessão v0.19.0 adicionada |
| `docs/memorial-tecnico.md` | **Modificado** — Sprint adicionada |

### Decisões Técnicas

| Decisão | Alternativas | Motivo |
|---------|-------------|--------|
| Contador `tieCount` local em `startDrawSequence()` | Variável global ou em `drawState` | Apenas o sorteio inicial precisa do contador — não há motivo para expor globalmente. A função é chamada uma vez por partida |
| Limite de 2 empates (3º é auto) | Limite de 1 ou 3 empates | 2 empates dá chance justa de desempate por dado; o 3º evita frustração |
| Mensagens aleatórias de um array | Mensagem fixa | Variedade torna a experiência mais divertida para crianças |

### Fluxo do Sorteio com Desempate

```
startDrawSequence()
  ├── tieCount = 0
  ├── [loop]
  │   ├── Jogador 0 rola dado (ou bot aguarda 800ms)
  │   ├── Jogador 1 rola dado (ou bot automático)
  │   ├── Se v1 === v2:
  │   │   ├── tieCount++
  │   │   ├── Se tieCount > 2 (3º empate):
  │   │   │   ├── Sorteia winnerIndex (0 ou 1) aleatório
  │   │   │   ├── Mostra mensagem divertida
  │   │   │   └── break (fim do sorteio)
  │   │   └── Senão:
  │   │       ├── Mostra "🤝 Empate! Vamos rolar novamente!"
  │   │       └── continue (re-rolar)
  │   └── Se v1 !== v2:
  │       ├── winnerIndex = v1 > v2 ? 0 : 1
  │       └── break (fim do sorteio)
  └── continueAfterDraw() → aplica winnerIndex ao jogo
```

### Como Testar

1. Abrir o jogo e iniciar uma partida (2 jogadores ou 1 jogador vs máquina)
2. No sorteio inicial, ambos os jogadores rolarem o mesmo valor (simular mentalmente)
3. Observar a mensagem "Empate! Vamos rolar novamente!" e os dados resetarem
4. Repetir o empate mais uma vez (2º empate)
5. No 3º empate, observar o desempate automático com uma das mensagens divertidas
6. Verificar que o jogador escolhido começa corretamente
7. Verificar que durante a partida, o dado normal continua sem alteração

## Sprint — Revisão do Sistema de Perguntas — QST-001 (v0.18.0-preview)

### Objetivo

Revisar e melhorar o sistema de perguntas educativas do Lara World — expandir o banco, implementar seleção temática por mundo, criar painel de auditoria em debug e corrigir a cascata indevida pós-desafio, sem refatorar a engine principal nem alterar regras de movimento, dado, turnos, portais ou minigame.

### Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `src/data/questions.js` | Módulo do banco de perguntas — 128 perguntas, 9 categorias, `categoryIndices`, `worldCategoryMap`, `getIndicesPorMundo`, `getCategoriasPorMundo` |

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | **Modificado** — Import do novo módulo `./data/questions.js`. `sortearQuestao()` refatorado para filtrar por mundo temático, com fallback geral e reset automático. Removida a cascata pós-desafio (linhas 621-623). `setupDebugMode()` estendido com `renderQuestions()` e handler `toggle-questions` |
| `src/style.css` | **Modificado** — Estilos `.debug-questions-summary`, `.debug-dq-cat`, `.debug-dq-item`, `.debug-dq-usada`, `.debug-dq-idx`, `.debug-dq-pergunta`, `.debug-dq-opcoes`, `.debug-dq-resposta` adicionados |
| `src/index.html` | **Modificado** — Seção "Banco de Perguntas" adicionada no painel de debug, com botão `📚 Mostrar/Ocultar` |
| `README.md` | **Modificado** — Versão v0.18.0, tabela de status, funcionalidades atuais |
| `CHANGELOG.md` | **Modificado** — Entrada v0.18.0 e v0.17.0 adicionadas |
| `docs/visao-geral.md` | **Modificado** — Sessão v0.18.0 e v0.17.0 adicionadas |
| `docs/arquitetura.md` | **Modificado** — `src/data/` adicionado na árvore, seções de constantes e sorteio atualizadas |
| `docs/regras-do-jogo.md` | **Modificado** — Sorteio temático por mundo documentado, contagem de perguntas atualizada |
| `docs/roadmap.md` | **Modificado** — Sessão v0.18.0 com checklist QST-001 adicionada |
| `docs/memorial-tecnico.md` | **Modificado** — Sprint QST-001 adicionada |

### Decisões Técnicas

| Decisão | Alternativas | Motivo |
|---------|-------------|--------|
| Manter `bancoQuestoes` como objeto de categorias + `questoesDisponiveis` como flat array | Migrar para JSON ou SQLite | Compatibilidade retroativa total — o formato `{ pergunta, opcoes, resposta }` não mudou. O campo opcional `dificuldade` é ignorado por funções que não o usam |
| `categoryIndices` mapeia categoria → índices no flat pool | Adicionar `categoria` em cada pergunta | Evita modificar as 128 perguntas individuais. O mapeamento é computado uma vez na carga |
| `worldCategoryMap` por ID de mundo (ex: `'floresta-encantada'`) | Tag `mundos` em cada pergunta | Agrupamento por categoria é mais simples e escalável. O mapeamento centralizado permite ajustes sem editar perguntas |
| Fallback geral se pool temático < 5 itens | Sempre usar pool temático | Evita que um mundo com poucas perguntas temáticas fique preso em repetições |
| `gameState.questoesUsadas` global (não por mundo) | Set separado por mundo | Como o jogador só está em um mundo por vez, o Set global é suficiente. Se mudar de mundo, as usadas anteriores não interferem (índices não se sobrepõem entre categorias diferentes) |
| `renderQuestions()` com `setInterval(1000)` no debug | Apenas no toggle | A atualização periódica garante que o contador de usadas reflita o estado atual sem recarregar |

### Estrutura do Banco

```
src/data/questions.js
├── bancoQuestoes (objeto)
│   ├── Matematica           (15 perguntas, facil/media)
│   ├── Portugues            (17 perguntas, facil/media)
│   ├── Animais              (17 perguntas, facil/media)
│   ├── Espaco               (16 perguntas, facil/media)
│   ├── Natureza             (15 perguntas, facil/media)
│   ├── Dinossauros          (12 perguntas, facil/media)
│   ├── Logica               (12 perguntas, facil)
│   ├── CoresEFormas         (12 perguntas, facil/media)
│   └── ConhecimentosGerais  (12 perguntas, facil/media)
├── questoesDisponiveis (array flat, 128 itens)
├── categoryIndices (objeto: categoria → indices[])
├── worldCategoryMap (objeto: mundoId → categorias[])
├── getIndicesPorMundo(mundoId) → indices[] | null
└── getCategoriasPorMundo(mundoId) → string[]
```

### Mapeamento Temático

| Mundo | Categorias | Total Disponível |
|-------|-----------|-----------------|
| Galáxia Estelar (`galaxia-estelar`) | Espaço, Lógica, Conhecimentos Gerais | 40 |
| Floresta Encantada (`floresta-encantada`) + Floresta Misteriosa (`floresta-misteriosa`) | Animais, Natureza, Cores e Formas, Lógica | 56 |
| Vale dos Dinossauros (`dinossauros`) + Caverna dos Fósseis (`caverna-dos-fosseis`) | Dinossauros, Animais, Natureza, Matemática | 59 |

### Algoritmo Final (sortearQuestao)

```
1. Determinar mundo atual: gameState.activeSubworldId || selectedWorldId
2. Obter índices elegíveis via getIndicesPorMundo(mundoId)
   → se null, usar todos os índices (fallback geral)
3. Filtrar índices não usados (gameState.questoesUsadas)
4. Se pool vazio:
   a. Limpar Set de usadas
   b. Se pool temático < 5: usar fallback geral
   c. Senão: recomeçar com pool temático completo
5. Sortear índice aleatório do pool
6. Marcar como usado
7. Retornar questoesDisponiveis[índice]
```

### Como Acessar a Visualização no Debug

1. Abrir o jogo com `?debug=1` na URL
2. O painel de debug aparece no final da página
3. Rolar até a seção "Banco de Perguntas"
4. Clicar em "📚 Mostrar"
5. A lista exibe: categoria, índice global, pergunta, opções, resposta e dificuldade
6. Perguntas já usadas na partida aparecem tachadas com opacidade reduzida
7. O cabeçalho mostra total, usadas e mundo atual com categorias temáticas

### Como Adicionar Novas Perguntas

1. Abrir `src/data/questions.js`
2. Localizar a categoria desejada (ex: `Matematica: [ ... ]`)
3. Adicionar novo objeto no array:
   ```js
   { pergunta: "Sua pergunta aqui?", opcoes: ["A", "B", "C"], resposta: "A", dificuldade: "facil" }
   ```
4. `opcoes` deve ter exatamente 3 strings
5. `resposta` deve ser idêntica a uma das opções (comparação exata)
6. `dificuldade` é opcional: `"facil"`, `"media"` ou `"dificil"`
7. Para criar nova categoria, adicionar nova chave em `bancoQuestoes`:
   ```js
   NovaCategoria: [
     { pergunta: "...", opcoes: ["A", "B", "C"], resposta: "A" },
   ],
   ```
8. Para associar a categoria a um mundo, adicionar entrada em `worldCategoryMap`

### Testes Realizados

| Cenário | Resultado |
|---------|-----------|
| Floresta: casa 4 (desafio) → acerta → casa 5 ("volte 1") | Casa 5 NÃO é processada ✅ |
| Floresta: casa N (desafio) → erra → casa N-1 | Casa N-1 NÃO é processada ✅ |
| `avancar` normal (casa 3 "avance 2") → vai p/ casa 5 | Casa 5 continua cascateando ✅ |
| `voltar` normal | Continua cascateando ✅ |
| Galáxia: desafio sorteia de Espaço, Lógica, ConhecimentosGerais | Pool temático respeitado ✅ |
| Floresta: desafio sorteia de Animais, Natureza, Cores e Formas, Lógica | Pool temático respeitado ✅ |
| Dinossauros: desafio sorteia de Dinossauros, Animais, Natureza, Matemática | Pool temático respeitado ✅ |
| Mundo sem mapeamento temático | Fallback para banco geral (128 perguntas) ✅ |
| Todas as perguntas temáticas usadas | Reset automático do Set ✅ |
| Bot: mesmo sortearQuestao() | Bot segue a mesma regra ✅ |
| Debug `?debug=1`: seção "Banco de Perguntas" | Exibe total, usadas, categorias, mundo, dificuldade ✅ |
| Regressão em portal, minigame, vitória | Código inalterado, sem regressão ✅ |

## Sprint — Visual da Galáxia Estelar — ART-011 (v0.16.0-preview)

### Objetivo

Adicionar infraestrutura visual de background e path para o mundo Galáxia Estelar, seguindo exatamente o mesmo padrão estabelecido para Floresta Encantada (v0.11.0) e Vale dos Dinossauros (v0.12.0): pasta de assets, CSS com overlay + url + gradiente fallback no `#track-container`, e regra de `path.webp` com fallback SVG.

### Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `src/assets/worlds/galaxia/.gitkeep` | Placeholder da estrutura de assets visuais da Galáxia |

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/style.css` | **Modificado** — `body[data-world="galaxia-estelar"] #track-container` atualizado com `url("assets/worlds/galaxia/background.webp")` + overlay + gradiente fallback (padrão Floresta/Dinossauros). `background-size`, `background-position` e `background-repeat` ajustados para suportar 3 camadas. Comentário de documentação adicionado |
| `README.md` | **Modificado** — Versão atualizada para v0.16.0, funcionalidades atuais, assets tree, tabela de status, roadmap |
| `CHANGELOG.md` | **Modificado** — Entrada v0.16.0 adicionada |
| `docs/visao-geral.md` | **Modificado** — Sessão v0.16.0 adicionada |
| `docs/arquitetura.md` | **Modificado** — Galáxia adicionada na árvore de assets e na nota explicativa |
| `docs/memorial-tecnico.md` | **Modificado** — Sprint ART-011 adicionada |

### Decisões Técnicas

| Decisão | Alternativas | Motivo |
|---------|-------------|--------|
| Reutilizar seletor `body[data-world="galaxia-estelar"] #track-container` | Criar nova classe | O seletor já existia e funcionava — só faltava adicionar a camada `background-image` com o asset |
| Overlay com `linear-gradient(rgba(0,0,0,0.35))` | Opacidade no próprio asset | Mesmo padrão dos outros mundos: overlay separado para garantir contraste independente do asset |
| `background-size: cover, cover, auto` | Apenas `cover` | O terceiro valor `auto` é necessário porque o fallback é um `linear-gradient`, não uma imagem |

### Seletor CSS Utilizado

```css
body[data-world="galaxia-estelar"] #track-container
```

### Onde Salvar o background Gerado

```
src/assets/worlds/galaxia/background.webp
```

### Como Testar Localmente

1. Execute `cd src && npx serve .` (ou `python3 -m http.server 8000`)
2. Abra o jogo e selecione Galáxia Estelar no seletor de mundos
3. Verifique:
   - Galáxia abre normalmente (gradiente fallback aparece sem `background.webp`)
   - Caminho SVG visível e funcional
   - Casas e jogadores legíveis
   - Se `background.webp` existir, ele aparece apenas dentro do `#track-container`
   - Floresta e Dinossauros não foram afetados (verificar visualmente)

## Sprint — Galáxia Estelar + Minigame do Buraco de Minhoca — GAL-001 (v0.14.0-preview)

### Objetivo

Implementar o terceiro mundo (Galáxia Estelar) com 20 casas temáticas e o minigame MeteoroGame integrado ao Buraco de Minhoca (casa 15). O minigame opera com controles 4-direcionais, sistema de 3 vidas com feedback visual, tela de resultado com confirmação e fluxo especial para o bot da máquina com auto-resolve.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/worlds/galaxia/config.js` | **Criado** — Config do terceiro mundo: 20 casas temáticas com células posicionadas individualmente (`board.cells`), textos enxutos, `buraco-minhoca` na casa 15 |
| `src/minigames/meteoro/MeteoroGame.js` | **Criado** — Classe principal do minigame (~280 linhas). Gerencia canvas, loop de jogo, nave 4-dir, meteoros, colisão, vidas, flash/invulnerabilidade, contador regressivo (60s), tela de resultado. API: `start(callback)`, `abort()`. Callback retorna `{ venceu, vidasRestantes, bonus }` |
| `src/minigames/meteoro/meteoroGame.css` | **Criado** — Estilos do overlay do minigame: flash vermelho, nave piscando, UI de vidas, texto de dano, tela de resultado com botão |
| `src/minigames/meteoro/index.js` | **Criado** — Factory: `createMeteoroGame(containerId)` retorna instância do MeteoroGame |
| `src/worlds/galaxia/handlers/buraco-minhoca.js` | **Criado** — Handler da casa especial: abre overlay de transição, inicia minigame, trata resultado (vitória +3, derrota -2), atualiza tabuleiro |
| `src/worlds/galaxia/handlers/buraco-minhoca-bot.js` | **Criado** — Handler para o bot: overlay com barra "Máquina está jogando...", botão "Pular", simula resultado, auto-resolve após 6s com `setTimeout` |
| `src/worlds/galaxia/index.js` | **Criado** — Export do mundo Galáxia registrando config e handlers |
| `src/game.js` | **Modificado** — Adicionado `handleWormholeCell()`, `handleGalaxiaCell()`, integração do WorldRegistry com Galáxia, debug expandido (seção Galáxia + minigame) |
| `src/types.js` | **Modificado** — Adicionado `buraco-minhoca` ao enum de tipos de casa |
| `src/world-registry.js` | **Modificado** — Registro do mundo Galáxia |
| `src/index.html` | **Modificado** — Inclusão do CSS do minigame (import condicional) |
| `src/style.css` | **Modificado** — Estilos do debug Galáxia, overlay de transição do minigame |
| `src/main.js` | **Modificado** — Setup do debug Galáxia, botão "Abrir" minigame para teste |

### Decisões Técnicas

| Decisão | Alternativas | Motivo |
|---------|-------------|--------|
| Buraco de Minhoca na casa 15 (não mais na 10) | Manter casa 10 | Casa 15 é mais equilibrada (meio-fim da trilha), evita sobrecarga no início da Galáxia |
| MeteoroGame como classe independente (`MeteoroGame.js`) | Funções soltas em game.js | Encapsulamento: lógica do minigame isolada, ciclo de vida gerenciado, facilita testes |
| Canvas 2D para o minigame | DOM + CSS | Performance: dezenas de meteoros simultâneos requerem renderização eficiente |
| 4 direções (↑↓←→ + WASD) | Apenas horizontal | Mais engajamento e desafio; eixo Y metade superior/inferior via touch |
| Invulnerabilidade por 1s pós-dano | Sem invulnerabilidade | Evita perda múltipla de vidas em colisões consecutivas; flash visual + piscar da nave como feedback |
| Vida contada regressivamente (3 → 0) | Progressiva | MeteoroGame é punitivo por natureza; perder todas as vidas = derrota |
| Bot com overlay "Pular" + auto-resolve 6s | Bot jogar sozinho | Usuário mantém controle da experiência; auto-resolve evita deadlock |
| Bônus aplicado apenas após "Voltar ao tabuleiro" | Aplicar imediatamente | Usuário precisa ver o resultado e confirmar; evita confusão |

### Estado Atual

- **Mundo Galáxia**: config completo com 20 casas, textos padronizados (ícone + descrição curta)
- **Minigame MeteoroGame**: 4-dir, 3 vidas, flash, invulnerabilidade, 60s, resultado com bônus
- **Fluxo humano**: casa 15 → overlay transição → minigame → resultado → "Voltar ao tabuleiro" → bônus aplicado
- **Fluxo bot**: casa 15 → overlay com barra → "Pular" ou 6s → resultado simulado 2s → bônus aplicado
- **Debug**: 4 botões Galáxia (C9, C14, C15🚪), 4 botões minigame (Abrir, Vencer, Perder, Retornar)
- **Código**: ~450 linhas totais (minigame + handlers + config + debug)
- **Documentação**: 7 arquivos atualizados neste sprint

### Pendências

- [ ] Ilustração do background da Galáxia Estelar (`background.webp`)
- [ ] Som do minigame (efeitos de meteoro, dano, vitória/derrota)
- [ ] Animações de transição mais elaboradas (entrada/saída do minigame)
- [ ] Dificuldade progressiva no MeteoroGame (meteoros aceleram com o tempo)

## Sprint — Sistema de Áudio — AUD-001 (v0.13.0-preview)

### Objetivo

Implementar o sistema de áudio do Lara World, centralizando toda reprodução sonora em um `AudioManager` que encapsula a Web Audio API, com catálogo de sons, volumes independentes para música e efeitos, persistência de preferências no `localStorage`, e tolerância total a assets ausentes. Foram criados 7 diretórios de assets (vazios, aguardando arquivos .webm) e 3 arquivos de código fonte.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/audio/AudioManager.js` | **Criado** — Classe gerenciadora central (~218 linhas). Gerencia `AudioContext` (criado sob demanda), `masterGain` → `musicGain` + `effectsGain` em cascata. API: `init()`, `play(key)`, `stop(key)`, `playMusic(key)`, `stopMusic()`, `setMasterVolume()`, `setMusicVolume()`, `setEffectsVolume()`, `mute()`, `unmute()`, `toggleMute()`, `isMuted()`. Persistência automática via `localStorage` (chave `laraAudioConfig`: masterVolume, musicVolume, effectsVolume, muted). Decode via `fetch` + `decodeAudioData` com catch silencioso. |
| `src/audio/sounds.js` | **Criado** — Catálogo de sons com 16 chaves simbólicas, cada uma com `path` (relativo à raiz do servidor) e `category` (`'effects'` ou `'music'`). Cobre: UI (3), dados (2), tabuleiro (5), quiz (3), recompensas (2) e música (1). |
| `src/audio/index.js` | **Criado** — Instância singleton do `AudioManager` exportada como `audioManager`. |
| `src/assets/audio/ui/` | **Criado** — Diretório vazio para assets de interface (click.webm, modal-open.webm, modal-close.webm) |
| `src/assets/audio/dice/` | **Criado** — Diretório vazio para assets de dados (roll.webm, result.webm) |
| `src/assets/audio/board/` | **Criado** — Diretório vazio para assets de tabuleiro (move.webm, advance.webm, back.webm, portal.webm, treasure.webm) |
| `src/assets/audio/quiz/` | **Criado** — Diretório vazio para assets de desafios (challenge.webm, correct.webm, wrong.webm) |
| `src/assets/audio/rewards/` | **Criado** — Diretório vazio para assets de recompensa (victory.webm, gameover.webm) |
| `src/assets/audio/music/` | **Criado** — Diretório vazio para músicas de fundo (bg-loop.webm) |
| `src/game.js` | **Modificado** — Adicionadas 21 chamadas de `audioManager.play('chave')` em 8 funções: `setupMenuEvents()` (buttonClick), `setupWorldSelectorEvents()` (buttonClick ×2), `setupModalEvents()` (buttonClick), `init()` na vitória (buttonClick ×2), `jogarDado()` (diceRoll, diceResult), `waitForPlayerRoll()` (diceRoll, diceResult), `animatePlayerMovement()` (playerMove por passo), `processSpecialCell()` (specialAdvance, specialBack, portal, challengeOpen, correctAnswer, wrongAnswer), `resolveChallenge()` (correctAnswer, wrongAnswer), `handleVictory()` (victory). Adicionado `import { audioManager } from './audio/index.js'`. |
| `docs/audio.md` | **Criado** — Documentação completa do sistema de áudio. |

### Decisões Técnicas

| Decisão | Alternativas | Motivo |
|---------|-------------|--------|
| `AudioContext` lazy (criado no primeiro `play()`) | Criar no `init()` | Evita bloqueio de autoplay — navegadores só permitem criar/retomar contexto após interação do usuário |
| Ganho em cascata (master → music + effects) | Ganho único | Permite volumes independentes: música de fundo mais baixa que efeitos |
| Singleton exportado | Injeção de dependência | Simplicidade: jogo pequeno, sem testes unitários complexos ainda |
| Catálogo externo (`sounds.js`) | Strings soltas no código | Centralização: todas as chaves visíveis em um arquivo, facilita auditoria |
| `.webm` como formato único | Múltiplos formatos com fallback | Simplicidade inicial; fallback pode ser adicionado depois |
| Fetch + `decodeAudioData` a cada `play()` | Cache de `AudioBuffer` | Simplicidade; cache será adicionado quando houver assets reais |

### Estado Atual

- **Código fonte**: 3 arquivos criados, 1 modificado, ~240 linhas de JS
- **Assets de áudio**: 7 diretórios criados, **0 arquivos .webm** — todos pendentes
- **Integração**: 21 pontos de chamada em `src/game.js`, todos com `try/catch` implícito (o `AudioManager` engole erros internamente)
- **Documentação**: `docs/audio.md` com 11 seções: visão geral, arquitetura, estrutura de diretórios, API pública, integração, como adicionar sons, boas práticas, limitações, roadmap
- **Sons registrados mas não integrados**: `modalOpen`, `modalClose` (modal), `treasure` (casa tesouro), `gameOver` (game over), `backgroundMusic` (música ambiente) — existem no catálogo mas não são chamados em lugar nenhum

### Pendências

- [ ] Produzir/baixar assets .webm para todos os 16 sons do catálogo
- [ ] Integrar `backgroundMusic` (`audioManager.playMusic('backgroundMusic')`) em `game.js`
- [ ] Integrar `modalOpen`/`modalClose` nas aberturas/fechamentos de modal
- [ ] Integrar `treasure` na casa especial de tesouro
- [ ] Integrar `gameOver` na tela de game over

---

## Sprint — Sistema de Avatares e Tokens + Reprocessamento de lara.webp — UX-015 + ART-010 (v0.12.0-preview)

### Objetivo

Implementar o sistema de avatares e tokens do Lara World, separando personagens oficiais (Lara, Léo, Dino, Byte) de emojis clássicos na galeria de seleção. Cada personagem oficial possui asset próprio em `assets/avatars/` (preview no setup) e `assets/tokens/` (representação em jogo), com fallback automático para emoji quando o asset não existir. Reprocessar lara.webp para ambas as categorias com canvas 512×512 e altura ~86.9% para cobertura ideal.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/index.html` | Setup screen reformulada: cada `.setup-player-card` ganhou `.avatar-preview` com `.avatar-frame` (108×108px circular contendo `.avatar-emoji` + `<img class="avatar-img">`), `.avatar-player-name`. Grade de seleção dividida em duas seções: `.avatar-grid` para "🧑 Avatares" (lara, leo, dino, byte) e `<details class="emoji-section">` com `summary` "😊 Emojis clássicos" para os 19 emojis restantes. Título do botão `emoji-btn` consiste no emoji original. Todos os botões ganharam `data-avatar` e `data-token`. Draw overlay: `.draw-player-visual` ampliado, `.draw-player-emoji` e `.draw-player-img` com fallback |
| `src/style.css` | **Setup preview**: `.avatar-preview`, `.avatar-frame` (108×108, circular, box-shadow com cor do jogador), `.avatar-emoji` (3.6rem), `.avatar-img` (absolute, object-fit contain), `.avatar-player-name` (0.85rem). **Grid**: `.avatar-grid` (grid 5 colunas, gap 6px), `.emoji-section` (collapsível com borda, background). **Botões**: `.emoji-btn` (40×40, border-radius 12px, overflow hidden), `.btn-emoji` (span dentro do botão), `.btn-img` (absolute, inset 0, object-fit cover). Hover/selected por jogador (rosa P1, azul P2). **Draw**: `.draw-player-visual` 76×76 (era 52px), `.draw-player-img` com object-fit cover. **Visual fallback pattern**: `.visual-emoji` e `.visual-img` compartilhados entre status, vitória e draw |
| `src/game.js` | Adicionado: `player.tokenId` no array `players[]`, `initGalleryTokens()` (converte emoji-btn em span+img), `applyVisualFallback()` (mecanismo central de fallback), `renderBoardToken()` (carrega token no tabuleiro), `updateAvatarPreview()` (atualiza preview ao selecionar). Modificado: `startGame()` e `prepareAndDraw()` leem `data-token` do botão selecionado, `updateUI()` chama `applyVisualFallback` para turno/status/tabuleiro, `showDrawScreen()` usa `applyVisualFallback` para visuais do sorteio, `handleVictory()` aplica fallback no overlay de vitória, `init()` chama `initGalleryTokens()` no bootstrap |
| `assets/avatars/lara.webp` | **Reprocessado**: canvas 512×512, altura 445px (~86.9%), centralizado |
| `assets/tokens/lara.webp` | **Criado/reprocessado**: canvas 512×512, altura 445px (~86.9%), centralizado, `object-fit: cover` circular |

### Documentação

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `CHANGELOG.md` | Adicionadas entradas UX-015 e ART-010 na v0.12.0-preview |
| `docs/roadmap.md` | UX-015 e ART-010 marcados como concluídos |
| `docs/arquitetura.md` | Diretórios `assets/avatars/` e `assets/tokens/` adicionados; seção Setup Screen atualizada com galeria dividida; seção game.js documentada com initGalleryTokens, applyVisualFallback, renderBoardToken |
| `docs/memorial-tecnico.md` | Adicionada esta entrada |

### Impacto Técnico

**UX-015 — Avatar/Token System**
- `initGalleryTokens()`: itera todos `.emoji-btn`, verifica `data-avatar`, extrai o texto do botão como fallback, cria `<span class="btn-emoji">` e `<img class="btn-img">`, chama `applyVisualFallback()` para tentar carregar `assets/tokens/{avatar}.webp`. Executada no `init()` antes de qualquer outra inicialização.
- `applyVisualFallback(emojiEl, imgEl, emoji, imgSrc)`: função central de fallback visual. Se `imgSrc` é válido, seta `onload` (oculta emoji, mostra img) e `onerror` (oculta img, mostra emoji); se `imgSrc` é nulo/vazio, mostra emoji e oculta img. Usada em 6 pontos: galeria, status turno, status P1, status P2, tabuleiro P1, tabuleiro P2, draw overlay, vitória.
- `renderBoardToken(idx)`: obtém `#lara` ou `#lara-p2`, encontra `.token-emoji` e `.token-img`, chama `applyVisualFallback` com `assets/tokens/{player.tokenId}.webp`.
- `player.tokenId`: novo campo no objeto player, populado em `startGame()` e `prepareAndDraw()` via `p1Selected.dataset.token` (fallback `"lara"`) e `p2Selected.dataset.token` (fallback `"leo"`). Para single player, máquina recebe `tokenId: ""`.
- `updateAvatarPreview(playerIndex, emoji, name, avatarId)`: atualiza `.avatar-emoji`, `.avatar-player-name` e carrega `assets/avatars/{avatarId}.webp` no `.avatar-img`. Se `avatarId` é nulo/vazio, limpa `src` e oculta a imagem.
- `.avatar-frame`: 108×108px circular com overflow hidden. Box-shadow diferenciado por jogador — P1 com glow rosa, P2 com glow azul.
- `.avatar-img`: posicionado absolutamente, `object-fit: contain` para não distorcer o asset.
- `.emoji-section`: `<details>` com `summary` estilizado (cor #b8956a, 0.78rem, letter-spacing 0.3px). Padding interno reduzido (4px 6px 6px), grid da seção com gap 4px.
- `.emoji-btn`: 40×40px, border-radius 12px, overflow hidden, posição relativa. Hover/selected com cor do jogador.
- `.btn-img`: absolute inset 0, `object-fit: cover`, `border-radius: inherit`, `display: none` por padrão.
- Draw overlay: `.draw-player-visual` ampliado de 52×52 para 76×76. `.draw-player-img` com `object-fit: cover` circular. `.draw-player-emoji` com 3.4rem.

**ART-010 — Reprocessamento de lara.webp**
- lara.webp (avatar): canvas 512×512, altura 445px (~86.9%), centralizado XY
- lara.webp (token): canvas 512×512, altura 445px (~86.9%), centralizado XY — garante preenchimento total no container circular com `object-fit: cover`

### Impacto Funcional

- **Galeria visualmente dividida**: 4 avatares oficiais sempre visíveis no topo; 19 emojis clássicos em seção collapsível (`<details>`)
- **Preview do avatar**: ao selecionar um personagem, o preview circular acima da grade exibe o asset oficial com nome do personagem
- **Token no tabuleiro**: personagens no tabuleiro exibem asset token em vez de emoji, com fallback visual transparente
- **Token no status**: barra de status, draw screen e tela de vitória também exibem o token asset com fallback
- **Draw screen**: visual do jogador ampliado (76px) com melhor proporção
- **Status panel**: nome do jogador movido para fora do container visual (antes causava overflow)
- **Fallback universal**: se qualquer asset `.webp` não existir ou falhar ao carregar, o emoji correspondente aparece automaticamente — sem quebra visual
- **Nenhuma regressão funcional**: Jogo Rápido, seleção de mundos, setup, gameplay — tudo idêntico

### Lições Aprendidas

- O padrão `applyVisualFallback()` com `onload`/`onerror` provou ser robusto: único ponto de verdade para toda a lógica de fallback visual, reutilizado em 6 contextos diferentes sem duplicação
- Separar avatares (assets de preview, 108×108 circular) de tokens (assets in-game, 62×62 circular com `object-fit: cover`) foi acertado — o preview precisa de `contain` para mostrar o asset inteiro, enquanto o token precisa de `cover` para preencher o círculo
- A escolha de `<details>` para a seção de emojis clássicos evitou JS adicional para toggle e manteve a semântica HTML pura
- O campo `data-token` nos botões permitiu associar cada emoji a um token asset sem alterar a estrutura de dados dos jogadores — apenas adicionando `player.tokenId`
- O reprocessamento de lara.webp em canvas 512×512 com 86.9% de altura foi necessário porque `object-fit: contain` no preview e `object-fit: cover` no token exigem proporções diferentes — centralizar com altura generosa garantiu boa aparência em ambos os contextos

### Notas Técnicas

- Nenhum arquivo de engine, world config ou game.js (núcleo) foi alterado — apenas o setup screen, style.css e game.js (UI)
- Cache-busting não foi alterado — assets .webp carregam sem parâmetro de versão, usando fallback para emoji
- `player.tokenId` é string vazia para a máquina (single player), resultando em `applyVisualFallback` sem imgSrc → mostra emoji 🤖
- A seção de emojis clássicos vem com `open` por padrão no HTML para boa primeira experiência
- O avatar preview é independente do token — um pode falhar enquanto o outro funciona, sem efeito colateral

## Sprint — Seleção de Mundos v2 + Ilustrações Oficiais — UX-014 + ART-009 (v0.12.0-preview)

### Objetivo

Remodelar o seletor de mundos para corresponder visualmente à Hero Screen (painel glass, fundo temático, identidade por mundo, botão premium) e preparar a infraestrutura de ilustrações oficiais dos mundos (container 96×96px com fallback de emoji e diretório de assets). Lara é removida do seletor — permanece exclusiva da Hero Screen.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/index.html` | Card do seletor de mundos reestruturado: wrapper `.world-card-header` removido, emojis movidos para `<span class="world-card-icon world-card-emoji">` dentro de novo `.world-card-illustration`. Adicionado `<img class="world-card-img">` com `onerror="this.style.display='none'"`. Seção de mundos bloqueados refatorada. `#world-selector-overlay` renomeado para `#world-selector`. Botão "← Voltar" → "← Menu Principal". Title/descrição do overlay atualizados |
| `src/style.css` | **UX-014** (~200 linhas): Background do `#world-selector` copiado da Hero Screen (7 gradientes + `.menu-bg-shapes` + sparkles + `::before` com `menu-background.webp`). Card central `.world-selector-content` com gradiente rosado/creme/azulado, `backdrop-filter: blur(24px)`, borda 3px, glow rosa. Subtítulo `.world-selector-subtitle`. Cards `.world-card` reformulados: `border-radius: 24px`, `padding: 16px`, identidade por `data-world` (verde, âmbar, roxo, azul, lilás). `.world-card.disabled` sem grayscale — mantém cor temática com `opacity: 0.75`. `.world-card[data-world="aleatorio"]` com `random-glow` pulsante (3s, roxo mágico). Botão `.back-button` premium gradiente pink-dourado, sombra 3D, hover/active. Removido: Lara (`#world-card-lara`), `.world-card-header`, `.world-card-lara-img`. Responsivo ≤600px e ≤400px. **UX-015/ART-009** (~50 linhas): `.world-card-illustration` — container 96×96px flex centralizado; `.world-card-img` — absoluto, 100% object-fit contain; `.world-card-emoji` — font-size 3rem |
| `src/assets/world-icons/.gitkeep` | Criado — placeholder para versionar diretório de ilustrações dos mundos |

### Documentação

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `README.md` | Atualizado: Seção "Seletor de Mundos v2" adicionada; "Ilustrações dos Mundos" adicionada; assets tree com world-icons/; tabela de asset status; roadmap e história atualizados |
| `CHANGELOG.md` | Adicionadas entradas UX-014 e ART-009 na v0.12.0-preview |
| `docs/roadmap.md` | UX-014 e ART-009 marcados como concluídos; novos objetivos futuros adicionados |
| `docs/arquitetura.md` | Diretório `src/assets/world-icons/` adicionado; seção Seletor de Mundos reescrita com descrição UX-014 |
| `docs/ui-style-guide.md` | Criado — guia de estilo oficial com diretrizes visuais, paleta, tipografia, componentes |
| `docs/memorial-tecnico.md` | Adicionada esta entrada |

### Impacto Técnico

**UX-014 — World Selector Visual Overhaul**
- `#world-selector` copia completamente o layout da Hero Screen: `position: fixed`, `inset: 0`, `z-index: 1100`, 7 gradientes radiais + 2 shapes flutuantes (`::before`/`::after`) + `::before` com `url(assets/ui/menu-background.webp)` opacity 0.60 + sparkles
- `.world-selector-content`: `max-width: 680px`, `background: linear-gradient(160deg, rgba(255,240,245,0.92)...)`, `backdrop-filter: blur(24px)`, `border: 3px solid rgba(255,255,255,0.8)`, `border-radius: 48px`, `box-shadow` com múltiplas camadas (glow rosa, profundidade, inset highlight)
- Subtítulo: `color: #a07a8a`, `font-size: 0.95rem`, `font-weight: 500`, `margin: -8px 0 18px`
- `.world-selector-grid`: `grid-template-columns: repeat(3, 1fr)`, `gap: 14px`, `margin-top: 4px`
- Cards reformulados com `border-radius: 24px`, `padding: 16px`, `background: rgba(255,255,255,0.35)`, hover `translateY(-5px)` + glow colorido via `data-world`
- Cada `data-world` recebe `border-color` específica: floresta `#66bb6a`, dinossauros `#ffb300`, galaxia `#b388ff`, oceanos `#64b5f6`, castelo `#ce93d8`, aleatorio `#e91e63`
- `.world-card.disabled`: `opacity: 0.75`, `filter: none`, `cursor: not-allowed` — sem grayscale, mantém cor temática com leve transparência
- `.world-card[data-world="aleatorio"]`: glow pulsante `random-glow` (3s infinite, roxo `#e91e63` → `#ce93d8` → `#b388ff`), hover acelera para 1.5s
- `.back-button`: `background: linear-gradient(135deg, #e91e63, #ff8f00)`, `padding: 14px 36px`, `border-radius: 30px`, `box-shadow: 0 4px 0 #880e4f`, hover `translateY(-3px)`, active `translateY(2px)` com `box-shadow: 0 1px 0 #880e4f`
- Responsivo ≤600px: content 500px, grid 2 columns, illustration 76×76, gap 12px; ≤400px: 340px, 2 columns, illustration 64×64, padding reduzido
- Lara removida: `.world-card-lara`, `.world-card-header`, `.world-card-lara-img` deletados — personagem não aparece mais no seletor

**UX-015 / ART-009 — World Illustrations**
- `.world-card-illustration`: `width: 96px`, `height: 96px`, `display: flex`, `align-items: center`, `justify-content: center`, `position: relative`, `margin: 0 auto 4px`
- `.world-card-img`: `position: absolute`, `width: 100%`, `height: 100%`, `object-fit: contain`, carrega `src="assets/world-icons/<world>.webp?v=0.12.0-preview"`
- `.world-card-emoji`: `font-size: 3rem`, `line-height: 1` — emoji original movido do card para dentro do container de ilustração
- `onerror="this.style.display='none'"` no `<img>` — quando asset existir, img carrega e oculta o emoji; quando não existir, img some e emoji aparece
- 6 assets previstos: `floresta.webp`, `dinossauros.webp`, `galaxia.webp`, `oceanos.webp`, `castelo.webp`, `aleatorio.webp`
- Cache-busting permanece `?v=0.12.0-preview` — asset pipeline sem alteração

### Impacto Funcional

- **Seletor de mundos com personalidade**: o seletor agora parece parte do ecossistema da Hero Screen — mesmo fundo, mesmo estilo glass, mesma atmosfera
- **Cards com identidade**: cada mundo tem sua cor de borda característica, incluindo os bloqueados — que em vez de "cinza genérico" parecem mundos adormecidos aguardando liberação
- **Aleatório em destaque**: o card "🎲 Mundo Aleatório" tem glow roxo pulsante, atraindo o olhar do jogador
- **Botão premium**: "← Menu Principal" segue o mesmo padrão dos botões da Hero Screen (gradiente pink-dourado, sombra 3D)
- **Ilustrações preparadas**: quando um `world-icons/<mundo>.webp` for criado, o img carrega e substitui o emoji automaticamente — sem alteração de código
- **Fallback seguro**: se a ilustração não existir, o emoji permanece visível; se `menu-background.webp` não existir, gradientes mantêm a tela bonita
- **Lara removida**: a personagem não aparece mais no seletor — foco total nos mundos
- **Nenhuma regressão funcional**: Jogo Rápido, seleção de mundos, setup, gameplay — tudo idêntico

### Lições Aprendidas

- Copiar o layout visual da Hero Screen para o seletor de mundos criou consistência visual imediata — repetir os mesmos gradientes, shapes e sparkles gerou uma experiência coesa
- A decisão de remover Lara do seletor foi acertada: a Hero Screen é o palco dela, e o seletor deve ser sobre os mundos
- A infraestrutura de ilustrações com `onerror` é uma solução zero-código para futura substituição de emojis por assets — um dos padrões mais eficientes adotados
- Mundos bloqueados sem grayscale foram um refinamento importante: o jogador vê que existem mundos futuros com identidade própria, não apenas "espaços vazios"
- O glow pulsante do card aleatório precisou de ajuste fino (3s, roxo suave) para não competir com o glow principal do card glass
- Manter a Regra de Ouro (zero alterações em engine, JS, gameplay) foi possível — todas as mudanças foram HTML + CSS + asset placeholder

### Notas Técnicas

- Nenhum arquivo de engine, world config ou game.js foi alterado
- Cache-busting permanece `?v=0.12.0-preview` (já estava atualizado da sprint anterior)
- O JS do seletor de mundos (`showWorldSelector`, card click handlers, etc.) não foi alterado — apenas HTML e CSS
- O mesmo `menu-background.webp` da Hero Screen é reutilizado como background do seletor — zero duplicação de assets
- As cores de identidade dos mundos seguem a mesma lógica de `data-world` que o CSS do tabuleiro usa — padrão consistente
- O diretório `src/assets/world-icons/` segue a mesma estrutura de fallback que `worlds/` e `ui/`

## Sprint — Hero Screen Evolutiva — UX-013 (v0.12.0-preview)

### Objetivo

Transformar o menu inicial do Lara World em uma tela de abertura com estilo de capa de jogo infantil, incorporando personagem Lara, fundo temático, card central translúcido, botões reformulados e composição visual premium — exclusivamente via CSS e HTML, sem alterar engine, gameplay ou JavaScript.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/index.html` | Adicionado: `<img class="menu-lara-hero">`, `.menu-logo` (wrapper), `.menu-divider`, `.menu-footer`, `.menu-sparkles`. Renomeado: "Modo Carreira" → "Modo Aventura". Botões reestruturados com spans internos (`.btn-main-text`, `.btn-subtitle`) |
| `src/style.css` | **UX-010**: redesign do `.main-menu` — 7 gradientes radiais, `.menu-bg-shapes` flutuantes, `.menu-logo` com gradiente pink-dourado e `background-clip: text`, `.menu-divider` decorativo, card com gradiente e `backdrop-filter: blur(20px)`, botão primário com `menu-glow-pulse`, footer. **UX-011**: `.menu-lara-hero` — `max-w: 200px`, `margin-top: -60px`, `drop-shadow` rosa. **UX-012**: `.main-menu::before` com `url(menu-background.webp)` opacity 0.35 → 0.42 → 0.50. **UX-013.1/2**: card expandido para 580px, Lara para 320px/280px com `mt: -130px`, cores mais saturadas (0.88), borda 3px, glow intensificado, espaçamentos reduzidos, botões maiores com subtítulos, sparkles decorativos |
| `src/assets/ui/.gitkeep` | Criado — placeholder para versionar estrutura de assets da Hero Screen |

### Documentação

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `README.md` | Atualizado: seção "Hero Screen" adicionada; assets/ui/ na estrutura de assets; "Modo Carreira" → "Modo Aventura"; histórico e roadmap atualizados |
| `CHANGELOG.md` | Adicionadas entradas UX-010, UX-011, UX-012, UX-013.1, UX-013.2 na v0.12.0-preview |
| `docs/visao-geral.md` | Seção v0.12.0-preview atualizada com Hero Screen; assets/ui/ adicionados à estrutura e tabela de finalidade |
| `docs/arquitetura.md` | Diretório `src/assets/ui/` adicionado; seção Main Menu reescrita com descrição completa da Hero Screen |
| `docs/roadmap.md` | Prioridades atualizadas: UX-014 Hero Screen v2 como próximo passo |
| `docs/memorial-tecnico.md` | Adicionada esta entrada |

### Impacto Técnico

**UX-010 — Hero Screen CSS Overhaul**
- `.main-menu`: 7 camadas de gradiente radial + linear criando profundidade visual infantil
- `.menu-bg-shapes::before/::after`: dois círculos gradientes animados com `menu-float-a/b` (12s/15s)
- `.menu-logo`: `flex-direction: column`, emoji 4.8rem, h1 com `background: linear-gradient(135deg, #e91e63, #ff8f00, #ffd54f)`, `background-clip: text` e `filter: drop-shadow`
- `.menu-content`: background `linear-gradient(160deg, rgba(255,240,245,0.9)...)`, `border-radius: 48px`, `backdrop-filter: blur(20px)`, `box-shadow` com glow rosa
- `.menu-btn-primary`: `max-width: 340px`, `padding: 22px 32px`, glow pulsante (`menu-glow-pulse` 3s)
- `.menu-btn-secondary`: gradiente neutro, desabilitado com badge gradiente pink
- `.menu-footer` + `.menu-version`: rodapé com `v0.12.0-preview`

**UX-011 — Lara Character Asset**
- `<img class="menu-lara-hero">` como primeiro filho de `.menu-content` com `aria-hidden="true"`
- `max-width: 200px`, `max-height: 180px`, `margin: -60px auto 12px` — protrusão acima do card
- `pointer-events: none`, `user-select: none` — sem interferência nos cliques
- `filter: drop-shadow(0 8px 24px rgba(233,30,99,0.18))` — glow rosa integrador

**UX-012 — Menu Background Image**
- `.main-menu::before`: `position: absolute`, `inset: 0`, `background: url(assets/ui/menu-background.webp) center/cover no-repeat`, `opacity: 0.50`
- `z-index: 0` — imagem fica entre o gradiente de fundo e as shapes flutuantes
- Fallback nativo: se asset não existir, `::before` renderiza transparente; os 7 gradientes de fundo permanecem intactos

**UX-013.1 — Refinamento Visual**
- Card ampliado de 480px para 520px + padding mais compacto
- Lara ampliada de 180px para 200px, `margin-top: -78px`
- Logo compactado: `gap: 0px`, emoji 4.2rem, h1 3.6rem
- Background image opacity: 0.42
- Botões com `btn-main-text` + `btn-subtitle` spans
- Sparkles decorativos: `.menu-sparkles` com pseudo-elementos `✦` animados

**UX-013.2 — Refinamento Visual Forte**
- Card: max-width 580px, gradient 0.88 saturação, borda 3px rgba(255,255,255,0.8), glow `0 0 72px(...0.1)` + `inset 0 0 80px(...0.04)`, `border-radius: 56px`
- Lara: max-width 320px, max-height 280px, `margin-top: -130px` (40px acima do card), `drop-shadow(0 18px 48px 0.32)`
- Background image opacity: 0.50
- Jogo Rápido: max-width 420px, padding 24px 40px 18px, glow pulse 2.5s, pico 50% com `...0.55...0.28`
- Modo Aventura: opacity 0.8, badge padding 4px 16px, letter-spacing 1.5px
- Todos os espaçamentos reduzidos (subtitle mt 8px, divider mt 10, buttons gap 10)
- Responsivo: ≤600px (Lara 160px/190px, card padding 80px 28px 22px), ≤400px (Lara 120px/140px, card padding 62px 16px 18px)

### Impacto Funcional

- **Tela inicial com personalidade**: o menu agora se assemelha a uma capa de jogo infantil, com Lara como personagem central, fundo temático e card premium
- **Lara integrada**: a personagem aparece sobreposta ao card, como se estivesse saindo do painel e apresentando o jogo
- **Botões com propósito**: "Jogo Rápido" é um card de ação com glow pulsante e subtítulo; "Modo Aventura" é um card secundário bonito com badge "EM BREVE..."
- **Fallback seguro**: se `lara-hero.webp` ou `menu-background.webp` não existirem, o layout não quebra — a tela continua bonita com gradientes e CSS
- **Responsivo mantido**: breakpoints ≤600px e ≤400px escalam Lara, card e botões proporcionalmente
- **Nenhuma regressão funcional**: Jogo Rápido continua funcionando, Modo Aventura continua desabilitado, fluxo de jogo inalterado

### Lições Aprendidas

- A Hero Screen evoluiu significativamente ao longo de 3 sprints (UX-010 → UX-011 → UX-012 → UX-013), cada uma adicionando camadas visuais sem quebrar as anteriores
- Os refinamentos em CSS atingiram um limite prático: a composição atual é o máximo que se pode extrair com CSS puro sem uma reorganização estrutural
- A próxima etapa (UX-014 — Hero Screen v2) exigirá repensar a arquitetura visual: layout diferente, hierarquia de elementos revista, e possível uso de canvas ou componentes visuais mais complexos
- A identidade visual do projeto está sendo consolidada: assets de UI (Hero Screen) e assets de mundo (backgrounds, caminhos) seguem padrões de fallback e estrutura de diretórios
- Manter a Regra de Ouro (zero alterações em engine, JS, gameplay) foi possível em todas as sprints UX — todas as mudanças foram exclusivamente HTML + CSS

### Notas Técnicas

- Nenhum arquivo de engine (`src/engine/*`, `src/core/*`), world config ou game.js foi alterado
- O "Modo Aventura" no HTML foi renomeado apenas no texto visível — a string de modo `"carreira"` usada internamente no game.js permanece inalterada
- A estrutura `src/assets/ui/` segue o mesmo padrão de fallback dos assets de mundo: se o arquivo não existir, o visual degrada graciosamente
- Os sparkles decorativos usam o caractere Unicode `✦` (U+2726) — sem dependência de fontes externas
- O glow pulse do botão primário usa `box-shadow` animado — sem GPU overhead significativo
- As formas flutuantes (`menu-bg-shapes`) usam `transform: translate` animado — sem `top/left` para melhor performance

## Sprint — Board Layout 2.0 + path.webp Infrastructure (v0.12.0-preview)

### Objetivo

Implementar o Board Layout 2.0, permitindo que cada mundo defina seu próprio posicionamento de células via `board.cells` (array `{id, x, y}`), preparar a infraestrutura CSS para textura de caminho via `path.webp`, refinar o traço SVG para conviver com a futura textura, e validar o novo formato com o Vale dos Dinossauros como primeiro adotante — incluindo ajustes finos de posicionamento para centralização ideal.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/core/types.js` | Adicionado: campo `cells` à typedef `BoardConfig` — `{id: number, x: number, y: number}[]` |
| `src/engine/world-registry.js` | Modificado: validação de `WorldConfig.board` aceita `cells[]` como alternativa a `positions` |
| `src/game.js` | Modificado: `getPosicoes()` verifica `board.cells` primeiro — se existir, converte array para mapa `{pos: [x%, y%]}`; senão, usa `board.positions` (fallback) |
| `src/worlds/dinossauros/config.js` | Alterado: `board.positions` substituído por `board.cells` com 20 células em 4 fileiras S-curve, shift +7pp X para centralizar. Múltiplas iterações de refinamento |
| `src/style.css` | **ART-005**: `.path-line` stroke reduzido de 14px para 5px, opacity rebaixado para ~0.25, drop-shadow ajustado. **ART-006**: `.path-line` ganhou `background-size: cover / center / no-repeat`; seletores `body[data-world="floresta-encantada"] .path-line` e `body[data-world="vale-dinossauros"] .path-line` com `background-image: url(assets/worlds/<mundo>/path.webp)`; override de subworld `background-image: none` |

### Documentação

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `README.md` | Atualizado: v0.12.0-preview como versão ativa; adicionadas seções "Board Layout 2.0" e "Caminhos Temáticos (path.webp)"; status de assets atualizado; histórico estendido; roadmap atualizado |
| `CHANGELOG.md` | Adicionada entrada v0.12.0-preview com Board Layout 2.0, path.webp, ART-005/006 |
| `docs/visao-geral.md` | Adicionada seção v0.12.0-preview; seção "Evolução Visual" atualizada com path.webp infrastructure e board.cells |
| `docs/arquitetura.md` | `getPosicoes()` atualizado para consumir `board.cells`; tabela WorldConfigs com coluna de layout; seção do motor atualizada para v0.12.0 |
| `docs/roadmap.md` | Adicionada v0.12.0-preview como ativa; ART-005/006 movidos para concluído; adicionado Board Layout 2.0 |
| `docs/memorial-tecnico.md` | Adicionada entrada Sprint Board Layout 2.0 |

### Impacto Técnico

**Board Layout 2.0 — board.cells**
- `BoardConfig` ganhou campo opcional `cells` no typedef JSDoc: `{id: number, x: number, y: number}[]`. O campo `positions` continua sendo o formato legado e convive com o novo.
- `world-registry.js`: a validação de `board` agora aceita `cells[]` como formato válido. Se `cells` estiver presente, a validação checa se cada célula tem `id` (number), `x` (number) e `y` (number). Se `cells` não existir, exige `positions` (formato legado). Nunca ambos são obrigatórios simultaneamente.
- `game.js — getPosicoes()`: nova lógica — se `currentWorldConfig.board.cells` existir, converte o array para o formato `{pos: [x%, y%]}` esperado pelo restante do jogo (renderSvgPath, positionPlayerAt, etc.). Se não existir, usa `board.positions` (fallback). Se nenhum existir, usa `boardPositions` (fallback hardcoded do monólito).
- A conversão `cells → positions` é: `acc[cell.id] = [cell.x, cell.y]`. As coordenadas X/Y são percentuais (0–100), como no formato legado.
- Nenhuma outra função precisa ser alterada — o mapa de posições gerado é idêntico ao que seria lido de `board.positions`.

**Vale dos Dinossauros — Primeiro Adotante**
- Config original usava `board.positions` com 20 coordenadas fixas herdadas do monólito.
- Substituído por `board.cells` com 20 objetos `{id, x, y}` organizados em 4 fileiras (5 células por fileira) seguindo o padrão S-curve (fileiras pares invertidas).
- Deslocamento horizontal de +7pp aplicado a todas as células para centralizar o tabuleiro no background temático.
- Múltiplas iterações de refinamento: ajustes nos valores X/Y de cada célula até que o tabuleiro ficasse visualmente centralizado e equilibrado.
- Floresta Encantada não foi alterada — continua usando `board.positions`.

**path.webp Infrastructure — ART-005 e ART-006**
- ART-005: `.path-line` stroke reduzido de 14px → 5px, opacity de 1.0 → ~0.25. Isso prepara o traço SVG para conviver com a futura textura `path.webp` — com 5px e semi-transparente, o traço SVG funciona como guia sutil enquanto a textura (quando criada) será a camada visual principal.
- ART-006: Três modificações no `.path-line`:
  1. Propriedades base: `background-size: cover`, `background-position: center`, `background-repeat: no-repeat` — preparam o elemento para exibir textura.
  2. Seletores por mundo: `body[data-world="..."] .path-line` com `background-image: url(assets/worlds/<mundo>/path.webp)` — cada mundo terá sua própria textura de caminho.
  3. Override de subworld: quando `activeSubworldId` está setado, o caminho do mundo principal não deve aparecer. Seletores `body[data-world~="floresta-misteriosa"] .path-line` e similares aplicam `background-image: none`.
- Fallback: se o asset `.webp` não existir, a `background-image` aponta para URL inexistente → camada transparente → o SVG stroke (5px, opacity ~0.25) permanece visível. O jogo funciona perfeitamente sem os assets.
- Nenhuma alteração em engine, world configs (exceto cells) ou gameplay.

### Impacto Funcional

- **Board Layout 2.0**: cada mundo pode agora definir seu próprio layout de células via `board.cells`. Mundos existentes continuam usando `board.positions` sem alterações.
- **Vale dos Dinossauros recelularizado**: o tabuleiro do Vale agora usa posições personalizadas (4 fileiras, S-curve, centralizado). A experiência visual melhorou com o tabuleiro melhor posicionado no background.
- **Floresta Encantada**: inalterada — segue com `board.positions` original.
- **Caminho refinado**: o traço SVG está mais sutil (5px, ~25% opaco), funcionando como guia leve.
- **path.webp infrastructure**: o CSS está pronto para exibir textura de caminho assim que os assets `.webp` forem criados. Colocar um `path.webp` na pasta do mundo faz a textura aparecer automaticamente.
- **Subworld sem conflito**: submundos não exibem a textura do mundo principal.
- **Nenhuma regressão funcional**: todas as mecânicas (dado, movimento, desafios, portal, vitória, bot, single player, debug, áreas especiais) continuam idênticas.

### Notas Técnicas

- O Board Layout 2.0 é a primeira alteração no contrato `BoardConfig` desde a criação do motor (v0.9.0-preview)
- `board.cells` e `board.positions` são mutuamente exclusivos na validação — nunca ambos
- A conversão `cells → positions` em `getPosicoes()` é um mapeamento simples sem custo perceptível
- ART-005 e ART-006 quebram a Regra de Ouro (alteram `src/style.css`), mas são exclusivamente visuais e não afetam engine, world configs (exceto cells) ou gameplay
- O Vale dos Dinossauros serviu como prova de conceito do Board Layout 2.0 — a próxima adoção pode ser a Floresta Encantada ou o novo mundo Galáxia Estelar
- path.webp infrastructure não substitui o SVG pattern dos caminhos temáticos existentes (ART-002/003) — ambos coexistem. O path.webp é uma camada adicional de textura sobre o traço SVG

## [0.9.0-preview] - 2026-07-06

### Objetivo

Iniciar a Fase de Mundos do Lara World: criar um motor modular (SessionManager, StateManager, WorldRegistry, EventProcessor) que coexista com o monólito original, adicionar um seletor de mundos na interface entre o menu e o setup, e implementar o primeiro WorldConfig (Floresta Encantada + Floresta Misteriosa). Nenhuma funcionalidade existente foi alterada.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Adicionado: fluxo do seletor de mundos (+35 linhas), variável `selectedWorldId`. Modificado: `showSetupScreen()` agora recebe parâmetro do mundo selecionado |
| `src/index.html` | Adicionado: seletor de mundos com 6 cards (`.world-card`), grid `.world-selector-grid`, overlay `.world-selector-overlay` |
| `src/style.css` | Adicionado: estilos do seletor de mundos (overlay, grid, cards, hover, badge "Em breve", badge "Aleatório") |
| `src/engine/event-processor.js` | **Criado** — 381 linhas, 8 tipos de evento built-in, registro de handlers customizados, cascade com proteção de loop, JSDoc typedefs (EventContext, EventResult, EventHandler) |
| `src/engine/session-manager.js` | **Criado** — 133 linhas, 5 métodos (create, validate, getCurrentWorld, getDrawState, isMultiWorld), validação de sessão, deepFreeze |
| `src/engine/state-manager.js` | **Criado** — 227 linhas, 17 métodos, deepClone em leituras, avanço mecânico de turno, gerenciamento de worldStack, playerState |
| `src/engine/world-registry.js` | **Criado** — 12 métodos, 4 classes de erro (WorldNotFoundError, WorldAlreadyRegisteredError, InvalidWorldConfigError, WorldNotReadyError), validação de contrato, deepFreeze |
| `src/worlds/floresta/config.js` | **Criado** — 402 linhas, exporta `florestaEncantada` (20 células, 12 eventos, 1 portal, 6 categorias) e `florestaMisteriosa` (8 células, 4 eventos, 2 categorias) |
| `src/core/constants.js` | **Criado** — Constantes do motor (event types, error codes, default values) |
| `src/core/utils.js` | **Criado** — Funções utilitárias (deepFreeze, deepClone, validateConfig, isValidId) |
| `src/core/types.js` | **Criado** — Tipos JSDoc para contratos do motor (WorldConfig, PortalConfig, EventConfig, GameSession, GameState) |
| `src/data/world-manifest.js` | **Criado** — Array WORLD_IDS com todos os IDs de mundos (todos comentados exceto floresta) |
| `src/worlds/loader.js` | **Criado** — Imports estáticos dos WorldConfigs, função `loadWorldConfig()` por ID |
| `docs/arquitetura-motor-de-mundos.md` | Atualizado: seção "Arquivos Alterados" com arquivos criados, plano de migração ajustado para execução real |
| `docs/visao-geral.md` | Atualizado: v0.9.0-preview como versão atual, funcionalidades do seletor de mundos |
| `docs/arquitetura.md` | Atualizado: diretórios (core/, engine/, worlds/), motor de mundos, seletor de mundos |
| `docs/roadmap.md` | Atualizado: v0.9.0-preview movido para concluído |
| `README.md` | Atualizado: v0.9.0-preview como versão ativa, funcionalidades, história, roadmap |
| `CHANGELOG.md` | Adicionado: entrada v0.9.0-preview |
| `docs/memorial-tecnico.md` | Adicionado: entrada v0.9.0-preview |

### Impacto Técnico

- **game.js**: Novo fluxo `showWorldSelector()` inserido entre o clique em "Jogo Rápido" e `showSetupScreen()`. Seletor exibe 6 `.world-card` em grid 3×2. `selectedWorldId` (string | null) armazena a escolha. Ao selecionar Floresta ou Aleatório, o seletor é ocultado e `showSetupScreen()` é chamado. Cards bloqueados ("Em breve") exibem badge e ignoram clique. Cache-busting atualizado para `?v=0.9.0-preview`.
- **HTML**: Novo `#world-selector-overlay` com container `.world-selector-content`, título, grid `.world-selector-grid`, botão "Voltar". Seis `.world-card` com `.world-card-icon`, `.world-card-name`, `.world-card-desc`, `.world-card-badge`.
- **CSS**: `.world-selector-overlay` (fixed, inset 0, z-index 1100, flex centralizado, fundo escuro). `.world-selector-grid` (display grid, 3 columns, gap 20px, max-width 800px). `.world-card` (background rgba branco, border-radius 16px, padding, cursor pointer, transição hover com escala e borda rosa). `.world-card.disabled` (opacity 0.5, cursor not-allowed). `.world-card-badge` (position absolute, top right, padding, border-radius, "🔒 Em breve" ou "🎲 Aleatório").
- **Engine**: Todos os módulos do motor são independentes e não conectados ao game.js. WorldRegistry oferece `register()`, `get()`, `getAll()`, `isRegistered()`, `validate()`, `getReady()`, `getByType()`, `listIds()`, `size()`, `has()`, `remove()`, `clear()` — todos com validação de tipos e deepFreeze. SessionManager gerencia sessão com `create()` (valida worldId, gera seed, inicializa drawState), `validate()`, `getCurrentWorld()`, `getDrawState()`, `isMultiWorld()`. StateManager oferece 17 métodos para gerenciar estado do jogo: `create()`, `getState()`, `getPlayer()`, `getCurrentPlayer()`, `setPlayerPosition()`, `switchTurn()`, `getWorldStack()`, `pushWorld()`, `popWorld()`, etc. EventProcessor implementa 8 tipos built-in (`move`, `challenge`, `skipTurn`, `extraTurn`, `portal`, `resetPosition`, `finishWorld`, `item`) com cascade automático e proteção de loop (max 100 iterações).
- **EventProcessor (revisões)**: Ordem de resolução alterada de built-in→world→global para world→built-in→global. `processCell` renomeado para `processEventsAtCell`. `addItem` e `setEntryPosition` substituídos por callbacks `onCollectItem`/`onPortalEntryPosition` para evitar dependência de StateManager. Operador `||` substituído por `??` para defaults falsy-safe. Cascade movido para após TODOS os eventos de uma célula, não entre cada evento.
- **WorldConfig Floresta**: 402 linhas com dados extraídos 1:1 do game.js. 20 cells no mundo principal com 12 eventos espalhados, incluindo portal (casa 11 → Floresta Misteriosa). 8 cells no submundo com 4 eventos (2 desafios, 1 atalho, 1 saída-mundo). Temas, regras, cores, ícones, posições SVG — todos migrados. Não consumido por nada — puramente declarativo.

### Impacto Funcional

- Novo seletor de mundos aparece após clicar em "⚡ Jogo Rápido", antes do setup
- Floresta Encantada é o único mundo jogável; 4 mundos aparecem como "Em breve"
- "Mundo Aleatório" seleciona Floresta automaticamente (preparado para futura expansão)
- Engine modular existe em paralelo — nenhuma funcionalidade existente foi alterada
- game.js, index.html, style.css continuam sendo o jogo executado
- Cache-busting atualizado para `?v=0.9.0-preview` garante carregamento da nova versão
- Todas as funcionalidades anteriores (single player, multiplayer, floresta, desafios, banco de questões, menu) permanecem inalteradas

### Notas Técnicas

- O EventProcessor foi criado e revisado com 7 correções, mas NÃO está conectado ao game.js
- O WorldConfig da Floresta contém todos os dados do mundo mas NÃO é consumido por nada
- Floresta Misteriosa usa tipos de evento customizados (`shortcut`, `worldExit`) que não são built-in no EventProcessor — placeholder em `customEventHandlers` para implementação futura
- `selectedWorldId` está definido em game.js e pronto para consumo pelo WorldRegistry na Sprint A5
- Os 4 cards "Em breve" são placeholder visual — seus IDs estão reservados no world-manifest.js

## Marco 3 — Engine em Produção (Sprints A5.1 e A5.2)

### Objetivo

Colocar a Engine em produção: inicializar o WorldRegistry no bootstrap do jogo, migrar `game.js` para ES Module, popular `currentWorldConfig` a partir do registry, e consumir os dados de `board` do WorldConfig nos getters e funções do jogo — tudo com fallback seguro para dados hardcoded.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Migrado de IIFE para ES Module (`type="module"`). Adicionado: import de `WorldRegistry` e `florestaEncantada`, `WorldRegistry.init()` no bootstrap, `currentWorldConfig`. `selectWorld()` agora usa `WorldRegistry.get()`. `getTotalCasas()`, `getPosicoes()`, `getIcones()` consomem `currentWorldConfig.board` com fallback. `handleVictory()` e casos "atalho"/"saida-mundo" usam `config.board.totalCells` |
| `src/index.html` | `<script>` alterado para `<script type="module">`. `data-world="floresta"` alterado para `data-world="floresta-encantada"` |
| `README.md` | Seção de execução local atualizada com exigência de servidor HTTP |
| `CHANGELOG.md` | Adicionado: entrada Sprint A5.1 + A5.2 |
| `docs/arquitetura.md` | Atualizado: fluxo de inicialização com WorldRegistry, seletor de mundos consumindo config |
| `docs/arquitetura-motor-de-mundos.md` | Atualizado: plano de migração com A5.1-A5.4 |
| `docs/roadmap.md` | Atualizado: A5.1 e A5.2 em concluído |

### Impacto Técnico

- **game.js → ES Module**: O arquivo foi convertido de um IIFE (Immediately Invoked Function Expression) para um módulo ES6 (`export` implícito via script type="module"). Isso permite usar `import` para trazer `WorldRegistry`, `florestaEncantada` e, futuramente, outros módulos do engine. Consequência: o jogo não pode mais ser executado via `file://` — exige servidor HTTP.
- **WorldRegistry.init([florestaEncantada])**: Chamado no início do bootstrap, registra o primeiro mundo no registry. `selectWorld(worldId)` agora consulta o registry via `WorldRegistry.get(worldId)` — se o mundo não for encontrado, usa `WorldRegistry.getDefault()` como fallback.
- **currentWorldConfig**: Nova variável no escopo do módulo que armazena o WorldConfig completo do mundo selecionado. É populada em `selectWorld()` e consumida pelos getters world-aware.
- **Getters com fallback**: `getTotalCasas()` retorna `currentWorldConfig?.board?.totalCells ?? TOTAL_CASAS`. `getPosicoes()` retorna `currentWorldConfig?.board?.positions ?? boardPositions`. `getIcones()` retorna `currentWorldConfig?.board?.cellIcons ?? icons`. Isso garante que o jogo funciona mesmo se `currentWorldConfig` estiver ausente (fallback para os dados hardcoded do monólito).
- **handleVictory() e casas especiais**: O case "atalho" (floresta casa 5) e "saida-mundo" (floresta casa 8) usam `currentWorldConfig?.board?.totalCells` em vez de `FLORESTA_TOTAL`. O mesmo para `handleVictory()` que agora lê `currentWorldConfig?.board?.totalCells ?? TOTAL_CASAS`.
- **data-world**: O atributo `data-world` no `<html>` foi alterado de `"floresta"` para `"floresta-encantada"` para corresponder ao ID formal do WorldConfig.
- **Ambiente de desenvolvimento**: `cd src && npx serve .` (porta 3000) ou `cd src && py -m http.server 8000`.

### Impacto Funcional

- Nenhuma regressão funcional — todos os fallbacks preservam o comportamento original
- Cards do seletor de mundos agora exibem nome e descrição extraídos do WorldConfig (antes eram texto estático no HTML)
- Demo online (https://lara-world.wl-infra.uk/) continua funcionando sem alterações
- Jogadores precisam usar servidor HTTP local para desenvolvimento — `file://` não funciona mais

### Notas Técnicas

- A migração para ES Module foi necessária para viabilizar imports de módulos do engine
- `file://` é bloqueado por segurança do navegador — não é uma limitação do código
- O fallback nos getters garante compatibilidade retroativa: se um novo mundo for carregado sem config, o jogo usa os dados hardcoded do monólito
- A5.1 foi a primeira sprint com código da engine EFETIVAMENTE executado no jogo — anteriormente os módulos existiam apenas em paralelo, não conectados
- A5.2 estendeu o consumo para `board.totalCells`, `board.positions`, `board.cellIcons` — todos os getters world-aware agora lêem do config

## Marco 5 — Motor Multi-Mundos Consolidado (v0.10.0-preview)

### Objetivo

Completar o primeiro ecossistema multi-mundos do Lara World: integrar o Vale dos Dinossauros como segundo mundo jogável, implementar a Caverna dos Fósseis como segunda Área Especial, tornar o sistema de portais genérico (baseado em configuração, sem hardcoded), aplicar tema visual por mundo via Theme Engine, e garantir que a Engine não precise ser alterada para adicionar novos mundos.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | **Sprint A6.3**: `document.body.dataset.world` setado em `selectWorld()`, removido em `showMainMenu()`. **Sprint A6.6**: `mundoAtual`/`entradaFloresta`/`entradaCaverna` substituídos por `activeSubworldId` e `subworldEntry`. Getters usam `getSubworldConfig()`. `eventsToSpecialCells` mapeia `shortcut`→`atalho` e `worldExit`→`saida-mundo`. ProcessSpecialCell "portal", "atalho" e "saida-mundo" leem do WorldConfig. Subworld CSS class aplicada/removida nos handlers de portal e debug |
| `src/index.html` | Adicionado: debug buttons da caverna separados por `<hr>`. Portal overlay dinâmico (título/mensagem via JS). world-indicator alterado para "🌀 Submundo" |
| `src/style.css` | Adicionado: `.debug-separator`. Seletores `:not(.mundo-floresta)` em regras conflitantes para proteger o tema da Floresta |
| `src/worlds/dinossauros/config.js` | Adicionado: portal config na casa 10 com `targetWorldId: "caverna-dos-fosseis"`. `cavernaDosFosseis` exportado com 8 casas e 6 eventos |
| `README.md` | Atualizado: v0.10.0-preview como versão ativa, lista de mundos (Floresta + Dinossauros), conceito de Área Especial, arquitetura, história |
| `CHANGELOG.md` | Adicionado: entrada v0.10.0-preview |
| `docs/visao-geral.md` | Atualizado: v0.10.0-preview como versão atual, fluxo principal com Área Especial |
| `docs/arquitetura.md` | Atualizado: game.js com estado genérico, fluxo com seletor de mundos + portal, motor de mundos com ambos os world configs |
| `docs/arquitetura-motor-de-mundos.md` | Atualizado: seção Marco 5, mapeamento dos dois mundos, plano de migração com sprints concluídas |
| `docs/roadmap.md` | Atualizado: A6, Vale dos Dinossauros, Caverna movidos para concluído |
| `docs/memorial-tecnico.md` | Adicionado: entrada Marco 5 |

### Impacto Técnico

- **game.js — Estado genérico**: As variáveis `mundoAtual` (string "principal"/"floresta") e `entradaFloresta`/`entradaCaverna` foram unificadas em `activeSubworldId` (string | null) e `subworldEntry` (objeto `{playerId: posicao}`). Isso elimina qualquer referência hardcoded a "floresta" ou "dinossauros" no estado global.
- **game.js — Getters**: `getTotalCasas()`, `getPosicoes()`, `getIcones()`, `getCasasEspeciais()` agora usam `getSubworldConfig()` que faz lookup em `subworldConfigs[activeSubworldId]`. Se null, retorna `currentWorldConfig` (mundo principal). Nova função `getPortalConfigForCell(pos)` busca portais no `currentWorldConfig.portals`.
- **game.js — eventsToSpecialCells**: Converte eventos do WorldConfig para o formato de casas especiais que `processSpecialCell` entende. Mapeia `shortcut`→`atalho`, `worldExit`→`saida-mundo`, `move`→`avancar`/`voltar`, etc. O `valor` é extraído de `params.bonusCells` (para atalho/saída) ou `params.delta` (para movimento).
- **game.js — Portais**: `resolvePortal()` agora usa `getPortalConfigForCell()` para encontrar o portal config. O modal de portal é dinâmico (título e mensagem do config). Ao entrar, o `theme.cssClass` do submundo é aplicado ao `trackContainer`. Ao sair (atalho/saída), a classe é removida.
- **Theme Engine**: `document.body.dataset.world` é setado para o ID do mundo selecionado em `selectWorld()` e removido em `showMainMenu()`. O CSS usa `[data-world="vale-dinossauros"]` para aplicar gradiente quente e células em tons terra. Decorações temáticas são injetadas via JS.
- **Caverna dos Fósseis**: 8 casas com coordenadas em formato de S. Filosofia risco x recompensa — eventos leves e espaçados. Eventos: casa 2 (move, avança 1), casa 3 (desafio), casa 5 (move, volta 1), casa 7 (saida-mundo com +0), casa 8 (saida-mundo com +3). Tema visual compartilha o data-world do Vale (nenhuma classe CSS específica para a caverna ainda).
- **Debug**: Painel expandido com botões da caverna. Um `<hr class="debug-separator">` separa os botões da Floresta dos botões da Caverna. Cada debug handler verifica `activeSubworldId` antes de operar.
- **Zero engine files alterados**: Nenhuma modificação em `src/engine/*`, `src/core/*`, `src/data/*` ou `src/worlds/loader.js`.

### Impacto Funcional

- Vale dos Dinossauros totalmente jogável: 20 casas, portal na casa 10, Caverna dos Fósseis como Área Especial
- Caverna dos Fósseis com 8 casas, 5 eventos, risco x recompensa (saída rápida +0 ou saída completa +3)
- Floresta Encantada continua funcionando exatamente como antes (portal casa 11, Floresta Misteriosa, bônus +3)
- Portal overlay agora é dinâmico: mostra o nome e descrição do submundo alvo
- Theme Engine aplica visual diferente para cada mundo sem conflitos
- Debug da caverna disponível com `?debug=1`
- Nenhuma regressão funcional em single player, multiplayer, bot, desafios ou banco de questões
- Cache-busting atualizado para `?v=20260706`

### Notas Técnicas

- A Regra de Ouro foi validada: adicionar o Vale dos Dinossauros + Caverna dos Fósseis exigiu **zero alterações na Engine**
- `getSubworldConfig()` retorna null quando `activeSubworldId` é null, fazendo os getters fallbackarem para `currentWorldConfig`
- O portal do Vale está na casa 10 (não 11) para diferenciar da Floresta
- Floresta Misteriosa mantém eventos próprios (atalho casa 5 com +2, saída casa 8 com +3)
- Caverna dos Fósseis tem 5 eventos (vs 4 da Floresta), estruturados em risco x recompensa: `move` (c2, c5), `challenge` (c3), `worldExit` com +0 (c7 — saída rápida/armadilha) e `worldExit` com +3 (c8 — saída completa). Casas 4 e 6 são normais (sem evento), criando pausas na mini-trilha. A mudança reduziu de 7 para 5 eventos, tornando a Caverna mais curta e intuitiva
- Cache-busting via `?v=20260706` com `no-cache, must-revalidate` no Nginx

## Marco 6 — Evolução Visual (UX 2.0)

### Objetivo

Iniciar a fase de identidade visual do Lara World, preparando a infraestrutura para assets gráficos por mundo. As sprints UX-1.1 (overhaul CSS), ASSET-001 (background ilustrado) e ART-002 (caminhos temáticos) estabeleceram a pipeline artística do projeto, mantendo a regra de ouro de não alterar engine, gameplay ou world configs.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/style.css` | **UX-1.1**: redesign completo (~2066 linhas) — multi-radial gradient no body, células 98×64px com border-radius 20px e bottom shadow 6px, botões com shine pseudo-element e shadow 3D, overlays com backdrop-filter blur(6px), vitória com glow dourado animado e firework pseudo-elements, glass card no menu principal com blur(12px), scrollbar temática no histórico. **ASSET-001**: regra `body[data-world="floresta-encantada"] #track-container, #track-container.mundo-floresta` com background-image + overlay rgba(0,0,0,0.35) + fallback gradiente verde. **ART-002**: `#trail-path` com `stroke: url(#path-texture)` + fallback sólido; floresta com `stroke: url(#path-texture-floresta)`; opacity removido de todos os paths — caminho sólido |
| `src/index.html` | Adicionados `<defs>` com SVG patterns (`path-texture` e `path-texture-floresta`) para texturização do caminho |
| `src/assets/worlds/floresta/.gitkeep` | **Criado** — placeholder para versionar estrutura de assets |
| `README.md` | Adicionada seção "Identidade Visual" com estrutura de assets, princípios e status; versão atualizada para v0.11.0-preview |
| `CHANGELOG.md` | Adicionada entrada v0.11.0-preview |
| `docs/visao-geral.md` | Adicionada seção "Evolução Visual (UX 2.0)" com motivação, decisões aprovadas, estrutura de assets, finalidade dos assets e testes realizados |
| `docs/roadmap.md` | Adicionada trilha "ART — Direção de Arte" com 8 etapas (ART-001 a ART-008) |
| `docs/arquitetura.md` | Atualizada estrutura de diretórios com `src/assets/`, seção de identidade visual |
| `docs/memorial-tecnico.md` | Adicionada entrada Marco 6 |

### Impacto Técnico

**UX-1.1 — Overhaul Visual**
- Body: multi-radial gradient com 4 elipses (rosa, ciano, amarelo, lilás) criando profundidade
- `#app`: border-radius 40px, borda branca 3px, shadow rosa suave
- Células (.casa): 98×64px (+11%), border-radius 20px, bottom shadow 6px, ícones e textos maiores
- Células especiais: gradientes suaves e colored shadows (ex: `#fce4ec→#f8bbd0` para volta, `#fff8e1→#fff3cd` para jogar-novamente)
- Casa-ativada: scale 1.1, outline 5px rosa com `!important` para sobrescrever sombras de células especiais
- Avatares: 62×62px, colored shadow (rosa/azul) para destacar do fundo
- Botões: bottom shadow 6px, pseudo-element `::after` com gradiente branco para efeito shine, hover com 8px de shadow
- Overlays (challenge, portal, victory, setup, world-selector): `backdrop-filter: blur(6px)`, fundo `rgba(0,0,0,0.35-0.4)` mais transparente
- Vitória: glow dourado animado (`text-shadow` pulsante), firework pseudo-elements (`::before`/`::after` com confetes), animação `golden-glow`
- Draw overlay: fundo gradiente, vencedor com glow dourado
- Painel lateral: cards com borda esquerda colorida (4px rosa `#e91e63`, dourado `#ff8f00`, roxo `#7b1fa2`)
- Menu principal: glass card com `backdrop-filter: blur(12px)`, botões com shine
- Tema dinossauros: células com gradiente e shadows consistentes
- Responsivo: breakpoints mantidos, células adaptadas proporcionalmente (72×50px em ≤840px, 62×44px em ≤600px, 52×38px em ≤400px)

**ASSET-001 — Background Ilustrado**
- Seletor CSS: `body[data-world="floresta-encantada"] #track-container, #track-container.mundo-floresta`
- 3 camadas de background: overlay rgba(0,0,0,0.35) + `url(background.webp)` + gradiente verde fallback
- `background-size: cover` na imagem, `background-position: center`
- Se `background.webp` não existir: camada do meio é transparente, gradiente fallback aparece, overlay escurece levemente o fundo
- Aplicação no body foi testada e descartada — o fundo geral deve permanecer neutro

**ART-002 — Caminho Temático**
- SVG patterns adicionados no HTML (`<defs>` dentro do `<svg class="path-line">`)
- `patternUnits="userSpaceOnUse" width="16" height="16"` para textura tileável
- Padrão contém `<rect fill="cor_fallback">` + `<image href="path.webp">` para fallback sólido
- CSS `#trail-path` com `stroke: cor_sólida; stroke: url(#pattern)` — navegador sem suporte a URL em stroke usa a cor
- `opacity` removido de todos os paths — caminho 100% sólido, sem transparência
- Drop-shadow alpha ajustado de 0.08 para 0.12 para compensar o traço opaco
- Floresta: cor fallback `#6d8f5e` (verde terra), pattern `path-texture-floresta`
- Dinossauros inalterado: `stroke: #c48a3a` (cor sólida, sem pattern)

### Impacto Funcional

- **Visual cartoon e infantil**: o jogo agora possui aparência lúdica com cores vibrantes, sombras profundas e cantos arredondados
- **Background ilustrado**: Floresta Encantada tem tabuleiro com fundo temático (fallback gradiente verde enquanto asset não existir)
- **Caminho sólido**: o traço do caminho não é mais translúcido — parece um elemento físico do cenário
- **Nenhuma regressão funcional**: todas as mecânicas (dado, movimento, desafios, portal, vitória, bot, single player, debug) continuam idênticas
- **Expansão preparada**: novos mundos precisam apenas de assets na pasta correspondente e patterns CSS

### Notas Técnicas

- A Regra de Oro foi mantida: **zero alterações em engine, world configs, game.js ou gameplay**
- UX-1.1 (CSS overhaul) foi a maior alteração no style.css desde a criação do projeto (~2066 linhas finais)
- A decisão de aplicar background no `#track-container` (não no body) foi validada após teste prático
- SVG pattern com `<rect>` + `<image>` é a abordagem SVG-nativa para textura em stroke, equivalente funcional a `background-image`
- Futuras texturas de caminho para outros mundos: adicionar `<pattern>` no HTML + regra CSS + asset na pasta do mundo

## Marco 7 — Consolidação da Direção de Arte

### Objetivo

Consolidar a pipeline de identidade visual do Lara World, completando a infraestrutura de backgrounds e caminhos temáticos para os dois mundos disponíveis (Floresta Encantada e Vale dos Dinossauros), validando a arquitetura de assets por mundo, e removendo elementos decorativos antigos que conflitavam com os novos backgrounds ilustrados.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/style.css` | **ART-003**: regra `body[data-world="dinossauros"] #track-container:not(.mundo-floresta)` com background-image (overlay + url + gradiente arenoso); caminho com `stroke: url(#path-texture-dinossauros)`. **ART-004**: remoção de ~90 linhas de CSS morto (`.deco`, default positioning, floresta deco toggle, dino deco toggle, responsive font-sizes). **Ajuste visual**: caminho Dinossauros com `opacity: 0.75`, `stroke-width: 12`, sombra mais suave |
| `src/index.html` | **ART-002**: adicionados `<defs>` com SVG patterns (`path-texture`, `path-texture-floresta`). **ART-003**: adicionado `path-texture-dinossauros`. **ART-004**: removidas 19 divs decorativas (clouds, trees, flowers, sun, floresta decos) |
| `src/assets/worlds/floresta/.gitkeep` | **Criado** — placeholder para assets da Floresta |
| `src/assets/worlds/dinossauros/.gitkeep` | **Criado** — placeholder para assets do Vale |
| `README.md` | Seção "Identidade Visual" expandida com estrutura completa dos dois mundos, decisões de UX aprovadas, e descobertas dos testes |
| `CHANGELOG.md` | Entrada v0.11.0-preview expandida com ART-002, ART-003, ART-004 |
| `docs/visao-geral.md` | Seção "Evolução Visual" atualizada com background Dinossauros, estrutura completa, descobertas dos testes |
| `docs/roadmap.md` | Trilha ART atualizada com sprints concluídas e pendentes |
| `docs/arquitetura.md` | Estrutura de diretórios atualizada com dinossauros/ |
| `docs/memorial-tecnico.md` | Adicionada entrada Marco 7 |

### Impacto Técnico

**ART-002/003 — Backgrounds e Caminhos**
- Floresta Encantada: CSS `body[data-world="floresta-encantada"] #track-container, #track-container.mundo-floresta` com 3 camadas de background: overlay rgba(0,0,0,0.35) + `url(background.webp)` + gradiente verde fallback
- Vale dos Dinossauros: CSS `body[data-world="dinossauros"] #track-container:not(.mundo-floresta)` com 3 camadas de background: overlay rgba(0,0,0,0.35) + `url(background.webp)` + gradiente arenoso fallback (#f4c97a → #8b6914)
- Ambos usam `background-size: cover, cover, auto` e `background-position: center, center, 0 0`
- Se `background.webp` não existir: camada do meio é transparente, gradiente fallback aparece, overlay mantém contraste
- Caminhos temáticos: SVG patterns no HTML (`<pattern>` com `<rect fill>` + `<image>`), CSS com `stroke: url(#pattern-id)` + fallback cor sólida
- Floresta: pattern `path-texture-floresta` com fill #6d8f5e, fallback `#6d8f5e`
- Dinossauros: pattern `path-texture-dinossauros` com fill #c48a3a, fallback `#c48a3a`
- Dinossauros path refinado: `stroke-width: 12` (era 14), `opacity: 0.75`, `filter: drop-shadow(0 2px 5px ...)` (mais compacto)

**ART-004 — Remoção de Decorações**
- HTML: removidas 19 divs decorativas (10 default + 9 floresta) que ficavam soltas sobre o tabuleiro
- CSS: removidas ~90 linhas — classe `.deco` base, regras de posicionamento default (.deco-cloud-*, .deco-tree-*, .deco-flower-*, .deco-sun), toggle floresta (.floresta-deco, .floresta-deco-*), toggle dinossauros (.deco-palm-*, .deco-volcano, .deco-rock-*, .deco-dino, `body[data-world="dinossauros"] .theme-deco { display: block; }`), font-sizes responsivos
- Mantido: `.theme-deco { display: none; }` para esconder permanentemente decorações injetadas por JS (Floresta, Dinossauros e Caverna)
- Nenhum arquivo de engine, world config ou game.js foi alterado

### Impacto Funcional

- **Floresta Encantada**: tabuleiro com fundo temático (fallback gradiente verde enquanto asset não existir), caminho com textura própria
- **Vale dos Dinossauros**: tabuleiro com fundo temático (fallback gradiente arenoso enquanto asset não existir), caminho semi-transparente com textura própria
- **Tabuleiro mais limpo**: sem emojis decorativos soltos sobre o mapa — background ilustrado assume o papel de cenário
- **Caminho do Dinossauros mais leve**: opacity 0.75 permite ver o cenário através do traço, stroke 12 mais fino, sombra mais discreta
- **Backgrounds independentes**: cada mundo pode ter seu próprio cenário sem conflitos
- **Floresta intacta**: seletores `body[data-world="floresta-encantada"]` e `.mundo-floresta` não foram alterados
- **Nenhuma regressão funcional**: todas as mecânicas (dado, movimento, desafios, portal, vitória, bot, single player, debug) continuam idênticas

### Notas Técnicas

- A Regra de Ouro foi mantida: **zero alterações em engine, world configs, game.js ou gameplay**
- Todos os backgrounds seguem o mesmo padrão: overlay + url + gradiente fallback
- Todos os caminhos seguem o mesmo padrão: fallback cor sólida + pattern URL
- Caminho Dinossauros é o único com `opacity` (0.75) para efeito semi-transparente
- Decorações injetadas via JS (Floresta, Dinossauros, Caverna) continuam sendo criadas mas ficam ocultas por `.theme-deco { display: none; }`
- Adicionar um novo mundo: criar pasta em `src/assets/worlds/<mundo>/`, adicionar `<pattern>` no HTML, criar regras CSS de background + path

### Objetivo

Implementar um menu inicial (Main Menu) com duas opções de entrada ("⚡ Jogo Rápido" e "🏆 Modo Carreira (Em Breve)"), refatorar a tela de vitória para oferecer duas saídas distintas (Jogar Novamente / Voltar ao Menu), e extrair `resetGameState()` para reúso entre reinício e retorno ao menu.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Adicionado: `modoJogo`, `showMainMenu()`, `hideMainMenu()`, `setupMenuEvents()`, `resetGameState()`. Modificado: `init()` (agora chama `showMainMenu()`), `setupModalEvents()` (configura `modoJogo`, oculta seletor 2P), `startGame()` (usa `modoJogo`), `handleVictory()` (dois botões), `reiniciarJogo()` (usa `resetGameState()`) |
| `src/index.html` | Adicionado: `#main-menu` com `.menu-title`, `.menu-buttons`, `.menu-btn` para "Jogo Rápido" e "Carreira". Reordenado: `#main-menu` antes de `#game-layout`. Modificado: `#victory-overlay` com container `.victory-actions` para dois botões. Cache-busting atualizado para `?v=0.8.0` |
| `src/style.css` | Adicionado: `#main-menu`, `.menu-title` (fonte grande, gradiente dourado), `.menu-buttons` (flex column, gap), `.menu-btn` (hover rosa, borda), `.menu-btn.disabled` (opacity, cursor not-allowed), `.menu-btn-icon` (tamanho fixo 64px), `.victory-actions` (flex, gap, dois botões lado a lado) |
| `README.md` | Atualizado: v0.8.0 como versão ativa, funcionalidades, história, roadmap |
| `CHANGELOG.md` | Adicionado: entrada v0.8.0 |
| `docs/visao-geral.md` | Atualizado: v0.8.0 como versão atual |
| `docs/arquitetura.md` | Atualizado: index.html com main menu, game.js com modoJogo/showMainMenu/resetGameState, fluxo do jogo |
| `docs/regras-do-jogo.md` | Atualizado: Tela Inicial, tela de vitória com duas saídas |
| `docs/roadmap.md` | Atualizado: v0.8.0 movido para concluído |
| `docs/memorial-tecnico.md` | Adicionado: entrada v0.8.0 |

### Impacto Técnico

- **game.js**: Nova variável `modoJogo` (string | null) controla o modo atual — `"rapido"` para Jogo Rápido, `null` no menu. `init()` agora chama `showMainMenu()` em vez de `showSetupScreen()`. `showMainMenu()` exibe `#main-menu` e oculta `#game-layout`, `#setup-screen`, `#victory-overlay`. `hideMainMenu()` oculta `#main-menu` e exibe `#game-layout`. `setupMenuEvents()` registra clique no botão "Jogo Rápido" (configura `modoJogo = "rapido"`, chama `hideMainMenu()` + `showSetupScreen()`) e no botão "Carreira" (disabled, sem ação). `setupModalEvents()` no modo Jogo Rápido oculta o seletor de modo e força configuração 1P. `startGame()` usa `modoJogo` para determinar se é single player. `resetGameState()` extrai a lógica de reset de estado de `reiniciarJogo()`: zera posições, `rodadasPerdidas`, `mundoAtual = "principal"`, `entradaFloresta = {1: null, 2: null}`, `entrouNoPortal = false`, `questoesUsadas.clear()`, `jogoAtivo = true`, `jogoFinalizado = false`. `reiniciarJogo()` agora chama `resetGameState()` e depois `showSetupScreen()`. `handleVictory()` agora cria dois botões no container `.victory-actions`: "🔁 Jogar Novamente" chama `reiniciarJogo()` e "🏠 Voltar ao Menu" chama `showMainMenu()`.
- **HTML**: Novo `#main-menu` com `<h1 class="menu-title">🌍 Lara World</h1>`, dois `<button class="menu-btn">` no container `.menu-buttons`. O segundo botão ("🏆 Modo Carreira") possui classe `disabled` e `disabled` attribute. Estrutura reordenada: `#main-menu` é o primeiro elemento do body, seguido por `#game-layout`. `#victory-overlay` ganhou container `.victory-actions` com `id="victory-actions"`. Cache-busting: `?v=0.8.0` no link do CSS e script do JS.
- **CSS**: `#main-menu` com `position: fixed`, `inset: 0`, `z-index: 1000`, `display: flex`, `flex-direction: column`, centralizado, fundo com gradiente animado. `.menu-title` com `font-size: 4rem`, gradiente dourado (`linear-gradient(135deg, #ffd700, #ff8c00)`), `text-shadow` decorativo. `.menu-buttons` com `display: flex`, `flex-direction: column`, `gap: 20px`. `.menu-btn` com `padding: 20px 40px`, `font-size: 1.5rem`, `border-radius: 16px`, `border: 3px solid rgba(255,255,255,0.3)`, `background: rgba(255,255,255,0.1)`, `cursor: pointer`, hover com borda rosa. `.menu-btn.disabled` com `opacity: 0.4`, `cursor: not-allowed`. `.menu-btn-icon` com `font-size: 64px`, `line-height: 1`. `.victory-actions` com `display: flex`, `gap: 12px`, `justify-content: center`.

### Impacto Funcional

- Jogo agora inicia com um menu principal visual com título decorativo e dois botões
- "⚡ Jogo Rápido" inicia partida single player com configuração mínima (apenas nome/sprite do Jogador 1)
- "🏆 Modo Carreira" aparece como botão desabilitado com "(Em Breve)", sem ação
- Tela de vitória agora oferece duas opções: "Jogar Novamente" (mesmo modo) ou "Voltar ao Menu"
- "Jogar Novamente" agora reinicia a partida sem sair do modo atual (não exige re-seleção)
- "Voltar ao Menu" retorna ao menu principal, permitindo iniciar nova partida do zero
- Cache-busting via `?v=0.8.0` garante que navegadores carreguem a versão mais recente dos assets
- Todas as funcionalidades anteriores (single player, multiplayer, floresta, desafios, banco de questões) permanecem inalteradas

## [0.7.0] - 2026-07-05

### Objetivo

Adicionar modo Single Player (Humano vs Máquina) com bot automático que joga dado, responde desafios e decide entrar no portal. Implementar tela de vitória visual com confetes e overlay. Corrigir cascata da casa 5 na posição 1 e botão "Jogar Dado" após reinício.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Adicionado: `players[].isBot`, `isSinglePlayer`, `botTurnScheduled`, `resolveChallenge()`, `resolvePortal()`, `scheduleBotTurnIfNeeded()`, seletor de modo em `setupModalEvents()`, `handleVictory()`. Modificado: `startGame()` (configura P2 como bot), `switchTurn()` (proteção 1P), `unlockTurn()` (agenda bot), `jogarDado()` (suporte a bot) |
| `src/index.html` | Adicionado: seletor de modo (`.mode-selector` com radio buttons 1P/2P), overlay de vitória (`#victory-overlay`) com confetes, serpentina, troféu e botão "Jogar Novamente" |
| `src/style.css` | Adicionado: `.mode-selector`, `.mode-option`, `.mode-option.selected`, `#setup-screen.mode-1p .player2-card`, estilos do overlay de vitória (confetes, serpentina, conteúdo) |

### Impacto Técnico

- **game.js**: `players[]` ganhou campo `isBot: false` padrão. Nova variável `isSinglePlayer` (boolean) controla modo de jogo. `botTurnScheduled` impede agendamento duplicado do turno do bot. `startGame()` — em modo 1P, P2 recebe name="Máquina", emoji="🤖", isBot=true; P2 card fica oculto. `resolveChallenge(desafio)` — se `player.isBot`, delay(600ms) + `Math.random() < 0.6` para acerto; senão, chama `showChallengeModal()`. `resolvePortal()` — se `player.isBot`, delay(500ms) + `Math.random() < 0.5` para entrar; senão, chama `showPortalModal()`. `scheduleBotTurnIfNeeded()` — verifica se jogador atual é bot e jogo ativo, agenda `setTimeout(jogarDado, 1000)`. `unlockTurn()` agora chama `scheduleBotTurnIfNeeded()` ao final. `switchTurn()` ganhou guarda `if (PLAYER_COUNT < 2) return` para modo 1P. `handleVictory()` — nova função que define `jogoFinalizado = true`, desabilita dado, exibe `#victory-overlay` com confetes e botão "Jogar Novamente".
- **HTML**: Seletor de modo adicionado ao `#setup-screen` com dois `<label class="mode-option">` contendo radio buttons. Overlay `#victory-overlay` com 15 `.confetti-piece` (cores variadas, posições aleatórias, animações com delay), 2 `.serpentine` (fogos), título "🏆 Vitória!", mensagem `#victory-message`, botão "🔄 Jogar Novamente".
- **CSS**: `.mode-selector` (flex, gap 12px, centralizado), `.mode-option` (flex 1, padding, border-radius, transição), `.mode-option.selected` (borda rosa, fundo rosa claro). `#setup-screen.mode-1p .player2-card` com `display: none`. Overlay de vitória: `.victory-overlay` (fixed, inset 0, z-index 2000, flex centralizado, background rgba), `.confetti-piece` (position absolute, top -10px, animação `confetti-fall` com duração e delay variados), `.serpentine` (position absolute, animação `firework`), `.victory-content` (background branco, border-radius, padding, z-index 10).

### Impacto Funcional

- Novo seletor de modo no modal de configuração permite escolher entre 2 Jogadores e 1 Jogador
- Modo 1 Jogador: jogador humano vs máquina com turnos alternados automaticamente
- Bot joga sozinho após 1 segundo de espera, incluindo dado, movimento e casas especiais
- Bot responde desafios educativos com 60% de chance de acerto (sem exibir modal)
- Bot decide entrar no Portal da Floresta com 50% de chance (sem exibir modal)
- Ao vencer, overlay de vitória com confetes animados e fogos serpentina é exibido
- Botão "Jogar Novamente" no overlay retorna ao modal de configuração
- Casa 5 na posição 1 não abre mais modal de desafio indevidamente
- Botão "Jogar Dado" funciona corretamente após reinício
- Todas as funcionalidades anteriores (multiplayer 2P, floresta, desafios, banco de questões) permanecem inalteradas no modo 2 jogadores

## [0.6.0] - 2026-07-03

### Objetivo

Implementar um sistema de mundos alternativos com portal de entrada, começando pelo Mundo da Floresta — uma mini-trilha de 8 casas acessada pela casa 11, com mecânicas exclusivas, visuais temáticos e proteção de turno durante a sessão na floresta. Incluir modo debug para facilitar testes.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Adicionado: constantes da floresta (`FLORESTA_TOTAL`, `florestaPosicoes`, `florestaIcones`, `florestaEspeciais`), getters world-aware, `gameState.mundoAtual`, `gameState.entradaFloresta`, `gameState.entrouNoPortal`, case "portal" e "saida-mundo" em processSpecialCell, modo debug. Modificado: `renderizarTrilha`, `renderSvgPath`, `positionPlayerAt`, `animatePlayerMovement`, `jogarDado`, `switchTurn`, `reiniciarJogo` |
| `src/index.html` | Adicionado: `#portal-overlay` (modal de entrada), `#world-indicator` (indicador de mundo), decorações da floresta, `#debug-panel` |
| `src/style.css` | Adicionado: `.mundo-floresta` (fundo verde escuro), estilos de casas da floresta, portal overlay, world indicator, decorações temáticas, debug panel |
| `README.md` | Atualizado: v0.6.0 como versão ativa, funcionalidades, história, roadmap |
| `CHANGELOG.md` | Adicionado: entrada v0.6.0 |
| `docs/visao-geral.md` | Atualizado: v0.6.0 como versão atual |
| `docs/arquitetura.md` | Atualizado: constantes, index.html, game.js, turnos, estado |
| `docs/regras-do-jogo.md` | Atualizado: portal, floresta, casas especiais |
| `docs/roadmap.md` | Atualizado: v0.6.0 movido para concluído |
| `docs/memorial-tecnico.md` | Adicionado: entrada v0.6.0 |

### Impacto Técnico

- **game.js**: Adicionadas constantes `FLORESTA_TOTAL = 8`, `florestaPosicoes` (coordenadas em formato de S), `florestaIcones` (🌲🌿🍄🐾🦉🍂🌳🚪), `florestaEspeciais` (casa 3 desafio, casa 5 atalho, casa 7 desafio, casa 8 saída-mundo). Criados getters dinâmicos `getTotalCasas()`, `getPosicoes()`, `getIcones()`, `getCasasEspeciais()` que retornam valores do mundo atual. `gameState.mundoAtual` alterna entre `"principal"` e `"floresta"`. `gameState.entradaFloresta = {1: null, 2: null}` salva posição de entrada por jogador. `gameState.entrouNoPortal` evita reentrada no portal na mesma jogada. `processSpecialCell` ganhou case "portal" que exibe modal com opções Entrar/Continuar e case "saida-mundo" que retorna ao mundo principal com bônus (+3 na casa 8, +2 na casa 5 via "atalho"). `jogarDado()` adaptado para suportar floresta: ao completar a floresta, volta ao principal com bônus sem cascatear.
- **Renderização**: `renderizarTrilha()` aceita parâmetro `mundo` para renderizar tabuleiro correto. `renderSvgPath()` aceita `posicoes` opcional para gerar caminho SVG. `positionPlayerAt()` oculta sprite do outro jogador quando `mundoAtual === "floresta"`. `animatePlayerMovement()` usa `getPosicoes()` para obter coordenadas do mundo atual.
- **Turno**: `switchTurn()` agora verifica `if (mundoAtual !== "floresta")` antes de alternar, garantindo que o mesmo jogador complete a floresta sem interrupção.
- **Debug**: Novo bloco opcional ativado por `?debug=1` na URL. Cinco botões: "Casa 11 (Portal)", "Entrar na Floresta", "Casa 5 (Atalho)", "Casa 8 (Saída)", "Voltar ao Principal". Renderiza painel `#debug-panel` no canto inferior esquerdo com `z-index: 999`.
- **Correções**: `renderizarSvgPath` → `renderSvgPath` em portal e saída-mundo. `entradaFloresta` movido para fora do bloco `if (extraTurn)` — estava sendo resetado indevidamente em jogadas normais.

### Impacto Funcional

- Casa 11 agora abre modal "Portal da Floresta" com opção de entrar (vai para floresta, salva posição) ou continuar (ignora)
- Mundo da Floresta com trilha própria de 8 casas em formato de S, fundo verde escuro, decorações temáticas
- Ao entrar na floresta: jogador ativo continua jogando sem alternância de turno
- Outro jogador não aparece no tabuleiro da floresta (sprite oculto)
- Casa 3 da floresta: desafio educativo (pergunta do banco)
- Casa 5 da floresta: atalho de saída — volta ao mundo principal com +2 casas de bônus
- Casa 7 da floresta: desafio educativo (pergunta do banco)
- Casa 8 da floresta: saída — volta ao mundo principal com +3 casas de bônus
- Bônus de saída não cascateia para outras casas especiais
- Modo debug facilita teste de todos os cenários da floresta
- Todas as regras anteriores (desafios, banco de questões, multiplayer) permanecem inalteradas quando no mundo principal

## [0.5.0] - 2026-07-03

### Objetivo

Evoluir o sistema de desafios educativos de perguntas fixas por casa para um Banco de Questões organizado por categorias, com sorteio aleatório e proteção contra repetição na mesma partida.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Substituído: `desafios[]` por `bancoQuestoes{}`. Adicionado: `questoesDisponiveis[]`, `sortearQuestao()`, `gameState.questoesUsadas`. Modificado: processSpecialCell case "desafio", reiniciarJogo, startGame |
| `README.md` | Atualizado: v0.5.0 como versão ativa, funcionalidades com banco de questões, histórico, roadmap |
| `CHANGELOG.md` | Adicionado: entrada v0.5.0 |
| `docs/visao-geral.md` | Atualizado: funcionalidades da v0.5.0 |
| `docs/arquitetura.md` | Atualizado: constantes com bancoQuestoes/questoesDisponiveis, gameState com questoesUsadas, seção de sorteio |
| `docs/regras-do-jogo.md` | Atualizado: descrição das casas de desafio com sorteio, regra de não repetição |
| `docs/roadmap.md` | Atualizado: v0.5.0 movido para concluído, v0.6.0 como Mundos e Portais Secretos |
| `docs/memorial-tecnico.md` | Adicionado: entrada v0.5.0 |

### Impacto Técnico

- **game.js**: `desafios[]` (array flat de 5 perguntas) substituído por `bancoQuestoes{}` com 6 categorias e 30 perguntas. `questoesDisponiveis[]` gerado via `Object.values(bancoQuestoes).flat()`. Nova função `sortearQuestao()` que: (1) verifica se todas as perguntas foram usadas (`gameState.questoesUsadas.size >= total`), (2) limpa o Set se necessário, (3) sorteia índice aleatório não usado, (4) marca como usado e retorna a pergunta. `processSpecialCell` case "desafio" agora chama `sortearQuestao()` em vez de indexar `desafios[info.valor]`. Campos `valor` removidos das entradas de desafio em `casasEspeciais` (4, 7, 12, 16, 18) por não serem mais necessários.
- **Reset**: `reiniciarJogo()` e `startGame()` chamam `gameState.questoesUsadas.clear()` para garantir banco fresco a cada partida.
- **Correção de bug**: adicionado `elements.rollBtn.disabled = false` em `reiniciarJogo()` — o botão "Jogar Dado" ficava desabilitado após vencer e reiniciar porque `handleVictory()` o desabilita mas o reset não o reabilitava.

### Impacto Funcional

- Desafios agora exibem perguntas sorteadas de 6 categorias temáticas
- Nenhuma pergunta se repete dentro da mesma partida
- Partidas longas podem esgotar as 30 perguntas — o banco reinicia automaticamente
- Botão "Jogar Dado" funciona corretamente após reinício (bug corrigido)
- Todas as regras anteriores de desafio (acerto/erro, movimento, não cascata) permanecem inalteradas
- Nenhuma alteração em HTML, CSS, Docker, modal inicial ou sistema de turnos

## [0.4.0] - 2026-07-03

### Objetivo

Adicionar 5 casas de desafio educativo com perguntas de múltipla escolha, integradas ao fluxo de jogo existente sem alterar regras especiais prévias, modal inicial, Docker ou sistema de jogadores.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Adicionado: array `desafios[]`, 5 entradas em `casasEspeciais` (4,7,12,16,18), case "desafio" em processSpecialCell, função showChallengeModal |
| `src/index.html` | Adicionado: estrutura do modal `#challenge-overlay` com pergunta e opções |
| `src/style.css` | Adicionado: estilos do modal de desafio, cores das 5 casas de desafio (roxo) |
| `README.md` | Atualizado: v0.4.0 como versão ativa, funcionalidades com desafios, tabela de casas expandida, histórico |
| `CHANGELOG.md` | Adicionado: entrada v0.4.0 |
| `docs/visao-geral.md` | Atualizado: funcionalidades da v0.4.0 |
| `docs/arquitetura.md` | Atualizado: estrutura do index.html com challenge modal, cores CSS, organização do código, fluxo do jogo |
| `docs/regras-do-jogo.md` | Atualizado: tabela de casas especiais com desafios, regra de não-cascata |
| `docs/roadmap.md` | Atualizado: v0.4.0 movido para concluído |
| `docs/memorial-tecnico.md` | Adicionado: entrada v0.4.0 |

### Impacto Técnico

- **game.js**: Adicionado array `desafios[]` com 5 objetos `{pergunta, opcoes[], resposta}`. `casasEspeciais` expandido de 6 para 11 entradas — 5 novas com tipo "desafio" e `valor` indexando o array. `processSpecialCell()` ganhou case "desafio" que: (1) registra no histórico, (2) chama `showChallengeModal()` via Promise, (3) move o jogador ±1 casa, (4) retorna `false` sem cascatear. `showChallengeModal(desafio)` cria botões dinâmicos com `String.fromCharCode(65 + index)` para rótulos A/B/C, resolve a Promise com `opcao === desafio.resposta` e esconde o overlay.
- **HTML**: Modal `#challenge-overlay` adicionado entre o setup screen e o game-layout, com `#challenge-question` (parágrafo) e `#challenge-options` (container dos botões).
- **CSS**: `.challenge-overlay` com `z-index: 500`, `.challenge-content` centralizado, `.challenge-btn` com hover roxo. Casas 4, 7, 12, 16, 18 estilizadas com fundo `#f3e5f5`, borda `#7b1fa2` e sombra `#4a148c`.
- **Prevenção de loop**: O movimento pós-desafio (`+1` ou `-1`) atualiza `player.posicao` e `positionPlayerAt()` sem chamar `processSpecialCell()` novamente, eliminando qualquer risco de cascata cíclica.

### Impacto Funcional

- 5 novas casas especiais com mecânica de perguntas e respostas
- Jogador que acerta avança 1 casa; que erra volta 1 casa
- Dado fica bloqueado enquanto o modal de desafio estiver aberto
- Histórico registra a entrada no desafio, o acerto ou o erro
- Nenhuma regra anterior foi alterada — casas 3, 5, 8, 10, 15, 20 funcionam exatamente como antes
- Modal inicial, Docker, sistema de jogadores — inalterados

## [0.3.0] - 2026-07-03

### Objetivo

Implementar um modal de configuração inicial que permita aos jogadores definir seus nomes e escolher sprites (emojis) antes do início da partida, além de alterar o fluxo de reinício para retornar ao modal.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Adicionado: showSetupScreen, hideSetupScreen, startGame, setupModalEvents. Alterado: init, reiniciarJogo |
| `src/index.html` | Adicionado: estrutura do modal com inputs de nome e grades de emoji para P1 e P2 |
| `src/style.css` | Adicionado: estilos do modal overlay, player cards, emoji grid e estados de seleção |
| `README.md` | Atualizado: v0.3.0 como versão ativa, funcionalidades, modo de jogar com modal, roadmap |
| `CHANGELOG.md` | Adicionado: entrada v0.3.0 |
| `docs/visao-geral.md` | Atualizado: funcionalidades da v0.3.0 |
| `docs/arquitetura.md` | Atualizado: estrutura do index.html, seção CSS do modal, funções de setup, fluxo do jogo |
| `docs/regras-do-jogo.md` | Atualizado: regras multiplayer com modal, regra de reinício |
| `docs/roadmap.md` | Atualizado: v0.3.0 movido para concluído |
| `docs/memorial-tecnico.md` | Adicionado: entrada v0.3.0 |

### Impacto Técnico

- **game.js**: `init()` agora chama `showSetupScreen()` em vez de `renderizarTrilha()` diretamente. Criada função `setupModalEvents()` que registra eventos de clique nas grades de emoji (`#p1-emoji-grid` e `#p2-emoji-grid`) e no botão "Iniciar Jogo". `startGame()` lê os valores dos inputs, define `players[].name` e `players[].emoji`, esconde o modal e chama `renderizarTrilha()`. `reiniciarJogo()` agora chama `showSetupScreen()` em vez de renderizar diretamente.
- **HTML**: Modal adicionado ao body com `#setup-overlay` contendo dois `.player-card` com inputs (`#p1-name`, `#p2-name`) e grades de emoji (`#p1-emoji-grid`, `#p2-emoji-grid`). Cada grade contém 10 opções de emoji.
- **CSS**: Modal usa `position: fixed` com overlay semi-transparente. Player cards com `flex: 1` ocupam metade da largura cada. Emoji grid com `display: flex; flex-wrap: wrap`. Emoji selecionado ganha borda azul com `box-shadow`.
- **jQuery**: Biblioteca carregada via CDN no HTML para facilitar manipulação do DOM no modal, sem alterar o restante do código que permanece em JavaScript Vanilla.

### Impacto Funcional

- Jogo agora começa com modal de configuração em vez de tabuleiro pronto
- Jogadores podem personalizar nomes e sprites antes de cada partida
- Sprites dos dois jogadores são independentes (cada grade tem seu próprio estado)
- Reinício retorna ao modal, permitindo reconfiguração
- Fallback para nomes "Jogador 1" / "Jogador 2" e emojis 🧒 / 👦 se o jogador não interagir

### Objetivo

Evoluir o Lara World de um jogo single player para suporte a multiplayer local com 2 jogadores, alternância de turnos e documentação completa do projeto.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Refatoração: estrutura de players, controle de turnos, offset em mesma casa |
| `src/style.css` | Adicionado: #lara-p2, .turn-indicator, .pos-p1/.pos-p2, animação para P2 |
| `src/index.html` | Adicionado: #lara-p2 visível, painel com turno e posições individuais |
| `README.md` | Reescrito: status, funcionalidades, multiplayer, tecnologias, roadmap |
| `CHANGELOG.md` | Criado: registro v0.1.0 e v0.2.0 |
| `docs/visao-geral.md` | Reescrito: conceito multiplayer, funcionalidades detalhadas |
| `docs/arquitetura.md` | Reescrito: organização do código, movimento, turnos, estado |
| `docs/regras-do-jogo.md` | Reescrito: regras 1 e 2 jogadores, tabela de casas |
| `docs/roadmap.md` | Reescrito: versões concluídas e futuro |
| `docs/AI_WORKFLOW.md` | Criado: processo de desenvolvimento assistido |

### Impacto Técnico

- **game.js**: `PLAYER_COUNT` passou de 1 para 2. `posicao` e `rodadasPerdidas` movidos de `gameState` para objetos individuais de cada `player`. Adicionadas funções `getCurrentPlayer()`, `getPlayerElement()`, `switchTurn()`, `updateUI()`. `positionPlayerAt()` agora aceita parâmetro opcional `player` e aplica offset (±12x, ±8y) quando dois jogadores estão na mesma casa. `jogarDado()` agora chama `switchTurn()` e `updateUI()` ao final de cada turno.
- **HTML/CSS**: Segundo personagem `#lara-p2` adicionado. Painel de status exibe indicador de turno e posições individuais.

### Impacto Funcional

- Jogo agora suporta 2 jogadores no mesmo dispositivo
- Turnos alternam automaticamente após cada jogada
- Exceção: casa 8 (jogue novamente) mantém o mesmo jogador
- Cada jogador tem posição e contador de rodadas perdidas próprios
- Personagens sobrepostos recebem offset visual para não se ocultarem
- Primeiro jogador a atingir a casa 20 vence e encerra a partida
- Reinício reseta ambos os jogadores simultaneamente
