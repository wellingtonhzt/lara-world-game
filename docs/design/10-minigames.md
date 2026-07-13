# Minigames do Lara World

## 1. Papel dos Minigames

Os minigames são experiências curtas que complementam o tabuleiro — nunca o substituem. O tabuleiro continua sendo a experiência principal do Lara World. Cada minigame representa uma mudança de ritmo: o jogador sai brevemente da trilha, realiza uma atividade diferente, e retorna ao jogo principal com um bônus ou penalidade.

### Direção atual de produto

Cada mundo do Lara World possui um minigame temático principal. Esse minigame deve:

- reforçar a identidade do mundo;
- oferecer mudança curta de ritmo;
- permanecer integrado ao jogo de tabuleiro;
- ter duração curta;
- gerar recompensa ou resultado para a partida.

**Isto não é uma limitação arquitetural.** A arquitetura deve permitir:

- mais de um minigame em um mundo;
- minigames compartilhados entre mundos;
- minigames sem vínculo direto com uma casa do tabuleiro;
- acesso fora da partida principal.

Futuramente, os minigames também poderão ser acessados por:

- menu dedicado;
- modo livre;
- conquistas;
- passagens secretas;
- eventos especiais;
- recompensas por desempenho extraordinário;
- conteúdos desbloqueáveis.

### Status atual do registro

| Minigame | ID | Registrado | Status |
|----------|----|-----------|--------|
| MeteoroGame | `meteor-game` | ✅ Sim | Disponível |
| Ocean Match-3 | `ocean-match3` | ✅ Sim | Grade 6×6, troca, match, validação, célula vazia (null), remoção, gravidade, cascata, progresso, timer, vitória |

O `meteor-game` e o `ocean-match3` estão registrados no `MinigameRegistry`. O Ocean Match-3 implementa grade 6×6 com 5 tipos de peça, HUD (Combinações: X/5 + indicador visual ● ● ○ ○ ○, Tempo: 45s), seleção, troca, detecção de combinações, validação com desfazer, célula vazia (`null`), remoção, gravidade, cascata (máx 5 ciclos), progresso dinâmico, cronômetro (45s padrão, configurável via debug), vitória imediata aos 5 combos, boardDelta escalonado no fim do tempo. Os botões de simulação de vitória/falha aparecem apenas com `?debug=1`. O painel debug possui controles de tempo (20s, 30s, 45s, 60s, ∞) e reinício.

## 2. Duração

| Propriedade | Valor |
|---|---|---|
| **Duração padrão** | 45 segundos (Ocean Match-3) / 20 segundos (MeteoroGame) |
| **Tolerância mínima** | 15 segundos |
| **Tolerância máxima** | 60 segundos (configurável via debug) |
| **Referência implementada** | Ocean Match-3 — 45s (padrão), configurável via debug para 20s, 30s, 45s, 60s, ∞ |

A duração é contada **após** a instrução curta e a contagem regressiva 3, 2, 1. O cronômetro só inicia quando o jogador assume o controle. O Ocean Match-3 aceita configuração de tempo por opções (`timeLimit`) e pelo painel de debug (`?debug=1`). O modo sem limite (`∞`) desativa o cronômetro e só permite conclusão por vitória ou botões de simulação.

## 3. Fluxo Comum

Evento do tabuleiro (casa especial)
    ↓
Transição / introdução curta
    ↓
Instrução simples (1 linha + ícone)
    ↓
Contagem regressiva 3, 2, 1
    ↓
Minigame (duração padrão: 20s)
    ↓
Tela de resultado (card glass sobre frozen scene)
    ↓
Aplicação de bônus ou penalidade
    ↓
Retorno ao tabuleiro (5s countdown + "Voltar agora")

### Referência — MeteoroGame (Implementado)

| Etapa | Duração | Descrição |
|-------|---------|-----------|
| Evento | Instantâneo | Casa 15 (Buraco de Minhoca) → `launchMeteoroGame()` |
| Setup | ~100ms | Overlay exibido, container criado, canvas iniciado |
| Instrução | ~2s (lida) | Header com título + objetivo |
| Contagem | 3s | 3... 2... 1... |
| Gameplay | 20s | Nave + meteoros, 3 vidas |
| Result card | Imediato | Card glass sobre canvas congelado |
| Countdown | 5s | "Voltando ao tabuleiro em 5..." com botão "Voltar agora" |
| Retorno | Instantâneo | Overlay oculto, jogo continua |

## 4. Interface Comum

Os elementos de interface de um minigame dividem-se em duas categorias.

### Obrigatórios

