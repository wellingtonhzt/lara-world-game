# Processo de Desenvolvimento Assistido por IA

Este projeto utiliza desenvolvimento assistido por IA.

Toda funcionalidade implementada deve obrigatoriamente seguir este fluxo antes de ser considerada concluída.

## Etapa 1 - Implementação

Implementar a funcionalidade solicitada.

## Etapa 2 - Validação

Verificar:

- funcionamento da funcionalidade
- consistência visual
- compatibilidade com funcionalidades existentes
- ausência de regressões

## Regra Obrigatória — Versionamento e Cache-Busting

Sempre que houver uma **nova versão/entrega**, os seguintes itens DEVEM ser atualizados obrigatoriamente:

1. **`src/version.js`** — alterar `APP_VERSION` para o novo identificador (ex: `'v0.17.0-preview'`)
2. **`src/index.html`** — atualizar `?v=` nos links de CSS e JS para o novo valor
3. **Tela inicial** — a versão exibida no rodapé do menu usa `APP_VERSION` via `game.js:init()`, então atualiza automaticamente
4. **`README.md`** — atualizar versão na tabela de status, seção "Funcionalidades Atuais" e rodapé
5. **`CHANGELOG.md`** — adicionar entrada da nova versão
6. **`docs/visao-geral.md`** — atualizar seção da versão atual
7. **`docs/arquitetura.md`** — atualizar referências de versão se houver
8. **`docs/roadmap.md`** — adicionar entrada da nova versão
9. **`docs/memorial-tecnico.md`** — adicionar sprint da nova versão

## Etapa 3 - Atualização da Documentação

Sempre atualizar:

### README.md

Quando houver:
- nova funcionalidade
- alteração de fluxo
- alteração de arquitetura
- nova versão

### CHANGELOG.md

Registrar:

- versão
- data
- funcionalidades adicionadas
- funcionalidades alteradas
- correções realizadas

Padrão:

## [versão]

### Adicionado

### Alterado

### Corrigido

### Removido

---

### docs/visao-geral.md

Atualizar sempre que houver:

- mudanças importantes no projeto
- novos recursos
- novos modos de jogo

---

### docs/arquitetura.md

Atualizar sempre que houver:

- mudanças na estrutura
- novas telas
- novos componentes
- mudanças de fluxo
- mudanças no gerenciamento de estado

---

### docs/regras-do-jogo.md

Atualizar sempre que houver:

- novas regras
- novos personagens
- novos modos de jogo
- novas casas especiais
- mudanças de pontuação

---

### docs/roadmap.md

Atualizar sempre que houver:

- funcionalidades concluídas
- novas funcionalidades planejadas
- mudança de prioridades

---

## Etapa 4 - Memorial Técnico

Criar ou atualizar:

docs/memorial-tecnico.md

Registrando:

- data
- versão
- objetivo da mudança
- arquivos alterados
- impacto técnico
- impacto funcional

---

## Etapa 5 - Resumo da Entrega

Ao final de cada tarefa apresentar:

### Funcionalidades implementadas

### Arquivos alterados

### Documentação atualizada

### Próximos passos sugeridos

---

## Checklist Obrigatório

Antes de considerar uma tarefa concluída:

- [ ] Código atualizado
- [ ] `APP_VERSION` em `src/version.js` atualizado (se nova versão)
- [ ] Cache-busting em `src/index.html` atualizado (se nova versão)
- [ ] README atualizado
- [ ] CHANGELOG atualizado
- [ ] Visão Geral atualizada
- [ ] Arquitetura atualizada
- [ ] Regras atualizadas
- [ ] Roadmap atualizado
- [ ] Memorial Técnico atualizado
- [ ] Resumo final apresentado

Se qualquer item estiver pendente, a tarefa não pode ser considerada concluída.
