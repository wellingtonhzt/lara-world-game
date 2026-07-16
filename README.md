<p align="center">
  <img src="assets/banner-lara-world.png" alt="Lara World Banner">
</p>
  
# 🌍 Lara World

**Lara World** é um jogo de trilha infantil para navegador, onde os jogadores percorrem um caminho de 20 casas até a linha de chegada. Feito com HTML, CSS e JavaScript puro — sem frameworks, sem backend, sem banco de dados.

## 🌐 Demo Online

👉 **Acesse a demonstração:** https://lara-world.wl-infra.uk/

⚠️ Recomendado jogar em computador ou tablet para melhor experiência.

---

## 📌 Status do Projeto

| Versão | Data | Status |
|--------|------|--------|
| **v0.36.0-preview** | Jul/2026 | ✅ **Ativo** — Preparação da Partida Premium |
| v0.35.0-preview | Jul/2026 | ✅ Question Engine |
| v0.34.0-preview | Jul/2026 | ✅ Tela de Vitória Premium |
| v0.33.0-preview | Jul/2026 | ✅ Board Alive |
| v0.32.0-preview | Jul/2026 | ✅ Eventos e Narração Visual |
| v0.31.0-preview | Jul/2026 | ✅ Sobre & Tutorial |
| v0.30.0-preview | Jul/2026 | ✅ Modo Arcade |
| v0.29.0-preview | Jul/2026 | ✅ Padronização visual dos tabuleiros |
| v0.27.0-preview | Jul/2026 | ✅ Jogo da Memória da Floresta |
| v0.17.0-preview | Jul/2026 | ✅ Correção de 3 bugs (submundo, pergunta, aleatório) |
| v0.18.0-preview | Jul/2026 | ✅ Revisão do sistema de perguntas |
| v0.16.0-preview | Jul/2026 | ✅ Concluído |
| v0.15.0-preview | Jul/2026 | ✅ Concluído |
| v0.14.0-preview | Jul/2026 | ✅ Concluído |
| v0.13.0-preview | Jul/2026 | ✅ Concluído |
| v0.12.0-preview | Jul/2026 | ✅ Concluído |
| v0.11.0-preview | Jul/2026 | ✅ Concluído |
| v0.10.0-preview | Jul/2026 | ✅ Concluído |
| v0.9.0-preview | Jul/2026 | ✅ Concluído |
| v0.8.0 | Jul/2026 | ✅ Concluído |
| v0.7.0 | Jul/2026 | ✅ Concluído |
| v0.6.0 | Jul/2026 | ✅ Concluído |
| v0.5.0 | Jul/2026 | ✅ Concluído |
| v0.4.0 | Jul/2026 | ✅ Concluído |
| v0.3.0 | Jul/2026 | ✅ Concluído |
| v0.2.0 | Jul/2026 | ✅ Concluído |
| v0.1.0 | Jul/2026 | ✅ Concluído |

---

## 🌟 Board Alive

O tabuleiro responde visualmente à partida: casas percorridas acendem uma por vez, o destino recebe um glow curto, o personagem pousa com bounce suave e o dado ganha impacto ao revelar o resultado. Casas especiais respiram discretamente, o jogador ativo recebe brilho e as barras de progresso animam avanço e retrocesso.

Cada WorldConfig também pode declarar `theme.ambientEffect`. Os cinco mundos usam efeitos leves próprios — folhas, estrelas, bolhas, poeira e brasas — sem regras específicas por mundo na engine e com desativação automática em `prefers-reduced-motion`.

---

## ✨ Eventos e Narração Visual

As ações da partida são narradas por um overlay temporário sobre o tabuleiro. Resultado do dado, movimento, casas especiais, desafios, minigames e mudanças de turno aparecem em sequência, com mensagens curtas em PT-BR. A fila bloqueia sobreposições, respeita `prefers-reduced-motion` e atualiza simultaneamente o campo **Último Evento** do HUD.

---

## ✨ Funcionalidades Atuais (v0.36.0-preview)

### Experiência inicial unificada ✅

- **Hero Screen**: ponto de entrada com acesso ao Jogo Rápido, Modo Arcade, tutorial e informações do projeto
- **Seleção de Mundo**: painel ilustrado com seis opções; Floresta, Galáxia, Oceanos e Mundo Aleatório são selecionáveis, enquanto Dinossauros e Castelo permanecem bloqueados na interface atual
- **Preparar Jogo**: seleção de modo, nomes e um dos quatro personagens oficiais — Lara, Léo, Dino ou Byte — em cards responsivos com previews e fallback para emoji
- **Quem começa?**: confronto visual entre os participantes, com rolagem manual dos jogadores, rolagem automática da Máquina no single player e feedback para empate e vencedor
- **Identidade visual consistente**: cards glass, gradientes suaves, cores rosa/azul, sombras macias e hierarquia de ações compartilhada pelas etapas
- **Acessibilidade e responsividade**: foco visível, estados disabled legíveis, diálogo anunciado, `aria-live`, movimento reduzido e adaptação para telas estreitas ou baixas
- **Regras preservadas**: maior dado inicia; depois de dois empates, o terceiro empate recebe desempate automático, sem mudança no gameplay

### Sobre & Tutorial ✅

- **Sobre o Lara World**: tela com informações do jogo, recursos atuais, em desenvolvimento e créditos — acessível pelo botão "ℹ️ Sobre" na tela inicial
- **Como Jogar**: tutorial interativo com 7 passos, indicador de progresso, navegação por teclado e mouse — acessível pelo botão "📖 Como Jogar" na tela inicial
- **Modularização**: módulos separados em `src/about/` e `src/tutorial/` com arquitetura barrel, seguindo o padrão do Arcade

### Modo Arcade ✅

