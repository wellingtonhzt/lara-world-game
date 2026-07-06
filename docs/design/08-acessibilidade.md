# Acessibilidade no Lara World

## 1. Filosofia

Lara World é um jogo infantil. Acessibilidade não é um recurso opcional — é um **requisito fundamental do design**. Crianças têm necessidades específicas: letra grande, cores contrastantes, feedback claro, sem punição por erro.

Além disso, o jogo deve ser utilizável por:
- Crianças com baixa visão ou daltonismo
- Crianças com dificuldade motora fina
- Crianças neurodivergentes (TDAH, autismo)
- Adultos acompanhantes (pais, responsáveis)
- Jogadores em qualquer idioma (quando aplicável)

### Princípios-Chave

1. **Nada essencial depende apenas de cor**
2. **Tudo que é clicável tem pelo menos 44×44px**
3. **Todo feedback é visual + textual + sonoro (quando possível)**
4. **Erro nunca é punitivo** — o jogo incentiva tentar de novo
5. **Contraste mínimo em toda interface**

## 2. Contraste

### Taxas de Contraste

| Elemento | Contraste Mínimo | Padrão WCAG |
|---|---|---|
| Texto normal (<18px) | 4.5:1 | AA |
| Texto grande (≥18px / ≥14px bold) | 3:1 | AA |
| Texto do dado (número grande) | 3:1 | AA |
| Ícones | 3:1 | AA |
| Bordas de input | 3:1 | AA |
| Placeholder | 3:1 (mas evitar apenas placeholder para info crítica) | AA |
| Estados disabled | 3:1 contra o fundo | — |

### Como Garantir

- Nunca usar texto cinza sobre fundo cinza
- Texto principal: contraste ≥ 7:1 (AAA preferencial)
- Cores de fundo texturizadas devem ser testadas com sobreposição de texto
- Ferramenta de verificação: WebAIM Contrast Checker

## 3. Legibilidade

### Tipografia

- Fonte mínima: 14px (mobile), 16px (desktop)
- Família: sans-serif para máxima legibilidade em tela
- Altura de linha: 1.5 (texto), 1.2 (títulos)
- Tracking (letter-spacing): 0.01em (texto), normal (títulos)
- Peso: regular (400) ou semi-bold (600) — evitar light (300) para texto

### Hierarquia Visual

- Títulos: 2× tamanho do corpo para distinção clara
- Labels: bold para diferenciar do conteúdo
- Links: underline + cor (não apenas cor)

### Leiturabilidade

- Parágrafos com no máximo 60-70 caracteres por linha
- Alinhamento: justificado não recomendado (espaçamento irregular)
- Fundo de texto: quando sobre imagem, adicionar overlay semi-transparente

## 4. Cores e Daltonismo

### Cores Seguras

- **Verde/Vermelho**: nunca usar como único diferenciador (daltonismo mais comum)
- Suplementar com: ícones, textura, posição, texto
- Exemplo no desafio: acerto = verde + check (✓), erro = vermelho + X (✗)

### Paleta Adaptada

| Função | Cor Principal | Alternativo (sem cor) |
|---|---|---|
| Sucesso | Verde | Ícone ✓ + label "Correto!" |
| Erro | Vermelho | Ícone ✗ + label "Tente de novo" |
| Desafio | Roxo | Ícone ❓ + label "Desafio" |
| Portal | Gradiente | Ícone 🌀 + label "Portal" |
| Jogador 1 | Rosa | Número 1 + label "Jogador 1" |
| Jogador 2 | Azul | Número 2 + label "Jogador 2" |

## 5. Tamanhos Mínimos

### Touch Targets

| Componente | Tamanho Mínimo | Recomendado |
|---|---|---|
| Botão principal | 48×48px (44×44 é o mínimo WCAG) | 56×56px |
| Botão secundário | 44×44px | 48×48px |
| Opção de desafio | 44px altura | 52px altura |
| Emoji na grade | 44×44px | 48×48px |
| Card de mundo | 120×160px | 160×200px |
| Fechar modal (X) | 44×44px | 48×48px |

### Espaçamento entre Targets

- Mínimo: 8px entre elementos clicáveis
- Recomendado: 12px

## 6. Botões

### Estados Visíveis