| Elemento | Descrição |
|----------|-----------|
| Objetivo compreensível | O jogador deve entender o que fazer em até 5 segundos |
| Área principal de jogo | Canvas, DOM ou grade onde a ação ocorre |
| Feedback visual | Indicação clara de acerto, erro ou progresso |
| Resultado | Tela ou indicador informando vitória, derrota ou desempenho |
| Retorno ao tabuleiro ou fluxo anterior | O minigame não bloqueia a partida indefinidamente |
| Resolução compatível com bot | A máquina deve conseguir completar ou pular o minigame |

### Condicionais (aplicáveis conforme o design de cada minigame)

| Elemento | Quando aplicar |
|----------|---------------|
| Título | Quando o minigame precisa ser identificado nominalmente |
| Cronômetro | Quando há limite de tempo |
| Indicador de progresso | Quando há meta quantificável (ex: combinações, pontos) |
| Vidas | Quando há tentativas limitadas |
| Pontuação | Quando há sistema de pontos |
| Tutorial / instrução | Quando a mecânica não é autoexplicativa |
| Botão "Pular" | Quando há fluxo de bot ou o jogador pode optar por sair |
| Contagem regressiva (3, 2, 1) | Quando o início do jogo precisa de preparação |
| Retorno automático | Quando o jogador pode ficar ocioso na tela de resultado |

### Componentes de UI (herdados do MeteoroGame)

Os seletores CSS abaixo formam a base de todo minigame. Novos minigames devem reutilizar a mesma estrutura de overlay, container, result card e bot bar:

.minigame-overlay          → Overlay fullscreen (z-index: 1500, rgba(0,0,0,0.85))
.minigame-content          → Card central com gradiente
.minigame-header           → Título + instrução
.minigame-container        → Área do jogo (canvas/DOM)
.minigame-result-card      → Card glass sobre frozen scene
.minigame-card-content     → Inner card com gradiente e borda
.minigame-card-icon        → Ícone do resultado (🚀 / 💥)
.minigame-card-title       → Título (MISSÃO COMPLETA! / MISSÃO FALHOU)
.minigame-card-desc        → Descrição do resultado
.minigame-card-bonus       → Bônus obtido (+3 casas)
.minigame-card-countdown   → Contagem regressiva
.minigame-card-btn         → Botão "Voltar agora"
.minigame-bot-bar          → Barra de status da máquina

## 5. Público-Alvo e Dificuldade

O Lara World é voltado para crianças de aproximadamente 3 a 10 anos. Todo minigame deve seguir estas diretrizes:

- Regras compreensíveis em até 5 segundos de observação
- Mínimo de texto — ícones e cores comunicam a ação
- Botões e elementos interativos com no mínimo 48px de altura (touch infantil)
- Feedback visual claro para acerto e erro (nunca apenas som)
- Controles simples — no máximo 2 ações simultâneas
- Evitar punição excessiva: derrota não deve ser frustrante
- Sem tutoriais longos — no máximo 1 linha de instrução
- Sem menus complexos — o fluxo é linear e guiado

### Dificuldade por faixa etária

| Faixa | Abordagem |
|-------|-----------|
| 3-5 anos | Sucesso garantido com esforço mínimo (quase sempre vence) |
| 6-8 anos | Desafio leve — maioria vence na primeira tentativa |
| 9-10 anos | Desafio moderado — derrota ocasional é aceitável |
## 6. Mobile / Touch

Todo minigame deve funcionar em dispositivos touch sem adaptação especial. Diretrizes obrigatórias:

- Controles touch-native: toque, arraste/swipe, tap (não apenas teclado)
- `touch-action: none` na área de jogo para evitar gestos do navegador
- Peças e controles com tamanho mínimo de 48×48px (ideal: 64×64px)
- Layout responsivo: grade e elementos se ajustam ao viewport
- Sem scroll acidental durante o jogo (overflow: hidden no body/overlay)
- Possibilidade de jogar com uma mão (quando viável)
- Nenhum elemento essencial fora da tela em viewports ≥320px de largura
- Canvas dimensionado via `ResizeObserver` ou equivalente

### Referência — MeteoroGame (Implementado)

| Aspecto | Implementação |
|---------|---------------|
| Touch | Arraste relativo (touchstart → touchmove → touchend) |
| Mouse | Pointer events (mousedown → mousemove → mouseup) |
| Teclado | Setas + WASD (keydown, sem repeat delay) |
| Canvas | `touch-action: none`, resize dinâmico via `resizeCanvas()` |
| Hitbox | Inset de 10% no nav sprite (tolera toque impreciso) |

## 7. Resultado e Retorno

Todo minigame retorna um resultado conceitual com esta estrutura:

```
{
  venceu: boolean,      // true = objetivo alcançado
  boardDelta: number,   // positivo = avança casas, zero = sem alteração, negativo = retrocede
  progresso: {
    atual: number,      // valor atual da métrica principal (ex: combinações feitas)
    objetivo: number    // valor necessário para vencer (ex: 5 combinações)
  },
  motivo: string,       // descrição legível do resultado
  stats: object         // espaço reservado para métricas extras por minigame
}
```

