/* =========================================================
   BizNiz Corp — JavaScript vanilla
   ========================================================= */
(function () {
  'use strict';

  /* ---------- menú móvil ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    // cerrar al navegar
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && window.matchMedia('(max-width:820px)').matches) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // reset al volver a desktop
    window.addEventListener('resize', function () {
      if (!window.matchMedia('(max-width:820px)').matches) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
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
})();
