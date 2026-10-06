// DevQuest App — State management, navigation, gamification
'use strict';

// ════════════════════════════════════════
// DEFAULT STATE (v3: un curso independiente por lenguaje,
// el nombre del perfil es compartido)
// ════════════════════════════════════════
const COURSE_VERSION = 3;

function freshCourseStats() {
  return {
    level: 1,
    xp: 0,
    xpToNext: 200,
    streak: 0,
    lastStudyDate: null,
    lives: 5,
    maxLives: 5,
    livesLastRefill: Date.now(),
    totalExercises: 0,
    totalCorrect: 0
  };
}

function freshCourse() {
  return {
    user: freshCourseStats(),
    progress: {},      // moduleId → { completedLessons: [...lessonId], xpEarned: 0 }
    achievements: {},  // achievementId → true
    currentLesson: null,
    currentModuleId: null
  };
}

const DEFAULT_STATE = {
  version: COURSE_VERSION,
  profile: {
    id: null,
    name: '',
    emoji: '🐍',
    photo: null   // dataURL pequeño (avatar) o null
  },
  currentLanguageId: 'python',
  courses: {},
  // Modo administrador: abre todos los módulos y lecciones para poder
  // testear el contenido. No altera el progreso ni los logros.
  adminMode: false,
  // Legado v2 (solo se usa al migrar)
  user: null,
  progress: null,
  achievements: null,
  currentLesson: null,
  currentModuleId: null
};

// ════════════════════════════════════════
// MODO ADMINISTRADOR
// Puerta trasera para testear el contenido sin tener que encadenar
// lecciones. OJO: esto vive en el cliente, así que NO es seguridad
// real — cualquiera que abra las herramientas del navegador puede
// calling  App.setAdminMode(true) directamente. Solo evita tener que
// teclear la contraseña mientras se prueban los cursos.
// La contraseña NO se guarda en claro: se compara con su hash.
// ════════════════════════════════════════
// Hash FNV-1a de 32 bits de la contraseña. Ofusca, no cifra: suficiente
// para no dejarla a la vista en el código fuente, pero cualquiera con
// acceso al código puede revertirla. Para cambiar la contraseña:
//   node -e "let h=0x811c9dc5;for(const c of 'TU_CONTRASENA'){h^=c.charCodeAt(0);h=Math.imul(h,0x01000193)>>>0}console.log(('0000000'+h.toString(16)).slice(-8))"
const ADMIN_HASH = '212481b6';

// ════════════════════════════════════════
// ACHIEVEMENTS
// ════════════════════════════════════════
const ACHIEVEMENTS = [
  { id: 'first-lesson',   name: 'Primera Lección',  icon: '🎯', desc: 'Completa tu primera lección' },
  { id: 'streak-3',       name: 'En Racha',         icon: '🔥', desc: '3 días seguidos' },
  { id: 'streak-7',       name: 'Semana Perfecta',  icon: '💫', desc: '7 días seguidos' },
  { id: 'streak-30',      name: 'Imparable',        icon: '🌟', desc: '30 días seguidos' },
  { id: 'xp-500',         name: '500 XP',           icon: '⚡', desc: 'Gana 500 puntos de experiencia' },
  { id: 'xp-2000',        name: '2000 XP',          icon: '💎', desc: 'Gana 2000 puntos de experiencia' },
  { id: 'xp-10000',       name: 'Maestro',          icon: '🏆', desc: 'Gana 10000 puntos de experiencia' },
  { id: 'perfectionist',  name: 'Perfeccionista',   icon: '✨', desc: '10 ejercicios seguidos sin errores' },
  { id: 'mod1-done',      name: 'Primer Módulo',    icon: '🐣', desc: 'Completa Módulo 1' },
  { id: 'mod5-done',      name: 'Medio Camino',     icon: '🗺️',  desc: 'Completa 5 módulos' },
  { id: 'speed-runner',   name: 'Velocista',        icon: '⚡', desc: 'Completa una lección en menos de 2 min' },
  { id: 'level-5',        name: 'Nivel 5',          icon: '🎖️', desc: 'Alcanza el nivel 5' },
  { id: 'level-10',       name: 'Nivel 10',         icon: '🥇', desc: 'Alcanza el nivel 10' },
  { id: 'pythonista',     name: 'Pythonista',       icon: '🐍', desc: 'Completa todos los módulos' },
];

// ════════════════════════════════════════
// LEADERBOARD
// ════════════════════════════════════════
// 1) Jugadores de relleno (bots), para que la liga no se vea vacía
//    cuando aún no hay usuarios reales. Igual que los NPC de una máquina
//    recreativa: están ahí para dar contexto y superseded al primer
//    jugador de verdad. Los XP están repartidos para que el podio y la
//    lista parezcan un ranking real.
//    AVISO: no son usuarios reales. Se marcan con 🤖 en la lista.
//    Para desactivarlos: LEAGUE_BOTS = [].
//
// 2) Usuarios reales del servidor: para activarlos, pon
//    window.DEVQUEST_LEADERBOARD_URL (antiguo: PYQUEST_LEADERBOARD_URL)
//    a un endpoint que devuelva [{ id, name, xp, emoji }]. Se mezclan
//    con los bots.
// ════════════════════════════════════════
const LEAGUE_BOTS = [
  { name: 'LunaDev',   emoji: '🌙', xp: 12480 },
  { name: 'ByteKnight', emoji: '🛡️', xp: 9875 },
  { name: 'AnaCode',   emoji: '🌸', xp: 7420 },
  { name: 'Rafa_JS',   emoji: '⚡', xp: 6310 },
  { name: 'MartaBuilds', emoji: '🌻', xp: 5240 },
  { name: 'LoopHard',  emoji: '🔁', xp: 4180 },
  { name: 'NicoStack', emoji: '🧱', xp: 3560 },
  { name: 'ZoeRender', emoji: '🎨', xp: 2890 },
  { name: 'KaiPrompt', emoji: '🧠', xp: 2140 },
  { name: 'DaniRegex', emoji: '🎯', xp: 1620 },
  { name: 'SoniaCss',  emoji: '🎨', xp: 1150 },
  { name: 'PauPython', emoji: '🐍', xp: 780 }
];

const LEADERBOARD_CONFIG = {
  remoteUrl: typeof window !== 'undefined' ? window.DEVQUEST_LEADERBOARD_URL || window.PYQUEST_LEADERBOARD_URL || null : null
};

function generateUserId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

// ════════════════════════════════════════
// CONTACTO
// La lógica de envío vive en contact.js (tres vías: API propia, servicio
// de formularios y mailto). Aquí solo se conecta el formulario al DOM.
// ════════════════════════════════════════