### Comportamento no tabuleiro

| `boardDelta` | Ação |
|---|---|
| > 0 | Jogador avança `boardDelta` casas. Animação de movimento. Se ultrapassar casa 20, vitória. |
| = 0 | Jogador permanece onde está. Nenhuma penalidade. |
| < 0 | Jogador retrocede `abs(boardDelta)` casas. |

### MeteoroGame (implementado)

O MeteoroGame retorna atualmente:
`{ status: 'success'|'fail', bonus: 3|0, lives: 0..3, timeLeft: 0..20 }`

**Decisão de design recomendada para o MeteoroGame:**
- Vitória: `boardDelta: +3`
- Derrota: `boardDelta: 0` (sem retrocesso)

> ✅ **Divergência resolvida (DMP-01)**: a auditoria confirmou que o código atual (`boardDelta 0 na derrota`) é o comportamento correto e intencional. `docs/regras-do-jogo.md` foi atualizado para remover a penalidade de -2. Documentações anteriores mencionavam penalidade de -2, mas a auditoria confirmou que ela nunca era aplicada no fluxo atual. A regra oficial foi consolidada como boardDelta 0 na derrota.

### Tela de resultado

Após o fim do jogo, com 1 segundo de delay (jogo congelado visível ao fundo):

1. Header do minigame é ocultado
2. Card glass é exibido centralizado com:
   - Ícone do resultado (sucesso/fracasso)
   - Título do resultado
   - Descrição textual
   - Bônus obtido (se houver)
   - Contagem regressiva (intervalo recomendado: 3 a 5 segundos)
   - Botão "Voltar agora" (retorno imediato)
3. Ao clicar "Voltar agora" ou ao fim da contagem:
   - Área de jogo é removida
   - Card é ocultado
   - Overlay é ocultado
   - Promise é resolvida

O tempo de retorno automático é configurável. A recomendação é 3 a 5 segundos, mas cada minigame pode definir seu próprio intervalo.

## 8. Fluxo da Máquina (Bot)

Todo minigame precisa prever dois fluxos distintos:

### Fluxo humano

O jogador joga normalmente.

### Fluxo da máquina (bot)

O bot não interage com a área de jogo. Em vez disso:

1. Barra "🤖 Máquina está jogando..." com progresso visual é exibida
2. Botão "⏭ Pular" permite ao jogador humano acelerar o processo
3. Timer de auto-resolve é iniciado (padrão: 6 segundos)
4. Ao fim do timer (ou clique em Pular):
   - O jogo real é interrompido (se iniciado)
   - Um resultado é simulado com base na dificuldade do bot
   - A tela de resultado é exibida (mesmo fluxo do humano, sem delay de 1s)
5. O resultado simulado deve ser coerente com a `botSuccessRate` configurada
6. O tempo máximo de resolução não deve bloquear a partida

### Taxa de sucesso

A chance de sucesso do bot **não é fixa**. Cada minigame define sua própria taxa através de uma propriedade `botSuccessRate`. O valor deve ser escolhido com base na dificuldade pretendida, no público-alvo e na filosofia de design do mundo.

### MeteoroGame (implementado)

| Propriedade | Valor |
|-------------|-------|
| `botSuccessRate` | 0.40 |
| Auto-resolve | 6 segundos |
| Skip | Botão "⏭ Pular" resolve imediatamente |

### Ocean Match-3 (especificado, não implementado)

| Propriedade | Valor |
|-------------|-------|
| `botSuccessRate` | 0.60 |
| Auto-resolve | 6 segundos |
| Skip | Sim, mesmo padrão |

A taxa de 0.60 para o Ocean Match-3 segue a filosofia infantil não punitiva e mantém coerência com a taxa de acerto dos desafios educativos (60%).

> ✅ O Ocean Match-3 **está registrado** no MinigameRegistry. A implementação atual exibe uma grade 6×6 com 5 tipos de peça, HUD provisório e botões de simulação de vitória/falha. A mecânica real (troca, combinações, cascatas) será implementada em sprints futuras.

## 9. Restrições

Minigames não devem possuir, salvo decisão futura explícita:

- Sistema de loja
- Moedas próprias
- Monetização
- Campanhas internas
- Múltiplos níveis
- Vidas persistentes (entre partidas)
- Ranking próprio
- Boosters
- Árvore de progressão
- Sistemas que concorram com o tabuleiro principal

---

## 10. MinigameHost — Host Genérico de Minigames

O `MinigameHost` é um módulo da engine (`src/minigames/engine/minigame-host.js`) que centraliza o fluxo compartilhado de todos os minigames. Ele separa as responsabilidades de apresentação e ciclo de vida dos detalhes internos de cada minigame.

