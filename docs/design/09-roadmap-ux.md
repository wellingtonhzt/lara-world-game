# Roadmap UX — Evolução Visual do Lara World

## 1. Estratégia

A evolução visual do Lara World será feita em **pequenas etapas incrementais**. Cada etapa (UX-1, UX-2, etc.) entrega valor visual perceptível sem depender da conclusão da etapa anterior.

Nenhuma etapa deve durar mais que uma sprint (2-3 dias de trabalho com IA).

A ordem prioriza:
1. **Impacto visual imediato** — o que causa mais diferença na experiência
2. **Dependência técnica** — assets que dependem de outros assets
3. **Consistência** — fechar um mundo de cada vez

## 2. Roadmap

### UX-1 — Fundos de Mundo Ilustrados

**Objetivo**: Substituir os gradientes CSS por ilustrações de fundo completas para cada mundo.

**Tarefas**:
- [ ] Gerar ilustração de fundo para a Floresta Encantada (1920×1080)
- [ ] Gerar ilustração de fundo para o Vale dos Dinossauros (1920×1080)
- [ ] Aplicar como `background-image` no `#track-container`
- [ ] Ajustar opacidade para não competir com o tabuleiro
- [ ] Testar em desktop e mobile (corte/zoom responsivo)

**Assets necessários**:
- 2 backgrounds de mundo (Floresta, Dinossauros)

**Critério de sucesso**: Cada mundo tem um fundo ilustrado reconhecível. O gradiente atual desaparece.

---

### UX-2 — Ilustrações de Casa do Tabuleiro

**Objetivo**: Substituir as células coloridas do tabuleiro (atualmente divs com cor sólida + emoji) por ilustrações de casas temáticas.

**Tarefas**:
- [ ] Definir 3-4 variações de casa para cada mundo (normal, especial, desafio, portal)
- [ ] Gerar spritesheet de casas para Floresta Encantada (20 células)
- [ ] Gerar spritesheet de casas para Vale dos Dinossauros (20 células)
- [ ] Gerar spritesheet de casas para áreas especiais (8 cada)
- [ ] Integrar ao CSS como `background-image` nas células
- [ ] Garantir que números e ícones ainda sejam visíveis sobre a ilustração

**Assets necessários**:
- ~60 ilustrações de casa (20+20+8+8 + variações)

**Critério de sucesso**: O tabuleiro parece um cenário ilustrado, não uma grade de divs coloridas.

---

### UX-3 — Personagens Ilustrados

**Objetivo**: Substituir os círculos coloridos (rosa/azul) por personagens ilustrados completos.

**Tarefas**:
- [ ] Criar design da Lara (Jogador 1) — menina aventureira
- [ ] Criar design do Amigo (Jogador 2) — companheiro personalizável
- [ ] Criar design do Bot — versão robô/IA do Amigo
- [ ] Gerar sprites de caminhada (4-8 frames por personagem)
- [ ] Gerar sprites de celebração (vitória)
- [ ] Gerar sprites de desafio (pensando, acertando, errando)
- [ ] Substituir elementos DOM circulares por `<img>` ou `background-image`
- [ ] Animação de caminhada (spritesheet → CSS animation ou JS)

**Assets necessários**:
- 3 personagens × ~8 frames de animação = 24 ilustrações

**Critério de sucesso**: Jogadores são personagens reconhecíveis com animação de caminhada.

---

### UX-4 — Interface Temática (HUD e Painéis)

**Objetivo**: Substituir a interface atual (botões retangulares, painéis brancos) por uma interface temática com texturas e decorações.

**Tarefas**:
- [ ] Redesenhar botões com estilo orgânico (pedra, madeira, cristal — conforme o mundo)
- [ ] Redesenhar painéis com bordas temáticas e frosted glass
- [ ] Redesenhar modal de desafio com ilustração de fundo
- [ ] Redesenhar modal de portal com moldura decorativa
- [ ] Adicionar decorações ao painel lateral (coerentes com o mundo)
- [ ] Ajustar header com o tema do mundo
- [ ] Testar contraste e legibilidade após as mudanças

**Assets necessários**:
- 2-3 variações de botão por mundo
- 1 template de painel por mundo
- 1 ilustração de modal de desafio
- 1 ilustração de modal de portal

**Critério de sucesso**: A interface parece parte do mundo, não uma sobreposição genérica.

---

### UX-5 — Tela de Vitória Ilustrada

**Objetivo**: Criar uma tela de vitória temática para cada mundo, com fundo, troféu e decorações próprias.

**Tarefas**:
- [ ] Gerar ilustração de fundo de vitória para a Floresta
- [ ] Gerar ilustração de fundo de vitória para Dinossauros
- [ ] Criar ilustração de troféu personalizada
- [ ] Adaptar confetes para combinarem com a paleta do mundo
- [ ] Mensagem de vitória com estilo tipográfico decorativo

**Assets necessários**:
- 2 backgrounds de vitória
- 1 ilustração de troféu (reutilizável ou variações)

**Critério de sucesso**: Vitória parece uma conquista especial, não um alerta genérico.

---

### UX-6 — Efeitos Sonoros

**Objetivo**: Adicionar sons para todas as ações do jogo (dado, movimento, portal, desafio, vitória).

**Tarefas**:
- [ ] Criar/coletar sons para cada ação
- [ ] Integrar API de áudio (`AudioContext` ou `<audio>`)
- [ ] Sincronizar animações com sons (dado para de girar + som de impacto)
- [ ] Adicionar música de fundo para cada mundo (loop)
- [ ] Controles de volume / mute
- [ ] Testar em mobile (autoplay policies)

