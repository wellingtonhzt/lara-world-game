# Guia de Estilo — Lara World

## Identidade Visual Oficial

Este documento define as diretrizes visuais do Lara World. Todo novo asset, tela ou componente deve seguir estas regras.

---

## 1. Estilo Geral

| Atributo | Valor |
|----------|-------|
| **Estilo** | Cartoon infantil premium |
| **Cores** | Vibrantes, saturadas, com gradientes suaves |
| **Iluminação** | Suave, sem sombras duras ou realismo |
| **Formas** | Arredondadas, amigáveis, sem cantos vivos |
| **Aparência** | Acolhedora, lúdica, infantil |
| **Realismo** | Proibido — todo visual deve ser estilizado |

## 2. Paleta de Cores

### Primárias
- **Rosa Lara** — `#e91e63` (botões, destques, glow)
- **Dourado** — `#ff8f00` a `#ffd54f` (gradientes, logos)
- **Branco** — `#ffffff` (bordas, cards, texto)

### Secundárias
- **Rosa claro** — `#fce4ec` (fundos, gradientes)
- **Creme** — `#fff3e0` (fundos, painéis)
- **Azul bebê** — `#e3f2fd` (fundos, variação)
- **Verde menta** — `#e8f5e9` (fundos, natureza)

### Identidade dos Mundos
| Mundo | Cor | Hex |
|-------|-----|-----|
| Floresta Encantada | Verde | `#66bb6a` |
| Vale dos Dinossauros | Âmbar | `#ffb300` |
| Galáxia Estelar | Roxo | `#b388ff` |
| Reino dos Oceanos | Azul | `#64b5f6` |
| Castelo dos Dragões | Lilás | `#ce93d8` |
| Mundo Aleatório | Mágico (rosa→roxo) | `#e91e63` → `#9c27b0` |

## 3. Tipografia

- **Títulos**: Negrito (700–800), gradiente pink-dourado, `background-clip: text`
- **Corpo**: Peso 400–500, cor `#4a3520` (marrom suave) ou `#8d6e63`
- **Subtítulos**: Peso 500, tamanho 0.95rem, cor discreta
- **Fonte**: Padrão do sistema (`font-family: inherit` / sans-serif)

## 4. Interface

### Painéis e Cards
- **Glassmorphism**: `backdrop-filter: blur(24px)` com fundo semi-transparente
- **Bordas**: 3px sólida `rgba(255, 255, 255, 0.8)`
- **Border-radius**: 48px–56px (painéis grandes), 24px (cards), 30px (botões)
- **Sombras**: Múltiplas camadas — glow rosa, sombra de profundidade, inset highlight
- **Fundo**: Gradiente suave rosado/creme/azulado com `rgba`

### Botões
- **Grandes**, arredondados, com sombra 3D (`box-shadow` com offset Y)
- **Gradiente**: pink → dourado para ações principais
- **Hover**: Elevação (`translateY(-3px)`) com glow intensificado
- **Active**: Afundamento (`translateY(2px)`) com sombra reduzida
- **Subtítulo**: Texto menor abaixo do título do botão
- **Glow pulsante**: `animation` em `box-shadow` para botões de destaque

### Navegação
- Botão "← Menu Principal" com gradiente e sombra 3D (mesmo padrão dos botões da Hero Screen)
- Hover com elevação, active com afundamento

### Galeria de Seleção (Setup)
- Grade com 4 personagens oficiais: Lara (🧒), Léo (🧑), Dino (🦖), Byte (💻)
- **Preview circular**: `.avatar-frame` 108×108px com `border-radius: 50%`, box-shadow colorido por jogador (rosa P1, azul P2)
- **Avatar-img**: `object-fit: contain` para mostrar o asset completo sem cortes
- **Avatar-emoji**: fallback de 3.6rem, oculto quando o asset carrega
- **Botões**: 40×40px, `border-radius: 12px`, hover scale 1.12 com cor do jogador, selected com gradiente e glow
- **Seção de avatares**: grade única com 4 personagens oficiais (a antiga seção "Emojis clássicos" foi removida)
- **Token nos botões**: cada botão exibe o token asset (object-fit cover circular) via `initGalleryTokens()` com fallback para emoji
- **Regra**: a galeria nunca deve mostrar broken image — sempre cai para emoji

### Botão Flutuante Mobile (Jogar Dado)
- **Posição**: `position: fixed`, `bottom: 24px`, centralizado horizontalmente, `z-index: 100`
- **Visibilidade**: aparece apenas em `@media (max-width: 840px)` durante partidas ativas (`.game-active` no `#app`)
- **Visual**: gradiente `linear-gradient(135deg, #ff6b35, #d63031)`, borda branca 2px, sombra 3D, border-radius 16px
- **Tamanho**: padding 14px 32px, fonte 1.1rem bold, gap 8px com ícone 🎲
- **Estado disabled**: `opacity: 0.45`, `pointer-events: none` (sincronizado via `MutationObserver`)
- **Focus-visible**: outline laranja 3px para acessibilidade por teclado
- **Safe area**: `env(safe-area-inset-bottom)` para celulares com notch
- **Motion**: `prefers-reduced-motion: reduce` desativa todas as transições e animações

