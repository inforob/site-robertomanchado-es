/* =========================================================
   BizNiz Corp — JavaScript vanilla
   ========================================================= */
(function () {
  'use strict';

  var MOBILE_MQ = '(max-width:940px)';

  /* ---------- menú móvil (popup) ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');

  if (toggle && nav) {
    var navList = nav.querySelector('ul');

    // botón de cierre dentro de la tarjeta del popup
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'navpop-close';
    closeBtn.setAttribute('aria-label', 'Cerrar menú');
    closeBtn.innerHTML = '&#10005;';
    navList.appendChild(closeBtn);

    var setNav = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      // bloquear el scroll de fondo mientras el popup está abierto
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) { closeBtn.focus(); } else { toggle.focus(); }
    };

    toggle.addEventListener('click', function () {
      setNav(!nav.classList.contains('is-open'));
    });
    closeBtn.addEventListener('click', function () { setNav(false); });

    // clic en el velo (fuera de la tarjeta) o al navegar
    nav.addEventListener('click', function (e) {
      if (!window.matchMedia(MOBILE_MQ).matches) { return; }
      if (e.target === nav || e.target.closest('a')) { setNav(false); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); }
    });

    // reset al volver a escritorio
    window.addEventListener('resize', function () {
      if (!window.matchMedia(MOBILE_MQ).matches && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- estado activo del menú principal ----------
     Sólo se intercepta el clic en las pestañas sin destino todavía
     ("#"); las que apuntan a una página real navegan con normalidad. */
  var tabs = nav ? nav.querySelectorAll('a') : [];
  Array.prototype.forEach.call(tabs, function (tab) {
    tab.addEventListener('click', function (e) {
      if (tab.getAttribute('href') !== '#') { return; }
      e.preventDefault();
      Array.prototype.forEach.call(tabs, function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
    });
  });

  /* ---------- slider de producto destacado ---------- */
  var products = [
    {
      name: 'Product Name and Model',
      desc: 'Lorem ipsum dolor sit amet consequat est Consectetuer estelity magna.'
    },
    {
      name: 'Second Product Model',
      desc: 'Sed diam nonumy nibh euismod tincidunt ut laoreet dolore magna aliquam.'
    },
    {
      name: 'Third Product Model',
      desc: 'Ut wisi enim ad minim veniam quis nostrud exerci tation ullamcorper.'
    }
  ];

  var stage = document.querySelector('.product-stage');
  var nameEl = document.querySelector('.product-name');
  var descEl = document.querySelector('.product-desc');
  var prev = document.getElementById('prevProduct');
  var next = document.getElementById('nextProduct');
  var index = 0;

  function render() {
    if (!stage) return;
    stage.classList.add('is-fading');
    window.setTimeout(function () {
      var p = products[index];
      nameEl.textContent = p.name;
      descEl.innerHTML = p.desc + ' <a href="#" class="more">More&gt;</a>';
      stage.classList.remove('is-fading');
    }, 180);
  }

  function step(delta) {
    index = (index + delta + products.length) % products.length;
    render();
  }

  if (prev && next) {
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });

    // navegación por teclado dentro del panel
    var box = document.querySelector('.product-box');
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { step(-1); }
      if (e.key === 'ArrowRight') { step(1); }
    });
  }

  /* =========================================================
     SELECTOR DE FUENTE TÉCNICA
     Botón flotante + panel con 20 fuentes de Google Fonts.
     Las 20 sólo se descargan al abrir el panel; la elegida se
     guarda en localStorage y se carga sola en visitas futuras.
     ========================================================= */
  var FONTS = [
    ['Space Grotesk',   'Space+Grotesk:wght@400;600;700'],
    ['Rajdhani',        'Rajdhani:wght@400;600;700'],
    ['Chakra Petch',    'Chakra+Petch:wght@400;600;700'],
    ['Exo 2',           'Exo+2:wght@400;600;700'],
    ['Saira',           'Saira:wght@400;600;700'],
    ['Titillium Web',   'Titillium+Web:wght@400;600;700'],
    ['Quantico',        'Quantico:wght@400;700'],
    ['Oxanium',         'Oxanium:wght@400;600;700'],
    ['Orbitron',        'Orbitron:wght@400;600;700'],
    ['Audiowide',       'Audiowide'],
    ['Michroma',        'Michroma'],
    ['Aldrich',         'Aldrich'],
    ['IBM Plex Sans',   'IBM+Plex+Sans:wght@400;600;700'],
    ['IBM Plex Mono',   'IBM+Plex+Mono:wght@400;600;700'],
    ['JetBrains Mono',  'JetBrains+Mono:wght@400;600;700'],
    ['Fira Code',       'Fira+Code:wght@400;600;700'],
    ['Source Code Pro', 'Source+Code+Pro:wght@400;600;700'],
    ['Roboto Mono',     'Roboto+Mono:wght@400;600;700'],
    ['Space Mono',      'Space+Mono:wght@400;700'],
    ['Share Tech Mono', 'Share+Tech+Mono']
  ];
  var STORAGE_KEY = 'bizniz-font';
  var GF_BASE = 'https://fonts.googleapis.com/css2?display=swap&family=';
  var loadedAll = false;

  function loadStylesheet(href, id) {
    if (document.getElementById(id)) { return; }
    var link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadAllFonts() {
    if (loadedAll) { return; }
    loadedAll = true;
    var families = FONTS.map(function (f) { return 'family=' + f[1]; }).join('&');
    loadStylesheet('https://fonts.googleapis.com/css2?display=swap&' + families, 'gf-all');
  }

  function applyFont(name) {
    var root = document.documentElement;
    if (!name) {
      root.style.removeProperty('--font-sans');
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    } else {
      root.style.setProperty('--font-sans', "'" + name + "', 'Source Sans 3', sans-serif");
      try { localStorage.setItem(STORAGE_KEY, name); } catch (e) {}
    }
    var opts = document.querySelectorAll('.font-opt');
    Array.prototype.forEach.call(opts, function (o) {
      o.classList.toggle('is-current', o.getAttribute('data-font') === (name || ''));
    });
  }

  function buildFontPicker() {
    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'font-fab';
    fab.setAttribute('aria-label', 'Elegir tipografía');
    fab.setAttribute('aria-expanded', 'false');
    fab.textContent = 'Aa';

    var panel = document.createElement('aside');
    panel.className = 'font-panel';
    panel.setAttribute('aria-label', 'Selector de tipografía');

    var head = document.createElement('div');
    head.className = 'font-panel-head';
    var title = document.createElement('h2');
    title.className = 'font-panel-title';
    title.textContent = 'Tipografía';
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'navpop-close';
    close.style.position = 'static';
    close.style.display = 'flex';
    close.setAttribute('aria-label', 'Cerrar selector');
    close.innerHTML = '&#10005;';
    head.appendChild(title);
    head.appendChild(close);

    var list = document.createElement('ul');
    list.className = 'font-list';

    var options = [['', 'Source Sans 3 (original)']].concat(
      FONTS.map(function (f) { return [f[0], f[0]]; })
    );
    options.forEach(function (opt) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'font-opt';
      btn.setAttribute('data-font', opt[0]);
      btn.textContent = opt[1];
      if (opt[0]) { btn.style.fontFamily = "'" + opt[0] + "', sans-serif"; }
      btn.addEventListener('click', function () { applyFont(opt[0]); });
      li.appendChild(btn);
      list.appendChild(li);
    });

    panel.appendChild(head);
    panel.appendChild(list);
    document.body.appendChild(fab);
    document.body.appendChild(panel);

    var setPanel = function (open) {
      panel.classList.toggle('is-open', open);
      fab.setAttribute('aria-expanded', String(open));
      if (open) { loadAllFonts(); }
    };

    fab.addEventListener('click', function () {
      setPanel(!panel.classList.contains('is-open'));
    });
    close.addEventListener('click', function () { setPanel(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setPanel(false); }
    });
    document.addEventListener('click', function (e) {
      if (panel.classList.contains('is-open') &&
          !panel.contains(e.target) && e.target !== fab) {
        setPanel(false);
      }
    });

    // fuente guardada de una visita anterior: sólo se descarga ésa
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved) {
      var match = FONTS.filter(function (f) { return f[0] === saved; })[0];
      if (match) {
        loadStylesheet(GF_BASE + match[1], 'gf-saved');
        applyFont(saved);
      }
    }
  }

  buildFontPicker();
})();

