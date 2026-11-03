/* screens-a.js — grupo A: lanzamiento, login, onboarding, Inicio, Servicios, Facturas, Mi gestor, Perfil, Privacidad. */
(function () {
  var O = OrroProto, U = O.ui, ic = U.ic, li = U.li, btn = U.btn, top = U.top, brand = U.brand, state = U.state, sw = U.sw;
  function R(id, title, tab, parent, render, x) { O.register(id, Object.assign({ group: 'A', title: title, tab: tab, parent: parent, sheet: false, lock: false, render: render }, x || {})); }
  function H(sheetTitle) { return '<div class="h2">' + sheetTitle + '</div>'; }
  var PH = '[TELÉFONO GRATUITO]', RESP = '[RESPONSABLE]';
  /* Primer capa «Protección de datos — información básica» (texto Legal único; también lo usa net-12) */
  U.dp = function (t) {
    return '<div class="hud mb8">' + t('Protección de datos — información básica', 'Data protection — basic information') + '</div><div class="sec2 b-dp">' +
      '<p><b>' + t('Responsable:', 'Controller:') + '</b> ' + RESP + ' (OrroFi).</p>' +
      '<p><b>' + t('Finalidad:', 'Purpose:') + '</b> ' + t('gestionar tu solicitud del servicio, contactarte sobre ella y, si contratas, prestarte el servicio y la atención al cliente.', 'to handle your service application, contact you about it and, if you sign up, provide the service and customer support.') + '</p>' +
      '<p><b>' + t('Legitimación:', 'Legal basis:') + '</b> ' + t('ejecución de medidas precontractuales y del contrato que solicitas (art. 6.1.b RGPD).', 'pre-contractual steps and performance of the contract you request (Art. 6(1)(b) GDPR).') + '</p>' +
      '<p><b>' + t('Destinatarios:', 'Recipients:') + '</b> ' + t('[OPERADOR SOCIO / ninguno]; proveedores tecnológicos que actúan como encargados del tratamiento. No se ceden datos salvo obligación legal.', '[OPERADOR SOCIO / ninguno]; technology providers acting as data processors. No data is disclosed unless required by law.') + '</p>' +
      '<p><b>' + t('Derechos:', 'Your rights:') + '</b> ' + t('acceso, rectificación, supresión, oposición, limitación y portabilidad, escribiendo a [EMAIL PRIVACIDAD]. También puedes reclamar ante la AEPD (aepd.es).', 'access, rectification, erasure, objection, restriction and portability, by writing to [EMAIL PRIVACIDAD]. You may also complain to the AEPD (aepd.es).') + '</p>' +
      '<p><b>' + t('Más información:', 'More information:') + '</b> [URL POLÍTICA]</p></div>';
  };
  /* estado demo local (temporizadores, pedido); los oyentes van en captura para ejecutarse antes del núcleo */
  var ots = { t0: 0, seen: 0 }, ord = { plan: 1, slot: 0 };
  function fresh() { return ots.seen && Date.now() - ots.seen < 1500; }
  function otsLeft() { return fresh() ? Math.max(0, 60 - Math.floor((Date.now() - ots.t0) / 1000)) : 60; }
  function mmss(n) { return '0:' + (n < 10 ? '0' : '') + n; }
  document.addEventListener('click', function (e) {
    var r = e.target.closest && e.target.closest('[data-resend]');
    if (r && !r.disabled) { ots.t0 = Date.now(); ots.seen = Date.now(); setTimeout(otsPaint, 0); return; }
    var o = e.target.closest && e.target.closest('[data-ord]');
    if (o) { var kv = o.dataset.ord.split(':'); ord[kv[0]] = +kv[1]; }
  }, true);
  function otsPaint() {
    var l = otsLeft(), cp = document.getElementById('rs-cap'), b = document.querySelector('[data-resend]');
    if (cp) cp.textContent = l > 0 ? cp.dataset.pre + ' ' + mmss(Math.min(59, l)) : '\u00a0';
    if (b) { b.disabled = l > 0; b.setAttribute('aria-disabled', l > 0); }
  }

  /* ---------- servicio ---------- */
  R('all', ['Mapa del prototipo', 'Prototype map'], null, null, function (c) {
    var L = O.listing(), S = L.screens, t = c.t;
    function ids(list) {
      return '<div class="ids">' + list.map(function (id) { var reg = S[id]; return '<button data-go="' + id + '"' + (reg && reg.id !== 'wip' ? '' : ' class="todo" title="en construcción"') + '>' + id + '</button>'; }).join('') + '</div>';
    }
    var A = Object.keys(S).filter(function (k) { return S[k].group === 'A' && k !== 'all'; });
    var fl = Object.keys(c.flags).map(function (k) {
      return '<div class="fl"><code>' + k + '</code><button class="chip" data-flag="' + k + '">' + String(c.flags[k]) + '</button></div>';
    }).join('');
    return '<div class="map">' + top(t('Mapa', 'Map')) +
      '<div class="note"><span>' + ic('info', 's') + '</span><span>' + t('Prototipo de diseño, datos ficticios, sin publicar. Pantalla de servicio, no es parte del producto.', 'Design prototype, fictitious data, unpublished. Service screen, not part of the product.') + '</span></div>' +
      btn(t('Empezar', 'Start'), { go: 'launch' }) +
      '<h4>' + t('Tema', 'Theme') + ' · ' + t('Idioma', 'Language') + '</h4><div class="seg"><button data-theme-set="dark">HUD</button><button data-theme-set="light">Tech</button></div><div class="seg"><button data-lang-set="es">ES</button><button data-lang-set="en">EN</button></div>' +
      '<h4>' + t('Demo-flags', 'Demo flags') + '</h4><div class="grp" style="padding:4px 12px">' + fl + '</div>' +
      '<div class="chips mt8"><button class="chip" data-flagset="freshSms:0" data-toast="' + t('Inicio reciente caducado', 'Recent sign-in expired') + '">' + t('Caducar inicio reciente', 'Expire recent sign-in') + '</button></div>' +
      '<h4>A · ' + A.length + '</h4>' + ids(A) + '<h4>B · Mi red</h4>' + ids(L.planned.B) + '<h4>C · ' + t('Familia / borrado / reinicio', 'Family / delete / reset') + '</h4>' + ids(L.planned.C) + '</div>';
  });

  R('launch', ['Primer arranque', 'Launch'], null, null, function (c) {
    var f = c.flags;
    c.go(f.session ? (f.faceid ? 'sh-faceid-open' : 'home') : 'login');
    return '<div style="height:640px;display:grid;place-items:center"><span class="wm" style="font-size:24px"><i style="width:12px;height:12px"></i>OrroFi</span></div>';
  });

  R('sh-faceid-open', ['Face ID al abrir', 'Face ID at launch'], null, 'launch', function (c) {
    var t = c.t;
    return '<div class="tc" style="padding:8px 0 4px"><span class="badge" style="width:64px;height:64px;margin:0 auto 12px;border-radius:18px">' + ic('face', 'xl') + '</span></div>' + H(t('Desbloquea OrroFi', 'Unlock OrroFi')) +
      '<p class="sec2 mb8">' + t('Usa Face ID para entrar en tu cuenta.', 'Use Face ID to open your account.') + '</p>' +
      btn(t('Continuar con Face ID', 'Continue with Face ID'), { go: 'home' }) + btn(t('Usar código', 'Use passcode'), { go: 'home' }, 'g');
  }, { sheet: true });

  /* ---------- login ---------- */
  R('login', ['Entrar', 'Sign in'], null, null, function (c) {
    var t = c.t;
    return '<div class="nb"><span class="wm"><i></i>OrroFi</span></div>' +
      '<div class="lt" style="margin-top:24px">' + t('Tu fibra, móvil y gestor personal', 'Your fibre, mobile and personal manager') + '</div>' +
      '<div class="cap" style="margin:-6px 4px 24px"><span class="pill w">' + t('Provisional · lema sin decidir', 'Provisional · tagline undecided') + '</span></div>' +
      '<label class="fm"><span>' + t('Tu teléfono', 'Your phone') + '</span><div class="pre"><b>+34</b><input inputmode="tel" value="600 000 000" aria-label="' + t('Teléfono', 'Phone') + '"></div></label>' +
      btn(t('Enviar código', 'Send code'), { go: 'login-code' }) +
      '<button class="li tap" data-go="sh-nocode" style="justify-content:center;min-height:44px"><span class="cap">' + t('¿No recibes el código?', "Didn't get the code?") + '</span></button>' +
      '<div class="grp mt16">' + li({ i: 'pin', t: t('¿Aún no eres cliente?', 'Not a customer yet?'), s: t('Comprueba cobertura', 'Check coverage'), go: 'onb' }) + '</div>' +
      '<p class="dis">' + t('Nunca te pediremos DNI, IBAN, PIN ni PUK.', 'We will never ask for your ID, IBAN, PIN or PUK.') + '</p>';
  });

  function otp(bad, filled) {
    var d = ['4', '8', '2', '9', '1', '5'];
    return '<div class="otp ' + (bad ? 'bad' : '') + '" role="group" aria-label="Código">' + d.map(function (x, i) { return '<b class="' + (i < filled ? 'f' : '') + '">' + (i < filled ? x : '') + '</b>'; }).join('') + '</div>';
  }
  U.otp = otp;
  R('login-code', ['Código SMS', 'SMS code'], null, 'login', function (c) {
    var t = c.t, first = c.flags.firstLogin;
    return top(t('Código', 'Code')) +
      '<div class="h2 mt12">' + t('Introduce el código', 'Enter the code') + '</div>' +
      '<p class="sec2">' + t('Hemos enviado un SMS con un código de 6 dígitos a: +34 ··· ··· 412', 'We sent an SMS with a 6-digit code to: +34 ··· ··· 412') + '<br>' + t('Es válido durante 5 minutos.', 'Valid for 5 minutes.') + '</p>' +
      otp(false, 6) + '<div class="cap tc mb8" id="rs-cap" data-pre="' + t('Reenviar en', 'Resend in') + '">' + (otsLeft() > 0 ? t('Reenviar en', 'Resend in') + ' ' + mmss(Math.min(59, otsLeft())) : '&nbsp;') + '</div>' +
      btn(t('Verificar', 'Verify'), { go: first ? 'push-why' : 'home', flagset: 'session:1' }) +
      btn(t('Reenviar código', 'Resend code'), { toast: t('Código reenviado', 'Code resent'), resend: true }, 'g', otsLeft() > 0 ? 'disabled aria-disabled="true"' : 'aria-disabled="false"') +
      btn(t('Cambiar número', 'Change number'), { go: 'login' }, 'g') +
      '<div class="cap">DEMO</div><div class="chips mt8"><button class="chip" data-go="loginerr">' + t('Código incorrecto', 'Wrong code') + '</button><button class="chip" data-go="loginexp">' + t('Caducado', 'Expired') + '</button></div>';
  });
  O.listing().screens['login-code'].after = function (c, every) {
    if (!fresh()) ots.t0 = Date.now();
    ots.seen = Date.now(); otsPaint();
    every(function () { ots.seen = Date.now(); otsPaint(); }, 1000);
  };
  R('loginerr', ['Código incorrecto', 'Wrong code'], null, 'login-code', function (c) {
    var t = c.t;
    return top(t('Código', 'Code')) + '<div class="h2 mt12">' + t('Código incorrecto. Inténtalo de nuevo.', 'Wrong code. Try again.') + '</div>' + otp(true, 6) +
      '<div class="note e">' + ic('alert', 's') + '<span><span class="hud">' + t('INTENTO 3 DE 5', 'ATTEMPT 3 OF 5') + '</span><br>' + t('Te quedan 2 intentos', '2 attempts left') + '</span></div>' +
      btn(t('Reintentar', 'Try again'), { go: 'login-code' }) + '<div class="cap">DEMO</div><div class="chips mt8"><button class="chip" data-go="loginlock">' + t('5.º error', '5th error') + '</button></div>';
  });
  R('loginexp', ['Código caducado', 'Code expired'], null, 'login-code', function (c) {
    var t = c.t;
    return top(t('Código', 'Code')) + state('clock', t('El código ha caducado. Solicita uno nuevo.', 'The code has expired. Request a new one.'), t('Los códigos duran 5 minutos.', 'Codes last 5 minutes.'), btn(t('Reenviar código', 'Resend code'), { go: 'login-code' }), 'o');
  });
  R('loginlock', ['Acceso bloqueado', 'Access locked'], null, 'login', function (c) {
    var t = c.t;
    return top(t('Acceso', 'Access')) + state('lock', t('Acceso bloqueado 15 minutos', 'Access locked for 15 minutes'), t('Demasiados intentos. Por seguridad, espera antes de volver a intentarlo.', 'Too many attempts. For your security, wait before trying again.'),
      btn(t('Volver', 'Back'), { go: 'login' }, 'g') + btn(t('Hablar con una persona', 'Talk to a person'), { go: 'handoff' }), 'e');
  });
  R('sh-nocode', ['¿No recibes el código?', 'No code?'], null, 'login', function (c) {
    var t = c.t;
    return H(t('¿No recibes el código?', "Didn't get the code?")) + '<p class="sec2 mb8">' + t('Llámanos, de lunes a viernes de 9:00 a 20:00 (hora de Madrid).', 'Call us, Monday to Friday 9:00–20:00 (Madrid time).') + '</p>' +
      '<div class="note ok">' + ic('shield', 's') + '<span>' + t('Nunca te pediremos DNI, IBAN, PIN ni PUK.', 'We will never ask for your ID, IBAN, PIN or PUK.') + '</span></div>' +
      btn(t('Llamar', 'Call'), { toast: t('Llamando al ', 'Calling ') + PH }) + btn(t('Cerrar', 'Close'), { close: true }, 'g');
  }, { sheet: true });

  /* ---------- cliente nuevo ---------- */
  R('onb', ['Cliente nuevo', 'New customer'], null, 'login', function (c) {
    var t = c.t;
    return top(t('Mi gestor', 'My manager')) + '<div class="aiTag mb8">AI · ' + t('INTELIGENCIA ARTIFICIAL', 'ARTIFICIAL INTELLIGENCE') + '</div>' +
      '<div class="msg"><div class="b a">' + t('Hola, soy el gestor IA de OrroFi. Te ayudo a comprobar si hay cobertura en tu dirección. ¿Cuál es?', "Hi, I'm OrroFi's AI manager. I'll help you check whether there is coverage at your address. What is it?") + '</div><div class="b u">Carrer de Mar 12, Roses</div>' +
      '<div class="b a">' + t('¡Buenas noticias! Tu dirección tiene cobertura de fibra y de radio.', 'Good news! Your address has fibre and radio coverage.') + '</div></div>' +
      '<div class="cd mt16"><div class="row"><span class="badge">' + ic('check', 's') + '</span><div class="sp"><b>' + t('Cobertura disponible', 'Coverage available') + '</b><div class="cap">Fibra 1 Gb · Radio</div></div><span class="pill">OK</span></div></div>' +
      btn(t('Solicitar alta', 'Request sign-up'), { go: 'onb2' }) + btn(t('Probar otra dirección', 'Try another address'), { go: 'onbnone' }, 'g');
  });
  R('onbnone', ['Sin cobertura', 'No coverage'], null, 'onb', function (c) {
    var t = c.t;
    return top(t('Cobertura', 'Coverage')) + state('pin', t('Aún no llegamos a tu dirección', "We don't reach your address yet"), t('Puedes dejar tu solicitud y te avisaremos cuando haya cobertura.', "Leave your request and we'll tell you when coverage arrives."),
      btn(t('Dejar mi solicitud', 'Leave my request'), { go: 'onb2' }) + btn(t('Probar otra dirección', 'Try another address'), { go: 'onb' }, 'g'), 'o');
  });
  R('onb2', ['Solicitud', 'Request'], null, 'onb', function (c) {
    var t = c.t;
    function f(l, v) { return '<label class="fm"><span>' + l + '</span><input value="' + v + '"></label>'; }
    return top(t('Solicitud', 'Request')) + f(t('Nombre', 'Name'), 'Marta Ejemplo') + f(t('Teléfono', 'Phone'), '+34 600 000 000') + f(t('E-mail (opcional)', 'E-mail (optional)'), '') + f(t('Dirección', 'Address'), 'Carrer de Mar 12, Roses') +
      '<div class="chips mb8"><span class="chip">Fibra</span><span class="chip">Radio</span><span class="chip">' + t('Móvil', 'Mobile') + '</span></div>' +
      '<div class="cd">' + U.dp(t) + '</div>' +
      '<div class="gate"><label class="chk"><input type="checkbox" data-gate> <span>' + t('He leído la información sobre protección de datos.', 'I have read the data protection information.') + '</span></label>' +
      '<label class="chk"><input type="checkbox" data-sess="c-mkt"' + (O.sess('c-mkt', false) ? ' checked' : '') + '><span>' + t('Quiero recibir ofertas y novedades de OrroFi (opcional).', "I'd like to receive OrroFi offers and news (optional).") + '</span></label>' +
      '<button class="btn gate-btn" data-go="onb3" disabled aria-disabled="true">' + t('Enviar solicitud', 'Send request') + '</button></div>';
  });
  R('onb3', ['Solicitud enviada', 'Request sent'], null, 'onb2', function (c) {
    var t = c.t;
    return top(t('Solicitud', 'Request')) + state('check', t('Solicitud enviada', 'Request sent'), '<span class="hud">SOL-48210537</span><br>' + t('Una persona te contactará. Nunca te pediremos DNI ni IBAN.', 'A person will contact you. We will never ask for your ID or IBAN.'),
      '<div class="note">' + ic('clock', 's') + '<span>' + t('Fuera de horario: una persona te llamará en el próximo horario de atención (L–V 9:00–20:00, hora de Madrid).', 'Outside hours: a person will call you in the next opening hours (Mon–Fri 9:00–20:00, Madrid time).') + '</span></div>' +
      btn(t('Listo', 'Done'), { go: 'login' }) + btn(t('Llamar', 'Call'), { toast: t('Llamar disponible L–V 9:00–20:00', 'Calls available Mon–Fri 9:00–20:00') }, 'g'));
  });
  R('push-why', ['Avisos', 'Notifications'], null, 'login-code', function (c) {
    var t = c.t;
    return top(t('Avisos', 'Notifications'), { back: false }) + state('bell', t('Entérate de lo importante', 'Stay on top of what matters'), t('Te avisamos de averías, facturas y citas del técnico. Sin publicidad.', 'We notify you about outages, bills and technician visits. No ads.'),
      btn(t('Activar avisos', 'Turn on notifications'), { go: 'home', flagset: 'firstLogin:0' }) + btn(t('Ahora no', 'Not now'), { go: 'home', flagset: 'firstLogin:0' }, 'g'));
  });

  /* ---------- Inicio ---------- */
  R('home', ['Inicio', 'Home'], 'home', null, function (c) {
    var t = c.t, d = c.data, f = c.flags;
    return brand() + '<div class="lt" style="margin-bottom:4px">' + t('Hola, ', 'Hi, ') + d.user.name + '</div>' +
      (f.outage ? '<button class="note tap" data-go="outage" style="width:100%;text-align:left">' + ic('alert', 's') + '<span><b>' + t('Avería en ', 'Outage in ') + d.user.zone + '</b><br>' + t('Técnicos en ruta · toca para ver', 'Technicians on the way · tap to see') + '</span></button>' :
        '<div class="cap" style="margin:0 4px 16px">' + t('Todo funciona con normalidad · ', 'Everything is working normally · ') + d.user.zone + '</div>') +
      '<div class="tiles"><button class="cd p" data-go="fiber" style="text-align:left"><div class="row">' + ic('wifi') + '<span class="sp"></span><span class="pill"><span class="dot"></span>OK</span></div><div><div class="n2">' + d.fiber.down + ' <small>Mb/s</small></div><div class="cap">' + d.fiber.plan + '</div></div></button>' +
      '<button class="cd p" data-go="mobile" style="text-align:left"><div class="row">' + ic('phone') + '<span class="sp"></span><span class="cap">' + t('2 líneas', '2 lines') + '</span></div><div><div class="n2">17,6 <small>GB</small></div><div class="bars" style="margin:6px 0 4px"><i style="width:35%"></i></div><div class="cap">' + t('quedan de 50 GB', 'left of 50 GB') + '</div></div></button></div>' +
      '<button class="cd p" data-go="billing" style="width:100%;text-align:left"><div class="row"><div class="sp"><div class="cap">' + t('Próximo pago · 5 nov', 'Next payment · 5 Nov') + '</div><div class="n" style="font-size:34px;margin-top:4px">39,00 <small>€</small></div></div><span class="pill n0">' + ic('card', 's') + ' SEPA</span></div></button>' +
      '<button class="cd p" data-go="install" style="width:100%;text-align:left"><div class="row"><span class="badge">' + ic('cal', 's') + '</span><div class="sp"><div class="cap">' + t('Instalación de fibra · segunda línea', 'Fibre installation · second line') + '</div><div style="font-weight:500">' + t('Técnico el jueves, 9–11 h', 'Technician Thursday, 9–11') + '</div></div>' + ic('chev', 's chev') + '</div>' +
      '<div class="tl"><i class="d"></i><i class="d"></i><i class="d"></i><i></i></div><div class="tlx"><span>' + t('Pedido', 'Order') + '</span><span>' + t('Cita', 'Visit') + '</span><span>' + t('En camino', 'On the way') + '</span><span>' + t('Activa', 'Active') + '</span></div></button>' +
      '<button class="cd p" data-go="manager" style="width:100%;text-align:left"><div class="row"><span class="av">' + ic('spark', 's') + '</span><div class="sp"><b style="font-weight:500">Mi gestor</b><div class="cap">' + t('Ticket #4821 · cambio de tarifa en revisión', 'Ticket #4821 · plan change in review') + '</div></div><span class="pill w">1</span></div></button>' +
      '<div class="sec">' + t('Servicios', 'Services') + '</div><div class="grp">' + li({ i: 'wifi', t: t('Fibra 1 Gb', 'Fibre 1 Gb'), s: t('Conectada', 'Connected'), go: 'fiber' }) + li({ i: 'ant', t: t('Internet radio', 'Radio internet'), s: 'Antena · −58 dBm', go: 'radio' }) + li({ i: 'phone', t: t('Móvil', 'Mobile'), s: t('2 líneas', '2 lines'), go: 'mobile' }) + '</div>' +
      '<div class="chips mt12"><button class="chip" data-go="stoffline">DEMO · ' + t('Sin conexión', 'Offline') + '</button></div>';
  });

  R('notif', ['Avisos', 'Alerts'], 'home', 'home', function (c) {
    var t = c.t, d = c.data;
    return '<div data-pickroot>' + top(t('Avisos', 'Alerts')) + '<div class="seg"><button class="on" data-pick="all">' + t('Todos', 'All') + '</button><button data-pick="net">' + t('Red', 'Network') + '</button><button data-pick="bill">' + t('Facturas', 'Bills') + '</button><button data-pick="tick">Tickets</button></div>' +
      '<div class="grp">' + d.notifs.map(function (n) { return '<button class="li tap" data-show="' + n.k + '" data-go="' + n.go + '"><span class="badge">' + ic(n.i, 's') + '</span><span class="t"><b>' + t(n.t[0], n.t[1]) + '</b><small>' + t(n.s[0], n.s[1]) + ' · ' + t(n.w[0], n.w[1]) + '</small></span>' + ic('chev', 's chev') + '</button>'; }).join('') + '</div></div>';
  });

  R('outage', ['Avería', 'Outage'], 'fiber', 'fiber', function (c) {
    var t = c.t;
    return top(t('Avería', 'Outage')) + '<div class="cd"><div class="row"><span class="pill w"><span class="dot"></span>' + t('Zona ', 'Area ') + c.data.user.zone + '</span></div>' +
      '<ul class="steps mt8"><li class="d"><span class="sd">' + ic('check', 's') + '</span><div><b>' + t('Detectada', 'Detected') + '</b><div class="cap">08:52</div></div></li><li class="d"><span class="sd">' + ic('check', 's') + '</span><div><b>' + t('Técnicos en ruta', 'Technicians on the way') + '</b><div class="cap">09:30</div></div></li><li><span class="sd"></span><div><b>' + t('Resuelta', 'Resolved') + '</b><div class="cap">ETA 14:00</div></div></li></ul></div>' +
      btn(t('Avísame al resolverse', 'Notify me when resolved'), { toast: t('Te avisaremos cuando se resuelva', "We'll tell you when it's resolved") });
  });

  R('install', ['Instalación', 'Installation'], 'home', 'home', function (c) {
    var t = c.t, st = [[t('Pedido', 'Order'), 1], [t('Cobertura', 'Coverage'), 1], [t('Cita', 'Visit'), 1], [t('Técnico en camino', 'Technician on the way'), 0], [t('Línea activa', 'Line active'), 0]];
    return top(t('Instalación', 'Installation')) + '<div class="cd"><div class="cap">' + t('Cita', 'Visit') + '</div><div class="h2">' + t('Jueves, 9–11 h', 'Thursday, 9–11') + '</div><ul class="steps">' +
      st.map(function (x) { return '<li class="' + (x[1] ? 'd' : '') + '"><span class="sd">' + (x[1] ? ic('check', 's') : '') + '</span><b style="font-weight:400">' + x[0] + '</b></li>'; }).join('') + '</ul></div>' +
      btn(t('Cambiar cita', 'Change visit'), { go: 'sh-cita' }) + btn(t('Contactar', 'Contact'), { go: 'handoff' }, 'g');
  });
  R('sh-cita', ['Cambiar cita', 'Change visit'], null, 'install', function (c) {
    var t = c.t;
    return H(t('Pedir otro horario', 'Request another time')) + '<div class="mt8">' +
      [[t('Mañana', 'Morning'), '9–13 h', 1], [t('Tarde', 'Afternoon'), '15–19 h', 0], [t('Otro día', 'Another day'), t('Lo propone Mi gestor', 'My manager proposes'), 0]].map(function (o) { return '<button class="opt ' + (o[2] ? 'on' : '') + '" data-pick="x" style="width:100%;text-align:left"><span class="radio"></span><span class="sp"><b style="font-weight:500">' + o[0] + '</b><div class="cap">' + o[1] + '</div></span></button>'; }).join('') + '</div>' +
      btn(t('Enviar solicitud', 'Send request'), { toast: t('Solicitud enviada a Mi gestor · te avisamos al confirmarse', "Request sent to My manager · we'll notify you"), close: true });
  }, { sheet: true });

  /* ---------- Servicios ---------- */
  function svSeg(c, on) {
    return '<div class="seg"><button class="' + (on === 'fiber' ? 'on' : '') + '" data-go="fiber">Fibra</button><button class="' + (on === 'radio' ? 'on' : '') + '" data-go="radio">Radio</button><button class="' + (on === 'mobile' ? 'on' : '') + '" data-go="mobile">' + c.t('Móvil', 'Mobile') + '</button></div>';
  }
  R('fiber', ['Fibra', 'Fibre'], 'fiber', null, function (c) {
    var t = c.t, f = c.data.fiber;
    return brand() + '<div class="lt">' + t('Servicios', 'Services') + '</div>' + svSeg(c, 'fiber') +
      '<div class="cd"><div class="row"><span class="pill"><span class="dot"></span>' + t('Conectada · ' + f.days + ' días', 'Connected · ' + f.days + ' days') + '</span><span class="sp"></span><span class="cap">' + f.ont + '</span></div>' +
      '<div class="row" style="margin:18px 0 6px;gap:26px"><div><div class="cap">' + t('Bajada', 'Down') + '</div><div class="n">' + f.down + '<small>Mb/s</small></div></div><div><div class="cap">' + t('Subida', 'Up') + '</div><div class="n">' + f.up + '<small>Mb/s</small></div></div></div>' +
      '<div class="cap">' + t('Tráfico este mes: ', 'Traffic this month: ') + f.gb + ' GB</div></div>' +
      btn(t('Test de velocidad', 'Speed test'), { toast: t('Midiendo… 938 Mb/s', 'Measuring… 938 Mb/s') }, 'g') +
      '<div class="sec">' + t('Tu red', 'Your network') + '</div><div class="grp">' + li({ i: 'dev', t: 'Mi red', s: t('Dispositivos, Wi‑Fi y familia', 'Devices, Wi‑Fi and family'), go: 'net-entry' }) + li({ i: 'wifi', t: 'Wi‑Fi', s: 'OrroFi‑Marta', go: 'wifi' }) + '</div>' +
      '<div class="grp">' + li({ i: 'pin', t: t('Averías en tu zona', 'Outages in your area'), s: c.flags.outage ? t('1 activa en Roses', '1 active in Roses') : t('Ninguna', 'None'), go: 'outage' }) + li({ i: 'plus', t: t('Contratar', 'Add a service'), s: t('Fibra o móvil', 'Fibre or mobile'), go: 'order' }) + '</div>';
  });
  R('radio', ['Radio', 'Radio'], 'fiber', 'fiber', function (c) {
    var t = c.t, r = c.data.radio;
    return brand() + '<div class="lt">' + t('Servicios', 'Services') + '</div>' + svSeg(c, 'radio') +
      '<div class="cd"><div class="row"><span class="pill"><span class="dot"></span>' + t('Señal buena', 'Good signal') + '</span><span class="sp"></span><span class="cap">' + r.antenna + '</span></div>' +
      '<div class="kv"><div><b>' + r.dbm + ' dBm</b><span>' + t('Señal', 'Signal') + '</span></div><div><b>' + r.ccq + '</b><span>CCQ</span></div><div><b>5 GHz</b><span>' + t('Banda', 'Band') + '</span></div></div></div>' +
      btn(t('Pedir visita de alineación', 'Request an alignment visit'), { toast: t('Solicitud creada · lo aprueba el equipo', 'Request created · the team approves it') });
  });
  R('mobile', ['Móvil', 'Mobile'], 'fiber', 'fiber', function (c) {
    var t = c.t, L = c.data.lines;
    return '<div data-pickroot>' + brand() + '<div class="lt">' + t('Servicios', 'Services') + '</div>' + svSeg(c, 'mobile') +
      '<div class="seg"><button class="on" data-pick="a">' + L[0].n + ' ' + L[0].who + '</button><button data-pick="b">' + L[1].n + ' ' + L[1].who + '</button></div>' +
      L.map(function (l, i) {
        return '<div class="cd" data-show="' + (i ? 'b' : 'a') + '"' + (i ? ' hidden' : '') + '><div class="row" style="gap:18px"><div class="rw"><div class="ring" style="--p:' + l.pct + '"></div><div class="lab"><div><div class="n2">' + l.left + '</div><div class="cap">GB ' + t('quedan', 'left') + '</div></div></div></div>' +
          '<div class="sp"><div class="cap">' + t('Datos', 'Data') + '</div><div style="font-size:17px">' + l.used + t(' de ', ' of ') + l.of + ' GB</div><div class="cap mt12">' + t('Llamadas', 'Calls') + '</div><div style="font-size:17px">' + t('Ilimitadas', 'Unlimited') + '</div><div class="cap mt12">' + t('Renueva', 'Renews') + '</div><div>1 ' + t('de noviembre', 'November') + '</div></div></div></div>';
      }).join('') + btn(ic('plus', 's') + ' ' + t('Añadir datos', 'Add data'), { go: 'sh-gb' }) + btn(t('PIN y PUK', 'PIN and PUK'), { go: 'sh-pinpuk' }, 'g') + '</div>';
  });
  R('sh-gb', ['Añadir datos', 'Add data'], null, 'mobile', function (c) {
    var t = c.t;
    return H(t('Añadir datos', 'Add data')) + '<div class="cd mt8"><div class="row"><div class="sp"><div class="n2">10 <small>GB</small></div><div class="cap">' + t('Bono único, hasta fin de ciclo', 'One-off bundle, until cycle end') + '</div></div><b>5,00 €</b></div><div class="cap mt8">' + t('IVA 21 % incl.', 'VAT 21% incl.') + '</div></div>' +
      btn(ic('face', 's') + ' ' + t('Confirmar con Face ID', 'Confirm with Face ID'), { toast: t('Bono activado · 10 GB añadidos', 'Bundle active · 10 GB added'), close: true }) + btn(t('Cancelar', 'Cancel'), { close: true }, 'g');
  }, { sheet: true });
  R('sh-pinpuk', ['PIN y PUK', 'PIN and PUK'], null, 'mobile', function (c) {
    var t = c.t;
    return H(t('PIN y PUK', 'PIN and PUK')) + '<p class="sec2">' + t('Se muestran durante 30 segundos, tras Face ID. No hagas capturas de pantalla.', 'Shown for 30 seconds after Face ID. Do not take screenshots.') + '</p>' +
      '<div class="cd mt12" data-rv="pp" hidden><div class="row"><div class="sp"><div class="cap">PIN</div><div class="n2">1234</div></div><div class="sp"><div class="cap">PUK</div><div class="n2">87654321</div></div><span class="pill w"><span class="cd30">30</span> s</span></div></div>' +
      btn(ic('face', 's') + ' ' + t('Continuar con Face ID', 'Continue with Face ID'), { reveal: 'pp' }) + btn(t('Cerrar', 'Close'), { close: true }, 'g');
  }, { sheet: true });
  R('wifi', ['Wi‑Fi', 'Wi‑Fi'], 'fiber', 'fiber', function (c) {
    var t = c.t;
    return top('Wi‑Fi') + '<div class="cd"><div class="row"><span class="badge">' + ic('wifi', 's') + '</span><div class="sp"><b style="font-weight:500">OrroFi‑Marta</b><div class="cap">5 GHz + 2,4 GHz · ' + t('señal excelente', 'excellent signal') + '</div></div><span class="pill"><span class="dot"></span>ON</span></div>' +
      '<div class="kv"><div><b>9</b><span>' + t('Dispositivos', 'Devices') + '</span></div><div><b>5 GHz</b><span>' + t('Banda', 'Band') + '</span></div><div><b>WPA3</b><span>' + t('Seguridad', 'Security') + '</span></div></div></div>' +
      '<p class="dis">' + t('Aquí solo puedes consultar. Para gestionar tu Wi‑Fi usa «Mi red».', 'Read-only here. To manage your Wi‑Fi use “Mi red”.') + '</p>' + btn(t('Gestionar en Mi red', 'Manage in Mi red'), { go: 'net-entry' });
  });
  var PLANS = [['Fibra 300 Mb', '29,00'], ['Fibra 1 Gb', '39,00']];
  var SLOTS = [[['Jueves 5 nov · 9–13 h', 'Thursday 5 Nov · 9–13']], [['Viernes 6 nov · 15–19 h', 'Friday 6 Nov · 15–19']], [['Lunes 9 nov · 9–13 h', 'Monday 9 Nov · 9–13']]];
  R('order', ['Contratar', 'Add a service'], 'fiber', 'fiber', function (c) {
    var t = c.t;
    return '<div data-pickroot>' + top(t('Contratar', 'Add a service')) + '<div class="seg"><button class="on" data-pick="f">Fibra</button><button data-pick="m">' + t('Móvil', 'Mobile') + '</button></div>' +
      '<div data-show="f"><label class="fm"><span>' + t('Dirección', 'Address') + '</span><input value="Carrer de Mar 12, Roses"></label>' +
      '<div class="note ok">' + ic('check', 's') + '<span>' + t('Cobertura comprobada: fibra disponible', 'Coverage checked: fibre available') + '</span></div>' +
      '<div class="sec" style="margin-top:4px">' + t('Precios de ejemplo', 'Example prices') + ' · ' + t('IVA 21 % incl.', 'VAT 21% incl.') + '</div>' +
      PLANS.map(function (p, i) { return '<button class="opt ' + (i === ord.plan ? 'on' : '') + '" data-pick="x" data-ord="plan:' + i + '" style="width:100%;text-align:left"><span class="radio"></span><span class="sp"><b style="font-weight:500">' + p[0] + '</b></span><b class="mono">' + p[1] + ' €/' + t('mes', 'mo') + '</b></button>'; }).join('') +
      btn(t('Continuar', 'Continue'), { go: 'order-date' }) + '</div>' +
      '<div data-show="m" hidden><div class="cd"><b>' + t('Líneas móviles', 'Mobile lines') + '</b></div>' +
      btn(t('Quiero una línea móvil', 'I want a mobile line'), { go: 'order-movil' }) + '<p class="dis">' + t('Nunca te pediremos DNI ni IBAN.', 'We will never ask for your ID or IBAN.') + '</p></div></div>';
  });
  /* ---------- móvil: contratación (Resumen del contrato + casillas Legal) ---------- */
  var mv = { terms: 0, early: 0, mkt: 0 };
  var MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function tl(es, en) { return document.documentElement.lang === 'en' ? en : es; }
  var D_END = ['17 de noviembre de 2026', '17 November 2026'], D_START = ['18 de noviembre de 2026', '18 November 2026'];
  function startTxt(c) {
    return mv.early ? c.t('Empieza hoy', 'Starts today') :
      c.t('Puedes desistir hasta el ' + D_END[0] + ' incluido. Tu servicio empezará el ' + D_START[0] + '.', 'You can withdraw until ' + D_END[1] + ' (inclusive). Your service will start on ' + D_START[1] + '.');
  }
  document.addEventListener('change', function (e) {
    var el = e.target, k = el.dataset && el.dataset.mv;
    if (!k) return;
    mv[k] = el.checked ? 1 : 0;
    var cp = document.getElementById('mv-start'); if (cp && k === 'early') cp.textContent = startTxt({ t: tl });
  }, true);
  R('order-movil', ['Contratar · móvil', 'Add a service · mobile'], 'fiber', 'order', function (c) {
    var t = c.t;
    var EARLY = t('Quiero que el servicio empiece ya, antes de que terminen los 14 días para desistir. Si desisto, pagaré solo la parte del servicio que haya recibido hasta ese momento. Sé que, si el servicio se presta por completo antes de que desista, perderé el derecho a desistir.', 'I want the service to start now, before the 14-day withdrawal period ends. If I withdraw, I will pay only for the part of the service I have received up to that point. I understand that if the service is fully provided before I withdraw, I will lose my right to withdraw.');
    var PRO = t('Si desistes después de pedir el inicio inmediato, pagarás solo los días de servicio recibidos: precio del periodo × días de servicio ÷ días del periodo. Te devolvemos el resto en un plazo máximo de 14 días desde que nos comuniques el desistimiento, por el mismo medio de pago.', 'If you withdraw after asking for an immediate start, you pay only for the days of service received: period price × days of service ÷ days in the period. We refund the rest within 14 days of your withdrawal notice, using the same payment method.');
    function it(n, a, b) { return '<p class="sec2 mt8"><b>' + n + '. ' + a + '</b><br>' + b + '</p>'; }
    var resumen = '<div class="cd"><div class="hud mb8">' + t('OrroFi Móvil 30 GB', 'OrroFi Mobile 30 GB') + '</div>' +
      '<p class="sec2">' + t('[RESPONSABLE] · [DIRECCIÓN] · [EMAIL] · [TELÉFONO] · Reclamaciones: [CONTACTO RECLAMACIONES]', '[RESPONSABLE] · [ADDRESS] · [EMAIL] · [PHONE] · Complaints: [COMPLAINTS CONTACT]') + '</p>' +
      '<p class="sec2 mt8"><b>' + t('Resumen del contrato', 'Contract summary') + '</b> · ' + t('Fecha: 3 de noviembre de 2026', 'Date: 3 November 2026') + '</p>' +
      '<p class="sec2 mt8">' + t('El presente resumen del contrato recoge los principales elementos de esta oferta de servicios, tal como exige el Derecho de la UE. Ayuda a comparar ofertas de servicios. La información completa sobre el servicio figura en otros documentos.', 'This contract summary provides the main elements of this service offer as required by EU law. It helps to make a comparison between service offers. Complete information about the service is provided in other documents.') + '</p>' +
      it(1, t('Servicios y equipos', 'Services and equipment'), t('Telefonía móvil e internet móvil: 1 línea; 30 GB/mes; llamadas ilimitadas a fijos y móviles nacionales; SMS: [SMS INCLUIDOS]; itinerancia en la UE incluida según la política de uso razonable ([LÍMITE ROAMING UE] GB/mes). Equipo: no incluido (solo tarjeta SIM).', 'Mobile voice and mobile internet: 1 line; 30 GB/month; unlimited calls to national landlines and mobiles; SMS: [SMS INCLUDED]; EU roaming included under the fair use policy ([EU ROAMING LIMIT] GB/month). Equipment: not included (SIM card only).')) +
      it(2, t('Velocidades del servicio de internet y vías de recurso', 'Speeds of the internet service and remedies'), t('Internet móvil 4G/5G: velocidad máxima estimada de bajada 150 Mbit/s y de subida 50 Mbit/s. Si la velocidad u otra calidad del servicio difiere de forma continua o reiterada de lo indicado, puedes reclamar a [RESPONSABLE] ([CONTACTO RECLAMACIONES]); si no se resuelve en un mes o no estás conforme, puedes acudir a la Oficina de Atención al Usuario de Telecomunicaciones o a la Junta Arbitral de Consumo. [REMEDIOS SEGÚN CONTRATO: p. ej. resolución sin coste / compensación]', '4G/5G mobile internet: estimated maximum download speed 150 Mbit/s and upload speed 50 Mbit/s. If the speed or other quality of service continuously or regularly differs from what is stated, you can complain to [RESPONSABLE] ([COMPLAINTS CONTACT]); if it is not resolved within one month or you disagree, you can go to the Telecommunications User Service Office or the Consumer Arbitration Board. [REMEDIES UNDER CONTRACT]')) +
      it(3, t('Precio', 'Price'), t('15,00 €/mes, IVA incluido. Alta y tarjeta SIM: 0 €. Al agotar los 30 GB: [QUÉ PASA: velocidad reducida a X / X € por bono de Y GB]. Llamadas y SMS fuera de lo incluido (internacionales, tarificación adicional): [PRECIOS]. Las tarifas de servicios adicionales no incluidos están disponibles en [ENLACE TARIFAS].', '€15.00/month, VAT included. Activation and SIM card: €0. Once the 30 GB are used up: [WHAT HAPPENS]. Calls and SMS not included (international, premium rate): [PRICES]. Prices of additional services not included are available at [PRICES LINK].')) +
      it(4, t('Duración, renovación y rescisión', 'Duration, renewal and termination'), t('Sin permanencia: contrato de duración indefinida, que se renueva cada mes automáticamente. Puedes darte de baja en cualquier momento desde la app, sin coste; la baja es efectiva en 2 días hábiles. No hay penalización por baja anticipada. Sin terminal: no aplica desbloqueo.', 'No minimum term: open-ended contract that renews automatically every month. You can cancel at any time in the app at no cost; cancellation takes effect within 2 working days. No early termination fee. No device: unlocking does not apply.')) +
      it(5, t('Funciones para usuarios finales con discapacidad', 'Features for end-users with disabilities'), t('[PRINCIPALES SERVICIOS: p. ej. facturas y app accesibles, atención por texto, tarifas especiales]. Más detalles en [ENLACE].', '[MAIN SERVICES]. More details at [LINK].')) +
      it(6, t('Otra información pertinente', 'Other relevant information'), t('Tienes 14 días naturales desde la celebración del contrato para desistir sin dar motivos. Si pides que el servicio empiece antes, y luego desistes, pagarás solo la parte del servicio recibida.', 'You have 14 days from the conclusion of the contract to withdraw without giving any reason. If you ask for the service to start earlier and then withdraw, you will pay only for the part of the service you have received.')) +
      '</div>' +
      btn(t('Descargar el resumen del contrato (PDF)', 'Download the contract summary (PDF)'), { toast: t('PDF de ejemplo', 'Sample PDF') }, 'g') +
      '<p class="dis">' + t('Te recomendamos descargarlo y guardarlo: te servirá como referencia y no cambiará.', 'We recommend you download and keep it: it is for your reference and will not change.') + '</p>';
    function lk(x) { return '<a href="#" data-toast="' + t('Documento de ejemplo', 'Sample document') + '">' + x + '</a>'; }
    var TERMS = t('Acepto las ' + lk('condiciones del servicio') + '. He leído la ' + lk('política de privacidad') + ' y la ' + lk('información sobre el desistimiento') + '.', 'I accept the ' + lk('terms of service') + '. I have read the ' + lk('privacy policy') + ' and the ' + lk('withdrawal information') + '.');
    var MKT = t('Quiero recibir ofertas y novedades de OrroFi por e-mail, SMS y notificaciones. Puedo retirar el consentimiento cuando quiera desde la app ([RUTA AJUSTES]) o con el enlace de baja de cada mensaje.', 'I want to receive OrroFi offers and news by e-mail, SMS and notifications. I can withdraw my consent at any time in the app ([SETTINGS PATH]) or via the unsubscribe link in each message.');
    return top(t('Línea móvil', 'Mobile line')) +
      '<div class="sec">' + t('Tarifa', 'Plan') + ' · ' + t('IVA incl.', 'VAT incl.') + '</div>' +
      '<div class="opt on" style="width:100%;text-align:left"><span class="radio"></span><span class="sp"><b style="font-weight:500">' + t('Móvil 30 GB', 'Mobile 30 GB') + '</b></span><b class="mono">' + t('15,00 €/mes', '€15.00/mo') + '</b></div>' +
      resumen +
      '<div class="gate">' +
      '<label class="chk"><input type="checkbox" data-gate data-mv="terms"' + (mv.terms ? ' checked' : '') + '><span>' + TERMS + '</span></label>' +
      '<label class="chk mt8"><input type="checkbox" data-mv="early"' + (mv.early ? ' checked' : '') + '><span>' + EARLY + '</span></label>' +
      '<p class="dis">' + PRO + '</p>' +
      '<label class="chk mt8"><input type="checkbox" data-mv="mkt"' + (mv.mkt ? ' checked' : '') + '><span>' + MKT + '</span></label>' +
      '<p class="sec2 mt8"><b>' + t('15,00 €/mes · sin permanencia', '€15.00/month · no minimum term') + '</b></p>' +
      '<button class="btn gate-btn" data-go="order-movil-ok"' + (mv.terms ? '' : ' disabled aria-disabled="true"') + '>' + t('Contratar con obligación de pago', 'Order with obligation to pay') + '</button></div>' +
      '<p class="dis" id="mv-start">' + startTxt(c) + '</p>' +
      btn(t('Volver', 'Back'), { back: true }, 'g');
  });
  R('order-movil-ok', ['Contratar · móvil · hecho', 'Add a service · mobile · done'], 'fiber', 'order-movil', function (c) {
    var t = c.t;
    var when = mv.early ? t('El servicio empieza hoy.', 'The service starts today.') : t('Tu servicio empezará el ' + D_START[0] + '.', 'Your service will start on ' + D_START[1] + '.');
    return top('', { back: false }) + state('check', t('Línea móvil contratada', 'Mobile line ordered'), '<span class="hud">MOV-48211207</span><br>' + when + ' ' + t('Te enviaremos la SIM y un correo de confirmación.', 'We will send you the SIM and a confirmation email.'),
      btn(t('Listo', 'Done'), { go: 'mobile' }));
  });
  R('order-date', ['Contratar · fecha', 'Add a service · date'], 'fiber', 'order', function (c) {
    var t = c.t;
    return top(t('Fecha de instalación', 'Installation date')) + '<p class="sec2 mb8">' + t('Elige cuándo puede ir el técnico.', 'Choose when the technician can come.') + '</p>' +
      SLOTS.map(function (x, i) { return '<button class="opt ' + (i === ord.slot ? 'on' : '') + '" data-pick="x" data-ord="slot:' + i + '" style="width:100%;text-align:left"><span class="radio"></span><span class="sp"><b style="font-weight:500">' + t(x[0][0], x[0][1]) + '</b></span></button>'; }).join('') +
      btn(t('Continuar', 'Continue'), { go: 'order-sum' });
  });
  R('order-sum', ['Contratar · resumen', 'Add a service · summary'], 'fiber', 'order-date', function (c) {
    var t = c.t, p = PLANS[ord.plan], sl = SLOTS[ord.slot][0];
    function r(a, b, bold) { return '<div class="row" style="padding:7px 0;' + (bold ? 'font-weight:500;border-top:1px solid var(--sep);margin-top:4px' : '') + '"><span class="sp">' + a + '</span><span class="mono">' + b + '</span></div>'; }
    return top(t('Resumen', 'Summary')) + '<div class="cd">' + r(t('Dirección', 'Address'), 'Carrer de Mar 12') + r(t('Cobertura', 'Coverage'), t('Fibra disponible', 'Fibre available')) + r(t('Tarifa', 'Plan'), p[0]) + r(t('Instalación', 'Installation'), t(sl[0], sl[1])) + r(t('Total · IVA 21 % incl.', 'Total · VAT 21% incl.'), p[1] + ' €/' + t('mes', 'mo'), 1) + '</div>' +
      '<p class="dis">' + t('Precios de ejemplo. El pedido se confirma cuando el sistema lo valide.', 'Example prices. The order is confirmed once the system validates it.') + '</p>' +
      btn(t('Confirmar pedido', 'Confirm order'), { go: 'order-done' }) + btn(t('Volver', 'Back'), { back: true }, 'g');
  });
  R('order-done', ['Contratar · enviado', 'Add a service · sent'], 'fiber', 'fiber', function (c) {
    var t = c.t;
    return top('', { back: false }) + state('check', t('Pedido enviado · te confirmaremos la cita', 'Order sent · we will confirm your appointment'), '<span class="hud">PED-48211093</span><br>' + t('Cuando el sistema confirme el pedido, te avisaremos con la fecha y la hora de la cita.', 'Once the system confirms the order, we will notify you with the appointment date and time.'),
      btn(t('Listo', 'Done'), { go: 'fiber', root: true }) + btn(t('Hablar con Mi gestor', 'Talk to My manager'), { go: 'manager' }, 'g'));
  });

  /* ---------- Facturas ---------- */
  R('billing', ['Facturas', 'Bills'], 'billing', null, function (c) {
    var t = c.t, d = c.data;
    return brand() + '<div class="lt">' + t('Facturas', 'Bills') + '</div>' +
      '<div class="cd"><div class="cap">' + t('Saldo pendiente', 'Balance due') + '</div><div class="row"><div class="n sp">39,00<small>€</small></div><span class="pill w">' + t('Pendiente', 'Pending') + '</span></div><div class="cap mt8">' + t('Se cargará el 5 nov', 'Charged on 5 Nov') + '</div></div>' +
      '<div class="grp">' + li({ i: 'card', t: t('Método de pago', 'Payment method'), s: 'SEPA · ES·· ···· 42', go: 'paymethod' }) + '</div>' +
      '<div class="sec">' + t('Historial', 'History') + '</div><div class="grp">' + d.invoices.map(function (v) { return li({ i: 'doc', t: t(v.m[0], v.m[1]), s: v.id + (v.status === 'paid' ? ' · ' + t('Pagada', 'Paid') : ''), v: v.amount + ' €', go: 'invoice' }); }).join('') + '</div>' +
      '<div class="chips mt12"><button class="chip" data-go="sterror">DEMO · Error</button></div>';
  });
  R('invoice', ['Factura', 'Invoice'], 'billing', 'billing', function (c) {
    var t = c.t;
    function r(a, b, bold) { return '<div class="row" style="padding:7px 0;' + (bold ? 'font-weight:500;border-top:1px solid var(--sep);margin-top:4px' : '') + '"><span class="sp">' + a + '</span><span class="mono">' + b + '</span></div>'; }
    return top(t('Factura', 'Invoice')) + '<div class="cd"><div class="cap">F-2610 · ' + t('Octubre 2026', 'October 2026') + '</div>' + r('Fibra 1 Gb', '24,79 €') + r(t('Móvil ··412', 'Mobile ··412'), '7,44 €') + r('Subtotal', '32,23 €') + r(t('IVA 21 % incl.', 'VAT 21% incl.'), '6,77 €') + r('Total', '39,00 €', 1) + '</div>' +
      btn(ic('dl', 's') + ' PDF', { toast: t('PDF descargado', 'PDF downloaded') }, 'g') + btn(t('Preguntar', 'Ask about it'), { go: 'manager' });
  });
  R('paymethod', ['Método de pago', 'Payment method'], 'billing', 'billing', function (c) {
    var t = c.t;
    return top(t('Método de pago', 'Payment method')) + '<div class="cd"><div class="row"><span class="badge">' + ic('card', 's') + '</span><div class="sp"><b style="font-weight:500">SEPA</b><div class="cap mono">ES·· ···· ···· ···· ··42</div></div></div></div><p class="dis">' + t('Por seguridad no mostramos el número completo.', 'For security we never show the full number.') + '</p>' +
      btn(t('Solicitar cambio', 'Request a change'), { toast: t('Solicitud enviada · lo confirma una persona', 'Request sent · a person confirms it') });
  });

  /* ---------- Mi gestor ---------- */
  R('manager', ['Mi gestor', 'My manager'], 'manager', null, function (c) {
    var t = c.t;
    return brand() + '<div class="aiTag">AI · ' + t('INTELIGENCIA ARTIFICIAL', 'ARTIFICIAL INTELLIGENCE') + '</div>' +
      '<div class="msg mt8"><div class="b a">' + t('Hola, Marta. Soy Mi gestor, un asistente de IA. ¿En qué te ayudo?', "Hi Marta. I'm My manager, an AI assistant. How can I help?") + '</div><div class="b u">' + t('¿Cómo va el cambio de tarifa?', "How's my plan change going?") + '</div><div class="b a">' + t('Tu ticket #4821 está en revisión. Te avisaremos al terminar.', 'Your ticket #4821 is in review. We will tell you when done.') + '</div></div>' +
      '<div class="chips mt16"><button class="chip" data-toast="' + t('Solicitud creada', 'Request created') + '">' + t('Pedir técnico', 'Request technician') + '</button><button class="chip" data-go="outage">' + t('Avería', 'Outage') + '</button><button class="chip" data-toast="' + t('Solicitud creada', 'Request created') + '">' + t('Mudanza', 'Moving') + '</button><button class="chip" data-go="tickets">' + t('Mis tickets', 'My tickets') + '</button></div>' +
      '<div class="tc mt16"><button class="chip" data-go="' + (c.flags.humanHours ? 'handoff' : 'handoffoff') + '">' + ic('person', 's') + ' ' + t('Hablar con una persona', 'Talk to a person') + '</button></div>' +
      '<div class="comp mt16"><button class="ibtn" data-go="sh-voice" aria-label="' + t('Dictado por voz', 'Voice dictation') + '">' + ic('mic') + '</button><div class="f">' + t('Escribe un mensaje…', 'Write a message…') + '</div><button class="snd" data-toast="' + t('Enviado', 'Sent') + '" aria-label="' + t('Enviar', 'Send') + '">' + ic('send', 's') + '</button></div>' +
      '<div class="chips"><button class="chip" data-go="mgrlimit">DEMO · 2000</button></div>';
  });
  R('mgrlimit', ['Límite del chat', 'Chat limit'], 'manager', 'manager', function (c) {
    var t = c.t;
    return top('Mi gestor') + state('info', t('Has llegado al límite del chat', 'You reached the chat limit'), '<span class="hud">2000 / 2000</span><br>' + t('Para seguir, habla con una persona o inicia un chat nuevo mañana.', 'To continue, talk to a person or start a new chat tomorrow.'), btn(t('Volver', 'Back'), { go: 'manager' }), 'o');
  });
  R('sh-voice', ['Dictado por voz', 'Voice dictation'], null, 'manager', function (c) {
    var t = c.t;
    return H(t('Dictado por voz', 'Voice dictation')) + '<p class="sec2 mb8">' + t('El dictado se hace en tu iPhone, sin enviar tu voz a ningún servidor. OrroFi no guarda el audio. El texto aparece en el campo y solo se envía cuando tú lo envías.', 'Dictation happens on your iPhone, without sending your voice to any server. OrroFi does not keep the audio. The text appears in the field and is only sent when you send it.') + '</p>' +
      btn(t('Activar dictado', 'Turn on dictation'), { toast: t('Entrada de voz permitida', 'Voice input allowed'), close: true }) + btn(t('Ahora no', 'Not now'), { close: true }, 'g') +
      '<div class="cap">DEMO</div><div class="chips mt8"><button class="chip" data-go="sh-voice-denied">' + t('Permiso denegado', 'Permission denied') + '</button></div>';
  }, { sheet: true });
  R('sh-voice-denied', ['Dictado · sin permiso', 'Dictation · no permission'], null, 'manager', function (c) {
    var t = c.t;
    return H(t('Dictado no disponible', 'Dictation unavailable')) + '<p class="sec2 mb8">' + t('Sin permiso de micrófono o de reconocimiento de voz. Puedes darlo en Ajustes.', 'No microphone or speech-recognition permission. You can grant it in Settings.') + '</p>' +
      btn(t('Abrir Ajustes', 'Open Settings'), { toast: t('Ajustes de iOS (demo)', 'iOS Settings (demo)') }) + btn(t('Cerrar', 'Close'), { close: true }, 'g');
  }, { sheet: true });
  function hours(c) { var t = c.t; return '<div class="cd"><div class="row"><span class="badge">' + ic('clock', 's') + '</span><div class="sp"><b style="font-weight:500">' + t('L–V 9:00–20:00', 'Mon–Fri 9:00–20:00') + '</b><div class="cap">' + t('hora de Madrid', 'Madrid time') + '</div></div></div></div>'; }
  R('handoff', ['Persona', 'Person'], 'manager', 'manager', function (c) {
    var t = c.t;
    return top(t('Persona', 'Person')) + '<div class="h2 mt8">' + t('Te paso con una persona', "I'll connect you with a person") + '</div>' + hours(c) +
      '<div class="cd"><div class="hud mb8">' + t('Resumen para el equipo', 'Summary for the team') + '</div><p class="sec2">' + t('Cliente: Marta. Tema: instalación de fibra y cambio de tarifa (#4821). Sin datos sensibles.', 'Customer: Marta. Topic: fibre installation and plan change (#4821). No sensitive data.') + '</p></div>' +
      btn(t('Llamar', 'Call'), { toast: t('Llamando al ', 'Calling ') + PH }) + btn(t('Seguir en el chat', 'Stay in chat'), { go: 'manager' }, 'g');
  });
  R('handoffoff', ['Persona · fuera de horario', 'Person · after hours'], 'manager', 'manager', function (c) {
    var t = c.t;
    return top(t('Persona', 'Person')) + state('clock', t('Ahora no hay nadie disponible', 'No one is available right now'), t('Nuestro equipo atiende de lunes a viernes, de 9:00 a 20:00 (hora de Madrid). Deja tu solicitud y te contactamos.', 'Our team is available Mon–Fri 9:00–20:00 (Madrid time). Leave your request and we will contact you.'),
      btn(t('Dejar mi solicitud', 'Leave my request'), { toast: t('Solicitud enviada', 'Request sent') }) + btn(t('Seguir con la IA', 'Continue with the AI'), { go: 'manager' }, 'g'), 'o');
  });
  R('tickets', ['Tickets', 'Tickets'], 'manager', 'manager', function (c) {
    var t = c.t, d = c.data;
    return top('Tickets') + '<div class="seg"><button class="on">' + t('Abiertos', 'Open') + '</button><button data-go="stempty">' + t('Cerrados', 'Closed') + '</button></div><div class="grp">' +
      d.tickets.open.map(function (k) { return li({ i: 'ticket', t: t(k.t[0], k.t[1]), s: k.id + ' · ' + t(k.s[0], k.s[1]), go: k.go }); }).join('') + '</div>';
  });
  R('stempty', ['Estado · vacío', 'State · empty'], 'manager', 'manager', function (c) {
    var t = c.t;
    return top('Tickets') + state('ticket', t('No tienes tickets abiertos', 'You have no open tickets'), t('Cuando pidas algo a Mi gestor, lo verás aquí.', "When you ask My manager for something, you'll see it here."), btn(t('Hablar con Mi gestor', 'Talk to My manager'), { go: 'manager' }));
  });
  R('sterror', ['Estado · error', 'State · error'], 'billing', 'billing', function (c) {
    var t = c.t;
    return top(t('Facturas', 'Bills')) + state('alert', t('No hemos podido cargar esto', "We couldn't load this"), t('No es culpa tuya. Inténtalo de nuevo en un momento.', "It's not your fault. Try again in a moment."), btn(t('Reintentar', 'Retry'), { go: 'billing' }), 'e');
  });
  R('stoffline', ['Estado · sin conexión', 'State · offline'], 'home', 'home', function (c) {
    var t = c.t, d = c.data;
    return brand() + '<div class="offband">' + ic('off', 's') + '<span>' + t('Sin conexión · Datos de hoy a las 18:42', 'No connection · Data from today at 18:42') + '</span></div>' +
      '<div class="frozen"><div class="lt" style="margin-bottom:4px">' + t('Hola, ', 'Hi, ') + d.user.name + '</div><div class="tiles mt12"><div class="cd"><div class="row">' + ic('wifi') + '</div><div><div class="n2">' + d.fiber.down + ' <small>Mb/s</small></div><div class="cap">' + d.fiber.plan + '</div></div></div>' +
      '<div class="cd"><div class="row">' + ic('phone') + '</div><div><div class="n2">17,6 <small>GB</small></div><div class="cap">' + t('quedan de 50 GB', 'left of 50 GB') + '</div></div></div></div>' +
      '<div class="cd"><div class="cap">' + t('Próximo pago · 5 nov', 'Next payment · 5 Nov') + '</div><div class="n" style="font-size:34px">39,00 <small>€</small></div></div></div>' +
      btn(t('Reintentar', 'Retry'), { go: 'home' });
  });

  /* ---------- Perfil ---------- */
  R('profile', ['Perfil', 'Profile'], 'profile', null, function (c) {
    var t = c.t, th = O.state.theme, lg = c.lang;
    return brand() + '<div class="row mb8" style="margin:6px 4px 14px"><span class="av" style="width:56px;height:56px;font-size:22px">M</span><div><div class="h2" style="margin:0">Marta Ejemplo</div><div class="cap">+34 ··· ··· 412</div></div></div>' +
      '<div class="sec">' + t('Apariencia', 'Appearance') + '</div><div class="seg"><button class="' + (th === 'dark' ? 'on' : '') + '" data-theme-set="dark">' + t('Oscuro', 'Dark') + '</button><button class="' + (th === 'light' ? 'on' : '') + '" data-theme-set="light">' + t('Claro', 'Light') + '</button><button class="' + (th === 'system' ? 'on' : '') + '" data-theme-set="system">' + t('Sistema', 'System') + '</button></div>' +
      '<div class="sec" style="margin-top:0">' + t('Idioma', 'Language') + '</div><div class="seg"><button class="' + (lg === 'es' ? 'on' : '') + '" data-lang-set="es">ES</button><button class="' + (lg === 'en' ? 'on' : '') + '" data-lang-set="en">EN</button></div>' +
      '<div class="grp">' + li({ i: 'bell', t: t('Notificaciones', 'Notifications'), go: 'notifset' }) + li({ i: 'ticket', t: t('Mis tickets', 'My tickets'), go: 'tickets' }) + li({ i: 'face', t: 'Face ID', v: c.flags.faceid ? t('Activado', 'On') : t('Desactivado', 'Off'), go: 'sh-faceid' }) + li({ i: 'shield', t: t('Privacidad', 'Privacy'), go: 'privacy' }) + li({ i: 'lock', t: t('Mi red · Privacidad', 'Mi red · Privacy'), go: 'net-9b' }) + li({ i: 'plus', t: t('Contratar más servicios', 'Add more services'), go: 'order' }) + '</div>' +
      btn(t('Cerrar sesión', 'Sign out'), { go: 'sh-logout' }, 'd');
  });
  R('notifset', ['Notificaciones', 'Notifications'], 'profile', 'profile', function (c) {
    var t = c.t;
    function r(i, a, b, on, k) { return '<div class="li" style="cursor:default"><span class="badge">' + ic(i, 's') + '</span><span class="t"><b>' + a + '</b><small>' + b + '</small></span>' + sw(O.sess(k, on), { sess: k, label: a }) + '</div>'; }
    return top(t('Notificaciones', 'Notifications')) + '<div class="grp">' + r('pin', t('Averías', 'Outages'), t('En tu zona', 'In your area'), 1, 'n-out') + r('doc', t('Facturas', 'Bills'), t('Nueva factura y cargos', 'New bill and charges'), 1, 'n-bill') + r('phone', t('Datos', 'Data'), t('Cuando te queden pocos GB', 'When you run low on GB'), 0, 'n-data') + '</div>' + btn(t('Volver', 'Back'), { go: 'profile' }, 'g');
  });
  R('sh-faceid', ['Face ID', 'Face ID'], null, 'profile', function (c) {
    var t = c.t, on = c.flags.faceid;
    return H('Face ID') + '<p class="sec2 mb8">' + (on ? t('¿Desactivar Face ID? Entrarás con el código de tu dispositivo.', 'Turn off Face ID? You will sign in with your device passcode.') : t('Activa Face ID para entrar más rápido. Si falla, usaremos el código de tu dispositivo.', 'Turn on Face ID to sign in faster. If it fails we use your device passcode.')) + '</p>' +
      btn(t('Confirmar', 'Confirm'), { flag: 'faceid', toast: on ? t('Face ID desactivado', 'Face ID off') : t('Face ID activado', 'Face ID on'), close: true }) + btn(t('Cancelar', 'Cancel'), { close: true }, 'g');
  }, { sheet: true });
  R('sh-logout', ['Cerrar sesión', 'Sign out'], null, 'profile', function (c) {
    var t = c.t;
    return H(t('¿Cerrar sesión?', 'Sign out?')) + '<p class="sec2 mb8">' + t('Se borrarán de este teléfono la sesión, la caché, la clave de firma y el identificador de instalación.', 'The session, cache, signing key and installation ID will be erased from this phone.') + '</p>' +
      btn(t('Cerrar sesión', 'Sign out'), { go: 'login', flagset: 'session:0' }, 'd') + btn(t('Cancelar', 'Cancel'), { close: true }, 'g');
  }, { sheet: true });

  /* ---------- Privacidad ---------- */
  R('privacy', ['Privacidad', 'Privacy'], 'profile', 'profile', function (c) {
    var t = c.t;
    function r(a, b, k) { return '<div class="li" style="cursor:default"><span class="t"><b>' + a + '</b><small>' + b + '</small></span>' + sw(O.sess(k, false), { toast: t('Guardado', 'Saved'), label: a, sess: k }) + '</div>'; }
    return top(t('Privacidad', 'Privacy')) + '<div class="sec" style="margin-top:6px">' + t('Consentimientos', 'Consents') + '</div><p class="dis" style="margin:0 4px 8px">' + t('Puedes retirar tu consentimiento en cualquier momento, tan fácilmente como lo diste: desactiva el interruptor.', 'You can withdraw your consent at any time, as easily as you gave it: just turn off the switch.') + '</p><div class="grp">' +
      r(t('Chat con el gestor IA', 'Chat with the AI manager'), t('Usar tus mensajes para responderte', 'Use your messages to answer you'), 'c-chat') + r(t('Grabación de llamadas', 'Call recording'), t('Para calidad y formación', 'For quality and training'), 'c-rec') + r(t('Analítica de uso', 'Usage analytics'), t('Mejorar la app', 'Improve the app'), 'c-ana') + r(t('Comunicaciones comerciales', 'Marketing messages'), t('Ofertas de OrroFi', 'OrroFi offers'), 'c-mkt') + '</div>' +
      '<div class="grp">' + li({ i: 'dl', t: t('Descargar mis datos', 'Download my data'), go: 'sh-export' }) + '</div>' +
      btn(ic('trash', 's') + ' ' + t('Eliminar mi cuenta', 'Delete my account'), { go: c.flags.activeServices ? 'sh-delete' : 'sh-deleteok' }, 'd') + '<p class="dis">' + t('Responsable: ', 'Controller: ') + RESP + ' · [EMAIL PRIVACIDAD]</p>';
  });
  R('sh-export', ['Descargar mis datos', 'Download my data'], null, 'privacy', function (c) {
    var t = c.t;
    return H(t('Te enviaremos tus datos por e-mail', "We'll email you your data")) + '<p class="sec2 mb8">' + t('Recibirás un archivo con tu información en un plazo razonable.', 'You will receive a file with your information within a reasonable time.') + '</p>' +
      btn(t('Enviar solicitud', 'Send request'), { toast: t('Solicitud enviada · te escribiremos por email', "Request sent · we'll email you"), close: true }) + btn(t('Cancelar', 'Cancel'), { close: true }, 'g');
  }, { sheet: true });
  R('sh-delete', ['Eliminar · bloqueado', 'Delete · blocked'], null, 'privacy', function (c) {
    var t = c.t;
    return H(t('Aún no puedes eliminar tu cuenta', "You can't delete your account yet")) + '<p class="sec2 mb8">' + t('Podrás eliminarla cuando terminen todos tus contratos.', 'You can delete it once all your contracts have ended.') + '</p>' +
      '<div class="grp">' + c.data.services.map(function (s) { return li({ i: 'wifi', t: t(s.n[0], s.n[1]), s: t('Termina el ', 'Ends on ') + t(s.end[0], s.end[1]), nochev: 1 }); }).join('') + '</div>' +
      btn(t('Eliminar mi cuenta', 'Delete my account'), {}, 'd', 'disabled aria-disabled="true"') + btn(t('Hablar con Mi gestor', 'Talk to My manager'), { go: 'manager' }) + btn(t('Cerrar', 'Close'), { close: true }, 'g');
  }, { sheet: true });
  R('sh-deleteok', ['¿Eliminar tus datos?', 'Delete your data?'], null, 'privacy', function (c) {
    var t = c.t;
    return H(t('¿Eliminar tus datos?', 'Delete your data?')) + '<p class="sec2 mb8">' + t('Confirmarás con Face ID y un código SMS. Tienes 30 días para cancelar la eliminación. Las facturas y los pagos se conservan por ley.', 'You will confirm with Face ID and an SMS code. You have 30 days to cancel the deletion. Bills and payments are kept as required by law.') + '</p>' +
      btn(ic('face', 's') + ' ' + t('Continuar con Face ID', 'Continue with Face ID'), { go: 'sh-deletecode' }, 'd') + btn(t('Cancelar', 'Cancel'), { close: true }, 'g');
  }, { sheet: true });
  R('sh-deletecode', ['Eliminar · código', 'Delete · code'], null, 'privacy', function (c) {
    var t = c.t;
    return '<div class="hud">' + t('PASO 2 DE 2', 'STEP 2 OF 2') + '</div>' + H(t('Introduce el código SMS', 'Enter the SMS code')) + otp(false, 6) +
      btn(t('Confirmar eliminación', 'Confirm deletion'), { go: 'privsched' }, 'd') + btn(t('Cancelar', 'Cancel'), { close: true }, 'g');
  }, { sheet: true });
  R('privsched', ['Eliminación programada', 'Scheduled deletion'], 'profile', 'profile', function (c) {
    var t = c.t;
    return top(t('Privacidad', 'Privacy')) + '<div class="note">' + ic('clock', 's') + '<span><b>' + t('Quedan 27 días', '27 days left') + '</b><br>' + t('Puedes cancelarla hasta el 29 nov 2026. Tu cuenta sigue guardada hasta entonces.', 'You can cancel until 29 Nov 2026. Your account stays saved until then.') + '</span></div>' +
      btn(t('Cancelar eliminación', 'Cancel deletion'), { toast: t('Eliminación cancelada', 'Deletion cancelled'), go: 'privacy' });
  });
})();
