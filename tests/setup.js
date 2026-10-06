// Setup del entorno simulado para tests en Node.js
// Simula window y document para que el código del navegador sea testable

// ═══════════════════════════════════════════════════════════════
// MOCK DE WINDOW
// ═══════════════════════════════════════════════════════════════
const _localStorageData = {};

global.window = {
  addEventListener: () => {},
  matchMedia: () => ({ matches: false }),
  innerWidth: 1024,
  innerHeight: 768,
  scrollY: 0,
  scrollTo: () => {},
  scroll: () => {},
  localStorage: {
    getItem(key) {
      return _localStorageData[key] || null;
    },
    setItem(key, value) {
      _localStorageData[key] = String(value);
    },
    removeItem(key) {
      delete _localStorageData[key];
    },
    clear() {
      Object.keys(_localStorageData).forEach(key => delete _localStorageData[key]);
    }
  },
  requestAnimationFrame: (cb) => setTimeout(cb, 16),
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  console,
  Math,
  Date,
  JSON,
  Object,
  Array,
  String,
  Number,
  Boolean,
  Promise,
  Error,
  RegExp,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  encodeURIComponent,
  decodeURIComponent,
  alert: () => {},
  confirm: () => true,
  prompt: () => null,
  document: null,
  location: { href: 'http://localhost' },
  navigator: { userAgent: 'node', clipboard: { writeText: () => Promise.resolve() } },
  IntersectionObserver: class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  },
  Sk: undefined
};

// ═══════════════════════════════════════════════════════════════
// MOCK DE DOCUMENT MEJORADO
// ═══════════════════════════════════════════════════════════════
class MockElement {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.id = '';
    this.style = {
      // El style real es un CSSStyleDeclaration con setProperty/getPropertyValue
      _props: {},
      setProperty(nombre, valor) { this._props[nombre] = valor; },
      getPropertyValue(nombre) { return this._props[nombre] || ''; },
      removeProperty(nombre) { delete this._props[nombre]; }
    };
    this.dataset = {};
    this.children = [];
    this._innerHTML = '';
    this.textContent = '';
    this.value = '';
    this.disabled = false;
    this.attributes = {};
    this.parentNode = null;
    this._listeners = {};
    this.offsetWidth = 100;
    this.offsetHeight = 100;

    const self = this;
    this.classList = {
      _classes: new Set(),
      add(...classes) { classes.forEach(c => String(c).split(/\s+/).filter(Boolean).forEach(x => this._classes.add(x))); },
      remove(...classes) { classes.forEach(c => this._classes.delete(c)); },
      // Como en el DOM real: toggle(cls) alterna y toggle(cls, forzar) fija
      toggle(cls, forzar) {
        if (forzar === undefined) {
          this._classes.has(cls) ? this._classes.delete(cls) : this._classes.add(cls);
        } else if (forzar) {
          this._classes.add(cls);
        } else {
          this._classes.delete(cls);
        }
      },
      contains(cls) { return this._classes.has(cls); }
    };

