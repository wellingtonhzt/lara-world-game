# Sistema de Áudio — Lara World

## 1. Visão Geral

O sistema de áudio do Lara World foi projetado para ser centralizado, resiliente e de baixo acoplamento. Toda reprodução sonora passa obrigatoriamente pelo `AudioManager`, que encapsula a Web Audio API e gerencia volumes, mute, persistência e tolerância a falhas de assets ausentes.

### Objetivos
- Centralizar todo controle de áudio em um único ponto
- Isolar o jogo da complexidade da Web Audio API
- Garantir que sons nunca quebrem o jogo (engolem erros silenciosamente)
- Persistir preferências de volume/mute entre sessões
- Suportar autoplay bloqueado por navegadores sem intervenção manual

---

## 2. Arquitetura

### 2.1 Componentes

```
┌─────────────────────────────────────────────────────────┐
│                    AudioManager                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Catalog  │  │  Audio   │  │  Settings (localStor) │  │
│  │ (sounds) │  │ Context  │  │  masterVol, musicVol, │  │
│  │ (key →   │  │          │  │  effectsVol, muted    │  │
│  │  path)   │  │ Master → │  └──────────────────────┘  │
│  │          │  │  Music   │                            │
│  │          │  │  Effects │                            │
│  └──────────┘  └──────────┘                            │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Fluxo de Reprodução

1. **Registro**: `init()` percorre o catálogo `sounds.js` e registra cada entrada em `this._sounds`
2. **Play**: `play(key)` busca a entrada → verifica `muted` → verifica `category === 'effects'` → cria `AudioContext` (lazy) → faz fetch do arquivo → decodifica → conecta ao `effectsGain` → inicia
3. **Music**: `playMusic(key)` mesma lógica, mas usa `musicGain`, faz `loop = true`, e para a música anterior automaticamente
4. **Erro**: qualquer falha (arquivo não encontrado, decode error, AudioContext suspenso) é silenciosamente ignorada — o jogo nunca quebra por áudio

### 2.3 Persistência

| Campo | Chave localStorage | Default |
|-------|-------------------|---------|
| Volume mestre | `laraAudioConfig.masterVolume` | 1.0 |
| Volume música | `laraAudioConfig.musicVolume` | 0.5 |
| Volume efeitos | `laraAudioConfig.effectsVolume` | 0.8 |
| Muted | `laraAudioConfig.muted` | false |

Salvo automaticamente a cada `setMasterVolume()`, `setMusicVolume()`, `setEffectsVolume()`, `mute()` e `unmute()`. Restaurado no construtor via `_loadSettings()`.

### 2.4 Limitação: Autoplay

Navegadores bloqueiam `AudioContext` até a primeira interação do usuário. O `AudioManager` lida com isso criando o contexto sob demanda e tentando `resume()` automaticamente. Se `play()` for chamado antes da interação, o áudio é simplesmente ignorado. Não há listener global de clique para desbloquear — o desbloqueio é passivo.

### 2.5 Sounds Ausentes (Degradação Graciosa)

Se o arquivo de áudio não existir no servidor, `fetch()` retorna 404 → `_decode()` lança erro → o catch silencia. O jogo continua funcionando normalmente. Isso permite cadastrar sons no catálogo antes mesmo dos assets estarem prontos.

---

## 3. Estrutura de Diretórios

```
src/
├── audio/                      # Módulo de áudio
│   ├── AudioManager.js         # Classe gerenciadora (Web Audio API)
│   ├── sounds.js               # Catálogo de sons (chaves simbólicas)
│   └── index.js                # Instância singleton exportada
│
└── assets/
    └── audio/                  # Assets de áudio (arquivos .webm)
        ├── ui/                 # Sons de interface
        │   ├── click.webm
        │   ├── modal-open.webm
        │   └── modal-close.webm
        ├── dice/               # Sons de dados
        │   ├── roll.webm
        │   └── result.webm
        ├── board/              # Sons do tabuleiro
        │   ├── move.webm
        │   ├── advance.webm
        │   ├── back.webm
        │   ├── portal.webm
        │   └── treasure.webm
        ├── quiz/               # Sons de desafios
        │   ├── challenge.webm
        │   ├── correct.webm
        │   └── wrong.webm
        ├── rewards/            # Sons de recompensa
        │   ├── victory.webm
        │   └── gameover.webm
        └── music/              # Músicas de fundo
            └── bg-loop.webm
```

---

## 4. API Pública

### 4.1 Inicialização

```js
import { audioManager } from './audio/index.js';

audioManager.init();       // Registra sons do catálogo
                           // (chamado no bootstrap do jogo)