### Responsabilidades do host

1. Buscar a configuração do minigame no `MinigameRegistry`
2. Preparar o overlay e a área de jogo
3. Preencher título e instrução a partir de `presentation`
4. Inicializar o minigame via `config.create(options)`
5. Aguardar o resultado
6. Normalizar o resultado via `normalizeMinigameResult`
7. Exibir o card de resultado genérico
8. Gerenciar o retorno automático (countdown) ou imediato ("Voltar agora")
9. Resolver a Promise com o resultado normalizado

### Responsabilidades do game.js

- Detectar a casa especial que dispara o minigame
- Bloquear ou liberar o turno
- Aplicar `boardDelta` à posição do jogador
- Atualizar o histórico
- Reposicionar o jogador
- Continuar a partida

O host **não** altera `gameState`, `players[]`, nem conhece mundos ou jogadores globais.

### API

```js
import { launchMinigameHost } from './minigames/engine/minigame-host.js';

const result = await launchMinigameHost('meteor-game', {
  isBot: false,
  playerName: 'Lara'
});
// result: { venceu, boardDelta, progresso, motivo, stats }
```

### Campos de configuração

Cada minigame registrado pode conter:

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | `string` | Sim | Identificador kebab-case |
| `name` | `string` | Sim | Nome legível |
| `create` | `function` | Sim | Fábrica que retorna instância do jogo |
| `botSuccessRate` | `number` | Não (default 0.5) | Taxa de sucesso do bot (0.0 a 1.0) |
| `autoReturnSeconds` | `number` | Não (default 5) | Segundos do countdown automático |
| `presentation` | `object` | Não | Textos e ícones exibidos pelo host |
| `rewards` | `object` | Não | `boardDelta` para sucesso e falha |

### `presentation`

| Campo | Uso | Default |
|-------|-----|---------|
| `title` | Título do minigame no header | `config.name` |
| `instruction` | Instrução curta | `''` |
| `botMessage` | Mensagem exibida na barra do bot | `''` |
| `successIcon` | Ícone do card de vitória | `🚀` |
| `successTitle` | Título do card de vitória | `'Missão concluída!'` |
| `successMessage` | Descrição do card de vitória | `''` |
| `failureIcon` | Ícone do card de derrota | `💥` |
| `failureTitle` | Título do card de derrota | `'Fim da missão'` |
| `failureMessage` | Descrição do card de derrota | `''` |

### `rewards`

| Campo | Default | Descrição |
|-------|---------|-----------|
| `successBoardDelta` | `3` | Casas avançadas na vitória |
| `failureBoardDelta` | `0` | Casas avançadas/retrocedidas na derrota |

### MeteoroGame (migrado)

O `meteor-game` foi o primeiro minigame migrado para o host genérico:

```js
{
  id: 'meteor-game',
  name: 'Chuva de Meteoros',
  botSuccessRate: 0.40,
  autoReturnSeconds: 5,
  presentation: {
    title: 'Buraco de Minhoca',
    instruction: 'Desvie dos meteoros e sobreviva!',
    botMessage: 'A Máquina está atravessando a chuva de meteoros...',
    successIcon: '🚀',
    successTitle: 'Missão concluída!',
    successMessage: 'Você atravessou a chuva de meteoros.',
    failureIcon: '💥',
    failureTitle: 'Fim da missão',
    failureMessage: 'Sua nave sofreu muitos danos.'
  },
  rewards: {
    successBoardDelta: 3,
    failureBoardDelta: 0
  }
}
```

### Fluxo humano

1. Host busca config no registry
2. Preenche `#minigame-title` e `#minigame-instructions` com `presentation`
3. Chama `config.create({ container, onComplete })`
4. Minigame executa e chama `onComplete(resultadoAdaptado)`
5. Host normaliza, exibe result card, inicia countdown
6. Jogador clica "Voltar agora" ou countdown expira
7. Host oculta overlay e resolve Promise

### Fluxo do bot

1. Host exibe barra "🤖 Máquina está jogando..." com botão "⏭ Pular"
2. Timer de 6 segundos é iniciado
3. Ao fim do timer (ou clique em Pular):
   - Instância do minigame é interrompida (se iniciada)
   - Resultado simulado com `Math.random() < botSuccessRate`
   - `boardDelta` definido por `rewards.successBoardDelta` ou `rewards.failureBoardDelta`
   - Resultado normalizado e exibido no result card
   - Countdown inicia e Promise é resolvida

---

# Ocean Match-3 — Especificação Funcional

## 1. Conceito

Minigame curto de combinação de peças marinhas. O jogador troca duas peças adjacentes para formar grupos de 3 ou mais peças iguais. A mecânica é inspirada em jogos do gênero Match-3 (como Candy Crush), porém significativamente simplificada para se adequar ao público infantil e ao fluxo rápido do Lara World.

