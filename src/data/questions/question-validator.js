/**
 * QuestionValidator - Valida perguntas e o banco completo.
 * Retorna errors (impeditivos) e warnings (recomendações).
 * Nunca altera dados automaticamente.
 */

import { hasCategory, hasSubcategory } from './category-catalog.js';

/**
 * Valida uma única pergunta.
 * @param {object} q - Objeto da pergunta
 * @param {string} [contextId] - ID para identificação no relatório
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function validateQuestion(q, contextId) {
  const prefix = contextId || q?.id || '(desconhecido)';
  const errors = [];
  const warnings = [];

  if (!q || typeof q !== 'object') {
    errors.push(`${prefix}: pergunta não é um objeto válido`);
    return { errors, warnings };
  }

  if (!q.id || typeof q.id !== 'string') {
    errors.push(`${prefix}: id ausente ou inválido`);
  }

  if (!q.category || typeof q.category !== 'string') {
    errors.push(`${prefix}: category ausente ou inválido`);
  } else if (!hasCategory(q.category)) {
    errors.push(`${prefix}: category "${q.category}" não existe no catálogo`);
  }

  if (!q.subcategory || typeof q.subcategory !== 'string') {
    errors.push(`${prefix}: subcategory ausente ou inválido`);
  } else if (q.category && hasCategory(q.category) && !hasSubcategory(q.category, q.subcategory)) {
    errors.push(`${prefix}: subcategory "${q.subcategory}" não existe em "${q.category}"`);
  }

  if (!q.question || typeof q.question !== 'string' || q.question.trim() === '') {
    errors.push(`${prefix}: question ausente ou vazio`);
  } else {
    if (q.question.trim().length < 10) {
      warnings.push(`${prefix}: question muito curta`);
    }
    if (q.question.trim().length > 200) {
      warnings.push(`${prefix}: question excessivamente longa`);
    }
  }

  if (!Array.isArray(q.options)) {
    errors.push(`${prefix}: options não é um array`);
  } else {
    if (q.options.length < 2) {
      errors.push(`${prefix}: options com menos de 2 alternativas`);
    }
    const hasEmpty = q.options.some(o => typeof o !== 'string' || o.trim() === '');
    if (hasEmpty) {
      errors.push(`${prefix}: options contém alternativa vazia`);
    }
    const unique = new Set(q.options);
    if (unique.size !== q.options.length) {
      errors.push(`${prefix}: options contém alternativa duplicada`);
    }
  }

  if (typeof q.correctOption !== 'number' || !Number.isInteger(q.correctOption)) {
    errors.push(`${prefix}: correctOption não é um inteiro`);
  } else if (Array.isArray(q.options) && (q.correctOption < 0 || q.correctOption >= q.options.length)) {
    errors.push(`${prefix}: correctOption fora do intervalo válido`);
  }

  if (typeof q.explanation !== 'string' || q.explanation.trim() === '') {
    warnings.push(`${prefix}: explanation vazia`);
  }

  if (typeof q.level !== 'number' || !Number.isInteger(q.level) || q.level < 1 || q.level > 5) {
    errors.push(`${prefix}: level fora de 1-5`);
  }

  if (!Array.isArray(q.tags)) {
    errors.push(`${prefix}: tags não é um array`);
  } else if (q.tags.length === 0) {
    warnings.push(`${prefix}: tags vazias`);
  }

  if (typeof q.active !== 'boolean') {
    errors.push(`${prefix}: active não é boolean`);
  }

  return { errors, warnings };
}

/**
 * Valida o banco inteiro de perguntas.
 * @param {object[]} questions
 * @returns {{ valid: boolean, errors: string[], warnings: string[], stats: object }}
 */
export function validateBank(questions) {
  const allErrors = [];
  const allWarnings = [];
  const ids = new Set();
  const seenTexts = new Map();

  for (const q of questions) {
    const result = validateQuestion(q, q?.id);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);

    if (q?.id) {
      if (ids.has(q.id)) {
        allErrors.push(`${q.id}: id duplicado no banco`);
      }
      ids.add(q.id);
    }

    if (q?.question) {
      const normalized = q.question.toLowerCase().trim();
      if (seenTexts.has(normalized)) {
        const existing = seenTexts.get(normalized);
        allWarnings.push(`${q.id}: possible duplicate of "${existing}"`);
      } else {
        seenTexts.set(normalized, q.id);
      }
    }
  }

  const withErrors = questions.filter(q => {
    const r = validateQuestion(q, q?.id);
    return r.errors.length > 0;
  }).length;

  const withWarnings = questions.filter(q => {
    const r = validateQuestion(q, q?.id);
    return r.warnings.length > 0;
  }).length;

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    stats: {
      total: questions.length,
      valid: questions.length - withErrors,
      withErrors,
      withWarnings,
    },
  };
}