/* =========================================================
   Selector de fondo del hero (patrón + gradiente)
   Sólo actúa si hay un .hero en la página (index.html).
   ========================================================= */
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  if (!hero) { return; }

  var BACKGROUNDS = [
    ['original',  'Original (verde radial)'],
    ['grid',      'Rejilla técnica'],
    ['diagonals', 'Diagonales'],
    ['dots',      'Trama de puntos'],
    ['hex',       'Panal hexagonal'],
    ['circuit',   'Circuito'],
    ['iso',       'Malla isométrica'],
    ['blueprint', 'Blueprint azul']
  ];
  var STORAGE_KEY = 'bizniz-hero-bg';

  function applyBg(id) {
    hero.setAttribute('data-bg', id);
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) {}
    var opts = document.querySelectorAll('.hero-opt');
    Array.prototype.forEach.call(opts, function (o) {
      o.classList.toggle('is-current', o.getAttribute('data-bg-opt') === id);
    });
  }

  function buildHeroPicker() {
    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'font-fab hero-fab';
    fab.setAttribute('aria-label', 'Elegir fondo del hero');
    fab.setAttribute('aria-expanded', 'false');
    fab.textContent = '◧';

    var panel = document.createElement('aside');
    panel.className = 'font-panel hero-panel';
    panel.setAttribute('aria-label', 'Selector de fondo del hero');

    var head = document.createElement('div');
    head.className = 'font-panel-head';
    var title = document.createElement('h2');
    title.className = 'font-panel-title';
    title.textContent = 'Fondo del hero';
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'navpop-close';
    close.style.position = 'static';
    close.style.display = 'flex';
    close.setAttribute('aria-label', 'Cerrar selector');
    close.innerHTML = '&#10005;';
    head.appendChild(title);
    head.appendChild(close);

    var list = document.createElement('ul');
    list.className = 'font-list';

    BACKGROUNDS.forEach(function (opt) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'font-opt hero-opt';
      btn.setAttribute('data-bg-opt', opt[0]);
      var swatch = document.createElement('span');
      swatch.className = 'hero-swatch';
      swatch.setAttribute('data-bg', opt[0]);   // reusa el mismo CSS del hero
      var label = document.createElement('span');
      label.textContent = opt[1];
      btn.appendChild(swatch);
      btn.appendChild(label);
      btn.addEventListener('click', function () { applyBg(opt[0]); });
      li.appendChild(btn);
      list.appendChild(li);
    });

    panel.appendChild(head);
    panel.appendChild(list);
    document.body.appendChild(fab);
    document.body.appendChild(panel);

    var setPanel = function (open) {
      panel.classList.toggle('is-open', open);
      fab.setAttribute('aria-expanded', String(open));
      // sólo un panel abierto a la vez: los dos ocupan el mismo sitio
      if (open) {
        var other = document.querySelector('.font-panel:not(.hero-panel)');
        if (other) { other.classList.remove('is-open'); }
      }
    };

    fab.addEventListener('click', function () {
      setPanel(!panel.classList.contains('is-open'));
    });
    close.addEventListener('click', function () { setPanel(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setPanel(false); }
    });
    document.addEventListener('click', function (e) {
      if (panel.classList.contains('is-open') &&
          !panel.contains(e.target) && e.target !== fab) {
        setPanel(false);
      }
    });

    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    var valid = BACKGROUNDS.filter(function (b) { return b[0] === saved; })[0];
    applyBg(valid ? saved : 'original');
  }

  buildHeroPicker();
})();