## 5. Personagens

### Lara (Protagonista)
| Atributo | Descrição |
|----------|-----------|
| **Idade** | Aproximadamente 8 anos |
| **Cabelo** | Longo e cacheado |
| **Pele** | Morena clara |
| **Olhos** | Castanhos |
| **Roupa** | Rosa (tom vibrante) |
| **Estilo** | Cartoon infantil premium |
| **Função** | Guia do jogador, mascote do jogo |

- Lara apareceva exclusivamente na **Hero Screen** (tela inicial) da versão anterior; na versão atual, a Hero Screen utiliza o logo oficial e a ilustração da Lara foi removida do card central
- Não deve ser replicada em outras telas para evitar poluição visual
- Todos os personagens e ilustrações do jogo devem seguir o mesmo padrão artístico

### Personagens Oficiais
| Personagem | ID | Emoji | Descrição |
|------------|----|-------|-----------|
| **Lara** | `lara` | 🧒 | Protagonista, guia do jogador |
| **Léo** | `leo` | 🧑 | Amigo, segundo personagem |
| **Dino** | `dino` | 🦖 | Personagem temático de dinossauro |
| **Byte** | `byte` | 💻 | Personagem temático de tecnologia |

- Cada personagem oficial possui dois assets: `assets/avatars/<id>.webp` (preview, object-fit contain) e `assets/tokens/<id>.webp` (in-game, object-fit cover circular)
- O emoji original serve como fallback universal para ambos os assets

## 6. Assets

### Estrutura de Diretórios

```
src/assets/
├── audio/          # Assets de áudio (.webm) — ver docs/audio.md
├── ui/             # Assets da Hero Screen
│   ├── logo-lara-world.webp    # Logo oficial (ativo)
│   ├── lara-hero.webp          # Ilustração Lara (não utilizado atualmente)
│   └── menu-background.webp    # Fundo temático (ativo)
├── avatars/        # Avatares oficiais — preview circular no setup (108×108px)
├── tokens/         # Tokens oficiais — representação in-game (62×62px circular)
├── world-icons/    # Ilustrações oficiais dos mundos (96×96px) — 6 assets concluídos
└── worlds/         # Backgrounds e texturas por mundo
```

### Regras
- Todos os assets devem seguir o estilo da Lara (cartoon infantil premium)
- Misturar estilos diferentes **não é permitido**
- Cada mundo possui seu próprio conjunto de assets visuais com identidade de cor única
- Fallback visual obrigatório: se o asset não existir, o jogo deve continuar funcional com CSS
- Assets devem ser preparados em formato `.webp` para performance
- Ilustrações dos mundos devem ser 96×96px (ou proporcionais)
- Avatares (setup preview) devem ser 108×108px (ou proporcionais em canvas 512×512), com `object-fit: contain`
- Tokens (in-game) devem ser 62×62px (ou proporcionais em canvas 512×512), com `object-fit: cover` circular
- Personagens oficiais devem ter ambos os assets: avatar (`assets/avatars/<id>.webp`) e token (`assets/tokens/<id>.webp`)
- O emoji original serve como fallback universal — o jogo nunca deve exibir broken image

## 7. Exemplos de Consistência Visual

| Tela | Elementos-chave |
|------|-----------------|
| **Hero Screen** | Card glass central, logo oficial (menu-brand-logo), fundo gradiente radial + menu-background.webp + shapes, botões com glow |
| **Seleção de Mundos** | Mesmo fundo da Hero Screen, card glass, cards com identidade por mundo, botão premium |
| **Tabuleiro** | Background por mundo, células arredondadas, caminho SVG suave, painel lateral com glass |

## 8. Diretrizes de Implementação

- **HTML + CSS + JS puro** — sem frameworks
- **Zero dependências externas** — sem bibliotecas de UI
- **Glassmorphism** via `backdrop-filter` com fallback gradiente
- **Cores vibrantes** via gradientes CSS (`linear-gradient`, `radial-gradient`)
- **Animações** via `@keyframes` e `transition` — sem bibliotecas
- **Responsivo** breakpoints em ≤840px, ≤600px, ≤400px
- **Contraste forte** para legibilidade infantil (texto escuro sobre fundo claro)

---

*Documento criado na Sprint UX-014 + ART-009 — v0.12.0-preview | Atualizado na UX-015 + ART-010*