- **Modo Arcade**: novo modo de jogo acessível pelo botão "🎮 Modo Arcade" na tela inicial — permite jogar qualquer minigame registrado de forma avulsa, sem precisar passar pelo tabuleiro
- **Galeria de minigames**: tela com cards para cada minigame, exibindo nome, ícone, descrição, duração e estatísticas (partidas, vitórias, derrotas, taxa de acerto, sequência máxima, tempo total)
- **Estatísticas persistentes**: dados salvos em `localStorage` (chave `lara-world-arcade-stats`) e atualizados a cada partida — schema v1 com partidas, vitorias, derrotas, sequenciaAtual, sequenciaMaxima, tempoTotalJogado
- **Card final contextual**: no Arcade, o card exibe "Voltar ao Arcade" e "Voltando ao Modo Arcade..." — sem menção ao tabuleiro, sem exibição de bônus de casas
- **Isolamento total**: Arcade não depende de estado do tabuleiro (currentPlayerIndex, players, posição, StateManager, SessionManager)
- **Reutilização do MinigameHost**: mesmo host e card de resultado usados pelo tabuleiro, com o novo parâmetro `context: 'arcade'`
- **Arquitetura modular**: 6 novos arquivos em `src/arcade/` — controller, screen, card, stats, CSS e barrel

### Padronização Visual dos Tabuleiros — v0.29.0-preview ✅

- **Ataque dos Dragões**: minigame Canvas na casa 15 do Castelo dos Dragões — defesa do castelo contra dragões que voam em direção ao castelo
- **Mecânica**: clique/toque nos dragões para destruí-los antes que alcancem o castelo
- **Duração**: 20 segundos | **Meta**: 15 dragões acertados | **Defesa**: 3 escudos
- **4 fases de dificuldade**: velocidade e quantidade de dragões simultâneos aumentam a cada 5 segundos
- **Resultado**: vitória (+3 casas, sem cascata) ou derrota (boardDelta 0, sem penalidade)
- **Bot com 55% de chance**: a máquina resolve automaticamente o minigame
- **Controles**: clique no mouse ou toque na tela (suporte mobile completo)

### Jogo da Memória da Floresta

- **Jogo da Memória da Floresta**: minigame DOM na casa 11 da Floresta Encantada — 12 cartas (6 pares com emojis de floresta), cronômetro de 30s, vitória com 4+ pares
- **Floresta Misteriosa removida**: WorldConfig, subworld, CSS e debug da antiga Área Especial removidos
- **Infraestrutura de subworlds preservada**: sistema genérico mantido para uso futuro

### Correção de 3 Bugs

#### Bug 1 — Vitória Prematura ao Sair de Submundo

- **Problema corrigido**: ao atingir o limite do tabuleiro dentro de um submundo (Floresta Misteriosa) por avanço ou acerto de desafio, o jogo declarava vitória indevidamente em vez de retornar ao mundo principal
- **Nova função `handleBoardLimitReached()`**: quando o jogador completa o submundo, ele sai automaticamente, ganha +2 casas de bônus a partir da posição de entrada e retorna ao mundo principal — sem declarar vitória prematura
- **Comportamento consistente**: alinhado com as regras de `saida-mundo` e `atalho`

#### Bug 2 — Pergunta sem Alternativa Correta

- **Problema corrigido**: a pergunta "Qual palavra tem 5 letras?" (Português, dificuldade média) tinha opções `["Gato", "Cachorro", "Bola"]` — nenhuma com 5 letras
- **Correção**: opção alterada para `["Gato", "Cachorro", "Papel"]` com resposta `"Papel"` (5 letras)
- **Validação estrutural**: nova função `validateQuestionBank()` em `src/data/questions.js` que percorre todo o banco e reporta perguntas com resposta ausente ou fora das opções — pode ser executada em `node --check` para auditoria

#### Bug 3 — Mundo Aleatório Sempre Escolhia Floresta

- **Problema corrigido**: o botão "🎲 Mundo Aleatório" sempre selecionava a Floresta Encantada por usar `getDefault()` internamente, que retorna o primeiro mundo marcado como `default`
- **Correção**: substituído por `random(w => w.type === 'main')` que sorteia igualmente entre todos os mundos principais disponíveis (Floresta, Dinossauros, Galáxia, Oceanos, Castelo)

### Limite de Empates no Sorteio Inicial

- **Problema corrigido**: o sorteio inicial permitia empates infinitos, causando repetições chatas
- **Máximo de 2 empates**: após o 3º empate consecutivo, o jogo aplica desempate automático
- **Desempate aleatório**: escolhe um jogador aleatoriamente com mensagem divertida
- **Mensagens**: "Empate cósmico! O jogo escolheu quem começa.", "Depois de tantos empates, a sorte decidiu!", "Tanto empate que o destino tomou a frente!"
- **Apenas no sorteio inicial**: o dado da partida não foi alterado

### Sistema de Perguntas Temáticas — QST-001

- **Banco expandido**: 128 perguntas em 9 categorias (Matemática, Português, Animais, Espaço, Natureza, Dinossauros, Lógica, Cores e Formas, Conhecimentos Gerais) — módulo separado em `src/data/questions.js`
- **Perguntas temáticas por mundo**:
  - 🌌 Galáxia Estelar → Espaço, Lógica, Conhecimentos Gerais
  - 🌳 Floresta Encantada → Animais, Natureza, Cores e Formas, Lógica
  - 🦕 Dinossauros → Dinossauros, Animais, Natureza, Matemática
- **Sem repetição na mesma partida**: o algoritmo evita repetir perguntas até que todo o pool seja usado
- **Fallback automático**: se o tema do mundo não tiver perguntas suficientes, usa o banco geral
- **Painel de auditoria**: modo debug (`?debug=1`) com botão "📚 Mostrar" que lista todas as perguntas por categoria, com indicador de usadas, dificuldade e mundo atual
- **Cascata corrigida**: acertar/errar desafio não dispara mais a casa destino

