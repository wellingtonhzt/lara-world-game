# Sistema de Áudio — Lara World

## Estrutura de Diretórios

```
src/
├── audio/
│   ├── AudioManager.js    # Gerenciador central de áudio
│   ├── sounds.js          # Catálogo de sons (chaves simbólicas)
│   └── index.js           # Instância singleton (export)
└── assets/
    └── audio/
        ├── music/         # Músicas de fundo (loop)
        ├── ui/            # Sons de interface (cliques, modais)
        ├── dice/          # Sons de dados (rolar, resultado)
        ├── board/         # Sons do tabuleiro (movimento, portais)
        ├── quiz/          # Sons de desafios (perguntas, acerto/erro)
        ├── rewards/       # Sons de recompensa (vitória, game over)
        └── ambience/      # Sons ambientais (futuro)
```

## Como Funciona

### Gerenciador Central (`AudioManager`)

Toda reprodução de áudio passa obrigatoriamente pelo `AudioManager`. Nunca use `new Audio()` ou `HTMLAudioElement` diretamente no código do jogo — sempre use o gerenciador.

**Instância única** disponível via:
```js
import { audioManager } from './audio/index.js';
```

### Catálogo de Sons (`sounds.js`)

O arquivo `src/audio/sounds.js` mapeia chaves simbólicas para caminhos de arquivo:

```js
export const SOUNDS = {
  buttonClick:    { path: 'assets/audio/ui/click.webm',    category: 'effects' },
  diceRoll:       { path: 'assets/audio/dice/roll.webm',   category: 'effects' },
  victory:        { path: 'assets/audio/rewards/victory.webm', category: 'effects' },
  backgroundMusic: { path: 'assets/audio/music/bg-loop.webm', category: 'music' },
  // ...
};
```

Cada entrada possui:
- **path** — caminho relativo ao `src/`. Pode ser `null` ou vazio se o asset não existir ainda.
- **category** — `'effects'` (volume de efeitos) ou `'music'` (volume de música).

### API Pública

| Método | Descrição |
|--------|-----------|
| `init()` | Inicializa o sistema, registra sons do catálogo |
| `play(key)` | Toca efeito sonoro pela chave. Ignora se ausente ou sem arquivo |
| `stop(key)` | Para um efeito sonoro específico |
| `playMusic(key)` | Toca música de fundo em loop (para a anterior automaticamente) |
| `stopMusic()` | Para a música de fundo |
| `setMasterVolume(v)` | Volume mestre (0–1) |
| `setMusicVolume(v)` | Volume da música (0–1) |
| `setEffectsVolume(v)` | Volume dos efeitos (0–1) |
| `mute()` | Muta todo o áudio |
| `unmute()` | Restaura o áudio |
| `toggleMute()` | Alterna mute, retorna estado atual |
| `isMuted()` | Retorna `true` se está mutado |

### Persistência

Configurações de volume e mute são salvas automaticamente no `localStorage` sob a chave `laraAudioConfig`. São restauradas na próxima sessão.

## Como Cadastrar um Novo Som

1. Coloque o arquivo `.webm` (ou `.mp3`/`.ogg`) na subpasta apropriada em `src/assets/audio/`
2. Adicione uma entrada em `src/audio/sounds.js`:

```js
myNewSound: { path: 'assets/audio/board/my-sound.webm', category: 'effects' },
```

3. Chame no jogo:

```js
audioManager.play('myNewSound');
```

## Como Chamar um Som no Código

```js
import { audioManager } from './audio/index.js';

// Efeito sonoro simples
audioManager.play('buttonClick');

// Música de fundo
audioManager.playMusic('backgroundMusic');

// Parar música
audioManager.stopMusic();
```

As chamadas são **seguras**:
- Se a chave não existir no catálogo → ignorado
- Se o arquivo não existir → ignorado (sem broken image, sem erro no console)
- Se o navegador bloquear autoplay → o AudioManager lida silenciosamente

## Como Adicionar Música de Fundo