```

### 4.2 Efeitos Sonoros

| Método | Descrição |
|--------|-----------|
| `play(key)` | Toca efeito pela chave simbólica. Ignora se chave inválida, se `muted`, se asset inexistente ou se categoria não for `'effects'` |
| `stop(key)` | Para um efeito sonoro específico (se estiver tocando) |

### 4.3 Música

| Método | Descrição |
|--------|-----------|
| `playMusic(key)` | Toca música em loop. Para a música anterior automaticamente. Ignora se chave inválida, `muted`, asset inexistente ou categoria não for `'music'` |
| `stopMusic()` | Para a música atual e limpa referências |

### 4.4 Volume

| Método | Descrição |
|--------|-----------|
| `setMasterVolume(v)` | Volume geral (0–1). Persiste automaticamente |
| `setMusicVolume(v)` | Volume da música (0–1). Persiste automaticamente |
| `setEffectsVolume(v)` | Volume dos efeitos (0–1). Persiste automaticamente |

### 4.5 Mute

| Método | Descrição |
|--------|-----------|
| `mute()` | Muta todo áudio. Persiste. Para música se estiver tocando |
| `unmute()` | Restaura áudio. Persiste |
| `toggleMute()` | Alterna mute. Retorna `true` (mutado) ou `false` (desmutado) |
| `isMuted()` | Retorna `boolean` do estado atual |

### 4.6 Propriedades

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `masterVolume` | number (0–1) | Volume mestre atual |
| `musicVolume` | number (0–1) | Volume da música atual |
| `effectsVolume` | number (0–1) | Volume dos efeitos atual |
| `muted` | boolean | Estado de mute |
| `_ctx` | AudioContext | Contexto Web Audio (criado sob demanda) — **uso interno** |

---

## 5. Integração com o Jogo

As chamadas de áudio estão inseridas em `src/game.js`. Toda integração usa `audioManager.play()` para efeitos e `audioManager.playMusic()` para música.

### 5.1 Efeitos Integrados

| Evento no Jogo | Chave | Função |
|---------------|-------|--------|
| Clique "⚡ Jogo Rápido" | `buttonClick` | `setupMenuEvents()` |
| Clique em card de mundo | `buttonClick` | `setupWorldSelectorEvents()` |
| Clique "← Menu Principal" | `buttonClick` | `setupWorldSelectorEvents()` |
| Clique "Iniciar Jogo" (modal) | `buttonClick` | `setupModalEvents()` |
| Clique "Jogar Novamente" (vitória) | `buttonClick` | `init()` |
| Clique "Voltar ao Menu" (vitória) | `buttonClick` | `init()` |
| Dado rolado (jogo) | `diceRoll` | `jogarDado()` |
| Resultado do dado exibido (jogo) | `diceResult` | `jogarDado()` |
| Dado rolado (sorteio antes do jogo) | `diceRoll` | `waitForPlayerRoll()` |
| Resultado do dado (sorteio) | `diceResult` | `waitForPlayerRoll()` |
| Movimento do jogador (por passo) | `playerMove` | `animatePlayerMovement()` |
| Casa especial "avançar" | `specialAdvance` | `processSpecialCell()` |
| Casa especial "voltar" | `specialBack` | `processSpecialCell()` |
| Casa especial "portal" | `portal` | `processSpecialCell()` |
| Abertura de desafio (quiz) | `challengeOpen` | `processSpecialCell()` |
| Resposta correta | `correctAnswer` | `processSpecialCell()` / `resolveChallenge()` |
| Resposta errada | `wrongAnswer` | `processSpecialCell()` / `resolveChallenge()` |
| Vitória | `victory` | `handleVictory()` |

### 5.2 Sons Registrados mas Não Integrados

Estes sons estão no catálogo (`sounds.js`) mas **não são chamados em nenhum lugar do jogo** ainda:

| Chave | Tipo | Uso planejado |
|-------|------|--------------|
| `modalOpen` | effects | Abrir modal — substituir ausência atual |
| `modalClose` | effects | Fechar modal |
| `treasure` | effects | Casa especial "tesouro" — ainda não implementada |
| `gameOver` | effects | Tela de game over — ainda não implementada |
| `backgroundMusic` | music | Música ambiente — chamada `playMusic()` ainda não integrada |

> **Nota:** É seguro chamar qualquer uma dessas chaves mesmo sem integração — o `AudioManager` simplesmente ignora se o arquivo não existir.

---

## 6. Como Adicionar um Novo Efeito Sonoro

```mermaid
flowchart LR
    A[Criar .webm] --> B[Colocar em assets/audio/]
    B --> C[Adicionar entrada em sounds.js]
    C --> D[Chamar audioManager.play('chave') no jogo]
