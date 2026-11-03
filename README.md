# OrroFi · prototipo clicable v5

Prototipo de diseño, datos ficticios.

## Cómo abrirlo
Doble clic en `index.html` (sin compilar, sin servidor, sin dependencias). Hash vacío → `#/launch`. Botón «Mapa» (esquina, fuera del marco) → `#/all`.

## Archivos
Orden de carga fijo: `styles.css`, `styles-b.css`, `styles-c.css`, `data.js`, `app.js`, `screens-a.js`, `screens-b.js`, `screens-c.js`.
- `styles.css` — tokens v5 (un solo bloque de color al inicio, sustituible por el brandbook) y componentes.
- `data.js` — datos ficticios y demo-flags (`OrroData`).
- `app.js` — núcleo: registro, router por hash, delegación de clics, tema/idioma (`localStorage` clave `orrofi-proto`), helpers `OrroProto.ui`.
- `screens-a.js` — grupo A (55 ids registrados, incluido `wip` en el núcleo).
- `screens-b.js` / `styles-b.css` — **sesión 2** (grupo B). `screens-c.js` / `styles-c.css` — **sesión 3** (grupo C).

## API
```js
OrroProto.register(id, {
  group: 'A'|'B'|'C', title: ['es','en'],
  tab: 'home'|'fiber'|'manager'|'billing'|'profile'|null,
  parent: 'id', sheet: false, lock: false,
  render(ctx) { return '<html>'; }   // ctx: t(es,en), data, flags, go(id), toast(msg), lang, id
});
```
Clics (nunca `onclick`): `data-go="id"`, `data-back`, `data-close`, `data-toast="texto"`, `data-flag="nombre"` (alterna y redibuja; `localNet` cicla). Extras del núcleo: `data-flagset="nombre:1|0"`, `data-tog` (interruptor), `data-pick="v"` + `data-pickroot`/`data-show="v"` (segmentos), `data-reveal`, `data-root` (cambio de pestaña), checkbox `data-gate`.
Varios atributos en un mismo elemento se aplican en orden: tog/pick/flag/toast y luego navegación.
Helpers: `OrroProto.ui` → `ic(nombre,clase)`, `top(titulo,{back,right})`, `brand()`, `li({i,t,s,v,go,toast})`, `btn(texto,attrs,clase)`, `state(icono,titulo,texto,btnHtml,kind)`, `sw(on,attrs)`, `da(attrs)`.
Pantallas de redirección (`net-entry`, `del-entry`, `rst-entry`): `render` llama `ctx.go('<id>')` y devuelve `''`.
Pantalla no registrada → `wip` («En construcción», id pequeño, «Volver»). `lock:true` → marco de push en pantalla de bloqueo (sin pestañas). `sheet:true` → hoja inferior sobre `parent`.
Comprobación: `OrroProto.check()` en consola — lista los `data-go` (y `ctx.go`) cuyo id no está registrado ni planificado (debe salir vacío; revisa todos los flags y ES/EN).

## Demo-flags (se cambian en `#/all`)
`session`, `firstLogin`, `activeServices`, `atHome`, `localNet` (`unknown|granted|denied|hidden`), `routerLinked`, `canCancel`, `isOwner`, `emailConfirmed`, `secondPhone`, `resetActive`, `resetLimit`, `freshSms` (inicio de sesión reciente por SMS; `rst-entry` pide el código si es `false`), y de A: `outage`, `humanHours`, `faceid`.

## Ids planificados
- **B:** net-entry net-00 net-sys-localnet net-00b net-00c net-0a net-0b net-0c net-0d net-0e net-sh-mac net-0f net-0g net-0h net-1 net-1b net-1c net-1d net-1e net-2 net-3 net-3b net-4 net-4b net-4c net-4d net-5 net-6 net-7 net-7-confirm net-8 net-sh-bio net-9 net-9b net-sh-delcopy net-12 net-12b
- **C:** fam-list fam-13a fam-13a2 fam-13b fam-13c fam-13d fam-13e fam-14a fam-14b fam-15 fam-15b fam-15c del-entry del-16a0 del-16a del-16b del-16b2 del-16c del-16d del-16d2 del-16e del-16e2 del-16f del-16g del-16h del-owner del-sh-bio rst-entry rst-17m rst-17a rst-17b rst-17c rst-17d rst-17e rst-17f rst-17g rst-17h rst-17i rst-17j rst-17k rst-17l rst-sh-bio rst-sh-bio-c rst-sms rst-owner rp-18a rp-18b
Mientras no existan, el salto va a `wip`.

## Trabajo en paralelo
Sesión 2 solo toca `screens-b.js` y `styles-b.css`; sesión 3 solo `screens-c.js` y `styles-c.css`. No se modifican `index.html`, `styles.css`, `data.js`, `app.js`, `screens-a.js`.
Textos Legal como marcadores: `[RESPONSABLE]`, `[EMAIL PRIVACIDAD]`, `[URL POLÍTICA]`, `[OPERADOR SOCIO / ninguno]`, `[TELÉFONO GRATUITO]`.

## Simplificaciones de demo (conocidas)
- «Añadir e-mail» en `rst-17m` y `del-16a0` solo muestra un toast y sigue: no hay pantalla de entrada de e-mail.
- `freshSms` se guarda en `localStorage` como el resto de flags; se reinicia desde `#/all`.
- Los temporizadores (reenvío del código SMS 60 s, caducidad del QR 5 min) son reales pero solo mientras la pantalla está abierta.