### Visual da Galáxia Estelar — ART-011

- **Infraestrutura visual completa**: pasta `src/assets/worlds/galaxia/` criada com suporte a `background.webp` e `path.webp`, seguindo o mesmo padrão de Floresta e Dinossauros
- **Background personalizado**: CSS do `#track-container` atualizado com overlay semitransparente + `url("assets/worlds/galaxia/background.webp")` + gradiente fallback escuro
- **Path.webp**: regra CSS existente para `body[data-world="galaxia-estelar"] .path-line` com fallback SVG stroke
- **Fallback garantido**: se os assets .webp não existirem, gradiente e SVG mantêm o visual funcional

### Sistema de Variantes de Tabuleiro (Layouts)

- **Config-driven**: cada mundo pode declarar múltiplos layouts via `board.layouts` + `board.defaultLayout` no WorldConfig, sem qualquer lógica específica de mundo no engine
- **Galáxia Estelar como primeiro adotante**: 3 layouts — ⭐ Padrão (original), 🪐 Órbita (curva orbital) e 🌀 Espiral (rotação espiral) — definidos em `src/worlds/galaxia/layouts.js`
- **Selector UI compacto**: botões com `icon + name` (sem descrição) que aparecem automaticamente no tabuleiro quando o mundo tem 2+ layouts; ocultos para mundos com layout único via `.layout-selector.hidden { display: none; }`
- **Persistência**: layout ativo salvo em `localStorage` e restaurado ao retornar ao mundo — via a chave `activeLayout` no world config
- **Integração Debug** (`?debug=1`): botões de layout na seção Galáxia do painel de debug para troca rápida entre variantes
- **Validação**: `world-registry.js` valida `board.layouts` e `board.defaultLayout` quando presentes
- **Tipagem**: typedef `LayoutEntry` em `src/core/types.js` com `id`, `name`, `icon`, `description`, `cells`

### Casa 7 — Troca Quântica (Galáxia) + Result Card do Minigame — GAL-002

- **Casa 7 — Troca Quântica**: evento `swap-positions` substitui `move -2` — jogador troca de posição com o adversário
- **Result Card sobre cenário congelado**: card glass sobre o canvas da Galáxia ao fim do MeteoroGame
- **Minigame ajustado**: tempo aumentado para 20s

### Galáxia Estelar + Minigame do Buraco de Minhoca — GAL-001

- **Mundo Galáxia**: tabuleiro temático com 20 casas, textos enxutos seguindo padrão visual (ícone + descrição curta)
- **Buraco de Minhoca (casa 15)**: casa especial que transporta para o minigame de desvio de meteoros
- **MeteoroGame 4-dir**: nave com controles 4-direcionais (↑ ↓ ← → + WASD), 3 vidas, feedback visual
- **Fluxo do Bot**: overlay com botão "Pular", auto-resolve após 6s
- **Debug**: painel expandido com controles Galáxia e minigame

### Sistema de Áudio — AUD-001

Documentação detalhada em [docs/audio.md](docs/audio.md).

- **AudioManager centralizado** — classe `AudioManager` (~218 linhas) que encapsula a Web Audio API com cadeia de ganho em cascata (`masterGain` → `musicGain` + `effectsGain`), criação lazy do `AudioContext` e tolerância total a assets ausentes
- **Catálogo de sons** (`src/audio/sounds.js`) — 16 chaves simbólicas mapeando categorias: UI (3), dados (2), tabuleiro (5), quiz (3), recompensas (2), música (1)
- **Singleton** (`src/audio/index.js`) — instância única `audioManager` exportada para todo o jogo
- **Estrutura de diretórios** — 7 pastas em `src/assets/audio/` preparadas para assets .webm (`ui/`, `dice/`, `board/`, `quiz/`, `rewards/`, `music/`)
- **21 pontos de integração** em `src/game.js` — cliques de botão, rolagem de dados, movimento, casas especiais, desafios e vitória
- **Volumes independentes** — mestre, música e efeitos com ranges 0–1, persistidos automaticamente em `localStorage`
- **Mute com persistência** — `mute()`/`unmute()`/`toggleMute()` com estado salvo entre sessões
- **Degradação graciosa** — qualquer falha de áudio (arquivo ausente, decode error, autoplay bloqueado) é silenciosamente ignorada; o jogo nunca quebra por áudio
- **API segura** — `audioManager.play('chave')` nunca lança exceções
- **5 sons registrados mas não integrados**: `modalOpen`, `modalClose`, `treasure`, `gameOver`, `backgroundMusic` — existem no catálogo mas ainda não são chamados no jogo

### Hero Screen — Redesign da Tela Inicial

- **Logo oficial** — `assets/ui/logo-lara-world.webp` substitui o antigo título emoji + gradiente, com fallback textual "Lara World" em rosa caso o asset não carregue
- **Estrutura `.menu-brand`** — container centralizado para o logo com `<img class="menu-brand-logo">` e `<span class="menu-brand-fallback">`, substituindo a antiga estrutura `.menu-logo` com emoji 🌍
- **Fundo temático** — `menu-background.webp` (opacity 0.50) sobre 7 gradientes radiais via `::before`, shapes flutuantes e sparkles animados ✦
- **Card central translúcido** — `.menu-content` com gradiente rosado/creme/azulado, `backdrop-filter: blur(24px)`, borda branca 3px, glow rosa e sombra multicamadas
- **⚡ Jogo Rápido** — card/botão principal com glow pulsante, gradiente pink escuro, sombra 3D e subtítulo descritivo
- **🏆 Modo Aventura** — card secundário desabilitado com subtítulo e badge "EM BREVE..." gradiente pink
- **Ilustração Lara removida** — o elemento decorativo sobreposto ao card foi removido para simplificar a composição
- **Decorações animadas** — formas flutuantes abstratas (`.menu-bg-shapes`) com animação `menu-float` e sparkles (`.menu-sparkles`) com animação `sparkle-drift`
- **Assets UI** — `src/assets/ui/` com `logo-lara-world.webp` (ativo), `lara-hero.webp` e `menu-background.webp`
- **Responsivo** — breakpoints ≤768px, ≤400px e viewport reduzida com escalonamento proporcional do logo e botões