```

**Passo a passo:**

1. **Produza o áudio** no formato `.webm` (recomendado) ou `.mp3`/`.ogg`
2. **Coloque o arquivo** na subpasta apropriada em `src/assets/audio/` (ex: `board/move.webm`)
3. **Adicione a entrada** em `src/audio/sounds.js`:

```js
myNewSound: { path: 'assets/audio/board/my-sound.webm', category: 'effects' },
```

4. **Chame no código** do jogo:

```js
audioManager.play('myNewSound');
```

**Regras:**

- A categoria **deve** ser `'effects'` para sons tocados com `play()`
- O caminho é relativo à raiz do servidor (onde `index.html` está)
- Se o arquivo não existir, `play()` simplesmente não faz nada — sem erro no console

---

## 7. Como Adicionar Música de Fundo

```js
// Iniciar música (em loop)
audioManager.playMusic('backgroundMusic');

// Trocar música — para a anterior automaticamente
audioManager.playMusic('levelMusic');

// Parar música
audioManager.stopMusic();
```

**Regras:**

- A categoria no catálogo **deve** ser `'music'`
- A música toca em loop automaticamente (`source.loop = true`)
- `playMusic()` sempre para a música anterior antes de iniciar a nova
- O volume da música é independente dos efeitos (`setMusicVolume()`)

---

## 8. Boas Práticas

1. **Sempre passe pelo `AudioManager`** — nunca use `new Audio()` ou `HTMLAudioElement` diretamente no código do jogo
2. **Chamadas são seguras** — `audioManager.play('chaveQualquer')` nunca quebra o jogo
3. **Evite loops apertados** — não chame `play()` dentro de `requestAnimationFrame` ou loops sem throttle/debounce
4. **Prefira `.webm`** — melhor compressão/qualidade para web
5. **Trate sons como opcionais** — o jogo funciona sem assets de áudio
6. **Volumes razoáveis** — efeitos: 0.7–0.8; música: 0.3–0.5; mestre: 1.0
7. **Não acumule músicas** — use `playMusic()`, que para a anterior automaticamente
8. **Registre antes de usar** — `init()` deve ser chamado antes de qualquer `play()` (é chamado no bootstrap)
9. **Uma instância apenas** — use o singleton exportado, não crie `new AudioManager()` manualmente

---

## 9. Limitações Atuais

### 9.1 Sem Spatial Audio / Posicional
O sistema não suporta áudio 3D ou posicional (PannerNode). Todo som é mono/estéreo simples.

### 9.2 Sem Pooling de Sources
Cada `play()` cria um novo `AudioBufferSourceNode`. Para sons muito frequentes (ex: passos rápidos), múltiplas instâncias podem acumular. Não há reuso de nós.

### 9.3 Sem Fade In/Out
Não há transições suaves (crossfade) ao trocar de música. A troca é abrupta.

### 9.4 Sem Cache de AudioBuffer
O buffer decodificado não é armazenado em cache entre chamadas. Cada `play()` faz fetch e decode novamente.

### 9.5 Sem Fallback de Formato
Se o formato `.webm` não for suportado pelo navegador, o som não toca. Não há fallback para `.mp3` ou `.ogg`.

### 9.6 Sem Fila de Reprodução
Não é possível encadear sons (`play A → when done → play B`). Cada chamada é independente.

### 9.7 Sem Web Workers
O decode de áudio é feito na thread principal. Para arquivos grandes, pode causar pequenos engasgos.

### 9.8 Sem Testes Automatizados
Não há testes unitários ou de integração para o módulo de áudio.

---

## 10. Roadmap (Ideias Futuras)

1. **Cache de buffers** — evitar fetch/decode repetidos para o mesmo som
2. **Pool de sources** — reutilizar nós para sons frequentes
3. **Crossfade entre músicas** — fade out da anterior + fade in da nova
4. **Suporte a múltiplos formatos** — fallback automático `.webm` → `.mp3` → `.ogg`
5. **Fila de efeitos** — encadear sons sequencialmente
6. **Sons posicionais (3D)** — PannerNode para áudio espacial no tabuleiro
7. **Sistema de ambiência** — camadas de som ambiente sobrepostas com fade
8. **Web Workers para decode** — processar áudio em background thread
9. **Testes automatizados** — mock do AudioContext para testes unitários
10. **Interface de áudio no jogo** — slider de volume e botão mute na UI

---

## 11. Arquivos do Sistema

| Arquivo | Descrição |
|---------|-----------|
| `src/audio/sounds.js` | Catálogo de sons (16 chaves) |
| `src/audio/AudioManager.js` | Gerenciador central (~218 linhas) |
| `src/audio/index.js` | Instância singleton exportada |
| `docs/audio.md` | Esta documentação |
