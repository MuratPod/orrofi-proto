/* screens-b.js — grupo B: «Mi red». Textos es/en tomados de design/v5-network/src.html (rama design/v5-mynet-delete). Datos ficticios. */
(function () {
  var O = OrroProto, U = O.ui, ic = U.ic, li = U.li, btn = U.btn, top = U.top, state = U.state, sw = U.sw;
  var RESP = '[RESPONSABLE]';
  /* datos ficticios del grupo */
  var DEV = [
    ['Nexa RX-5200', 'wifi', 'Nexa', ['Cable · puerta de enlace', 'Cable · gateway'], 1, ''],
    ['iPhone', 'phone', 'Apple', ['Wi‑Fi 5 GHz', 'Wi‑Fi 5 GHz'], 1, '1,2 GB'],
    ['MacBook', 'dev', 'Apple', ['Wi‑Fi 5 GHz', 'Wi‑Fi 5 GHz'], 1, '8,4 GB'],
    ['Nuki', 'lock', 'Nuki Home Solutions', ['Wi‑Fi 2,4 GHz', 'Wi‑Fi 2.4 GHz'], 1, '12 MB'],
    ['Tapo L530', 'bolt', 'TP-Link', ['Wi‑Fi 2,4 GHz', 'Wi‑Fi 2.4 GHz'], 1, '3 MB'],
    [['TV Salón', 'Living-room TV'], 'dev', 'LG Electronics', ['Cable Ethernet', 'Ethernet cable'], 1, '14,2 GB'],
    ['living-room', 'bubble', 'Sonos', ['Wi‑Fi 5 GHz', 'Wi‑Fi 5 GHz'], 1, '640 MB'],
    ['a17', 'phone', 'Xiaomi', ['Wi‑Fi 5 GHz', 'Wi‑Fi 5 GHz'], 0, '—'],
    [['Dispositivo de Ana', "Ana's device"], 'phone', 'Samsung', ['Wi‑Fi 5 GHz', 'Wi‑Fi 5 GHz'], 1, '310 MB']
  ];
  var CH = [[36, 7], [40, 4], [44, 0], [48, 5], [52, 3], [56, 2], [60, 3], [64, 1]];
  var S = { bioAuto: false, revealed: false, bioFrom: 'net-8', nameOpen: false, tm: {} };
  var FAKEPW = 'MC••••-2026';

  /* estado local mínimo (hojas biométrica y de nombre) */
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-b]'); if (!el) return;
    var k = el.dataset.b;
    if (k === 'bio-8') { S.bioFrom = 'net-8'; } else if (k === 'bio-9') { S.bioFrom = 'net-9'; }
    else if (k === 'bio-ok') { S.revealed = true; }
    else if (k === 'net8') { S.bioAuto = false; S.revealed = false; }
    else if (k === 'name-open') { S.nameOpen = true; } else if (k === 'name-close') { S.nameOpen = false; }
  }, true);
  function later(id, ms, fn) {
    clearTimeout(S.tm[id]);
    S.tm[id] = setTimeout(function () { var s = document.querySelector('[data-screen]'); if (s && s.dataset.screen === id) fn(); }, ms);
  }

  function R(id, title, tab, parent, render, x) { O.register(id, Object.assign({ group: 'B', title: title, tab: tab, parent: parent, sheet: false, lock: false, render: render }, x || {})); }
  function SH(id, title, parent, render) { R(id, title, null, parent, render, { sheet: true }); }
  function H(s) { return '<div class="h2">' + s + '</div>'; }
  function P(s, cls) { return '<p class="sec2 ' + (cls || 'mb8') + '">' + s + '</p>'; }
  function cap(s, cls) { return '<div class="cap ' + (cls || 'mt8') + '">' + s + '</div>'; }
  function lock(s) { return cap(ic('lock', 's') + ' ' + s); }
  function card(s, cls) { return '<div class="cd ' + (cls || '') + '">' + s + '</div>'; }
  function noteBox(icon, s, kind) { return '<div class="note ' + (kind || '') + '">' + ic(icon, 's') + '<span>' + s + '</span></div>'; }
  function tile(icon, sm) { return '<span class="badge">' + ic(icon, 's') + '</span>'; }
  function rowKV(l, v) { return '<div class="li" style="cursor:default"><span class="sp sec2">' + l + '</span><span class="mono">' + v + '</span></div>'; }
  function nbTo(title, to, right) {
    return '<div class="nb"><button class="ibtn" data-go="' + to + '" data-root aria-label="' + (O.state.lang === 'en' ? 'Back' : 'Atrás') + '">' + ic('back') + '</button><span class="nt">' + title + '</span><span class="rt">' + (right || '<span class="ibtn"></span>') + '</span></div>';
  }
  function PW(t) {
    return t('Guardamos una copia cifrada de la contraseña de tu router en nuestros servidores para que puedas recuperarla en otro dispositivo. La clave para descifrarla está solo en tus teléfonos. OrroFi no puede leerla. Puedes borrarla cuando quieras en Ajustes > Privacidad. Si pierdes el teléfono sin copia de la clave, tendrás que volver a introducir la contraseña.',
      'We keep an encrypted copy of your router password on our servers so you can recover it on another device. The key to decrypt it is only on your phones. OrroFi cannot read it. You can delete it at any time in Settings > Privacy. If you lose your phone without a copy of the key, you\'ll have to enter the password again.');
  }
  function OJO(t) { return t('Ojo: no es la contraseña del Wi‑Fi. Busca “contraseña de administrador” o “acceso al router”.', 'Careful: this is not the Wi‑Fi password. Look for “administrator password” or “router access”.'); }
  function sig(d, t) { return d >= -50 ? t('Excelente', 'Excellent') : d >= -60 ? t('Buena', 'Good') : d >= -70 ? t('Regular', 'Fair') : t('Débil', 'Weak'); }
  function nm(v, t) { return Array.isArray(v) ? t(v[0], v[1]) : v; }
  function remind(t) { return btn(ic('bell', 's') + t('Avísame', 'Remind me'), { toast: t('Te avisaremos al volver a casa', "We'll let you know when you're back home") }, 'sm'); }
  function opts(list, on) {
    return '<div role="radiogroup">' + list.map(function (x, i) { return '<button class="opt ' + (i === on ? 'on' : '') + '" role="radio" data-pick="' + i + '"><span class="radio"></span><span>' + x + '</span></button>'; }).join('') + '</div>';
  }
  function factors(t, after) {
    function f(i, a, b, v) { return '<div class="li" style="cursor:default"><span class="badge">' + ic(i, 's') + '</span><span class="t"><b>' + a + '</b><small>' + b + '</small></span>' + v + '</div>'; }
    return '<div class="grp">' +
      f('wifi', t('Señal', 'Signal'), t('Nivel recibido (RSSI)', 'Received level (RSSI)'), '<span class="v mono">−46 dBm · ' + sig(-46, t) + '</span>') +
      f('alert', t('Interferencias', 'Interference'), t('Otras redes en tu canal', 'Other networks on your channel'), '<span class="pill ' + (after ? '' : 'w') + '">' + (after ? t('Bajas', 'Low') : t('Altas', 'High')) + '</span>') +
      f('gauge', t('Velocidad', 'Speed'), t('Hacia internet, medida en el router', 'To the internet, measured at the router'), '<span class="v mono">287/292</span>') +
      f('wifi', t('Carga del canal', 'Channel load'), after ? t('Canal 44 · 80 MHz', 'Channel 44 · 80 MHz') : t('Canal 36 · 80 MHz', 'Channel 36 · 80 MHz'), '<span class="v mono">' + (after ? '23 %' : '78 %') + '</span>') + '</div>';
  }

  /* ---------- onboarding «Mi red» ---------- */
  R('net-entry', ['Mi red · entrada', 'My network · entry'], null, 'fiber', function (c) {
    var f = c.flags;
    c.go(f.localNet === 'unknown' ? 'net-00' : f.localNet === 'denied' ? 'net-00b' : f.localNet === 'hidden' ? 'net-00c' : !f.routerLinked ? 'net-0a' : !f.atHome ? 'net-1d' : 'net-1b');
    return '';
  });

  R('net-00', ['Conectar con tu router', 'Connect to your router'], null, 'fiber', function (c) {
    var t = c.t;
    return top(t('Conectar con tu router', 'Connect to your router')) +
      card('<div class="tc"><span class="badge" style="width:64px;height:64px;margin:0 auto 14px;border-radius:18px">' + ic('wifi', 'xl') + '</span></div>' +
        '<p>' + t('Para mostrarte tus dispositivos y configurar tu Wi‑Fi, OrroFi necesita conectarse a tu router en la red local de casa. Solo lo hace cuando estás conectado a tu Wi‑Fi y abres Mi red o se lo pides.', 'To show your devices and set up your Wi‑Fi, OrroFi needs to connect to your router on your home network. It only does this when you’re on your Wi‑Fi and open Mi red or ask it to.') + '</p>' +
        '<p class="mt12">' + t('Los nombres y direcciones de tus dispositivos y la contraseña del router se cifran en tu iPhone antes de enviarse a nuestros servidores. La clave está solo en tus teléfonos: OrroFi no puede leerlos.', 'Your device names and addresses and your router password are encrypted on your iPhone before being sent to our servers. The key is only on your phones: OrroFi can’t read them.') + '</p>' +
        '<p class="mt12">' + t('A continuación iOS te pedirá permiso. Puedes quitarlo cuando quieras en Ajustes.', 'Next, iOS will ask for permission. You can turn it off anytime in Settings.') + '</p>') +
      '<button class="li tap b-lnk" data-go="net-9b">' + t('Cómo tratamos tus datos', 'How we handle your data') + '</button>' +
      '<div class="b-two">' + btn(t('Ahora no', 'Not now'), { go: 'fiber' }, 'g') + btn(t('Continuar', 'Continue'), { go: 'net-sys-localnet' }) + '</div>';
  });
  SH('net-sys-localnet', ['Red local (iOS)', 'Local network (iOS)'], 'net-00', function (c) {
    var t = c.t;
    return H(t('Red local', 'Local network')) +
      P(t('OrroFi se conecta a tu router en la red local para mostrar tus dispositivos y configurar tu Wi‑Fi. La contraseña del router se cifra en tu iPhone antes de enviarse; OrroFi no puede leerla.', 'OrroFi connects to your router on your local network to show your devices and set up your Wi‑Fi. Your router password is encrypted on your iPhone before it is sent; OrroFi cannot read it.')) +
      '<div class="b-two">' + btn(t('No permitir', "Don't allow"), { go: 'net-00b' }, 'g') + btn(t('Permitir', 'Allow'), { go: 'net-0a' }) + '</div>';
  });
  R('net-00b', ['OrroFi no puede ver tu red', "OrroFi can't see your network"], null, 'net-00', function (c) {
    var t = c.t;
    return top(t('OrroFi no puede ver tu red', 'OrroFi can’t see your network')) +
      card('<div class="tc"><span class="badge" style="width:64px;height:64px;margin:0 auto 14px;border-radius:18px">' + ic('off', 'xl') + '</span></div><p>' +
        t('Para mostrar tus dispositivos, activa el acceso a la red local en Ajustes > Privacidad y seguridad > Red local > OrroFi. El resto de la app funciona igual.', 'To show your devices, turn on local network access in Settings > Privacy & Security > Local Network > OrroFi. The rest of the app works as usual.') + '</p>') +
      btn(t('Abrir Ajustes', 'Open Settings'), { toast: t('Ajustes de iOS (demo)', 'iOS Settings (demo)') }) + btn(t('Ahora no', 'Not now'), { go: 'net-00c' }, 'g');
  });

  /* ---------- Mi red (principal) ---------- */
  function miRed(c, o) {
    var t = c.t, f = c.flags;
    var reason = t('Canal con interferencias', 'Channel with interference');
    var row = '';
    if (o && o.local) {
      row = '<div class="row" style="min-height:44px"><span class="sp sec2">' + t('Acceso a la red local desactivado.', 'Local network access is off.') + '</span>' +
        (f.localNet === 'unknown' ? btn(t('Activar', 'Turn on'), { go: 'net-00' }, 'g sm') : btn(t('Activar', 'Turn on'), { toast: t('Ajustes de iOS (demo)', 'iOS Settings (demo)') }, 'g sm')) + '</div>';
    }
    var acts = [['clock', t('Pausa', 'Pause'), 'net-1e'], ['wifi', 'Wi‑Fi', 'net-8'], ['person', t('Invitados', 'Guests'), 'net-9'], ['doc', t('Historial', 'History'), 'net-7'], ['ant', t('Canal y vecinos', 'Channel and neighbours'), 'net-5'], ['person', t('Familia', 'Family'), 'fam-list']];
    return nbTo(t('Mi red', 'My network'), 'fiber', '<button class="ibtn" data-go="net-6" aria-label="' + t('Seguridad', 'Security') + '">' + ic('shield') + '</button>') +
      card('<div class="row"><span class="badge">' + ic('wifi', 's') + '</span><span class="sp"><b style="font-weight:500">Nexa RX-5200</b><div class="cap">' + t('Wi‑Fi 6 · hace 1 min', 'Wi‑Fi 6 · 1 min ago') + '</div></span><span class="pill"><i class="dot"></i>Internet OK</span></div>' +
        '<button class="li tap b-score" data-go="net-4" aria-label="Wi‑Fi 6 ' + t('de', 'out of') + ' 10. ' + reason + '"><span class="sp"><span class="hud">Wi‑Fi</span><span class="b-sc"><b>6</b><span>' + t('de 10', 'out of 10') + '</span></span><span class="cap" style="display:block">' + reason + '</span></span>' + ic('chev', 's chev') + '</button>') +
      row +
      '<div class="b-acts">' + acts.map(function (a) { return '<button class="b-act tap" data-go="' + a[2] + '">' + ic(a[0]) + '<span>' + a[1] + '</span></button>'; }).join('') + '</div>' +
      '<div class="b-stats"><div><span class="hud">' + t('Dispositivos', 'Devices') + '</span><b>11</b></div><div><span class="hud">' + t('Velocidad', 'Speed') + '</span><b>287<small>/292</small></b><span class="cap">Mbit/s</span></div><div><span class="hud">Ping</span><b>22<small> ms</small></b></div></div>' +
      '<div class="sec">' + t('Dispositivos', 'Devices') + ' · ' + t('9 en línea', '9 online') + '</div>' +
      '<div class="grp">' + DEV.map(function (d, i) {
        return '<button class="li tap" data-go="net-2" style="' + (d[4] ? '' : 'opacity:.55') + '"><span class="badge">' + ic(d[1], 's') + '</span><span class="t"><b>' + nm(d[0], t) + '</b><small>' + d[2] + ' · ' + t(d[3][0], d[3][1]) + '</small></span><span class="v mono">' + d[5] + '</span></button>';
      }).join('') + '</div>';
  }
  R('net-1', ['Mi red', 'My network'], 'fiber', 'fiber', function (c) { S.revealed = false; S.bioAuto = false; return miRed(c); });
  R('net-00c', ['Mi red sin acceso a la red local', 'My network without local access'], 'fiber', 'fiber', function (c) { return miRed(c, { local: true }); });

  R('net-0a', ['Conecta tu router', 'Connect your router'], null, 'fiber', function (c) {
    var t = c.t;
    return top(t('Conecta tu router', 'Connect your router')) +
      '<div class="note ok">' + ic('wifi', 's') + '<span><b>' + t('Estás en el Wi‑Fi de casa', 'You are on your home Wi‑Fi') + '</b><br>MiCasa_5G</span></div>' +
      card('<div class="row"><span class="badge">' + ic('wifi', 's') + '</span><span class="sp">' + t('Router', 'Router') + ' Nexa RX-5200<div class="cap">' + t('Encontrado en tu red (ficticio)', 'Found on your network (fictitious)') + '</div></span><span class="pill"><i class="dot"></i>' + t('Visible', 'Visible') + '</span></div>') +
      card('<div class="sec2">' + t('Para ver y gestionar tu red, la app necesita la contraseña de administrador del router. La encuentras en la pegatina de abajo del aparato.', 'To see and manage your network, the app needs the router’s administrator password. You will find it on the sticker underneath the device.') + '</div><p class="sec2 mt8">' + OJO(t) + '</p>') +
      btn(t('Continuar', 'Continue'), { go: 'net-0b' }) +
      cap(t('Tienes que estar en el Wi‑Fi de tu casa.', 'You must be on your home Wi‑Fi.') + ' ' + t('No lo hagas desde redes públicas ni de invitados.', 'Do not do this from public or guest networks.'), 'tc');
  });
  function sticker(t) {
    return '<div class="b-sticker" aria-label="' + t('Ilustración de la pegatina del router (ficticia)', 'Illustration of the router sticker (fictitious)') + '">Nexa RX-5200<br>SN: ••••••••<br><span>' + t('Usuario administrador', 'Administrator user') + '</span> <b>••••••</b><br><span>' + t('Contraseña de administrador', 'Administrator password') + '</span> <b>••••••••••</b></div>';
  }
  function pwScreen(c, err) {
    var t = c.t;
    return top(t('Contraseña del router', 'Router password')) + sticker(t) +
      '<label class="fm"><span>' + t('Contraseña de administrador', 'Administrator password') + '</span><input type="password" placeholder="' + (err ? '' : t('Escríbela aquí', 'Type it here')) + '" value="' + (err ? '••••••••••' : '') + '"' + (err ? ' style="border-color:var(--er)"' : '') + '></label>' +
      (err ? '<div class="note e" role="alert">' + ic('alert', 's') + '<span><b>' + t('Contraseña incorrecta', 'Wrong password') + '</b><br>' + t('Revisa mayúsculas y guiones en la pegatina y vuelve a intentarlo.', 'Check capitals and dashes on the sticker and try again.') + '</span></div>' : '') +
      cap(OJO(t), 'mt8') + (err ? cap(t('Tras varios intentos, el router puede bloquear el acceso unos minutos.', 'After several attempts, the router may block access for a few minutes.')) : '') + lock(PW(t)) +
      '<div class="mt16">' + (err ? btn(t('Reintentar', 'Try again'), { go: 'net-0b' }) : btn(t('Conectar', 'Connect'), { go: 'net-0d' }) +
        '<div class="cap">DEMO</div><div class="chips mt8"><button class="chip" data-go="net-0c">' + t('Contraseña incorrecta', 'Wrong password') + '</button></div>') + '</div>';
  }
  R('net-0b', ['Contraseña del router', 'Router password'], null, 'net-0a', function (c) { return pwScreen(c, false); });
  R('net-0c', ['Contraseña incorrecta', 'Wrong password'], null, 'net-0b', function (c) { return pwScreen(c, true); });
  R('net-0d', ['Router conectado', 'Router connected'], null, 'net-0b', function (c) {
    var t = c.t;
    return top(t('Router conectado', 'Router connected')) +
      card('<div class="tc"><span class="badge" style="width:72px;height:72px;margin:0 auto 14px;border-radius:20px;background:var(--a);color:var(--ao)">' + ic('check', 'xl') + '</span><div class="h2">' + t('Router conectado', 'Router connected') + '</div><div class="sec2">Nexa RX-5200 · ' + t('11 dispositivos', '11 devices') + '</div></div>') +
      card('<div class="sec2">' + t('Cuando estés en casa verás tu red al momento. Fuera de casa, verás el último dato guardado.', 'When you are at home you will see your network instantly. Away from home, you will see the last saved data.') + '</div>') +
      btn(t('Continuar', 'Continue'), { go: 'net-0e' });
  });
  R('net-0e', ['Tu red, solo para ti', 'Your network, only for you'], null, 'net-0d', function (c) {
    var t = c.t;
    return top(t('Tu red, solo para ti', 'Your network, only for you')) +
      card('<p class="sec2">' + t('Para mostrarte qué dispositivos están conectados y cómo funciona tu Wi‑Fi, la app lee tu router y guarda en nuestros servidores una instantánea de tu red: lista de dispositivos, tipo de conexión y calidad de la señal.', 'To show which devices are connected and how your Wi‑Fi is doing, the app reads your router and stores a snapshot of your network on our servers: device list, connection type and signal quality.') + '</p>' +
        '<ul class="b-ul sec2"><li>' + t('Las direcciones MAC y los nombres de los dispositivos se cifran con una clave que solo está en tu teléfono.', 'Device MAC addresses and names are encrypted with a key that stays on your phone.') + '</li>' +
        '<li>' + t('Las instantáneas se borran a los 30 días; los dispositivos que no aparecen en 90 días, también.', 'Snapshots are deleted after 30 days; devices not seen for 90 days are deleted too.') + '</li>' +
        '<li>' + t('Puedes descargar o borrar todos los datos de tu red en Servicios > Mi red > Seguridad > Privacidad de tus datos.', 'You can download or delete all your network data in Services > My network > Security > Your data privacy.') + '</li></ul>' +
        '<p class="sec2 mt8"><b>' + t('Responsable:', 'Controller:') + '</b> ' + RESP + ' (OrroFi). <b>' + t('Base:', 'Basis:') + '</b> ' + t('prestación del servicio que solicitas.', 'providing the service you request.') + ' <b>' + t('Derechos:', 'Rights:') + '</b> [EMAIL PRIVACIDAD]. <b>' + t('Más información:', 'More information:') + '</b> [URL POLÍTICA]</p>') +
      '<button class="li tap b-lnk" data-go="net-sh-mac">' + t('¿Qué es la dirección MAC?', 'What is a MAC address?') + '</button>' +
      btn(t('Entendido', 'Got it'), { go: 'net-0f' });
  });
  SH('net-sh-mac', ['¿Qué es la dirección MAC?', 'What is a MAC address?'], 'net-0e', function (c) {
    var t = c.t, nx = t('Sin acción en esta fase', 'No action in this phase');
    return H(t('¿Qué es la dirección MAC?', 'What is a MAC address?')) +
      P(t('Es el identificador de cada dispositivo en tu red. Lo usamos solo para reconocer el mismo dispositivo entre instantáneas y mostrarte su historial. Se guarda cifrada y nunca aparece en registros. Muchos móviles usan una MAC aleatoria: en ese caso no intentamos adivinar el fabricante. Los dispositivos de tus invitados se muestran solo durante 30 días.', 'It identifies each device on your network. We use it only to recognise the same device across snapshots and show its history. It is stored encrypted and never appears in logs. Many phones use a random MAC: in that case we don’t try to guess the manufacturer. Your guests’ devices are shown for 30 days only.')) +
      '<div class="chips" style="justify-content:center"><button class="chip" data-toast="' + nx + '" style="color:var(--er)">' + t('Borrar este dispositivo', 'Delete this device') + '</button><button class="chip" data-toast="' + nx + '" style="color:var(--er)">' + t('Borrar todos los datos de mi red', 'Delete all my network data') + '</button></div>' +
      '<div class="mt16">' + btn(t('Cerrar', 'Close'), { close: true }, 'g') + '</div>';
  });
  R('net-0f', ['Protege tu router', 'Protect your router'], null, 'net-0e', function (c) {
    var t = c.t;
    return top(t('Protege tu router', 'Protect your router')) +
      noteBox('shield', '<b>' + t('Cuidemos tu router', 'Let us look after your router') + '</b><br>' + t('Te recomendamos una mejora para que tu red esté más protegida.', 'We recommend an improvement to keep your network better protected.'), 'ok') +
      '<div class="grp">' + li({ i: 'lock', t: t('Una contraseña de administrador nueva y segura', 'A new, secure administrator password'), s: t('La actual es la de la pegatina', 'The current one is on the sticker'), nochev: true }) + '</div>' +
      cap(ic('lock', 's') + ' ' + t('Cambiamos la contraseña de administrador del router (la de la pegatina) por una nueva y segura. Tu Wi‑Fi no cambia.', 'We change the router’s administrator password (the one on the sticker) to a new, secure one. Your Wi‑Fi does not change.')) +
      '<div class="mt16">' + btn(ic('shield', 's') + t('Cambiar contraseña', 'Change password'), { go: 'net-0g' }) + btn(t('Más tarde', 'Later'), { go: 'net-1' }, 'g') + '</div>';
  });
  R('net-0g', ['Router protegido', 'Router protected'], null, 'net-0f', function (c) {
    var t = c.t;
    return top(t('Router protegido', 'Router protected')) +
      card('<div class="tc"><span class="badge" style="width:72px;height:72px;margin:0 auto 14px;border-radius:20px;background:var(--a);color:var(--ao)">' + ic('shield', 'xl') + '</span><div class="h2">' + t('Todo listo', 'All set') + '</div><div class="sec2">' + t('Contraseña de administrador cambiada', 'Administrator password changed') + '</div></div>') +
      '<label class="fm"><span>' + t('Contraseña nueva del router', 'New router password') + '</span><input type="password" value="••••••••••••" readonly></label>' +
      cap(t('Apúntala en un lugar seguro. Si cambias de teléfono, la necesitarás.', 'Write it down in a safe place. If you change phones, you will need it.'), 'mt8') + lock(PW(t)) +
      '<div class="mt16">' + btn(t('Continuar', 'Continue'), { go: 'net-0h' }) + '</div>';
  });
  R('net-0h', ['Refuerzo opcional', 'Optional hardening'], null, 'net-0g', function (c) {
    var t = c.t, tg = t('El Wi‑Fi se corta unos 30 segundos', 'Wi‑Fi drops for about 30 seconds');
    return top(t('Refuerzo opcional', 'Optional hardening')) +
      card('<div class="sec2">' + t('Dos pasos más, cada uno opcional. Puedes elegir solo uno.', 'Two more steps, each optional. You can pick just one.') + '</div>') +
      card('<div class="row"><span class="badge">' + ic('shield', 's') + '</span><span class="sp">' + t('Desactivar WPS', 'Turn off WPS') + '</span>' + sw(false, { toast: tg }) + '</div>') +
      card('<div class="row"><span class="badge">' + ic('wifi', 's') + '</span><span class="sp">' + t('Activar WPA3 (PMF obligatorio)', 'Turn on WPA3 (PMF required)') + '</span>' + sw(false, { toast: tg }) + '</div>' +
        cap(t('El Wi‑Fi se corta unos 30 segundos y algún aparato antiguo podría no conectarse.', 'Wi‑Fi drops for about 30 seconds and some older device might not connect.'), 'mt8')) +
      btn(t('Listo', 'Done'), { go: 'net-1' });
  });

  /* ---------- estados de Mi red ---------- */
  R('net-1b', ['Mirando tu red', 'Looking at your network'], 'fiber', 'fiber', function (c) {
    var t = c.t;
    later('net-1b', 1600, function () { O.go('net-1'); });
    return top(t('Mi red', 'My network'), { back: false }) +
      card('<div class="row"><span class="badge">' + ic('spark', 's') + '</span><span class="sp"><b style="font-weight:500">' + t('Estoy mirando tu red…', 'I am looking at your network…') + '</b><div class="b-sk" style="width:70%;margin-top:8px"></div></span></div>') +
      [1, 2, 3, 4, 5].map(function () { return '<div class="cd"><div class="row"><div class="b-sk" style="width:40px;height:40px;border-radius:12px"></div><span class="sp"><div class="b-sk" style="width:60%;margin-bottom:8px"></div><div class="b-sk" style="width:85%;height:10px"></div></span></div></div>'; }).join('');
  });
  R('net-1c', ['Router sin conexión', 'Router offline'], 'fiber', 'net-1', function (c) {
    var t = c.t;
    return top(t('Mi red', 'My network')) +
      state('off', t('No veo tu router…', 'I cannot see your router…'), t('Mostramos los últimos datos de hoy a las 18:42. Comprueba que el router está encendido.', 'We show today’s last data from 18:42. Check that the router is on.'), btn(t('Reintentar', 'Try again'), { go: 'net-1b' }), 'e');
  });
  R('net-1d', ['Fuera de casa', 'Away from home'], 'fiber', 'net-1', function (c) {
    var t = c.t;
    return top(t('Mi red', 'My network')) +
      state('clock', t('Estás fuera de casa', 'You are away from home'), t('Estaré listo cuando vuelvas a casa.', 'I will be ready when you are back home.') + '<br>' + t('Mostramos el último dato guardado. Actualizado hace 3 h (hoy, 18:42).', 'We show the last saved data. Updated 3 h ago (today, 18:42).'),
        remind(t) + '<div class="mt8" style="width:100%;max-width:300px">' + btn(t('Ver último estado', 'See last status'), { go: 'net-1' }, 'g') + '</div>', 'o');
  });
  SH('net-1e', ['Pausar internet', 'Pause internet'], 'net-1', function (c) {
    var t = c.t;
    return H(t('Pausar internet', 'Pause internet')) +
      P(t('Pausa todo el internet de la red de casa, no solo un dispositivo. Se reanuda solo al terminar.', 'Pauses internet for the whole home network, not just one device. It resumes by itself when the time is up.')) +
      opts([t('30 min', '30 min'), '1 h', t('Hasta mañana', 'Until tomorrow')], 0) +
      '<div class="mt12">' + btn(ic('clock', 's') + t('Pausar', 'Pause'), { toast: t('Internet en pausa', 'Internet paused'), go: 'net-1' }) + btn(t('Cancelar', 'Cancel'), { go: 'net-1' }, 'g') + '</div>';
  });

  /* ---------- dispositivos ---------- */
  R('net-2', ['Dispositivo', 'Device'], 'fiber', 'net-1', function (c) {
    var t = c.t;
    return top(t('Dispositivo', 'Device')) +
      '<div class="row mb8" style="gap:14px"><span class="badge" style="width:56px;height:56px;border-radius:16px;background:var(--a);color:var(--ao)">' + ic('phone', 'l') + '</span><span class="sp"><div class="h2" style="margin:0">iPhone</div><div class="sec2">' + t('Apple · en línea', 'Apple · online') + '</div></span><span class="pill"><i class="dot"></i>' + t('En línea', 'Online') + '</span></div>' +
      '<div class="grp">' + rowKV(t('Conexión', 'Connection'), 'Wi‑Fi 5 GHz') + rowKV(t('Señal', 'Signal'), '−48 dBm · ' + sig(-48, t)) + rowKV(t('Tráfico hoy', 'Traffic today'), '↓ 1,2 GB · ↑ 180 MB') + rowKV(t('Dirección IP', 'IP address'), '•••.•••.•.••') + rowKV('MAC', '••:••:••:••:••:••') + '</div>' +
      card('<div class="row"><span class="sp">' + t('Control parental', 'Parental control') + '<div class="cap">' + t('Sin internet de 22:00 a 07:00', 'No internet from 22:00 to 07:00') + '</div></span>' + sw(true) + '</div>' +
        '<div class="seg mt12" aria-label="' + t('Días', 'Days') + '"><button class="on" data-pick="a">' + t('Todos', 'All') + '</button><button data-pick="w">' + t('L–V', 'Mon–Fri') + '</button><button data-pick="e">' + t('Fin de semana', 'Weekend') + '</button></div>' +
        '<div class="row"><div class="sp"><div class="cap">' + t('Desde', 'From') + '</div><div class="mono">22:00</div></div><div class="sp"><div class="cap">' + t('Hasta', 'Until') + '</div><div class="mono">07:00</div></div></div>') +
      '<div class="b-two">' + btn(ic('check', 's') + t('Es mío', 'It is mine'), { toast: t('Guardado', 'Saved') }) + btn(ic('off', 's') + t('Bloquear', 'Block'), { toast: t('Bloqueado', 'Blocked'), go: 'net-1' }, 'd') + '</div>';
  });
  R('net-3', ['Aviso en bloqueo', 'Lock-screen alert'], null, 'net-1', function (c) {
    var t = c.t;
    return '<div class="pushc tap" role="button" tabindex="0" data-b="name-close" data-go="net-3b"><div class="pi">O</div><div class="sp" style="min-width:0"><div class="row" style="justify-content:space-between"><b>OrroFi</b><span class="cap">' + t('ahora', 'now') + '</span></div><b>' + t('Nuevo dispositivo en tu red', 'New device on your network') + '</b><span>' + t('«Dispositivo desconocido» (Espressif Inc.) se ha conectado al Wi‑Fi 2,4 GHz. ¿Eres tú?', '“Unknown device” (Espressif Inc.) joined the 2.4 GHz Wi‑Fi. Is it you?') + '</span>' +
      '<div class="b-two mt8"><button class="btn sm" data-b="name-open" data-go="net-3b" style="flex:1">' + t('Es mío', 'It is mine') + '</button><button class="btn sm g" data-toast="' + t('Bloqueado', 'Blocked') + '" data-go="net-1" style="flex:1">' + t('Bloquear', 'Block') + '</button></div></div></div>';
  }, { lock: true });
  R('net-3b', ['Nuevo dispositivo', 'New device'], null, 'net-1', function (c) {
    var t = c.t;
    var sheet = !S.nameOpen ? '' :
      '<div class="scrim b-fx" data-b="name-close" data-go="net-3b"></div><div class="sheet b-fx" role="dialog" aria-label="' + t('Nombre del dispositivo', 'Device name') + '"><i class="grab"></i>' + H(t('¿Cómo se llama?', 'What is it called?')) +
      '<div class="cap">' + t('Nombre sugerido', 'Suggested name') + '</div><div class="fm mt8"><input value="' + t('Enchufe del salón', 'Living-room plug') + '" aria-label="' + t('Nombre del dispositivo', 'Device name') + '"></div>' +
      btn(t('Guardar', 'Save'), { b: 'name-close', go: 'net-1' }) + '</div>';
    return top(t('Nuevo dispositivo', 'New device')) +
      noteBox('alert', '<b>' + t('Nuevo dispositivo en tu red', 'New device on your network') + '</b><br>' + t('Conectado hoy a las 21:14', 'Connected today at 21:14'), '') +
      card('<div class="tc"><span class="badge" style="width:72px;height:72px;margin:0 auto 14px;border-radius:20px">' + ic('info', 'xl') + '</span><div class="h2">' + t('Dispositivo desconocido', 'Unknown device') + '</div><div class="sec2">Espressif Inc. (MAC) · ' + t('Wi‑Fi 2,4 GHz', 'Wi‑Fi 2.4 GHz') + ' · −67 dBm</div></div>') +
      card('<div class="sec2">' + t('Muchos aparatos de casa (enchufes, bombillas, sensores) usan chips Espressif. Si no reconoces este, bloquéalo: lo podrás desbloquear después.', 'Many home gadgets (plugs, bulbs, sensors) use Espressif chips. If you do not recognise this one, block it: you can unblock it later.') + '</div>') +
      '<div class="b-two">' + '<button class="btn" data-b="name-open" data-go="net-3b">' + ic('check', 's') + t('Es mío', 'It is mine') + '</button>' + '<button class="btn d" data-b="name-close" data-toast="' + t('Bloqueado', 'Blocked') + '" data-go="net-1">' + ic('off', 's') + t('Bloquear', 'Block') + '</button></div>' + sheet;
  });

  /* ---------- estado y mejora ---------- */
  R('net-4', ['Estado de la red', 'Network status'], 'fiber', 'net-1', function (c) {
    var t = c.t;
    return top(t('Estado de la red', 'Network status')) +
      card('<span class="hud">' + t('Calidad del Wi‑Fi', 'Wi‑Fi quality') + '</span><div class="b-sc big"><b>6</b><span>' + t('de 10', 'out of 10')  + '</span></div>' +
        cap(t('Suma señal, interferencias, velocidad y carga del canal.', 'Adds up signal, interference, speed and channel load.') + ' ' + t('Actualizado hace 1 min.', 'Updated 1 min ago.'))) +
      factors(t, false) +
      btn(ic('bolt', 's') + t('Mejorar', 'Improve'), { go: c.flags.atHome ? 'net-4b' : 'net-4d' }) +
      cap(t('Un toque: OrroFi cambia el canal y el ancho en tu router.', 'One tap: OrroFi changes the channel and width on your router.'), 'tc');
  });
  R('net-4b', ['Mejorando', 'Improving'], 'fiber', 'net-4', function (c) {
    var t = c.t, L = [t('Buscando canal', 'Finding channel'), t('Aplicando', 'Applying'), t('Comprobando', 'Checking')];
    later('net-4b', 3000, function () { O.go('net-4c'); });
    return top(t('Estado de la red', 'Network status'), { back: false }) +
      card('<span class="hud">' + t('Calidad del Wi‑Fi', 'Wi‑Fi quality') + '</span><div class="b-sc big"><b>6</b><span>' + t('de 10', 'out of 10') + '</span></div>') +
      '<div class="cd" role="status"><b style="font-weight:500">' + t('Mejorando…', 'Improving…') + '</b><div class="sec2">' + t('Probando un canal más libre. El Wi‑Fi se corta unos 30 segundos.', 'Trying a freer channel. Wi‑Fi drops for about 30 seconds.') + '</div>' +
      '<ul class="steps" role="list">' + L.map(function (x, i) { return '<li class="' + (i < 1 ? 'd' : '') + ' b-st' + (i === 1 ? ' cur' : '') + '"' + (i === 1 ? ' aria-current="step"' : '') + '><span class="sd">' + (i < 1 ? ic('check', 's') : '') + '</span>' + x + '</li>'; }).join('') + '</ul></div>' +
      btn(ic('bolt', 's') + t('Mejorando…', 'Improving…'), {}, '', 'disabled') + cap(t('No apagues el router.', 'Do not switch the router off.'), 'tc');
  });
  R('net-4c', ['Resultado', 'Result'], 'fiber', 'net-4', function (c) {
    var t = c.t;
    return top(t('Estado de la red', 'Network status'), { back: false }) +
      card('<span class="hud">' + t('Calidad del Wi‑Fi', 'Wi‑Fi quality') + '</span><div class="b-sc big"><b>9</b><span>' + t('de 10', 'out of 10') + '</span></div>') +
      noteBox('check', '<b>' + t('Antes 6 de 10 → Ahora 9 de 10', 'Before 6 out of 10 → Now 9 out of 10') + '</b><br>' + t('Qué cambió: canal 36 → 44. Ancho 80 MHz sin cambios.', 'What changed: channel 36 → 44. Width 80 MHz unchanged.'), 'ok') +
      factors(t, true) + btn(ic('check', 's') + t('Listo', 'Done'), { go: 'net-1' });
  });
  R('net-4d', ['Fuera de casa', 'Away from home'], 'fiber', 'net-4', function (c) {
    var t = c.t;
    return top(t('Estado de la red', 'Network status')) +
      card('<span class="hud">' + t('Calidad del Wi‑Fi', 'Wi‑Fi quality') + '</span><div class="b-sc big m"><b>6</b><span>' + t('de 10', 'out of 10') + '</span></div>' + cap(t('Último dato de hoy a las 18:42.', 'Last data from today at 18:42.'))) +
      card('<div class="row"><span class="sp"><b style="font-weight:500">' + t('Estaré listo cuando vuelvas a casa', 'I will be ready when you are back home') + '</b><div class="cap">' + t('Te aviso o lo hago solo al volver.', 'I will remind you, or do it myself, when you are back.') + '</div></span>' + remind(t) + '</div>') +
      factors(t, false) + btn(t('Volver', 'Back'), { go: 'net-4' }, 'g') + cap(t('Disponible cuando estés en casa', 'Available when you are home'), 'tc');
  });
  R('net-5', ['Canal y vecinos', 'Channel and neighbours'], 'fiber', 'net-1', function (c) {
    var t = c.t;
    return top(t('Canal y vecinos', 'Channel and neighbours')) +
      '<div class="grp">' + li({ t: t('Canal actual', 'Current channel'), s: t('Banda de 5 GHz · ancho 80 MHz', '5 GHz band · 80 MHz width'), v: '44', nochev: true }) + '</div>' +
      card('<div class="hud">' + t('Redes vecinas por canal (ficticio)', 'Neighbouring networks per channel (fictitious)') + '</div>' +
        '<div class="b-chan" role="img" aria-label="' + t('Ocupación de canales: el canal 44 está libre', 'Channel occupancy: channel 44 is free') + '">' + CH.map(function (x) { return '<i class="' + (x[0] === 44 ? 'me' : '') + '" style="height:' + (x[0] === 44 ? 8 : Math.max(10, x[1] * 14)) + '%"></i>'; }).join('') + '</div>' +
        '<div class="b-chx">' + CH.map(function (x) { return '<span class="' + (x[0] === 44 ? 'me' : '') + '">' + x[0] + '</span>'; }).join('') + '</div>' +
        cap(t('Tu canal 44 está libre: ninguna red vecina lo usa. Los demás tienen entre 1 y 7 redes.', 'Your channel 44 is free: no neighbouring network uses it. The others have 1 to 7 networks.'), 'mt12')) +
      card('<div class="row"><span class="badge">' + ic('globe', 's') + '</span><span class="sp">' + t('Vecinos con OrroFi: 4 · sin interferencias', 'Neighbours with OrroFi: 4 · no interference') + '<div class="cap">' + t('Actualizado esta noche, 03:00', 'Updated tonight, 03:00') + '</div></span></div>') +
      card('<div class="sec2">' + t('Cada noche OrroFi reparte los canales entre los routers cercanos y aplica el mejor para ti. No tienes que escanear nada.', 'Every night OrroFi shares out the channels among nearby routers and applies the best one for you. You do not need to scan anything.') + '</div>') +
      btn(t('Volver', 'Back'), { go: 'net-1' }, 'g') + cap(t('¿Quieres mejorarlo ya? Usa «Mejorar» en Estado de la red.', 'Want to improve it now? Use “Improve” in Network status.'), 'tc');
  });
  R('net-6', ['Seguridad', 'Security'], 'fiber', 'net-1', function (c) {
    var t = c.t;
    return top(t('Seguridad', 'Security')) +
      noteBox('shield', '<b>' + t('Cuidemos tu router', 'Let us look after your router') + '</b><br>' + t('Te recomendamos dos mejoras para que tu red esté más protegida.', 'We recommend two improvements to keep your network better protected.'), 'ok') +
      card('<div class="row"><span class="badge">' + ic('lock', 's') + '</span><span class="sp">' + t('Contraseña del router', 'Router password') + '<div class="cap">' + t('Sigue siendo la de fábrica', 'It is still the factory one') + '</div></span><span class="pill w">' + t('Recomendado', 'Recommended') + '</span></div>' +
        '<div class="mt12">' + btn(t('Cambiar contraseña del router', 'Change router password'), { go: 'net-0g' }, 'g') + '</div>' +
        cap(t('Cambiamos la contraseña de administrador del router (la de la pegatina) por una nueva y segura. Tu Wi‑Fi no cambia.', 'We change the router’s administrator password (the one on the sticker) to a new, secure one. Your Wi‑Fi does not change.')) + lock(PW(t))) +
      card('<div class="row"><span class="badge">' + ic('shield', 's') + '</span><span class="sp">' + t('Cifrado del Wi‑Fi', 'Wi‑Fi encryption') + '<div class="cap">' + t('Ahora: WPA2 · Recomendado: WPA3', 'Now: WPA2 · Recommended: WPA3') + '</div></span><span class="pill w">WPA2</span></div>' +
        cap(t('WPA3 protege mejor tu contraseña. El Wi‑Fi se corta unos 30 segundos y algún aparato antiguo (por ejemplo, Tapo L530) podría no conectarse.', 'WPA3 protects your password better. Wi‑Fi drops for about 30 seconds and some older device (for example Tapo L530) might not connect.'), 'mt12') +
        '<div class="mt12">' + btn(t('Pasar a WPA3', 'Switch to WPA3'), { toast: t('El Wi‑Fi se corta unos 30 segundos', 'Wi‑Fi drops for about 30 seconds') }) + '</div>') +
      card('<div class="row"><span class="badge">' + ic('check', 's') + '</span><span class="sp">' + t('Firmware del router', 'Router firmware') + '<div class="cap">' + t('Versión instalada: 2.4.1 (ficticia)', 'Installed version: 2.4.1 (fictitious)') + '</div></span><span class="pill">' + t('Al día', 'Up to date') + '</span></div>') +
      '<div class="sec">' + t('Privacidad de tus datos', 'Your data privacy') + '</div><div class="grp">' +
      li({ t: t('Descargar los datos de mi red', 'Download my network data'), toast: t('Te enviaremos tus datos por e-mail', "We'll send your data by e-mail") }) +
      (c.flags.isOwner ? li({ t: '<span style="color:var(--er)">' + t('Borrar todos los datos de mi red', 'Delete all my network data') + '</span>', go: 'del-entry' }) : '') + '</div>' +
      '<button class="li tap b-lnk" data-go="net-9b">' + t('Privacidad de tus datos', 'Your data privacy') + '</button>';
  });
  R('net-7', ['Historial y reinicio', 'History and restart'], 'fiber', 'net-1', function (c) {
    var t = c.t, nx = t('Sin acción en esta fase', 'No action in this phase');
    function h(cls, a, b, link) { return '<div class="b-h ' + cls + '"><div>' + a + '</div><div class="cap">' + b + '</div>' + (link ? '<button class="b-lnk2" data-toast="' + nx + '">' + t('Ver detalles', 'See details') + '</button>' : '') + '</div>'; }
    return top(t('Historial y reinicio', 'History and restart')) +
      card('<div class="hud mb8">' + t('Últimos 7 días', 'Last 7 days') + '</div>' +
        h('e', t('Sin internet · 14 min', 'No internet · 14 min'), t('Mar 15 dic, 03:12 · caída de la fibra', 'Tue 15 Dec, 03:12 · fibre outage'), 1) +
        h('w', t('Wi‑Fi inestable · 6 min', 'Unstable Wi‑Fi · 6 min'), t('Lun 14 dic, 19:40 · interferencias en 2,4 GHz', 'Mon 14 Dec, 19:40 · interference on 2.4 GHz'), 1) +
        h('', t('Router reiniciado', 'Router restarted'), t('Dom 13 dic, 10:05 · desde la app', 'Sun 13 Dec, 10:05 · from the app'))) +
      card('<div class="row"><span class="badge">' + ic('bolt', 's') + '</span><span class="sp">' + t('Reiniciar router', 'Restart router') + '<div class="cap">' + t('Tarda unos 2 minutos', 'Takes about 2 minutes') + '</div></span></div><div class="mt12">' + btn(ic('bolt', 's') + t('Reiniciar', 'Restart router'), { go: 'net-7-confirm' }) + '</div>');
  });
  SH('net-7-confirm', ['Confirmar reinicio', 'Confirm restart'], 'net-7', function (c) {
    var t = c.t;
    return H(t('¿Reiniciar el router?', 'Restart the router?')) +
      P(t('Te quedarás sin internet ni Wi‑Fi unos 2 minutos. Las llamadas y las videollamadas se cortarán.', 'You will have no internet or Wi‑Fi for about 2 minutes. Calls and video calls will drop.')) +
      btn(ic('bolt', 's') + t('Reiniciar ahora', 'Restart now'), { toast: t('Reiniciando…', 'Restarting…'), close: true }, 'd') + btn(t('Cancelar', 'Cancel'), { close: true }, 'g');
  });

  /* ---------- Wi‑Fi e invitados ---------- */
  R('net-8', ['Wi‑Fi', 'Wi‑Fi'], 'fiber', 'net-1', function (c) {
    var t = c.t;
    if (!S.bioAuto) { S.bioAuto = true; S.bioFrom = 'net-8'; c.go('net-sh-bio'); return ''; }
    return top('Wi‑Fi') +
      card('<div class="fm"><span>' + t('Nombre de la red', 'Network name') + '</span><input value="MiCasa_5G" aria-label="' + t('Nombre de la red', 'Network name') + '"></div>' +
        '<div class="cap">' + t('Contraseña', 'Password') + '</div><div class="row mt8"><span class="sp mono">' + (S.revealed ? FAKEPW : '••••••••••••') + '</span><button class="ibtn" data-b="bio-8" data-go="net-sh-bio" aria-label="' + t('Mostrar contraseña (pide Face ID)', 'Show password (asks for Face ID)') + '">' + ic('eye', 's') + '</button></div>' +
        cap(t('Mínimo 8 caracteres. Al guardar, todos tus dispositivos tendrán que volver a conectarse.', 'At least 8 characters. When you save, all your devices will have to reconnect.')) +
        lock(t('La contraseña del Wi‑Fi la leemos de tu router solo cuando la pides. No la guardamos.', 'We read the Wi‑Fi password from your router only when you ask for it. We do not store it.'))) +
      card('<div class="cap" style="margin:0">' + t('Para guardar cambios usamos la contraseña de administrador del router.', 'To save changes we use the router’s administrator password.') + ' ' + PW(t) + '</div>') +
      card('<div class="row"><span class="sp">' + t('Redes separadas (2,4 y 5 GHz)', 'Separate networks (2.4 and 5 GHz)') + '<div class="cap">' + t('Opción avanzada: dos nombres de red, uno por banda', 'Advanced option: two network names, one per band') + '</div></span>' + sw(false, { toast: t('Sin acción en esta fase', 'No action in this phase') }) + '</div>') +
      noteBox('info', t('Nuki y Tapo tendrán que reconectarse con la contraseña nueva.', 'Nuki and Tapo will have to reconnect with the new password.'), '') +
      btn(t('Guardar cambios', 'Save changes'), { toast: t('Guardado', 'Saved') }) + btn(t('Cancelar', 'Cancel'), { go: 'net-1' }, 'g');
  }, {});
  SH('net-sh-bio', ['Confirmar con Face ID', 'Confirm with Face ID'], 'net-8', function (c) {
    var t = c.t, d = O.listing().screens['net-sh-bio'];
    d.parent = S.bioFrom || 'net-8';
    return '<div class="row" style="gap:14px"><span class="badge" style="width:48px;height:48px;border-radius:14px">' + ic('face', 'l') + '</span><span class="sp"><div class="h2" style="margin:0">' + t('Confirma con Face ID', 'Confirm with Face ID') + '</div><div class="cap">' + t('o con tu huella o el código del teléfono', 'or with your fingerprint or phone passcode') + '</div></span></div>' +
      P(t('Para ver la contraseña necesitamos confirmar que eres tú.', 'To show the password we need to confirm it is you.'), 'mt12') +
      btn(ic('face', 's') + t('Confirmar', 'Confirm'), { b: 'bio-ok', close: true }) + btn(t('Cancelar', 'Cancel'), { close: true }, 'g');
  });
  function qr() {
    var s = 7, r = function () { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }, c = '', N = 25;
    function fin(a, b) { return '<rect x="' + a + '" y="' + b + '" width="7" height="7"/><rect x="' + (a + 1) + '" y="' + (b + 1) + '" width="5" height="5" fill="var(--c-solid)"/><rect x="' + (a + 2) + '" y="' + (b + 2) + '" width="3" height="3"/>'; }
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) { if ((x < 8 && y < 8) || (x > 16 && y < 8) || (x < 8 && y > 16)) continue; if (r() > .52) c += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>'; }
    return '<svg viewBox="0 0 ' + N + ' ' + N + '" shape-rendering="crispEdges" fill="currentColor" role="img" aria-label="QR (ficticio)">' + c + fin(0, 0) + fin(18, 0) + fin(0, 18) + '</svg>';
  }
  R('net-9', ['Red de invitados', 'Guest network'], 'fiber', 'net-1', function (c) {
    var t = c.t;
    return top(t('Red de invitados', 'Guest network')) +
      card('<div class="row"><span class="sp">' + t('Red de invitados', 'Guest network') + '<div class="cap">' + t('Activa · separada de tu red de casa', 'On · separate from your home network') + '</div></span>' + sw(true) + '</div>') +
      card('<div class="tc"><div class="b-qr">' + qr() + '</div><div class="mt8">MIWIFI_INVITADOS</div><div class="mono sec2">' + t('Contraseña', 'Password') + ': ' + (S.revealed ? 'Inv••-2026' : '••••••••') + '</div>' + cap(t('Escanea con la cámara para conectarte. QR de ejemplo.', 'Scan with the camera to connect. Sample QR.'), 'mt8') + '</div>') +
      '<div class="b-two">' + btn(ic('send', 's') + t('Compartir', 'Share'), { toast: t('Sin acción en esta fase', 'No action in this phase') }) + '<button class="btn g" data-b="bio-9" data-go="net-sh-bio">' + ic('lock', 's') + t('Ver contraseña', 'Show password') + '</button></div>' +
      '<div class="cap">' + t('Apagado automático', 'Auto-off') + '</div><div class="seg mt8" role="radiogroup" aria-label="' + t('Apagado automático', 'Auto-off') + '"><button data-pick="4">4 h</button><button class="on" data-pick="24">24 h</button><button data-pick="n">' + t('No apagar', 'Never') + '</button></div>' +
      cap(t('Red de invitados aislada: salen a internet, pero no ven tus dispositivos. No es la Wi‑Fi OrroFi.', 'Isolated guest network: guests get internet but cannot see your devices. It is not Wi‑Fi OrroFi.'));
  });
  SH('net-sh-delcopy', ['¿Borrar la copia?', 'Delete the copy?'], 'net-9b', function (c) {
    var t = c.t;
    return H(t('¿Borrar la copia?', 'Delete the copy?')) + P(t('Tendrás que volver a introducir la contraseña en otro dispositivo.', 'You will need to enter the password again on another device.')) +
      btn(t('Borrar', 'Delete'), { toast: t('Copia borrada', 'Copy deleted'), go: 'net-9b' }, 'd') + btn(t('Cancelar', 'Cancel'), { close: true }, 'g');
  });
  R('net-9b', ['Ajustes › Privacidad', 'Settings › Privacy'], 'profile', 'profile', function (c) {
    var t = c.t, f = c.flags;
    return top(t('Privacidad', 'Privacy')) + cap(t('Perfil > Ajustes > Privacidad', 'Profile > Settings > Privacy'), 'mb8') +
      card('<div class="row"><span class="badge">' + ic('lock', 's') + '</span><span class="sp">' + t('Copia cifrada de la contraseña del router', 'Encrypted copy of the router password') + '<div class="cap">' + t('Guardada cifrada · la clave solo está en tus teléfonos', 'Stored encrypted · the key is only on your phones') + '</div></span>' + btn(t('Borrar', 'Delete'), { go: 'net-sh-delcopy' }, 'd sm') + '</div>' +
        cap(PW(t), 'mt12') + cap(t('Si pierdes todos tus teléfonos vinculados, no podremos recuperar los datos de Mi red, porque la clave solo está en ellos. Tendrás que restablecer Mi red y empezar de nuevo.', 'If you lose all your linked phones, we can’t recover your Mi red data, because the key is only on them. You’ll need to reset Mi red and start again.'), 'mt12')) +
      '<div class="sec">' + t('Privacidad de tus datos', 'Your data privacy') + '</div><div class="grp">' +
      li({ t: t('Descargar los datos de mi red', 'Download my network data'), toast: t('Te enviaremos tus datos por e-mail', "We'll send your data by e-mail") }) +
      (f.isOwner ? li({ t: '<span style="color:var(--er)">' + t('Borrar todos los datos de mi red', 'Delete all my network data') + '</span>', go: 'del-entry' }) : '') +
      (f.isOwner ? li({ t: t('Restablecer Mi red', 'Reset Mi red'), go: 'rst-entry' }) : '') +
      li({ t: t('No lo he hecho yo', 'I didn’t do this'), s: t('Avísanos si ves algo en tu cuenta o en Mi red que no has hecho tú.', 'Tell us if you see something in your account or Mi red that you didn’t do.'), go: 'rp-18a' }) + '</div>';
  });

  /* ---------- Tu operador (solo desde el mapa; función de riesgo alto, «próximamente») ---------- */
  function opScr(c, done) {
    var t = c.t;
    var scope = card('<div class="row"><span class="badge">' + ic('lock', 's') + '</span><span class="sp">' + t('Acceso: solo configuración Wi‑Fi · hasta 30/11/2026', 'Access: Wi‑Fi settings only · until 30/11/2026') + '<div class="cap">' + t('Puedes cambiarlo o retirarlo cuando quieras.', 'You can change or withdraw it whenever you like.') + '</div></span></div>');
    if (done) {
      function e(i, a, b) { return li({ i: i, t: a, s: b, nochev: true }); }
      return top(t('Tu operador', 'Your operator')) +
        noteBox('check', '<b>' + t('Consentimiento firmado', 'Consent signed') + '</b><br>' + t('20/11/2026, 21:20 · puedes retirarlo cuando quieras.', '20/11/2026, 21:20 · you can withdraw it whenever you like.'), 'ok') + scope +
        '<div class="sec">' + t('Lo que Orro hizo por ti', 'What Orro did for you') + '</div><div class="grp">' +
        e('alert', t('Avería abierta: sin servicio de fibra', 'Fault opened: no fibre service'), '27/11/2026, 09:05') + e('cal', t('Cita de técnico solicitada', 'Technician visit requested'), '27/11/2026, 09:07') + e('doc', t('Consulta del estado de tu línea', 'Line status checked'), '22/11/2026, 21:31') + '</div>' +
        btn(ic('doc', 's') + t('Abrir cabina del operador', 'Open operator portal'), { toast: t('Sin acción en esta fase', 'No action in this phase') }) + btn(t('Revocar acceso', 'Revoke access'), { toast: t('Acceso revocado (demo)', 'Access revoked (demo)') }, 'd') + btn(t('Volver', 'Back'), { back: true }, 'g');
    }
    return top(t('Tu operador', 'Your operator')) +
      card('<div class="sec2">' + t('Para atenderte desde OrroFi con tu operador, necesitamos tu consentimiento para consultar y gestionar tu cuenta en su nombre.', 'To help you through OrroFi with your operator, we need your consent to look up and manage your account on your behalf.') + '</div>') +
      '<div class="gate">' + card(U.dp(t) +
        '<label class="chk"><input type="checkbox" data-gate><span>' + t('He leído la información sobre protección de datos.', 'I have read the data protection information.') + '</span></label>') +
      scope + '<div class="fm"><span>' + t('Tu firma', 'Your signature') + '</span><input value="Ana Ejemplo" aria-label="' + t('Tu firma', 'Your signature') + '"></div>' +
      '<button class="btn gate-btn" data-go="net-12b" disabled aria-disabled="true">' + t('Confirmar y firmar', 'Confirm and sign') + '</button></div>' +
      btn(t('Volver', 'Back'), { back: true }, 'g');
  }
  R('net-12', ['Tu operador', 'Your operator'], 'fiber', 'profile', function (c) { return opScr(c, false); });
  R('net-12b', ['Tu operador · firmado', 'Your operator · signed'], 'fiber', 'net-12', function (c) { return opScr(c, true); });
})();
