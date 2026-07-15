/* ============================================
   Lara World — About Screen (src/about/about-screen.js)
   "Sobre o Lara World" overlay with sections
   ============================================ */

import { APP_VERSION } from '../version.js';

console.log('[ABOUT] módulo carregado');

let _overlayEl = null;
let _closeBtn = null;
let _versionEl = null;
let _initialized = false;
let _lastFocusedElement = null;

function _handleKeydown(e) {
  if (!_overlayEl || _overlayEl.classList.contains('hidden')) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    hideAboutScreen();
  }
}

function _handleOverlayClick(e) {
  if (e.target === _overlayEl) {
    hideAboutScreen();
  }
}

function _updateVersion() {
  if (_versionEl) {
    _versionEl.textContent = 'Versão ' + APP_VERSION;
  }
}

function _renderContent() {
  if (!_overlayEl) return;

  _overlayEl.innerHTML = '';

  var card = document.createElement('div');
  card.className = 'about-card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-label', 'Sobre o Lara World');

  var closeBtn = document.createElement('button');
  closeBtn.className = 'about-close-btn';
  closeBtn.setAttribute('aria-label', 'Fechar');
  closeBtn.textContent = '\u2715';
  card.appendChild(closeBtn);

  var title = document.createElement('h2');
  title.className = 'about-title';
  title.textContent = 'Sobre o Lara World';
  card.appendChild(title);

  var versionDiv = document.createElement('div');
  versionDiv.className = 'about-version';
  _versionEl = versionDiv;
  card.appendChild(versionDiv);

  var sectionPresentation = document.createElement('div');
  sectionPresentation.className = 'about-section';
  var h3Pres = document.createElement('h3');
  h3Pres.textContent = 'Apresentação';
  sectionPresentation.appendChild(h3Pres);
  var pPres = document.createElement('p');
  pPres.textContent = 'Lara World é um jogo de trilha infantil para navegador, com mundos temáticos, desafios educativos e minigames. O projeto busca oferecer uma experiência simples, divertida e acessível para crianças, permitindo jogar sozinho, contra a máquina ou com outra pessoa no mesmo dispositivo.';
  sectionPresentation.appendChild(pPres);
  card.appendChild(sectionPresentation);

  var sectionFeatures = document.createElement('div');
  sectionFeatures.className = 'about-section';
  var h3Feat = document.createElement('h3');
  h3Feat.textContent = 'Recursos Atuais';
  sectionFeatures.appendChild(h3Feat);
  var ulFeat = document.createElement('ul');
  var features = [
    '5 mundos temáticos',
    'Jogo Rápido',
    'Modo Arcade',
    'Multiplayer local',
    'Single Player contra a máquina',
    'Desafios educativos',
    'Minigames exclusivos',
    'Estatísticas do Modo Arcade'
  ];
  features.forEach(function (f) {
    var li = document.createElement('li');
    li.textContent = f;
    ulFeat.appendChild(li);
  });
  sectionFeatures.appendChild(ulFeat);
  card.appendChild(sectionFeatures);

  var sectionDev = document.createElement('div');
  sectionDev.className = 'about-section';
  var h3Dev = document.createElement('h3');
  h3Dev.textContent = 'Em Desenvolvimento';
  sectionDev.appendChild(h3Dev);
  var ulDev = document.createElement('ul');
  var devItems = [
    'Modo Aventura',
    'Novos mundos',
    'Novos minigames',
    'Expansão do banco de perguntas',
    'Melhorias de acessibilidade',
    'Novos sistemas de progressão'
  ];
  devItems.forEach(function (d) {
    var li = document.createElement('li');
    li.textContent = d;
    ulDev.appendChild(li);
  });
  sectionDev.appendChild(ulDev);
  card.appendChild(sectionDev);

  var sectionCredits = document.createElement('div');
  sectionCredits.className = 'about-section';
  var h3Credits = document.createElement('h3');
  h3Credits.textContent = 'Desenvolvimento';
  sectionCredits.appendChild(h3Credits);
  var ulCredits = document.createElement('ul');
  var creditsItems = [
    'Desenvolvido por Wellington Lima',
    'Desenvolvimento assistido por inteligência artificial',
    'Projeto independente',
    'HTML5, CSS3, JavaScript Vanilla e Canvas API'
  ];
  creditsItems.forEach(function (c) {
    var li = document.createElement('li');
    li.textContent = c;
    ulCredits.appendChild(li);
  });
  sectionCredits.appendChild(ulCredits);
  card.appendChild(sectionCredits);

  var backBtn = document.createElement('button');
  backBtn.className = 'about-back-btn';
  backBtn.textContent = '\u2190 Voltar ao Menu';
  card.appendChild(backBtn);

  _overlayEl.appendChild(card);

  _closeBtn = card.querySelector('.about-close-btn');
  if (_closeBtn) {
    _closeBtn.addEventListener('click', function () {
      hideAboutScreen();
    });
  }

  backBtn.addEventListener('click', function () {
    hideAboutScreen();
  });

  _updateVersion();
}

export function initAboutScreen() {
  console.log('[ABOUT] init executado');
  if (_initialized) return;
  _initialized = true;

  _overlayEl = document.getElementById('about-overlay');
  if (!_overlayEl) {
    console.error('[About] Elemento #about-overlay nao encontrado no DOM');
    return;
  }

  _renderContent();

  _overlayEl.addEventListener('click', _handleOverlayClick);
  document.addEventListener('keydown', _handleKeydown);
}

export function showAboutScreen() {
  console.log('[ABOUT] tela aberta');
  if (!_overlayEl) return;
  _lastFocusedElement = document.activeElement;
  _overlayEl.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(function () {
    _overlayEl.classList.add('visible');
  });
  if (_closeBtn) {
    setTimeout(function () { _closeBtn.focus(); }, 100);
  }
}

export function hideAboutScreen() {
  if (!_overlayEl) return;
  _overlayEl.classList.remove('visible');
  document.body.style.overflow = '';
  var mainMenu = document.getElementById('main-menu');
  if (mainMenu) {
    mainMenu.classList.remove('hidden');
  }
  setTimeout(function () {
    _overlayEl.classList.add('hidden');
    if (_lastFocusedElement && _lastFocusedElement.focus) {
      _lastFocusedElement.focus();
    }
  }, 300);
}