O jogo ocorre dentro do ecossistema do **Reino dos Oceanos** — tema visual aquático com corais, bolhas e vida marinha.

## 2. Duração

| Propriedade | Valor |
|-------------|-------|
| Duração | 45 segundos (padrão), configurável via debug para 20s, 30s, 45s, 60s ou ∞ |
| Contagem inicial | 3, 2, 1 |
| Momento de início | Após instrução + contagem regressiva |
| Configuração via opções | `new OceanMatch3(container, onComplete, { timeLimit: 60 })` |
| Modo sem limite | `{ noTimerLimit: true }` — não inicia cronômetro; ∞ exibido no HUD |
| Valor padrão (`DEFAULT_TIME_LIMIT`) | 45 |
| Fallback para inválido | Valor não-inteiro, ≤0 ou ausente usa DEFAULT_TIME_LIMIT (45) |

## 3. Tabuleiro

| Propriedade | Valor |
|-------------|-------|
| Grade | 6 × 6 |
| Total de peças | 36 |
| Tipos de peça | 5 |
| Layout | Grid regular, centralizado no container |

### Peças temáticas (placeholders)

| Peça | Placeholder atual | Tipo |
|------|-------------------|------|
| Peixe | 🐟 | Comum |
| Polvo | 🐙 | Comum |
| Caranguejo | 🦀 | Comum |
| Concha | 🐚 | Comum |
| Estrela-do-mar | ⭐ | Comum |

> **Nota**: emojis e símbolos são placeholders e poderão ser substituídos por assets próprios (.webp) seguindo a pipeline visual do projeto. O fallback deve ser o emoji correspondente (padrão adotado em avatares, tokens e world-icons).

### Tecnologia (aprovado)

| Decisão | Valor |
|---------|-------|
| Renderização | DOM + CSS Grid |
| Peças | Elementos HTML interativos |
| Canvas | Não utilizado na primeira versão |
| Animações | CSS transitions e keyframes |

Justificativa: apenas 36 peças tornam o DOM viável sem perda de performance. CSS Grid oferece responsividade nativa, touch mais simples de implementar, melhor acessibilidade (leitores de tela, foco teclado), manutenção mais direta e animações CSS suficientes para swap, cascata e feedback visual.

## 4. Controles

| Método | Funcionamento |
|--------|---------------|
| Mouse/Clique | Clique na peça A → clique na peça B adjacente → troca |
| Touch/Swipe | Toque + arraste da peça A para peça B adjacente → troca |
| Teclado | Não obrigatório (pode ser implementado como bônus) |

### Regras de troca

- Trocas permitidas apenas entre peças **horizontal ou verticalmente adjacentes**
- Trocas diagonais **não são permitidas**
- A troca só é confirmada se formar **pelo menos uma combinação válida** de 3+
- Se a troca não formar combinação:
  - Peças retornam às posições originais (animação reversa)
  - Feedback visual de "jogada inválida" (shake ou flash breve)
  - Nenhuma penalidade (progresso não é perdido, tempo continua)

## 5. Validação da Jogada

Algoritmo de validação:
1. Identificar as duas peças selecionadas (origem e destino)
2. Executar a troca visualmente
3. Verificar se a nova configuração contém grupos de 3+ peças iguais
4. Se sim: manter a troca, resolver combinações
5. Se não: desfazer a troca, exibir feedback

### Detecção de combinações

- Varredura horizontal: para cada linha, identificar sequências de 3+ peças iguais
- Varredura vertical: para cada coluna, identificar sequências de 3+ peças iguais
- Uma peça pode pertencer a uma combinação horizontal e uma vertical simultaneamente
## 6. Combinações

| Propriedade | Regra |
|-------------|-------|
| Combinação mínima | 3 peças iguais alinhadas |
| Direções válidas | Horizontal e vertical |
| Grupos de 4 | Contam como 1 combinação concluída |
| Grupos de 5 | Contam como 1 combinação concluída |
| Peças especiais | Nenhuma (sem bombas, boosters, etc.) |
| Efeitos especiais | Nenhum (sem explosões, chain reactions visuais) |

Cada grupo resolvido conta como **1 combinação** para o progresso, independentemente do tamanho do grupo.

## 7. Cascata

### Decisão aprovada

Após a remoção das peças combinadas:

1. Peças acima do espaço vazio **descem** para preenchê-lo
2. Novas peças **entram no topo** da coluna para preencher os espaços restantes
3. Se a queda formar **novas combinações automáticas**, elas são resolvidas
4. Cada grupo resolvido na cascata conta para o progresso
5. A cascata continua até que nenhuma nova combinação seja formada

### Proteção contra loop

