# Design Mobile do Lara World

## 1. Filosofia Mobile-First

O Lara World é primariamente um jogo de navegador, mas **a experiência mobile é prioridade de design**. Crianças jogam em tablets e smartphones dos pais. O layout desktop deve ser uma expansão do mobile, não o contrário.

### Princípios

- **Uma mão**: toda interação essencial deve ser possível com o polegar direito (ou esquerdo, com configuração)
- **Sem hover**: mobile não tem hover. Todo feedback visual deve vir de tap, press ou animação automática
- **Toque generoso**: alvos de toque mínimos de 44×44px (seguindo Apple HIG e Material Design)
- **Legibilidade**: texto nunca abaixo de 14px em mobile
- **Sem scroll horizontal**: a largura do conteúdo deve caber em 360px de viewport
- **Feedback tátil**: animações de press (escala 0.95) substituem hover

## 2. Bottom Navigation (Mobile HUD)

Em mobile, o HUD principal deve estar na **metade inferior da tela** — onde os polegares alcançam.

```
┌──────────────────────────┐
│                          │
│       TABULEIRO          │  ← 55% da tela
│                          │
├──────────────────────────┤
│  🎲  [Jogar Dado]        │  ← bottom bar fixo
│  🧑 Lara · Casa 12 ➡️    │
└──────────────────────────┘
```

### Bottom Bar

- Altura: 80-100px
- Layout: dado à esquerda, botão "Jogar Dado" centralizado, status do jogador ativo à direita
- Fixo no fundo da tela (position: fixed, bottom: 0)
- Fundo semi-transparente com frosted glass

## 3. Tabuleiro em Mobile

### Snake Pattern Adaptado

- Células: 48×48px (mínimo), espaçamento de 4px
- Número da casa: 10px (apenas o número, sem descrição)
- Ícone: 20×20px
- Personagem: 36×36px
- O tabuleiro inteiro deve caber em 360px de largura
- Se necessário, scroll vertical suave (a trilha ocupa mais altura que largura)

### Casas Especiais em Mobile

- A cor especial é o principal identificador
- Tooltip ao tocar (se o jogador quiser saber o tipo)
- Número da casa sempre visível, ícone visível

## 4. Botões em Mobile

| Tipo | Altura Mínima | Largura Mínima | Observação |
|---|---|---|---|
| Ação principal (Jogar Dado) | 56px | 160px | Texto + ícone, cor de acento |
| Ação secundária | 48px | 120px | Borda visível |
| Ação terciária | 44px | 44px | Ícone apenas |
| Botão de modal | 52px | 140px | Dois lado a lado |

## 5. Modais em Mobile

- Largura: 90vw (nunca ultrapassar a largura da tela)
- Altura: 75vh (scroll interno se necessário)
- Botão "X" no canto superior direito (44×44px, fácil de tocar)
- Ações no fundo do modal (thumb zone)
- Evitar modais que cubram todo o tabuleiro — manter visibilidade parcial

## 6. Menus em Mobile

### Menu Inicial

- Título centralizado com ilustração
- Botões em coluna (nunca lado a lado em mobile)
- "⚡ Jogo Rápido" como botão principal, grande e colorido
- "🏆 Modo Carreira" secundário

### Seletor de Mundos

- Grid de 2 colunas em mobile (em vez de 3)
- Cards menores, com ícone + nome apenas
- Descrição oculta ou em tooltip

### Modal de Configuração

- Inputs em largura total
- Grade de emoji: 4 colunas (em vez de 5 no desktop)
- Jogador 1 e Jogador 2 em abas (não lado a lado)

## 7. Touch Gestures

| Gesture | Ação | Elemento |
|---|---|---|
| Tap | Selecionar / Ativar | Todos os botões, cards, opções |
| Long press | Tooltip / Info | Casas especiais, ícones |
| Swipe left | Voltar / Fechar | Modais, histórico |
| Swipe down | Fechar | Modais, painéis |
| Double tap | (reservado) | — |

## 8. Responsividade — Adaptações por Breakpoint

### 480px–767px (Mobile)

| Elemento | Adaptação |
|---|---|
| Tabuleiro | Células 48×48, números pequenos |
| Painel | Bottom bar + status compacto |
| Histórico | Recolhível, 3-5 linhas visíveis |
| Modais | 90vw largura, ações no fundo |

### 768px–1023px (Tablet)

| Elemento | Adaptação |
|---|---|
| Tabuleiro | Células 64×64, números normais |
| Painel | 220px lateral ou recolhível |
| Histórico | Visível, 8-10 linhas |
| Modais | 60vw largura |

### ≥1024px (Desktop)

| Elemento | Adaptação |
|---|---|
| Tabuleiro | Células 80×88, números e ícones grandes |
| Painel | 280px lateral fixo |
| Histórico | Visível, 15-20 linhas |
| Modais | 480px centralizados |

## 9. Safe Areas

Em dispositivos com notch ou bordas arredondadas:

- Conteúdo principal dentro da safe area (evitar notch)
- Bottom bar acima da home indicator (34px de margem)
- Header dentro da safe area superior
- Modais centralizados, dentro da safe area

## 10. Testes Mobile

### Dispositivos de Teste

| Tipo | Resolução | Polegadas | Testar |
|---|---|---|---|
| Smartphone pequeno | 360×640 | 4.7" | Legibilidade, toque |
| Smartphone grande | 414×896 | 6.5" | Layout geral |
| Tablet 7" | 600×1024 | 7" | Touch targets |
| Tablet 10" | 800×1280 | 10" | Layout geral |
| Desktop | 1920×1080 | — | Layout expandido |

### Checklist Mobile

- [ ] Todos os botões têm pelo menos 44×44px
- [ ] Espaçamento entre botões ≥8px
- [ ] Texto corpo ≥14px
- [ ] Dado visível sem scroll
- [ ] "Jogar Dado" acessível com o polegar
- [ ] Modais não cobrem o tabuleiro completamente
- [ ] Histórico não ocupa mais que 30% da tela
- [ ] Tabuleiro cabe na largura sem scroll horizontal
- [ ] Safe areas respeitadas
- [ ] Orientação retrato (é a padrão para jogos casuais mobile)