### Sistema de Avatares e Tokens — UX-015

- **Galeria com 4 personagens oficiais**: Lara (🧒), Léo (🧑), Dino (🦖), Byte (💻) — cada um com asset próprio em `assets/avatars/` e `assets/tokens/`
- **Avatares oficiais** (`assets/avatars/`): cada personagem possui asset próprio para preview circular (108×108px) no setup, exibido via `<img class="avatar-img">` com `object-fit: contain` e fallback para emoji
- **Tokens in-game** (`assets/tokens/`): representação do personagem no tabuleiro, status panel, draw screen e tela de vitória — carregados via `applyVisualFallback()` com `object-fit: cover` circular e fallback para emoji
- **initGalleryTokens()**: no bootstrap, cada botão da galeria ganha `<span class="btn-emoji">` + `<img class="btn-img">`, tentando carregar `assets/tokens/{avatar}.webp` com fallback automático
- **applyVisualFallback()**: mecanismo único de fallback visual — `onload` oculta emoji e exibe imagem, `onerror` oculta imagem e exibe emoji. Reutilizado em 6 contextos: galeria, status turno, status P1/P2, tabuleiro, draw screen, vitória
- **TokenId**: novo campo `player.tokenId` populado via `data-token` do botão selecionado (ex: `"lara"` para `assets/tokens/lara.webp`)
- **Preview interativo**: `updateAvatarPreview()` altera em tempo real o emoji, nome e imagem do preview ao selecionar um personagem
- **Fallback universal**: se qualquer asset `.webp` não existir ou falhar ao carregar, o emoji correspondente aparece automaticamente — sem quebra visual

### Board Layout 2.0 — Posicionamento Personalizado

- **board.cells** — novo formato de layout que permite definir coordenadas X/Y individuais para cada célula (array `{id, x, y}`), substituindo o mapa fixo `positions`
- **Fallback automático** — mundos com `board.cells` são convertidos para o formato esperado em tempo de execução; mundos com `board.positions` (ex: Floresta Encantada) continuam funcionando sem alterações
- **🦖 Vale dos Dinossauros** — primeiro mundo a usar `board.cells`: 20 células em 4 fileiras com curva orgânica em S, deslocado +7pp para direita para melhor centralização no background

### Caminhos Temáticos (path.webp)

- **Infraestrutura CSS para path.webp** — o caminho das casas está preparado para exibir textura via `background-image` com seletores por mundo
- **Fallback SVG ativo** — enquanto os assets `.webp` não são criados, o traço SVG (5px, opacity ~0.25) mantém a trilha visível
- **Override de subworld** — áreas especiais não exibem a textura do mundo principal

### Seletor de Mundos v2 — UX-014

- **Painel remodelado** — mesmo visual da Hero Screen: fundo com 7 gradientes radiais + `menu-background.webp` (opacity 0.60), shapes flutuantes e sparkles animados
- **Card central glass** — gradiente rosado/creme/azulado com `backdrop-filter: blur(24px)`, borda branca 3px, glow rosa e sombra profunda
- **Subtítulo discreto** — "Cada mundo guarda uma aventura diferente." abaixo do título
- **Cards maiores e mais arredondados** — 24px border-radius, padding 16px, sombra suave, hover com elevação e glow colorido
- **Identidade por mundo** — cada card recebe cor de borda própria via `data-world`: Floresta (verde), Dinossauros (âmbar), Galáxia (roxo), Oceanos (azul), Castelo (lilás)
- **Mundo Aleatório em destaque** — glow pulsante roxo (`random-glow` 3s), gradiente mágico, sem exageros
- **Mundos bloqueados elegantes** — mantêm identidade de cor com opacidade 0.75, sem grayscale — parecem mundos futuros, não itens desabilitados
- **Botão "← Menu Principal" premium** — gradiente pink-dourado com sombra 3D, hover sobre 3px, active afunda — mesmo estilo do Jogo Rápido
- **Lara removida** — a personagem permanece exclusiva da Hero Screen para não poluir a tela de seleção
- **Totalmente responsivo** — breakpoints ≤600px e ≤400px com ajuste de padding, tamanho dos cards e grid

### Ilustrações Oficiais dos Mundos — ART-009

- **Preparação para ilustrações próprias** — cada card de mundo possui container dedicado de 96×96px para futura ilustração
- **Fallback de emoji** — enquanto as ilustrações não são criadas, os emojis continuam sendo exibidos automaticamente via `onerror="this.style.display='none'"`
- **Ilustrações previstas** em `src/assets/world-icons/`: `floresta.webp`, `dinossauros.webp`, `galaxia.webp`, `oceanos.webp`, `castelo.webp`, `aleatorio.webp`
- **Mesmo padrão artístico da Lara** — todas as ilustrações futuras deverão seguir a identidade visual da protagonista
- **Troca automática** — quando o asset for criado na pasta, a imagem carrega e substitui o emoji sem qualquer alteração de código

### Seletor de Mundos

- **Tela de seleção de mundo** — após clicar em "⚡ Jogo Rápido", 6 cards de mundos são exibidos (Floresta, Dinossauros, Galáxia, Oceanos, Castelo e Aleatório)
- **🌳 Floresta Encantada** — mundo com 20 casas, desafios educativos e Jogo da Memória na casa 11
- **🧠 Jogo da Memória da Floresta** — minigame DOM com 12 cartas (6 pares), 30s de tempo, vitória com 4+ pares. Acessado pela casa 11, modal "Entrar" ou "Continuar"
- **🏃 Dino Runner (casa 10)** — minigame Canvas onde o dinossauro corre automaticamente e o jogador pula (Espaço/Up/Clique) para desviar de obstáculos. Vitória = sobreviver 30s; derrota = colisão. Substitui a antiga Caverna dos Fósseis
- **Mundo Aleatório** — seleciona um mundo aleatório entre os disponíveis
- **Estados atuais dos mundos** — Floresta, Galáxia e Oceanos estão disponíveis; Dinossauros e Castelo aparecem bloqueados; Mundo Aleatório permanece selecionável