/* =========================================================
   Generador de color del hero
   Color base (5 propuestas) + intensidad + trama superpuesta.
   El gradiente se compone con el color base y su contrario (hue+180).
   Pinta un background inline sobre .hero, así que convive con el
   selector de fondos: «Restablecer» lo borra y [data-bg] vuelve a mandar.
   ========================================================= */
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  if (!hero) { return; }

  // [id, etiqueta, hue, saturación de referencia] — color plano, sin gradiente
  var COLORS = [
    ['lima',      'Lima',        78, 62],
    ['oliva',     'Oliva',       68, 45],
    ['esmeralda', 'Esmeralda',  152, 55],
    ['turquesa',  'Turquesa',   172, 58],
    ['acero',     'Azul acero', 200, 42],
    ['indigo',    'Índigo',     228, 48],
    ['violeta',   'Violeta',    275, 45],
    ['magenta',   'Magenta',    318, 50],
    ['carmesi',   'Carmesí',    348, 62],
    ['coral',     'Coral',       14, 62],
    ['ambar',     'Ámbar',       38, 70],
    ['grafito',   'Grafito',    210, 12]
  ];

  var PATTERNS = [
    ['none',      'Sin patrón', ''],
    ['grid',      'Rejilla',
      'repeating-linear-gradient(0deg,  rgba(255,255,255,.07) 0 1px, transparent 1px 26px),' +
      'repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 1px, transparent 1px 26px)'],
    ['diagonals', 'Diagonales',
      'repeating-linear-gradient(135deg, rgba(255,255,255,.07) 0 2px, transparent 2px 12px)'],
    ['dots',      'Puntos',
      'radial-gradient(rgba(255,255,255,.16) 1.2px, transparent 1.3px) 0 0/14px 14px'],
    ['hex',       'Panal',
      'repeating-linear-gradient(60deg,  rgba(255,255,255,.07) 0 1px, transparent 1px 22px),' +
      'repeating-linear-gradient(-60deg, rgba(255,255,255,.07) 0 1px, transparent 1px 22px),' +
      'repeating-linear-gradient(0deg,   rgba(255,255,255,.05) 0 1px, transparent 1px 38px)'],
    ['circuit',   'Circuito',
      'radial-gradient(rgba(255,255,255,.28) 1.6px, transparent 1.8px) 0 0/32px 32px,' +
      'repeating-linear-gradient(0deg,  rgba(255,255,255,.06) 0 1px, transparent 1px 32px),' +
      'repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 1px, transparent 1px 32px)'],
    ['iso',       'Isométrica',
      'repeating-linear-gradient(30deg,  rgba(255,255,255,.06) 0 1px, transparent 1px 24px),' +
      'repeating-linear-gradient(150deg, rgba(255,255,255,.06) 0 1px, transparent 1px 24px),' +
      'repeating-linear-gradient(90deg,  rgba(255,255,255,.06) 0 1px, transparent 1px 24px)']
  ];

  var STORAGE_KEY = 'bizniz-hero-tint';
  var state = { color: 'lima', intensity: 60, pattern: 'grid', on: false };

  function hsl(h, s, l) {
    return 'hsl(' + ((h % 360) + 360) % 360 + ',' + s + '%,' + l + '%)';
  }

  /* la intensidad (0-100) mueve saturación y luminosidad a la vez, tomando
     como referencia la saturación propia de cada color: apagado y grisáceo
     a la izquierda, vivo y profundo a la derecha. Devuelve un color plano. */
  function solid(hue, satRef, i) {
    var sat = Math.round(satRef * (0.30 + i / 100 * 1.05));   // 30% .. 135% del ref
    var light = Math.round(52 - i * 0.20);                    // 52% .. 32%
    return hsl(hue, Math.max(4, Math.min(100, sat)), light);
  }

  function backgroundFor(colorId, intensity, patternId) {
    var color = COLORS.filter(function (c) { return c[0] === colorId; })[0] || COLORS[0];
    var pattern = PATTERNS.filter(function (p) { return p[0] === patternId; })[0];
    /* el velo oscuro de la izquierda no es decorativo: sin él el titular
       blanco y el CTA no tienen contraste sobre ámbar, lima o coral */
    var layers = ['linear-gradient(90deg, rgba(0,0,0,.42) 0%, rgba(0,0,0,0) 58%)'];
    if (pattern && pattern[2]) { layers.push(pattern[2]); }
    layers.push(solid(color[2], color[3], intensity));   // color plano de fondo
    return layers.join(',');
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function apply() {
    state.on = true;
    hero.style.background = backgroundFor(state.color, state.intensity, state.pattern);
    save();
    syncUI();
  }

  function reset() {
    state.on = false;
    hero.style.removeProperty('background');   // manda otra vez [data-bg]
    save();
    syncUI();
  }

  function syncUI() {
    Array.prototype.forEach.call(document.querySelectorAll('.tint-color'), function (b) {
      b.classList.toggle('is-current', state.on && b.getAttribute('data-color') === state.color);
      // las muestras siguen al deslizador, para comparar todas a la misma intensidad
      b.style.background = solid(Number(b.getAttribute('data-hue')),
                                 Number(b.getAttribute('data-sat')), state.intensity);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.tint-pattern'), function (b) {
      b.classList.toggle('is-current', state.on && b.getAttribute('data-pattern') === state.pattern);
    });
  }

  function buildTintPicker() {
    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'font-fab tint-fab';
    fab.setAttribute('aria-label', 'Generador de color del hero');
    fab.setAttribute('aria-expanded', 'false');
    fab.textContent = '◐';

    var panel = document.createElement('aside');
    panel.className = 'font-panel tint-panel';
    panel.setAttribute('aria-label', 'Generador de color del hero');

    var head = document.createElement('div');
    head.className = 'font-panel-head';
    var title = document.createElement('h2');
    title.className = 'font-panel-title';
    title.textContent = 'Color del hero';
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'navpop-close';
    close.style.position = 'static';
    close.style.display = 'flex';
    close.setAttribute('aria-label', 'Cerrar generador');
    close.innerHTML = '&#10005;';
    head.appendChild(title);
    head.appendChild(close);

    var body = document.createElement('div');
    body.className = 'tint-body';

    // --- color base
    var colorLabel = document.createElement('span');
    colorLabel.className = 'tint-label';
    colorLabel.textContent = 'Color base';
    var colors = document.createElement('div');
    colors.className = 'tint-colors';
    COLORS.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tint-color';
      b.setAttribute('data-color', c[0]);
      b.title = c[1];
      b.setAttribute('aria-label', c[1]);
      // la muestra enseña el color plano tal y como está el deslizador
      b.style.background = solid(c[2], c[3], state.intensity);
      b.setAttribute('data-hue', String(c[2]));
      b.setAttribute('data-sat', String(c[3]));
      b.addEventListener('click', function () { state.color = c[0]; apply(); });
      colors.appendChild(b);
    });

    // --- intensidad
    var rangeLabel = document.createElement('span');
    rangeLabel.className = 'tint-label';
    rangeLabel.textContent = 'Intensidad';
    var range = document.createElement('input');
    range.type = 'range';
    range.className = 'tint-range';
    range.min = '0';
    range.max = '100';
    range.value = String(state.intensity);
    range.setAttribute('aria-label', 'Intensidad del color');
    range.addEventListener('input', function () {
      state.intensity = Number(range.value);
      apply();
    });

    // --- trama
    var patLabel = document.createElement('span');
    patLabel.className = 'tint-label';
    patLabel.textContent = 'Trama';
    var pats = document.createElement('div');
    pats.className = 'tint-patterns';
    PATTERNS.forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tint-pattern';
      b.setAttribute('data-pattern', p[0]);
      b.textContent = p[1];
      b.addEventListener('click', function () { state.pattern = p[0]; apply(); });
      pats.appendChild(b);
    });

    var resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'tint-reset';
    resetBtn.textContent = 'Restablecer fondo';
    resetBtn.addEventListener('click', reset);

    body.appendChild(colorLabel);
    body.appendChild(colors);
    body.appendChild(rangeLabel);
    body.appendChild(range);
    body.appendChild(patLabel);
    body.appendChild(pats);
    body.appendChild(resetBtn);

    panel.appendChild(head);
    panel.appendChild(body);
    document.body.appendChild(fab);
    document.body.appendChild(panel);

    var setPanel = function (open) {
      panel.classList.toggle('is-open', open);
      fab.setAttribute('aria-expanded', String(open));
      if (open) {
        Array.prototype.forEach.call(
          document.querySelectorAll('.font-panel:not(.tint-panel)'),
          function (o) { o.classList.remove('is-open'); }
        );
      }
    };

    fab.addEventListener('click', function () {
      setPanel(!panel.classList.contains('is-open'));
    });
    close.addEventListener('click', function () { setPanel(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setPanel(false); }
    });
    document.addEventListener('click', function (e) {
      if (panel.classList.contains('is-open') &&
          !panel.contains(e.target) && e.target !== fab) {
        setPanel(false);
      }
    });

    // estado guardado: sólo repinta si estaba activo
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) {}
    if (saved && saved.on) {
      if (COLORS.filter(function (c) { return c[0] === saved.color; })[0]) {
        state.color = saved.color;
      }
      if (PATTERNS.filter(function (p) { return p[0] === saved.pattern; })[0]) {
        state.pattern = saved.pattern;
      }
      if (typeof saved.intensity === 'number') {
        state.intensity = Math.max(0, Math.min(100, saved.intensity));
      }
      range.value = String(state.intensity);
      apply();
    } else {
      syncUI();
    }
  }

  buildTintPicker();
})();

