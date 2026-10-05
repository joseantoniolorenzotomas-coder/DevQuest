// Tests para app.js — Lógica principal y estado por curso (v3)
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { resetMocks, syncGlobals } from './setup.js';
import fs from 'node:fs';

// Cargar currículums, registro de lenguajes, motor y app
await import('../curriculum.js');
await import('../curriculums/javascript.js');
await import('../curriculums/html.js');
await import('../curriculums/css.js');
await import('../curriculums/sql.js');
await import('../sqlengine.js');
await import('../languages.js');
await import('../engine.js');
await import('../app.js');
syncGlobals();

const U = () => window.App.course().user;
const P = () => window.App.course().progress;
const A = () => window.App.course().achievements;

describe('App', () => {
  beforeEach(() => {
    resetMocks();
    // Reiniciar estado
    window.App.state = null;
    window.App.state = JSON.parse(JSON.stringify({
      version: 3,
      profile: { id: 'test-id', name: '' },
      currentLanguageId: 'python',
      courses: {}
    }));
    window.App.currentScreen = 'welcome';
    window.App.lessonSession = {
      exerciseIndex: 0,
      exercises: [],
      mistakes: 0,
      xpEarned: 0,
      startTime: 0,
      consecutiveCorrect: 0
    };
  });

  describe('Estado inicial', () => {
    test('debe tener estado por defecto válido (v3)', () => {
      window.App.loadState();
      assert.ok(window.App.state);
      assert.equal(window.App.state.version, 3);
      assert.ok(U());
      assert.equal(U().level, 1);
      assert.equal(U().xp, 0);
      assert.equal(U().lives, 5);
    });

    test('debe tener progreso vacío inicialmente', () => {
      window.App.loadState();
      assert.deepEqual(P(), {});
    });

    test('debe tener logros vacíos inicialmente', () => {
      window.App.loadState();
      assert.deepEqual(A(), {});
    });
  });

  describe('Migración v2 → v3', () => {
    test('debe migrar el progreso de Python sin perder datos', () => {
      window.localStorage.setItem('pyquest-state-v2', JSON.stringify({
        version: 2,
        user: { id: 'viejo-id', name: 'Migrado', level: 5, xp: 100, xpToNext: 280, streak: 3, lastStudyDate: null, lives: 4, maxLives: 5, livesLastRefill: 1, totalExercises: 10, totalCorrect: 8 },
        progress: { mod1: { completedLessons: ['mod1-les1'], xpEarned: 50 } },
        achievements: { 'first-lesson': true }
      }));

      window.App.loadState();
      assert.equal(window.App.state.version, 3);
      assert.equal(window.App.state.profile.name, 'Migrado');
      assert.equal(U().level, 5);
      assert.equal(U().xp, 100);
      assert.deepEqual(P()['mod1'].completedLessons, ['mod1-les1']);
      assert.equal(A()['first-lesson'], true);
    });
  });

  describe('Persistencia', () => {
    test('debe guardar el nombre del perfil en localStorage', () => {
      window.App.loadState();
      window.App.state.profile.name = 'TestUser';
      window.App.saveState();

      const saved = JSON.parse(window.localStorage.getItem('pyquest-state-v2'));
      assert.equal(saved.profile.name, 'TestUser');
    });

    test('debe manejar datos corruptos en localStorage', () => {
      window.localStorage.setItem('pyquest-state-v2', 'datos corruptos {{{');

      window.App.loadState();
      assert.ok(window.App.state);
      assert.equal(window.App.state.version, 3);
    });
  });

  describe('Navegación', () => {
    test('debe cambiar de pantalla correctamente', () => {
      window.App.showScreen('languages');
      assert.equal(window.App.currentScreen, 'languages');
    });

    test('debe ocultar bottom-nav en welcome', () => {
      window.App.showScreen('welcome');
      const nav = document.getElementById('bottom-nav');
      assert.equal(nav.style.display, 'none');
    });

    test('debe mostrar bottom-nav en languages', () => {
      window.App.showScreen('languages');
      const nav = document.getElementById('bottom-nav');
      assert.equal(nav.style.display, 'flex');
    });
  });

  describe('XP y Niveles', () => {
    test('debe añadir XP correctamente', () => {
      window.App.loadState();
      const initialXP = U().xp;
      window.App.addXP(50);
      assert.equal(U().xp, initialXP + 50);
    });

    test('debe subir de nivel al alcanzar xpToNext', () => {
      window.App.loadState();
      U().xp = 190;
      U().xpToNext = 200;
      window.App.addXP(20);

      assert.equal(U().level, 2);
      assert.ok(U().xp < U().xpToNext);
    });

    test('debe aumentar xpToNext al subir de nivel', () => {
      window.App.loadState();
      const initialXPToNext = U().xpToNext;
      U().xp = 190;
      window.App.addXP(20);

      assert.ok(U().xpToNext > initialXPToNext);
    });

    test('el XP debe ser independiente por lenguaje', () => {
      window.App.loadState();
      window.App.state.currentLanguageId = 'python';
      window.App.addXP(50);
      window.App.state.currentLanguageId = 'javascript';
      assert.equal(U().xp, 0);
    });
  });

  describe('Rachas', () => {
    test('debe inicializar racha en 1 primer día', () => {
      window.App.loadState();
      const today = new Date().toDateString();
      U().lastStudyDate = null;

      window.App.lessonSession = {
        moduleId: 'mod1',
        lessonId: 'mod1-les1',
        xpEarned: 50,
        startTime: Date.now(),
        mistakes: 0,
        consecutiveCorrect: 0,
        exercises: [{}, {}, {}]
      };

      window.App.completeLesson();
      assert.equal(U().streak, 1);
      assert.equal(U().lastStudyDate, today);
    });

    test('debe incrementar racha si estudió ayer', () => {
      window.App.loadState();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      U().lastStudyDate = yesterday;
      U().streak = 3;

      window.App.lessonSession = {
        moduleId: 'mod1',
        lessonId: 'mod1-les1',
        xpEarned: 50,
        startTime: Date.now(),
        mistakes: 0,
        consecutiveCorrect: 0,
        exercises: [{}, {}, {}]
      };

      window.App.completeLesson();
      assert.equal(U().streak, 4);
    });

    test('debe reiniciar racha si pasó más de 1 día', () => {
      window.App.loadState();
      const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toDateString();
      U().lastStudyDate = twoDaysAgo;
      U().streak = 5;

      window.App.lessonSession = {
        moduleId: 'mod1',
        lessonId: 'mod1-les1',
        xpEarned: 50,
        startTime: Date.now(),
        mistakes: 0,
        consecutiveCorrect: 0,
        exercises: [{}, {}, {}]
      };

      window.App.completeLesson();
      assert.equal(U().streak, 1);
    });
  });

  describe('Vidas', () => {
    test('debe recargar vidas después de 30 minutos', () => {
      window.App.loadState();
      U().lives = 2;
      U().livesLastRefill = Date.now() - (31 * 60 * 1000); // 31 min atrás

      window.App.refillLives();
      assert.equal(U().lives, 3);
    });

    test('debe tener máximo 5 vidas', () => {
      window.App.loadState();
      U().lives = 5;
      U().livesLastRefill = Date.now() - (60 * 60 * 1000); // 1 hora atrás

      window.App.refillLives();
      assert.equal(U().lives, 5);
    });

    test('debe perder vida al fallar ejercicio', async () => {
      window.App.loadState();
      U().lives = 5;

      window.App.lessonSession = {
        exerciseIndex: 0,
        exercises: [{ xp: 10, type: 'multiple-choice', choices: ['a', 'b'], correct: 1 }, { xp: 10 }],
        mistakes: 0,
        xpEarned: 0,
        startTime: Date.now(),
        consecutiveCorrect: 0
      };

      // Simular respuesta incorrecta
      const container = document.createElement('div');
      container.classList.add('exercise-area');
      container.dataset.type = 'multiple-choice';
      container.dataset.correct = '1';
      container.dataset.selected = '0';
      document.body.appendChild(container);

      await window.App.checkAnswer();
      assert.equal(U().lives, 4);
    });
  });

  describe('Logros', () => {
    test('debe desbloquear logro "first-lesson" al completar primera lección', () => {
      window.App.loadState();

      window.App.lessonSession = {
        moduleId: 'mod1',
        lessonId: 'mod1-les1',
        xpEarned: 50,
        startTime: Date.now(),
        mistakes: 0,
        consecutiveCorrect: 0,
        exercises: [{}, {}, {}]
      };

      window.App.completeLesson();
      assert.equal(A()['first-lesson'], true);
    });

    test('debe desbloquear logro "streak-3" con racha de 3 días', () => {
      window.App.loadState();
      U().streak = 3;

      window.App.checkAchievements();
      assert.equal(A()['streak-3'], true);
    });

    test('debe desbloquear logro "xp-500" con 500 XP', () => {
      window.App.loadState();
      U().xp = 500;

      window.App.checkAchievements();
      assert.equal(A()['xp-500'], true);
    });

    test('no debe desbloquear logros ya obtenidos', () => {
      window.App.loadState();
      A()['first-lesson'] = true;

      window.App.lessonSession = {
        moduleId: 'mod1',
        lessonId: 'mod1-les1',
        xpEarned: 50,
        startTime: Date.now(),
        mistakes: 0,
        consecutiveCorrect: 0,
        exercises: [{}, {}, {}]
      };

      window.App.completeLesson();
      // No debe cambiar
      assert.equal(A()['first-lesson'], true);
    });
  });

  describe('Lecciones', () => {
    test('debe obtener siguiente lección correctamente', () => {
      window.App.loadState();
      const { mod, les } = window.App._getNextLesson();

      assert.ok(mod);
      assert.ok(les);
      assert.equal(mod.id, 'mod1');
      assert.equal(les.id, 'mod1-les1');
    });

    test('debe retornar primera lección si todas están completas', () => {
      window.App.loadState();

      // Marcar todas las lecciones como completadas
      window.App.currentModules().forEach(mod => {
        P()[mod.id] = {
          completedLessons: mod.lessons.map(l => l.id),
          xpEarned: 0
        };
      });

      const { mod, les } = window.App._getNextLesson();
      assert.equal(mod.id, 'mod1');
      assert.equal(les.id, 'mod1-les1');
    });

    test('debe verificar si módulo está desbloqueado', () => {
      window.App.loadState();

      // Primer módulo siempre desbloqueado
      assert.equal(window.App._isModuleUnlocked(0), true);

      // Segundo módulo bloqueado si no hay progreso en el primero
      assert.equal(window.App._isModuleUnlocked(1), false);

      // Desbloquear segundo módulo completando 1 lección del primero
      P()['mod1'] = {
        completedLessons: ['mod1-les1'],
        xpEarned: 50
      };
      assert.equal(window.App._isModuleUnlocked(1), true);
    });
  });

  describe('Hub multilenguaje', () => {
    test('debe registrar 10 lenguajes (5 con contenido, 5 próximamente)', () => {
      assert.equal(window.LANGUAGES.length, 10);
      const disponibles = window.LANGUAGES.filter(l => !l.comingSoon);
      const bloqueados = window.LANGUAGES.filter(l => l.comingSoon);
      assert.equal(disponibles.length, 5);
      assert.equal(bloqueados.length, 5);
    });

    test('los lenguajes con contenido tienen módulos de verdad', () => {
      window.LANGUAGES.filter(l => !l.comingSoon).forEach(l => {
        assert.ok(l.modules.length > 0, `${l.id}: dice que tiene contenido pero no tiene módulos`);
        assert.ok(l.modules[0].lessons.length > 0, `${l.id}: su primer módulo no tiene lecciones`);
      });
    });

    test('el orden debe ser natural: HTML y CSS antes de JavaScript, Java debajo de SQL', () => {
      const ids = window.LANGUAGES.map(l => l.id);
      assert.deepEqual(ids, ['python', 'html', 'css', 'javascript', 'sql', 'java', 'cpp', 'php', 'go', 'rust']);
    });

    test('cada lenguaje debe tener su resumen (about)', () => {
      window.LANGUAGES.forEach(l => {
        assert.ok(l.about && l.about.length > 10, `${l.id}: debe tener about`);
      });
    });

    test('debe calcular el progreso por lenguaje', () => {
      window.App.loadState();
      const prog = window.App.courseProgress('python');
      assert.equal(prog.total, 40);
      assert.equal(prog.done, 0);
      assert.equal(prog.pct, 0);
    });

    test('debe cambiar de lenguaje y mantener cursos separados', () => {
      window.App.loadState();
      window.App.state.currentLanguageId = 'python';
      window.App.addXP(50);
      window.App.state.currentLanguageId = 'javascript';
      assert.equal(U().xp, 0);
      assert.equal(window.App.course('python').user.xp, 50);
    });
  });

  describe('Perfil: foto, nombre y emoji', () => {
    test('el perfil tiene emoji y photo por defecto', () => {
      window.App.loadState();
      assert.equal(window.App.state.profile.emoji, '🐍');
      assert.equal(window.App.state.profile.photo, null);
    });

    test('debe cambiar el nombre del perfil', () => {
      window.App.loadState();
      window.App.state.profile.name = 'Nueva Nombre';
      window.App.saveState();
      window.App.loadState();
      assert.equal(window.App.state.profile.name, 'Nueva Nombre');
    });

    test('debe guardar y limpiar la foto', () => {
      window.App.loadState();
      window.App.state.profile.photo = 'data:image/jpeg;base64,AAAA';
      window.App.saveState();
      window.App.loadState();
      assert.equal(window.App.state.profile.photo, 'data:image/jpeg;base64,AAAA');
      window.App.state.profile.photo = null;
      window.App.saveState();
      assert.equal(window.App.state.profile.photo, null);
    });

    test('applyAvatar usa la foto si existe y el emoji si no', () => {
      window.App.loadState();
      const el = document.getElementById('avatar-test');

      window.App.state.profile.photo = 'data:image/jpeg;base64,BBBB';
      window.App.applyAvatar(el);
      assert.ok(el.classList.contains('has-photo'));
      assert.match(el.style.backgroundImage, /BBBB/);

      window.App.state.profile.photo = null;
      window.App.state.profile.emoji = '🚀';
      window.App.applyAvatar(el);
      assert.equal(el.classList.contains('has-photo'), false);
      assert.equal(el.textContent, '🚀');
    });

    test('la migración v2 conserva el avatar como emoji', () => {
      const migrated = window.App.migrateV2toV3({
        version: 2,
        user: { id: 'x', name: 'Ana', avatar: '🤖' }
      });
      assert.equal(migrated.profile.emoji, '🤖');
      assert.equal(migrated.profile.photo, null);
    });
  });

  describe('Utilidades', () => {
    test('_setText debe actualizar texto del elemento', () => {
      const el = document.getElementById('test-element');
      window.App._setText('test-element', 'Hola Mundo');
      assert.equal(el.textContent, 'Hola Mundo');
    });

    test('_setText debe manejar elementos no existentes', () => {
      // No debe lanzar error
      window.App._setText('no-existe', 'texto');
    });
  });

  // ─────────────────────────────────────
  // MODO ADMINISTRADOR
  // ─────────────────────────────────────
  describe('Modo administrador', () => {
    const App = window.App;

    test('acepta la contraseña correcta y rechaza las demás', () => {
      assert.equal(App.checkAdminPassword('patodevpunk'), true);
      assert.equal(App.checkAdminPassword('PATODEVPUNK'), false);
      assert.equal(App.checkAdminPassword('patodevpun'), false);
      assert.equal(App.checkAdminPassword('patodevpunk '), false);
      assert.equal(App.checkAdminPassword(''), false);
      assert.equal(App.checkAdminPassword(undefined), false);
    });

    test('la contraseña no aparece en el código que se envía al navegador', () => {
      // Debe ofuscarse: el hash sí puede estar, la contraseña no
      const src = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
      assert.ok(!src.includes('patodevpunk'),
        'la contraseña está en claro en app.js');
      assert.ok(!src.includes('ADMIN_PASSWORD'),
        'no debe existir una constante con la contraseña');
    });

    test('setAdminMode enciende y apaga, y lo persiste', () => {
      App.state.adminMode = false;
      App.setAdminMode(true);
      assert.equal(App.isAdmin(), true);
      assert.equal(JSON.parse(localStorage.getItem('pyquest-state-v2')).adminMode, true);

      App.setAdminMode(false);
      assert.equal(App.isAdmin(), false);
      assert.equal(JSON.parse(localStorage.getItem('pyquest-state-v2')).adminMode, false);
    });

    test('con el modo administrador se abren todos los módulos', () => {
      App.state.currentLanguageId = 'python';
      App.state.adminMode = false;
      const modules = App.currentModules();
      assert.ok(modules.length > 3, 'el curso debe tener varios módulos');

      // Sin admin, los módulos siguientes están bloqueados
      const bloqueados = modules.map((_, i) => App._isModuleUnlocked(i));
      assert.equal(bloqueados[0], true);
      assert.equal(bloqueados[bloqueados.length - 1], false, 'el último módulo debería estar bloqueado');

      // Con admin, todos abiertos
      App.setAdminMode(true);
      modules.forEach((_, i) => {
        assert.equal(App._isModuleUnlocked(i), true, `módulo ${i} debería estar abierto`);
      });
      App.setAdminMode(false);
    });

    test('con el modo administrador se abren todas las lecciones', () => {
      App.state.currentLanguageId = 'python';
      App.setAdminMode(false);
      const mod = App.currentModules().find(m => m.lessons.length > 2);
      const vacio = { completedLessons: [] };

      // Sin admin: la primera abierta, las siguientes bloqueadas
      assert.equal(App._isLessonUnlocked(mod, 0, vacio), true);
      assert.equal(App._isLessonUnlocked(mod, 1, vacio), false);
      assert.equal(App._isLessonUnlocked(mod, mod.lessons.length - 1, vacio), false);

      // Con admin: todas abiertas
      App.setAdminMode(true);
      mod.lessons.forEach((_, i) => {
        assert.equal(App._isLessonUnlocked(mod, i, vacio), true,
          `lección ${i} debería estar abierta`);
      });
      App.setAdminMode(false);
    });

    test('sin admin, completar la lección anterior abre la siguiente', () => {
      App.setAdminMode(false);
      const mod = App.currentModules().find(m => m.lessons.length > 2);
      const conUna = { completedLessons: [mod.lessons[0].id] };
      assert.equal(App._isLessonUnlocked(mod, 1, conUna), true);
      assert.equal(App._isLessonUnlocked(mod, 2, conUna), false);
    });

    test('el modo administrador no altera el progreso ni los logros', () => {
      App.state.currentLanguageId = 'python';
      App.setAdminMode(true);
      const antes = JSON.stringify(App.course().progress);
      App.setAdminMode(false);
      assert.equal(JSON.stringify(App.course().progress), antes,
        'encender el modo admin no debe tocar el progreso');
    });

    test('el logo del pato está al final del perfil y abre el modal', () => {
      // El mock del DOM es genérico y no reproduce la estructura real,
      // así que se comprueba el index.html de verdad.
      const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

      const firma = html.match(/<div class="profile-signature">([\s\S]*?)<\/div>\s*<\/div>/);
      assert.ok(firma, 'debe existir la firma del perfil');

      // Dentro de la firma está el botón con el logo
      assert.ok(firma[1].includes('id="btn-admin"'), 'el logo debe ser el botón admin');
      assert.ok(firma[1].includes('signature-logo-btn'));
      assert.ok(firma[1].includes('assets/img/pato-logo-128.png'));

      // La firma va dentro de la pantalla de perfil, después de los logros
      const perfil = html.match(/<div id="screen-profile"[\s\S]*?\n  <\/div>/);
      assert.ok(perfil, 'debe existir la pantalla de perfil');
      assert.ok(perfil[0].includes('profile-signature'));
      assert.ok(perfil[0].indexOf('profile-signature') > perfil[0].indexOf('achievements-grid'),
        'la firma debe ir después de los logros');
      assert.ok(perfil[0].indexOf('achievements-grid') < perfil[0].indexOf('profile-signature'));

      // Y ya no debe quedar el pato en un pie flotante
      assert.ok(!html.includes('welcome-footer'), 'el pie con el pato ya no debe existir');
      assert.equal(html.split('id="btn-admin"').length - 1, 1,
        'solo puede haber un botón admin en el HTML');
    });

    test('el logo se marca cuando el modo administrador está activo', () => {
      const btn = document.getElementById('btn-admin');
      App.setAdminMode(false);
      assert.equal(btn.classList.contains('active'), false);
      App.setAdminMode(true);
      assert.equal(btn.classList.contains('active'), true,
        'con el modo activo el logo debe quedar iluminado');
      App.setAdminMode(false);
      assert.equal(btn.classList.contains('active'), false);
    });

    test('los estados antiguos sin adminMode se cargan con false', () => {
      localStorage.setItem('pyquest-state-v2', JSON.stringify({
        version: 3,
        profile: { id: 'x', name: 'Ana', emoji: '🐍', photo: null },
        currentLanguageId: 'python',
        courses: {}
      }));
      App.loadState();
      assert.equal(App.isAdmin(), false);
      App.loadState();
    });
  });
});
