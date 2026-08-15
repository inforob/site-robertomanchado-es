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
    ['carbon',    'Fibra de carbono'],
    ['rays',      'Rayos'],
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