**Sons necessários**:
- Dado girando + parada (2 sons)
- Passo do jogador (1 som, repetido)
- Portal abrindo + fechando (2 sons)
- Desafio aparecendo (1 som)
- Acerto + erro (2 sons)
- Vitória (fanfarra, 1 som)
- Clique de botão (1 som)
- Música de fundo: Floresta (1 track)
- Música de fundo: Dinossauros (1 track)
- Música do menu (1 track)

**Critério de sucesso**: O jogo tem identidade sonora. Cada ação tem feedback auditivo.

---

### UX-7 — Animações de Transição

**Objetivo**: Implementar as animações descritas em `07-animacoes.md`.

**Tarefas**:
- [ ] Animação de entrada/saída de portal (swirl + scale)
- [ ] Animação de transição entre mundos
- [ ] Animação de vitória com confetes e troféu
- [ ] Animação de acerto/erro nos desafios
- [ ] Animação de cascata no menu
- [ ] Animação de hover/press refinada
- [ ] Suporte a `prefers-reduced-motion`

**Critério de sucesso**: Transições são suaves e comunicam o que está acontecendo.

---

### UX-8 — Ícones e Emojis Ilustrados

**Objetivo**: Substituir todos os emojis do jogo por ícones ilustrados consistentes.

**Tarefas**:
- [ ] Criar conjunto de ícones para tipos de casa (avançar, voltar, desafio, portal, etc.)
- [ ] Criar ícones de HUD (dado, histórico, configurações)
- [ ] Criar ícones dos jogadores (avatares)
- [ ] Criar ícones de ação (jogar, reiniciar, voltar)
- [ ] Garantir consistência entre mundos (mesmo tipo de casa, mesmo ícone base)

**Assets necessários**:
- ~20 ícones (tamanho base 48×48px)

**Critério de sucesso**: Nenhum emoji nativo do sistema operacional é usado no jogo.

---

### UX-9 — Seletor de Mundos com Ilustrações

**Objetivo**: Substituir os cards do seletor de mundos por cards com ilustrações temáticas completas.

**Tarefas**:
- [ ] Gerar ilustração de card para cada mundo existente (Floresta, Dinossauros)
- [ ] Gerar placeholder para mundos futuros
- [ ] Efeito hover com elevação e brilho
- [ ] Efeito de seleção com animação

**Assets necessários**:
- 2 ilustrações de card + 4 placeholders

**Critério de sucesso**: O seletor de mundos parece uma vitrine de livros ilustrados.

---

### UX-10 — Áreas Especiais Completas

**Objetivo**: Garantir que Floresta Misteriosa e Caverna dos Fósseis tenham o mesmo nível visual dos mundos principais.

**Tarefas**:
- [ ] Ilustrações de fundo para Floresta Misteriosa
- [ ] Ilustrações de fundo para Caverna dos Fósseis
- [ ] Casas ilustradas para áreas especiais
- [ ] Portal overlay com ilustração própria
- [ ] Transição visual de entrada/saída
- [ ] Tela de "submundo concluído" (retorno ao principal)

**Assets necessários**:
- 2 backgrounds de área especial
- 16 ilustrações de casa (8 + 8)
- 1 ilustração de portal

**Critério de sucesso**: Áreas especiais têm identidade visual própria, tão rica quanto os mundos principais.

---

### UX-Extra — Assets Futuros

Itens planejados mas sem prioridade definida:

- [ ] Animação do mundo (elementos decorativos animados: árvores balançando, água fluindo)
- [ ] Ilustrações de loading screen
- [ ] Ilustrações de tela de configuração (background temático)
- [ ] Efeitos de partícula (poeira ao andar, brilho ao acertar)
- [ ] Modo escuro (alternativa noturna para jogar antes de dormir)
- [ ] Temas sazonais (Natal no menu em dezembro)

## 3. Matriz de Dependências

```
UX-1 (Fundos)
  ├── UX-2 (Casas)         ← pode ser paralelo
  ├── UX-3 (Personagens)   ← independente
  ├── UX-4 (Interface)     ← depende de UX-1 visualmente
  ├── UX-9 (Cards mundos)  ← pode usar mesmo estilo de UX-1
  └── UX-10 (Áreas)        ← depende de UX-1 + UX-2

UX-5 (Vitória)             ← independente (pode ser feito a qualquer momento)

UX-6 (Sons)                ← independente (pode ser paralelo a tudo)

UX-7 (Animações)           ← depende de UX-2 + UX-3 (precisa dos assets)

UX-8 (Ícones)              ← independente (pode substituir gradualmente)

UX-10 (Áreas)              ← depende de UX-1, UX-2
```

## 4. Recomendações

1. **Fazer UX-1 e UX-6 em paralelo** — fundos visuais + sons são os maiores gaps atuais
2. **UX-8 (ícones) pode ser feito de forma contínua** — substituir emojis um por um
3. **UX-3 (personagens) é o de maior impacto emocional** — priorizar após UX-1
4. **Não pular UX-4 (interface)** — botões e painéis atuais são o ponto mais fraco visualmente
5. **UX-10 (áreas especiais) só faz sentido após UX-1 e UX-2 estarem prontos**
6. **Cada UX step deve ser testado em mobile e desktop** antes de avançar
7. **Assets devem ser gerados em 2× (retina)** para telas de alta densidade (mínimo 2× resolução)
