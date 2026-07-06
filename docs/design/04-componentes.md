# Componentes do Lara World

## 1. Botão

| Propriedade | Descrição |
|---|---|
| **Objetivo** | Acionar ações primárias, secundárias e terciárias |
| **Comportamento** | Click → ação imediata; hover → feedback visual; disabled → sem ação |
| **Hierarquia** | Primário (1 por tela, cor de acento) > Secundário (borda sutil) > Terciário (link) |
| **Princípios** | Grande o suficiente para toque infantil (min 48px altura). Texto + ícone sempre que possível. Estados com transições suaves |

### Variantes

- **Primário**: fundo sólido (cor de acento do mundo), texto branco, sombra md
- **Secundário**: fundo transparente, borda 2px, texto da cor de acento
- **Terciário**: apenas texto, sem borda ou fundo, hover com underline
- **Ícone**: apenas ícone, com tooltip, para ações conhecidas (reiniciar, voltar)
- **Dado**: variante especial, tamanho grande (min 64px), animação de rolagem

## 2. Card de Mundo

| Propriedade | Descrição |
|---|---|
| **Objetivo** | Apresentar um mundo no seletor de mundos |
| **Comportamento** | Click → seleciona o mundo; hover → elevação; disabled → bloqueado |
| **Hierarquia** | Grid de cards, todos iguais em importância visual |
| **Princípios** | Ícone grande + nome + descrição curta + badge opcional. Fundo semi-transparente |

### Conteúdo

- Ilustração temática do mundo (fundo do card)
- Nome do mundo (H3)
- Descrição curta (body)
- Badge: "Em breve" (bloqueado), "Novo!" (recém-adicionado), "Aleatório" (random)

## 3. Casa do Tabuleiro (Cell)

| Propriedade | Descrição |
|---|---|
| **Objetivo** | Representar uma posição na trilha do tabuleiro |
| **Comportamento** | Principalmente decorativa; pode ser clicável para informações (tooltip) |
| **Hierarquia** | Identificada por número e ícone. Cor especial se tiver evento |
| **Princípios** | Tamanho consistente. Número sempre visível. Ícone claro. Efeito de brilho quando jogador está em cima |

### Subtipos

- **Normal**: fundo neutro, sem eventos
- **Desafio**: roxo, ícone de livro/lâmpada
- **Portal**: gradiente mágico, ícone de portal
- **Bônus**: verde/dourado, ícone de estrela/seta
- **Penalidade**: rosa/vermelho, ícone de cuidado
- **Vitória**: gradiente dourado, ícone de troféu/bandeira

## 4. Modal (Overlay)

| Propriedade | Descrição |
|---|---|
| **Objetivo** | Exibir informações ou ações que exigem atenção do jogador |
| **Comportamento** | Abre com fade-in + scale; fecha com botão de ação ou X; bloqueia interação com o fundo |
| **Hierarquia** | Sempre acima do tabuleiro. z-index mais alto entre os elementos de tela |
| **Princípios** | Fundo escurecido com frosted glass. Conteúdo centralizado. Ação de saída clara (botão "X" ou "Fechar") |

### Subtipos

- **Configuração**: setup de jogadores com inputs e grade de emoji
- **Desafio**: pergunta + alternativas + feedback de acerto/erro
- **Portal**: mensagem de entrada + "Entrar" / "Continuar"
- **Vitória**: overlay especial com confetes, troféu, dois botões

## 5. Portal (Elemento de Jogo)

| Propriedade | Descrição |
|---|---|
| **Objetivo** | Transportar o jogador entre mundos principal e área especial |
| **Comportamento** | Casa especial → modal de confirmação → transição animada → novo tabuleiro |
| **Hierarquia** | Evento de jogada, não componente de UI fixo |
| **Princípios** | Sensação de passagem mágica. Animação de entrada/saída. Título e descrição dinâmicos |

### Componentes do Portal

- Casa especial no tabuleiro (ícone de portal)
- Modal de confirmação (título + mensagem + 2 botões)
- Transição visual (a ser implementada)
- Indicador de mundo atual (world-indicator no header)

## 6. Desafio (Challenge)

| Propriedade | Descrição |
|---|---|
| **Objetivo** | Apresentar pergunta educativa com múltipla escolha |
| **Comportamento** | Modal → pergunta visível → 3-4 alternativas → feedback imediato → movimento ±1 |
| **Hierarquia** | Evento de jogada com prioridade sobre outras ações |
| **Princípios** | Pergunta em destaque. Alternativas grandes (touch-friendly). Feedback visual claro (verde/vermelho). Sem pressão de tempo |

### Estados

- **Pergunta exibida**: modal com fundo, pergunta centralizada, opções lado a lado
- **Resposta selecionada**: a opção escolhida ganha destaque, as outras escurecem
- **Acerto**: fundo verde, confete sutil, ícone de check, avança 1 casa
- **Erro**: fundo vermelho suave, ícone de X, mostra resposta correta, volta 1 casa

## 7. Toast / Notificação