```js
// Iniciar música
audioManager.playMusic('backgroundMusic');

// Trocar música (para a anterior automaticamente)
audioManager.playMusic('levelMusic');

// Parar
audioManager.stopMusic();
```

A música toca em loop automaticamente. O volume da música é independente dos efeitos.

## Autoplay e Primeira Interação

Navegadores bloqueiam áudio até a primeira interação do usuário. O `AudioManager` gerencia isso:

1. `init()` é chamado no bootstrap do jogo
2. Um listener de `click` (once) no `document` detecta a primeira interação e retoma o `AudioContext`
3. Se `play()` for chamado antes da interação, o `AudioContext` é suspenso → o som é ignorado sem erro

Não é necessário fazer nada adicional para desbloquear áudio — o mecanismo é automático.

## Mute, Volume e localStorage

```js
// Controle de volume
audioManager.setMasterVolume(0.8);
audioManager.setMusicVolume(0.5);
audioManager.setEffectsVolume(0.7);

// Mute
audioManager.mute();
audioManager.unmute();
audioManager.toggleMute();

// Consultar
if (audioManager.isMuted()) { /* ... */ }
```

Tudo é salvo automaticamente em `localStorage` e restaurado na próxima vez que o jogo abrir.

## Boas Práticas

1. **Sempre passe pelo `AudioManager`** — nunca use `new Audio()` ou `HTMLAudioElement` direto no código
2. **Chames seguras** — `audioManager.play('qualquerCoisa')` nunca quebra o jogo
3. **Não toque áudio em loops apertados** — evite chamar `play()` dentro de `requestAnimationFrame` ou loops sem controle
4. **Prefira `.webm`** para os assets — melhor compressão/qualidade para web
5. **Sons opcionais** — todo som deve ser tratado como opcional; se faltar arquivo, o jogo funciona sem ele
6. **Volume razoável** — efeitos tendem a 0.7–0.8, música de fundo a 0.3–0.5
7. **Não reproduza música sobre música** — use `playMusic()` que para a anterior automaticamente

## Pontos de Integração no Jogo

As chamadas de áudio estão inseridas em `src/game.js` nos seguintes pontos:

| Evento | Chave | Localização |
|--------|-------|-------------|
| Clique "⚡ Jogo Rápido" | `buttonClick` | `setupMenuEvents()` |
| Clique card de mundo | `buttonClick` | `setupWorldSelectorEvents()` |
| Clique "← Menu Principal" | `buttonClick` | `setupWorldSelectorEvents()` |
| Clique "Iniciar Jogo" | `buttonClick` | `setupModalEvents()` |
| Botão "Jogar Novamente" (vitória) | `buttonClick` | `init()` |
| Botão "Voltar ao Menu" (vitória) | `buttonClick` | `init()` |
| Rolar dado (jogo) | `diceRoll` | `jogarDado()` |
| Resultado do dado (jogo) | `diceResult` | `jogarDado()` |
| Rolar dado (sorteio) | `diceRoll` | `waitForPlayerRoll()` |
| Resultado do dado (sorteio) | `diceResult` | `waitForPlayerRoll()` |
| Movimento do jogador | `playerMove` | `animatePlayerMovement()` (por passo) |
| Casa especial "avançar" | `specialAdvance` | `processSpecialCell()` |
| Casa especial "voltar" | `specialBack` | `processSpecialCell()` |
| Casa especial "portal" | `portal` | `processSpecialCell()` |
| Abertura de desafio | `challengeOpen` | `processSpecialCell()` |
| Resposta correta | `correctAnswer` | `processSpecialCell()` / `resolveChallenge()` |
| Resposta errada | `wrongAnswer` | `processSpecialCell()` / `resolveChallenge()` |
| Vitória | `victory` | `handleVictory()` |

---

## Arquivos do Sistema de Áudio

| Arquivo | Descrição |
|---------|-----------|
| `src/audio/sounds.js` | Catálogo de sons (chaves simbólicas → paths) |
| `src/audio/AudioManager.js` | Gerenciador central (Web Audio API) |
| `src/audio/index.js` | Instância singleton exportada |
| `docs/audio.md` | Esta documentação |