### Hero Screen (Tela Inicial)

- **Tela de abertura com branding próprio** — ao abrir o jogo, um menu principal com logo oficial, card central glass e botões é exibido
- **Logo oficial** — asset `assets/ui/logo-lara-world.webp` exibido via `<img class="menu-brand-logo">` dentro de `.menu-brand`, com fallback textual "Lara World" via `onerror`
- **Fundo temático** — 7 gradientes radiais + `menu-background.webp` (opacity 0.50) via `::before`, shapes flutuantes e sparkles animados
- **Card central translúcido** — `.menu-content` com gradiente rosado/creme/azulado, `backdrop-filter: blur(24px)`, borda branca 3px, glow rosa e sombra multicamadas
- **⚡ Jogo Rápido** — card/botão principal com glow pulsante, gradiente pink escuro, sombra 3D e subtítulo "Partida rápida e divertida"
- **🏆 Modo Aventura** — card secundário desabilitado com subtítulo "Novos mundos aguardam você!" e badge "EM BREVE..."
- **Decorações CSS** — formas flutuantes abstratas (`.menu-bg-shapes`) e sparkles animados (`✦`)
- **Rodapé** — versão lida de `APP_VERSION` (src/version.js) exibida na parte inferior

### Modo Single Player (Humano vs Máquina)

- **Seletor de modo** — ao abrir o modal de configuração, escolha entre "👥 2 Jogadores" ou "👤 1 Jogador"
- **Modo 1 Jogador** — você controla o Jogador 1; o Jogador 2 é controlado pela máquina (🤖)
- **Configuração simplificada** — no modo 1 jogador, apenas o nome e sprite do Jogador 1 são solicitados
- **Bot automático** — a máquina joga sozinha após 1 segundo de espera, com jogada completa (dado, movimento, casas especiais)
- **Desafios do bot** — o bot responde desafios educativos com 60% de chance de acerto
- **Jogo da Memória do bot** — o bot resolve automaticamente o Jogo da Memória com 65% de chance de vitória
- **Alternância automática** — os turnos alternam normalmente entre humano e máquina

### Tela de Vitória

- **Overlay de vitória** — ao vencer, uma tela com confetes animados, fogos serpentina e troféu é exibida
- **Mensagem personalizada** — exibe o nome e emoji do jogador vencedor
- **Botão "🔁 Jogar Novamente"** — reinicia a partida no mesmo modo (Jogo Rápido mantém single player)
- **Botão "🏠 Voltar ao Menu"** — retorna ao menu inicial para escolher outro modo

### Sistema de Mundos e Minigames

- **Cinco mundos jogáveis** — 🌳 Floresta Encantada, 🦖 Vale dos Dinossauros, 🌌 Galáxia Estelar, 🌊 Reino dos Oceanos e 🐉 Castelo dos Dragões, cada um com 20 casas e eventos próprios
- **Minigames** — eventos especiais que lançam jogos internos:
  - 🧠 **Jogo da Memória da Floresta** (Floresta, casa 11) — encontre 4+ pares de cartas em 30s
  - 🌌 **MeteoroGame** (Galáxia, casa 15) — desvie de meteoros por 60s com nave 4-dir
  - 🏃 **Dino Runner** (Dinossauros, casa 10) — corra com o dino por 30s pulando obstáculos
- **Portal** — casa específica que abre modal perguntando se deseja entrar na Área Especial
- **Modal de entrada** — ao cair na casa do portal, um modal oferece "Entrar" ou "Continuar"
- **Jogador ativo na área especial** — apenas o jogador que entrou joga na área
- **Outro jogador oculto** — o sprite do outro jogador não aparece no tabuleiro da área
- **Turno bloqueado** — o turno não alterna enquanto o jogador estiver na área especial
- **Casas especiais próprias** — cada área define seus próprios eventos (desafios, atalhos, saída)
- **Posição salva por jogador** — cada jogador tem sua própria posição de entrada na área
- **Retorno parametrizado** — ao sair, o jogador avança `bonusCells` (definido no WorldConfig) a partir da posição de entrada
- **Retorno sem cascata** — ao voltar ao mundo principal, o bônus não dispara outras casas especiais
- **Modo debug** — ativado por `?debug=1` na URL, exibe painel com botões para teste rápido de cada área
- **Portal genérico** — a engine não conhece nomes de mundos ou áreas; toda navegação é baseada em configuração (`targetWorldId`, `bonusCells`, etc.)

---

## 🎨 Identidade Visual

Iniciada na **v0.11.0-preview** e expandida na **v0.12.0-preview**, a fase de identidade visual estabeleceu a pipeline de produção artística baseada em assets separados por mundo, assets da Hero Screen (`src/assets/ui/`) e assets de personagens oficiais (`src/assets/avatars/` e `src/assets/tokens/`).

### Estrutura de Assets

