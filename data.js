/* Datos ficticios del prototipo OrroFi. Sin datos reales. */
window.OrroData = {
  user: { name: 'Marta', zone: 'Roses', initials: 'M' },
  lines: [
    { n: '··412', who: 'Marta', left: '17,6', used: '32,4', of: 50, pct: 65 },
    { n: '··907', who: 'Pau',   left: '41,2', used: '8,8',  of: 50, pct: 18 }
  ],
  fiber: { plan: 'Fibra 1 Gb', down: 940, up: 912, ont: 'ONT ZTE F680', days: 12, gb: 412 },
  radio: { antenna: 'Antena Ubiquiti', dbm: '−58', ccq: '96 %' },
  invoices: [
    { id: 'F-2610', m: ['Octubre 2026', 'October 2026'], amount: '39,00', status: 'pending' },
    { id: 'F-2609', m: ['Septiembre 2026', 'September 2026'], amount: '39,00', status: 'paid' },
    { id: 'F-2608', m: ['Agosto 2026', 'August 2026'], amount: '39,00', status: 'paid' }
  ],
  tickets: {
    open: [
      { id: '#4790', t: ['Instalación de fibra', 'Fibre installation'], s: ['Cita confirmada', 'Appointment confirmed'], go: 'install' },
      { id: '#4821', t: ['Cambio de tarifa', 'Plan change'], s: ['En revisión', 'In review'], go: 'manager' }
    ],
    closed: []
  },
  notifs: [
    { k: 'net', go: 'outage', i: 'pin', t: ['Avería detectada en tu zona', 'Outage detected in your area'], s: ['Roses · técnicos en ruta', 'Roses · technicians on the way'], w: ['Hace 20 min', '20 min ago'] },
    { k: 'bill', go: 'invoice', i: 'doc', t: ['Nueva factura disponible', 'New invoice available'], s: ['F-2610 · 39,00 €', 'F-2610 · €39.00'], w: ['Ayer', 'Yesterday'] },
    { k: 'tick', go: 'tickets', i: 'ticket', t: ['Ticket #4821 actualizado', 'Ticket #4821 updated'], s: ['Cambio de tarifa en revisión', 'Plan change in review'], w: ['Hace 2 días', '2 days ago'] },
    { k: 'net', go: 'net-1', i: 'wifi', t: ['Dispositivo nuevo en tu Wi‑Fi', 'New device on your Wi‑Fi'], s: ['Toca para revisarlo', 'Tap to review it'], w: ['Hace 3 días', '3 days ago'] }
  ],
  services: [
    { n: ['Fibra 1 Gb', 'Fibre 1 Gb'], end: ['14 mar 2027', '14 Mar 2027'] },
    { n: ['Móvil ··412', 'Mobile ··412'], end: ['14 mar 2027', '14 Mar 2027'] }
  ],
  /* demo-flags (se cambian en la pantalla #/all) */
  flags: {
    session: false, firstLogin: true, activeServices: true, atHome: true, localNet: 'unknown',
    routerLinked: false, canCancel: true, isOwner: true, emailConfirmed: true, secondPhone: false,
    resetActive: false, resetLimit: false, freshSms: false, outage: true, humanHours: true, faceid: true
  },
  flagOptions: { localNet: ['unknown', 'granted', 'denied', 'hidden'] }
};