    // Como en el DOM real, className y classList están sincronizados
    Object.defineProperty(this, 'className', {
      get() { return [...this.classList._classes].join(' '); },
      set(v) {
        this.classList._classes = new Set(String(v || '').split(/\s+/).filter(Boolean));
      },
      configurable: true
    });
    this.className = '';
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(value) {
    this._innerHTML = value;
    this.children = [];
    // Buscar ids en el HTML
    const idRegex = /id="([^"]+)"/g;
    let match;
    while ((match = idRegex.exec(value)) !== null) {
      const child = new MockElement('div');
      child.id = match[1];
      this.children.push(child);
    }
    // Buscar clases en el HTML
    const classRegex = /class="([^"]+)"/g;
    while ((match = classRegex.exec(value)) !== null) {
      const classes = match[1].split(' ');
      classes.forEach(c => this.classList.add(c));
    }
    // Buscar elementos con clase específica en el HTML
    const classMatch = value.match(/class="([^"]*exercise-area[^"]*)"/);
    if (classMatch) {
      classMatch[1].split(' ').forEach(c => this.classList.add(c));
    }
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
    if (name === 'id') this.id = value;
  }

  getAttribute(name) {
    return this.attributes[name] || null;
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  appendChild(child) {
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    this.children = this.children.filter(c => c !== child);
    child.parentNode = null;
  }

  addEventListener(event, handler) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(handler);
  }

  removeEventListener(event, handler) {
    if (this._listeners[event]) {
      this._listeners[event] = this._listeners[event].filter(h => h !== handler);
    }
  }

  dispatchEvent(event) {
    const handlers = this._listeners[event.type] || [];
    handlers.forEach(h => h(event));
    return true;
  }

  querySelector(selector) {
    if (selector.startsWith('#')) {
      const id = selector.slice(1);
      return this._findById(id);
    }
    if (selector.startsWith('.')) {
      const className = selector.slice(1);
      return this._findByClass(className);
    }
    return null;
  }

  querySelectorAll(selector) {
    const results = [];
    if (selector.startsWith('.')) {
      const className = selector.slice(1);
      this._findAllByClass(className, results);
    }
    return results;
  }

  _findById(id) {
    if (this.id === id) return this;
    for (const child of this.children) {
      const found = child._findById(id);
      if (found) return found;
    }
    return null;
  }

  _findByClass(className) {
    if (this.classList.contains(className)) return this;
    for (const child of this.children) {
      const found = child._findByClass(className);
      if (found) return found;
    }
    return null;
  }

  _findAllByClass(className, results) {
    if (this.classList.contains(className)) results.push(this);
    for (const child of this.children) {
      child._findAllByClass(className, results);
    }
  }

  getContext() {
    return {
      clearRect: () => {},
      save: () => {},
      restore: () => {},
      translate: () => {},
      rotate: () => {},
      fillRect: () => {},
      set fillStyle(value) {},
      set globalAlpha(value) {},
      canvas: this
    };
  }
  focus() {}
  click() {}
  getBoundingClientRect() { return { top: 0, left: 0, width: 100, height: 100, right: 100, bottom: 100 }; }
  scrollIntoView() {}
  insertBefore(newNode, refNode) {
    if (newNode.parentNode) newNode.parentNode.removeChild(newNode);
    newNode.parentNode = this;
    if (!refNode) {
      this.children.push(newNode);
      return newNode;
    }
    const idx = this.children.indexOf(refNode);
    if (idx === -1) this.children.push(newNode);
    else this.children.splice(idx, 0, newNode);
    return newNode;
  }

  get nextSibling() {
    if (!this.parentNode) return null;
    const sibs = this.parentNode.children;
    const i = sibs.indexOf(this);
    return sibs[i + 1] || null;
  }

  get previousSibling() {
    if (!this.parentNode) return null;
    const sibs = this.parentNode.children;
    const i = sibs.indexOf(this);
    return i > 0 ? sibs[i - 1] : null;
  }
}

const _documentElements = {};

global.document = {
  createElement: (tag) => new MockElement(tag),
  createTextNode: (text) => ({ textContent: text }),
  getElementById(id) {
    if (!_documentElements[id]) {
      _documentElements[id] = new MockElement('div');
      _documentElements[id].id = id;
    }
    return _documentElements[id];
  },
  querySelector(selector) {
    // Buscar en todos los elementos conocidos
    for (const id in _documentElements) {
      const found = _documentElements[id].querySelector(selector);
      if (found) return found;
    }
    // Buscar en body y sus hijos recursivamente
    const bodyEl = this.body;
    const found = this._deepQuerySelector(bodyEl, selector);
    if (found) return found;
    return null;
  },

  _deepQuerySelector(element, selector) {
    if (selector.startsWith('.')) {
      const className = selector.slice(1);
      if (element.classList.contains(className)) return element;
    } else if (selector.startsWith('#')) {
      const id = selector.slice(1);
      if (element.id === id) return element;
    }
    for (const child of element.children) {
      const found = this._deepQuerySelector(child, selector);
      if (found) return found;
    }
    return null;
  },
  querySelectorAll(selector) {
    const results = [];
    for (const id in _documentElements) {
      _documentElements[id]._findAllByClass(selector.slice(1), results);
    }
    return results;
  },
  addEventListener() {},
  removeEventListener() {},
  body: new MockElement('body'),
  documentElement: new MockElement('html'),
  head: new MockElement('head'),
  fonts: { load: () => Promise.resolve() }
};

// ═══════════════════════════════════════════════════════════════
// HELPERS PARA TESTS
// ═══════════════════════════════════════════════════════════════
export function resetMocks() {
  window.localStorage.clear();
  Object.keys(_documentElements).forEach(key => delete _documentElements[key]);
}

export function createMockElement(id) {
  const el = new MockElement('div');
  el.id = id;
  return el;
}

export function mockSkulpt() {
  global.Sk = {
    configure: () => {},
    misceval: {
      asyncToPromise: (fn) => fn()
    },
    importMainWithBody: () => Promise.resolve(),
    builtinFiles: { files: {} }
  };
}

window.document = global.document;

// Hacer que las variables globales estén disponibles directamente
// (el código usa localStorage, CURRICULUM, Engine directamente)
global.localStorage = window.localStorage;
global.requestAnimationFrame = window.requestAnimationFrame;
global.cancelAnimationFrame = window.cancelAnimationFrame;

// Función para sincronizar variables globales después de cargar módulos
export function syncGlobals() {
  if (window.CURRICULUM) global.CURRICULUM = window.CURRICULUM;
  if (window.Engine) global.Engine = window.Engine;
  if (window.App) global.App = window.App;
  if (window.Contact) global.Contact = window.Contact;
}
