import { QuestionEngine } from '../data/questions/index.js';

const STATE = { INTRO: 'intro', QUESTION: 'question', RESULT: 'result' };

const TOTAL = 5;

let _initialized = false;
let _screenEl = null;
let _contentEl = null;
let _onExit = null;

let _state = STATE.INTRO;
let _questions = [];
let _currentIndex = 0;
let _score = 0;
let _answered = false;

function _audioPlay(key) {
  try {
    import('../audio/index.js').then(m => m.audioManager.play(key)).catch(() => {});
  } catch { /* silent */ }
}

function _resultMessage(score) {
  if (score === TOTAL) return { text: 'Perfeito! 🌟', cls: 'quiz-result-msg-perfect' };
  if (score >= 4) return { text: 'Excelente!', cls: 'quiz-result-msg-excellent' };
  if (score >= 2) return { text: 'Muito bem!', cls: 'quiz-result-msg-good' };
  return { text: 'Continue tentando!', cls: 'quiz-result-msg-try' };
}

function _letter(i) { return String.fromCharCode(65 + i); }

function _render() {
  if (!_contentEl) return;
  switch (_state) {
    case STATE.INTRO: _renderIntro(); break;
    case STATE.QUESTION: _renderQuestion(); break;
    case STATE.RESULT: _renderResult(); break;
  }
}

function _renderIntro() {
  _contentEl.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-intro-icon">❓</div>
      <h2 class="quiz-intro-title">Quiz Lara World</h2>
      <p class="quiz-intro-desc">Responda ${TOTAL} perguntas e teste seus conhecimentos!</p>
      <button class="quiz-btn quiz-btn-primary" data-quiz="start">Começar</button>
      <button class="quiz-btn quiz-btn-secondary" data-quiz="back">← Voltar ao menu</button>
    </div>`;

  _contentEl.querySelector('[data-quiz="start"]').addEventListener('click', _startGame);
  _contentEl.querySelector('[data-quiz="back"]').addEventListener('click', _exit);
}

function _renderQuestion() {
  const q = _questions[_currentIndex];
  if (!q) { _state = STATE.RESULT; _render(); return; }

  const pct = ((_currentIndex) / TOTAL) * 100;
  const optionsHtml = q.options.map((opt, i) =>
    `<button class="quiz-option" data-quiz="answer" data-index="${i}">
       <span class="quiz-option-letter">${_letter(i)}</span>
       <span class="quiz-option-text">${_escapeHtml(opt)}</span>
     </button>`
  ).join('');

  _contentEl.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-header">
        <span>Pergunta ${_currentIndex + 1} de ${TOTAL}</span>
        <span>Pontuação: <strong>${_score}</strong></span>
      </div>
      <div class="quiz-progress">
        <div class="quiz-progress-fill" style="width: ${pct}%"></div>
      </div>
      <p class="quiz-question-text">${_escapeHtml(q.question)}</p>
      <div class="quiz-options">${optionsHtml}</div>
      <div id="quiz-feedback"></div>
    </div>`;

  _contentEl.querySelectorAll('[data-quiz="answer"]').forEach(btn => {
    btn.addEventListener('click', () => _handleAnswer(Number(btn.dataset.index)));
  });
}

function _handleAnswer(selectedIndex) {
  if (_answered) return;
  _answered = true;

  const q = _questions[_currentIndex];
  const correct = selectedIndex === q.correctOption;
  if (correct) _score++;

  const buttons = _contentEl.querySelectorAll('[data-quiz="answer"]');
  buttons.forEach(btn => {
    btn.classList.add('quiz-option-disabled');
    const idx = Number(btn.dataset.index);
    if (idx === q.correctOption) btn.classList.add('quiz-option-correct');
    if (idx === selectedIndex && !correct) btn.classList.add('quiz-option-wrong');
  });

  const feedbackEl = _contentEl.querySelector('#quiz-feedback');
  if (feedbackEl) {
    let html = correct
      ? '<div class="quiz-feedback quiz-feedback-correct">✅ Resposta correta!</div>'
      : `<div class="quiz-feedback quiz-feedback-wrong">❌ A resposta correta era: ${_escapeHtml(q.options[q.correctOption])}</div>`;
    if (q.explanation) {
      html += `<div class="quiz-explanation">${_escapeHtml(q.explanation)}</div>`;
    }
    html += `<button class="quiz-btn quiz-btn-primary" data-quiz="next" style="margin-top:16px">
      ${_currentIndex < TOTAL - 1 ? 'Próxima →' : 'Ver Resultado'}
    </button>`;
    feedbackEl.innerHTML = html;

    feedbackEl.querySelector('[data-quiz="next"]').addEventListener('click', _nextQuestion);
  }

  if (correct) _audioPlay('correctAnswer');
  else _audioPlay('wrongAnswer');
}

