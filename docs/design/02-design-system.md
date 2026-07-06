# Design System do Lara World

## 1. Princípios Gerais

- **Orgânico sobre geométrico**: formas arredondadas, cantos suaves, assimetria controlada
- **Alegre sobre sério**: cores vibrantes, sombras coloridas (nunca pretas), brilhos sutis
- **Claro sobre poluído**: espaçamento generoso, hierarquia visual nítida, máximo de informação por tela controlado
- **Tátil sobre estático**: elementos parecem palpáveis — sombras que sugerem profundidade, hover que eleva o elemento
- **Consistente sobre criativo**: cada mundo tem personalidade, mas todos seguem o mesmo sistema de componentes

## 2. Paleta Base

A paleta do Lara World não é definida por cores exatas em hexadecimal, mas por **princípios de cor**:

### Tons Neutros

- **Branco**: base para cards e modais — não puro (#FFFFFF) e sim levemente quente (#FFF8F0 ou similar)
- **Off-white**: fundos de painel, áreas de leitura
- **Cinza claro**: bordas sutis, separadores, texto desabilitado
- **Cinza médio**: texto secundário, placeholders
- **Cinza escuro**: texto principal (nunca preto puro)

### Cores de Acento

Cada mundo tem sua paleta de acento. O sistema deve suportar troca de paleta por mundo.

| Mundo | Tom Dominante | Tom Secundário | Destaque |
|---|---|---|---|
| Floresta Encantada | Verde folha | Dourado | Rosa magenta |
| Vale dos Dinossauros | Laranja terra | Vermelho tijolo | Amarelo sol |
| Galáxia Estelar | Azul profundo | Roxo | Prata |
| Reino dos Oceanos | Azul claro | Turquesa | Coral |
| Castelo Encantado | Lilás | Rosa | Dourado |
| Vila de Natal | Vermelho natalino | Verde pinheiro | Branco neve |

### Cores Funcionais

| Função | Princípio |
|---|---|
| **Sucesso** | Verde — tom médio, nunca neon |
| **Erro** | Vermelho — tom tomate, nunca sangue |
| **Aviso** | Amarelo ou laranja |
| **Desafio** | Roxo — associado a perguntas e conhecimento |
| **Portal** | Gradiente mágico (roxo → azul ou rosa → roxo) |
| **Vitória** | Dourado com brilho |
| **Especial (casa)** | Varia por tipo, mas sempre com brilho suave |

## 3. Tipografia

### Títulos

- **Família**: Display ou sans-serif com personalidade (ex: Fredoka, Bubblegum Sans, Patrick Hand)
- **Peso**: Semi-bold ou bold
- **Tamanho**: 2rem–3rem (telas grandes), 1.5rem–2rem (mobile)
- **Estilo**: Arredondado, amigável, infantil mas legível
- **Transformação**: Capitalize (primeira letra maiúscula, resto minúsculo)

### Corpo

- **Família**: Sans-serif de alta legibilidade (ex: Nunito, Quicksand, Poppins)
- **Peso**: Regular (400) para texto, Semi-bold (600) para labels
- **Tamanho**: 1rem–1.125rem (16–18px)
- **Altura de linha**: 1.5

### Números e Dados

- **Família**: Tabular figures para alinhamento de números do dado e posições
- **Destaque**: Bold, cor de acento do mundo atual

### Hierarquia

```
H1 — Nome do Mundo / Título de Tela     → 2.5rem, display, bold
H2 — Nome de Submundo / Seção           → 2rem, display, bold
H3 — Nome de Card / Modal Title         → 1.5rem, sans-serif, semi-bold
Body — Descrições, mensagens            → 1rem, sans-serif, regular
Caption — Labels, metadata              → 0.875rem, sans-serif, regular
Small — Badges, contagens               → 0.75rem, sans-serif, semi-bold
```

## 4. Espaçamentos

| Token | Valor | Uso |
|---|---|---|
| `space-2xs` | 4px | Padding interno de badges |
| `space-xs` | 8px | Gap entre elementos inline |
| `space-sm` | 12px | Padding de botões pequenos |
| `space-md` | 16px | Padding de cards, gap entre linhas |
| `space-lg` | 24px | Distância entre componentes |
| `space-xl` | 32px | Margem entre seções |
| `space-2xl` | 48px | Padding de layout, distância de borda |
| `space-3xl` | 64px | Espaçamento hero (título) |

## 5. Bordas e Arredondamento

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | 4px | Badges, tags |
| `radius-md` | 8px | Inputs, botões |
| `radius-lg` | 12px | Cards, modais, painéis |
| `radius-xl` | 16px | Containers grandes, overlay |
| `radius-round` | 999px | Avatares, botões circulares |

## 6. Sombras

- **Sombras coloridas**: usar a cor do elemento com 20-30% de opacidade, nunca preto
- **Camadas**: sombra `sm` (1px offset), `md` (3px), `lg` (8px)
- **Hover**: elevar 2-4px no eixo Z, sombra ampliada
- **Modal**: sombra `lg` com desfoque generoso (12-16px)
- **Frosted Glass**: modais com `backdrop-filter: blur(8px)` e fundo semi-transparente

Exemplo conceitual:
```css
/* Card shadow — não é CSS definitivo, apenas direção */
box-shadow: 0 4px 12px rgba(world-accent-color, 0.2);
```

## 7. Ícones

### Estilo

- **Flat cartoon**: preenchimento sólido, contorno fino (1-2px), cantos arredondados
- **Tamanho base**: 24×24px (HUD), 32×32px (botões), 48×48px (casas)
- **Emojis**: substitutos temporários até que os ícones ilustrados sejam produzidos
- **Consistência**: todos os ícones do mesmo mundo devem parecer da mesma "família"

### Iconografia por Tipo de Casa

| Tipo | Ícone Sugerido |
|---|---|
| Avançar | Seta para frente / Asa |
| Voltar | Seta para trás / Âncora |
| Desafio | Ponto de interrogação / Livro / Lâmpada |
| Portal | Portal oval com redemoinho |
| Atalho | Seta cortando caminho |
| Saída | Porta / Seta para fora |
| Jogar novamente | Seta circular |
| Perder rodada | Relógio com X |
| Vitória | Bandeira / Troféu / Estrela |

## 8. Estados dos Componentes

### Botões

| Estado | Aparência |
|---|---|
| **Default** | Fundo sólido ou gradiente sutil, borda visível, sombra md |
| **Hover** | Elevação (sombra ampliada), brilho leve (+5% lightness), transformação scale(1.02) |
| **Pressed** | Rebaixamento (soma reduzida, escala 0.98), cor ligeiramente escurecida |
| **Disabled** | Opacidade 40%, sem sombra, cursor not-allowed |
| **Foco** | Outline brilhante com 2-4px de desfoque na cor de acento |

### Cards (Mundos, Seleção)

| Estado | Aparência |
|---|---|
| **Default** | Fundo semi-transparente, borda sutil, sombra md |
| **Hover** | Escala 1.03, borda mais brilhante (cor de acento), sombra lg |
| **Selected** | Borda grossa (3-4px) na cor de acento, brilho interno sutil |
| **Disabled / Locked** | Opacidade 50%, cinza, cadeado, sem interação |

### Inputs

| Estado | Aparência |
|---|---|
| **Default** | Fundo branco, borda 2px cinza claro, placeholder visível |
| **Focus** | Borda na cor de acento, glow externo sutil |
| **Filled** | Fundo branco, texto visível |
| **Error** | Borda vermelha, shake sutil |

## 9. Transições e Micro-interações

- **Duração**: 150ms–300ms (instantâneo o suficiente para não atrasar, lento o suficiente para ser notado)
- **Easing**: `ease-out` para entradas, `ease-in-out` para mudanças de estado
- **Hover**: transição suave de sombra, borda e escala
- **Aparecimento de modal**: fade-in + scale(0.95→1) em 200ms
- **Troca de tela**: slide horizontal ou fade (nunca zoom exagerado)

## 10. Acessibilidade Visual no Design System

- **Contraste mínimo 4.5:1** para texto corpo, 3:1 para texto grande (>18px)
- **Estados visíveis** não dependem apenas de cor — usar ícones + texto + forma
- **Foco visível**: outline brilhante em todos os elementos clicáveis
- **Touch targets**: mínimo 44×44px (recomendado 48×48px)
