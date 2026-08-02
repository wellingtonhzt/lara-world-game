import assert from 'node:assert/strict';
import fs from 'node:fs';
import { TUTORIAL_STEPS } from '../src/tutorial/tutorial-data.js';

let passed = 0;
function test(label, fn) {
  fn();
  passed++;
  console.log(`  PASS  ${label}`);
}

const tutorialText = TUTORIAL_STEPS
  .flatMap(step => [step.title, step.text, step.note || '', ...(step.items || [])])
  .join(' ');
const aboutSource = fs.readFileSync(new URL('../src/about/about-screen.js', import.meta.url), 'utf8');
const indexSource = fs.readFileSync(new URL('../src/index.html', import.meta.url), 'utf8');
const gameSource = fs.readFileSync(new URL('../src/game.js', import.meta.url), 'utf8');

console.log('\nAbout and tutorial alignment\n');

test('menu keeps one accessible entry for Como Jogar and Sobre', () => {
  assert.equal((indexSource.match(/id="btn-tutorial"/g) || []).length, 1);
  assert.equal((indexSource.match(/id="btn-about"/g) || []).length, 1);
  assert.match(indexSource, /📖 Como Jogar/);
  assert.match(indexSource, /ℹ️ Sobre/);
});

test('menu buttons keep their screen listeners', () => {
  assert.match(gameSource, /getElementById\("btn-tutorial"\)\.addEventListener\("click"[\s\S]*?showTutorialScreen\(\)/);
  assert.match(gameSource, /getElementById\("btn-about"\)\.addEventListener\("click"[\s\S]*?showAboutScreen\(\)/);
});

test('tutorial covers the three current game modes', () => {
  assert.match(tutorialText, /Jogo Rápido/);
  assert.match(tutorialText, /Modo Aventura/);
  assert.match(tutorialText, /Arcade/);
});

test('tutorial documents adventure scoring and limits', () => {
  assert.match(tutorialText, /10 pontos/);
  assert.match(tutorialText, /até 2 acertos/);
  assert.match(tutorialText, /20 pontos/);
  assert.match(tutorialText, /até 1 minigame/);
  assert.match(tutorialText, /30 pontos/);
});

test('tutorial documents campaign flow and session lifetime', () => {
  assert.match(tutorialText, /cinco mundos/);
  assert.match(tutorialText, /sessão atual/);
  assert.match(tutorialText, /1, 3 e 5/);
  assert.match(tutorialText, /2 e 4/);
  assert.match(tutorialText, /mais pontos vence/);
});

test('About lists Adventure as current and not in development', () => {
  const current = aboutSource.match(/var features = \[([\s\S]*?)\];/)?.[1] || '';
  const future = aboutSource.match(/var devItems = \[([\s\S]*?)\];/)?.[1] || '';
  assert.match(current, /Modo Aventura/);
  assert.doesNotMatch(future, /['"]Modo Aventura['"]/);
});

test('About keeps the application version dynamic', () => {
  assert.match(aboutSource, /import \{ APP_VERSION \}/);
  assert.match(aboutSource, /'Versão ' \+ APP_VERSION/);
});

console.log(`\n${passed} tests passed.\n`);
