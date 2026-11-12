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
    if (btn) btn.textContent = theme === 'blueprint' ? '\u270e Blueprint' : (theme === 'dark' ? '☀ Light' : '☾ Dark');
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
      // Easter egg: seven quick clicks open a secret "Blueprint" theme (not saved).
      // Quick clicks after the first do not switch the theme, so the page never flashes.
      let clicks = 0, last = 0, before = null;
      btn.addEventListener('click', function () {
        const now = Date.now();
        const quick = now - last < 500;
        last = now;
        const current = root.getAttribute('data-theme');
        if (current === 'blueprint') { clicks = 0; applyTheme(getPreferred()); return; }
        clicks = quick ? clicks + 1 : 1;
        // remember the choice before this burst of clicks, to give it back when leaving Blueprint
        if (clicks === 1) { try { before = localStorage.getItem(STORAGE_KEY); } catch (e) { before = null; } }
        if (clicks >= 7) {
          clicks = 0;
          try { if (before) localStorage.setItem(STORAGE_KEY, before); else localStorage.removeItem(STORAGE_KEY); } catch (e) {}
          applyTheme('blueprint');
          const t = document.createElement('div');
          t.className = 'toast is-visible'; t.setAttribute('role', 'status');
          t.innerHTML = '<i class="fa-solid fa-compass-drafting" aria-hidden="true"></i>Blueprint mode. Click the button again to leave.';
          document.body.appendChild(t);
          setTimeout(function () { t.classList.remove('is-visible'); setTimeout(function () { t.remove(); }, 400); }, 3200);
          return;
        }
        if (!quick) chooseTheme(current === 'dark' ? 'light' : 'dark');
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

    // Papers: filter by topic (the link keeps the choice, e.g. /papers/#masonry-infills)
    const topicBox = document.getElementById('topic-filter');
    if (topicBox) {
      const chips = topicBox.querySelectorAll('.topic-chip');
      const items = document.querySelectorAll('.showcase-item[data-topics]');
      const count = document.getElementById('topic-count');
      const apply = function (topic) {
        let n = 0, review = 0;
        items.forEach(function (it) {
          const show = !topic || it.dataset.topics.split(' ').includes(topic);
          it.hidden = !show;
          if (show) {
            it.classList.toggle('showcase-item--reverse', n % 2 === 1);
            n++;
            if (it.dataset.status) review++;
          }
        });
        chips.forEach(function (c) {
          const on = c.dataset.topic === topic;
          c.classList.toggle('is-active', on);
          c.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        const pub = n - review;
        count.textContent = pub + (pub === 1 ? ' publication' : ' publications') + (review ? ' \u00b7 ' + review + ' under review' : '');
        document.querySelectorAll('#topic-matrix [data-row]').forEach(function (el) {
          el.classList.toggle('is-faded', !!topic && el.dataset.row !== topic);
          el.classList.toggle('is-active', el.dataset.row === topic);
        });
      };
      chips.forEach(function (c) {
        c.addEventListener('click', function () {
          apply(c.dataset.topic);
          history.replaceState(null, '', c.dataset.topic ? '#' + c.dataset.topic : location.pathname);
        });
      });
      // Topic names in the charts act as the matching chip
      document.querySelectorAll('button[data-chart-topic]').forEach(function (b) {
        b.addEventListener('click', function () {
          const chip = topicBox.querySelector('[data-topic="' + CSS.escape(b.dataset.chartTopic) + '"]');
          if (chip) { chip.click(); topicBox.scrollIntoView({ block: 'nearest' }); }
        });
      });
      topicBox.hidden = false;
      const fromHash = location.hash.slice(1);
      if (fromHash && topicBox.querySelector('[data-topic="' + CSS.escape(fromHash) + '"]')) apply(fromHash);
    }

    // Blog: comments are the replies to a Mastodon post, loaded only on request
    const mc = document.getElementById('mastodon-comments');
    if (mc) {
      const api = 'https://' + mc.dataset.host + '/api/v1/statuses/' + mc.dataset.id;
      const list = mc.querySelector('.mc__list');
      const btn = mc.querySelector('.mc__load');
      const stats = mc.querySelector('.mc__stats');
      const status = mc.querySelector('.mc__status');
      const OK_TAGS = ['P', 'BR', 'A', 'SPAN', 'EM', 'STRONG', 'B', 'I', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'CODE', 'PRE'];
      // Replies are written by strangers on other servers: keep only harmless tags and http(s) links
      const clean = function (html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const walk = function (node) {
          Array.from(node.children).forEach(function (el) {
            walk(el);
            if (!OK_TAGS.includes(el.tagName)) { el.replaceWith(document.createTextNode(el.textContent)); return; }
            const href = el.getAttribute('href');
            Array.from(el.attributes).forEach(function (a) { el.removeAttribute(a.name); });
            if (el.tagName === 'A') {
              if (href && /^https?:\/\//i.test(href)) {
                el.setAttribute('href', href);
                el.setAttribute('target', '_blank');
                el.setAttribute('rel', 'nofollow noopener ugc');
              }
            }
          });
        };
        walk(doc.body);
        return doc.body;
      };
      const httpUrl = function (u) { return /^https:\/\//i.test(u || '') ? u : ''; };
      const render = function (ctx) {
        const depth = {};
        depth[mc.dataset.id] = 0;
        ctx.descendants.forEach(function (s) {
          const d = (depth[s.in_reply_to_id] === undefined ? 0 : depth[s.in_reply_to_id]) + 1;
          depth[s.id] = d;
          const li = document.createElement('li');
          li.className = 'mc__item';
          li.style.setProperty('--depth', Math.min(d - 1, 3));
          const head = document.createElement('div');
          head.className = 'mc__head';
          const av = document.createElement('img');
          av.className = 'mc__avatar'; av.alt = ''; av.loading = 'lazy';   // decorative: the name follows
          av.src = httpUrl(s.account.avatar_static);
          const who = document.createElement('a');
          who.className = 'mc__who'; who.target = '_blank'; who.rel = 'nofollow noopener ugc';
          who.href = httpUrl(s.account.url) || '#';
          who.textContent = s.account.display_name || s.account.username;
          const handle = document.createElement('span');
          handle.className = 'mc__handle';
          handle.textContent = '@' + s.account.acct;
          const when = document.createElement('a');
          when.className = 'mc__when'; when.target = '_blank'; when.rel = 'nofollow noopener ugc';
          when.href = httpUrl(s.url) || '#';
          when.textContent = new Date(s.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
          head.append(av, who, handle, when);
          const body = document.createElement('div');
          body.className = 'mc__body';
          if (s.spoiler_text) {
            const details = document.createElement('details');
            const sum = document.createElement('summary');
            sum.textContent = s.spoiler_text;
            details.append(sum, ...clean(s.content).childNodes);
            body.append(details);
          } else {
            body.append(...clean(s.content).childNodes);
          }
          if (s.language) body.lang = s.language;   // screen readers use the right voice
          li.append(head, body);
          list.append(li);
        });
        const n = ctx.descendants.length;
        // the visible line stays empty when there are replies; screen readers hear how many arrived
        status.innerHTML = n ? '<span class="sr-only">' + n + (n === 1 ? ' reply' : ' replies') + ' loaded.</span>' : 'No replies yet: be the first.';
      };
      btn.addEventListener('click', function () {
        btn.disabled = true;
        status.textContent = 'Loading\u2026';
        Promise.all([fetch(api), fetch(api + '/context')]).then(function (rs) {
          if (!rs[0].ok || !rs[1].ok) throw new Error('HTTP');
          return Promise.all(rs.map(function (r) { return r.json(); }));
        }).then(function (d) {
          const fav = d[0].favourites_count, boo = d[0].reblogs_count, rep = d[0].replies_count;
          // symbols for the eye, words for screen readers
          stats.innerHTML = '<span aria-hidden="true">\u2665 ' + fav + '  \u00b7  \u21bb ' + boo + '  \u00b7  </span>' +
            '<span class="sr-only">' + fav + (fav === 1 ? ' favourite, ' : ' favourites, ') + boo + (boo === 1 ? ' boost, ' : ' boosts, ') + '</span>' +
            rep + (rep === 1 ? ' reply' : ' replies');
          render(d[1]);
          // the button disappears: move the focus to the comments, not to the top of the page
          const title = mc.querySelector('.mc__title');
          btn.remove();
          if (title) title.focus({ preventScroll: true });
        }).catch(function () {
          btn.disabled = false;
          status.textContent = 'Could not load the replies. Try again, or read them on Mastodon.';
        });
      });
    }

    // Margin notes: tell screen readers which note each number opens
    document.querySelectorAll('.blog-post__content').forEach(function (box) {
      box.querySelectorAll('.sn-toggle').forEach(function (t, i) { t.setAttribute('aria-label', 'Note ' + (i + 1)); });
    });

    // Margin notes: push a note down if it would overlap the previous one
    const notes = document.querySelectorAll('.blog-post__content .sidenote');
    if (notes.length) {
      const wide = window.matchMedia('(min-width: 1120px)');
      const layoutNotes = function () {
        let bottom = -Infinity;
        notes.forEach(function (n) {
          n.style.marginTop = '';
          if (!wide.matches) return;
          const r = n.getBoundingClientRect();
          const shift = Math.max(0, bottom + 14 - r.top);
          if (shift) n.style.marginTop = shift + 'px';
          bottom = r.bottom + shift;
        });
      };
      layoutNotes();
      window.addEventListener('load', layoutNotes);
      window.addEventListener('resize', layoutNotes);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutNotes);
    }

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
          // widths of the two texts, measured once; the width then changes smoothly
          if (!a._w) {
            const w0 = a.getBoundingClientRect().width;
            a.textContent = 'Copied \u2713';
            const w1 = a.getBoundingClientRect().width;
            a.textContent = a.dataset.label;
            a._w = { label: w0, copied: w1 };
            a.style.width = w0 + 'px';
            void a.offsetWidth;
          }
          // cross-fade: fade out (while the width follows), change the text, fade in
          const swap = function (text, copied) {
            a.style.width = (copied ? a._w.copied : a._w.label) + 'px';
            a.classList.add('is-fading');
            setTimeout(function () {
              a.textContent = text;
              a.classList.toggle('is-copied', copied);
              a.classList.remove('is-fading');
            }, 180);
          };
          clearTimeout(a._t);
          swap('Copied \u2713', true);
          a._t = setTimeout(function () { swap(a.dataset.label, false); }, 1700);
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

// ============================================================
//  Image viewer for blog figures (images with data-full, not inside a link)
//  Opens in a dialog over the blurred page. Zoom: wheel, pinch, +/- buttons,
//  click on the image. Drag to move. Closes on X, Esc or click outside.
// ============================================================
(function () {
  const thumbs = Array.prototype.filter.call(
    document.querySelectorAll('.blog-post img[data-full]'),
    function (img) { return !img.closest('a'); });
  if (!thumbs.length || typeof HTMLDialogElement === 'undefined') return;

  const STEP = 1.6, CLICK_ZOOM = 2.5;
  let dlg, stage, img, label, btnIn, btnOut, caption, hint, opener;
  let s = 1, tx = 0, ty = 0, maxS = 4, base = null, liveTimer = 0, hinted = false;
  const pointers = new Map();
  let gesture = null;

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }
  function button(cls, icon, name) {
    const b = el('button', 'lightbox__btn ' + cls, '<i class="fa-solid ' + icon + '" aria-hidden="true"></i>');
    b.type = 'button'; b.setAttribute('aria-label', name); b.title = name;
    return b;
  }

  function build() {
    dlg = el('dialog', 'lightbox');
    dlg.setAttribute('aria-label', 'Image viewer');
    stage = el('div', 'lightbox__stage');
    img = el('img', 'lightbox__img');
    img.draggable = false;
    stage.appendChild(img);

    const bar = el('div', 'lightbox__bar');
    btnOut = button('', 'fa-minus', 'Zoom out');
    label = el('button', 'lightbox__zoom');
    label.type = 'button'; label.title = 'Fit to screen'; label.setAttribute('aria-label', 'Fit to screen');
    btnIn = button('', 'fa-plus', 'Zoom in');
    const close = button('lightbox__btn--close', 'fa-xmark', 'Close');
    bar.append(btnOut, label, btnIn, el('span', 'lightbox__sep'), close);

    caption = el('p', 'lightbox__caption');
    hint = el('p', 'lightbox__hint');
    dlg.append(stage, el('div', 'lightbox__spinner'), hint, bar, caption);
    document.body.appendChild(dlg);

    btnIn.addEventListener('click', function () { zoomTo(s * STEP, null, true); });
    btnOut.addEventListener('click', function () { zoomTo(s / STEP, null, true); });
    label.addEventListener('click', function () { zoomTo(1, null, true); });
    close.addEventListener('click', hide);
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); hide(); });
    dlg.addEventListener('keydown', onKey);
    stage.addEventListener('wheel', onWheel, { passive: false });
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    img.addEventListener('load', function () { base = null; });
    window.addEventListener('resize', function () { if (dlg.open) { base = null; zoomTo(1, null, false); } });
  }

  // size of the image at "fit" (scale 1), and its untransformed centre
  function measure() {
    if (base) return base;
    const r = img.getBoundingClientRect();
    const w = r.width / s, h = r.height / s;
    base = { w: w, h: h, cx: r.left + r.width / 2 - tx, cy: r.top + r.height / 2 - ty };
    const natural = img.naturalWidth || w;
    maxS = Math.max(3, Math.min(8, natural / w * 2));
    return base;
  }

  function clamp() {
    const b = measure();
    const mx = Math.max(0, (b.w * s - window.innerWidth) / 2 + 40);
    const my = Math.max(0, (b.h * s - window.innerHeight) / 2 + 40);
    if (b.w * s <= window.innerWidth) tx = 0; else tx = Math.max(-mx, Math.min(mx, tx));
    if (b.h * s <= window.innerHeight) ty = 0; else ty = Math.max(-my, Math.min(my, ty));
  }

  function apply(animate) {
    if (!animate) {
      dlg.classList.add('is-live');
      clearTimeout(liveTimer);
      liveTimer = setTimeout(function () { dlg.classList.remove('is-live'); }, 120);
    }
    img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')';
    const zoomed = s > 1.01;
    img.classList.toggle('is-zoomed', zoomed);
    dlg.classList.toggle('is-zoomed-in', zoomed);
    label.textContent = Math.round(s * 100) + '%';
    btnOut.disabled = !zoomed;
    btnIn.disabled = s >= maxS - 0.01;
  }

  // zoom to scale ns, keeping the point (x, y) of the screen still (default: centre)
  function zoomTo(ns, pt, animate) {
    const b = measure();
    ns = Math.max(1, Math.min(maxS, ns));
    const px = (pt ? pt.x : window.innerWidth / 2) - b.cx;
    const py = (pt ? pt.y : window.innerHeight / 2) - b.cy;
    const u = (px - tx) / s, v = (py - ty) / s;
    tx = px - u * ns; ty = py - v * ns; s = ns;
    if (s === 1) { tx = 0; ty = 0; }
    clamp();
    apply(animate);
  }

  function onWheel(e) {
    e.preventDefault();
    const dy = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
    zoomTo(s * Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.0018)), { x: e.clientX, y: e.clientY }, false);
  }

  function onDown(e) {
    if (e.button !== 0) return;
    stage.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      gesture = { x: e.clientX, y: e.clientY, tx: tx, ty: ty, moved: false, onImg: e.target === img, multi: false };
    } else if (pointers.size === 2 && gesture) {
      const p = Array.from(pointers.values());
      gesture.multi = true; gesture.moved = true;
      gesture.dist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      gesture.mid = { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 };
    }
  }

  function onMove(e) {
    if (!pointers.has(e.pointerId) || !gesture) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size >= 2) {
      const p = Array.from(pointers.values());
      const dist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      const mid = { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 };
      tx += mid.x - gesture.mid.x; ty += mid.y - gesture.mid.y;
      zoomTo(s * dist / gesture.dist, mid, false);
      gesture.dist = dist; gesture.mid = mid;
      return;
    }
    const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
    if (!gesture.moved && Math.hypot(dx, dy) > 5) gesture.moved = true;
    if (gesture.moved && !gesture.multi && s > 1.01) {
      dlg.classList.add('is-dragging');
      tx = gesture.tx + dx; ty = gesture.ty + dy;
      clamp(); apply(false);
    }
  }

  function onUp(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (pointers.size) return;
    dlg.classList.remove('is-dragging');
    const g = gesture; gesture = null;
    if (!g || g.moved || e.type === 'pointercancel') return;
    if (g.onImg) {
      // click toggles fit <-> zoom on the clicked point (a drag moves the image instead)
      if (s > 1.01) zoomTo(1, null, true);
      else zoomTo(Math.min(CLICK_ZOOM, maxS), { x: e.clientX, y: e.clientY }, true);
    } else {
      hide();                                           // click outside the image
    }
  }

  function onKey(e) {
    if (e.target.closest && e.target.closest('a')) return;
    const k = e.key;
    if (k === '+' || k === '=') zoomTo(s * STEP, null, true);
    else if (k === '-' || k === '_') zoomTo(s / STEP, null, true);
    else if (k === '0') zoomTo(1, null, true);
    else if (s > 1.01 && k.indexOf('Arrow') === 0) {
      const d = 80;
      if (k === 'ArrowLeft') tx += d; else if (k === 'ArrowRight') tx -= d;
      else if (k === 'ArrowUp') ty += d; else ty -= d;
      clamp(); apply(true);
    } else return;
    e.preventDefault();
  }

  function show(thumb) {
    if (!dlg) build();
    opener = thumb;
    s = 1; tx = 0; ty = 0; base = null;
    img.style.transform = '';
    img.alt = thumb.alt || '';
    const full = thumb.getAttribute('data-full');
    const now = thumb.currentSrc || thumb.src;
    img.src = now;
    if (full && full !== now) {
      dlg.classList.add('is-loading');
      const pre = new Image();
      pre.onload = function () { if (dlg.open && opener === thumb) { img.src = full; base = null; } dlg.classList.remove('is-loading'); };
      pre.onerror = function () { dlg.classList.remove('is-loading'); };
      pre.src = full;
    }
    const fig = thumb.closest('figure');
    const cap = fig && fig.querySelector('figcaption');
    if (cap) caption.innerHTML = cap.innerHTML;
    else caption.textContent = thumb.closest('.blog-post__img') ? '' : (thumb.alt || '');

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    hint.textContent = fine ? 'Scroll or click to zoom · drag to move · Esc to close' : '';
    hint.classList.remove('is-gone');
    if (hinted) hint.classList.add('is-gone');
    else setTimeout(function () { hint.classList.add('is-gone'); }, 3500);
    hinted = true;

    document.documentElement.style.overflow = 'hidden';
    dlg.classList.remove('is-closing');
    dlg.showModal();
    apply(true);
  }

  function hide() {
    if (!dlg.open || dlg.classList.contains('is-closing')) return;
    const done = function (e) {
      if (e && e.target !== dlg) return;                // ignore animations of the children
      dlg.removeEventListener('animationend', done);
      dlg.classList.remove('is-closing', 'is-loading', 'is-zoomed-in');
      dlg.close();
      document.documentElement.style.overflow = '';
      img.removeAttribute('src');
      if (opener) opener.focus({ preventScroll: true });
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { done(); return; }
    dlg.addEventListener('animationend', done);
    dlg.classList.add('is-closing');
    setTimeout(function () { if (dlg.open) done(); }, 300);   // in case animationend does not fire
  }

  thumbs.forEach(function (t) {
    t.tabIndex = 0;
    t.setAttribute('role', 'button');
    t.setAttribute('aria-haspopup', 'dialog');
    t.setAttribute('aria-label', 'Enlarge image' + (t.alt ? ': ' + t.alt : ''));
    t.addEventListener('click', function () { show(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(t); }
    });
  });
})();