- Um limite máximo de 5 cascatas consecutivas por jogada é aplicado
- Ao atingir o limite, o tabuleiro é estabilizado forçadamente

A cascata é essencial para dar dinamismo ao jogo e é uma mecânica central do gênero Match-3. Para crianças pequenas, a cascata automática cria uma sensação de progresso contínuo mesmo com poucas jogadas manuais.

## 8. Objetivo

| Propriedade | Valor |
|-------------|-------|
| Objetivo | Completar **5 combinações** |
| Indicador | "Combinações: X / 5" + 5 marcadores visuais (● ● ○ ○ ○) |
| Limite de tempo | 30 segundos (padrão); configurável |

## 9. Vitória

- Vitória é **imediata** ao atingir 5 combinações
- O cronômetro é interrompido
- A tela de resultado é exibida (sucesso)
- Bônus é aplicado ao retornar ao tabuleiro

## 10. Derrota

- Ocorre quando o cronômetro chega a 0:00 antes de completar 5 combinações
- A tela de resultado é exibida (fracasso)
- Penalidade (se houver) é aplicada ao retornar ao tabuleiro

## 11. Recompensa

### Regra aprovada

| Combinações realizadas | `boardDelta` |
|------------------------|--------------|
| 0 — 2 | 0 (sem avanço) |
| 3 — 4 | +1 |
| 5+ | +3 |

Não há penalidade por derrota. Derrota significa apenas ausência de bônus máximo. O `boardDelta` é sempre ≥ 0.

### Comparação com o MeteoroGame

| Aspecto | MeteoroGame | Ocean Match-3 |
|---------|-------------|---------------|
| Condição de vitória | Sobreviver 20s | Completar 5 combinações |
| `boardDelta` na vitória | +3 | +3 |
| `boardDelta` na derrota | 0 | 0 |
| Progresso parcial | Não se aplica | Bônus reduzido para progresso parcial |

### Racional

- A faixa 0-2 (boardDelta 0) evita frustração em crianças pequenas
- A faixa 3-4 (+1) recompensa o esforço parcial
- A faixa 5+ (+3) equipara ao bônus máximo do MeteoroGame
- A ausência de penalidade mantém coerência com a filosofia infantil não punitiva do projeto

### Status da implementação (Sprint UX — Ajustes de Tempo, Instruções e Debug)

| Item | Status |
|------|--------|
| Grade 6×6 | ✅ Implementada |
| 5 tipos de peça | ✅ Implementados |
| Geração aleatória | ✅ Implementada |
| Renderização DOM + CSS Grid | ✅ Implementada |
| HUD (Combinações: X/5, Tempo: 45s, indicador visual ● ● ○ ○ ○) | ✅ Implementado |
| Botões de simulação (vitória/falha) | ✅ Aparecem apenas com `?debug=1` |
| Peças interativas (`<button>` com `aria-label` e `aria-pressed`) | ✅ Implementado |
| CSS responsivo (≥320px sem overflow) | ✅ Implementado |
| Seleção por clique/tap | ✅ Implementada |
| Destaque visual da peça selecionada (brilho + borda + escala 1.15 + fundo) | ✅ Implementado |
| Validação de adjacência | ✅ Implementada |
| Troca entre peças adjacentes | ✅ Implementada |
| Troca no modelo e DOM consistentes | ✅ Implementado |
| Animação de troca (swap pulse) | ✅ Implementado |
| Clique não adjacente move seleção | ✅ Implementado |
| Debug progressivo (Estado Match-3, Regenerar Grade) | ✅ Implementado |
| Detecção de combinações (horizontal + vertical) | ✅ Implementada |
| Validação de jogada com desfazer | ✅ Implementada |
| Feedback visual (match highlight verde, invalid shake vermelho) | ✅ Implementado |
| Célula vazia (`null`) como modelo oficial | ✅ Implementado |
| Renderização de célula vazia (classe `.ocean-match3-piece--empty`) | ✅ Implementado |
| Clique em célula vazia ignorado | ✅ Implementado |
| Cascata e gravidade (remoção → cair → preencher → repetir, máx 5) | ✅ Implementado |
| Remoção de peças combinadas (substituição por `null`) | ✅ Implementado |
| Animação de remoção (scale 0.3 + fade) | ✅ Implementado |
| Animação de queda (translateY 0.15s) | ✅ Implementado |
| Progresso real (combinações contador dinâmico + 5 dots visuais) | ✅ Implementado |
| Vitória imediata ao atingir 5 combinações | ✅ Implementado |
| boardDelta escalonado no fim do tempo (0-2: 0, 3-4: +1) | ✅ Implementado |
| Timer real (45s padrão, começa após DOM renderizado) | ✅ Implementado |
| Modo sem limite (∞, sem cronômetro, sem conclusão por tempo) | ✅ Implementado |
| Tempo configurável via opções (`{ timeLimit: 60 }`) | ✅ Implementado |
| Controles de debug (20s, 30s, 45s, 60s, ∞) no painel `?debug=1` | ✅ Implementado |
| Botão "🔄 Reiniciar Match-3" no painel debug | ✅ Implementado |
| Instrução curta "Clique em uma peça e depois em uma peça ao lado. Forme linhas de 3 iguais!" | ✅ Implementado |
| 272 testes automatizados | ✅ Implementados |
| Swipe (touch drag) | ⏳ Pendente |
| Assets .webp próprios | ⏳ Futuro |