```
src/assets/
├── ui/
│   ├── logo-lara-world.webp # Logo oficial do Lara World — exibido na Hero Screen ✅
│   ├── lara-hero.webp       # Ilustração da personagem Lara (asset criado, não utilizado na Hero Screen atual)
│   └── menu-background.webp # Fundo temático do menu principal ✅
├── audio/               # Assets de áudio (.webm)
│   ├── ui/              # Sons de interface (cliques, modais)
│   ├── dice/            # Sons de dados (rolar, resultado)
│   ├── board/           # Sons do tabuleiro (movimento, portais)
│   ├── quiz/            # Sons de desafios (perguntas, acerto/erro)
│   ├── rewards/         # Sons de recompensa (vitória, game over)
│   └── music/           # Músicas de fundo (loop)
├── avatars/
│   ├── lara.webp            # Avatar da Lara — preview circular no setup ✅
│   ├── leo.webp             # Avatar do Léo — preview circular no setup ✅
│   ├── dino.webp            # Avatar do Dino — preview circular no setup ✅
│   └── byte.webp            # Avatar do Byte — preview circular no setup ✅
├── tokens/
│   ├── lara.webp            # Token da Lara — representação in-game circular ✅
│   ├── leo.webp             # Token do Léo — in-game ✅
│   ├── dino.webp            # Token do Dino — in-game ✅
│   └── byte.webp            # Token do Byte — in-game ✅
├── world-icons/
│   ├── floresta.webp        # Ilustração oficial do mundo Floresta Encantada ✅
│   ├── dinossauros.webp     # Ilustração oficial do mundo Vale dos Dinossauros ✅
│   ├── galaxia.webp         # Ilustração oficial do mundo Galáxia Estelar ✅
│   ├── oceanos.webp         # Ilustração oficial do mundo Reino dos Oceanos ✅
│   ├── castelo.webp         # Ilustração oficial do mundo Castelo dos Dragões ✅
│   └── aleatorio.webp       # Ilustração oficial do Mundo Aleatório ✅
└── worlds/
    ├── floresta/
    │   ├── background.webp   # Background ilustrado do tabuleiro (asset pendente)
    │   └── path.webp          # Textura do caminho (asset pendente)
    ├── dinossauros/
    │   ├── background.webp   # Background ilustrado do tabuleiro (asset pendente)
    │   └── path.webp          # Textura do caminho (asset pendente)
    ├── galaxia/
    │   ├── background.webp   # Background ilustrado do tabuleiro (asset pendente)
    │   └── path.webp          # Textura do caminho (asset pendente)
    ├── oceanos/
    │   ├── background.webp   # Background ilustrado do tabuleiro (asset pendente)
    │   └── path.webp          # Textura do caminho (asset pendente)
    └── castelo/
        ├── background.webp   # Background ilustrado do tabuleiro (asset pendente)
        └── path.webp          # Textura do caminho (asset pendente)
```

### Princípios

- Cada mundo possui seu próprio conjunto de assets visuais
- Assets são aplicados apenas na área do tabuleiro (`#track-container`)
- O fundo geral da aplicação permanece com gradiente neutro (não recebe ilustração)
- Fallback visual garantido: se o asset não existir, o jogo continua com o estilo CSS atual
- Fallback visual para personagens: `applyVisualFallback()` tenta carregar token `.webp`; se falha, exibe emoji
- Avatares (`assets/avatars/`) são para preview no setup (108×108, `object-fit: contain`)
- Tokens (`assets/tokens/`) são para representação in-game (62×62, `object-fit: cover`)
- Sistema preparado para expansão para novos mundos

### Status Atual

| Asset | Mundo/Contexto | Status |
|-------|----------------|--------|
| `logo-lara-world.webp` | Hero Screen (UI) | ✅ Concluído — Logo oficial, 92KB, exibido via `<img class="menu-brand-logo">` no `.menu-brand` |
| `lara-hero.webp` | Hero Screen (UI) | ✅ Concluído — Ilustração Lara 181KB (não utilizada na Hero Screen atual) |
| `menu-background.webp` | Hero Screen (UI) | ✅ Concluído — Fundo temático 99KB, exibido via `.main-menu::before` |
| `lara.webp` | Avatar oficial (avatar) | ✅ Concluído — 512×512, 86.9% altura, centralizado |
| `lara.webp` | Token oficial (token) | ✅ Concluído — 512×512, 86.9% altura, object-fit cover |
| `leo.webp` | Avatar/token (personagem) | ✅ Concluído — Asset existente |
| `dino.webp` | Avatar/token (personagem) | ✅ Concluído — Asset existente |
| `byte.webp` | Avatar/token (personagem) | ✅ Concluído — Asset existente |
| `floresta.webp` | Floresta Encantada (world-icon) | ✅ Concluído — Ilustração oficial |
| `dinossauros.webp` | Vale dos Dinossauros (world-icon) | ✅ Concluído — Ilustração oficial |
| `galaxia.webp` | Galáxia Estelar (world-icon) | ✅ Concluído — Ilustração oficial |
| `oceanos.webp` | Reino dos Oceanos (world-icon) | ✅ Concluído — Ilustração oficial |
| `castelo.webp` | Castelo dos Dragões (world-icon) | ✅ Concluído — Ilustração oficial |
| `aleatorio.webp` | Mundo Aleatório (world-icon) | ✅ Concluído — Ilustração oficial |
| `background.webp` | Floresta Encantada | ✅ Infraestrutura concluída — CSS e overlay prontos (asset pendente de criação por IA) |
| `path.webp` | Floresta Encantada | ✅ Infraestrutura concluída — CSS via `background-image` + SVG stroke como fallback (asset pendente) |
| `background.webp` | Vale dos Dinossauros | ✅ Infraestrutura concluída — CSS e overlay prontos (asset pendente de criação por IA) |
| `path.webp` | Vale dos Dinossauros | ✅ Infraestrutura concluída — CSS via `background-image` + SVG stroke como fallback (asset pendente) |
| `background.webp` | Galáxia Estelar | ✅ Infraestrutura concluída — CSS e overlay prontos (asset pendente de criação por IA) |
| `path.webp` | Galáxia Estelar | ✅ Infraestrutura concluída — CSS via `background-image` + SVG stroke como fallback (asset pendente) |
| `background.webp` | Reino dos Oceanos | ✅ Infraestrutura concluída — CSS e overlay prontos (asset pendente de criação por IA) |
| `path.webp` | Reino dos Oceanos | ✅ Infraestrutura concluída — CSS via `background-image` + SVG stroke como fallback (asset pendente) |
| `background.webp` | Castelo dos Dragões | ✅ Infraestrutura concluída — CSS e overlay prontos (asset pendente de criação por IA) |
| `path.webp` | Castelo dos Dragões | ✅ Infraestrutura concluída — CSS via `background-image` + SVG stroke como fallback (asset pendente) |

