// Tests para la liga — usuarios reales + bots de relleno
//
// La liga combina:
//   1. Bots de relleno (LEAGUE_BOTS), para que no se vea vacía mientras
//      no haya usuarios reales. Van marcados con 🤖.
//   2. Usuarios reales del servidor, si hay DEVQUEST_LEADERBOARD_URL.
//   3. El usuario local, siempre.
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { resetMocks, syncGlobals } from './setup.js';

await import('../curriculum.js');
await import('../curriculums/javascript.js');
await import('../languages.js');
await import('../engine.js');
await import('../app.js');
syncGlobals();

// Los bots se declaran en app.js; para poder comprobarlos aquí los
// leemos del propio archivo, igual que un usuario inspeccionaría el código.
const leerBots = () => {
  const src = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const bloque = src.match(/const LEAGUE_BOTS = \[([\s\S]*?)\];/);
  assert.ok(bloque, 'debe existir la lista LEAGUE_BOTS');
  return [...bloque[1].matchAll(/\{ name: '([^']+)',\s*emoji: '([^']+)',\s*xp: (\d+) \}/g)]
    .map(m => ({ name: m[1], emoji: m[2], xp: Number(m[3]) }));
};

describe('League', () => {
  beforeEach(() => {
    resetMocks();
    window.App.state = null;
    window.App.loadState();
  });

  test('no debe existir un FAKE_PLAYERS oculto', () => {
    assert.equal(global.FAKE_PLAYERS, undefined);
    assert.equal(window.FAKE_PLAYERS, undefined);
  });

  test('cada usuario real debe tener un id estable', () => {
    const id1 = window.App.state.profile.id;
    assert.ok(id1, 'el usuario debe tener id');
    window.App.saveState();
    window.App.loadState();
    assert.equal(window.App.state.profile.id, id1, 'el id debe persistir');
  });

  test('los bots están declarados de forma explícita y son válidos', () => {
    const bots = leerBots();
    assert.ok(bots.length >= 5, 'debe haber suficientes bots para llenar la liga');

    const nombres = new Set();
    bots.forEach(b => {
      assert.ok(b.name, 'todo bot necesita nombre');
      assert.ok(b.emoji, 'todo bot necesita avatar');
      assert.ok(b.xp > 0, `el XP de ${b.name} debe ser positivo`);
      assert.ok(!nombres.has(b.name), `el bot ${b.name} está repetido`);
      nombres.add(b.name);
    });

    // Deben ir de más a menos XP para que el ranking parezca real
    for (let i = 1; i < bots.length; i++) {
      assert.ok(bots[i - 1].xp > bots[i].xp,
        `${bots[i - 1].name} debería tener más XP que ${bots[i].name}`);
    }
  });

  test('la liga se llena con bots aunque no haya servidor', async () => {
    window.App.state.profile.name = 'Tester';
    window.App.course().user.xp = 150;

    await window.App.renderLeague();

    const list = document.getElementById('leaderboard-list');
    const bots = leerBots();

    // Los bots con más XP que el usuario suben al podio; el resto a la lista
    const html = list.innerHTML + document.getElementById('podium').innerHTML;
    assert.ok(html.includes('Tester'), 'el usuario debe aparecer siempre');
    assert.ok(html.includes('LunaDev'), 'debe aparecer el bot líder');

    // No puede quedar solo: hay más gente que el usuario
    assert.ok(html.includes('robots de relleno') || html.includes('🤖'),
      'los bots deben estar marcados como relleno');

    // Con bots, ya no se dice "solo estás tú"
    assert.ok(!list.innerHTML.includes('De momento solo estás tú'));
    assert.ok(list.innerHTML.includes('relleno'),
      'debe avisar de que son usuarios de relleno');
  });

  test('el bot se coloca según su XP y el usuario en su posición real', async () => {
    window.App.state.profile.name = 'Yo';
    window.App.course().user.xp = 6000;

    await window.App.renderLeague();

    const html = document.getElementById('podium').innerHTML
      + document.getElementById('leaderboard-list').innerHTML;

    // Con 6000 XP el usuario queda por detrás de LunaDev (12480) y
    // ByteKnight (9875), y por delante de AnaCode (7420)... no, por detrás
    assert.ok(html.includes('Yo (Tú)'), 'el usuario debe estar marcado como tú');

    // Con 6000 XP supera a los bots de 5240 para abajo
    assert.ok(html.includes('MartaBuilds'));
    // Y el aviso de bots sigue estando
    assert.ok(html.includes('relleno'));
  });

  test('los bots se marcan con 🤖 y el usuario no', async () => {
    window.App.state.profile.name = 'Tester';
    window.App.course().user.xp = 0;

    await window.App.renderLeague();

    const html = document.getElementById('podium').innerHTML
      + document.getElementById('leaderboard-list').innerHTML;
    const marcas = (html.match(/bot-tag/g) || []).length;
    assert.ok(marcas > 0, 'debe marcar a los bots');
    assert.ok(!html.includes('Tester 🤖'), 'el usuario no puede llevar la marca de bot');
  });

  test('la liga mezcla usuarios remotos reales y no duplica nombres', async () => {
    window.App.state.profile.name = 'Tester';
    window.App.course().user.xp = 100;
    window.DEVQUEST_LEADERBOARD_URL = 'https://example.com/leaderboard';

    global.fetch = async () => ({
      ok: true,
      json: async () => [
        { id: 'remote-1', name: 'Lucía', xp: 500, emoji: '👩' },
        // Mismo nombre que un bot: el bot debe quedar fuera
        { id: 'remote-2', name: 'LunaDev', xp: 20000, emoji: '🌕' }
      ]
    });

    await window.App.renderLeague();

    const html = document.getElementById('podium').innerHTML
      + document.getElementById('leaderboard-list').innerHTML;

    assert.ok(html.includes('Lucía'), 'debe aparecer la usuaria remota');
    assert.ok(html.includes('Tester'));

    // El bot con el mismo nombre no se duplica
    const apariciones = html.split('LunaDev').length - 1;
    assert.equal(apariciones, 1, 'LunaDev no debe aparecer duplicada');

    // Como ya hay usuarios reales, no se muestra el aviso de bots
    assert.ok(!html.includes('usuarios de relleno'));

    delete global.fetch;
    delete window.DEVQUEST_LEADERBOARD_URL;
  });

  test('la liga nunca se queda vacía', async () => {
    window.App.state.profile.name = 'Nuevo';
    window.App.course().user.xp = 0;

    await window.App.renderLeague();

    const html = document.getElementById('podium').innerHTML
      + document.getElementById('leaderboard-list').innerHTML;
    assert.ok(!html.includes('De momento solo estás tú'),
      'con bots la liga nunca debe decir que está vacía');
    assert.ok(html.includes('Nuevo'), 'el usuario siempre aparece');
  });
});