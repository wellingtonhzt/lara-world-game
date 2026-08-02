# Modo Aventura

## Visão geral

O Modo Aventura conecta os cinco mundos do Lara World em uma campanha única. A funcionalidade está implementada e testada na branch `feat/modo-aventura`, mas ainda não foi integrada à `main`, publicada na demonstração online ou incluída em uma nova versão.

O objetivo é completar toda a campanha, acumular pontos e terminar com a maior pontuação. Diferentemente do Jogo Rápido, a conclusão de um mundo não encerra a sessão: o resultado é registrado, o mapa é atualizado e o próximo mundo é liberado.

## Ordem da campanha

1. Floresta Encantada
2. Vale dos Dinossauros
3. Galáxia Estelar
4. Reino dos Oceanos
5. Castelo dos Dragões

## Modos suportados

- Humano contra humano, no mesmo dispositivo.
- Humano contra Máquina.

Os participantes mantêm IDs estáveis durante toda a campanha, inclusive quando têm nomes iguais. A Máquina usa o personagem Byte na interface da aventura.

## Fluxo

```text
Menu
→ mapa inicial
→ Preparar Aventura
→ sorteio inicial
→ mundo
→ resultado do mundo
→ mapa atualizado
→ próximo mundo
→ resultado final
```

O mapa apresenta o placar acumulado, mundos concluídos, mundo atual, mundos bloqueados, vencedor de cada etapa e quem começa o próximo mundo. Depois do quinto resultado, a campanha segue para a tela Aventura Completa.

## Pontuação

| Evento | Pontos | Limite por participante/mundo |
|---|---:|---:|
| Resposta correta | 10 | 2 |
| Minigame vencido | 20 | 1 |
| Vitória no mundo | 30 | 1 |

- Máximo de 70 pontos por participante em cada mundo.
- Máximo teórico de 350 pontos por participante na campanha.
- Resposta incorreta e derrota em minigame valem zero.
- Dados e casas especiais não concedem pontos diretamente.
- Não existem penalidades, pontos por velocidade ou bônus adicional pela vitória final.

O resultado de cada mundo separa pontos locais, total acumulado e breakdown por categoria. A tela final resume pontuação, mundos vencidos, respostas pontuadas e minigames vencidos.

### Justiça da pontuação

O teto de duas respostas reduz diferenças causadas pela quantidade de desafios alcançados em cada mundo. Eventos de sorte do tabuleiro não pontuam diretamente, e humano e Máquina passam pelo mesmo adaptador de eventos. Minigames são avaliados por sucesso booleano. A posição das casas e os resultados do dado ainda produzem uma influência controlada da sorte sobre quais oportunidades cada participante encontra.

## Alternância entre mundos

Há um único sorteio no início da campanha. Seu vencedor começa os mundos 1, 3 e 5; o outro participante começa os mundos 2 e 4. O placar não altera essa ordem e não ocorre novo sorteio ao trocar de mundo.

## Conclusão, vitória e “zerar”

- **Aventura concluída:** os cinco mundos foram terminados, independentemente do placar.
- **Vencedor da aventura:** participante com maior pontuação acumulada.
- **Empate:** os participantes terminam com a mesma pontuação; não há desempate oculto.
- **Zerou o Lara World:** concluiu os cinco mundos e terminou com a maior pontuação.

## Estado e segurança

O `adventureState` é separado do `gameState` do tabuleiro. Ele mantém o estado global da campanha e cria um estado transitório para cada mundo. Os principais mecanismos são:

- participantes com IDs e slots estáveis;
- `worldRunId` novo a cada execução de mundo;
- snapshots imutáveis dos resultados;
- eventos idempotentes, com IDs determinísticos;
- breakdown apenas de eventos aceitos;
- rejeição de eventos duplicados, desconhecidos ou pertencentes a execuções antigas;
- invalidação de callbacks tardios após reset, abandono ou troca de mundo.

## Módulos

| Módulo | Responsabilidade |
|---|---|
| `src/data/campaigns.js` | Ordem e identidade da campanha oficial. |
| `src/adventure/adventure-state.js` | Estado, participantes, resultados e ciclo da campanha. |
| `src/adventure/adventure-scoring.js` | Tipos de evento, limites e cálculo idempotente de pontos. |
| `src/adventure/adventure-runtime.js` | Orquestração entre campanha e partidas de cada mundo. |
| `src/adventure/adventure-score-events.js` | Adaptador central para desafios, minigames e vitória do mundo. |
| `src/adventure/adventure-screen.js` | Mapa, placares, resultados e navegação visual da aventura. |

O `game.js` continua responsável pelo tabuleiro compartilhado; o runtime da aventura injeta o contexto necessário sem duplicar a engine dos mundos.

## Interface

- Mapa ilustrado horizontal no desktop e vertical no mobile.
- Art direction com `<picture>` e paisagens WebP específicas por orientação.
- Trilha SVG sobreposta, com trechos concluídos, atuais e bloqueados.
- Destinos com arte oficial dos mundos e fallback visual.
- Sprites selecionados por `tokenId`; Lara é o fallback humano, Byte o fallback da Máquina e emoji é o último fallback visual.
- Placar acumulado com liderança e empate identificados também por texto.
- Telas próprias para conclusão de mundo, continuação da jornada e resultado final.
- Ações primárias antes das secundárias no DOM e na navegação por teclado.
- Layout responsivo, rolagem vertical em telas baixas, foco visível, `aria-live` e suporte a `prefers-reduced-motion`.

## Áudio

A música global toca somente durante o tabuleiro. Ela começa após uma ação do usuário, pausa durante minigames e para ao entrar no mapa ou nas telas de resultado. O mute global permanece disponível. Ao iniciar o mundo seguinte, a música volta a ser iniciada para a nova partida.

Consulte [Áudio](audio.md) para a arquitetura completa do transporte e do `AudioManager`.

## Persistência

> A campanha existe apenas na sessão atual. Recarregar a página encerra a aventura.

Não há salvar e continuar, histórico de campanhas ou ranking persistente. Essas capacidades permanecem como evoluções futuras.

## Testes e validação

A cobertura da funcionalidade inclui:

- fundação, estado e regras da campanha;
- runtime e transições entre mundos;
- eventos de pontuação e idempotência;
- telas, mapas, placares e resultados;
- regressão do Jogo Rápido e isolamento do Arcade;
- humano/humano e humano/Máquina;
- desktop, mobile, landscape e zoom;
- foco, teclado, rolagem e ausência de overflow horizontal;
- áudio, abandono, reset e callbacks tardios.

## Limitações e evoluções futuras

- Persistência e retomada da campanha.
- Histórico de campanhas e ranking.
- Temas musicais por mundo.
- Métricas proporcionais para minigames com formatos diferentes.
- Refinamento do balanceamento com dados de partidas reais.
- Investigar referências `assets/worlds/floresta/path.webp` e `assets/worlds/dinossauros/path.webp`, que podem estar ausentes ou obsoletas.
- Acompanhar um teste intermitente do Question Engine.
- Corrigir três falhas preexistentes do Ocean Match-3 nos testes de simulação de vitória, conclusão e tempo.

## Estado de entrega

- Implementação e testes: concluídos na branch `feat/modo-aventura`.
- Integração na `main`: pendente.
- Atualização de versão, tag e deploy: pendentes.
- Disponibilidade na demo pública: não anunciada.