| Propriedade | Descrição |
|---|---|
| **Objetivo** | Exibir feedback rápido não-intrusivo |
| **Comportamento** | Aparece no topo da tela, auto-destroi após 3-5 segundos |
| **Hierarquia** | Acima do tabuleiro, abaixo dos modais |
| **Princípios** | Mensagem curta (1 linha). Fundo semi-transparente. Ícone + texto. Desaparece com fade-out |

### Tipos

- **Sucesso**: verde, check
- **Erro**: vermelho, X
- **Info**: azul, i
- **Evento**: cor do mundo, ícone do evento

## 8. Histórico

| Propriedade | Descrição |
|---|---|
| **Objetivo** | Registrar cronologicamente todas as ações da partida |
| **Comportamento** | Scrollável, itens adicionados no topo, máximo 50 entradas |
| **Hierarquia** | Secundário — não essencial para jogar, útil para revisão |
| **Princípios** | Texto monoespaçado ou sans-serif compacto. Timestamp opcional. Ícone por tipo de evento. Scroll suave |

### Formato de Entrada

```
[🧑]  Lara   tirou 5 → casa 12 (Desafio)
[❓]  Desafio: "Qual a capital do Brasil?" → ✅ Acertou! (+1)
[🧑]  Lara  → casa 13
[🤖]  Máquina  tirou 3 → casa 7 (Desafio)
```

## 9. Avatar do Jogador

| Propriedade | Descrição |
|---|---|
| **Objetivo** | Identificar visualmente cada jogador |
| **Comportamento** | Estático durante a partida; anima levemente no turno ativo |
| **Hierarquia** | Presente no tabuleiro (personagem), no painel (avatar miniatura) e no indicador de turno |
| **Princípios** | Círculo ou arredondado (`radius-round`). Borda colorida por jogador (P1 rosa, P2 azul). Expressão facial amigável |

### Tamanhos

- **Painel**: 48×48px
- **Tabuleiro**: 58×58px (personagem completo)
- **Indicador de turno**: 40×40px

## 10. Indicador de Turno

| Propriedade | Descrição |
|---|---|
| **Objetivo** | Mostrar qual jogador está ativo no momento |
| **Comportamento** | Atualizado a cada troca de turno; destaque visual no jogador ativo |
| **Hierarquia** | Alta — informação essencial para o fluxo do jogo |
| **Princípios** | Deve ser percebido imediatamente ao olhar para a tela. Animação sutil (pulse ou glow) no jogador ativo |

### Layout

```
[➡️  🧑 Lara • Casa 12]    ← ativo, com glow
[  🤖 Máquina • Casa 7]     ← inativo, opacidade reduzida
```

## 11. Dado

| Propriedade | Descrição |
|---|---|
| **Objetivo** | Sortear o número de casas a avançar |
| **Comportamento** | Clique → animação de rolagem (bounce + rotação) → resultado fixo |
| **Hierarquia** | Ação principal do jogo — o elemento mais interagido |
| **Princípios** | Grande, centralizado no painel, animação satisfatória. Emoção de 1-6 deve ser clara |

### Estados

- **Aguardando**: dado estático, botão "Jogar Dado" visível e habilitado
- **Girando**: animação de rolagem (1-2 segundos), botão desabilitado
- **Resultado**: dado fixo com o valor sorteado, botão reabilitado

## 12. Mapa / World Selector

| Propriedade | Descrição |
|---|---|
| **Objetivo** | Apresentar todos os mundos disponíveis para o jogador escolher |
| **Comportamento** | Grid de cards → clique seleciona → avança para configuração |
| **Hierarquia** | Tela inteira, acima do menu |
| **Princípios** | Visualmente convidativo. Cada card conta uma mini-história. Mundos bloqueados são claramente identificados |

## 13. Indicador de Mundo (World Indicator)

| Propriedade | Descrição |
|---|---|
| **Objetivo** | Informar em qual mundo/área o jogador está |
| **Comportamento** | Texto dinâmico, trocado ao entrar/sair de área especial |
| **Hierarquia** | Header — visível mas não intrusivo |
| **Princípios** | Ícone + nome do mundo. Fundo semi-transparente. Padding horizontal |

## 14. Tela de Vitória

| Propriedade | Descrição |
|---|---|
| **Objetivo** | Celebrar o vencedor com uma tela festiva |
| **Comportamento** | Overlay especial com animações de confete, troféu, dois botões de ação |
| **Hierarquia** | Tela inteira, z-index máximo, cobre todo o jogo |
| **Princípios** | Alegria pura. Cores claras e brilhantes. Movimento (confetes, fogos). Troféu em destaque. Parabéns ao vencedor |

### Conteúdo

- Fundo animado (confetes, fogos, brilhos)
- Troféu grande (ilustração)
- "🏆 Vitória!" + nome do jogador vencedor
- Botões: "🔁 Jogar Novamente" (primário), "🏠 Voltar ao Menu" (secundário)

## 15. Grade de Emoji (Sprite Selector)

| Propriedade | Descrição |
|---|---|
| **Objetivo** | Permitir que o jogador escolha um sprite/avatar |
| **Comportamento** | Grid de emojis → clique seleciona → destaque visual no escolhido |
| **Hierarquia** | Dentro do modal de configuração |
| **Princípios** | Grid compacto. Seleção clara (borda + fundo). 8-12 opções por grade |