// ============================================================
//  Blog reading tools: progress bar, heading links, contents,
//  updates, previews of internal links
// ============================================================
(function () {
  const article = document.querySelector('.blog-post');
  const content = document.querySelector('.blog-post__content');
  if (!article || !content) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- small message at the bottom of the screen
  let toast, toastTimer;
  function say(html) {
    if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast); }
    toast.innerHTML = html;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 1600);
  }
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (ok, ko) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let done = false; try { done = document.execCommand('copy'); } catch (e) {}
      ta.remove(); done ? ok() : ko();
    });
  }

  // --- reading progress
  const bar = document.querySelector('.read-progress__bar');
  if (bar) {
    let ticking = false, doneShown = false;
    const update = function () {
      ticking = false;
      const r = content.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const p = total > 0 ? Math.min(1, Math.max(0, (-r.top + window.innerHeight * 0.25) / total)) : 1;
      bar.style.transform = 'scaleX(' + p + ')';
      // easter egg: a small check when the end is reached (once per visit of the page)
      if (p >= 0.995 && !doneShown && total > window.innerHeight) {
        doneShown = true;
        const box = bar.parentElement;
        box.classList.add('is-done');
        setTimeout(function () { box.classList.add('is-fading'); }, 1800);
      }
    };
    const ask = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', ask, { passive: true });
    window.addEventListener('resize', ask);
    update();
  }

  // --- jump to a section or update, and copy its address
  function flash(target) {
    if (!target.classList.contains('post-update')) return;
    target.classList.remove('is-flash'); void target.offsetWidth; target.classList.add('is-flash');
    setTimeout(function () { target.classList.remove('is-flash'); }, 1600);
  }
  function linkTo(id, doCopy) {
    const target = document.getElementById(id);
    if (!target) return;
    const url = location.href.split('#')[0] + '#' + id;
    history.replaceState(null, '', '#' + id);
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    flash(target);
    if (doCopy) copy(url).then(function () { say('<i class="fa-solid fa-link" aria-hidden="true"></i>Link copied'); }, function () {});
  }
  content.addEventListener('click', function (e) {
    const a = e.target.closest('.heading-anchor, .post-update__date');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    linkTo(a.getAttribute('href').slice(1), true);
  });
  document.querySelectorAll('.blog-post__updated a').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); linkTo(a.getAttribute('href').slice(1), false); });
  });
  if (location.hash) {
    const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (t) setTimeout(function () { flash(t); }, 300);
  }

  // --- contents: open/close on narrow screens, current section highlighted
  const toc = document.querySelector('.post-toc');
  if (toc) {
    const btn = toc.querySelector('.post-toc__toggle');
    toc.classList.add('is-collapsible');
    btn.addEventListener('click', function () {
      const open = toc.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    const links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        linkTo(decodeURIComponent(a.getAttribute('href').slice(1)), false);
      });
    });
    const targets = links.map(function (a) { return document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))); });
    let spyTick = false;
    const spy = function () {
      spyTick = false;
      const line = window.innerHeight * 0.3;
      let current = -1;
      targets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top <= line) current = i; });
      links.forEach(function (a, i) { a.classList.toggle('is-active', i === current); });
    };
    window.addEventListener('scroll', function () { if (!spyTick) { spyTick = true; requestAnimationFrame(spy); } }, { passive: true });
    spy();
  }

  // --- previews of internal links (mouse only)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || !window.fetch) return;
  let data = null, card = null, showTimer = 0, hideTimer = 0, current = null, byKeyboard = false;
  function load() {
    if (!data) data = fetch('/previews.json').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
    return data;
  }
  function keyOf(a) {
    let u;
    try { u = new URL(a.href, location.href); } catch (e) { return null; }
    if (u.origin !== location.origin) return null;
    if (/\.[a-z0-9]{2,5}$/i.test(u.pathname)) return null;              // files (PDF, images...)
    let p = u.pathname; if (!p.endsWith('/')) p += '/';
    if (p === location.pathname || p === location.pathname + '/') return null;  // same page
    return p;
  }
  function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }
  // anchor the card to the line of the link under the mouse (a link can wrap on two lines)
  function place(a, y) {
    const rects = Array.prototype.slice.call(a.getClientRects());
    let r = rects[0] || a.getBoundingClientRect();
    rects.forEach(function (q) { if (y >= q.top - 2 && y <= q.bottom + 2) r = q; });
    const w = card.offsetWidth, h = card.offsetHeight;
    let left = r.left + r.width / 2 - w / 2;
    left = Math.max(12, Math.min(window.innerWidth - w - 12, left));
    let top = r.bottom + 10;
    if (top + h > window.innerHeight - 10) top = r.top - h - 10;
    card.style.left = (left + window.scrollX) + 'px';
    card.style.top = (top + window.scrollY) + 'px';
  }
  function show(a, info, y) {
    if (!card) {
      card = document.createElement('div'); card.className = 'link-preview'; card.setAttribute('aria-hidden', 'true');
      // the card stays open while the mouse is on it (WCAG 1.4.13)
      card.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
      card.addEventListener('mouseleave', hide);
      document.body.appendChild(card);
    }
    card.innerHTML =
      (info.img ? '<img class="link-preview__img" src="' + esc(info.img) + '" alt="">' : '') +
      '<div class="link-preview__body">' +
        '<div class="link-preview__type">' + esc(info.type) + '</div>' +
        '<div class="link-preview__title">' + esc(info.title) + '</div>' +
        (info.date ? '<div class="link-preview__date">' + esc(info.date) + '</div>' : '') +
        (info.text ? '<p class="link-preview__text">' + esc(info.text) + '</p>' : '') +
      '</div>';
    place(a, y);
    requestAnimationFrame(function () { card.classList.add('is-visible'); });
  }
  function hide() {
    clearTimeout(showTimer); clearTimeout(hideTimer); current = null;
    if (card) card.classList.remove('is-visible');
  }
  function hideSoon() { clearTimeout(showTimer); clearTimeout(hideTimer); hideTimer = setTimeout(hide, 180); }
  // Esc closes the card without moving the mouse or the focus (WCAG 1.4.13)
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && card && card.classList.contains('is-visible')) hide(); });
  article.querySelectorAll('.blog-post__content a[href], .related-talk a[href]').forEach(function (a) {
    if (a.closest('.heading-anchor, .post-update__head, .post-toc')) return;
    const key = keyOf(a);
    if (!key) return;
    let y = 0;
    a.addEventListener('mousemove', function (e) { y = e.clientY; });
    a.addEventListener('mouseenter', function (e) {
      current = a; byKeyboard = false; y = e.clientY; load();
      clearTimeout(showTimer); clearTimeout(hideTimer);
      showTimer = setTimeout(function () {
        load().then(function (d) { if (current === a && d[key]) show(a, d[key], y); });
      }, 300);
    });
    a.addEventListener('mouseleave', hideSoon);
    a.addEventListener('focus', function () {
      current = a; byKeyboard = true;
      // wait for the browser to scroll the link into view, then measure it
      setTimeout(function () {
        if (current !== a) return;
        const r = a.getClientRects()[0]; y = r ? r.top + 1 : 0;
        load().then(function (d) { if (current === a && d[key]) show(a, d[key], y); });
      }, 60);
    });
    a.addEventListener('blur', hide);
    a.addEventListener('click', hide);
  });
  // the card scrolls with the page; after a scroll the mouse is no longer on the link, so close it
  // (not when it was opened from the keyboard: focusing a link scrolls the page itself)
  window.addEventListener('scroll', function () { if (!byKeyboard && card && card.classList.contains('is-visible')) hide(); }, { passive: true });
})();