function _nextQuestion() {
  _currentIndex++;
  _answered = false;
  if (_currentIndex >= TOTAL) {
    _state = STATE.RESULT;
    _audioPlay('victory');
  }
  _render();
}

function _renderResult() {
  const pct = Math.round((_score / TOTAL) * 100);
  const msg = _resultMessage(_score);

  _contentEl.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-result-icon">🏆</div>
      <h2 class="quiz-result-title">Quiz concluído!</h2>
      <p class="quiz-result-score">${_score} de ${TOTAL}</p>
      <p class="quiz-result-pct">${pct}%</p>
      <div class="quiz-result-msg ${msg.cls}">${msg.text}</div>
      <button class="quiz-btn quiz-btn-primary" data-quiz="restart">↻ Jogar novamente</button>
      <button class="quiz-btn quiz-btn-secondary" data-quiz="back">← Voltar ao menu</button>
    </div>`;

  _contentEl.querySelector('[data-quiz="restart"]').addEventListener('click', _startGame);
  _contentEl.querySelector('[data-quiz="back"]').addEventListener('click', _exit);
}

function _startGame() {
  _audioPlay('challengeOpen');
  _questions = QuestionEngine.selectMany(
    { categoryWeights: {}, levelRange: { min: 1, max: 5 }, excludeIds: [] },
    TOTAL
  );
  if (_questions.length === 0) {
    _contentEl.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-intro-icon">⚠️</div>
        <h2 class="quiz-intro-title">Sem perguntas disponíveis</h2>
        <p class="quiz-intro-desc">Não foi possível carregar perguntas. Tente novamente.</p>
        <button class="quiz-btn quiz-btn-secondary" data-quiz="back">← Voltar ao menu</button>
      </div>`;
    _contentEl.querySelector('[data-quiz="back"]').addEventListener('click', _exit);
    return;
  }
  _currentIndex = 0;
  _score = 0;
  _answered = false;
  _state = STATE.QUESTION;
  _render();
}

function _exit() {
  hideQuizScreen();
  if (typeof _onExit === 'function') _onExit();
}

function _escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function _handleKeydown(e) {
  if (!_screenEl || _screenEl.classList.contains('hidden')) return;
  if (e.key === 'Escape') { e.preventDefault(); _exit(); }
}

function _handleOverlayClick(e) {
  if (e.target === _screenEl) _exit();
}

export function initQuizScreen(onExit) {
  if (_initialized) return;
  _initialized = true;
  _onExit = onExit;
  _screenEl = document.getElementById('quiz-screen');
  _contentEl = document.getElementById('quiz-content');
  if (_screenEl) {
    _screenEl.addEventListener('click', _handleOverlayClick);
    document.addEventListener('keydown', _handleKeydown);
  }
}

export function showQuizScreen() {
  if (!_screenEl) return;
  _state = STATE.INTRO;
  _questions = [];
  _currentIndex = 0;
  _score = 0;
  _answered = false;
  _screenEl.classList.remove('hidden');
  _render();
}

export function hideQuizScreen() {
  if (!_screenEl) return;
  _screenEl.classList.add('hidden');
  _state = STATE.INTRO;
  _questions = [];
  _currentIndex = 0;
  _score = 0;
  _answered = false;
}