### Decisões de UX Aprovadas

- ✓ O cenário é aplicado apenas dentro da área do tabuleiro (`#track-container`)
- ✓ O fundo da aplicação permanece neutro (gradiente multi-radial)
- ✓ O centro do cenário permanece livre para o tabuleiro
- ✓ Elementos principais da arte concentrados nas bordas
- ✓ Cada mundo possui identidade visual própria
- ✓ Caminhos temáticos são tratados como camada independente

### Descobertas dos Testes

- Backgrounds muito carregados prejudicam a leitura do tabuleiro
- O cenário não deve competir com as casas e jogadores
- Grandes elementos visuais devem permanecer nas laterais
- O caminho atual (SVG stroke + background-image preparado) refinado para 5px com opacity ~0.25, deixando o traço leve enquanto aguarda textura definitiva (path.webp)
- Antigos elementos decorativos do HTML removidos na ART-004
- O posicionamento do tabuleiro pode variar por mundo — `board.cells` permite ajuste individual por célula

---

## 🚀 Fluxo de entrada

```text
Hero Screen
  ↓
Seleção de Mundo
  ↓
Preparar Jogo
  ↓
Quem começa?
  ↓
Partida
```

No Jogo Rápido, a seleção define o mundo; “Preparar Jogo” configura modo, nomes e personagens; “Quem começa?” determina o primeiro turno. O Modo Arcade continua seguindo seu fluxo independente, direto para a galeria de minigames.

## 📸 Screenshots

### 🏠 Hero Screen

![Hero Screen do Lara World](assets/screenshot-menu.png)

### 🌍 Mundo Principal

![Mundo Principal](assets/screenshot-mundo-principal.png)

### 🌿 Mundo da Floresta

![Mundo da Floresta](assets/screenshot-floresta.png)

### 📚 Desafios Educativos

![Desafios Educativos](assets/screenshot-desafios.png)

---

### Funcionalidades Anteriores

- **Banco de questões** — 30 perguntas organizadas em 6 categorias (Matemática, Português, Animais, Espaço, Natureza, Dinossauros)
- **Sorteio aleatório** — a pergunta exibida é sorteada do banco, não fixa por casa
- **Sem repetição na partida** — o jogo evita repetir a mesma pergunta até que todas sejam usadas
- **Reinício automático do banco** — quando todas as perguntas forem utilizadas, o ciclo recomeça
- **5 casas de desafio educativo** no mundo principal (casa 4, 7, 12, 16, 18)
- **Modal de desafio** — ao cair em uma casa de desafio, um modal com pergunta e 3 alternativas é exibido
- **Acerto/erro com movimento** — resposta correta: avança 1 casa; resposta errada: volta 1 casa
- **Bloqueio do dado durante desafio** — o botão "Jogar Dado" permanece desabilitado até o desafio ser respondido
- **Prevenção de loop infinito** — o movimento pós-desafio não cascateia para outras casas especiais
- **Modal de configuração inicial** — tela de setup com nome e sprite para cada jogador antes da partida
- **Nomes personalizados** — Jogador 1 e Jogador 2 com campos de texto editáveis
- **Sprites independentes** — grade de emojis exclusiva para cada jogador, sem compartilhamento de estado
- **Inicialização pelo modal** — o tabuleiro só é carregado após clicar em "Iniciar Jogo"
- **Reinício retorna ao modal** — ao reiniciar, o jogador pode alterar nomes e sprites novamente
- **Tabuleiro visual em trilha** — 20 casas posicionadas em snake pattern com caminho SVG suave
- **Movimento animado** — personagens andam casa por casa com animação pulse (180ms/passo)
- **Sistema de dado** — dado virtual 1-6 com animação de rolagem (bounce)
- **12 casas especiais no mundo principal** com efeitos automáticos:
  - Casa 3 → Avance 2 casas
  - Casa 4 → Desafio educativo
  - Casa 5 → Volte 1 casa
  - Casa 7 → Desafio educativo
  - Casa 8 → Jogue novamente
  - Casa 10 → Perde uma rodada
  - **Casa 11 → 🧠 Jogo da Memória da Floresta**
  - Casa 12 → Desafio educativo
  - Casa 15 → Volte ao início
  - Casa 16 → Desafio educativo
  - Casa 18 → Desafio educativo
  - Casa 20 → Vitória
- **Multiplayer local** — 2 jogadores no mesmo dispositivo
- **Alternância automática de turnos** — após cada jogada, o turno passa para o próximo jogador
- **Destaque visual do jogador ativo** — indicador de turno no painel
- **Histórico de jogadas** — registro cronológico de todas as ações
- **Sistema de vitória** — o primeiro a chegar ou ultrapassar a casa 20 vence
- **Design responsivo** — adaptado para desktop e notebook
- **Docker + Nginx** — ambiente conteinerizado para deploy

---

## 🎮 Como Jogar

### Configuração Inicial

1. Abra o jogo no navegador — a **Tela Inicial** é exibida com o título Lara World.
2. Clique em **"⚡ Jogo Rápido"** para iniciar uma partida single player.
3. O **modal de configuração** é exibido para definir nome e sprite do Jogador 1.
4. Clique em **"Iniciar Jogo"** para começar a partida.

### Modo 2 Jogadores (Multiplayer)