| Estado | Visual |
|---|---|
| Default | Aparência padrão do botão |
| Hover (desktop) | Elevação + brilho (mudança de cor não é suficiente) |
| Focus | Outline visível (2-3px, cor contrastante, offset 2px) |
| Active / Pressed | Rebaixamento (escala 0.97, sombra reduzida) |
| Disabled | Opacidade 40%, cursor not-allowed, sem sombra |

### Foco Visível

- Todos os elementos interativos devem ter estilo de foco visível
- `outline` ou `box-shadow` para foco (não depender de `:focus-visible` isoladamente)
- Contraste do foco: ≥ 3:1 contra o fundo

## 7. Uso Infantil

### Crianças Pré-Escolares (3–5 anos)

- **Interação simples**: um toque para agir, sem drag ou gestos complexos
- **Ícones grandes**: substituem texto sempre que possível
- **Feedback imediato**: cada ação tem resposta visual/sonora em <300ms
- **Sem punição**: errar um desafio não tira pontos nem impede progresso significativo
- **Botão grande de "voltar"** sempre visível

### Crianças Escolares (6–10 anos)

- **Texto + ícone**: suporte gradual à alfabetização
- **Desafios educativos**: perguntas apropriadas para a faixa etária
- **Autonomia**: poder navegar entre telas sozinho
- **Confirmação**: ações destrutivas (reiniciar, sair) pedem confirmação

### Crianças Neurodivergentes (TDAH, Autismo)

- **Evitar sobrecarga sensorial**: animações sutis, sem flashing (respeitar WCAG 2.3.1 — sem flashes >3Hz)
- **Previsibilidade**: elementos consistentes em posição e comportamento
- **Rotina visual**: mesma estrutura de tela em todos os mundos
- **Sem time pressure**: desafios sem cronômetro
- **Foco controlado**: um modal por vez, sem múltiplas camadas

## 8. Navegação por Teclado

| Tecla | Ação |
|---|---|
| `Tab` | Navegar entre elementos focáveis |
| `Enter` / `Space` | Ativar elemento focado |
| `Escape` | Fechar modal ativo |
| `Arrow keys` | Navegar dentro de grids (emoji, opções) |

### Implementação

- Tab order lógico (esquerda→direita, topo→base)
- Skip link: "Pular para o conteúdo principal" (para usuários de leitor de tela)
- Foco nunca "preso" em um modal — Escape sempre funciona

## 9. Leitor de Tela (Screen Reader)

### ARIA Labels

- Botões: `aria-label` descritivo (ex: `"Jogar dado"`, `"Reiniciar partida"`)
- Modal: `role="dialog"` + `aria-labelledby` + `aria-describedby`
- Tabuleiro: `role="grid"` com células como `role="gridcell"`
- Dado: `aria-live="polite"` para anunciar resultado
- Histórico: `aria-live="polite"` para novas entradas
- Indicador de turno: `aria-live="assertive"` para mudanças de turno

### Anúncios

- "Jogador 1, sua vez!" ao ativar turno
- "Você tirou 5!" ao finalizar dado
- "Caiu em um desafio! Responda a pergunta." ao ativar desafio
- "Acertou! Avance uma casa." / "Errou. Volte uma casa."
- "Vitória! Jogador 1 venceu a partida!"

## 10. Prefers-Reduced-Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Remover ou simplificar animações */
  .confetti-piece { display: none; }
  .dice-rolling { animation: none; }
  .modal-open { animation: none; opacity: 1; }

  /* Teleporte em vez de movimento gradual */
  .player-moving { transition: none; }
}
```

### Fallbacks

| Animação | Fallback Reduced Motion |
|---|---|
| Dado girando | Fade-in do valor final |
| Confete | Imagem estática de confetes |
| Portal | Fade de 400ms |
| Movimento do jogador | Teleporte instantâneo |
| Hover (botão) | Nenhum (já cobre mobile sem hover) |

## 11. Diretrizes de Implementação

### Checklist de Acessibilidade

- [ ] Contraste 4.5:1 para todo texto
- [ ] Touch targets ≥ 44×44px
- [ ] Todos os estados de foco visíveis
- [ ] Navegação por teclado completa
- [ ] ARIA labels em todos os elementos interativos
- [ ] Suporte a prefers-reduced-motion
- [ ] Nenhuma informação essencial transmitida apenas por cor
- [ ] Feedback de erro não-punitivo
- [ ] Fonte mínima 14px
- [ ] Espaçamento mínimo de 8px entre alvos de toque
- [ ] Modais fecháveis com Escape
- [ ] Skip link para leitores de tela
