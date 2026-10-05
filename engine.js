// DevQuest Engine — Exercise rendering and validation
'use strict';

window.Engine = {

  // ════════════════════════════════════════
  // Run code in browser: Python via Skulpt, JavaScript nativo, HTML con DOMParser,
  // CSS con un analizador de reglas y SQL con el mini motor de sqlengine.js
  // ════════════════════════════════════════
  runCode(lang, code) {
    if (lang === 'javascript') return this.runJavaScript(code);
    if (lang === 'html') return this.runHtml(code);
    if (lang === 'css') return this.runCss(code);
    if (lang === 'sql') return this.runSql(code);
    return this.runPython(code);
  },

  // SQL no imprime nada: ejecuta la consulta y devuelve la tabla de resultados
  runSql(code) {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.SQL_ENGINE) {
        resolve({ output: '[SQL sin soporte. Comprueba tu conexión]\n', error: false });
        return;
      }
      try {
        resolve(window.SQL_ENGINE.ejecutar(code));
      } catch (err) {
        resolve({ output: String(err && err.message ? err.message : err), error: true });
      }
    });
  },

  // CSS no imprime nada: lo analizamos y devolvemos las reglas detectadas.
  runCss(code) {
    const normalizeDecls = (inner) => inner
      .split(';').map(d => d.trim()).filter(Boolean).join('; ');

    // Para bloques con at-rules anidados (@keyframes): "from { opacity: 0 }"
    const normalizeNested = (inner) => {
      const re = /([^{}]+)\{([^{}]*)\}/g;
      const parts = [];
      let m;
      while ((m = re.exec(inner)) !== null) {
        parts.push(`${m[1].trim().replace(/\s+/g, ' ')} { ${normalizeDecls(m[2])} }`);
      }
      return parts.join('; ');
    };

    return new Promise((resolve) => {
      try {
        const clean = String(code || '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
        if (!clean) {
          resolve({ output: '(CSS vacío)\n', error: false });
          return;
        }

        const lines = [];
        let i = 0;
        while (i < clean.length) {
          const open = clean.indexOf('{', i);
          if (open === -1) break;
          const prelude = clean.slice(i, open).trim().replace(/\s+/g, ' ');
          // Buscar la llave de cierre respetando la anidación
          let depth = 1;
          let j = open + 1;
          while (j < clean.length && depth > 0) {
            if (clean[j] === '{') depth++;
            else if (clean[j] === '}') depth--;
            j++;
          }
          const inner = clean.slice(open + 1, j - 1);
          const body = prelude.startsWith('@') ? normalizeNested(inner) : normalizeDecls(inner);
          lines.push(`${prelude} { ${body} }`);
          i = j;
        }

        if (lines.length === 0) {
          resolve({ output: 'No se encontraron reglas CSS.\n', error: false });
          return;
        }
        resolve({ output: lines.join('\n') + '\n', error: false });
      } catch (err) {
        resolve({ output: String(err && err.message ? err.message : err), error: true });
      }
    });
  },

  // HTML no "ejecuta": lo analizamos y devolvemos el texto que se vería en pantalla.
  runHtml(code) {
    return new Promise((resolve) => {
      if (typeof DOMParser === 'undefined') {
        resolve({ output: '[HTML sin soporte en este entorno]', error: false });
        return;
      }
      try {
        const doc = new DOMParser().parseFromString(code, 'text/html');
        const text = (doc.body && doc.body.textContent || '').replace(/\s+/g, ' ').trim();
        resolve({ output: text ? text + '\n' : '(sin texto visible)\n', error: false });
      } catch (err) {
        resolve({ output: String(err && err.message ? err.message : err), error: true });
      }
    });
  },

  runJavaScript(code) {
    return new Promise((resolve) => {
      const logs = [];
      const sandboxConsole = {
        log(...args) { logs.push(args.map(a => String(a)).join(' ')); }
      };
      try {
        const fn = new Function('console', code);
        fn(sandboxConsole);
        resolve({ output: logs.length ? logs.join('\n') + '\n' : '', error: false });
      } catch (err) {
        resolve({ output: String(err && err.message ? err.message : err), error: true });
      }
    });
  },

  runPython(code) {
    return new Promise((resolve, reject) => {
      if (typeof Sk === 'undefined') {
        resolve({ output: '[Python sin soporte. Comprueba tu conexión]', error: false });
        return;
      }
      let output = '';
      Sk.configure({
        output(text) { output += text; },
        read(x) {
          if (Sk.builtinFiles?.files[x] === undefined)
            throw `File not found: '${x}'`;
          return Sk.builtinFiles.files[x];
        },
        execLimit: 5000,
        retainGlobals: false
      });
      Sk.misceval.asyncToPromise(
        () => Sk.importMainWithBody('<stdin>', false, code, true)
      ).then(() => resolve({ output, error: false }))
        .catch(err => resolve({ output: String(err), error: true }));
    });
  },

  // ════════════════════════════════════════
  // RENDER EXERCISE
  // ════════════════════════════════════════
  render(exercise, container, lang) {
    container.innerHTML = '';
    container.dataset.lang = lang || container.dataset.lang || 'python';

    const typeLabels = {
      'multiple-choice':  '🎯 Elige la respuesta',
      'fill-blank':       '✏️ Completa el código',
      'reorder':          '🔀 Ordena el código',
      'type-code':        '⌨️ Escribe el código',
      'fix-bug':          '🐛 Arregla el bug',
      'predict-output':   '🔮 Predice la salida'
    };

    const typeLabel = document.createElement('div');
    typeLabel.className = 'exercise-type-label';
    typeLabel.textContent = typeLabels[exercise.type] || exercise.type;
    container.appendChild(typeLabel);

    switch (exercise.type) {
      case 'multiple-choice': this._renderMultipleChoice(exercise, container); break;
      case 'fill-blank':      this._renderFillBlank(exercise, container); break;
      case 'reorder':         this._renderReorder(exercise, container); break;
      case 'type-code':       this._renderTypeCode(exercise, container); break;
      case 'fix-bug':         this._renderFixBug(exercise, container); break;
      case 'predict-output':  this._renderPredictOutput(exercise, container); break;
    }
  },

  // ─────────────────────────────────────
  // Multiple Choice
  // ─────────────────────────────────────
  _renderMultipleChoice(ex, container) {
    const q = document.createElement('div');
    q.className = 'exercise-question';
    q.textContent = ex.question;
    container.appendChild(q);

    const letters = ['A', 'B', 'C', 'D'];
    const grid = document.createElement('div');
    grid.className = 'choices-grid';

    ex.choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.id = `choice-${i}`;
      btn.dataset.index = i;
      btn.innerHTML = `<span class="choice-letter">${letters[i]}</span><span class="choice-text">${this._escapeHtml(choice)}</span>`;
      btn.addEventListener('click', () => this._selectChoice(i, ex.choices.length));
      grid.appendChild(btn);
    });

    container.appendChild(grid);
    container.dataset.type = 'multiple-choice';
    container.dataset.correct = ex.correct;
    container.dataset.selected = '';
  },

  _selectChoice(index, total) {
    // Deselect all
    for (let i = 0; i < total; i++) {
      document.getElementById(`choice-${i}`)?.classList.remove('selected');
    }
    const btn = document.getElementById(`choice-${index}`);
    if (btn) btn.classList.add('selected');
    document.querySelector('.exercise-area').dataset.selected = index;
    // Enable check button
    document.getElementById('btn-check')?.removeAttribute('disabled');
  },

  // ─────────────────────────────────────
  // Fill in the Blank
  // ─────────────────────────────────────
  _renderFillBlank(ex, container) {
    const q = document.createElement('div');
    q.className = 'exercise-question';
    q.textContent = 'Selecciona las palabras correctas para completar el código:';
    container.appendChild(q);

    // Code block with blanks
    const codeBlock = document.createElement('div');
    codeBlock.className = 'code-block';
    codeBlock.innerHTML = this._buildFillBlankCode(ex.code, ex.blanks.length);
    codeBlock.dataset.blanks = JSON.stringify(ex.blanks);
    codeBlock.dataset.filled = JSON.stringify(new Array(ex.blanks.length).fill(null));
    container.appendChild(codeBlock);

    // Word bank label
    const bankLabel = document.createElement('div');
    bankLabel.className = 'text-sm text-muted';
    bankLabel.style.marginTop = '8px';
    bankLabel.textContent = 'Palabras disponibles:';
    container.appendChild(bankLabel);

    // Word bank
    const bank = document.createElement('div');
    bank.className = 'word-bank';
    bank.id = 'word-bank';

    // Shuffle options
    const opts = [...ex.options].sort(() => Math.random() - 0.5);
    opts.forEach(word => {
      const chip = document.createElement('div');
      chip.className = 'word-chip';
      chip.textContent = word;
      chip.dataset.word = word;
      chip.addEventListener('click', () => this._handleWordChip(chip, ex));
      bank.appendChild(chip);
    });

    container.appendChild(bank);
    container.dataset.type = 'fill-blank';
    container.dataset.currentBlank = '0';
  },

  _buildFillBlankCode(code, numBlanks) {
    let html = this._syntaxHighlight(code);
    let blankIdx = 0;
    html = html.replace(/___/g, () => {
      const idx = blankIdx++;
      return `<span class="bl" data-blank-idx="${idx}" id="blank-${idx}">?</span>`;
    });
    return html;
  },

  _handleWordChip(chip, ex) {
    const area = document.querySelector('.exercise-area');
    const codeBlock = area.querySelector('.code-block');
    const filled = JSON.parse(codeBlock.dataset.filled);
    const blanks = JSON.parse(codeBlock.dataset.blanks);

    if (chip.classList.contains('used')) return;

    // Find next empty blank
    const nextEmpty = filled.indexOf(null);
    if (nextEmpty === -1) return;

    filled[nextEmpty] = chip.dataset.word;
    codeBlock.dataset.filled = JSON.stringify(filled);

    // Update blank in UI
    const blankEl = codeBlock.querySelector(`#blank-${nextEmpty}`);
    if (blankEl) {
      blankEl.textContent = chip.dataset.word;
      blankEl.classList.add('filled');
      blankEl.dataset.chipWord = chip.dataset.word;

      // Click blank to remove
      blankEl.addEventListener('click', () => {
        const f = JSON.parse(codeBlock.dataset.filled);
        f[nextEmpty] = null;
        codeBlock.dataset.filled = JSON.stringify(f);
        blankEl.textContent = '?';
        blankEl.classList.remove('filled');
        chip.classList.remove('used');
        document.getElementById('btn-check')?.setAttribute('disabled', '');
      });
    }

    chip.classList.add('used');

    // Enable check if all blanks filled
    if (!filled.includes(null)) {
      document.getElementById('btn-check')?.removeAttribute('disabled');
    }
  },

  // ─────────────────────────────────────
  // Reorder
  // ─────────────────────────────────────
  _renderReorder(ex, container) {
    const q = document.createElement('div');
    q.className = 'exercise-question';
    q.textContent = ex.question || 'Ordena los bloques de código:';
    container.appendChild(q);

    const area = document.createElement('div');
    area.className = 'reorder-area';
    area.id = 'reorder-area';

    // Shuffled blocks
    const indices = ex.blocks.map((_, i) => i);
    // Shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    indices.forEach(origIdx => {
      const block = document.createElement('div');
      block.className = 'reorder-block';
      block.draggable = true;
      block.dataset.origIdx = origIdx;
      block.innerHTML = `<span class="drag-handle">⠿</span><span class="font-mono">${this._escapeHtml(ex.blocks[origIdx])}</span>`;
      this._makeDraggable(block, area);
      area.appendChild(block);
    });

    container.appendChild(area);
    container.dataset.type = 'reorder';
    container.dataset.correctOrder = JSON.stringify(ex.correctOrder);

    // Enable check always for reorder
    setTimeout(() => document.getElementById('btn-check')?.removeAttribute('disabled'), 100);
  },

  _makeDraggable(el, container) {
    const getSrc = () => container._dragSrc || null;
    const setSrc = (node) => { container._dragSrc = node; };

    const swapNodes = (n1, n2) => {
      if (!n1 || !n2 || n1 === n2) return;
      const next1 = n1.nextSibling;
      const next2 = n2.nextSibling;
      if (next1 === n2) {
        container.insertBefore(n2, n1);
      } else if (next2 === n1) {
        container.insertBefore(n1, n2);
      } else {
        container.insertBefore(n2, next1);
        container.insertBefore(n1, next2);
      }
    };

    el.addEventListener('dragstart', e => {
      setSrc(el);
      el.classList.add('dragging');
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        try { e.dataTransfer.setData('text/plain', String(el.dataset.origIdx)); } catch (_) {}
      }
    });

    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      setSrc(null);
      container.querySelectorAll('.drop-target').forEach(b => b.classList.remove('drop-target'));
      container._justDropped = true;
      setTimeout(() => { container._justDropped = false; }, 300);
    });

    el.addEventListener('dragover', e => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      el.classList.add('drop-target');
    });

    el.addEventListener('dragleave', () => el.classList.remove('drop-target'));

    el.addEventListener('drop', e => {
      e.preventDefault();
      el.classList.remove('drop-target');
      const src = getSrc();
      if (src && src !== el) {
        const allBlocks = [...container.children];
        const srcIdx = allBlocks.indexOf(src);
        const dstIdx = allBlocks.indexOf(el);
        if (srcIdx < dstIdx) {
          container.insertBefore(src, el.nextSibling);
        } else {
          container.insertBefore(src, el);
        }
      }
      setSrc(null);
      container._justDropped = true;
      setTimeout(() => { container._justDropped = false; }, 300);
    });

    // Soltar al final de la lista (zona vacía del contenedor)
    if (!container._dropBound) {
      container._dropBound = true;
      container.addEventListener('dragover', e => { e.preventDefault(); });
      container.addEventListener('drop', e => {
        if (e.target !== container) return;
        e.preventDefault();
        const src = container._dragSrc;
        if (src && src.parentNode === container) container.appendChild(src);
        container._dragSrc = null;
      });
    }

    // Alternativa táctil/teclado: tocar un bloque y luego otro para intercambiarlos
    el.addEventListener('click', () => {
      if (container._justDropped || container._touchMoved) return;
      const selected = container.querySelector('.tap-selected');
      if (!selected) {
        el.classList.add('tap-selected');
        return;
      }
      if (selected === el) {
        el.classList.remove('tap-selected');
        return;
      }
      selected.classList.remove('tap-selected');
      swapNodes(selected, el);
    });

    // Touch support: arrastre con el dedo (requiere touch-action:none en CSS)
    let touchStartY = 0;
    let touchMoved = false;
    el.addEventListener('touchstart', e => {
      touchStartY = e.touches[0].clientY;
      touchMoved = false;
      el.classList.add('dragging');
    }, { passive: true });

    el.addEventListener('touchmove', e => {
      e.preventDefault();
      touchMoved = true;
      const touchY = e.touches[0].clientY;
      const elements = document.elementsFromPoint(e.touches[0].clientX, touchY);
      const target = elements.find(el2 => el2.classList.contains('reorder-block') && el2 !== el);
      if (target) {
        const rect = target.getBoundingClientRect();
        if (touchY < rect.top + rect.height / 2) {
          container.insertBefore(el, target);
        } else {
          container.insertBefore(el, target.nextSibling);
        }
      }
    }, { passive: false });

    el.addEventListener('touchend', () => {
      el.classList.remove('dragging');
      if (touchMoved) {
        container._touchMoved = true;
        setTimeout(() => { container._touchMoved = false; }, 300);
      }
    });
  },

  // ─────────────────────────────────────
  // Type Code
  // ─────────────────────────────────────
  _renderTypeCode(ex, container) {
    const q = document.createElement('div');
    q.className = 'exercise-question';
    q.textContent = ex.description || ex.question;
    container.appendChild(q);

    const wrap = document.createElement('div');
    wrap.className = 'code-editor-wrap';

    const toolbar = document.createElement('div');
    toolbar.className = 'editor-toolbar';
    const lang = container?.dataset?.lang || 'python';
    const langNames = {
      python: 'Python',
      javascript: 'JavaScript',
      html: 'HTML',
      css: 'CSS',
      sql: 'SQL'
    };
    const hint = (lang === 'html' || lang === 'css')
      ? '⏎ indentado opcional'
      : '⇥ Tab = 4 espacios';
    toolbar.innerHTML = `<span class="text-sm text-muted">${langNames[lang] || lang}</span><span class="editor-hint">${hint}</span>`;
    wrap.appendChild(toolbar);

    const editor = document.createElement('textarea');
    editor.className = 'code-editor';
    editor.id = 'code-editor';
    editor.value = ex.starter || '';
    editor.spellcheck = false;
    editor.autocorrect = 'off';
    editor.autocomplete = 'off';

    // Tab key inserts spaces
    editor.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 4;
      }
    });

    editor.addEventListener('input', () => {
      document.getElementById('btn-check')?.removeAttribute('disabled');
    });

    wrap.appendChild(editor);

    // Output area
    const outLabel = document.createElement('div');
    outLabel.className = 'text-sm text-muted';
    outLabel.style.marginTop = '8px';
    outLabel.textContent = 'Salida:';
    wrap.appendChild(outLabel);

    const output = document.createElement('div');
    output.className = 'output-area';
    output.id = 'code-output';
    output.innerHTML = '<span style="color:var(--text-3)">Pulsa Ejecutar ▶ para ver la salida...</span>';
    wrap.appendChild(output);

    // Run button
    const runBtn = document.createElement('button');
    runBtn.className = 'btn btn-secondary btn-sm';
    runBtn.id = 'btn-run';
    runBtn.innerHTML = '▶ Ejecutar';
    runBtn.addEventListener('click', () => this._runCode(ex));
    wrap.appendChild(runBtn);

    container.appendChild(wrap);
    container.dataset.type = 'type-code';
    container.dataset.tests = JSON.stringify(ex.tests || []);
    // Disable check until code is run
    document.getElementById('btn-check')?.setAttribute('disabled', '');
  },

  async _runCode(ex) {
    const editor = document.getElementById('code-editor');
    const output = document.getElementById('code-output');
    const runBtn = document.getElementById('btn-run');
    if (!editor || !output) return;

    runBtn.innerHTML = '<span class="spinner"></span> Ejecutando...';
    runBtn.disabled = true;
    output.innerHTML = '<span style="color:var(--text-3)">Ejecutando...</span>';
    output.classList.add('running');

    const result = await this.runCode(
      document.querySelector('.exercise-area')?.dataset?.lang || 'python',
      editor.value
    );

    output.classList.remove('running');
    runBtn.innerHTML = '▶ Ejecutar';
    runBtn.disabled = false;

    if (result.error) {
      output.innerHTML = `<span style="color:var(--red)">${this._escapeHtml(result.output)}</span>`;
    } else {
      output.innerHTML = `<span style="color:var(--green)">${this._escapeHtml(result.output || '(sin salida)')}</span>`;
      // Store the last run output
      output.dataset.lastOutput = result.output;
      document.getElementById('btn-check')?.removeAttribute('disabled');
    }
  },

  // ─────────────────────────────────────
  // Fix Bug (Multiple choice variant)
  // ─────────────────────────────────────
  _renderFixBug(ex, container) {
    const q = document.createElement('div');
    q.className = 'exercise-question';
    q.textContent = ex.question || '¿Cuál es la versión correcta del código?';
    container.appendChild(q);

    // Show buggy code
    const bugLabel = document.createElement('div');
    bugLabel.className = 'text-sm text-muted';
    bugLabel.style.marginBottom = '6px';
    bugLabel.textContent = '🐛 Código con error:';
    container.appendChild(bugLabel);

    const bugCode = document.createElement('div');
    bugCode.className = 'code-block';
    bugCode.style.borderColor = 'rgba(255, 71, 87, 0.3)';
    bugCode.style.marginBottom = '16px';
    bugCode.innerHTML = this._syntaxHighlight(ex.buggyCode);
    container.appendChild(bugCode);

    const letters = ['A', 'B', 'C', 'D'];
    const grid = document.createElement('div');
    grid.className = 'choices-grid';

    ex.choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.id = `choice-${i}`;
      btn.dataset.index = i;
      btn.innerHTML = `<span class="choice-letter">${letters[i]}</span><span class="font-mono" style="font-size:0.85rem">${this._escapeHtml(choice)}</span>`;
      btn.addEventListener('click', () => this._selectChoice(i, ex.choices.length));
      grid.appendChild(btn);
    });

    container.appendChild(grid);
    container.dataset.type = 'fix-bug';
    container.dataset.correct = ex.correct;
    container.dataset.selected = '';
  },

  // ─────────────────────────────────────
  // Predict Output
  // ─────────────────────────────────────
  _renderPredictOutput(ex, container) {
    const q = document.createElement('div');
    q.className = 'exercise-question';
    q.textContent = ex.question || '¿Qué imprime este código?';
    container.appendChild(q);

    const codeBlock = document.createElement('div');
    codeBlock.className = 'code-block';
    codeBlock.innerHTML = this._syntaxHighlight(ex.codeToRun);
    container.appendChild(codeBlock);

    const letters = ['A', 'B', 'C', 'D'];
    const grid = document.createElement('div');
    grid.className = 'choices-grid';

    ex.output.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.id = `choice-${i}`;
      btn.dataset.index = i;
      btn.innerHTML = `<span class="choice-letter">${letters[i]}</span><code style="font-family:var(--font-mono, monospace)">${this._escapeHtml(choice)}</code>`;
      btn.addEventListener('click', () => this._selectChoice(i, ex.output.length));
      grid.appendChild(btn);
    });

    container.appendChild(grid);
    container.dataset.type = 'predict-output';
    container.dataset.correct = ex.correctOutput;
    container.dataset.selected = '';
  },

  // ════════════════════════════════════════
  // VALIDATE ANSWER
  // ════════════════════════════════════════
  async validate(exercise) {
    const area = document.querySelector('.exercise-area');

    switch (exercise.type) {
      case 'multiple-choice':
      case 'predict-output':
      case 'fix-bug': {
        const selected = parseInt(area.dataset.selected);
        // Un índice 0 es válido, así que ?? no sirve: dataset.correct guarda
        // undefined cuando no está, y por eso hay que mirar antes correct.
        const bruto = area.dataset.correct !== undefined
          ? area.dataset.correct
          : (exercise.correct !== undefined ? exercise.correct : exercise.correctOutput);
        const correct = parseInt(bruto);
        if (isNaN(selected)) return { correct: false, message: 'Selecciona una opción' };
        const isCorrect = selected === correct;
        this._highlightChoices(selected, correct, exercise.type === 'predict-output' ? exercise.output.length : exercise.choices.length);
        return { correct: isCorrect, explanation: exercise.explanation };
      }

      case 'fill-blank': {
        const codeBlock = area.querySelector('.code-block');
        const filled = JSON.parse(codeBlock.dataset.filled);
        const blanks = JSON.parse(codeBlock.dataset.blanks);
        const isCorrect = blanks.every((b, i) => filled[i] === b);
        if (!isCorrect) {
          // Shake wrong blanks
          blanks.forEach((b, i) => {
            if (filled[i] !== b) {
              const blankEl = codeBlock.querySelector(`#blank-${i}`);
              if (blankEl) {
                blankEl.style.animation = 'shake 0.4s ease-in-out';
                blankEl.style.borderColor = 'var(--red)';
                blankEl.style.color = 'var(--red)';
              }
            }
          });
        }
        return { correct: isCorrect, explanation: exercise.explanation };
      }

      case 'reorder': {
        const reorderArea = area.querySelector('#reorder-area');
        const blocks = [...reorderArea.children];
        const currentOrder = blocks.map(b => parseInt(b.dataset.origIdx));
        const correctOrder = JSON.parse(area.dataset.correctOrder ?? exercise.correctOrder);
        const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
        return { correct: isCorrect, explanation: exercise.explanation };
      }

      case 'type-code': {
        const output = document.getElementById('code-output');
        const lastOutput = output?.dataset.lastOutput;
        if (lastOutput === undefined) return { correct: false, message: 'Ejecuta el código primero' };
        const editor = document.getElementById('code-editor');
        const code = editor ? editor.value : '';
        const tests = exercise.tests || [];
        const isCorrect = tests.every(test => {
          const expected = String(test.expected ?? '').trim();
          const actual = (lastOutput || '').trim();
          if (actual !== expected) return false;
          // Opcional: exigir que el código contenga cierta estructura (útil en HTML)
          if (test.contains && !code.toLowerCase().includes(String(test.contains).toLowerCase())) return false;
          return true;
        });
        return { correct: isCorrect, explanation: exercise.explanation };
      }

      default:
        return { correct: true };
    }
  },

  _highlightChoices(selected, correct, count) {
    for (let i = 0; i < count; i++) {
      const btn = document.getElementById(`choice-${i}`);
      if (!btn) continue;
      btn.disabled = true;
      btn.classList.remove('selected');
      if (i === correct) btn.classList.add('correct');
      else if (i === selected && selected !== correct) btn.classList.add('wrong');
    }
  },

  // ════════════════════════════════════════
  // HELPERS
  // ════════════════════════════════════════
  _syntaxHighlight(code) {
    if (!code) return '';
    let escaped = this._escapeHtml(code);

    // Comments
    escaped = escaped.replace(/(#[^\n]*)/g, '<span class="cm">$1</span>');
    // Strings
    escaped = escaped.replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g, '<span class="st">$1</span>');
    // Keywords
    const keywords = ['def ', 'class ', 'return ', 'if ', 'elif ', 'else:', 'for ', 'while ', 'in ', 'not ', 'and ', 'or ', 'True', 'False', 'None', 'import ', 'from ', 'try:', 'except ', 'finally:', 'break', 'continue', 'pass', 'raise ', 'with ', 'as ', 'lambda '];
    keywords.forEach(kw => {
      escaped = escaped.replace(new RegExp('(?<![\\w])('+kw.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')+'(?![\\w]))', 'g'), `<span class="kw">${kw.trim()}</span>`);
    });
    // Numbers
    escaped = escaped.replace(/\b(\d+\.?\d*)\b/g, '<span class="nu">$1</span>');
    // Built-in functions
    const builtins = ['print', 'input', 'len', 'range', 'int', 'str', 'float', 'bool', 'list', 'dict', 'set', 'type', 'sorted', 'append', 'super', 'sum', 'max', 'min', 'abs'];
    builtins.forEach(fn => {
      escaped = escaped.replace(new RegExp('\\b(' + fn + ')(?=\\()', 'g'), '<span class="fn">$1</span>');
    });

    return escaped;
  },

  _escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
};
