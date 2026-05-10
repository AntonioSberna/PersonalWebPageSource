// ============================================================
//  Theme toggle (light / dark)
// ============================================================
(function () {
  const STORAGE_KEY = 'theme';
  const root = document.documentElement;

  function getPreferred() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    // Default: dark
    return 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
  }

  // Apply theme immediately (before paint) to avoid flash
  applyTheme(getPreferred());

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getPreferred());

    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        const current = root.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    // Mobile hamburger
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('open');
      });
      // Close on link click
      navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          navLinks.classList.remove('open');
        });
      });
    }

    // Highlight active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav__links a[href^="#"]');

    if (sections.length && links.length) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              links.forEach(function (l) { l.classList.remove('active'); });
              const active = document.querySelector('.nav__links a[href="#' + entry.target.id + '"]');
              if (active) active.classList.add('active');
            }
          });
        },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      sections.forEach(function (s) { observer.observe(s); });
    }

    // Ordinal suffixes as superscript (e.g. 3rd → 3<sup>rd</sup>)
    (function () {
      var re = /(\d+)(st|nd|rd|th)\b/g;
      var skip = new Set(['SCRIPT','STYLE','SUP','SUB','CODE','PRE']);
      function walk(node) {
        if (node.nodeType === 3) {
          if (!re.test(node.nodeValue)) return;
          re.lastIndex = 0;
          var frag = document.createDocumentFragment();
          var last = 0, m;
          while ((m = re.exec(node.nodeValue)) !== null) {
            frag.appendChild(document.createTextNode(node.nodeValue.slice(last, m.index + m[1].length)));
            var sup = document.createElement('sup');
            sup.textContent = m[2];
            frag.appendChild(sup);
            last = m.index + m[0].length;
          }
          frag.appendChild(document.createTextNode(node.nodeValue.slice(last)));
          node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === 1 && !skip.has(node.tagName)) {
          Array.from(node.childNodes).forEach(walk);
        }
      }
      walk(document.getElementById('main-content') || document.body);
    })();

    // Publication filter (on /publication/ list page)
    const filterBtns = document.querySelectorAll('.pub-filter__btn');
    if (filterBtns.length) {
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          filterBtns.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          const filter = btn.getAttribute('data-filter');
          document.querySelectorAll('.pub-card[data-type]').forEach(function (card) {
            if (filter === 'all' || card.getAttribute('data-type') === filter) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }
  });
})();