## 12. Acesso ao Minigame (aprovado)

| Decisão | Valor |
|---------|-------|
| Disparo | Casa especial no tabuleiro do Reino dos Oceanos |
| Portal | Não utilizado (portais são reservados para Áreas Especiais e submundos) |
| Retorno | Para o mesmo mundo, após aplicação do resultado |

Na primeira versão, o Ocean Match-3 é acessado exclusivamente por uma casa especial já existente no layout do Reino dos Oceanos. Não há portal adicional. O retorno é sempre para o tabuleiro de onde o jogador saiu, após a aplicação do `boardDelta`.

## 13. Interface / HUD

A interface durante o jogo exibe apenas:

| Elemento | Posição | Detalhes |
|----------|---------|----------|
| Título | Header (esquerda) | "🌊 Ocean Match" |
| Tempo | Header (direita) | "Tempo: 18s", vermelho se < 5s |
| Progresso | Abaixo do header | Barra visual de 5 segmentos + "Combinações: 4/5" |
| Tabuleiro | Área central | Grade 6×6 no .minigame-container |

Nada mais deve ser exibido durante o jogo. Sem botões extras, sem pontuação complexa, sem informações secundárias.

## 14. Resultado

### Vitória (5+ combinações)

| Elemento | Conteúdo |
|----------|----------|
| Ícone | 🐠 |
| Título | "MARAVILHA!" |
| Descrição | "Você limpou o recife!" |
| Bônus | "+3 casas" (ou +1 para 3-4 combinações) |
| Botão | "Voltar agora" |
| Countdown | "Voltando ao tabuleiro em 5..." |

### Derrota (0-4 combinações, tempo esgotado)

| Elemento | Conteúdo |
|----------|----------|
| Ícone | 🌊 |
| Título | "TEMPO ACABOU!" |
| Descrição | "Combinações: X/5" |
| Bônus | Oculto (se 0) / "+1 casa" (se 3-4) |
| Botão | "Voltar agora" |
| Countdown | "Voltando ao tabuleiro em 5..." |

## 15. Fluxo da Máquina (Bot)

Quando a máquina cair na casa que dispara o Ocean Match-3:

1. Exibir barra "🤖 Máquina está jogando..." com botão "⏭ Pular"
2. Timer de 6 segundos é iniciado
3. Tabuleiro Match-3 **não é renderizado** (apenas a barra de status)
4. Ao fim do timer (ou clique em Pular):
   - Resultado é simulado com `botSuccessRate: 0.60`
   - Se vitória: 5 combinações simuladas
   - Se derrota: 2-3 combinações simuladas
   - Tela de resultado é exibida (1 segundo, sem countdown)
   - Retorno ao tabuleiro

### Resultado simulado

```
{
  venceu: Math.random() < 0.60,
  boardDelta: venceu ? 3 : (combinacoes >= 3 ? 1 : 0),
  progresso: {
    atual: venceu ? 5 : Math.floor(Math.random() * 3) + 1,
    objetivo: 5
  },
  motivo: venceu ? "Recife limpo!" : "Tempo acabou!",
  stats: {}
}
```

## 16. Áudio e Feedback

Documentação para etapa futura de polimento. Sons sugeridos:

| Momento | Som | Status |
|---------|-----|--------|
| Seleção de peça | minigameSelect | Futuro |
| Troca de peças | minigameSwap | Futuro |
| Combinação formada | minigameMatch | Futuro |
| Jogada inválida | minigameInvalid | Futuro |
| Vitória | minigameVictory | Futuro |
| Tempo esgotado | minigameTimeout | Futuro |
| Cascata | minigameCascade (opcional) | Futuro |

A infraestrutura de áudio já existe (`src/audio/`, `AudioManager`, catálogo em `sounds.js`). A integração segue o mesmo padrão do MeteoroGame (chamadas a `audioManager.play('chave')` com fallback silencioso).

## 17. Acessibilidade e UX