// ════════════════════════════════════════
// APP STATE MANAGER
// ════════════════════════════════════════
const App = {
  state: null,
  currentScreen: 'welcome',
  lessonSession: {
    exerciseIndex: 0,
    exercises: [],
    mistakes: 0,
    xpEarned: 0,
    startTime: 0,
    consecutiveCorrect: 0,
  },

  /**
   * Escapa HTML para prevenir XSS.
   * Usar siempre que se interpole datos de usuario en innerHTML.
   * Igual que Engine._escapeHtml pero disponible en App sin dependencia circular.
   */
  _escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, "\'");
  },

  // ─────────────────────────────────────
  // INIT
  // ─────────────────────────────────────
  init() {
    this.loadState();
    this.setupNav();
    this.setupWelcome();
    this.setupCompleteScreen();
    this.setupProfileEditor();
    this.setupAdminMode();
    this.setupContactForm();
    this.checkStreak();
    this.refillLives();

    if (this.state.profile.name) {
      this.showScreen('languages');
      this.renderLanguages();
    } else {
      this.showScreen('welcome');
    }
  },

  // ─────────────────────────────────────
  // COURSES (un curso independiente por lenguaje)
  // ─────────────────────────────────────
  currentLanguage() {
    const langs = window.LANGUAGES || [];
    return langs.find(l => l.id === this.state.currentLanguageId) || langs[0];
  },

  currentModules() {
    const lang = this.currentLanguage();
    return (lang && lang.modules) || [];
  },

  course(langId) {
    const id = langId || this.state.currentLanguageId || 'python';
    if (!this.state.courses) this.state.courses = {};
    if (!this.state.courses[id]) this.state.courses[id] = freshCourse();
    return this.state.courses[id];
  },

  courseProgress(langId) {
    const lang = (window.LANGUAGES || []).find(l => l.id === (langId || this.state.currentLanguageId));
    const modules = (lang && lang.modules) || [];
    const course = this.course(langId);
    let done = 0, total = 0;
    modules.forEach(mod => {
      total += mod.lessons.length;
      const prog = course.progress[mod.id];
      if (prog) done += prog.completedLessons.length;
    });
    return { done, total, pct: total ? Math.round(done / total * 100) : 0 };
  },

  // ─────────────────────────────────────
  // STATE PERSISTENCE
  // ─────────────────────────────────────
  loadState() {
    try {
      const saved = localStorage.getItem('pyquest-state-v2');
      this.state = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_STATE));
    } catch (e) {
      this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
    // Migración v2 (plano, solo Python) → v3 (cursos por lenguaje)
    if (this.state.version !== COURSE_VERSION) {
      this.state = this.migrateV2toV3(this.state);
      this.saveState();
    }
    if (!this.state.profile) this.state.profile = { id: null, name: '', emoji: '🐍', photo: null };
    if (!this.state.profile.emoji) this.state.profile.emoji = '🐍';
    if (!this.state.profile.id) {
      this.state.profile.id = generateUserId();
      this.saveState();
    }
    if (!this.state.courses) this.state.courses = {};
    if (typeof this.state.adminMode !== 'boolean') this.state.adminMode = false;
    this.course(this.state.currentLanguageId || 'python');
  },

  migrateV2toV3(old) {
    const flat = old || {};
    const flatUser = flat.user || {};
    const course = freshCourse();
    course.user.level = flatUser.level || 1;
    course.user.xp = flatUser.xp || 0;
    course.user.xpToNext = flatUser.xpToNext || 200;
    course.user.streak = flatUser.streak || 0;
    course.user.lastStudyDate = flatUser.lastStudyDate || null;
    course.user.lives = flatUser.lives ?? 5;
    course.user.maxLives = flatUser.maxLives || 5;
    course.user.livesLastRefill = flatUser.livesLastRefill || Date.now();
    course.user.totalExercises = flatUser.totalExercises || 0;
    course.user.totalCorrect = flatUser.totalCorrect || 0;
    course.progress = flat.progress || {};
    course.achievements = flat.achievements || {};
    course.currentLesson = flat.currentLesson || null;
    course.currentModuleId = flat.currentModuleId || null;
    return {
      version: COURSE_VERSION,
      profile: {
        id: flatUser.id || null,
        name: flatUser.name || '',
        emoji: flatUser.avatar || '🐍',
        photo: null
      },
      currentLanguageId: 'python',
      courses: { python: course },
      adminMode: false
    };
  },

  saveState() {
    try {
      localStorage.setItem('pyquest-state-v2', JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save state', e);
    }
  },

  // ─────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(`screen-${id}`);
    if (screen) screen.classList.add('active');
    this.currentScreen = id;

    const noNav = ['welcome', 'lesson', 'complete'];
    const nav = document.getElementById('bottom-nav');
    if (nav) nav.style.display = noNav.includes(id) ? 'none' : 'flex';

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.screen === id);
    });
  },

  setupNav() {
    document.getElementById('home-back-btn')?.addEventListener('click', () => {
      this.showScreen('languages');
      this.renderLanguages();
      setTimeout(() => this.scrollToTop(), 100);
    });
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const screen = item.dataset.screen;
        if (screen === 'home') {
          this.showScreen('languages');
          this.renderLanguages();
          return;
        }
        this.showScreen(screen);
        if (screen === 'profile') this.renderProfile();
        if (screen === 'league') this.renderLeague();
      });
    });
  },

  // ─────────────────────────────────────
  // SCROLL HELPERS
  // ─────────────────────────────────────
  scrollToElement(selector, offset = 0) {
    const el = document.querySelector(selector);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  },

  scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  },

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // ─────────────────────────────────────
  // WELCOME SCREEN
  // ─────────────────────────────────────
  setupWelcome() {
    const btn = document.getElementById('btn-start');
    const input = document.getElementById('input-name');
    if (!btn || !input) return;

    const startFn = () => {
      const name = input.value.trim() || 'Pythonista';
      this.state.profile.name = name;
      this.saveState();
      this.showScreen('languages');
      this.renderLanguages();
      this.showToast(`¡Bienvenido, ${name}! 🐍`, 'success');
      // Scroll al contenido de aprendizaje
      setTimeout(() => this.scrollToElement('.languages-grid'), 300);
    };

    btn.addEventListener('click', startFn);
    input.addEventListener('keypress', e => { if (e.key === 'Enter') startFn(); });
  },

  // ─────────────────────────────────────
  // STREAK CHECK
  // ─────────────────────────────────────
  checkStreak() {
    const today = new Date().toDateString();
    const lastDate = this.course().user.lastStudyDate;

    if (!lastDate) return;

    const last = new Date(lastDate);
    const diff = Math.floor((Date.now() - last) / (1000 * 60 * 60 * 24));

    if (diff > 1) {
      // Streak broken
      this.course().user.streak = 0;
      this.saveState();
    }
  },

  // ─────────────────────────────────────
  // LIVES REFILL
  // ─────────────────────────────────────
  refillLives() {
    const user = this.course().user;
    const now = Date.now();
    const msPerLife = 30 * 60 * 1000; // 30 min per life
    const elapsed = now - (user.livesLastRefill || now);
    const livesToAdd = Math.floor(elapsed / msPerLife);

    if (livesToAdd > 0 && user.lives < user.maxLives) {
      user.lives = Math.min(user.maxLives, user.lives + livesToAdd);
      user.livesLastRefill = now;
      this.saveState();
    }
  },

  // ─────────────────────────────────────
  // LANGUAGES HUB (página principal)
  // ─────────────────────────────────────
  renderLanguages() {
    const container = document.getElementById('languages-grid');
    if (!container) return;
    container.innerHTML = '';

    const name = this.state.profile.name || 'Pythonista';
    this._setText('hub-username', name);
    this.applyAvatar(document.getElementById('hub-avatar'));

    (window.LANGUAGES || []).forEach(lang => {
      const { done, total, pct } = this.courseProgress(lang.id);
      const level = (this.course(lang.id).user || {}).level || 1;
      const locked = !!lang.comingSoon || total === 0;

      const card = document.createElement('div');
      card.className = `language-card${locked ? ' locked' : ''}`;
      card.style.setProperty('--lang-gradient', lang.gradient || lang.color);
      card.innerHTML = `
        <div class="language-icon-wrap" style="background:${lang.gradient || lang.color}22">
          <span>${lang.icon}</span>
        </div>
        <div class="language-info">
          <div class="language-title">${lang.title}</div>
          <div class="language-meta">
            <span class="module-level-badge">Nv. ${level}</span>
            <span>${locked ? 'Próximamente' : `${done}/${total} lecciones`}</span>
          </div>
        </div>
        <div class="module-status-icon">${locked ? '🔒' : pct === 100 && total > 0 ? '✅' : '▶️'}</div>
        ${locked ? '' : `<div class="module-progress-bar"><div class="module-progress-fill" style="width:${pct}%; background:${lang.gradient || lang.color}"></div></div>`}
      `;

      if (!locked) {
        card.addEventListener('click', () => {
          this.state.currentLanguageId = lang.id;
          this.saveState();
          this.showScreen('home');
          this.renderHome();
          setTimeout(() => this.scrollToTop(), 100);
        });
      }

      container.appendChild(card);
    });
  },

  // ─────────────────────────────────────
  // HOME SCREEN (curso actual)
  // ─────────────────────────────────────
  renderHome() {
    const user = this.course().user;
    const lang = this.currentLanguage() || {};
    const xpPct = Math.min(100, (user.xp % user.xpToNext) / user.xpToNext * 100);

    // User info
    const name = this.state.profile.name || 'Pythonista';
    this._setText('home-username', name);
    this.applyAvatar(document.getElementById('home-avatar'));
    this._setText('home-language', `${lang.icon || ''} ${lang.title || ''}`);
    this._setText('home-language-about', lang.about || '');
    this._setText('home-streak', `${user.streak}`);
    this._setText('home-xp', `${user.xp}`);
    this._setText('home-lives', `${user.lives}`);
    this._setText('home-level', `Nv. ${user.level}`);
    this._setText('home-xp-label', `${user.xp % user.xpToNext} / ${user.xpToNext} XP`);

    const xpBar = document.getElementById('home-xp-bar');
    if (xpBar) xpBar.style.width = xpPct + '%';

    // Continue button
    const { mod, les } = this._getNextLesson();
    if (mod && les) {
      this._setText('continue-module-name', mod.title);
      this._setText('continue-lesson-name', les.title);
      const continueCard = document.getElementById('continue-card');
      if (continueCard) {
        continueCard.onclick = () => this.startLesson(mod.id, les.id);
      }
    }

    // Render module cards
    this._renderModuleList();
  },

  _renderModuleList() {
    const container = document.getElementById('module-list');
    if (!container) return;
    container.innerHTML = '';

    this.currentModules().forEach((mod, modIdx) => {
      const progress = this.course().progress[mod.id] || { completedLessons: [], xpEarned: 0 };
      const totalLessons = mod.lessons.length;
      const completedLessons = progress.completedLessons.length;
      const pct = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
      const isLocked = modIdx > 0 && !this._isModuleUnlocked(modIdx);
      const isCompleted = completedLessons === totalLessons;

      const card = document.createElement('div');
      card.className = `module-card${isLocked ? ' locked' : ''}${isCompleted ? ' completed' : ''}`;
      card.style.setProperty('--module-gradient', mod.gradient || mod.color);

      card.innerHTML = `
        <div class="module-header-row">
          <div class="module-icon-wrap" style="background:${mod.gradient || mod.color}22">
            <span>${mod.icon}</span>
          </div>
          <div class="module-info">
            <div class="module-title">${mod.title}</div>
            <div class="module-meta">
              <span class="module-level-badge${mod.isProject ? ' project' : ''}">${mod.level}</span>
              <span>${completedLessons}/${totalLessons} lecciones</span>
            </div>
          </div>
          <div class="module-status-icon">
            ${isLocked ? '🔒' : isCompleted ? '✅' : '▶️'}
          </div>
        </div>
        <div class="module-progress-bar">
          <div class="module-progress-fill" style="width:${pct}%; background:${mod.gradient || mod.color}"></div>
        </div>
      `;

      if (!isLocked) {
        card.addEventListener('click', () => this.showModuleDetail(mod.id));
      }

      container.appendChild(card);
    });
  },

  _isModuleUnlocked(modIdx) {
    if (modIdx === 0) return true;
    if (this.isAdmin()) return true;   // Modo admin: todo abierto
    const modules = this.currentModules();
    const prevMod = modules[modIdx - 1];
    const prevProgress = this.course().progress[prevMod.id] || { completedLessons: [] };
    // Need at least 1 lesson of prev module completed to unlock
    return prevProgress.completedLessons.length >= 1;
  },

  /** Una lección está abierta si es la primera, si la anterior está hecha o si es admin. */
  _isLessonUnlocked(mod, index, progress) {
    if (this.isAdmin()) return true;
    const done = progress.completedLessons || [];
    if (index === 0) return true;
    return done.includes(mod.lessons[index - 1].id);
  },

  _getNextLesson() {
    const modules = this.currentModules();
    for (const mod of modules) {
      const progress = this.course().progress[mod.id] || { completedLessons: [] };
      for (const les of mod.lessons) {
        if (!progress.completedLessons.includes(les.id)) {
          return { mod, les };
        }
      }
    }
    return { mod: modules[0], les: modules[0] && modules[0].lessons[0] };
  },

  // ─────────────────────────────────────
  // MODULE DETAIL
  // ─────────────────────────────────────
  showModuleDetail(moduleId) {
    const mod = this.currentModules().find(m => m.id === moduleId);
    if (!mod) return;
    this.course().currentModuleId = moduleId;

    const container = document.getElementById('module-detail-content');
    if (!container) return;

    const progress = this.course().progress[moduleId] || { completedLessons: [] };

    container.innerHTML = `
      <div class="module-detail-header">
        <button class="back-btn" id="mod-detail-back">←</button>
        <span class="module-detail-icon" style="filter: drop-shadow(0 0 20px ${mod.color}88)">${mod.icon}</span>
        <h1 class="module-detail-title">${mod.title}</h1>
        <p class="module-detail-subtitle">${mod.subtitle}</p>
      </div>
      <div class="lessons-list">
        ${mod.lessons.map((les, i) => {
          const done = progress.completedLessons.includes(les.id);
          const locked = !this._isLessonUnlocked(mod, i, progress);
          const xpReward = les.exercises.reduce((sum, ex) => sum + (ex.xp || 10), 0);

          return `
            <div class="lesson-card${done ? ' completed' : ''}${locked ? ' locked' : ''}"
                 data-lesson-id="${les.id}" data-module-id="${moduleId}">
              <div class="lesson-number${done ? ' done' : ''}">${done ? '✓' : i+1}</div>
              <div class="lesson-info">
                <div class="lesson-title">${les.icon || '📖'} ${les.title}</div>
                <div class="lesson-meta">${les.exercises.length} ejercicios · ${done ? '¡Completado!' : locked ? '🔒 Bloqueado' : 'Disponible'}</div>
              </div>
              <div class="lesson-xp-badge">+${xpReward} XP</div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Back button
    container.querySelector('#mod-detail-back')?.addEventListener('click', () => {
      this.showScreen('home');
      this.renderHome();
    });

    // Lesson click
    container.querySelectorAll('.lesson-card:not(.locked)').forEach(card => {
      card.addEventListener('click', () => {
        this.startLesson(card.dataset.moduleId, card.dataset.lessonId);
      });
    });

    this.showScreen('module-detail');
  },

  // ─────────────────────────────────────
  // LESSON SESSION
  // ─────────────────────────────────────
  startLesson(moduleId, lessonId) {
    const mod = this.currentModules().find(m => m.id === moduleId);
    const les = mod?.lessons.find(l => l.id === lessonId);
    if (!mod || !les) return;

    this.course().currentLesson = { moduleId, lessonId };

    this.lessonSession = {
      exerciseIndex: 0,
      exercises: [...les.exercises],
      mistakes: 0,
      xpEarned: 0,
      startTime: Date.now(),
      consecutiveCorrect: 0,
      moduleId,
      lessonId,
      lessonTitle: les.title,
      moduleName: mod.title,
    };

    this.showScreen('lesson');
    this._setText('lesson-title', les.title);
    this.renderExercise();
    setTimeout(() => this.scrollToTop(), 100);
  },

  renderExercise() {
    const session = this.lessonSession;
    const ex = session.exercises[session.exerciseIndex];
    if (!ex) return;

    // Update progress bubbles
    const total = session.exercises.length;
    const current = session.exerciseIndex;
    const bubblesContainer = document.getElementById('progress-bubbles');
    if (bubblesContainer) {
      bubblesContainer.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const b = document.createElement('div');
        b.className = `progress-bubble${i < current ? ' done' : i === current ? ' current' : ''}`;
        bubblesContainer.appendChild(b);
      }
    }

    // Update lives
    this._renderLives();

    // Render exercise
    const area = document.getElementById('exercise-area');
    if (area) Engine.render(ex, area, this.state.currentLanguageId);

    // Set up check button
    const checkBtn = document.getElementById('btn-check');
    if (checkBtn) {
      checkBtn.textContent = 'Comprobar';
      checkBtn.className = 'btn btn-primary btn-full';
      checkBtn.setAttribute('disabled', '');
      checkBtn.onclick = () => this.checkAnswer();
      checkBtn.style.display = 'block';
    }

    // Hide next lesson button
    const nextBtn = document.getElementById('btn-next-lesson');
    if (nextBtn) {
      nextBtn.style.display = 'none';
    }

    // Hide feedback
    this.hideFeedback();
  },

  async checkAnswer() {
    const session = this.lessonSession;
    const ex = session.exercises[session.exerciseIndex];
    if (!ex) return;

    const result = await Engine.validate(ex);

    if (result.message && !result.correct) {
      this.showToast(result.message, 'error');
      return;
    }

    const checkBtn = document.getElementById('btn-check');
    const nextBtn = document.getElementById('btn-next-lesson');

    if (result.correct) {
      session.consecutiveCorrect++;
      session.xpEarned += ex.xp || 10;
      this.course().user.totalCorrect++;
      this.course().user.totalExercises++;
      this.showXPPopup(ex.xp || 10);
      this.showFeedback(true, result.explanation, ex);
    } else {
      session.consecutiveCorrect = 0;
      session.mistakes++;
      this.course().user.totalExercises++;

      // Lose a life
      if (this.course().user.lives > 0) {
        this.course().user.lives--;
        this.course().user.livesLastRefill = Date.now();
      }
      this._renderLives();

      this.showFeedback(false, result.explanation, ex);
    }

    this.saveState();

    // Mostrar el botón "Siguiente lección" y ocultar "Comprobar"
    if (checkBtn && nextBtn) {
      checkBtn.style.display = 'none';
      nextBtn.style.display = 'block';
      nextBtn.onclick = () => {
        this.nextExercise();
        // Scroll hacia arriba donde está la lección
        setTimeout(() => this.scrollToElement('.exercise-area'), 100);
      };
    }

    // Scroll al feedback para que el usuario vea el resultado
    setTimeout(() => this.scrollToElement('.feedback-panel'), 100);
  },

  nextExercise() {
    const session = this.lessonSession;
    session.exerciseIndex++;

    if (session.exerciseIndex >= session.exercises.length) {
      this.completeLesson();
    } else {
      this.renderExercise();
      // Scroll al inicio del ejercicio
      setTimeout(() => this.scrollToTop(), 100);
    }
  },

  completeLesson() {
    const session = this.lessonSession;

    // Update progress
    if (!this.course().progress[session.moduleId]) {
      this.course().progress[session.moduleId] = { completedLessons: [], xpEarned: 0 };
    }

    const prog = this.course().progress[session.moduleId];
    if (!prog.completedLessons.includes(session.lessonId)) {
      prog.completedLessons.push(session.lessonId);
    }
    prog.xpEarned = (prog.xpEarned || 0) + session.xpEarned;

    // Add XP and level up
    this.addXP(session.xpEarned);

    // Update streak
    const today = new Date().toDateString();
    if (this.course().user.lastStudyDate !== today) {
      if (this.course().user.lastStudyDate === new Date(Date.now() - 86400000).toDateString()) {
        this.course().user.streak++;
      } else if (!this.course().user.lastStudyDate) {
        this.course().user.streak = 1;
      } else {
        this.course().user.streak = 1;
      }
      this.course().user.lastStudyDate = today;
    }

    // Check achievements
    this.checkAchievements();
    this.saveState();

    // Show complete screen
    this.showCompleteScreen();
  },

  // ─────────────────────────────────────
  // XP & LEVELING
  // ─────────────────────────────────────
  addXP(amount) {
    const user = this.course().user;
    user.xp += amount;

    while (user.xp >= user.xpToNext) {
      user.xp -= user.xpToNext;
      user.level++;
      user.xpToNext = Math.floor(user.xpToNext * 1.4);
      this.showToast(`¡Nivel ${user.level}! 🎉`, 'success');
    }
  },

  // ─────────────────────────────────────
  // COMPLETE SCREEN
  // ─────────────────────────────────────
  setupCompleteScreen() {
    const continueBtn = document.getElementById('btn-complete-continue');
    if (continueBtn) {
      continueBtn.onclick = () => {
        const session = this.lessonSession;
        if (!session) return;

        // Obtener la siguiente lección y empezarla directamente
        const nextLesson = this._getNextLesson();
        if (nextLesson && nextLesson.les) {
          this.startLesson(nextLesson.mod.id, nextLesson.les.id);
          // Subir arriba donde está la lección, dejando Comprobar visible abajo
          setTimeout(() => this.scrollToTop(), 100);
        } else {
          this.showModuleDetail(session.moduleId);
          setTimeout(() => this.scrollToTop(), 100);
        }
      };
    }

    const homeBtn = document.getElementById('btn-complete-home');
    if (homeBtn) {
      homeBtn.onclick = () => {
        this.showScreen('home');
        this.renderHome();
        setTimeout(() => this.scrollToTop(), 100);
      };
    }
  },

  showCompleteScreen() {
    const session = this.lessonSession;
    const total = session.exercises.length;
    const correct = total - session.mistakes;
    const accuracy = Math.round((correct / total) * 100);
    const timeSec = Math.floor((Date.now() - session.startTime) / 1000);

    this._setText('complete-xp', `+${session.xpEarned}`);
    this._setText('complete-accuracy', `${accuracy}%`);
    this._setText('complete-streak', `${this.course().user.streak}`);
    this._setText('complete-lesson-name', session.lessonTitle);

    this.showScreen('complete');
    this.launchConfetti();
    setTimeout(() => this.scrollToTop(), 100);
  },

  // ─────────────────────────────────────
  // FEEDBACK PANEL
  // ─────────────────────────────────────
  // Devuelve el HTML con la solución correcta de un ejercicio (para mostrarlo al fallar)
  _correctAnswerHtml(exercise) {
    if (!exercise) return '';
    const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const code = (body) => `<pre class="solution-code">${esc(body)}</pre>`;

    switch (exercise.type) {
      case 'type-code':
        return exercise.solution ? code(exercise.solution) : '';
      case 'multiple-choice':
      case 'fix-bug':
        return exercise.correct !== undefined && exercise.choices
          ? code(exercise.choices[exercise.correct])
          : '';
      case 'predict-output':
        return exercise.correctOutput !== undefined && exercise.output
          ? code(exercise.output[exercise.correctOutput])
          : '';
      case 'fill-blank': {
        if (!exercise.code || !exercise.blanks) return '';
        let i = 0;
        return code(exercise.code.replace(/___/g, () => exercise.blanks[i++] ?? '___'));
      }
      case 'reorder':
        return exercise.blocks && exercise.correctOrder
          ? code(exercise.correctOrder.map(idx => exercise.blocks[idx]).join('\n'))
          : '';
      default:
        return '';
    }
  },

  showFeedback(correct, explanation, exercise) {
    const panel = document.getElementById('feedback-panel');
    if (!panel) return;

    const answer = correct ? '' : this._correctAnswerHtml(exercise);
    // Reserva espacio para que el panel no tape el contenido de la lección
    document.getElementById('screen-lesson')?.classList.add('feedback-open');
    panel.innerHTML = `
      <div class="feedback-result">
        <div class="feedback-icon">${correct ? '✅' : '❌'}</div>
        <div class="feedback-texts">
          <div class="fb-title ${correct ? 'correct' : 'wrong'}">${correct ? '¡Correcto!' : 'Incorrecto'}</div>
          ${explanation ? `<div class="fb-explain">${explanation}</div>`
            : `<div class="fb-explain">Repasa la explicación del ejercicio y vuelve a intentarlo.</div>`}
        </div>
      </div>
      ${answer ? `
        <div class="solution-block">
          <div class="solution-title">💡 Cómo se resuelve</div>
          ${answer}
        </div>
      ` : ''}
    `;

    panel.style.background = correct ? 'rgba(0, 232, 122, 0.06)' : 'rgba(255, 71, 87, 0.06)';
    panel.style.borderTopColor = correct ? 'var(--border-success)' : 'var(--border-error)';
    panel.classList.remove('hidden');

    // Mide el panel ya pintado y reserva ese espacio en el ejercicio,
    // para que el botón Ejecutar nunca quede debajo
    requestAnimationFrame(() => {
      const screen = document.getElementById('screen-lesson');
      if (!screen) return;
      const alto = Math.round(panel.getBoundingClientRect().height) + 100;
      screen.style.setProperty('--feedback-h', alto + 'px');
    });
  },

  hideFeedback() {
    const panel = document.getElementById('feedback-panel');
    if (panel) panel.classList.add('hidden');
    document.getElementById('screen-lesson')?.classList.remove('feedback-open');
  },

  // ─────────────────────────────────────
  // ACHIEVEMENTS
  // ─────────────────────────────────────
  checkAchievements() {
    const user = this.course().user;
    const progress = this.course().progress;
    const achievements = this.course().achievements;
    const modules = this.currentModules();

    const check = (id, condition) => {
      if (!achievements[id] && condition) {
        achievements[id] = true;
        const ach = ACHIEVEMENTS.find(a => a.id === id);
        if (ach) setTimeout(() => this.showToast(`🏆 Logro: ${ach.name}`, 'success'), 1500);
      }
    };

    const totalModules = modules.length;
    const completedModules = Object.values(progress).filter(p =>
      p.completedLessons.length > 0
    ).length;

    check('first-lesson', Object.values(progress).some(p => p.completedLessons.length > 0));
    check('streak-3', user.streak >= 3);
    check('streak-7', user.streak >= 7);
    check('streak-30', user.streak >= 30);
    check('xp-500', user.xp >= 500);
    check('xp-2000', user.xp >= 2000);
    check('xp-10000', user.xp >= 10000);
    check('mod1-done', modules.length > 0 && (progress[modules[0].id]?.completedLessons.length || 0) >= modules[0].lessons.length);
    check('mod5-done', completedModules >= 5);
    check('pythonista', totalModules > 0 && completedModules >= totalModules);
    check('level-5', user.level >= 5);
    check('level-10', user.level >= 10);
    check('perfectionist', this.lessonSession.consecutiveCorrect >= 10);

    const timeSec = Math.floor((Date.now() - this.lessonSession.startTime) / 1000);
    check('speed-runner', timeSec < 120 && this.lessonSession.exercises.length > 0);
  },

  // ─────────────────────────────────────
  // MODO ADMINISTRADOR
  // ─────────────────────────────────────

  /** ¿Está activo el modo administrador? */
  isAdmin() {
    return !!this.state.adminMode;
  },

  /** Comprueba la contraseña contra el hash guardado en ADMIN_HASH. */
  checkAdminPassword(password) {
    let h = 0x811c9dc5;
    const s = String(password ?? '');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return ('0000000' + h.toString(16)).slice(-8) === ADMIN_HASH;
  },

  /** Enciende o apaga el modo administrador y repinta lo que depende de él. */
  setAdminMode(on) {
    this.state.adminMode = !!on;
    this.saveState();
    this._renderAdminButton();
    // Los módulos y las lecciones se dibujan con el candado: hay que repintarlos
    if (this.currentScreen === 'home') this.renderHome();
    if (this.currentScreen === 'module-detail' && this.course().currentModuleId) {
      this.showModuleDetail(this.course().currentModuleId);
    }
  },

  _renderAdminButton() {
    const btn = document.getElementById('btn-admin');
    if (!btn) return;
    btn.classList.toggle('active', this.isAdmin());
    btn.title = this.isAdmin()
      ? 'Modo administrador activo — pulsa para desactivarlo'
      : 'Modo administrador';
    btn.setAttribute('aria-label', btn.title);
  },

  setupAdminMode() {
    const btn = document.getElementById('btn-admin');
    const modal = document.getElementById('admin-modal');
    const form = document.getElementById('admin-form');
    const input = document.getElementById('admin-password');
    const error = document.getElementById('admin-error');
    if (!btn || !modal || !form || !input) return;

    this._renderAdminButton();

    // Si ya estaba activo y vuelve a pulsar, lo desactiva directamente
    btn.addEventListener('click', () => {
      if (this.isAdmin()) {
        this.setAdminMode(false);
        this.showToast('🔒 Modo administrador desactivado');
        return;
      }
      this.openAdminModal();
    });

    const close = () => {
      modal.hidden = true;
      form.reset();
      input.classList.remove('error');
      if (error) { error.hidden = true; error.textContent = ''; }
    };

    this._closeAdminModal = close;
    this.openAdminModal = () => {
      modal.hidden = false;
      input.value = '';
      if (error) { error.hidden = true; error.textContent = ''; }
      input.classList.remove('error');
      input.focus();
    };

    // Cerrar con el fondo, con Cancelar o con Escape
    modal.querySelector('[data-close-admin]')?.addEventListener('click', close);
    document.getElementById('admin-cancel')?.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) close();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.checkAdminPassword(input.value)) {
        this.setAdminMode(true);
        close();
        this.showToast('🦆 Modo administrador: todos los ejercicios abiertos', 'success');
      } else {
        input.classList.add('error');
        input.select();
        if (error) {
          error.textContent = 'Contraseña incorrecta';
          error.hidden = false;
        }
      }
    });
  },

  // ─────────────────────────────────────
  // FORMULARIO DE CONTACTO
  // ─────────────────────────────────────
  setupContactForm() {
    const toggle = document.getElementById('btn-contact-toggle');
    const panel = document.getElementById('contact-panel');
    const form = document.getElementById('contact-form');
    if (!toggle || !panel || !form) return;

    const estado = document.getElementById('contact-status');
    const campos = {
      name: document.getElementById('contact-name'),
      email: document.getElementById('contact-email'),
      subject: document.getElementById('contact-subject'),
      message: document.getElementById('contact-message')
    };

    const abrir = () => {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      campos.name.focus();
    };

    const cerrar = () => {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    };

    this._openContact = abrir;
    this._closeContact = cerrar;

    toggle.addEventListener('click', () => {
      if (panel.hidden) abrir(); else cerrar();
    });

    document.getElementById('contact-cancel')?.addEventListener('click', () => {
      cerrar();
    });

    // Prepara el nombre si el usuario ya se ha registrado
    if (campos.name && !campos.name.value) {
      campos.name.value = this.state.profile?.name || '';
    }

    const limpiarErrores = () => {
      Object.values(campos).forEach(c => c?.classList.remove('error'));
      if (estado) { estado.hidden = true; estado.textContent = ''; estado.className = 'contact-status'; }
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      limpiarErrores();

      const C = window.Contact;
      const entrada = {
        name: campos.name.value,
        email: campos.email.value,
        subject: campos.subject.value,
        message: campos.message.value
      };

      // La validación vive en contact.js para que cliente y servidor
      // compartan exactamente los mismos mínimos
      const { ok, errores } = C.validar(entrada);
      if (!ok) {
        errores.forEach(er => campos[er.campo]?.classList.add('error'));
        this._contactStatus(estado, 'ko', errores[0].texto);
        campos[errores[0].campo]?.focus();
        return;
      }

      const boton = document.getElementById('contact-send');
      if (boton) { boton.disabled = true; boton.textContent = 'Enviando…'; }

      try {
        const r = await C.enviar(entrada, { token: this.state.authToken || null });

        if (!r.ok) {
          this._contactStatus(estado, 'ko', r.aviso);
          return;
        }

        const textos = {
          api: '¡Gracias! Hemos recibido tu mensaje y te contestaremos pronto.',
          form: '¡Gracias! Hemos recibido tu mensaje y te contestaremos pronto.',
          mailto: 'Se ha abierto tu gestor de correo. Pulsa enviar y nos llegará a duckdev77@gmail.com.'
        };
        this._contactStatus(estado, r.via === 'mailto' ? 'aviso' : 'ok', textos[r.via] || 'Mensaje enviado.');

        // Con mailto el visitante puede querer corregir algo antes de pulsar
        // enviar, así que el formulario se deja tal cual
        if (r.via !== 'mailto') {
          form.reset();
          if (campos.name) campos.name.value = this.state.profile?.name || '';
        }

        if (r.aviso) this.showToast(r.aviso);
      } finally {
        if (boton) { boton.disabled = false; boton.textContent = 'Enviar mensaje'; }
      }
    });
  },

  _contactStatus(element, tipo, texto) {
    if (!element) return;
    element.className = 'contact-status ' + tipo;
    element.textContent = texto;
    element.hidden = false;
  },

  // ─────────────────────────────────────
  // PROFILE SCREEN
  // ─────────────────────────────────────
  // ─────────────────────────────────────
  // PROFILE: foto, nombre y emoji
  // ─────────────────────────────────────
  PROFILE_EMOJIS: ['🐍', '🟨', '☕', '🌐', '🎨', '🗄️', '⚙️', '🐘', '🐹', '🦀', '🤖', '👾', '🚀', '⭐', '🔥', '🌱'],

  setupProfileEditor() {
    const saveBtn = document.getElementById('btn-save-profile');
    const nameInput = document.getElementById('profile-name-input');
    if (saveBtn && nameInput) {
      saveBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (!name) {
          this.showToast('Escribe un nombre', 'error');
          return;
        }
        this.state.profile.name = name;
        this.saveState();
        this.renderProfile();
        this.showToast('Nombre guardado ✓', 'success');
      });
      nameInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') saveBtn.click();
      });
    }

    const picker = document.getElementById('emoji-picker');
    if (picker) {
      picker.innerHTML = this.PROFILE_EMOJIS
        .map(e => `<button class="emoji-option" data-emoji="${e}">${e}</button>`)
        .join('');
      picker.querySelectorAll('.emoji-option').forEach(btn => {
        btn.addEventListener('click', () => {
          this.state.profile.emoji = btn.dataset.emoji;
          this.state.profile.photo = null;
          this.saveState();
          this.renderProfile();
        });
      });
    }

    const fileInput = document.getElementById('avatar-input');
    if (fileInput) {
      fileInput.addEventListener('change', e => this.handleAvatarUpload(e));
    }

    document.getElementById('btn-clear-avatar')?.addEventListener('click', () => {
      this.state.profile.photo = null;
      this.saveState();
      this.renderProfile();
      this.showToast('Foto eliminada', 'success');
    });
  },

  // Reduce la imagen a 256x256 para no llenar localStorage
  handleAvatarUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      this.showToast('Selecciona una imagen', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.resizeAndSaveAvatar(reader.result);
    reader.onerror = () => this.showToast('No se pudo leer la imagen', 'error');
    reader.readAsDataURL(file);
    event.target.value = '';
  },

  resizeAndSaveAvatar(dataUrl) {
    const img = new Image();
    img.onload = () => {
      const size = 256;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      // Recorta a cuadrado desde el centro
      const side = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      try {
        this.state.profile.photo = canvas.toDataURL('image/jpeg', 0.75);
        this.saveState();
        this.renderProfile();
        this.showToast('Foto actualizada ✓', 'success');
      } catch (e) {
        this.showToast('No se pudo guardar la foto', 'error');
      }
    };
    img.onerror = () => this.showToast('Imagen no válida', 'error');
    img.src = dataUrl;
  },

  applyAvatar(el) {
    if (!el) return;
    const photo = this.state.profile.photo;
    if (photo) {
      el.classList.add('has-photo');
      el.style.backgroundImage = `url(${photo})`;
      el.textContent = '';
    } else {
      el.classList.remove('has-photo');
      el.style.backgroundImage = '';
      el.textContent = this.state.profile.emoji ||
        (this.state.profile.name || 'P').charAt(0).toUpperCase();
    }
  },

  renderProfile() {
    const user = this.course().user;
    const progress = this.course().progress;
    const lang = this.currentLanguage() || { title: 'Python' };
    const name = this.state.profile.name || 'Pythonista';

    this._setText('profile-name', name);
    this.applyAvatar(document.getElementById('profile-avatar'));
    const nameInput = document.getElementById('profile-name-input');
    if (nameInput && document.activeElement !== nameInput) nameInput.value = name;
    document.querySelectorAll('.emoji-option').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.emoji === (this.state.profile.emoji || '🐍'));
    });

    const totalCompleted = Object.values(progress).reduce((sum, p) => sum + p.completedLessons.length, 0);
    const totalModulesCompleted = Object.entries(progress).filter(([modId, p]) => {
      const mod = this.currentModules().find(m => m.id === modId);
      return mod && p.completedLessons.length >= mod.lessons.length;
    }).length;

    const accuracy = user.totalExercises > 0
      ? Math.round((user.totalCorrect / user.totalExercises) * 100)
      : 0;

    // Determine title
    const titles = ['Novato', 'Aprendiz', 'Estudiante', 'Programador', 'Experto', 'Maestro'];
    const titleIdx = Math.min(Math.floor(user.level / 5), titles.length - 1);
    this._setText('profile-title', `${titles[titleIdx]} de ${lang.title} · Nivel ${user.level}`);

    this._setText('psc-xp', user.xp + (user.level - 1) * 200);
    this._setText('psc-streak', user.streak);
    this._setText('psc-lessons', totalCompleted);
    this._setText('psc-accuracy', accuracy + '%');
    this._setText('psc-modules', totalModulesCompleted);
    this._setText('psc-level', user.level);

    // Achievements
    const achGrid = document.getElementById('achievements-grid');
    if (achGrid) {
      achGrid.innerHTML = ACHIEVEMENTS.map(ach => {
        const unlocked = this.course().achievements[ach.id];
        return `
          <div class="achievement-card${unlocked ? ' unlocked' : ' locked'}" title="${ach.desc}">
            <span class="ach-icon">${ach.icon}</span>
            <div class="ach-name">${ach.name}</div>
          </div>
        `;
      }).join('');
    }
  },

  // ─────────────────────────────────────
  // LEAGUE SCREEN — real users only
  // ─────────────────────────────────────
  async fetchRemoteLeaderboard() {
    const remoteUrl = (typeof window !== 'undefined' && (window.DEVQUEST_LEADERBOARD_URL || window.PYQUEST_LEADERBOARD_URL)) || LEADERBOARD_CONFIG.remoteUrl;
    if (!remoteUrl) return [];
    try {
      const res = await fetch(remoteUrl);
      if (!res.ok) return [];
      const data = await res.json();
      if (!Array.isArray(data)) return [];
      return data
        .filter(p => p && typeof p.name === 'string' && typeof p.xp === 'number')
        .map(p => ({ id: p.id || p.name, name: p.name, emoji: p.emoji || '👤', xp: p.xp }));
    } catch (e) {
      console.warn('Remote leaderboard not available', e);
      return [];
    }
  },

  async renderLeague() {
    const user = this.course().user;
    const lang = this.currentLanguage() || {};
    const userXP = user.xp || 0;

    const me = {
      id: this.state.profile.id || 'local-user',
      name: this.state.profile.name || 'Tú',
      emoji: lang.icon || '🐍',
      xp: userXP,
      isUser: true
    };

    // Usuarios reales del servidor (si está configurado)
    const remotePlayers = await this.fetchRemoteLeaderboard();

    // Bots de relleno: se les da id propio y se filtran por nombre para
    // no duplicar si algún día el servidor trae alguno con el mismo
    const bots = LEAGUE_BOTS
      .filter(b => !remotePlayers.some(p => p.name === b.name))
      .map(b => ({ id: 'bot-' + b.name, name: b.name, emoji: b.emoji, xp: b.xp, isBot: true }));

    const others = [...bots, ...remotePlayers].filter(p => p.id !== me.id && p.name !== me.name);
    const players = [...others, me].sort((a, b) => b.xp - a.xp);

    const top3 = players.slice(0, 3);
    const rest = players.slice(3);

    // Render podium
    const podiumEl = document.getElementById('podium');
    if (podiumEl) {
      if (top3.length === 0) {
        podiumEl.innerHTML = '';
      } else if (top3.length === 1) {
        const p = top3[0];
        podiumEl.innerHTML = `
          <div class="podium-place${p?.isUser ? ' is-user' : ''}">
            <div class="podium-avatar">${p?.emoji || '👤'}</div>
            <div class="podium-name">${p?.name || '?'}${p?.isUser ? ' (Tú)' : ''}${p?.isBot ? '<span class="bot-tag" title="Jugador de relleno">🤖</span>' : ''}</div>
            <div class="podium-xp">${(p?.xp || 0).toLocaleString()} XP</div>
            <div class="podium-bar" style="height:110px">🥇</div>
          </div>
        `;
      } else {
        // Order: 2nd, 1st, 3rd
        const ordered = [top3[1], top3[0], top3[2]].filter(Boolean);
        podiumEl.innerHTML = ordered.map((p, i) => {
          const medals = ['🥈', '🥇', '🥉'];
          const heights = ['80px', '110px', '60px'];
          return `
            <div class="podium-place${p?.isUser ? ' is-user' : ''}">
              <div class="podium-avatar">${p?.emoji || '👤'}</div>
              <div class="podium-name">${p?.name || '?'}${p?.isUser ? ' (Tú)' : ''}${p?.isBot ? '<span class="bot-tag" title="Jugador de relleno">🤖</span>' : ''}</div>
              <div class="podium-xp">${(p?.xp || 0).toLocaleString()} XP</div>
              <div class="podium-bar" style="height:${heights[i]}">${medals[i]}</div>
            </div>
          `;
        }).join('');
      }
    }

    // Render rest + real-user notice
    const listEl = document.getElementById('leaderboard-list');
    if (listEl) {
      const rows = rest.map((p, i) => `
        <div class="lb-row${p.isUser ? ' is-user' : ''}${p.isBot ? ' is-bot' : ''}">
          <div class="lb-rank">${i + 4}</div>
          <div class="lb-avatar">${p.emoji}</div>
          <div class="lb-name">${p.name}${p.isUser ? ' (Tú)' : ''}${p.isBot ? '<span class="bot-tag" title="Jugador de relleno">🤖</span>' : ''}</div>
          <div class="lb-xp">${p.xp.toLocaleString()} XP</div>
        </div>
      `).join('');

      const realPlayers = remotePlayers.length;
      const notice = rest.length === 0 ? `
        <div class="lb-row" style="justify-content:center;text-align:center;flex-direction:column;gap:4px;padding:16px;">
          <div style="font-size:1.2rem">🌱</div>
          <div class="lb-name" style="text-align:center">De momento solo estás tú en la liga</div>
          <div style="font-size:0.8rem;color:var(--text-3)">Cuando conectemos el servidor verás aquí a usuarios reales.</div>
        </div>
      ` : realPlayers === 0 ? `
        <div class="lb-note">
          Los jugadores con 🤖 son de relleno para que la liga no se vea vacía.
          Los de verdad aparecerán cuando se conecte el servidor.
        </div>
      ` : '';

      listEl.innerHTML = rows + notice;
    }
  },

  // ─────────────────────────────────────
  // UI HELPERS
  // ─────────────────────────────────────
  _renderLives() {
    const container = document.getElementById('lesson-lives');
    if (!container) return;
    const max = this.course().user.maxLives;
    const current = this.course().user.lives;
    container.innerHTML = '';
    for (let i = 0; i < max; i++) {
      const dot = document.createElement('div');
      dot.className = `life-dot${i >= current ? ' lost' : ''}`;
      container.appendChild(dot);
    }
  },

  showToast(message, type = '') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `show${type ? ' ' + type : ''}`;
    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.className = '';
    }, 3000);
  },

  showXPPopup(amount) {
    const popup = document.getElementById('xp-popup');
    if (!popup) return;
    popup.textContent = `+${amount} XP`;
    popup.classList.remove('animate');
    void popup.offsetWidth; // reflow
    popup.classList.add('animate');
    setTimeout(() => popup.classList.remove('animate'), 1600);
  },

  launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#7C5CFC', '#00D4FF', '#00E87A', '#FFD60A', '#FF6B6B', '#FF8C00'];

    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
        speed: Math.random() * 4 + 2,
        drift: (Math.random() - 0.5) * 2
      });
    }

    let frame = 0;
    const animate = () => {
      if (frame++ > 200) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.speed;
        p.x += p.drift;
        p.rot += p.rotSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame / 180);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      requestAnimationFrame(animate);
    };
    animate();
  },

  _setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
};

// ════════════════════════════════════════
// BOOT
// ════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  // Check languages loaded
  if (typeof LANGUAGES === 'undefined') {
    console.error('LANGUAGES not loaded');
    return;
  }

  // Close lesson button
  document.getElementById('lesson-close-btn')?.addEventListener('click', () => {
    if (confirm('¿Salir de la lección? Perderás el progreso de esta sesión.')) {
      App.showScreen('home');
      App.renderHome();
    }
  });

  App.init();
});

// Exportar App para tests
window.App = App;
