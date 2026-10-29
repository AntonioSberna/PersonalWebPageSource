// ============================================================
//  Theme toggle (light / dark)
// ============================================================
(function () {
  // Theme: follows the system (prefers-color-scheme) unless the visitor picks one
  // with the toggle. Picking the same theme as the system goes back to "auto".
  const STORAGE_KEY = 'theme-choice';
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: light)');

  function systemTheme() { return media.matches ? 'light' : 'dark'; }
  function savedTheme() {
    try { const t = localStorage.getItem(STORAGE_KEY); return (t === 'light' || t === 'dark') ? t : null; }
    catch (e) { return null; }
  }
  function getPreferred() { return savedTheme() || systemTheme(); }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
  }

  function chooseTheme(theme) {
    try {
      if (theme === systemTheme()) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
    applyTheme(theme);
  }

  applyTheme(getPreferred());
  // Old key: the previous version saved 'dark' for every visitor, so it is not a real choice
  try { localStorage.removeItem('theme'); } catch (e) {}

  // Live update when the system theme changes (only if no explicit choice)
  media.addEventListener('change', function () { if (!savedTheme()) applyTheme(systemTheme()); });

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getPreferred());

    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        const current = root.getAttribute('data-theme');
        chooseTheme(current === 'dark' ? 'light' : 'dark');
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

    // DOI buttons copy the DOI (as https://doi.org/... link) instead of opening it.
    // Ctrl/Cmd/middle click still open it in a new tab.
    function legacyCopy(text) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (err) {}
      ta.remove(); return ok;
    }
    document.querySelectorAll('a[data-copy-doi]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;
        e.preventDefault();
        const doi = 'https://doi.org/' + a.href.replace(/^https?:\/\/(dx\.)?doi\.org\//, '');
        function done() {
          if (a.dataset.label === undefined) a.dataset.label = a.textContent;
          a.textContent = 'Copied \u2713';
          a.classList.add('is-copied');
          clearTimeout(a._t);
          a._t = setTimeout(function () { a.textContent = a.dataset.label; a.classList.remove('is-copied'); }, 1500);
        }
        function fallback() { if (legacyCopy(doi)) done(); else window.prompt('Copy the DOI:', doi); }
        if (navigator.clipboard) navigator.clipboard.writeText(doi).then(done, fallback);
        else fallback();
      });
    });

    // Cite: BibTeX dialog (entries generated at build time, see partials/bibtex.html)
    const citeBtns = document.querySelectorAll('.cite-btn');
    if (citeBtns.length) {
      let dlg, pre, title, copyBtn, dlLink;
      function buildDialog() {
        dlg = document.createElement('dialog');
        dlg.className = 'cite-dialog';
        dlg.setAttribute('aria-labelledby', 'cite-dialog-h');
        dlg.innerHTML =
          '<div class="cite-dialog__head"><h2 id="cite-dialog-h">Cite</h2>' +
          '<button type="button" class="cite-dialog__close" aria-label="Close">&times;</button></div>' +
          '<p class="cite-dialog__title"></p>' +
          '<pre class="cite-dialog__bib" tabindex="0"></pre>' +
          '<div class="cite-dialog__actions">' +
          '<button type="button" class="btn-pub btn-pub--primary cite-dialog__copy">Copy BibTeX</button>' +
          '<a class="btn-pub cite-dialog__dl" download>Download .bib</a></div>';
        document.body.appendChild(dlg);
        pre = dlg.querySelector('.cite-dialog__bib');
        title = dlg.querySelector('.cite-dialog__title');
        copyBtn = dlg.querySelector('.cite-dialog__copy');
        dlLink = dlg.querySelector('.cite-dialog__dl');
        dlg.querySelector('.cite-dialog__close').addEventListener('click', function () { dlg.close(); });
        dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });   // backdrop
        copyBtn.addEventListener('click', function () {
          const done = function () { copyBtn.textContent = 'Copied \u2713'; setTimeout(function () { copyBtn.textContent = 'Copy BibTeX'; }, 1600); };
          if (navigator.clipboard) navigator.clipboard.writeText(pre.textContent).then(done, selectText);
          else selectText();
        });
      }
      function selectText() {
        const r = document.createRange(); r.selectNodeContents(pre);
        const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      }
      citeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (!dlg) buildDialog();
          const bib = btn.getAttribute('data-bibtex');
          pre.textContent = bib;
          title.textContent = btn.getAttribute('data-title') || '';
          const key = (bib.match(/^@\w+\{([^,]+),/) || [, 'citation'])[1];
          if (dlLink.href) URL.revokeObjectURL(dlLink.href);
          dlLink.href = URL.createObjectURL(new Blob([bib + '\n'], { type: 'application/x-bibtex' }));
          dlLink.setAttribute('download', key + '.bib');
          copyBtn.textContent = 'Copy BibTeX';
          dlg.showModal();
        });
      });
    }

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
