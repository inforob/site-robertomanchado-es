/* =========================================================
   Ask my CV — chatbot de prototipo
   JS vanilla, sin backend: las respuestas están preestablecidas y se
   eligen por palabras clave. El spinner redondo simula la latencia de
   una llamada AJAX y la respuesta se escribe carácter a carácter.

   Los datos salen del CV de 2025. A propósito NO se incluyen ni el DNI
   ni el teléfono móvil: son datos personales y esto es una página
   pública. Para contacto se ofrecen LinkedIn, GitHub y la web.
   ========================================================= */
(function () {
  'use strict';

  var root = document.getElementById('cvChat');
  if (!root) return;

  var log         = document.getElementById('chatLog');
  var form        = document.getElementById('chatForm');
  var input       = document.getElementById('chatInput');
  var sendBtn     = form.querySelector('.chat-send');
  var expandBtn   = document.getElementById('chatExpand');
  var chipsWrap   = document.getElementById('chatSuggestions');
  var modal       = document.getElementById('chatModal');
  var modalSlot   = document.getElementById('chatModalSlot');
  var panelSlot   = root.parentNode;          // el .panel-body de origen

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* Ritmo de escritura. En el panel el hueco es pequeño, así que se teclea
     despacio para que dé tiempo a leer; en el modal, algo más suelto.
     Milisegundos por carácter: */
  var SPEED_PANEL = 34;
  var SPEED_MODAL = 22;
  /* pausas extra al cerrar frase o salto de línea, para dar respiración */
  var PAUSE_PUNCT = 220;
  var PAUSE_BREAK = 320;

  var typingTimer = null;

  /* ---------------------------------------------------------
     Base de conocimiento
     Cada intent: palabras clave + respuesta. El orden importa,
     gana el que más palabras clave acierta.
     --------------------------------------------------------- */
  var INTENTS = [
    {
      id: 'perfil',
      keys: ['perfil', 'quien', 'quién', 'eres', 'sobre ti', 'presenta', 'resumen', 'bio'],
      answer:
        'Roberto Manchado, Backend Developer PHP / Symfony. 40 años, ' +
        'residente en Madrid.\n' +
        'Llevo desde 2008 en desarrollo web, con los últimos diez años ' +
        'centrados en backend PHP con Symfony: APIs, procesamiento ' +
        'asíncrono y plataformas de datos.'
    },
    {
      id: 'actual',
      keys: ['actual', 'ahora', 'trabajas', 'trabajando', 'empresa actual', 'tilo', 'leadcars', 'automagic'],
      answer:
        'Ahora mismo en TILO MOTION (Plaza Castilla, Madrid), desde ' +
        'octubre de 2023. Sector automoción.\n\n' +
        'Trabajo en LeadCars, una plataforma de entrada de leads ' +
        '(oportunidades de venta de vehículos). Lo más destacable:\n' +
        '· Migración de la API de Symfony 5.4 a 7.2\n' +
        '· Registro de llamadas integrado con Meetip, Woice, Numinetec ' +
        'y UnoComaSeis\n' +
        '· Automagic, un sistema de nurturing propio\n' +
        '· Hilos de comunicación entre landings para conectar ' +
        'comerciales y clientes\n\n' +
        'Stack: Symfony 5.4/7.2, PHP 7.4, MySQL 8.1, Docker, PowerBI.'
    },
    {
      id: 'experiencia',
      keys: ['experiencia', 'trayectoria', 'empresas', 'historial', 'donde has trabajado',
             'dónde has trabajado', 'años', 'anos', 'cuanto', 'cuánto'],
      answer:
        'Trayectoria, de más reciente a más antigua:\n\n' +
        '2023—hoy   Tilo Motion (Madrid)\n' +
        '2022—2023  NextCasa.es (Madrid-Málaga)\n' +
        '2021—2022  SunMedia | Exte (Madrid)\n' +
        '2020—2021  Arold → ABC / Vocento\n' +
        '2019—2020  Arold → eLearning Explícate\n' +
        '2019       SmallWorld Financial Services\n' +
        '2017—2019  GiuntyPsy (Madrid)\n' +
        '2015—2016  ASSoftWare (Madrid)\n' +
        '2008—2014  Etapa junior: Masmovil, HotelTools, LemonQuest\n\n' +
        'Pregúntame por cualquiera de ellas.'
    },
    {
      id: 'proyectos',
      keys: ['proyecto', 'proyectos', 'destacado', 'destacados', 'dashboard', 'contextual',
             'kafka', 'druid', 'evalua', 'evalúa', 'nextcasa', 'sunmedia', 'abc', 'vocento'],
      answer:
        'Los que mejor me representan:\n\n' +
        'Dashboard-ssp (SunMedia): integra 12 plataformas de publicidad ' +
        'online para leer métricas — SPOTX, OpenX, PubMatic, Magnite, ' +
        'GoogleAdManager y más. Almacenamiento en Apache Druid, frontal ' +
        'en VueJS. Lo difícil era encajar métricas de APIs distintas en ' +
        'fechas, redondeos y moneda, con OAuth1.0, OAuth2.0 y ' +
        'BearerToken de por medio.\n\n' +
        'Contextual (SunMedia): módulos comunicados de forma asíncrona ' +
        'con Apache Kafka y Aerospike para priorizar y categorizar URLs ' +
        'a partir de modelos de machine learning.\n\n' +
        'EVALÚA (GiuntyPsy / ASSoftWare): plataforma de corrección de ' +
        'tests psicopedagógicos online, desde la 1.0 hasta el rediseño ' +
        'de la 4.0.\n\n' +
        'ABC de Sevilla (Vocento): secciones del periódico y portada.'
    },
    {
      id: 'stack',
      keys: ['stack', 'tecnologia', 'tecnología', 'tecnologias', 'tecnologías', 'lenguaje',
             'lenguajes', 'herramientas', 'skills', 'conocimientos', 'php', 'symfony'],
      answer:
        'Backend: PHP (5.6 → 8.1), Symfony (2.x → 7.2), Laravel, Lumen, ' +
        'Silex, CakePHP, Doctrine.\n' +
        'Arquitectura: DDD, CQRS, APIs RESTful, procesamiento asíncrono ' +
        'con RabbitMQ y Apache Kafka.\n' +
        'Datos: MySQL, MariaDB, PostgreSQL, Aerospike, Apache Druid.\n' +
        'Infra: Docker, Nginx, Apache, entornos LAMP sobre openSUSE, ' +
        'Ubuntu y CentOS.\n' +
        'CI: Jenkins, GitLab Pipelines, Bitbucket Pipelines, GitHub ' +
        'Actions.\n' +
        'Front: HTML5, CSS3, responsive, Bootstrap 5, Tailwind, jQuery, ' +
        'Astro, Webpack, Vite.'
    },
    {
      id: 'testing',
      keys: ['test', 'tests', 'testing', 'calidad', 'phpunit', 'phpstan', 'debug', 'xdebug'],
      answer:
        'Pruebas unitarias, funcionales y de integración con PHPUnit. ' +
        'Para calidad de código, php-cs-fixer y phpstan, integrados en ' +
        'las tuberías de CI. Depuración con Xdebug.\n' +
        'En SunMedia los proyectos vivían en repositorios privados de ' +
        'GitLab con CI configurada, y esa es la forma de trabajar que ' +
        'prefiero.'
    },
    {
      id: 'ia',
      keys: ['ia', 'inteligencia', 'llm', 'llms', 'gpt', 'claude', 'codestral', 'ai', 'modelos'],
      answer:
        'Trabajo con modelos de lenguaje en el día a día: GPT-4.0, ' +
        'Claude Sonnet 4.5 y Codestral, aplicados a automatización, ' +
        'generación de código y análisis semántico.\n' +
        'De hecho escribí un libro sobre ello: "Claude Code para ' +
        'desarrolladores".'
    },
    {
      id: 'formacion',
      keys: ['formacion', 'formación', 'estudios', 'estudiado', 'carrera', 'universidad',
             'titulo', 'título', 'master', 'máster', 'academico', 'académico'],
      answer:
        'Ingeniería Técnica en Informática de Sistemas — Facultad de ' +
        'Ciencias, Universidad de Salamanca (2006-2013).\n' +
        'CFGS Desarrollo de Aplicaciones Informáticas — Colegio ' +
        'Salesiano San José, Salamanca (2004-2006).\n' +
        'Máster en Diseño Gráfico/Web — escuela digital TRAZOS_, ' +
        'Madrid (2014-2015).'
    },
    {
      id: 'idiomas',
      keys: ['idioma', 'idiomas', 'ingles', 'inglés', 'english'],
      answer:
        'Español nativo e inglés técnico, lectura y redacción: ' +
        'documentación, specs de APIs y repositorios sin problema.'
    },
    {
      id: 'publicaciones',
      keys: ['publicacion', 'publicación', 'publicaciones', 'articulo', 'artículo',
             'articulos', 'artículos', 'libro', 'blog'],
      answer:
        'Trabajos publicados:\n' +
        '· https://www.nextcasa.es\n' +
        '· https://www.economiadehoy.es/noticia/6857/tecnologia\n' +
        '· https://www.varela.homes\n\n' +
        'Y el libro "Claude Code para desarrolladores" — ' +
        'https://claudecode.es/'
    },
    {
      id: 'contacto',
      keys: ['contacto', 'contactar', 'email', 'correo', 'linkedin', 'github', 'web',
             'localiza', 'escribir', 'hablar'],
      answer:
        'Por aquí:\n' +
        '· LinkedIn — https://es.linkedin.com/in/robertomanchado\n' +
        '· GitHub — https://github.com/inforob/\n' +
        '· Web — https://www.robertomanchado.es/\n\n' +
        'Base en Madrid, con disponibilidad para remoto.'
    }
  ];

  var GREETING =
    'Hola. Soy el asistente del CV de Roberto Manchado.\n' +
    'Pregúntame por su experiencia, su stack, sus proyectos o su ' +
    'formación. Abajo tienes algunos atajos.';

  var FALLBACK =
    'De eso no tengo nada guardado — este asistente es un prototipo con ' +
    'respuestas preparadas.\n' +
    'Prueba con: perfil, experiencia, trabajo actual, proyectos, stack, ' +
    'testing, IA, formación, idiomas, publicaciones o contacto.';

  var CHIPS = [
    { label: '¿Quién es?',        q: 'Cuéntame el perfil' },
    { label: 'Trabajo actual',    q: '¿Dónde trabajas ahora?' },
    { label: 'Stack',             q: '¿Qué stack usas?' },
    { label: 'Proyectos',         q: 'Proyectos destacados' },
    { label: 'Formación',         q: '¿Qué formación tienes?' },
    { label: 'Contacto',          q: '¿Cómo contactar?' }
  ];

  /* ---------------------------------------------------------
     Selección de respuesta
     --------------------------------------------------------- */
  function normalize(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');   // fuera acentos: "formación" = "formacion"
  }

  function findAnswer(question) {
    var q = normalize(question);
    var best = null;
    var bestScore = 0;

    INTENTS.forEach(function (intent) {
      var score = 0;
      intent.keys.forEach(function (key) {
        if (q.indexOf(normalize(key)) !== -1) {
          // las claves largas pesan más: "trabajo actual" > "ahora"
          score += key.length;
        }
      });
      if (score > bestScore) { bestScore = score; best = intent; }
    });

    return best ? best.answer : FALLBACK;
  }

  /* ---------------------------------------------------------
     Pintado
     --------------------------------------------------------- */
  function scrollToEnd() { log.scrollTop = log.scrollHeight; }

  function addUser(text) {
    var el = document.createElement('p');
    el.className = 'chat-msg chat-msg--user';
    el.textContent = text;
    log.appendChild(el);
    scrollToEnd();
  }

  function addLoader() {
    var el = document.createElement('div');
    el.className = 'chat-loading';
    el.innerHTML = '<span class="chat-spinner" aria-hidden="true"></span>' +
                   '<span>consultando el CV…</span>';
    log.appendChild(el);
    scrollToEnd();
    return el;
  }

  /* escribe la respuesta carácter a carácter, con el cursor al final */
  function addBot(text, done) {
    var el = document.createElement('p');
    el.className = 'chat-msg chat-msg--bot';
    log.appendChild(el);

    if (reduced) {                       // sin animación: de una vez
      el.textContent = text;
      scrollToEnd();
      if (done) done();
      return;
    }

    var caret = document.createElement('span');
    caret.className = 'chat-caret';
    el.appendChild(caret);

    var i = 0;
    var buffer = document.createTextNode('');
    el.insertBefore(buffer, caret);

    (function step() {
      var ch = text.charAt(i);
      i += 1;
      buffer.nodeValue = text.slice(0, i);
      scrollToEnd();

      if (i < text.length) {
        var wait = isOpen() ? SPEED_MODAL : SPEED_PANEL;
        if (ch === '\n') { wait += PAUSE_BREAK; }
        else if (ch === '.' || ch === ':') { wait += PAUSE_PUNCT; }
        typingTimer = window.setTimeout(step, wait);
      } else {
        el.removeChild(caret);
        if (done) done();
      }
    })();
  }

  /* ---------------------------------------------------------
     Ciclo de la conversación
     --------------------------------------------------------- */
  var busy = false;

  function setBusy(state) {
    busy = state;
    sendBtn.disabled = state;
    input.disabled = state;
    chipsWrap.querySelectorAll('button').forEach(function (b) { b.disabled = state; });
  }

  function ask(question) {
    if (busy || !question.trim()) return;

    addUser(question.trim());
    setBusy(true);

    var loader = addLoader();
    // latencia falsa, variable, para que no parezca un temporizador fijo
    var delay = 600 + Math.random() * 700;

    window.setTimeout(function () {
      log.removeChild(loader);
      addBot(findAnswer(question), function () {
        setBusy(false);
        input.focus();
      });
    }, delay);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value;
    input.value = '';
    ask(q);
  });

  /* ---------- sugerencias ---------- */
  CHIPS.forEach(function (chip) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chat-chip';
    b.textContent = chip.label;
    b.addEventListener('click', function () { ask(chip.q); });
    chipsWrap.appendChild(b);
  });

  /* ---------------------------------------------------------
     Modal: no se duplica nada, se muda el propio #cvChat.
     Así el hilo, el estado y los listeners siguen intactos.
     --------------------------------------------------------- */
  function isOpen() { return modal && !modal.hidden; }

  var lastFocus = null;

  function openModal() {
    if (!modal || isOpen()) return;
    lastFocus = document.activeElement;
    modalSlot.appendChild(root);
    modal.hidden = false;
    document.body.classList.add('chat-modal-open');
    scrollToEnd();
    if (!busy) input.focus();
  }

  function closeModal() {
    if (!isOpen()) return;
    panelSlot.appendChild(root);
    modal.hidden = true;
    document.body.classList.remove('chat-modal-open');
    scrollToEnd();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (expandBtn) expandBtn.addEventListener('click', openModal);

  if (modal) {
    modal.querySelectorAll('[data-chat-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) closeModal();
    });
    /* el foco no debe escaparse del diálogo mientras está abierto */
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusables = modal.querySelectorAll(
        'button:not([disabled]), input:not([disabled])'
      );
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }

  /* ---------- saludo inicial ---------- */
  addBot(GREETING);
})();