1. O jogo inicia com o **Jogador 1** (configurado no modal).
2. Clique em **"Jogar Dado"** para lançar o dado.
3. O personagem avança o número de casas sorteado — andando casa por casa com animação.
4. Casas especiais podem fazer você avançar, voltar, perder rodadas, jogar novamente ou **responder a um desafio educativo** (casas 4, 7, 12, 16, 18).
5. Ao cair em uma casa de desafio, um modal com pergunta sorteada do **Banco de Questões** (6 categorias, 30 perguntas) aparece. Acertar = avança 1 casa; errar = volta 1 casa. O jogo evita repetir perguntas na mesma partida.
6. Após cada jogada, o turno alterna automaticamente para o outro jogador.
7. Se os dois jogadores estiverem na mesma casa, os personagens aparecem lado a lado.
8. **O primeiro a atingir ou ultrapassar a casa 20 vence** a partida.
9. Para uma nova partida, clique em **"Reiniciar"** — o modal de configuração reaparece para ajustar nomes e sprites.

### Modo 1 Jogador (Humano vs Máquina)

1. O jogo inicia com o **Jogador 1** (você) no turno.
2. Clique em **"Jogar Dado"** para lançar o dado — seu personagem avança e ativa casas especiais.
3. Após sua jogada, o turno alterna para a **Máquina** (🤖), que joga automaticamente após 1 segundo.
4. A máquina realiza a jogada completa: dado, movimento, casas especiais, desafios e portal.
5. **Desafios da máquina**: o bot responde com 60% de chance de acerto — sem modal, resolvido em 600ms.
6. **Jogo da Memória da máquina**: o bot resolve automaticamente em ~6s com 65% de chance de vitória.
7. Os turnos alternam entre você e a máquina até alguém atingir a **casa 20**.
8. Para uma nova partida, clique em **"Reiniciar"** — o modal de configuração reaparece.

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Função |
|------------|--------|--------|
| HTML5 | — | Estrutura da página |
| CSS3 | — | Estilização, layout flex, animações |
| JavaScript | ES6+ | Lógica do jogo (IIFE, async/await, Promises) |
| Nginx | alpine | Servidor web para deploy |
| Docker | — | Conteinerização |

---

## 📜 História do Projeto

O Lara World começou como um MVP de tabuleiro simples para 1 jogador e evoluiu para multiplayer local, mundos configuráveis, minigames, Question Engine, Modo Arcade e uma identidade visual própria. A versão atual, **v0.36.0-preview**, consolida a experiência inicial em cinco etapas — Hero Screen, Seleção de Mundo, Preparar Jogo, Quem começa? e Partida — sem alterar as regras do tabuleiro. Consulte o [Changelog](CHANGELOG.md) para o histórico completo e o [Guia de Estilo](docs/ui-style-guide.md) para as diretrizes visuais oficiais.

---

## 🚀 Desenvolvimento Local

> ⚠️ A partir da Sprint A5.1 (`v0.9.0-preview`) o `game.js` foi migrado de um script global para **ES Module** (`<script type="module">`).
> Por segurança, navegadores bloqueiam módulos ES quando a página é aberta pelo protocolo `file://`.
> **É obrigatório usar um servidor HTTP local.**

### Opção 1 — Servidor local (Python)

```bash
cd src
python3 -m http.server 8000
```

Acesse: http://localhost:8000

### Opção 2 — Servidor local (Node.js)

```bash
cd src && npx serve .
```

Acesse: http://localhost:3000

---

## 🐳 Como Executar com Docker

### Pré-requisitos

- Docker
- Docker Compose

### Passos

```bash
# Clone o repositório
git clone https://github.com/wellingtonhzt/lara-world-game.git
cd lara-world

# Build e execução
docker compose up -d
```

Acesse: http://localhost:8080

### Parar o container

```bash
docker compose down
```

---

## 🗺️ Roadmap

- **v0.36.0-preview** — ✅ **Ativo** — Preparação da Partida Premium
- **v0.35.0-preview** — ✅ Question Engine
- **v0.34.0-preview** — ✅ Tela de Vitória Premium
- **v0.33.0-preview** — ✅ Board Alive
- **v0.32.0-preview** — ✅ Eventos e Narração Visual
- **v0.31.0-preview** — ✅ Sobre & Tutorial
- **v0.30.0-preview** — ✅ Modo Arcade
- **v0.29.0-preview** — ✅ Padronização visual dos tabuleiros
- **v0.28.0-preview** — ✅ Ataque dos Dragões
- **v0.26.0-preview** — ✅ Versão oficial consolidada
- **v0.16.0-preview** — ✅ Concluído — Visual da Galáxia Estelar (ART-011) + Sistema de Variantes de Tabuleiro (Layouts)
- **v0.15.0-preview** — ✅ Concluído — Troca Quântica (GAL-002): Casa 7 swap-positions + result card do minigame
- **v0.14.0-preview** — ✅ Concluído — Galáxia Estelar + MeteoroGame (GAL-001)
- **v0.13.0-preview** — ✅ Concluído — Infraestrutura de Áudio (AUD-001)
- **v0.12.0-preview** — ✅ Concluído — Board Layout 2.0, path.webp, Hero Screen, Seleção de Mundos v2, Avatares/Tokens
- **v0.11.0-preview** — ✅ Concluído — Evolução Visual (UX 2.0)
- **v0.10.0-preview** — ✅ Concluído — Vale dos Dinossauros (Caverna dos Fósseis adicionada, removida no Dino Runner)

Veja o [roadmap completo](docs/roadmap.md).

---

## 🤖 Desenvolvimento Assistido por IA

Este projeto segue o processo definido em [docs/AI_WORKFLOW.md](docs/AI_WORKFLOW.md), que estabelece um fluxo obrigatório de implementação, validação, documentação e memorial técnico para toda evolução futura.

---

## 📄 Licença

Este projeto é open source e está sob a licença MIT.
