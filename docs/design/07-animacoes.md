# Animações do Lara World

## 1. Filosofia de Animação

- **Suave sobre abrupto**: todas as transições devem ser animadas com easing (preferencialmente `ease-out`)
- **Rápido sobre demorado**: animações entre 150ms e 400ms — crianças perdem o interesse rapidamente
- **Feedback sobre decoração**: toda animação deve comunicar algo (ação concluída, transição, estado)
- **Leve sobre pesado**: sem animações que consomem GPU excessivamente (evitar 3D, partículas complexas)
- **Acessível**: usuários com `prefers-reduced-motion` devem ver versões estáticas ou simplificadas

## 2. Catálogo de Animações

### 2.1 Jogador Andando

| Propriedade | Descrição |
|---|---|
| **Gatilho** | Jogador clica "Jogar Dado" → resultado sorteado → movimento inicia |
| **Duração** | 180ms por casa (total: 180ms–1080ms para 1-6 casas) |
| **Efeito** | Personagem "pula" levemente entre casas (pequeno arco vertical) com passo animado |
| **Easing** | `ease-in-out` para cada passo |
| **Som** | Passo leve (tap ou plim) a cada casa |
| **Reduced motion** | Teleporte instantâneo para a casa de destino |

**Descrição detalhada:**
O personagem se move casa por casa. Em cada passo, ele dá um pequeno salto (10-15px para cima) e aterrissa na casa seguinte. Uma trilha de poeira ou brilho pode seguir o personagem. O movimento é interpolado linearmente entre as posições.

### 2.2 Dado

| Propriedade | Descrição |
|---|---|
| **Gatilho** | Clique em "Jogar Dado" |
| **Duração** | 800ms–1200ms |
| **Efeito** | O dado "gira" trocando rapidamente entre valores 1-6, com leve rotação 3D (scaleX oscilando), e para no valor sorteado com um "pulo" final |
| **Easing** | `ease-out` para a parada final |
| **Som** | Chocalho de dado (3-4 cliques secos) + "thud" ao parar |
| **Reduced motion** | Mostrar valor final com fade-in de 300ms |

**Descrição detalhada:**
O emoji do dado (ou ilustração) escala de 0.8→1.2→1 em 200ms (bounce inicial), depois troca de valor a cada 80ms durante 600ms (cíclico 1→2→3→4→5→6). Nos últimos 200ms, a troca desacelera até parar no valor final com um scale(1.3→1) de "impacto".

### 2.3 Portal

| Propriedade | Descrição |
|---|---|
| **Gatilho** | Jogador clica "Entrar" no modal do portal |
| **Duração** | 800ms (entrada), 600ms (saída) |
| **Efeito** | Tela "suga" para o centro (scale→0) com swirl, abre no novo mundo (scale 0→1) com brilho |
| **Easing** | `ease-in` para sair, `ease-out` para entrar |
| **Som** | Whoosh mágico + shimmer |
| **Reduced motion** | Fade de 400ms entre mundos |

**Descrição detalhada:**
**Ao entrar:** o tabuleiro atual escurece, um círculo de luz se expande do centro da tela, o conteúdo gira 90° e escala para 0. A tela fica preta por 100ms. **Ao entrar no destino:** o novo tabuleiro escala de 0 para 1 com um brilho, cores saturam do cinza para o normal.

### 2.4 Área Especial (Submundo)

| Propriedade | Descrição |
|---|---|
| **Gatilho** | Transição entre mundo principal e área especial |
| **Duração** | 600ms |
| **Efeito** | Similar ao portal, mas com overlay temático (folhas para floresta, poeira para caverna) |
| **Easing** | `ease-in-out` |
| **Som** | Transição temática (vento, caverna ecoando) |
| **Reduced motion** | Fade simples |

### 2.5 Vitória

| Propriedade | Descrição |
|---|---|
| **Gatilho** | Jogador atinge a casa final (vitória) |
| **Duração** | 3000ms–5000ms (cíclico, jogador pode pular) |
| **Efeito** | Confetes coloridos caindo do topo (15-20 peças), fogos serpentina nas laterais, troféu aparece com scale(0→1.2→1), nome do vencedor brilha em gradiente animado |
| **Easing** | `ease-out` para o troféu, linear para confetes |
| **Som** | Fanfarra de vitória + palmas + confetes |
| **Reduced motion** | Apenas troféu com fade-in, sem confetes |

**Descrição detalhada:**
Os confetes são gerados aleatoriamente no topo da tela, cada um com cor, tamanho e velocidade de queda diferentes (ângulo entre -30° e 30°). Caem até o fundo com rotação. Novos confetes são gerados continuamente a cada 200ms. Fogos serpentina sobem das laterais e explodem no centro-superior. O troféu aparece após 500ms com animação de "elevação" (scale(0) → scale(1.2) → scale(1)).

