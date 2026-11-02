/* OrroProto — núcleo: registro de pantallas, router por hash, delegación de clics, tema/idioma, helpers UI. */
(function () {
  var KEY = 'orrofi-proto', D = window.OrroData;
  var st = { theme: 'dark', lang: 'es', flags: Object.assign({}, D.flags) };
  try {
    var s = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (s.theme) st.theme = s.theme; if (s.lang) st.lang = s.lang; if (s.flags) Object.assign(st.flags, s.flags);
  } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  /* inicio reciente por SMS: caduca a los 5 min (demo) */
  var FRESH_MS = 5 * 60 * 1000;
  if (st.flags.freshSms && !st.freshAt) st.freshAt = Date.now();
  function expireSms() { if (st.flags.freshSms && Date.now() - (st.freshAt || 0) > FRESH_MS) { st.flags.freshSms = false; save(); } }
  /* estado de sesión (consentimientos, avisos): sessionStorage o memoria */
  var SK = KEY + '-sess', SS = {};
  try { SS = JSON.parse(sessionStorage.getItem(SK) || '{}') || {}; } catch (e) { SS = {}; }
  function sess(k, def) { return k in SS ? !!SS[k] : !!def; }
  function setSess(k, v) { SS[k] = v ? 1 : 0; try { sessionStorage.setItem(SK, JSON.stringify(SS)); } catch (e) {} }

  var S = {}, stack = [], current = null, redirect = null, hops = 0, timers = [];
  var PLANNED = {
    B: 'net-entry net-00 net-sys-localnet net-00b net-00c net-0a net-0b net-0c net-0d net-0e net-sh-mac net-0f net-0g net-0h net-1 net-1b net-1c net-1d net-1e net-2 net-3 net-3b net-4 net-4b net-4c net-4d net-5 net-6 net-7 net-7-confirm net-8 net-sh-bio net-9 net-9b net-sh-delcopy net-12 net-12b'.split(' '),
    C: 'fam-list fam-13a fam-13a2 fam-13b fam-13c fam-13d fam-13e fam-14a fam-14b fam-15 fam-15b fam-15c del-entry del-16a0 del-16a del-16b del-16b2 del-16c del-16d del-16d2 del-16e del-16e2 del-16f del-16g del-16h del-owner del-sh-bio rst-entry rst-17m rst-17a rst-17b rst-17c rst-17d rst-17e rst-17f rst-17g rst-17h rst-17i rst-17j rst-17k rst-17l rst-sh-bio rst-sh-bio-c rst-sms rst-owner rp-18a rp-18b'.split(' ')
  };
  var TABS = [['home', 'Inicio', 'Home', 'home'], ['fiber', 'Servicios', 'Services', 'grid'], ['manager', 'Mi gestor', 'My manager', 'spark'], ['billing', 'Facturas', 'Bills', 'doc'], ['profile', 'Perfil', 'Profile', 'person']];
  var TABKEY = { home: 'home', fiber: 'fiber', manager: 'manager', billing: 'billing', profile: 'profile' };

  /* ---------- helpers UI ---------- */
  var P = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
    spark: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/><circle cx="12" cy="12" r="3"/>',
    doc: '<path d="M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M8.5 13h7M8.5 17h5"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6"/>',
    wifi: '<path d="M2 8.8a15 15 0 0 1 20 0M5.5 12.4a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19.5" r="1.1" fill="currentColor" stroke="none"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="3"/><path d="M10.5 18.5h3"/>',
    ant: '<path d="M12 11v10M8.5 21h7M7 4.5a7 7 0 0 0 0 10M17 4.5a7 7 0 0 1 0 10M9.5 7a3.5 3.5 0 0 0 0 5M14.5 7a3.5 3.5 0 0 1 0 5"/><circle cx="12" cy="9.5" r="1.2"/>',
    bolt: '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z"/>',
    chev: '<path d="m9 5 7 7-7 7"/>', back: '<path d="m15 5-7 7 7 7"/>',
    bell: '<path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 1.5h-15zM10 21h4"/>',
    send: '<path d="M12 19V5M6 11l6-6 6 6"/>', mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    pin: '<path d="M12 21.5s-7-6.2-7-11.5a7 7 0 1 1 14 0c0 5.3-7 11.5-7 11.5z"/><circle cx="12" cy="10" r="2.5"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5l-9 9a2.1 2.1 0 0 1-3-3l9-9a4 4 0 0 1-2-2z"/>',
    dl: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>', card: '<rect x="2.5" y="5.5" width="19" height="13" rx="3"/><path d="M2.5 10h19"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
    shield: '<path d="M12 3 4.5 6v6c0 4.5 3.2 8 7.5 9 4.3-1 7.5-4.5 7.5-9V6z"/><path d="m9 12 2 2 4-4"/>',
    dev: '<rect x="2.5" y="4.5" width="13" height="10" rx="2"/><path d="M5.5 18.5h7M18 8h3.5v12H18z"/>',
    bubble: '<path d="M20 12c0 4.4-3.6 8-8 8-1.3 0-2.6-.3-3.7-.9L4 20l1-4.1A8 8 0 1 1 20 12z"/>',
    gauge: '<path d="M3.5 16a8.5 8.5 0 1 1 17 0"/><path d="m12 16 4-5"/>',
    ticket: '<path d="M3 8a2 2 0 0 0 0 4v0a2 2 0 0 1 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 1 0-4V6H3z"/><path d="M14 6v12" stroke-dasharray="2 2"/>',
    face: '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 9.5v1.5M15 9.5v1.5M9 15c1.7 1.4 4.3 1.4 6 0M12 9.5v3"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
    off: '<path d="M3 3l18 18M8.5 8.5A10 10 0 0 0 2 8.8M5.5 12.4a10 10 0 0 1 4-2.4M9 16a5 5 0 0 1 3-1"/><circle cx="12" cy="19.5" r="1.1" fill="currentColor" stroke="none"/>',
    alert: '<path d="M12 4 2.5 20h19z"/><path d="M12 10v4.5M12 17.5v.2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.2"/>', eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>'
  };
  function ic(n, c) { return '<svg class="ic ' + (c || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (P[n] || '') + '</svg>'; }
  function esc(v) { return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  function da(o) {
    return Object.keys(o || {}).map(function (k) { var v = o[k]; return v === true ? ' data-' + k : ' data-' + k + '="' + esc(v) + '"'; }).join('');
  }
  function top(title, o) {
    o = o || {};
    var l = o.back === false ? '<span class="ibtn"></span>' : '<button class="ibtn" data-back aria-label="' + (st.lang === 'en' ? 'Back' : 'Atrás') + '">' + ic('back') + '</button>';
    return '<div class="nb">' + l + '<span class="nt">' + title + '</span><span class="rt">' + (o.right || '<span class="ibtn"></span>') + '</span></div>';
  }
  function brand(right) {
    return '<div class="nb"><span class="wm"><i></i>OrroFi</span><span class="row" style="gap:0">' + (right || '') + '<button class="ibtn" data-go="notif" aria-label="' + (st.lang === 'en' ? 'Notifications' : 'Avisos') + '">' + ic('bell') + '<span class="dotb"></span></button></span></div>';
  }
  function li(o) {
    var a = {}; if (o.go) a.go = o.go; if (o.toast) a.toast = o.toast; if (o.flag) a.flag = o.flag;
    var act = !!(o.go || o.toast || o.flag), tag = act ? 'button' : 'div';
    return '<' + tag + ' class="li' + (act ? ' tap' : '') + '"' + (act ? da(a) : ' style="cursor:default"') + '>' + (o.i ? '<span class="badge">' + ic(o.i, 's') + '</span>' : '') +
      '<span class="t"><b>' + o.t + '</b>' + (o.s ? '<small>' + o.s + '</small>' : '') + '</span>' + (o.v ? '<span class="v">' + o.v + '</span>' : '') + ((o.nochev || !act) ? '' : ic('chev', 's chev')) + '</' + tag + '>';
  }
  function btn(label, attrs, cls, raw) { return '<button class="btn ' + (cls || '') + '"' + da(attrs) + (raw ? ' ' + raw : '') + '>' + label + '</button>'; }
  function state(icon, title, text, btnHtml, kind) {
    return '<div class="sv ' + (kind || '') + '"><div class="bx">' + ic(icon, 'xl') + '</div><div class="h2">' + title + '</div><p>' + text + '</p>' + (btnHtml || '') + '</div>';
  }
  function sw(on, attrs) {
    var a = Object.assign({ tog: true }, attrs), lb = a.label; delete a.label;
    return '<button class="swh" role="switch" aria-checked="' + !!on + '"' + (lb ? ' aria-label="' + esc(lb) + '"' : '') + da(a) + '><span class="sw ' + (on ? 'on' : '') + '"></span></button>';
  }
  var ui = { ic: ic, da: da, top: top, brand: brand, li: li, btn: btn, state: state, sw: sw, esc: esc };

  /* ---------- registro ---------- */
  function register(id, def) { def.id = id; S[id] = def; }
  register('wip', {
    group: 'A', title: ['En construcción', 'Under construction'], tab: null, parent: null,
    render: function (ctx) {
      return ui.top('') + ui.state('wrench', ctx.t('En construcción', 'Under construction'),
        ctx.t('Esta pantalla se está diseñando.', 'This screen is being designed.') + '<br><span class="hud">' + esc(ctx.id) + '</span>',
        ui.btn(ctx.t('Volver', 'Back'), { back: true }, 'g'));
    }
  });

  /* ---------- contexto y dibujo ---------- */
  function mkctx(id, noGo, flags, onGo) {
    return {
      id: id, lang: st.lang, data: D, flags: flags || st.flags,
      t: function (es, en) { return st.lang === 'en' ? en : es; },
      go: function (to) { if (onGo) onGo(to); else if (!noGo) redirect = to; },
      toast: toast
    };
  }
  function resolveTheme() {
    var t = st.theme;
    if (t === 'system') t = window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
  }
  function timeStr() { return st.lang === 'en' ? '9:41' : '9:41'; }
  function draw(id) {
    timers.forEach(clearInterval); timers = [];
    expireSms();
    var def = S[id] || S.wip, ctx, html, tab = def.tab, host = null;
    if (def.owner && !st.flags.isOwner && ++hops < 6) return replace(def.owner);
    ctx = mkctx(id, false);
    redirect = null;
    html = def.render(ctx);
    if (redirect) {
      var r = redirect; redirect = null;
      if (++hops < 6) return replace(r);
      hops = 0;
    }
    hops = 0;
    var main;
    if (def.sheet) {
      host = S[def.parent] || S.wip; tab = host.tab;
      var hh = host.render(mkctx(def.parent, true));
      main = '<div class="sc" aria-hidden="true">' + hh + '</div><div class="scrim" data-close></div><div class="sheet" role="dialog" aria-modal="true"><i class="grab"></i>' + html + '</div>';
    } else if (def.lock) {
      main = '<div class="lockwrap"><div class="lk-time">9:41</div><div class="lk-date">' + (st.lang === 'en' ? 'Monday, 2 November' : 'lunes, 2 de noviembre') + '</div>' + html + '</div>';
      tab = null;
    } else {
      main = '<div class="sc">' + html + '</div>';
    }
    var tabs = '';
    if (tab && !def.lock) {
      tabs = '<nav class="tabs" aria-label="Tabs">' + TABS.map(function (x) {
        return '<button data-go="' + x[0] + '" data-root aria-label="' + (st.lang === 'en' ? x[2] : x[1]) + '"' + (x[0] === tab ? ' aria-current="page"' : '') + '>' + ic(x[3]) + '<span>' + (st.lang === 'en' ? x[2] : x[1]) + '</span></button>';
      }).join('') + '</nav>';
    }
    document.getElementById('screen').innerHTML = '<div class="in' + (def.sheet && tabs ? ' shtabs' : '') + '" data-screen="' + esc(id) + '"><div class="sb"><span>' + timeStr() + '</span><i class="isl"></i><span>5G ▮▮▮</span></div>' + main + tabs + '<i class="hb"></i></div>';
    document.documentElement.lang = st.lang;
    syncChrome();
    if (def.after) def.after(ctx, function (fn, ms) { timers.push(setInterval(fn, ms)); });
  }
  function syncChrome() {
    var th = st.theme;
    [].forEach.call(document.querySelectorAll('[data-theme-set]'), function (b) { b.classList.toggle('on', b.dataset.themeSet === th); });
    [].forEach.call(document.querySelectorAll('[data-lang-set]'), function (b) { b.classList.toggle('on', b.dataset.langSet === st.lang); });
  }

  /* ---------- navegación ---------- */
  function show(id) { current = id; if (location.hash !== '#/' + id) location.hash = '#/' + id; draw(id); }
  function go(id, root) {
    if (!id) return; if (id === current) return draw(id);
    if (root) stack = [id]; else stack.push(id);
    show(id);
  }
  function replace(id) { stack[stack.length ? stack.length - 1 : 0] = id; show(id); }
  function back() {
    if (stack.length > 1) { stack.pop(); show(stack[stack.length - 1]); return; }
    var p = (S[current] || {}).parent; if (p) { stack = [p]; show(p); return; }
    var fb = current === 'all' ? 'launch' : 'all'; stack = [fb]; show(fb);
  }
  function close() {
    var p = (S[current] || {}).parent; if (!p) return back();
    if (stack.length > 1 && stack[stack.length - 2] === p) back(); else replace(p);
  }
  function hashId() { return (location.hash || '').replace(/^#\/?/, ''); }

  /* ---------- toast ---------- */
  var tt;
  function toast(msg) {
    var el = document.getElementById('toast'); el.textContent = msg; el.classList.add('on');
    clearTimeout(tt); tt = setTimeout(function () { el.classList.remove('on'); }, 2400);
  }

  /* ---------- eventos ---------- */
  var SEL = '[data-go],[data-back],[data-close],[data-toast],[data-flag],[data-flagset],[data-tog],[data-pick],[data-reveal],[data-theme-set],[data-lang-set]';
  function setFlag(name, val) { st.flags[name] = val; if (name === 'freshSms') st.freshAt = val ? Date.now() : 0; save(); }
  document.addEventListener('click', function (e) {
    var el = e.target.closest(SEL); if (!el || el.disabled) return;
    var d = el.dataset, redraw = false, nav = null;
    if (d.themeSet) { st.theme = d.themeSet; save(); resolveTheme(); draw(current); return; }
    if (d.langSet) { st.lang = d.langSet; save(); draw(current); return; }
    if (d.tog !== undefined) { var sw = el.querySelector('.sw') || el; var on = !sw.classList.contains('on'); sw.classList.toggle('on', on); el.setAttribute('aria-checked', on); if (d.sess) setSess(d.sess, on); }
    if (d.pick !== undefined) {
      var root = el.closest('[data-pickroot]') || document, seg = el.parentNode;
      [].forEach.call(seg.children, function (b) { b.classList.toggle('on', b === el); });
      [].forEach.call(root.querySelectorAll('[data-show]'), function (x) { x.hidden = !(d.pick === 'all' || x.dataset.show.split(' ').indexOf(d.pick) >= 0); });
    }
    if (d.reveal) {
      var tg = document.querySelector('[data-rv="' + d.reveal + '"]');
      if (tg) { tg.hidden = false; var c = tg.querySelector('.cd30'), n = 30; if (c) c.textContent = n; var iv = setInterval(function () { n--; if (c) c.textContent = n; if (n <= 0) { tg.hidden = true; clearInterval(iv); } }, 1000); timers.push(iv); }
    }
    if (d.flag) {
      var cur = st.flags[d.flag], opts = D.flagOptions[d.flag];
      setFlag(d.flag, opts ? opts[(opts.indexOf(cur) + 1) % opts.length] : !cur); redraw = true;
    }
    if (d.flagset) { var kv = d.flagset.split(':'); setFlag(kv[0], kv[1] === '1' || kv[1] === 'true'); }
    if (d.toast) toast(d.toast);
    if (d.go) nav = function () { go(d.go, d.root !== undefined); };
    else if (d.back !== undefined) nav = back;
    else if (d.close !== undefined) nav = close;
    if (nav) nav(); else if (redraw) { var sc = document.querySelector('.sc'), y = sc ? sc.scrollTop : 0; draw(current); sc = document.querySelector('.sc'); if (sc) sc.scrollTop = y; }
  });
  document.addEventListener('change', function (e) {
    var el = e.target; if (el.matches && el.matches('input[data-sess]')) setSess(el.dataset.sess, el.checked);
    if (!el.matches || !el.matches('input[data-gate]')) return;
    var b = el.closest('.gate').querySelector('.gate-btn'); if (b) { b.disabled = !el.checked; b.setAttribute('aria-disabled', !el.checked); }
  });

  /* ---------- check ---------- */
  function check() {
    var refs = {}, errors = [], known = {};
    Object.keys(S).forEach(function (k) { known[k] = 1; });
    PLANNED.B.concat(PLANNED.C).forEach(function (k) { known[k] = 1; });
    var variants = [{}];
    Object.keys(D.flags).forEach(function (k) {
      if (typeof D.flags[k] === 'boolean') { var o = {}; o[k] = !st.flags[k]; variants.push(o); }
    });
    D.flagOptions.localNet.forEach(function (v) { variants.push({ localNet: v }); });
    Object.keys(S).forEach(function (id) {
      variants.forEach(function (v) {
        ['es', 'en'].forEach(function (lang) {
          var fl = Object.assign({}, st.flags, v), old = st.lang; st.lang = lang;
          try {
            var ctx = mkctx(id, false, fl, function (to) { (refs[to] = refs[to] || {})[id] = 1; });
            var html = S[id].render(ctx) || '', m, re = /data-go="([^"]+)"/g;
            while ((m = re.exec(html))) (refs[m[1]] = refs[m[1]] || {})[id] = 1;
            if (/gho/i.test(html.replace(/ghofi\.com/gi, ''))) errors.push(id + ': texto «Gho»');
          } catch (err) { errors.push(id + ': ' + err.message); }
          st.lang = old;
        });
      });
    });
    var bad = Object.keys(refs).filter(function (k) { return !known[k]; }).map(function (k) { return k + '  ← ' + Object.keys(refs[k]).join(', '); });
    var out = bad.concat(errors);
    console.log(out.length ? 'OrroProto.check(): problemas\n' + out.join('\n') : 'OrroProto.check(): OK (sin ids huérfanos)');
    return out;
  }

  /* ---------- arranque ---------- */
  function fit() {
    var h = innerHeight - 70, sc = Math.min(1, h / 874), pw = document.getElementById('pw'), ph = document.getElementById('phone');
    ph.style.transform = 'translateX(-50%) scale(' + sc + ')'; pw.style.width = 393 * sc + 'px'; pw.style.height = 852 * sc + 'px';
    pw.style.marginTop = '6px';
  }
  function start() {
    resolveTheme(); fit(); addEventListener('resize', fit);
    var id = hashId() || 'launch'; stack = [id]; show(id);
    addEventListener('hashchange', function () { var h = hashId(); if (h && h !== current) go(h); });
  }
  function listing() { return { screens: S, planned: PLANNED }; }

  window.OrroProto = { register: register, start: start, check: check, ui: ui, state: st, listing: listing, setFlag: setFlag, go: go, sess: sess, setSess: setSess };
})();