// ============================================================
//  Home: show the name of the profile icon under the mouse (or keyboard focus)
// ============================================================
(function () {
  const list = document.querySelector('.network-icon');
  const line = document.querySelector('.network-label');
  if (!list || !line) return;
  const text = line.querySelector('.network-label__text');
  const rest = text.textContent;
  let current = rest, timer = 0, back = 0;
  function set(label, active) {
    clearTimeout(back);
    line.classList.toggle('is-active', active);
    if (label === current) return;
    current = label;
    clearTimeout(timer);
    text.classList.add('is-leaving');
    timer = setTimeout(function () {
      text.textContent = label;
      text.classList.remove('is-leaving');
      text.classList.add('is-entering');
      void text.offsetWidth;                       // restart from below
      text.classList.remove('is-entering');
    }, 140);
  }
  list.querySelectorAll('a[data-label]').forEach(function (a) {
    const show = function () { set(a.dataset.label, true); };
    a.addEventListener('mouseenter', show);
    a.addEventListener('focus', show);
  });
  const reset = function () { back = setTimeout(function () { set(rest, false); }, 250); };
  list.addEventListener('mouseleave', reset);
  list.addEventListener('focusout', function (e) { if (!list.contains(e.relatedTarget)) reset(); });
})();

// ============================================================
//  Small animations (see the end of main.css). Nothing runs with "reduce motion".
// ============================================================
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('anim');

  // 1. accent lines under the home section titles, and 4. margin notes on wide screens:
  //    shown once, when they come into view
  const once = function (els, cls, margin) {
    if (!els.length) return;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add(cls); io.unobserve(e.target); } });
    }, { rootMargin: margin });
    els.forEach(function (el) { io.observe(el); });
  };
  once(document.querySelectorAll('.section-header hr'), 'is-drawn', '0px 0px -12% 0px');
  once(document.querySelectorAll('.blog-post__content .sidenote'), 'is-seen', '0px 0px -8% 0px');

  // 5. timeline of the updates: the line fills as the reading line (60% of the screen) goes down
  const updates = Array.prototype.slice.call(document.querySelectorAll('.post-update'));
  if (updates.length) {
    let tick = false;
    const draw = function () {
      tick = false;
      const line = window.innerHeight * 0.6;
      updates.forEach(function (u) {
        const r = u.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (line - r.top) / r.height));
        u.style.setProperty('--p', p.toFixed(3));
        const dot = u.querySelector('.post-update__dot');
        if (dot) u.classList.toggle('is-reached', dot.getBoundingClientRect().top < line);
      });
    };
    const ask = function () { if (!tick) { tick = true; requestAnimationFrame(draw); } };
    window.addEventListener('scroll', ask, { passive: true });
    window.addEventListener('resize', ask);
    draw();
  }
})();