### 2.6 Acerto (Desafio)

| Propriedade | Descrição |
|---|---|
| **Gatilho** | Jogador seleciona a resposta correta no desafio |
| **Duração** | 600ms |
| **Efeito** | A opção selecionada brilha em verde, partículas de estrelas sobem, o personagem pula de felicidade |
| **Easing** | `ease-out` |
| **Som** | "Ting!" de acerto (campainha ou sino) |
| **Reduced motion** | Opção fica verde sem animação |

### 2.7 Erro (Desafio)

| Propriedade | Descrição |
|---|---|
| **Gatilho** | Jogador seleciona a resposta errada no desafio |
| **Duração** | 800ms |
| **Efeito** | A opção errada treme (shake horizontal, 3 oscilações), fica vermelha suave, a correta brilha em verde |
| **Easing** | `ease-in-out` (shake) |
| **Som** | "Bloop" suave (erro não-punitivo) |
| **Reduced motion** | Opções ficam vermelha/verde sem animação |

### 2.8 Escolha de Mundo

| Propriedade | Descrição |
|---|---|
| **Gatilho** | Jogador clica em um card no seletor de mundos |
| **Duração** | 400ms |
| **Efeito** | Card selecionado escala 1.1 e brilha, os outros escurecem/desfocam |
| **Easing** | `ease-out` |
| **Som** | Click suave |
| **Reduced motion** | Apenas destaque visual (borda), sem escala |

### 2.9 Menu

| Propriedade | Descrição |
|---|---|
| **Gatilho** | Abertura do menu inicial / transição de telas |
| **Duração** | 300ms–500ms |
| **Efeito** | Fade-in com elementos entrando em cascata (título → botões → footer) |
| **Easing** | `ease-out` com delay escalonado (50ms entre elementos) |
| **Som** | Música de fundo inicia |
| **Reduced motion** | Fade-in de 200ms sem cascata |

### 2.10 Transição de Tela (Navegação)

| Propriedade | Descrição |
|---|---|
| **Gatilho** | Navegação entre telas (menu → seletor → setup → jogo) |
| **Duração** | 300ms |
| **Efeito** | Slide horizontal (menu → seletor) ou fade (setup → jogo) |
| **Easing** | `ease-in-out` |
| **Som** | Transição suave (whoosh leve) |
| **Reduced motion** | Fade de 200ms |

## 3. Timing Guidelines

| Animação | Duração | Delay (se aplicável) |
|---|---|---|
| Hover (botão) | 150ms | 0 |
| Press (botão) | 100ms | 0 |
| Fade-in modal | 200ms | 0 |
| Fade-out modal | 150ms | 0 |
| Movimento do jogador (por casa) | 180ms | 0 |
| Animação do dado | 1000ms | 0 |
| Portal (entrada/saída) | 800ms | 0 |
| Confete (vitória) | 3000ms+ | 0 |
| Acerto (desafio) | 600ms | 0 |
| Erro (desafio) | 800ms | 0 |
| Cascata (menu) | 300ms | 50ms entre itens |
| Toast aparecendo | 300ms | 0 |
| Toast desaparecendo | 300ms | 3000ms visível |

## 4. Easing Functions

| Uso | Easing |
|---|---|
| Entrada de elementos | `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out suave) |
| Saída de elementos | `cubic-bezier(0.55, 0, 1, 0.45)` (ease-in suave) |
| Movimento do jogador | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Dado girando | `linear` (trocas regulares) |
| Dado parando | `cubic-bezier(0.16, 1, 0.3, 1)` (frenagem suave) |
| Confete caindo | `linear` (gravidade constante) |
| Scale (aparecer) | `cubic-bezier(0.34, 1.56, 0.64, 1)` (bounce suave) |
| Shake (erro) | `cubic-bezier(0.36, 0, 0.66, -0.56)` (oscilação rápida) |

## 5. Considerações de Performance

- **Preferir `transform` e `opacity`** para animações (GPU-accelerated)
- **Evitar animar `width`, `height`, `top`, `left`** (causam layout reflow)
- **Conter partículas**: no máximo 30 confetes simultâneos
- **`will-change`**: aplicar com moderação em elementos animados continuamente
- **`requestAnimationFrame`**: para animações JS (dado, confetes)
- **CSS animations**: para transições simples (hover, fade, slide)

## 6. prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Para cada animação, ter um fallback estático:
- Confetes → apenas imagem de confetes parados
- Dado girando → valor final exibido após fade
- Portal → cross-fade entre telas
- Movimento do jogador → teleporte instantâneo