| Requisito | Diretriz |
|-----------|----------|
| Diferenciação visual | Peças devem ter formas distintas (não apenas cor) |
| Contraste | Taxa de contraste mínima de 3:1 entre peças e fundo |
| Feedback de seleção | Peça selecionada ganha borda/destaque (ex: glow, scale 1.1) |
| Feedback de troca inválida | Shake suave + fade temporário nas peças |
| Leitura em telas pequenas | Peças mínimas de 48×48px em viewport ≥320px |
| Animações | Suporte futuro a prefers-reduced-motion |
| Touch | Sem dependência de hover |
| Cor | Nunca usar cor como único diferenciador entre peças |
---

# Decisões Aprovadas, Recomendadas e Pendentes

## Decisões Aprovadas

| ID | Decisão | Fundamento |
|----|---------|------------|
| DMG-01 | Duração padrão de 45s para Ocean Match-3 (20s para MeteoroGame); configurável via debug para 20s, 30s, 45s, 60s ou ∞ | Ocean Match-3 requer mais tempo devido à mecânica de combinação; 45s oferece janela confortável para crianças; debug permite teste em diferentes velocidades |
| DMG-02 | Fluxo comum (evento → instrução → contagem → jogo → resultado → retorno) como referência, não como obrigação | MeteoroGame validou o fluxo; novos minigames podem adaptá-lo |
| DMG-03 | HUD mínima (título, cronômetro, progresso, área de jogo) | Evita poluição visual; foco na ação |
| DMG-04 | Result card com glass blur sobre frozen scene | MeteoroGame validou; jogador vê o estado final do jogo |
| DMG-05 | Retorno com countdown configurável (3-5s) + botão "Voltar agora" | MeteoroGame validou; jogador controla o ritmo; cada minigame define seu intervalo |
| DMG-06 | Bot com barra + skip + auto-resolve 6s | MeteoroGame validou; não bloqueia a partida |
| DMG-07 | `boardDelta` na derrota = 0 (sem penalidade) | Consistente com o código atual do MeteoroGame; evita frustração infantil |
| DMG-08 | Sem peças especiais, bombas, boosters na primeira versão | Mantém o jogo simples e alinhado ao público 3-10 anos |
| DMG-09 | Cascata com limite de 5 ciclos por jogada | Mecânica central do Match-3; limite previne loops infinitos |
| DMG-10 | Grade 6×6, 5 tipos de peça | Tamanho adequado para mobile; variedade suficiente sem ser confusa |
| DMG-11 | Tecnologia DOM + CSS Grid para o Ocean Match-3 | 36 peças viabilizam DOM sem perda; melhor acessibilidade, touch e manutenção |
| DMG-12 | Disparo por casa especial (sem portal) | Portais reservados para Áreas Especiais e submundos |
| DMG-13 | Placeholders emoji no MVP; estrutura preparada para assets futuros | Sem dependência de assets definitivos para iniciar implementação |
| DMG-14 | Recompensa escalonada (0-2: boardDelta 0, 3-4: +1, 5+: +3) | Recompensa progresso parcial sem punir; alinhada ao público infantil |
| DMG-15 | Vitória imediata ao atingir 5 combinações | Evita tempo ocioso; recompensa imediata |
| DMG-16 | Tabuleiro não renderizado para o bot (apenas barra de status) | Economia de recursos; bot não interage com o jogo |
| DMG-17 | `botSuccessRate` configurável por minigame (não fixa) | Cada minigame define sua própria dificuldade para o bot |
| DMG-18 | Célula vazia representada por `null` no modelo interno | Representa ausência de peça de forma natural; simplifica gravidade, reposição e debug; permite verificações claras (`grid[row][col] === null`); `null` nunca forma combinação; `null` interrompe sequências de match; célula vazia não é interativa |

## Decisões Pendentes

| ID | Questão | Contexto | Impacto |
|----|---------|----------|---------|
| ~~DMP-01~~ | ~~Divergência MeteoroGame: `docs/regras-do-jogo.md` documenta -2, código atual aplica boardDelta 0~~ | ~~Decisão de design recomenda boardDelta 0. Documentação e código precisam ser auditados para alinhamento~~ | ~~Média — inconsistência entre documento e implementação; deve ser resolvida antes de qualquer correção no MeteoroGame~~ |
| DMP-05 | Sons: criar chaves novas no catálogo ou reutilizar as existentes? | MeteoroGame não usa sons. `sounds.js` tem 16 chaves mas nenhuma específica para minigame | Baixo; pode ser decidido na sprint de áudio |
| DMP-07 | Definição de assets oficiais para as peças do Ocean Match-3 | Placeholders emoji aprovados para MVP; assets .webp podem substituí-los futuramente | Visual; não afeta mecânica. Seguir padrão de fallback (asset → emoji) |
| DMP-08 | Acessos alternativos aos minigames (menu dedicado, modo livre, conquistas, etc.) | Direção de produto prevê expansão futura; sem definição de cronograma | Baixo agora; arquitetura já contempla flexibilidade
