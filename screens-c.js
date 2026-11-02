/* screens-c.js — sesión 3 (grupo C: familia, borrado, restablecer, «No lo he hecho yo»). Textos literales de v5-network/src.html (es/en). */
(function () {
  var O = OrroProto, U = O.ui, ic = U.ic, btn = U.btn, top = U.top;
  var DT = '3/11/2026, 22:55';                      /* datos ficticios del grupo */
  var ADDED = ['16/12/2026 a las 21:14', '16/12/2026 at 21:14'];
  var FACE = ['Face ID / código (demo)', 'Face ID / passcode (demo)'];
  function R(id, title, tab, parent, render, x) { O.register(id, Object.assign({ group: 'C', title: title, tab: tab, parent: parent, sheet: false, lock: false, render: render }, x || {})); }
  function card(icon, title, paras) {
    return '<div class="cd tc c-card"><div class="c-bx">' + ic(icon, 'xl') + '</div>' + (title ? '<div class="h2">' + title + '</div>' : '') +
      paras.map(function (p) { return '<p class="sec2">' + p + '</p>'; }).join('') + '</div>';
  }
  function note(t) { return '<div class="note">' + ic('alert', 's') + '<span>' + t + '</span></div>'; }
  function push(msg, title) { return '<div class="pushc"><div class="pi">O</div><div><b>OrroFi</b>' + (title ? '<b>' + title + '</b>' : '') + '<span>' + msg + '</span></div></div>'; }
  function demo(c, es, en) { return '<span class="hud c-demo">' + c.t(es, en) + '</span>'; }
  function qr() {
    var s = '', n = 21, i, j, v;
    for (i = 0; i < n; i++) for (j = 0; j < n; j++) {
      v = ((i * 7 + j * 13 + i * j) % 5 < 2);
      if ((i < 7 && j < 7) || (i < 7 && j > 13) || (i > 13 && j < 7)) v = (i % 6 === 0 || j % 6 === 0 || (i % 6 > 1 && i % 6 < 5 && j % 6 > 1 && j % 6 < 5));
      if (v) s += '<rect x="' + j + '" y="' + i + '" width="1" height="1"/>';
    }
    return '<svg class="c-qr" viewBox="0 0 21 21" fill="currentColor" aria-hidden="true">' + s + '</svg>';
  }
  var P = '[TELÉFONO GRATUITO]';
  /* caducidad del QR: 5:00 desde que se muestra o se genera otro (demo) */
  var qx = { t0: 0, seen: 0 };
  function qfresh() { return qx.seen && Date.now() - qx.seen < 1500; }
  function expLeft() { var l = qfresh() ? Math.max(0, 300 - Math.floor((Date.now() - qx.t0) / 1000)) : 300; return Math.floor(l / 60) + ':' + ('0' + (l % 60)).slice(-2); }
  function expPaint() { var e = document.getElementById('c-exp'); if (e) e.textContent = e.dataset.pre + ' ' + expLeft(); }
  function expAfter(c, every) { if (!qfresh()) qx.t0 = Date.now(); qx.seen = Date.now(); expPaint(); every(function () { qx.seen = Date.now(); expPaint(); }, 1000); }
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-regen]')) { qx.t0 = Date.now(); qx.seen = Date.now(); } }, true);
  /* hoja Face ID/código previa a cancelar o confirmar (demo) */
  function bio(id, parent, title, txt, to, toast) {
    R(id, title, null, parent, function (c) {
      var t = c.t;
      return '<div class="row" style="gap:14px"><span class="badge" style="width:48px;height:48px;border-radius:14px">' + ic('face', 'l') + '</span><span class="sp"><div class="h2" style="margin:0">' + t('Confirma con Face ID', 'Confirm with Face ID') + '</div><div class="cap">' + t('o con tu huella o el código del teléfono', 'or with your fingerprint or phone passcode') + '</div></span></div>' +
        '<p class="sec2 mb8 mt12">' + t(txt[0], txt[1]) + '</p>' +
        btn(ic('face', 's') + t('Confirmar', 'Confirm'), { go: typeof to === 'function' ? to(c.flags) : to, toast: t(toast[0], toast[1]) }) + btn(t('Cancelar', 'Cancel'), { close: true }, 'g');
    }, { sheet: true });
  }

  /* ================= Familia ================= */
  R('fam-list', ['Familia', 'Family'], 'fiber', 'net-1', function (c) {
    var t = c.t, f = c.flags;
    return top(t('Familia', 'Family')) +
      '<div class="grp">' +
      '<div class="li" style="cursor:default"><span class="badge">' + ic('phone', 's') + '</span><span class="t"><b>' + c.data.user.name + '</b><small>' + t('Este teléfono · titular', 'This phone · account holder') + '</small></span></div>' +
      (f.isOwner ? '<button class="li tap" data-go="fam-15b">' : '<div class="li" style="cursor:default">') + '<span class="badge">' + ic('phone', 's') + '</span><span class="t"><b>Pau</b><small>' + t('Añadido el ', 'Added on ') + t(ADDED[0], ADDED[1]) + '</small></span>' + (f.isOwner ? ic('chev', 's chev') + '</button>' : '</div>') + '</div>' +
      (f.isOwner ? btn(ic('plus', 's') + t('Añadir teléfono', 'Add phone'), { go: 'fam-13b' }) : '') +
      '<p class="dis">' + t('Los teléfonos de la familia ven los dispositivos de casa y los cambios de la red.', 'Family phones see the devices at home and the changes made to the network.') + '</p>' +
      '<div class="c-demos">' + btn(demo(c, 'Demo', 'Demo') + ' ' + t('Soy el teléfono nuevo', "I'm the new phone"), { go: 'fam-13a' }, 'g sm') + '</div>';
  });

  function f13a(hidden) {
    return function (c) {
      var t = c.t;
      return top(t('Únete a la red de casa', 'Join your home network')) +
        '<div class="cd tc">' + (hidden
          ? '<div class="c-hid">' + ic('lock', 'l') + '<p class="sec2 mt8">' + t('Hemos ocultado el código porque se ha hecho una captura o se está grabando o compartiendo la pantalla. Muéstralo solo en persona, con el otro teléfono cerca.', 'We’ve hidden the code because a screenshot was taken or the screen is being recorded or shared. Only show it in person, with the other phone nearby.') + '</p></div>'
          : qr() + '<div class="cap mt8">' + t('QR de ejemplo, no escaneable.', 'Sample QR, not scannable.') + '</div>') +
        '<div class="row c-cen mt12">' + ic('clock', 's') + '<span class="mono cap" id="c-exp" data-pre="' + t('Caduca en', 'Expires in') + '">' + t('Caduca en', 'Expires in') + ' ' + expLeft() + '</span></div></div>' +
        '<p class="sec2 mb8">' + t('Pide a alguien de casa que escanee este código con su teléfono de OrroFi. Tenéis que estar juntos.', 'Ask someone at home to scan this code with their OrroFi phone. You need to be together.') + '</p>' +
        note(t('No envíes este código por mensaje ni como captura de pantalla.', 'Don’t send this code as a message or screenshot.')) +
        '<div class="row mb8"><span class="cap sp">' + t('El código caduca en 5 min.', 'The code expires in 5 min.') + '</span>' + btn(t('Generar otro', 'Generate another'), { go: hidden ? 'fam-13a2' : 'fam-13a', toast: t('Nuevo código generado', 'New code generated'), regen: true }, 'g sm') + '</div>' +
        '<p class="cap">' + t('Al unirte verás los dispositivos de casa, y todos los teléfonos del titular verán este teléfono y los cambios que hagas en la red.', 'Once you join, you’ll see the devices at home, and all of the account holder’s phones will see this phone and the changes you make to the network.') +
        ' <button class="c-lnk" data-go="net-9b">' + t('Cómo tratamos tus datos', 'How we handle your data') + '</button></p>' +
        '<p class="mt12"><button class="c-lnk" data-go="fam-14a">' + t('¿No estáis juntos? Comparar 6 cifras', 'Not together? Compare 6 digits') + '</button></p>' +
        (hidden ? '' : '<div class="c-demos">' + btn(demo(c, 'Demo', 'Demo') + ' ' + t('captura de pantalla', 'screenshot'), { go: 'fam-13a2' }, 'g sm') + '</div>');
    };
  }
  R('fam-13a', ['Nuevo teléfono muestra QR', 'New phone shows QR'], 'fiber', 'fam-list', f13a(false), { after: expAfter });
  R('fam-13a2', ['QR oculto (solo iOS)', 'QR hidden (iOS only)'], 'fiber', 'fam-list', f13a(true), { after: expAfter });

  R('fam-13b', ['Teléfono de casa escanea', 'Home phone scans'], 'fiber', 'fam-list', function (c) {
    var t = c.t;
    return top(t('Escanea el código del nuevo teléfono', 'Scan the new phone’s code')) +
      '<div class="cd c-cam"><i></i><span class="pill n0">' + t('Cámara', 'Camera') + '</span></div>' +
      '<p class="sec2 mb8">' + t('Apunta la cámara al código que aparece en el otro teléfono.', 'Point the camera at the code on the other phone.') + '</p>' +
      note(t('Escanea solo el código de un teléfono que tengas delante. Nunca escanees un código que te hayan enviado por mensaje.', 'Only scan the code of a phone right in front of you. Never scan a code someone sent you.')) +
      '<div class="c-demos">' + btn(demo(c, 'Demo', 'Demo') + ' ' + t('Escanear', 'Scan'), { go: 'fam-13c' }, 'g sm') + btn(demo(c, 'Demo', 'Demo') + ' ' + t('el código no coincide', 'the code doesn’t match'), { go: 'fam-13e' }, 'g sm') + '</div>';
  });

  R('fam-13c', ['¿Añadir este teléfono?', 'Add this phone?'], 'fiber', 'fam-list', function (c) {
    var t = c.t;
    return top(t('¿Añadir este teléfono a Mi red?', 'Add this phone to My network?')) +
      card('phone', '', [t('Podrá ver todos los dispositivos de casa y su historial, cambiar la configuración de la red y usar la contraseña del router. Añádelo solo si es de alguien de tu casa.', 'It will be able to see all the devices at home and their history, change the network settings and use the router password. Only add it if it belongs to someone in your home.')]) +
      btn(ic('check', 's') + t('Confirmar', 'Confirm'), { go: 'fam-13d', toast: t(FACE[0], FACE[1]) }) + btn(t('Cancelar', 'Cancel'), { go: 'fam-list' }, 'g');
  });

  function res(id, tit, body, warn, buttons, icon, titleEn) {
    R(id, [tit[0], tit[1]], 'fiber', 'fam-list', function (c) {
      var t = c.t;
      return top('') + card(icon, t(tit[0], tit[1]), [t(body[0], body[1])]) + (warn ? note(t(warn[0], warn[1])) : '') + buttons(t);
    });
  }
  res('fam-13d', ['Teléfono añadido', 'Phone added'],
    ['Avisaremos a todos los teléfonos del titular. Puedes quitar este teléfono cuando quieras en Mi red > Familia.', 'We’ll notify all of the account holder’s phones. You can remove this phone anytime in My network > Family.'], null,
    function (t) { return btn(t('Listo', 'Done'), { go: 'fam-list' }); }, 'check');
  var WARN = ['Si no esperabas esto, no escanees más códigos y revisa Mi red > Familia.', 'If you didn’t expect this, don’t scan any more codes and check My network > Family.'];
  res('fam-13e', ['El código no coincide', 'The code doesn’t match'],
    ['Por seguridad hemos anulado esta invitación. No se ha añadido ningún teléfono. Crea una invitación nueva.', 'For your security, we’ve cancelled this invitation. No phone was added. Create a new invitation.'], WARN,
    function (t) { return btn(t('Nueva invitación', 'New invitation'), { go: 'fam-13b' }) + btn(t('Cerrar', 'Close'), { go: 'fam-list' }, 'g'); }, 'alert');
  res('fam-14b', ['Invitación anulada', 'Invitation cancelled'],
    ['Las cifras no coincidían, así que hemos anulado la invitación. No se ha añadido ningún teléfono.', 'The digits didn’t match, so we cancelled the invitation. No phone was added.'], WARN,
    function (t) { return btn(t('Cerrar', 'Close'), { go: 'fam-list' }, 'g'); }, 'alert');
  res('fam-15c', ['Teléfono quitado', 'Phone removed'],
    ['Este teléfono ya no podrá entrar en Mi red ni ver datos nuevos: hemos cambiado la clave que protege tus datos. Lo que ya vio puede seguir guardado en él. Te recomendamos cambiar la contraseña del router y la del Wi-Fi.', 'This phone can no longer access My network or see new data: we’ve changed the key that protects your data. What it already saw may still be stored on it. We recommend changing your router and Wi-Fi passwords.'], null,
    function (t) { return btn(t('Listo', 'Done'), { go: 'fam-list' }); }, 'check');

  R('fam-14a', ['Comparar 6 cifras', 'Compare 6 digits'], 'fiber', 'fam-13a', function (c) {
    var t = c.t;
    function half(i, es, en) { return '<div class="cd"><div class="cap c-cap">' + ic(i, 's') + ' ' + t(es, en) + '</div><div class="mono c-dig">482 913</div></div>'; }
    return top(t('Comparad estas 6 cifras', 'Compare these 6 digits')) +
      '<p class="sec2 mb8">' + t('Llamaos por teléfono o videollamada y leed las cifras en voz alta. Solo tenéis un intento.', 'Call each other by phone or video and read the digits aloud. You only get one try.') + '</p>' +
      '<div class="c-two">' + half('phone', 'Este es el teléfono nuevo: lee las cifras en voz alta', 'This is the new phone: read the digits aloud') + half('home', 'Este es el teléfono de casa: comprueba que coinciden', 'This is the home phone: check that they match') + '</div>' +
      note(t('Hacedlo solo si un familiar ha pedido unirse. OrroFi nunca os llamará para pedir estas cifras.', 'Only do this with a family member who asked to join. OrroFi will never call you to ask for these digits.')) +
      btn(ic('check', 's') + t('Coinciden', 'They match'), { go: 'fam-13d' }) + btn(t('No coinciden', 'They don’t match'), { go: 'fam-14b' });
  });

  R('fam-15', ['Aviso: teléfono añadido', 'Notice: phone added'], null, 'fam-list', function (c) {
    var t = c.t;
    return push(t('Si no lo reconoces, quítalo.', 'If you don’t recognise it, remove it.'), t('Se ha añadido un teléfono a Mi red', 'A phone was added to My network')) +
      (c.flags.isOwner ? btn(t('Quitar', 'Remove'), { go: 'fam-15b' }, 'g') : btn(t('Abrir OrroFi', 'Open OrroFi'), { go: 'fam-list' }, 'g'));
  }, { lock: true });

  R('fam-15b', ['¿Quitar este teléfono?', 'Remove this phone?'], 'fiber', 'fam-list', function (c) {
    var t = c.t;
    return top(t('¿Quitar este teléfono?', 'Remove this phone?')) +
      card('phone', '', [t('Añadido el ' + ADDED[0] + '. Ya no podrá entrar en Mi red y cambiaremos la clave que protege tus datos de Mi red.', 'Added on ' + ADDED[1] + '. It will no longer be able to access My network, and we’ll change the key that protects your My network data.')]) +
      btn(t('Quitar teléfono', 'Remove phone'), { go: 'fam-15c', toast: t(FACE[0], FACE[1]) }, 'd') + btn(t('Cancelar', 'Cancel'), { go: 'fam-list' }, 'g');
  });

  /* ================= Borrado ================= */
  R('del-entry', ['Borrado (acceso)', 'Deletion (entry)'], 'profile', 'net-9b', function (c) { c.go(c.flags.emailConfirmed ? 'del-16a' : 'del-16a0'); return ''; });
  R('del-owner', ['Borrado: solo titular', 'Deletion: holder only'], 'profile', 'net-9b', function (c) {
    var t = c.t;
    return top('') + card('lock', '', [t('Solo el titular puede borrar los datos de Mi red. Pídeselo al titular de la cuenta.', 'Only the account holder can delete Mi red data. Ask the account holder.')]) + btn(t('Volver', 'Back'), { go: 'net-9b' }, 'g');
  });
  R('rst-owner', ['Restablecer: solo titular', 'Reset: holder only'], 'profile', 'net-9b', function (c) {
    var t = c.t;
    return top('') + card('lock', '', [t('Solo el titular puede restablecer Mi red.', 'Only the account holder can reset Mi red.')]) + btn(t('Volver', 'Back'), { go: 'net-9b' }, 'g');
  });

  R('del-16a0', ['¿Añadir un e-mail antes?', 'Add an e-mail first?'], 'profile', 'net-9b', function (c) {
    var t = c.t;
    return top('') + card('lock', t('¿Añadir un e-mail antes?', 'Add an e-mail first?'), [t('Te recomendamos añadir un e-mail confirmado para avisarte del borrado por otra vía además de este número. Puedes continuar sin él: te avisaremos por SMS.', 'We recommend adding a confirmed e-mail so we can tell you about the deletion another way besides this number. You can continue without it: we’ll notify you by SMS.')]) +
      btn(t('Añadir e-mail', 'Add e-mail'), { go: 'del-16a', toast: t('Demo: e-mail añadido', 'Demo: e-mail added') }) + btn(t('Continuar sin e-mail', 'Continue without e-mail'), { go: 'del-16a' }, 'g');
  });

  R('del-16a', ['¿Borrar los datos de Mi red?', 'Delete your Mi red data?'], 'profile', 'net-9b', function (c) {
    var t = c.t, f = c.flags, to = !f.isOwner ? 'del-16c' : f.canCancel ? 'del-16b' : 'del-16b2';
    return top('') + card('lock', t('¿Borrar los datos de Mi red?', 'Delete your Mi red data?'), [
      t('Se borrarán de forma definitiva los datos de Mi red de esta casa: los dispositivos y su historial, la copia cifrada de la contraseña del router y de otras claves, la contraseña del router guardada en este teléfono y las copias de la clave de casa de los demás teléfonos de la familia. Esos teléfonos perderán el acceso a Mi red. No se puede deshacer.', 'This home’s Mi red data will be permanently deleted: devices and their history, the encrypted copy of your router password and other keys, the router password saved on this phone, and the copies of the home key on the other family phones. Those phones will lose access to Mi red. This can’t be undone.'),
      t('Lo borraremos dentro de 72 horas. Esperamos este tiempo para protegerte si otra persona usa tu teléfono. Mientras tanto no usaremos estos datos y te avisaremos. Solo podrá cancelarlo un teléfono del titular que ya estuviera vinculado al menos 72 horas antes de la solicitud.', 'We’ll delete it in 72 hours. We wait this long to protect you in case someone else is using your phone. Until then we won’t use this data and we’ll keep you informed. It can only be cancelled from an account holder’s phone that was already linked at least 72 hours before the request.')]) +
      btn(t('Cancelar', 'Cancel'), { back: true }) + btn(t('Borrar dentro de 72 horas', 'Delete in 72 hours'), { go: to, toast: t(FACE[0], FACE[1]) }, 'd');
  });

  function sched(id, withRight) {
    R(id, [withRight ? 'Borrado programado' : 'Borrado programado (sin derecho)', withRight ? 'Deletion scheduled' : 'Deletion scheduled (no right)'], 'profile', 'net-9b', function (c) {
      var t = c.t, ttl = t('Borrado programado para el ' + DT, 'Deletion scheduled for ' + DT);
      if (withRight) return top('') + card('clock', ttl, [t('Mientras tanto no usaremos los datos de Mi red. Puedes cancelarlo hasta esa hora.', 'Until then we won’t use your Mi red data. You can cancel it until then.')]) +
        '<p class="cap mb8">' + t('Fecha y hora en la zona horaria del teléfono.', 'Date and time in the phone’s time zone.') + '</p>' +
        btn(t('Cancelar borrado', 'Cancel deletion'), { go: 'del-sh-bio' }) + btn(t('No lo he pedido yo', 'I didn’t request this'), { go: 'del-16g' }, 'g');
      return top('') + card('clock', ttl, [t('Mientras tanto no usaremos los datos de Mi red. Este teléfono no puede cancelar el borrado porque se vinculó hace menos de 72 horas o después de pedirlo. Puedes cancelarlo desde otro teléfono del titular que ya estuviera vinculado al menos 72 horas antes de la solicitud. Si no lo has pedido tú, toca «No lo he pedido yo».', 'Until then we won’t use your Mi red data. This phone can’t cancel the deletion because it was linked less than 72 hours ago or after the request. You can cancel it from another of the account holder’s phones that was already linked at least 72 hours before the request. If you didn’t request this, tap “I didn’t request this”.')]) +
        btn(t('No lo he pedido yo', 'I didn’t request this'), { go: 'del-16h' }, 'g') + btn(t('Volver', 'Back'), { go: 'net-9b' }, 'g');
    });
  }
  sched('del-16b', true); sched('del-16b2', false);

  bio('del-sh-bio', 'del-16b', ['Confirmar con Face ID', 'Confirm with Face ID'], ['Para cancelar el borrado necesitamos confirmar que eres tú.', 'To cancel the deletion we need to confirm it is you.'], 'net-9b', ['Borrado cancelado', 'Deletion cancelled']);
  R('del-16c', ['Borrado: información', 'Deletion: info'], 'profile', 'net-1', function (c) {
    var t = c.t;
    return top('') + card('clock', '', [t('Los datos de Mi red de tu casa se borrarán el ' + DT + '.', 'Your home’s Mi red data will be deleted on ' + DT + '.')]) + btn(t('Volver', 'Back'), { go: 'net-1' }, 'g');
  });

  function lockPush(id, title, msgs, acts) {
    R(id, title, null, 'net-9b', function (c) {
      var t = c.t;
      return msgs.map(function (m) { return push(t(m[0], m[1])); }).join('') + acts.map(function (a, i) {
        return btn(t(a[0], a[1]), { go: a[2] }, i ? 'g' : '');
      }).join('');
    }, { lock: true });
  }
  var NOREQ = ['No lo he pedido yo', 'I didn’t request this'], CANC = ['Cancelar borrado', 'Cancel deletion'];
  lockPush('del-16d', ['Aviso inmediato (con derecho)', 'Immediate notice (with right)'], [['Se ha pedido borrar los datos de Mi red. Se borrarán el ' + DT + '. ¿No has sido tú? Cancélalo en la app.', 'A deletion of your Mi red data was requested. It will be deleted on ' + DT + '. Wasn’t you? Cancel it in the app.']], [CANC.concat('del-16b'), NOREQ.concat('del-16g')]);
  lockPush('del-16d2', ['Aviso inmediato (sin derecho)', 'Immediate notice (no right)'], [['Se ha pedido borrar los datos de Mi red. Se borrarán el ' + DT + '. Solo puede cancelarlo un teléfono del titular vinculado al menos 72 horas antes de la solicitud.', 'A deletion of your Mi red data was requested. It will be deleted on ' + DT + '. It can only be cancelled from an account holder’s phone linked at least 72 hours before the request.']], [NOREQ.concat('del-16h')]);
  lockPush('del-16e', ['Aviso 24 h (con derecho)', '24 h notice (with right)'], [['Mañana borraremos los datos de Mi red. Si no has sido tú, cancélalo ahora.', 'Tomorrow we’ll delete your Mi red data. If this wasn’t you, cancel it now.']], [CANC.concat('del-16b'), NOREQ.concat('del-16g')]);
  lockPush('del-16e2', ['Aviso 24 h (sin derecho)', '24 h notice (no right)'], [['Mañana borraremos los datos de Mi red. ¿No lo has pedido tú? Avísanos.', 'Tomorrow we’ll delete your Mi red data. Didn’t request this? Let us know.']], [NOREQ.concat('del-16h')]);

  R('del-16f', ['Datos borrados', 'Data deleted'], 'profile', 'fiber', function (c) {
    var t = c.t;
    return top('') + card('check', '', [t('Hemos borrado los datos de Mi red.', 'We’ve deleted your Mi red data.')]) + btn(t('Listo', 'Done'), { go: 'fiber', root: true });
  });
  R('del-16g', ['Borrado cancelado', 'Deletion cancelled'], 'profile', 'net-9b', function (c) {
    var t = c.t;
    return top('') + card('check', '', [t('Hemos cancelado el borrado y revisaremos lo ocurrido. Cambia el código de tu teléfono y la contraseña de tu router y de tu Wi‑Fi.', 'We’ve cancelled the deletion and we’ll look into what happened. Change your phone passcode and your router and Wi‑Fi passwords.')]) +
      btn(t('Listo', 'Done'), { back: true });
  });
  R('del-16h', ['Aviso recibido', 'Report received'], 'profile', 'net-9b', function (c) {
    var t = c.t;
    return top('') + card('lock', '', [t('Hemos recibido tu aviso y revisaremos lo ocurrido. Este teléfono no puede cancelar el borrado. Solo puede cancelarlo otro teléfono del titular que ya estuviera vinculado al menos 72 horas antes de la solicitud.', 'We’ve received your report and will look into what happened. This phone can’t cancel the deletion. Only another of the account holder’s phones that was already linked at least 72 hours before the request can cancel it.')]) +
      btn(t('Listo', 'Done'), { back: true });
  });

  /* ================= Restablecer ================= */
  R('rst-entry', ['Restablecer (acceso)', 'Reset (entry)'], 'profile', 'net-9b', function (c) {
    var f = c.flags;
    c.go(!f.freshSms ? 'rst-sms' : !f.emailConfirmed && !f.secondPhone ? 'rst-17m' : f.resetActive ? 'rst-17j' : f.resetLimit ? 'rst-17k' : 'rst-17a'); return '';
  });
  var smsBad = false;
  document.addEventListener('click', function (e) { if (e.target.closest) smsBad = !!e.target.closest('[data-smsbad]'); }, true);
  R('rst-sms', ['Confirma que eres tú', 'Confirm it is you'], 'profile', 'net-9b', function (c) {
    var t = c.t;
    return top('') + (smsBad ? '<div class="note e">' + ic('alert', 's') + '<span>' + t('Código incorrecto. Inténtalo de nuevo.', 'Wrong code. Please try again.') + '</span></div>' : '') + card('lock', t('Confirma que eres tú', 'Confirm it is you'), [t('Para restablecer Mi red necesitamos un inicio de sesión reciente. Te hemos enviado un SMS con un código de 6 dígitos a +34 ··· ··· 412.', 'To reset Mi red we need a recent sign-in. We sent an SMS with a 6-digit code to +34 ··· ··· 412.')]) + U.otp(smsBad, 6) +
      btn(t('Verificar', 'Verify'), { go: 'rst-entry', flagset: 'freshSms:1' }) + btn(t('Cancelar', 'Cancel'), { go: 'net-9b' }, 'g') +
      '<div class="cap">DEMO</div><div class="chips mt8"><button class="chip" data-go="rst-sms" data-smsbad>' + t('Código incorrecto', 'Wrong code') + '</button></div>';
  });
  function info(id, title, icon, ttl, body, go, label) {
    R(id, title, 'profile', 'net-9b', function (c) {
      var t = c.t, b = typeof body === 'function' ? body(t) : t(body[0], body[1]);
      return top('') + card(icon, ttl ? t(ttl[0], ttl[1]) : '', [b]) + btn(t(label[0], label[1]), { go: go });
    });
  }
  R('rst-17m', ['Añade primero un e-mail', 'Add an e-mail first'], 'profile', 'net-9b', function (c) {
    var t = c.t;
    return top('') + card('lock', t('Añade primero un e-mail', 'Add an e-mail first'), [t('Para restablecer Mi red necesitamos poder avisarte por otra vía además de este número: un e-mail confirmado u otro teléfono de la familia. Así nadie puede hacerlo solo con tu SIM.', 'To reset Mi red, we need another way to reach you besides this number: a confirmed e-mail or another family phone. That way nobody can do it with just your SIM.')]) +
      btn(t('Añadir e-mail', 'Add e-mail'), { go: 'rst-17a', toast: t('Demo: e-mail añadido', 'Demo: e-mail added') }) + btn(t('Ahora no', 'Not now'), { go: 'net-9b' }, 'g');
  });
  R('rst-17a', ['Restablecer Mi red', 'Reset Mi red'], 'profile', 'net-9b', function (c) {
    var t = c.t;
    return top(t('Restablecer Mi red', 'Reset Mi red')) + '<div class="cd"><p class="sec2">' + t('Usa esto si has perdido todos tus teléfonos de casa o si alguien ha vinculado un teléfono que no conoces. Dentro de 72 horas borraremos los datos de Mi red de esta casa (dispositivos, historial, claves cifradas) y todos los teléfonos vinculados perderán el acceso. Mientras tanto no usaremos estos datos y te avisaremos por notificación y SMS. Solo podrá cancelarlo un teléfono del titular que ya estuviera vinculado al menos 72 horas antes de la solicitud. Después podrás vincular tu teléfono de nuevo.', 'Use this if you’ve lost all your home phones or someone linked a phone you don’t recognise. In 72 hours we’ll delete this home’s Mi red data (devices, history, encrypted keys) and all linked phones will lose access. Until then we won’t use this data and we’ll notify you by push and SMS. It can only be cancelled from an account holder’s phone that was already linked at least 72 hours before the request. Afterwards you can link your phone again.') + '</p></div>' +
      btn(t('Cancelar', 'Cancel'), { go: 'net-9b' }) + btn(t('Restablecer dentro de 72 horas', 'Reset in 72 hours'), { go: 'rst-17b' }, 'd');
  });
  R('rst-17b', ['Motivo', 'Reason'], 'profile', 'rst-17a', function (c) {
    var t = c.t;
    function opt(txt, cls) { return '<label class="chk c-opt"><input type="radio" name="c-why" class="' + (cls || '') + '" data-gate><span>' + txt + '</span></label>'; }
    return top(t('Restablecer Mi red', 'Reset Mi red')) + '<div class="gate c-g"><div class="cd" role="radiogroup" aria-label="' + t('Motivo', 'Reason') + '">' +
      opt(t('He perdido todos mis teléfonos de casa', 'I’ve lost all my home phones')) + opt(t('Hay un teléfono vinculado que no reconozco', 'There’s a linked phone I don’t recognise'), 'c-o2') +
      '<div class="cap c-hint">' + t('Revisaremos lo ocurrido. Cambia también la contraseña de tu router y de tu Wi‑Fi.', 'We’ll look into what happened. Also change your router and Wi‑Fi passwords.') + '</div></div>' +
      '<button class="btn d gate-btn" data-go="rst-17c" disabled aria-disabled="true">' + t('Restablecer dentro de 72 horas', 'Reset in 72 hours') + '</button></div>';
  });
  R('rst-17c', ['¿Restablecer Mi red?', 'Reset Mi red?'], 'profile', 'rst-17b', function (c) {
    var t = c.t, f = c.flags;
    return '<div class="h2">' + t('¿Restablecer Mi red?', 'Reset Mi red?') + '</div><p class="sec2 mb8">' + t('El ' + DT + ' borraremos los datos de Mi red de esta casa: dispositivos, historial y claves cifradas. Todos los teléfonos vinculados perderán el acceso. Hasta entonces no usaremos estos datos y te avisaremos por notificación y SMS. Solo puede cancelarlo un teléfono del titular que ya estuviera vinculado al menos 72 horas antes de la solicitud. Una vez hecho, no se puede deshacer.', 'On ' + DT + ' we’ll delete this home’s Mi red data: devices, history and encrypted keys. All linked phones will lose access. Until then we won’t use this data, and we’ll notify you by notification and SMS. It can only be cancelled from an account holder’s phone that was already linked at least 72 hours before the request. Once done, it can’t be undone.') + '</p>' +
      btn(t('Confirmar restablecimiento', 'Confirm reset'), { go: 'rst-sh-bio-c' }, 'd') + btn(t('Volver', 'Go back'), { close: true }, 'g');
  }, { sheet: true });
  R('rst-17d', ['Sin derecho a cancelar', 'No right to cancel'], 'profile', 'net-9b', function (c) {
    var t = c.t;
    return top('') + card('lock', t('Restablecimiento programado para el ' + DT, 'Reset scheduled for ' + DT), [t('Este teléfono no puede cancelar el restablecimiento porque se vinculó hace menos de 72 horas o después de pedirlo. Puedes cancelarlo desde otro teléfono del titular que ya estuviera vinculado al menos 72 horas antes de la solicitud. Si no lo has pedido tú, toca «No lo he pedido yo».', 'This phone can’t cancel the reset because it was linked less than 72 hours ago or after the request. You can cancel it from another of the account holder’s phones that was already linked at least 72 hours before the request. If you didn’t request this, tap “I didn’t request this”.')]) +
      btn(t('No lo he pedido yo', 'I didn’t request this'), { go: 'rst-17i' }, 'g');
  });
  function lockStack(id, title, items, act, closeTo) {
    R(id, title, null, 'net-9b', function (c) {
      var t = c.t;
      return items.map(function (m) { return push(t(m[0], m[1])) + (act ? btn(t('Cancelar', 'Cancel'), { go: 'rst-17h' }, 'g') : ''); }).join('') +
        (closeTo ? btn(t('Cerrar', 'Close'), { go: closeTo }, 'g') : '');
    }, { lock: true });
  }
  lockStack('rst-17e', ['Aviso con derecho', 'Notice with right'], [
    ['OrroFi: se ha pedido restablecer Mi red. Se hará el ' + DT + '. ¿No has sido tú? Cancélalo en la app OrroFi.', 'OrroFi: a reset of Mi red was requested. It will happen on ' + DT + '. Wasn’t you? Cancel it in the OrroFi app.'],
    ['OrroFi: Mañana restableceremos Mi red. Si no has sido tú, cancélalo ahora.', 'OrroFi: Tomorrow we’ll reset Mi red. If this wasn’t you, cancel it now.']], true, null);
  lockStack('rst-17f', ['Aviso sin derecho / SMS', 'Notice without right / SMS'], [
    ['OrroFi: se ha pedido restablecer Mi red. Se hará el ' + DT + '. ¿No has sido tú? Cancélalo desde un teléfono del titular vinculado al menos 72 horas antes de la solicitud.', 'OrroFi: a reset of Mi red was requested. It will happen on ' + DT + '. Wasn’t you? Cancel it from an account holder’s phone linked at least 72 hours before the request.']], false, 'net-9b');
  lockStack('rst-17g', ['Avisos de resultado', 'Result notices'], [
    ['OrroFi: se ha cancelado el restablecimiento de Mi red.', 'OrroFi: the Mi red reset was cancelled.'],
    ['OrroFi: hemos restablecido Mi red y borrado sus datos. Ya puedes vincular tu teléfono de nuevo.', 'OrroFi: we’ve reset Mi red and deleted its data. You can link your phone again.'],
    ['OrroFi: Se han borrado los datos de Mi red de tu casa. Ya no tienes acceso.', 'OrroFi: Your home’s Mi red data has been deleted. You no longer have access.']], false, 'net-9b');
  R('rst-17h', ['Restablecimiento programado', 'Reset scheduled'], 'profile', 'net-9b', function (c) {
    var t = c.t;
    return top('') + card('clock', t('Restablecimiento programado para el ' + DT, 'Reset scheduled for ' + DT), [t('Ese día borraremos los datos de Mi red de esta casa y todos los teléfonos vinculados perderán el acceso. Mientras tanto no usaremos estos datos. Puedes cancelar el restablecimiento desde este teléfono hasta esa hora.', 'On that day we’ll delete this home’s Mi red data and all linked phones will lose access. Until then we won’t use this data. You can cancel the reset from this phone until then.')]) +
      btn(t('Cancelar restablecimiento', 'Cancel reset'), { go: 'rst-sh-bio' }) + btn(t('No lo he pedido yo', 'I didn’t request this'), { go: 'rst-17l' }, 'g');
  });
  bio('rst-sh-bio', 'rst-17h', ['Confirmar con Face ID', 'Confirm with Face ID'], ['Para cancelar el restablecimiento necesitamos confirmar que eres tú.', 'To cancel the reset we need to confirm it is you.'], 'net-9b', ['Restablecimiento cancelado', 'Reset cancelled']);
  bio('rst-sh-bio-c', 'rst-17b', ['Confirmar con Face ID', 'Confirm with Face ID'], ['Para restablecer Mi red necesitamos confirmar que eres tú.', 'To reset Mi red we need to confirm it is you.'], function (f) { return f.canCancel ? 'rst-17h' : 'rst-17d'; }, ['Restablecimiento programado', 'Reset scheduled']);
  info('rst-17i', ['Aviso recibido', 'Report received'], 'lock', null, ['Hemos recibido tu aviso y revisaremos lo ocurrido. Este teléfono no puede cancelar el restablecimiento. Solo puede cancelarlo otro teléfono del titular que ya estuviera vinculado al menos 72 horas antes de la solicitud.', 'We’ve received your report and will look into what happened. This phone can’t cancel the reset. Only another of the account holder’s phones that was already linked at least 72 hours before the request can cancel it.'], 'net-9b', ['Entendido', 'OK']);
  info('rst-17j', ['Restablecimiento en curso', 'Reset in progress'], 'clock', ['Ya hay un restablecimiento en curso', 'A reset is already in progress'], function (t) { return t('Mi red se restablecerá el ' + DT + '. No hace falta pedirlo otra vez.', 'Mi red will be reset on ' + DT + '. You don’t need to request it again.'); }, 'net-9b', ['Volver', 'Back']);
  info('rst-17k', ['Límite de solicitudes', 'Request limit'], 'lock', ['No puedes restablecer Mi red ahora', 'You can’t reset Mi red right now'], ['Por seguridad, solo se puede pedir 3 veces cada 30 días. Podrás volver a pedirlo el 3/11/2026.', 'For your security, it can only be requested 3 times every 30 days. You can request it again on 3/11/2026.'], 'net-9b', ['Volver', 'Back']);
  info('rst-17l', ['Restablecimiento cancelado', 'Reset cancelled'], 'check', ['Hemos cancelado el restablecimiento', 'We’ve cancelled the reset'], ['Mi red sigue igual. Revisaremos lo ocurrido. Cambia el código de tu teléfono y la contraseña de tu router y de tu Wi‑Fi.', 'Mi red stays as it was. We’ll look into what happened. Change your phone’s passcode and your router and Wi‑Fi passwords.'], 'net-9b', ['Listo', 'Done']);

  /* pantallas solo para el titular: sin isOwner redirigen (lo aplica el núcleo) */
  (function () {
    var S = O.listing().screens;
    function own(ids, to) { ids.forEach(function (id) { S[id].owner = to; }); }
    own(['del-entry', 'del-16a0', 'del-16a'], 'del-owner');
    own(['rst-entry', 'rst-sms', 'rst-17m', 'rst-17a', 'rst-17b', 'rst-17c', 'rst-sh-bio-c', 'rst-17j', 'rst-17k'], 'rst-owner');
    own(['fam-15b', 'fam-15c'], 'fam-list');
  })();

  /* ================= «No lo he hecho yo» ================= */
  R('rp-18a', ['¿Has visto algo que no has hecho tú?', 'Seen something you didn’t do?'], 'profile', 'net-9b', function (c) {
    var t = c.t;
    return top('') + '<div class="cd"><div class="h2">' + t('¿Has visto algo que no has hecho tú?', 'Seen something you didn’t do?') + '</div><p class="sec2">' + t('Por ejemplo, un teléfono vinculado que no reconoces, un borrado o un restablecimiento de Mi red que no has pedido. Al enviar el aviso, revisaremos tu cuenta y la actividad reciente de tu casa. No cancela por sí solo un borrado o un restablecimiento en curso.', 'For example, a linked phone you don’t recognise, or a Mi red deletion or reset you didn’t request. When you send this, we’ll review your account and your home’s recent activity. It doesn’t cancel a deletion or reset in progress by itself.') + '</p></div>' +
      btn(t('Enviar aviso', 'Send report'), { go: 'rp-18b' }) + btn(t('Volver', 'Go back'), { go: 'net-9b' });
  });
  info('rp-18b', ['Aviso recibido', 'Report received'], 'check', ['Aviso recibido', 'Report received'], ['Hemos recibido tu aviso y revisaremos lo ocurrido. Mientras tanto, cambia el código de tu teléfono y la contraseña de tu router y de tu Wi‑Fi.', 'We’ve received your report and will look into what happened. In the meantime, change your phone’s passcode and your router and Wi‑Fi passwords.'], 'net-9b', ['Entendido', 'OK']);
})();