// ============================================================
//  Easter egg: the bin of the blog counter opens on the posts that did not make it
// ============================================================
(function () {
  const btn = document.querySelector('.blog-bin .blog-status__marks');
  const list = document.getElementById('blog-bin-list');
  if (!btn || !list) return;
  const set = function (open) { list.hidden = !open; btn.setAttribute('aria-expanded', open ? 'true' : 'false'); };
  btn.addEventListener('click', function (e) { e.stopPropagation(); set(list.hidden); });
  document.addEventListener('click', function (e) { if (!list.hidden && !list.contains(e.target)) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !list.hidden) { set(false); btn.focus(); } });
})();

// ============================================================
//  Easter egg: a note for whoever opens the developer console
// ============================================================
(function () {
  if (!window.console || !console.log) return;
  const a = 'color:#7c9bdf;font-family:monospace;line-height:1.25';
  const b = 'color:inherit;font-family:inherit;font-weight:600;font-size:13px';
  const c = 'color:inherit;font-family:inherit';
  console.log(
    '%c' +
    '    ___________\n' +
    '   |  _  _  _  |      %cHi, curious one! 👋%c\n' +
    '%c   | |_||_||_| |\n' +
    '   |  _  _  _  |      %cYou opened the console: you are clearly my kind of person.\n' +
    '%c   | |_||_||_| |      %cThis building passed its safety check, the site is handmade with\n' +
    '%c   |  _  _  _  |      %cHugo, a lot of CSS and some help from Claude.\n' +
    '%c   | |_||_|| | |\n' +
    '  _|_______|_|_|_     %cSource code   github.com/AntonioSberna/PersonalWebPageSource\n' +
    '%c  ///////////////     %cFor agents    /llms.txt\n' +
    '%c                      %cFor humans    /humans.txt\n\n' +
    '%c  P.S. The theme button has a secret. Try being impatient with it.',
    a, b, c, a, c, a, c, a, c, a, c, a, c, a, c, c);
})();