/* =========================================================
   Partículas del hero (tsParticles slim, servido desde js/vendor)
   Cuarto FAB, con la misma mecánica de panel + localStorage:
   efecto, densidad, velocidad e interacción con el ratón.
   ========================================================= */
(function () {
  'use strict';

  var host = document.getElementById('hero-particles');
  if (!host || typeof tsParticles === 'undefined') { return; }

  var ACCENT = '#a4d63c';
  var EFFECTS = [
    ['none',      'Ninguno'],
    ['network',   'Red de nodos'],
    ['motes',     'Motas flotando'],
    ['dust',      'Polvo en suspensión'],
    ['fireflies', 'Luciérnagas'],
    ['nebula',    'Nebulosa'],
    ['orbit',     'Órbita']
  ];

  var STORAGE_KEY = 'bizniz-hero-fx';
  var state = { effect: 'network', density: 55, speed: 40 };
  var container = null;
  var token = 0;

  /* el bundle UMD deja tsParticles y loadSlim en window, pero NO ejecuta
     loadSlim: sin esa llamada no hay movers ni updaters registrados y el
     canvas se dibuja vacío. Se hace una sola vez y todo cuelga de aquí. */
  var ready = (typeof loadSlim === 'function')
    ? loadSlim(tsParticles)
    : Promise.resolve();

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function count() { return Math.round(12 + state.density * 0.88); }   // 12..100
  function speed() { return Math.max(0.05, state.speed / 100 * 3);  }  // 0.05..3

  function baseConfig(extra) {
    var cfg = {
      fullScreen: { enable: false },
      detectRetina: true,
      fpsLimit: 60,
      background: { color: 'transparent' },
      particles: {
        number: { value: count(), density: { enable: true, area: 900 } },
        color: { value: ['#ffffff', ACCENT] },
        opacity: { value: 0.45 },
        size: { value: { min: 1, max: 3 } },
        move: { enable: true, speed: speed(), outModes: { default: 'out' } },
        links: { enable: false }
      },
      interactivity: {
        events: { onHover: { enable: false }, onClick: { enable: false },
                  resize: { enable: true } }
      }
    };
    Object.keys(extra || {}).forEach(function (k) {
      cfg.particles[k] = Object.assign({}, cfg.particles[k], extra[k]);
    });
    return cfg;
  }

  function configFor(effect) {
    if (effect === 'network') {
      return baseConfig({
        opacity: { value: 0.6 },
        size: { value: { min: 1, max: 2.6 } },
        move: { enable: true, speed: speed(), outModes: { default: 'bounce' } },
        links: {
          enable: true, distance: 130, color: '#ffffff',
          opacity: 0.22, width: 1
        }
      });
    }
    if (effect === 'motes') {
      return baseConfig({
        color: { value: ['#ffffff', '#e8ff96', ACCENT] },
        opacity: { value: { min: 0.15, max: 0.6 } },
        size: { value: { min: 1, max: 3.5 } },
        move: {
          enable: true, speed: speed(), direction: 'top',
          straight: false, outModes: { default: 'out' }
        }
      });
    }
    if (effect === 'fireflies') {
      // parpadeo lento y errático, en tonos cálidos sobre el verde
      return baseConfig({
        color: { value: ['#e8ff96', ACCENT, '#ffffff'] },
        opacity: {
          value: { min: 0, max: 0.85 },
          animation: { enable: true, speed: 0.7, sync: false, startValue: 'random' }
        },
        size: { value: { min: 1, max: 2.6 } },
        move: {
          enable: true, speed: speed() * 0.35, random: true,
          straight: false, outModes: { default: 'out' }
        }
      });
    }
    if (effect === 'nebula') {
      // halos grandes y casi transparentes: bruma en movimiento
      return baseConfig({
        number: { value: Math.max(6, Math.round(count() * 0.25)),
                  density: { enable: true, area: 900 } },
        color: { value: ['#ffffff', '#e8ff96'] },
        opacity: {
          value: { min: 0.03, max: 0.12 },
          animation: { enable: true, speed: 0.25, sync: false, startValue: 'random' }
        },
        size: { value: { min: 22, max: 70 } },
        move: {
          enable: true, speed: speed() * 0.18, random: true,
          straight: false, outModes: { default: 'out' }
        }
      });
    }
    if (effect === 'orbit') {
      // giro lento alrededor del punto de luz del hero
      var cfg = baseConfig({
        color: { value: ['#ffffff', ACCENT] },
        opacity: { value: { min: 0.2, max: 0.7 } },
        size: { value: { min: 0.8, max: 2.4 } },
        move: {
          enable: true, speed: speed() * 0.5,
          outModes: { default: 'out' },
          spin: { enable: true, acceleration: 0.05 },
          center: { x: 66, y: 45, mode: 'percent' }
        }
      });
      return cfg;
    }
    // dust
    return baseConfig({
      color: { value: '#ffffff' },
      opacity: { value: { min: 0.05, max: 0.35 } },
      size: { value: { min: 0.6, max: 1.8 } },
      move: {
        enable: true, speed: speed() * 0.4, random: true,
        outModes: { default: 'out' }
      }
    });
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function render() {
    if (container) { container.destroy(); container = null; }
    save();
    syncUI();
    if (state.effect === 'none' || reduced) { return; }
    var mine = ++token;   // descarta cargas que ya han quedado obsoletas
    var options = configFor(state.effect);
    ready.then(function () {
      if (mine !== token) { return; }
      return tsParticles.load({ id: 'hero-particles', options: options });
    }).then(function (c) {
      if (!c) { return; }
      if (mine !== token) { c.destroy(); return; }
      container = c;
    })['catch'](function (e) {
      if (window.console) { console.warn('tsParticles:', e); }
    });
  }

  function syncUI() {
    Array.prototype.forEach.call(document.querySelectorAll('.fx-effect'), function (b) {
      b.classList.toggle('is-current', b.getAttribute('data-effect') === state.effect);
    });
  }

  function buildFxPicker() {
    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'font-fab fx-fab';
    fab.setAttribute('aria-label', 'Partículas del hero');
    fab.setAttribute('aria-expanded', 'false');
    fab.textContent = '✦';

    var panel = document.createElement('aside');
    panel.className = 'font-panel fx-panel';
    panel.setAttribute('aria-label', 'Partículas del hero');

    var head = document.createElement('div');
    head.className = 'font-panel-head';
    var title = document.createElement('h2');
    title.className = 'font-panel-title';
    title.textContent = 'Partículas';
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'navpop-close';
    close.style.position = 'static';
    close.style.display = 'flex';
    close.setAttribute('aria-label', 'Cerrar panel de partículas');
    close.innerHTML = '&#10005;';
    head.appendChild(title);
    head.appendChild(close);

    var body = document.createElement('div');
    body.className = 'tint-body';

    var fxLabel = document.createElement('span');
    fxLabel.className = 'tint-label';
    fxLabel.textContent = 'Efecto';
    var fxList = document.createElement('div');
    fxList.className = 'tint-patterns';
    EFFECTS.forEach(function (e) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tint-pattern fx-effect';
      b.setAttribute('data-effect', e[0]);
      b.textContent = e[1];
      b.addEventListener('click', function () { state.effect = e[0]; render(); });
      fxList.appendChild(b);
    });

    var densLabel = document.createElement('span');
    densLabel.className = 'tint-label';
    densLabel.textContent = 'Densidad';
    var dens = document.createElement('input');
    dens.type = 'range';
    dens.className = 'tint-range';
    dens.min = '0'; dens.max = '100'; dens.value = String(state.density);
    dens.setAttribute('aria-label', 'Densidad de partículas');

    var spdLabel = document.createElement('span');
    spdLabel.className = 'tint-label';
    spdLabel.textContent = 'Velocidad';
    var spd = document.createElement('input');
    spd.type = 'range';
    spd.className = 'tint-range';
    spd.min = '0'; spd.max = '100'; spd.value = String(state.speed);
    spd.setAttribute('aria-label', 'Velocidad de las partículas');

    /* recargar en cada píxel del deslizador va muy caro: se espera a que
       el usuario suelte, y mientras tanto sólo se guarda el valor */
    dens.addEventListener('input', function () { state.density = Number(dens.value); });
    dens.addEventListener('change', render);
    spd.addEventListener('input', function () { state.speed = Number(spd.value); });
    spd.addEventListener('change', render);

    body.appendChild(fxLabel);
    body.appendChild(fxList);
    body.appendChild(densLabel);
    body.appendChild(dens);
    body.appendChild(spdLabel);
    body.appendChild(spd);

    if (reduced) {
      var note = document.createElement('p');
      note.className = 'fx-note';
      note.textContent = 'Tu sistema pide movimiento reducido, así que las ' +
                         'partículas están desactivadas.';
      body.appendChild(note);
    }

    panel.appendChild(head);
    panel.appendChild(body);
    document.body.appendChild(fab);
    document.body.appendChild(panel);

    var setPanel = function (open) {
      panel.classList.toggle('is-open', open);
      fab.setAttribute('aria-expanded', String(open));
      if (open) {
        Array.prototype.forEach.call(
          document.querySelectorAll('.font-panel:not(.fx-panel)'),
          function (o) { o.classList.remove('is-open'); }
        );
      }
    };

    fab.addEventListener('click', function () {
      setPanel(!panel.classList.contains('is-open'));
    });
    close.addEventListener('click', function () { setPanel(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setPanel(false); }
    });
    document.addEventListener('click', function (e) {
      if (panel.classList.contains('is-open') &&
          !panel.contains(e.target) && e.target !== fab) {
        setPanel(false);
      }
    });

    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) {}
    if (saved) {
      if (EFFECTS.filter(function (f) { return f[0] === saved.effect; })[0]) {
        state.effect = saved.effect;
      }
      if (typeof saved.density === 'number') { state.density = saved.density; }
      if (typeof saved.speed === 'number') { state.speed = saved.speed; }
      dens.value = String(state.density);
      spd.value = String(state.speed);
    }
    render();

    /* no gastar batería animando un hero que no se ve */
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        if (!container) { return; }
        if (entries[0].isIntersecting) { container.play(); } else { container.pause(); }
      }, { threshold: 0 }).observe(host);
    }
  }

  buildFxPicker();
})();
