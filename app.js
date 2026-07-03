/* ═══════════════════════════════════════════════════════════════
   GADU ∴ Cuaderno Masónico — lógica de la aplicación
   Sin dependencias. Persistencia en localStorage. Multiusuario.
   ═══════════════════════════════════════════════════════════════ */
'use strict';

const DRIVE_FOLDER = 'https://drive.google.com/drive/folders/1RmoYv2ULuKHl1J56tVkyjEe8djRo6SgB?usp=drive_link';
const LEGACY_KEY = 'gadu.v1';
const STORE_KEY  = 'gadu.store.v2';

/* ─── utilidades ─── */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const ymd = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const today = () => ymd(new Date());
const parseYMD = s => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); };
const addDays = (dateStr, n) => { const d = parseYMD(dateStr); d.setDate(d.getDate()+n); return ymd(d); };
const fmtLong = s => new Intl.DateTimeFormat('es-ES', {weekday:'long', day:'numeric', month:'long'}).format(parseYMD(s));
const fmtShort = s => new Intl.DateTimeFormat('es-ES', {day:'numeric', month:'short'}).format(parseYMD(s));
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const isMobile = () => window.matchMedia('(max-width: 880px)').matches;

/* ═══════════ BIBLIOTECA (contenido curado) ═══════════ */
const LIBRARY = {
  intro: `Para abordar con éxito la vasta información contenida en estos documentos, es fundamental establecer una estructura que vaya de lo general a lo particular, priorizando la formación del <em>pensamiento iniciático</em> antes de explorar las vertientes más complejas del esoterismo y la alquimia. El siguiente camino de estudio está diseñado para optimizar la comprensión de la tradición masónica.`,
  sections: [
    {
      roman: 'I', title: 'Fundamentos de la Iniciación', minRank: 1,
      desc: 'Antes de adentrarse en rituales específicos, es esencial comprender la naturaleza y el propósito de la orden.',
      books: [
        { id:'lib-ideal', title:'El Ideal Iniciático', author:'Oswald Wirth',
          desc:'Crucial para distinguir entre la verdadera iniciación tradicional y las «malsanas elucubraciones» o falsas enseñanzas. Define la masonería como una confraternidad universal que busca formar pensadores independientes.',
          q:'El Ideal Iniciatico Wirth', url:'https://drive.google.com/file/d/1_UxZh-MGdb6FyROqU1R_2PNb9sDfJaag/view' },
        { id:'lib-33grados', title:'Los 33 Grados de la Masonería', author:'— Siete Obstáculos para la Iniciación',
          desc:'Específicamente la sección sobre los Siete Obstáculos: la soberbia del saber profano y la necedad, entre otros desafíos que deben superarse para progresar internamente.',
          q:'33 grados masoneria' },
        { id:'lib-lomas', title:'¿Qué es la Iniciación?', author:'Robert Lomas',
          desc:'Localizado en The Secret Science of Masonic Initiation. Ayuda a despertar la curiosidad espiritual y a entender el rito como una herramienta de autoconocimiento.',
          q:'Secret Science of Masonic Initiation Lomas' },
      ]
    },
    {
      roman: 'II', title: 'Instrucción del Primer Grado (Aprendiz)', minRank: 1,
      desc: 'Una vez sentadas las bases, el enfoque debe dirigirse a la instrucción práctica y simbólica del grado inicial.',
      books: [
        { id:'lib-aprendiz-wirth', title:'El Libro del Aprendiz', author:'Oswald Wirth',
          desc:'Manual fundamental: historia, ritualismo, deberes y catecismo interpretativo del grado. Enfatiza que el pensamiento es lo que vuelve libre al hombre.',
          q:'Libro del Aprendiz Wirth', url:'https://drive.google.com/file/d/1lmPPKzeGmzMbP7nBbfCqUOfMAkuXucJ_/view' },
        { id:'lib-lavagnini', title:'Manual del Aprendiz', author:'Aldo Lavagnini',
          desc:'Estudio interpretativo profundo sobre el valor iniciático de los símbolos y las alegorías de este primer paso.',
          q:'Manual del Aprendiz Lavagnini', url:'https://drive.google.com/file/d/1T-8PKobcgy5GWq-DBii5dkRr2KCaYIhK/view' },
        { id:'lib-adoum', title:'El Aprendiz y sus Misterios', author:'Jorge Adoum',
          desc:'Exploración de los propósitos y la historia de la masonería desde la mirada del primer grado.',
          q:'El Aprendiz y sus Misterios Adoum', url:'https://drive.google.com/file/d/1M_K_VNpk7Y43bNrgK8bBbpvIIY4ceQQG/view' },
        { id:'lib-filosofico', title:'Contenido Filosófico del Ritual de Primer Grado', author:'Análisis ritual',
          desc:'Analiza el ritual desde prismas ontológicos y gnoseológicos: la verdad y el paso de la piedra bruta a la piedra pulida.',
          q:'Contenido Filosofico Ritual Primer Grado', url:'https://drive.google.com/file/d/1Ra9bTdtTeHef7w8hrvjvUW-0SNu-VGjd/view' },
      ]
    },
    {
      roman: 'III', title: 'Simbolismo y Evolución Histórica', minRank: 2,
      desc: 'Comprendido el grado, se puede expandir el conocimiento hacia el origen de los símbolos.',
      books: [
        { id:'lib-mackey', title:'El Simbolismo Francmasónico', author:'Albert Mackey',
          desc:'Explora la evolución histórica de la institución; sostiene que la filosofía masónica enseña dos dogmas principales: la unidad de Dios y la inmortalidad del alma.',
          q:'Simbolismo Francmasonico Mackey', url:'https://drive.google.com/file/d/1jQee_aohb1a1NAjNUsb6EmViVC3LxMBC/view' },
        { id:'lib-hall', title:'The Lost Keys of Freemasonry', author:'Manly P. Hall',
          desc:'Analiza las cualificaciones de un «verdadero masón» y el misterio de Hiram Abiff. Reflexiones sobre el uso de la mente y la transmutación espiritual.',
          q:'Lost Keys of Freemasonry Hall', url:'https://drive.google.com/file/d/1E_q3q6Yl3PcpGqUhZuh3dRuRgpDPYOCj/view' },
        { id:'lib-buck', title:'Mystic Masonry', author:'J. D. Buck',
          desc:'Relaciona los símbolos masónicos con los grandes misterios de la antigüedad y la naturaleza septenaria del hombre.',
          q:'Mystic Masonry Buck', url:'https://drive.google.com/file/d/1qJ6oX3P3O5sS7P3lYBo-JbP-kNjWNSrJ/view' },
      ]
    },
    {
      roman: 'IV', title: 'Ciencias Herméticas, Alquímicas y Ocultismo', minRank: 3,
      desc: 'Este bloque conecta la masonería con otras tradiciones esotéricas para una comprensión integral.',
      books: [
        { id:'lib-hermetismo', title:'Hermetismo y Francmasonería', author:'Oswald Wirth',
          desc:'Plantea que la masonería es una transfiguración moderna del antiguo hermetismo y la alquimia. Estudio comparativo basado en textos de alquimistas clásicos.',
          q:'Hermetismo y Francmasoneria Wirth', url:'https://drive.google.com/file/d/1auAUXufueGDjV7d6eq_N64yC0qcVf4J0/view' },
        { id:'lib-simb-hermetico', title:'El Simbolismo Hermético', author:'Oswald Wirth',
          desc:'Detalla la ideografía alquímica —el azufre, el mercurio, la sal— y su relación con la Gran Obra.',
          q:'Simbolismo Hermetico Wirth', url:'https://drive.google.com/file/d/1RTDXNGz00kNoyKx-SxsiaZ8AtI1Wax8n/view' },
        { id:'lib-hogan', title:'The Alchemical Keys to Masonic Ritual', author:'Timothy Hogan',
          desc:'Revela niveles de significado ocultos tras los símbolos que a menudo se pierden en las logias modernas.',
          q:'Alchemical Keys to Masonic Ritual Hogan', url:'https://drive.google.com/file/d/11wDvmpmZyoWSroUEmdec-5umer0bGogU/view' },
        { id:'lib-melquisedec', title:'Melquisedec y el Misterio del Fuego', author:'Manly P. Hall',
          desc:'Tratado sobre el simbolismo del fuego y la regeneración espiritual.',
          q:'Melquisedec Misterio del Fuego Hall', url:'https://drive.google.com/file/d/1BXQ_ltPnIJnbHuR_ZePRExMnQdGVVHsD/view' },
        { id:'lib-clark', title:'The 231 Gates of Initiation', author:'Rawn Clark',
          desc:'Introducción a los senderos de sabiduría basados en el Árbol de la Vida hebreo.',
          q:'231 Gates of Initiation Clark' },
        { id:'lib-shem', title:'Black Magic Evocation of the Shem ha-Mephorash', author:'Estudio avanzado',
          desc:'Para un estudio más avanzado sobre invocaciones y entidades; debe abordarse con la madurez que brindan las lecturas anteriores.',
          q:'Shem ha Mephorash' },
      ]
    },
    {
      roman: 'V', title: 'Referencia, Estilo y Evaluación', minRank: 1,
      desc: 'Para consolidar lo aprendido y asegurar la corrección en la práctica.',
      books: [
        { id:'lib-estilo', title:'Libro de Estilo Masónico', author:'Ignacio Méndez-Trelles',
          desc:'Guía práctica para la corrección en el trabajo masónico: ortotipografía, abreviaturas y netiqueta.',
          q:'Libro de Estilo Masonico', url:'https://drive.google.com/file/d/1DherRsyjdcKhzWAwBNf672ZM43P85c0m/view' },
        { id:'lib-examen', title:'Examen de Primera (con respuestas)', author:'Evaluación',
          desc:'Úsalo al final del ciclo de estudio para evaluar tu comprensión: la virtud, el vicio y la ubicación de los oficiales en la logia.',
          q:'Examen de Primera', url:'https://drive.google.com/file/d/1haqRhmc-JC24ZVf3POiTTQ3OJISuTwcv/view' },
        { id:'lib-negro', title:'Libro Negro de la Francmasonería', author:'Serge Raynaud de la Ferrière',
          desc:'Introducción a la dirección iniciática universal.',
          q:'Libro Negro de la Francmasoneria', url:'https://drive.google.com/file/d/1oWm3o1C88bLko2C1S_G3JWoofOmDEqNC/view' },
      ]
    },
  ]
};
const ALL_BOOKS = LIBRARY.sections.flatMap(s => s.books.map(b => ({...b, section: s})));

/* ═══════════ USUARIOS, ROLES Y SESIÓN ═══════════ */
const ROLES = {
  gadu:      { label:'Administrador ∴ GADU', short:'GADU',    rank:6 },
  venerable: { label:'Venerable Maestro',    short:'V∴M∴',    rank:5 },
  vig1:      { label:'Primer Vigilante',     short:'1er Vig∴', rank:4 },
  vig2:      { label:'Segundo Vigilante',    short:'2do Vig∴', rank:3 },
  companero: { label:'Compañero Masón',      short:'Comp∴',   rank:2 },
  aprendiz:  { label:'Aprendiz Masón',       short:'Apr∴',    rank:1 },
};
const REQUESTABLE = ['aprendiz','companero','vig2','vig1','venerable'];

/* Hash simple con sal (disuasorio; los datos viven en este navegador) */
function pwHash(str) {
  let h = 0x811c9dc5;
  const s = 'gadu∴' + str + '∴' + str.length;
  for (let r = 0; r < 9; r++) {
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  }
  return h.toString(16).padStart(8, '0') + (str.length * 7 % 97).toString(16);
}

let STORE;
try { STORE = JSON.parse(localStorage.getItem(STORE_KEY)) || null; } catch { STORE = null; }
if (!STORE || !Array.isArray(STORE.users)) STORE = { users: [] };

/* meta del templo: lista blanca, secciones ocultas y documentos asignados */
function ensureMeta() {
  STORE.meta = STORE.meta || {};
  STORE.meta.customDocs = STORE.meta.customDocs || [];
  STORE.meta.libAccess = STORE.meta.libAccess || {};
  STORE.meta.libHidden = STORE.meta.libHidden || {};
}
ensureMeta();

/* ═══════════ SUPABASE — TEMPLO CENTRALIZADO ═══════════ */
const SB_URL = 'https://utoqllznqsvdecxeawew.supabase.co/rest/v1';
const SB_KEY = 'sb_publishable_8r4QVO2k7u8j8JLCjVpzPg_yLw0yuSM';
const TEMPLE_KEY = 'gadu.temple.v1';
const SESSION_KEY = 'gadu.session.v1';

let TEMPLE = null;
try { TEMPLE = JSON.parse(localStorage.getItem(TEMPLE_KEY)); } catch {}

/* la sesión (quién está conectado) es de ESTE dispositivo, nunca se sube */
let SESSION = null;
try { SESSION = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch {}
if (!SESSION) SESSION = { userId: STORE.sessionId || null }; /* migración de versiones previas */
delete STORE.sessionId;
const saveSession = () => localStorage.setItem(SESSION_KEY, JSON.stringify(SESSION));

async function sbFetch(path, opts = {}) {
  const res = await fetch(SB_URL + path, {
    ...opts,
    headers: {
      apikey: SB_KEY,
      Authorization: 'Bearer ' + SB_KEY,
      'Content-Type': 'application/json',
      ...(opts.method && opts.method !== 'GET' ? { Prefer: 'return=representation' } : {}),
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) { const t = await res.text().catch(() => ''); const err = new Error('sb ' + res.status); err.status = res.status; err.body = t; throw err; }
  return res.status === 204 ? null : res.json();
}

const SYNC = { dirty: false, busy: false, offline: false };
function updateSyncUI() {
  const el = $('#sync-status');
  if (!el) return;
  if (!TEMPLE) { el.textContent = '⌂ sin templo'; return; }
  el.textContent = `⌂ ${TEMPLE.name} · ${SYNC.busy ? 'guardando…' : SYNC.dirty ? 'cambios locales' : SYNC.offline ? 'sin conexión (local)' : 'sincronizado'}`;
}

async function pushTemple() {
  if (!TEMPLE || SYNC.busy) return;
  SYNC.busy = true; updateSyncUI();
  try {
    await sbFetch(`/temples?id=eq.${TEMPLE.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ data: { users: STORE.users, meta: STORE.meta }, updated_at: new Date().toISOString() }),
    });
    SYNC.dirty = false; SYNC.offline = false;
  } catch { SYNC.offline = true; }
  SYNC.busy = false; updateSyncUI();
  if (SYNC.dirty) pushSoon(); /* llegaron cambios mientras subíamos */
}
const pushSoon = debounce(pushTemple, 1500);

async function pullTemple(silent = true) {
  if (!TEMPLE || SYNC.dirty || SYNC.busy) return;
  try {
    const rows = await sbFetch(`/temples?id=eq.${TEMPLE.id}&select=data`);
    const remote = rows && rows[0] && rows[0].data;
    if (remote && Array.isArray(remote.users)) {
      if (JSON.stringify(remote) !== JSON.stringify({ users: STORE.users, meta: STORE.meta })) {
        STORE.users = remote.users;
        STORE.meta = remote.meta || {};
        ensureMeta();
        localStorage.setItem(STORE_KEY, JSON.stringify(STORE));
        render();
        if (!silent) toast('⟳ Templo sincronizado');
      } else if (!silent) toast('⟳ Todo al día');
    }
    SYNC.offline = false;
  } catch { SYNC.offline = true; if (!silent) toast('Sin conexión — trabajando en local'); }
  updateSyncUI();
}

/* guardar = caché local inmediata + subida al templo con pequeño retraso */
const persist = () => {
  localStorage.setItem(STORE_KEY, JSON.stringify(STORE));
  if (TEMPLE) { SYNC.dirty = true; pushSoon(); }
  updateSyncUI();
};
const currentUser = () => STORE.users.find(u => u.id === SESSION.userId) || null;
const getUser = id => STORE.users.find(u => u.id === id);
const userName = id => (getUser(id) || {}).name || '¿?';
const rankOf = u => (u && u.status === 'active' && ROLES[u.role]) ? ROLES[u.role].rank : 1;
const canSeeAll = u => rankOf(u) >= 5;
const roleLabel = u => u.status === 'pending' ? 'Pendiente' : (ROLES[u.role] || ROLES.aprendiz).label;
const roleShort = u => u.status === 'pending' ? 'Pend∴' : (ROLES[u.role] || ROLES.aprendiz).short;

function assignTargets(u) {
  if (!u || u.status !== 'active') return [];
  if (rankOf(u) >= 5) return STORE.users.filter(x => x.id !== u.id);
  if (u.role === 'vig1') return STORE.users.filter(x => x.role === 'companero' && x.status === 'active');
  if (u.role === 'vig2') return STORE.users.filter(x => x.role === 'aprendiz' && x.status === 'active');
  return [];
}
const canMonitor = u => canSeeAll(u) || (u && u.status === 'active' && (u.role === 'vig1' || u.role === 'vig2'));
const canGradeRole = (me, subRole) => canSeeAll(me) || (me.role === 'vig1' && subRole === 'companero') || (me.role === 'vig2' && subRole === 'aprendiz');

/* lista blanca: qué roles ven cada sección de la biblioteca (GADU y V∴M∴ siempre ven todo) */
function sectionRoles(sec) {
  const saved = STORE.meta.libAccess[sec.roman];
  if (Array.isArray(saved)) return saved;
  return Object.keys(ROLES).filter(k => ROLES[k].rank < 5 && ROLES[k].rank >= sec.minRank);
}
const sectionHidden = sec => !!(STORE.meta.libHidden && STORE.meta.libHidden[sec.roman]);
const sectionVisibleTo = (sec, u) => canSeeAll(u) || (!sectionHidden(sec) && sectionRoles(sec).includes(u.role));

function blankData(name) {
  const t = today();
  return {
    notes: [
      { id: uid(), title:'Bienvenido a GADU', pinned:true, created:t, updated:t,
        body:`## ∴ Salud, ${name}

Este es tu taller personal: **notas**, **tareas** y **calendario** conectados entre sí, junto a la biblioteca del camino de estudio.

- Escribe en **Markdown** y enlaza notas con [[dobles corchetes]].
- Etiqueta con almohadilla: #estudio
- Pulsa \`Ctrl + K\` para buscar o ejecutar cualquier cosa.
- En el calendario semanal, arrastra una tarea para reservar un bloque de tiempo.

> «Conócete a ti mismo y conocerás el universo y a los dioses.»

Nadie más puede ver tu taller, salvo el V∴M∴ y el Administrador del templo. ∴`},
    ],
    tasks: [], events: [], libStatus: {},
    prefs: { theme:'dark', sidebar:true },
  };
}

function seedAdminData() {
  const t = today();
  const data = {
    notes: [
      { id:'n-welcome', title:'Bienvenido a GADU', pinned:true, created:t, updated:t,
        body:`## ∴ Tu cuaderno de trabajos masónicos

GADU es un ecosistema unificado: **notas**, **tareas** y **calendario** conectados entre sí, junto a la [[Plan de estudio|biblioteca]] del camino de estudio.

### Cómo trabajar aquí

- Escribe en **Markdown**: títulos con \`#\`, listas, citas con \`>\`.
- Enlaza notas entre corchetes: [[Plan de estudio]].
- Etiqueta con almohadilla: #aprendiz #simbolismo
- Pulsa \`Ctrl + K\` para buscar o ejecutar cualquier cosa.
- En el calendario, **arrastra una tarea** a la rejilla semanal para reservar un bloque de tiempo.

> «Conócete a ti mismo y conocerás el universo y a los dioses.»

---

Que la luz te acompañe en el trabajo. ∴`},
      { id:'n-plan', title:'Plan de estudio', pinned:true, created:t, updated:t,
        body:`# Plan de estudio

El camino completo vive en la **Biblioteca** (barra lateral). El orden va de lo general a lo particular:

1. Fundamentos de la Iniciación
2. Instrucción del Primer Grado
3. Simbolismo y Evolución Histórica
4. Ciencias Herméticas y Alquímicas
5. Referencia, Estilo y Evaluación

Estado actual: comenzando con *El Ideal Iniciático* de Wirth. #estudio

Notas de lectura relacionadas: [[Bienvenido a GADU]]`},
    ],
    tasks: [
      { id:'tk-1', title:'Leer «El Ideal Iniciático» — cap. 1 y 2', status:'doing', priority:'alta',
        due:addDays(t,3), project:'Camino de estudio', subtasks:[{text:'Capítulo 1', done:true},{text:'Capítulo 2', done:false}], created:t },
      { id:'tk-2', title:'Redactar plancha sobre la piedra bruta', status:'todo', priority:'media',
        due:addDays(t,10), project:'Planchas', subtasks:[], created:t },
      { id:'tk-3', title:'Repasar catecismo del grado', status:'todo', priority:'baja', due:'', project:'Camino de estudio', subtasks:[], created:t },
    ],
    events: [], libStatus: { 'lib-ideal': 'leyendo' },
    prefs: { theme:'dark', sidebar:true },
  };
  return data;
}

function ensureHabits(data) {
  if ((data.events || []).some(e => e.repeat && e.repeat !== 'none')) return;
  const nextDow = dow => { const d = new Date(); d.setDate(d.getDate() + ((dow - d.getDay() + 7) % 7)); return ymd(d); };
  data.events = data.events || [];
  data.events.push(
    { id: 'ev-logia', title: 'Tenida en Logia', date: nextDow(5), start: '19:00', dur: 120, taskId: null, repeat: 'weekly', skip: [] },
    { id: 'ev-instruccion', title: 'Instrucción', date: nextDow(3), start: '09:00', dur: 90, taskId: null, repeat: 'weekly', skip: [] },
  );
}

/* DB = datos del taller actualmente visible (propio, o ajeno en Modo GADU) */
let DB = null;
const viewedUser = () => (UI.viewAs && getUser(UI.viewAs)) || currentUser();
function bindData() {
  const u = viewedUser();
  DB = u ? u.data : null;
}
const save = () => {
  const me = currentUser();
  if (me && !UI.viewAs) me.lastActive = today();
  persist();
};

const UI = {
  view:'dashboard', noteId:null, noteSearch:'', noteTag:null, editMode:false,
  taskView:'kanban', taskFilter:{ status:null, project:null },
  calMode:'month', calCursor: today(),
  palSel:0, palItems:[],
  viewAs: null,
  sideOpen: false, /* en móvil la barra es un panel transitorio: inicia oculta */
};

/* ═══════════ MARKDOWN ═══════════ */
function mdInline(s) {
  return s
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (m, target, label) => wikilink(target, label))
    .replace(/\[\[([^\]]+)\]\]/g, (m, target) => wikilink(target, target))
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/(^|\s)#([\p{L}][\p{L}\d_-]*)/gu, '$1<a class="tag-inline" data-action="note-tag" data-tag="$2">#$2</a>');
}
function wikilink(target, label) {
  const exists = DB.notes.some(n => norm(n.title) === norm(target.trim()));
  return `<a class="wl${exists ? '' : ' missing'}" data-action="wikilink" data-wl="${esc(target.trim())}">${esc(label.trim())}</a>`;
}
function md(src) {
  const codeBlocks = [];
  let s = esc(src).replace(/```([\s\S]*?)```/g, (m, code) => {
    codeBlocks.push(`<pre><code>${code.trim()}</code></pre>`);
    return `\u0000${codeBlocks.length - 1}\u0000`;
  });
  const lines = s.split('\n');
  const out = [];
  let list = null;
  let quote = [];
  const flushList = () => { if (list) { out.push(`</${list}>`); list = null; } };
  const flushQuote = () => { if (quote.length) { out.push(`<blockquote>${quote.map(mdInline).join('<br>')}</blockquote>`); quote = []; } };
  for (const line of lines) {
    let m;
    if ((m = line.match(/^(#{1,3})\s+(.*)/))) {
      flushList(); flushQuote();
      out.push(`<h${m[1].length}>${mdInline(m[2])}</h${m[1].length}>`);
    } else if (/^(---|\*\*\*|∴)\s*$/.test(line.trim())) {
      flushList(); flushQuote(); out.push('<hr>');
    } else if ((m = line.match(/^&gt;\s?(.*)/))) {
      flushList(); quote.push(m[1]);
    } else if ((m = line.match(/^\s*[-*]\s+\[([ xX])\]\s+(.*)/))) {
      flushQuote();
      if (list !== 'ul') { flushList(); out.push('<ul>'); list = 'ul'; }
      const done = m[1] !== ' ';
      out.push(`<li class="task-line"><span class="tickbox${done ? ' done' : ''}">${done ? '✓' : ''}</span><span${done ? ' style="opacity:.55;text-decoration:line-through"' : ''}>${mdInline(m[2])}</span></li>`);
    } else if ((m = line.match(/^\s*[-*]\s+(.*)/))) {
      flushQuote();
      if (list !== 'ul') { flushList(); out.push('<ul>'); list = 'ul'; }
      out.push(`<li>${mdInline(m[1])}</li>`);
    } else if ((m = line.match(/^\s*\d+[.)]\s+(.*)/))) {
      flushQuote();
      if (list !== 'ol') { flushList(); out.push('<ol>'); list = 'ol'; }
      out.push(`<li>${mdInline(m[1])}</li>`);
    } else if (line.trim() === '') {
      flushList(); flushQuote();
    } else {
      flushList(); flushQuote();
      out.push(`<p>${mdInline(line)}</p>`);
    }
  }
  flushList(); flushQuote();
  return out.join('\n').replace(/\u0000(\d+)\u0000/g, (m, i) => codeBlocks[+i]);
}

/* ═══════════ HELPERS DE DATOS ═══════════ */
const getNote = id => DB.notes.find(n => n.id === id);
const getTask = id => DB.tasks.find(t => t.id === id);
const getEvent = id => DB.events.find(e => e.id === id);
const noteTags = n => [...new Set([...(n.body || '').matchAll(/(^|\s)#([\p{L}][\p{L}\d_-]*)/gu)].map(m => m[2]))];
const backlinksOf = note => DB.notes.filter(n => n.id !== note.id && new RegExp(`\\[\\[\\s*${note.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(\\||\\]\\])`, 'i').test(n.body || ''));
const driveSearch = q => `https://drive.google.com/drive/search?q=${encodeURIComponent(q)}`;

/* ─── recurrencia ─── */
const REPEAT_LABELS = {
  none:'No se repite', daily:'Cada día', weekly:'Cada semana', biweekly:'Cada 2 semanas',
  monthly:'Cada mes (mismo número de día)', monthlyDow:'Cada mes (mismo día y semana, ej. 1er viernes)',
};
const TASK_REPEAT_LABELS = { none:'No se repite', daily:'Cada día', weekly:'Cada semana', biweekly:'Cada 2 semanas', monthly:'Cada mes' };
const isRepeating = ev => ev.repeat && ev.repeat !== 'none';
function occursOn(ev, dateStr) {
  if ((ev.skip || []).includes(dateStr)) return false;
  if (ev.date === dateStr) return true;
  if (!isRepeating(ev) || dateStr < ev.date) return false;
  if (ev.until && dateStr > ev.until) return false;
  const a = parseYMD(ev.date), b = parseYMD(dateStr);
  if (ev.repeat === 'daily') return true;
  if (ev.repeat === 'weekly' || ev.repeat === 'biweekly') {
    if (a.getDay() !== b.getDay()) return false;
    if (ev.repeat === 'weekly') return true;
    return Math.round((b - a) / (7 * 86400000)) % 2 === 0;
  }
  if (ev.repeat === 'monthly') return a.getDate() === b.getDate();
  if (ev.repeat === 'monthlyDow') {
    if (a.getDay() !== b.getDay()) return false;
    return Math.ceil(a.getDate() / 7) === Math.ceil(b.getDate() / 7);
  }
  return false;
}
/* siguiente vencimiento de una tarea recurrente */
function nextDue(due, repeat) {
  const base = due || today();
  if (repeat === 'daily') return addDays(base, 1);
  if (repeat === 'weekly') return addDays(base, 7);
  if (repeat === 'biweekly') return addDays(base, 14);
  if (repeat === 'monthly') { const d = parseYMD(base); d.setMonth(d.getMonth() + 1); return ymd(d); }
  return base;
}
const eventsOn = dateStr => DB.events.filter(e => occursOn(e, dateStr));
const repGlyph = ev => isRepeating(ev) ? ' <span class="rep" title="Se repite">↻</span>' : '';

function newNote(title = 'Nota sin título', body = '') {
  const n = { id: uid(), title, body, pinned: false, created: today(), updated: today() };
  DB.notes.unshift(n); save();
  return n;
}
function newTask(title, extra = {}) {
  const t = { id: uid(), title, status:'todo', priority:'media', due:'', project:'', subtasks:[], created: today(), ...extra };
  DB.tasks.unshift(t); save();
  return t;
}

/* ═══════════ RENDER RAÍZ ═══════════ */
const VIEW_NAMES = { dashboard:'Tablero', notes:'Notas', tasks:'Tareas', calendar:'Calendario', library:'Biblioteca', monitor:'Monitoreo', admin:'Administración' };
const viewEl = $('#view');
const authEl = $('#auth');

const VIEW_HASH = { dashboard:'#/tablero', notes:'#/notas', tasks:'#/tareas', calendar:'#/calendario', library:'#/biblioteca', monitor:'#/monitoreo', admin:'#/administracion' };

function go(view) {
  if (view === 'admin' && !canSeeAll(currentUser())) { toast('Reservado al Or∴ de administración'); return; }
  if (view === 'monitor' && !canMonitor(currentUser())) { toast('Reservado a los Vigilantes y al Or∴'); return; }
  UI.view = view;
  if (isMobile()) UI.sideOpen = false; /* navegar cierra el menú en móvil */
  render();
  /* historial real: cada vista es una entrada — el botón atrás recorre las vistas */
  const h = VIEW_HASH[UI.view];
  if (h && location.hash !== h) location.hash = h;
}

function render() {
  if (!TEMPLE) { renderTempleGate(); return; } /* rol «templo»: obligatorio antes de todo */
  const me = currentUser();
  if (!me) { renderAuth(); return; }
  authEl.hidden = true;
  bindData();
  updateSyncUI();

  document.body.dataset.theme = me.data.prefs.theme;
  const sideVisible = isMobile() ? UI.sideOpen : me.data.prefs.sidebar;
  $('#app').classList.toggle('side-hidden', !sideVisible);
  $('#side-veil').hidden = !(isMobile() && UI.sideOpen);
  $('#crumb').textContent = VIEW_NAMES[UI.view];
  $$('.nav-item').forEach(a => a.classList.toggle('active', a.dataset.nav === UI.view));
  $('#nav-admin').hidden = !canSeeAll(me);
  $('#nav-monitor').hidden = !canMonitor(me);
  $('#backup-tools').hidden = me.role !== 'gadu';
  $('#top-date').textContent = cap(new Intl.DateTimeFormat('es-ES', {weekday:'long', day:'numeric', month:'long', year:'numeric'}).format(new Date()));
  $('#drive-link').href = DRIVE_FOLDER;

  /* chip de usuario */
  $('#user-chip').innerHTML = `
    <span class="u-avatar">${esc(me.name.charAt(0).toUpperCase())}</span>
    <span class="u-info"><b>${esc(me.name)}</b><span>${esc(roleShort(me))}</span></span>
    <button class="logout" data-action="logout" title="Cerrar sesión">⏻</button>`;

  /* banner de modo */
  const banner = $('#mode-banner');
  if (UI.viewAs && UI.viewAs !== me.id) {
    const v = getUser(UI.viewAs);
    banner.hidden = false; banner.className = 'mode-banner';
    banner.innerHTML = `◉ <b>Modo GADU</b> — contemplando el taller de <b>${esc(v.name)}</b> (${esc(roleLabel(v))}). Todo cambio afecta su cuaderno.
      <button class="btn sm" data-action="exit-viewas">Salir del modo</button>`;
  } else if (me.status === 'pending') {
    banner.hidden = false; banner.className = 'mode-banner warn';
    banner.innerHTML = `⧗ Tu solicitud como <b>${esc((ROLES[me.requestedRole] || ROLES.aprendiz).label)}</b> espera la aprobación del Administrador. Mientras tanto, tu taller ya es tuyo.`;
  } else {
    banner.hidden = true; banner.innerHTML = '';
  }

  viewEl.classList.remove('enter');
  viewEl.innerHTML = VIEWS[UI.view]();
  void viewEl.offsetWidth;
  viewEl.classList.add('enter');
  viewEl.scrollTop = 0;
  if (BINDERS[UI.view]) BINDERS[UI.view]();
}

/* ═══════════ ANTESALA (bienvenida por rol + frase) ═══════════ */
const ROLE_WELCOME = {
  gadu: 'Administrador ∴ GADU — el templo entero está bajo tu mirada. Que tu compás trace siempre con justicia.',
  venerable: 'Venerable Maestro — desde el Or∴ tu luz ordena el trabajo. La logia se levanta contigo.',
  vig1: 'Primer Vigilante — la columna del mediodía te confía a los Compañeros. Mide sus obras con el nivel.',
  vig2: 'Segundo Vigilante — tuya es la guía de los Aprendices. Enséñales a desbastar la piedra.',
  companero: 'Compañero Masón — el cincel ya conoce tu mano. Del trabajo bien hecho nace la piedra pulida.',
  aprendiz: 'Aprendiz Masón — escucha, observa y calla. La piedra bruta espera tu primer golpe de maceta.',
};
const PHRASES = [
  'Conócete a ti mismo y conocerás el universo y a los dioses.',
  'V∴I∴T∴R∴I∴O∴L∴ — visita el interior de la tierra y, rectificando, encontrarás la piedra oculta.',
  'La piedra bruta solo se pule con el trabajo constante del cincel.',
  'El pensamiento es lo que vuelve libre al hombre.',
  'Nadie entra aquí si no ama la geometría.',
  'La luz no se regala: se conquista trabajando en el silencio.',
  'Lo que la soberbia derriba, la humildad lo edifica.',
  'Cada tenida es un peldaño; cada trabajo, un golpe de maceta.',
  'El verdadero templo se construye en el corazón del masón.',
  'Ordo ab chao — del caos, el orden.',
  'La escuadra rige las acciones; el compás, los deseos.',
  'Ningún viento es favorable para quien no sabe a qué puerto va.',
  'El silencio es la primera piedra del aprendizaje.',
  'De lo general a lo particular; de la piedra bruta a la piedra pulida.',
  'La constancia vence lo que la fuerza no alcanza.',
  'Somos obreros de una obra que no veremos terminada: aun así, labramos.',
];

function showSplash(u) {
  if ($('.splash')) return;
  const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
  const el = document.createElement('div');
  el.className = 'splash';
  el.innerHTML = `
  <div class="splash-inner">
    <span class="splash-mark">∴</span>
    <h2 class="splash-name">Salud, ${esc(u.name)}</h2>
    <p class="splash-role">${esc(ROLE_WELCOME[u.role] || ROLE_WELCOME.aprendiz)}</p>
    <div class="splash-rule"><span class="mosaic-strip"></span></div>
    <p class="splash-phrase">«${esc(phrase)}»</p>
    <span class="splash-hint">∴ entrando al templo ∴</span>
  </div>`;
  document.body.appendChild(el);
  const out = () => { if (!el.parentNode) return; el.classList.add('out'); setTimeout(() => el.remove(), 750); };
  el.addEventListener('click', out);
  setTimeout(out, 3600);
}

/* ═══════════ LA PUERTA DEL TEMPLO (crear o unirse) ═══════════ */
const GATE = { mode: 'join', error: '', busy: false };

function renderTempleGate() {
  document.body.dataset.theme = document.body.dataset.theme || 'dark';
  authEl.hidden = false;
  const create = GATE.mode === 'create';
  authEl.innerHTML = `
  <div class="auth-box">
    <div class="auth-mark">⌂</div>
    <h1>El Templo</h1>
    <p class="auth-sub">Todo trabajo necesita un templo. Únete al de tu logia o levanta uno nuevo.</p>
    <div class="seg" style="margin-bottom:1.2rem">
      <button class="${!create ? 'on' : ''}" data-gate-mode="join">Unirme a un templo</button>
      <button class="${create ? 'on' : ''}" data-gate-mode="create">Levantar un templo</button>
    </div>
    <div class="field"><label>Nombre del templo</label><input id="tg-name" autocomplete="off" placeholder="p. ej. Logia Luz y Verdad N° 7"></div>
    <div class="field"><label>Código de acceso</label><input id="tg-code" type="password" placeholder="${create ? 'Elige un código para tu logia' : 'El código que te dio el GADU'}"></div>
    ${create ? '<div class="field"><label>Repite el código</label><input id="tg-code2" type="password"></div>' : ''}
    <p class="auth-error">${esc(GATE.error)}</p>
    <button class="btn gold" id="tg-submit" ${GATE.busy ? 'disabled' : ''}>${GATE.busy ? '∴ Trabajando…' : create ? '⌂ Levantar templo' : '⌂ Entrar al templo'}</button>
    ${create && STORE.users.length ? `<p class="auth-alt">Lo que ya tienes en este dispositivo (${STORE.users.length} usuario${STORE.users.length === 1 ? '' : 's'}) se conservará como base del nuevo templo.</p>` : ''}
  </div>`;

  $$('[data-gate-mode]', authEl).forEach(b => b.addEventListener('click', () => { GATE.mode = b.dataset.gateMode; GATE.error = ''; renderTempleGate(); }));

  const submit = async () => {
    if (GATE.busy) return;
    const name = $('#tg-name').value.trim();
    const code = $('#tg-code').value;
    if (!name) { GATE.error = 'El templo necesita un nombre.'; return renderTempleGate(); }
    if (code.length < 4) { GATE.error = 'El código debe tener al menos 4 caracteres.'; return renderTempleGate(); }
    if (create && code !== $('#tg-code2').value) { GATE.error = 'Los códigos no coinciden.'; return renderTempleGate(); }
    GATE.busy = true; renderTempleGate();
    try {
      if (create) {
        ensureMeta();
        const rows = await sbFetch('/temples', {
          method: 'POST',
          body: JSON.stringify({ name, code, data: { users: STORE.users, meta: STORE.meta } }),
        });
        TEMPLE = { id: rows[0].id, name: rows[0].name, code };
      } else {
        const rows = await sbFetch(`/temples?name=eq.${encodeURIComponent(name)}&code=eq.${encodeURIComponent(code)}&select=id,name,data`);
        if (!rows.length) { GATE.busy = false; GATE.error = 'No existe ese templo o el código no es correcto.'; return renderTempleGate(); }
        TEMPLE = { id: rows[0].id, name: rows[0].name, code };
        const remote = rows[0].data || {};
        STORE = { users: Array.isArray(remote.users) ? remote.users : [], meta: remote.meta || {} };
        ensureMeta();
        SESSION.userId = null; saveSession();
        localStorage.setItem(STORE_KEY, JSON.stringify(STORE));
      }
      localStorage.setItem(TEMPLE_KEY, JSON.stringify(TEMPLE));
      GATE.busy = false; GATE.error = '';
      AUTH.mode = 'login'; AUTH.pick = null;
      render();
      toast(`⌂ Conectado al templo «${TEMPLE.name}»`);
    } catch (e) {
      GATE.busy = false;
      GATE.error = e.status === 409 ? 'Ya existe un templo con ese nombre.' : 'Sin conexión con el templo. Revisa tu internet e inténtalo de nuevo.';
      renderTempleGate();
    }
  };
  $('#tg-submit').addEventListener('click', submit);
  authEl.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); }));
  $('#tg-name').focus();
}

function leaveTemple() {
  if (!confirm(`¿Desconectar este dispositivo del templo «${TEMPLE ? TEMPLE.name : ''}»? Tus datos siguen a salvo en la nube.`)) return;
  TEMPLE = null;
  localStorage.removeItem(TEMPLE_KEY);
  STORE = { users: [] }; ensureMeta();
  localStorage.setItem(STORE_KEY, JSON.stringify(STORE));
  SESSION.userId = null; saveSession();
  render();
}

/* ═══════════ PANTALLA DE ACCESO ═══════════ */
const AUTH = { mode: 'login', pick: null, error: '' };

function renderAuth() {
  document.body.dataset.theme = document.body.dataset.theme || 'dark';
  authEl.hidden = false;
  if (!STORE.users.length) AUTH.mode = 'setup';

  const err = `<p class="auth-error">${esc(AUTH.error)}</p>`;

  if (AUTH.mode === 'setup') {
    authEl.innerHTML = `
    <div class="auth-box">
      <div class="auth-mark">∴</div>
      <h1>G∴A∴D∴U∴</h1>
      <p class="auth-sub">Fundación del templo — crea al Administrador supremo</p>
      <div class="field"><label>Nombre</label><input id="au-name" value="Mihael" autocomplete="off"></div>
      <div class="field"><label>Contraseña</label><input id="au-pass" type="password" placeholder="Mínimo 4 caracteres"></div>
      <div class="field"><label>Repite la contraseña</label><input id="au-pass2" type="password"></div>
      ${err}
      <button class="btn gold" id="au-submit">∴ Fundar el templo</button>
    </div>`;
    const submit = () => {
      const name = $('#au-name').value.trim();
      const p1 = $('#au-pass').value, p2 = $('#au-pass2').value;
      if (!name) { AUTH.error = 'El Administrador necesita un nombre.'; return renderAuth(); }
      if (p1.length < 4) { AUTH.error = 'La contraseña debe tener al menos 4 caracteres.'; return renderAuth(); }
      if (p1 !== p2) { AUTH.error = 'Las contraseñas no coinciden.'; return renderAuth(); }
      let data = null;
      try { const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY)); if (legacy && legacy.notes) data = { notes: legacy.notes, tasks: legacy.tasks || [], events: legacy.events || [], libStatus: legacy.libStatus || {}, prefs: legacy.prefs || { theme:'dark', sidebar:true } }; } catch {}
      if (!data) data = seedAdminData();
      ensureHabits(data);
      const u = { id: uid(), name, pass: pwHash(p1), role: 'gadu', status: 'active', requestedRole: null, created: today(), lastActive: today(), data };
      STORE.users.push(u);
      SESSION.userId = u.id; saveSession();
      AUTH.error = '';
      persist();
      UI.view = 'dashboard';
      render();
      showSplash(u);
      toast(`∴ El templo está fundado.`);
    };
    $('#au-submit').addEventListener('click', submit);
    authEl.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); }));
    ($('#au-pass') || $('#au-name')).focus();
    return;
  }

  if (AUTH.mode === 'register') {
    authEl.innerHTML = `
    <div class="auth-box">
      <div class="auth-mark">∴</div>
      <h1>GADU</h1>
      <p class="auth-sub">Llamar a la puerta del templo</p>
      <div class="field"><label>Tu nombre</label><input id="au-name" autocomplete="off" placeholder="Nombre o seudónimo"></div>
      <div class="field"><label>Contraseña</label><input id="au-pass" type="password" placeholder="Mínimo 4 caracteres"></div>
      <div class="field"><label>Repite la contraseña</label><input id="au-pass2" type="password"></div>
      <div class="field"><label>Rol que solicitas</label>
        <select id="au-role">${REQUESTABLE.map(r => `<option value="${r}">${ROLES[r].label}</option>`).join('')}</select>
      </div>
      ${err}
      <button class="btn gold" id="au-submit">Solicitar ingreso</button>
      <p class="auth-alt">¿Ya tienes taller? <button data-auth="login">Volver a la entrada</button></p>
    </div>`;
    const submit = () => {
      const name = $('#au-name').value.trim();
      const p1 = $('#au-pass').value, p2 = $('#au-pass2').value;
      if (!name) { AUTH.error = 'Necesitas un nombre.'; return renderAuth(); }
      if (STORE.users.some(u => norm(u.name) === norm(name))) { AUTH.error = 'Ese nombre ya está en el templo.'; return renderAuth(); }
      if (p1.length < 4) { AUTH.error = 'La contraseña debe tener al menos 4 caracteres.'; return renderAuth(); }
      if (p1 !== p2) { AUTH.error = 'Las contraseñas no coinciden.'; return renderAuth(); }
      const u = { id: uid(), name, pass: pwHash(p1), role: 'aprendiz', status: 'pending', requestedRole: $('#au-role').value, created: today(), lastActive: today(), data: blankData(name) };
      STORE.users.push(u);
      SESSION.userId = u.id; saveSession();
      AUTH.error = ''; AUTH.mode = 'login';
      persist();
      UI.view = 'dashboard';
      render();
      showSplash(u);
      toast('Solicitud enviada. Tu taller ya está abierto.');
    };
    $('#au-submit').addEventListener('click', submit);
    authEl.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); }));
    $('[data-auth="login"]').addEventListener('click', () => { AUTH.mode = 'login'; AUTH.error = ''; renderAuth(); });
    $('#au-name').focus();
    return;
  }

  /* login */
  const picked = getUser(AUTH.pick);
  authEl.innerHTML = `
  <div class="auth-box">
    <div class="auth-mark">∴</div>
    <h1>G∴A∴D∴U∴</h1>
    <p class="auth-sub">Templo «${esc(TEMPLE ? TEMPLE.name : '')}» — ¿quién llama a sus puertas?</p>
    <div class="user-grid">
      ${STORE.users.map(u => `
        <div class="user-pick${u.id === AUTH.pick ? ' on' : ''}${u.status === 'pending' ? ' pending' : ''}" data-pick="${u.id}">
          <span class="u-avatar">${esc(u.name.charAt(0).toUpperCase())}</span>
          <b>${esc(u.name)}</b><span>${esc(roleShort(u))}</span>
        </div>`).join('')}
    </div>
    ${picked ? `
      <div class="field"><label>Contraseña de ${esc(picked.name)}</label><input id="au-pass" type="password" autocomplete="current-password"></div>
      ${err}
      <button class="btn gold" id="au-submit">Entrar al taller</button>` : `${err}`}
    <p class="auth-alt">¿Nuevo en el templo? <button data-auth="register">Solicitar ingreso</button></p>
    <p class="auth-alt">⌂ <button data-auth="leave">Cambiar de templo</button></p>
  </div>`;
  $$('[data-pick]', authEl).forEach(el => el.addEventListener('click', () => { AUTH.pick = el.dataset.pick; AUTH.error = ''; renderAuth(); }));
  const btn = $('#au-submit');
  if (btn) {
    const submit = () => {
      const u = getUser(AUTH.pick);
      if (!u) return;
      if (pwHash($('#au-pass').value) !== u.pass) { AUTH.error = 'La palabra de paso no es correcta.'; return renderAuth(); }
      SESSION.userId = u.id; saveSession();
      AUTH.error = ''; AUTH.pick = null;
      persist();
      UI.view = 'dashboard'; UI.viewAs = null; UI.noteId = null;
      render();
      showSplash(u);
    };
    btn.addEventListener('click', submit);
    $('#au-pass').addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    $('#au-pass').focus();
  }
  $('[data-auth="register"]').addEventListener('click', () => { AUTH.mode = 'register'; AUTH.error = ''; renderAuth(); });
  const leave = $('[data-auth="leave"]');
  if (leave) leave.addEventListener('click', leaveTemple);
}

/* ═══════════ VISTA: TABLERO ═══════════ */
function visibleSections() {
  const me = currentUser();
  return LIBRARY.sections.filter(s => sectionVisibleTo(s, me));
}
function visibleBooks() {
  return visibleSections().flatMap(s => s.books.map(b => ({...b, section: s})));
}
function libProgress() {
  const books = visibleBooks();
  const total = books.length;
  const read = books.filter(b => DB.libStatus[b.id] === 'leido').length;
  const reading = books.filter(b => DB.libStatus[b.id] === 'leyendo').length;
  const next = books.find(b => DB.libStatus[b.id] !== 'leido');
  return { total, read, reading, next, pct: total ? Math.round(read / total * 100) : 0 };
}
function taskDueBadge(t) {
  if (!t.due) return '';
  const late = t.due < today() && t.status !== 'done';
  return `<span class="due${late ? ' late' : ''}">${late ? '⚠ ' : '◈ '}${fmtShort(t.due)}</span>`;
}

const VIEWS = {};
const BINDERS = {};

VIEWS.dashboard = () => {
  const me = currentUser();
  const owner = viewedUser();
  const t = today();
  const events = eventsOn(t).sort((a,b) => a.start.localeCompare(b.start));
  const dueTasks = DB.tasks.filter(x => x.status !== 'done' && x.due && x.due <= t);
  const soonTasks = DB.tasks.filter(x => x.status !== 'done' && x.due && x.due > t && x.due <= addDays(t, 7));
  const prog = libProgress();
  const notes = [...DB.notes].sort((a,b) => (b.pinned - a.pinned) || b.updated.localeCompare(a.updated)).slice(0, 6);
  const projects = {};
  DB.tasks.forEach(x => { if (x.project) { projects[x.project] = projects[x.project] || {open:0, total:0}; projects[x.project].total++; if (x.status !== 'done') projects[x.project].open++; } });
  const open = DB.tasks.filter(x => x.status !== 'done').length;
  const doing = DB.tasks.filter(x => x.status === 'doing').length;

  const todayItems = [
    ...events.map(e => `
      <div class="today-item is-event" data-action="edit-event" data-id="${e.id}" data-date="${t}" style="cursor:pointer">
        <span class="t-time">${e.start}</span><span class="t-title">☉ ${esc(e.title)}${repGlyph(e)}</span>
      </div>`),
    ...dueTasks.map(x => `
      <div class="today-item">
        <span class="tickbox${x.status === 'done' ? ' done' : ''}" data-action="toggle-task" data-id="${x.id}">${x.status === 'done' ? '✓' : ''}</span>
        <span class="t-title" data-action="edit-task" data-id="${x.id}" style="cursor:pointer">${esc(x.title)}</span>
        <span class="dot ${x.priority}"></span>${taskDueBadge(x)}
      </div>`),
  ].join('');

  const salute = owner.id === me.id ? `S∴F∴U∴, ${esc(me.name)}.` : `Taller de ${esc(owner.name)}.`;

  return `
  <div class="dash-hero">
    <span class="watermark">∴</span>
    <p class="epigraph">A∴ L∴ G∴ D∴ G∴ A∴ D∴ U∴</p>
    <h1 class="dash-title">${cap(fmtLong(t))}</h1>
    <p class="dash-sub">${salute} ${open} tarea${open === 1 ? '' : 's'} abierta${open === 1 ? '' : 's'} · ${doing} en el taller.</p>
  </div>

  <div class="capture">
    <span class="glyph">∴</span>
    <input id="capture-input" type="text" placeholder="Captura rápida… escribe y elige su destino (Enter = tarea)">
    <div class="capture-btns">
      <button class="chip" data-cap="note">→ Nota</button>
      <button class="chip" data-cap="task">→ Tarea</button>
      <button class="chip" data-cap="event">→ Evento</button>
    </div>
  </div>

  <div class="dash-grid">
    <div class="dash-col">
      <section class="panel">
        <div class="panel-head"><span class="panel-title">Visión del día</span>
          <button class="btn sm" style="margin-left:auto" data-action="new-event">+ Evento</button>
        </div>
        <div class="panel-body">
          ${todayItems || '<div class="empty">Nada agendado ni vencido para hoy. El taller está en orden.</div>'}
          ${soonTasks.length ? `<hr><p style="font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-bottom:.4rem">Próximos 7 días</p>` +
            soonTasks.slice(0,4).map(x => `
              <div class="today-item">
                <span class="tickbox" data-action="toggle-task" data-id="${x.id}"></span>
                <span class="t-title" data-action="edit-task" data-id="${x.id}" style="cursor:pointer">${esc(x.title)}</span>
                ${taskDueBadge(x)}
              </div>`).join('') : ''}
        </div>
      </section>

      <section class="panel">
        <div class="panel-head"><span class="panel-title">Notas recientes</span>
          <button class="btn sm" style="margin-left:auto" data-action="new-note">+ Nota</button>
        </div>
        <div class="panel-body">
          ${notes.map(n => `
            <div class="note-row" data-action="open-note" data-id="${n.id}">
              ${n.pinned ? '<span class="pin">✦</span>' : ''}
              <span class="n-title">${esc(n.title)}</span>
              <span class="n-date">${fmtShort(n.updated)}</span>
            </div>`).join('') || '<div class="empty">Aún no hay notas.</div>'}
        </div>
      </section>
    </div>

    <div class="dash-col">
      <section class="panel">
        <div class="panel-head"><span class="panel-title">Camino de estudio</span>
          <button class="btn sm" style="margin-left:auto" data-action="go" data-view="library">Abrir</button>
        </div>
        <div class="panel-body">
          <div class="progress-rail"><div class="progress-fill" style="width:${prog.pct}%"></div></div>
          <div class="study-stats">
            <div class="stat"><b>${prog.read}</b><span>Leídos</span></div>
            <div class="stat"><b>${prog.reading}</b><span>En curso</span></div>
            <div class="stat"><b>${prog.total}</b><span>Obras</span></div>
          </div>
          ${prog.next ? `
          <div class="study-next">
            <span class="roman">${prog.next.section.roman} ·</span>
            <div><div class="b-title">${esc(prog.next.title)}</div>
            <span style="font-size:.78rem;color:var(--muted)">${esc(prog.next.author)}</span></div>
          </div>` : '<p class="study-next">Camino completado. ∴</p>'}
        </div>
      </section>

      <section class="panel">
        <div class="panel-head"><span class="panel-title">Proyectos activos</span></div>
        <div class="panel-body">
          <div class="proj-grid">
            ${Object.entries(projects).map(([name, p]) => `
              <div class="proj-card" data-action="open-project" data-project="${esc(name)}">
                <b>${esc(name)}</b><span>${p.open} abiertas · ${p.total} en total</span>
              </div>`).join('') || '<div class="empty" style="grid-column:1/-1">Asigna un proyecto a tus tareas para verlas aquí.</div>'}
          </div>
        </div>
      </section>
    </div>
  </div>`;
};

BINDERS.dashboard = () => {
  const input = $('#capture-input');
  const capture = kind => {
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    if (kind === 'note') { const n = newNote(text); toast('Nota creada'); UI.noteId = n.id; UI.editMode = true; go('notes'); return; }
    if (kind === 'event') { openEventModal({ title: text, date: today() }); input.value = ''; return; }
    newTask(text); toast('Tarea añadida a la bandeja'); render();
  };
  input.addEventListener('keydown', e => { if (e.key === 'Enter') capture('task'); });
  $$('.capture-btns .chip').forEach(b => b.addEventListener('click', () => capture(b.dataset.cap)));
};

/* ═══════════ VISTA: NOTAS ═══════════ */
VIEWS.notes = () => {
  const q = norm(UI.noteSearch);
  let list = [...DB.notes].sort((a,b) => (b.pinned - a.pinned) || b.updated.localeCompare(a.updated));
  if (q) list = list.filter(n => norm(n.title).includes(q) || norm(n.body).includes(q));
  if (UI.noteTag) list = list.filter(n => noteTags(n).includes(UI.noteTag));
  const allTags = [...new Set(DB.notes.flatMap(noteTags))].sort();
  if (!UI.noteId || !getNote(UI.noteId)) UI.noteId = list[0]?.id || null;
  const cur = getNote(UI.noteId);

  return `
  <div class="notes-wrap">
    <section class="panel notes-list">
      <div class="panel-head"><span class="panel-title">Notas · ${DB.notes.length}</span>
        <button class="btn sm" style="margin-left:auto" data-action="new-note">+ Nueva</button>
      </div>
      <div class="notes-search"><input id="note-search" type="text" placeholder="⌕ Filtrar notas…" value="${esc(UI.noteSearch)}"></div>
      ${allTags.length ? `<div class="tag-cloud">
        ${allTags.map(t => `<button class="chip${UI.noteTag === t ? ' on' : ''}" data-action="note-tag" data-tag="${esc(t)}">#${esc(t)}</button>`).join('')}
      </div>` : ''}
      <div class="panel-body">
        ${list.map(n => `
          <div class="note-card${n.id === UI.noteId ? ' on' : ''}" data-action="open-note" data-id="${n.id}">
            <b>${n.pinned ? '<span class="pin">✦</span>' : ''}${esc(n.title)}</b>
            <p>${esc((n.body || '').replace(/[#>*`\[\]]/g, '').slice(0, 70)) || '—'}</p>
          </div>`).join('') || '<div class="empty">Sin resultados.</div>'}
      </div>
    </section>

    <section class="panel editor">
      ${cur ? `
      <div class="editor-bar">
        <div class="seg">
          <button class="${!UI.editMode ? 'on' : ''}" data-action="note-mode" data-mode="read">Lectura</button>
          <button class="${UI.editMode ? 'on' : ''}" data-action="note-mode" data-mode="edit">Edición</button>
        </div>
        <button class="btn sm${cur.pinned ? ' gold' : ''}" data-action="pin-note" data-id="${cur.id}">✦ ${cur.pinned ? 'Fijada' : 'Fijar'}</button>
        <button class="btn sm ghost" data-action="del-note" data-id="${cur.id}">Eliminar</button>
        <span class="meta">actualizada ${fmtShort(cur.updated)} · ${(cur.body || '').split(/\s+/).filter(Boolean).length} palabras</span>
      </div>
      <input class="editor-title" id="note-title" value="${esc(cur.title)}" ${UI.editMode ? '' : 'readonly'}>
      <div class="editor-body">
        ${UI.editMode
          ? `<textarea id="note-body" placeholder="Escribe en Markdown… usa [[dobles corchetes]] para enlazar notas y #etiquetas para clasificar.">${esc(cur.body || '')}</textarea>`
          : `<div class="md" id="note-preview">${md(cur.body || '') || '<p style="color:var(--faint);font-style:italic">Nota vacía — pasa a Edición para escribir.</p>'}</div>`}
      </div>
      ${(() => { const bl = backlinksOf(cur); return bl.length ? `
        <div class="backlinks"><h4>∴ Referencias a esta nota</h4>
          ${bl.map(n => `<a data-action="open-note" data-id="${n.id}" href="javascript:void 0">↩ ${esc(n.title)}</a>`).join('')}
        </div>` : ''; })()}
      ` : '<div class="empty" style="margin:auto">Crea tu primera nota con el botón «+ Nueva» o pulsando N.</div>'}
    </section>
  </div>`;
};

BINDERS.notes = () => {
  const search = $('#note-search');
  if (search) search.addEventListener('input', debounce(() => {
    UI.noteSearch = search.value; render();
    const s = $('#note-search'); s.focus(); s.setSelectionRange(s.value.length, s.value.length);
  }, 350));

  const cur = getNote(UI.noteId);
  if (!cur) return;
  const title = $('#note-title');
  const body = $('#note-body');
  const persistNote = debounce(() => { cur.updated = today(); save(); }, 400);
  if (title) title.addEventListener('input', () => { cur.title = title.value; persistNote(); });
  if (body) {
    body.addEventListener('input', () => { cur.body = body.value; persistNote(); });
    if (UI.editMode) { body.focus(); }
  }
  const prev = $('#note-preview');
  if (prev) prev.addEventListener('dblclick', () => { UI.editMode = true; render(); });
};

/* ═══════════ VISTA: TAREAS ═══════════ */
const STATUS_META = { todo:['Por hacer','◻'], doing:['En el taller','⚒'], done:['Terminado','✓'] };

function taskCard(t) {
  const subDone = t.subtasks.filter(s => s.done).length;
  return `
  <div class="task-card" draggable="true" data-task="${t.id}" data-action="edit-task" data-id="${t.id}">
    <div class="tc-top">
      <span class="tickbox${t.status === 'done' ? ' done' : ''}" data-action="toggle-task" data-id="${t.id}">${t.status === 'done' ? '✓' : ''}</span>
      <span class="tc-title${t.status === 'done' ? ' done' : ''}">${esc(t.title)}</span>
      <span class="dot ${t.priority}" title="Prioridad ${t.priority}"></span>
    </div>
    ${(t.due || t.project || t.subtasks.length || t.assignedBy || (t.repeat && t.repeat !== 'none')) ? `<div class="tc-meta">
      ${taskDueBadge(t)}
      ${(t.repeat && t.repeat !== 'none') ? '<span class="rep" title="Tarea recurrente">↻</span>' : ''}
      ${t.subtasks.length ? `<span class="tc-sub">☰ ${subDone}/${t.subtasks.length}</span>` : ''}
      ${t.project ? `<span class="tc-proj">${esc(t.project)}</span>` : ''}
      ${t.assignedBy ? `<span class="tc-from" title="Trabajo encomendado">☩ de ${esc(userName(t.assignedBy))}</span>` : ''}
      ${t.review ? (t.review.verdict === 'jp' ? '<span class="jp-badge">∴ J∴P∴</span>' : '<span class="jp-badge redo">↺ ajustes</span>') : ''}
    </div>` : ''}
  </div>`;
}

VIEWS.tasks = () => {
  const me = currentUser();
  let list = [...DB.tasks];
  const f = UI.taskFilter;
  if (f.project) list = list.filter(t => t.project === f.project);
  const projects = [...new Set(DB.tasks.map(t => t.project).filter(Boolean))];

  const toolbar = `
  <div class="tasks-toolbar">
    <button class="btn gold" data-action="new-task">+ Nueva tarea</button>
    ${(!UI.viewAs && assignTargets(me).length) ? '<button class="btn" data-action="assign-work">☩ Asignar trabajo</button>' : ''}
    <div class="seg">
      <button class="${UI.taskView === 'kanban' ? 'on' : ''}" data-action="task-view" data-tv="kanban">Tablero</button>
      <button class="${UI.taskView === 'list' ? 'on' : ''}" data-action="task-view" data-tv="list">Lista</button>
    </div>
    ${projects.length ? `<span style="color:var(--faint);font-size:.8rem">Proyecto:</span>
      <button class="chip${!f.project ? ' on' : ''}" data-action="task-project" data-project="">Todos</button>
      ${projects.map(p => `<button class="chip${f.project === p ? ' on' : ''}" data-action="task-project" data-project="${esc(p)}">${esc(p)}</button>`).join('')}` : ''}
  </div>`;

  /* encomiendas: trabajos que yo he dejado en talleres ajenos */
  const delegated = [];
  if (!UI.viewAs) {
    STORE.users.forEach(u => {
      if (u.id === me.id) return;
      (u.data.tasks || []).forEach(t => { if (t.assignedBy === me.id) delegated.push({ t, u }); });
    });
  }
  const delegPanel = delegated.length ? `
  <section class="panel" style="margin-top:1.1rem">
    <div class="panel-head"><span class="panel-title">☩ Trabajos encomendados por mí</span></div>
    <div class="panel-body">
      ${delegated.map(({t, u}) => `
        <div class="deleg-row">
          <span class="d-owner">${esc(u.name)}</span>
          <span class="d-title${t.status === 'done' ? '" style="text-decoration:line-through;color:var(--faint)' : ''}">${esc(t.title)}</span>
          ${taskDueBadge(t)}
          <span class="d-status">${STATUS_META[t.status][0]}</span>
        </div>`).join('')}
    </div>
  </section>` : '';

  if (UI.taskView === 'list') {
    const order = { alta:0, media:1, baja:2 };
    const rows = [...list].sort((a,b) => (a.status === 'done') - (b.status === 'done') || (a.due || '9999').localeCompare(b.due || '9999') || order[a.priority] - order[b.priority]);
    return toolbar + `
    <section class="panel"><div class="task-list-rows">
      ${rows.map(t => `
        <div class="task-row" data-action="edit-task" data-id="${t.id}">
          <span class="tickbox${t.status === 'done' ? ' done' : ''}" data-action="toggle-task" data-id="${t.id}">${t.status === 'done' ? '✓' : ''}</span>
          <span class="dot ${t.priority}"></span>
          <span class="tr-title${t.status === 'done' ? ' done' : ''}">${esc(t.title)}</span>
          ${t.assignedBy ? `<span class="tc-from">☩ ${esc(userName(t.assignedBy))}</span>` : ''}
          ${t.project ? `<span class="tc-proj">${esc(t.project)}</span>` : ''}
          ${taskDueBadge(t)}
          <span class="tr-status">${STATUS_META[t.status][0]}</span>
        </div>`).join('') || '<div class="empty">No hay tareas. La piedra espera al cincel.</div>'}
    </div></section>` + delegPanel;
  }

  return toolbar + `
  <div class="kanban">
    ${Object.entries(STATUS_META).map(([st, [label, glyph]]) => {
      const cards = list.filter(t => t.status === st);
      return `
      <section class="panel kan-col" data-col="${st}">
        <div class="panel-head"><span class="panel-title">${glyph} ${label}</span><span class="kan-count">${cards.length}</span></div>
        <div class="panel-body" data-drop="${st}">
          ${cards.map(taskCard).join('') || '<div class="empty">—</div>'}
        </div>
      </section>`;
    }).join('')}
  </div>` + delegPanel;
};

BINDERS.tasks = () => {
  $$('.task-card').forEach(card => {
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/task', card.dataset.task);
      e.dataTransfer.effectAllowed = 'move';
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
  });
  $$('.kan-col').forEach(col => {
    col.addEventListener('dragover', e => { e.preventDefault(); col.classList.add('dragover'); });
    col.addEventListener('dragleave', () => col.classList.remove('dragover'));
    col.addEventListener('drop', e => {
      e.preventDefault(); col.classList.remove('dragover');
      const id = e.dataTransfer.getData('text/task');
      const t = getTask(id);
      if (t && t.status !== col.dataset.col) { t.status = col.dataset.col; save(); render(); toast(`Movida a «${STATUS_META[col.dataset.col][0]}»`); }
    });
  });
};

/* ═══════════ VISTA: CALENDARIO ═══════════ */
const DOW = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const HOURS = Array.from({length: 17}, (_, i) => i + 6);

function monthMatrix(cursor) {
  const d = parseYMD(cursor);
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const start = new Date(first);
  start.setDate(1 - ((first.getDay() + 6) % 7));
  return Array.from({length: 42}, (_, i) => { const x = new Date(start); x.setDate(start.getDate() + i); return x; });
}
function weekStart(cursor) {
  const d = parseYMD(cursor);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

VIEWS.calendar = () => {
  const cur = parseYMD(UI.calCursor);
  const label = UI.calMode === 'month'
    ? new Intl.DateTimeFormat('es-ES', {month:'long', year:'numeric'}).format(cur)
    : (() => { const ws = weekStart(UI.calCursor); const we = new Date(ws); we.setDate(ws.getDate() + 6);
        return `${fmtShort(ymd(ws))} — ${fmtShort(ymd(we))} · ${we.getFullYear()}`; })();

  const toolbar = `
  <div class="cal-toolbar">
    <span class="cal-month-label">${label}</span>
    <div class="cal-nav">
      <button class="btn sm" data-action="cal-nav" data-dir="-1">‹</button>
      <button class="btn sm" data-action="cal-nav" data-dir="0">Hoy</button>
      <button class="btn sm" data-action="cal-nav" data-dir="1">›</button>
    </div>
    <div class="seg">
      <button class="${UI.calMode === 'month' ? 'on' : ''}" data-action="cal-mode" data-cm="month">Mes</button>
      <button class="${UI.calMode === 'week' ? 'on' : ''}" data-action="cal-mode" data-cm="week">Semana</button>
    </div>
    <button class="btn gold" style="margin-left:auto" data-action="new-event">+ Evento</button>
  </div>`;

  if (UI.calMode === 'month') {
    const cells = monthMatrix(UI.calCursor);
    const m = cur.getMonth();
    return toolbar + `
    <section class="panel" style="overflow:hidden">
      <div class="month-grid">
        ${DOW.map(d => `<div class="dow">${d}</div>`).join('')}
        ${cells.map(d => {
          const ds = ymd(d);
          const evs = eventsOn(ds).sort((a,b) => a.start.localeCompare(b.start));
          const due = DB.tasks.filter(t => t.due === ds && t.status !== 'done');
          const chips = [
            ...evs.map(e => `<span class="cal-chip" title="${e.start} · ${esc(e.title)}">${e.start} ${esc(e.title)}${repGlyph(e)}</span>`),
            ...due.map(t => `<span class="cal-chip is-task" title="Vence: ${esc(t.title)}">◈ ${esc(t.title)}</span>`),
          ];
          return `
          <div class="day-cell${d.getMonth() !== m ? ' dim' : ''}${ds === today() ? ' today' : ''}" data-action="cal-day" data-date="${ds}">
            <span class="day-num">${d.getDate()}</span>
            ${chips.slice(0,3).join('')}
            ${chips.length > 3 ? `<span class="cal-chip more">+${chips.length - 3} más…</span>` : ''}
          </div>`;
        }).join('')}
      </div>
    </section>`;
  }

  const ws = weekStart(UI.calCursor);
  const days = Array.from({length: 7}, (_, i) => { const d = new Date(ws); d.setDate(ws.getDate() + i); return d; });
  const tray = DB.tasks.filter(t => t.status !== 'done');
  return toolbar + `
  <div class="week-wrap">
    <section class="panel week-grid">
      <div class="week-table">
        <div class="wk-head"></div>
        ${days.map(d => `<div class="wk-head${ymd(d) === today() ? ' today' : ''}"><div class="wd">${DOW[(d.getDay()+6)%7]}</div><div class="wnum">${d.getDate()}</div></div>`).join('')}
        ${HOURS.map(h => `
          <div class="hour-label">${String(h).padStart(2,'0')}:00</div>
          ${days.map(d => {
            const ds = ymd(d);
            const evs = eventsOn(ds).filter(e => parseInt(e.start) === h);
            return `<div class="hour-cell" data-slot data-date="${ds}" data-hour="${h}">
              ${evs.map(e => {
                const min = parseInt(e.start.split(':')[1] || '0');
                const hpx = Math.max(22, (e.dur / 60) * 48 - 4);
                return `<div class="wk-event${e.taskId ? ' linked' : ''}" draggable="true" data-ev="${e.id}" data-action="edit-event" data-id="${e.id}" data-date="${ds}"
                  style="top:${(min/60)*48}px;height:${hpx}px">
                  <b>${esc(e.title)}${repGlyph(e)}</b><span>${e.start} · ${e.dur} min</span>
                </div>`;
              }).join('')}
            </div>`;
          }).join('')}
        `).join('')}
      </div>
    </section>
    <section class="panel">
      <div class="panel-head"><span class="panel-title">⚒ Bandeja de tareas</span></div>
      <div class="panel-body" style="display:flex;flex-direction:column;gap:.5rem">
        <p class="tray-hint">Arrastra una tarea a la rejilla para reservar un bloque de tiempo (time-blocking).</p>
        ${tray.map(t => `
          <div class="tray-task" draggable="true" data-tray="${t.id}" data-action="edit-task" data-id="${t.id}">
            <span class="dot ${t.priority}"></span><span style="flex:1">${esc(t.title)}</span>
          </div>`).join('') || '<div class="empty">Sin tareas pendientes.</div>'}
      </div>
    </section>
  </div>`;
};

BINDERS.calendar = () => {
  if (UI.calMode !== 'week') return;
  $$('[data-tray]').forEach(el => el.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/task', el.dataset.tray);
  }));
  $$('[data-ev]').forEach(el => el.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/event', el.dataset.ev);
    e.stopPropagation();
  }));
  $$('[data-slot]').forEach(cell => {
    cell.addEventListener('dragover', e => { e.preventDefault(); cell.classList.add('dragover'); });
    cell.addEventListener('dragleave', () => cell.classList.remove('dragover'));
    cell.addEventListener('drop', e => {
      e.preventDefault(); cell.classList.remove('dragover');
      const start = `${String(cell.dataset.hour).padStart(2,'0')}:00`;
      const taskId = e.dataTransfer.getData('text/task');
      const evId = e.dataTransfer.getData('text/event');
      if (taskId) {
        const t = getTask(taskId); if (!t) return;
        DB.events.push({ id: uid(), title: t.title, date: cell.dataset.date, start, dur: 60, taskId, repeat: 'none', skip: [] });
        save(); render(); toast(`Bloque reservado: ${fmtShort(cell.dataset.date)} · ${start}`);
      } else if (evId) {
        const ev = getEvent(evId); if (!ev) return;
        ev.date = cell.dataset.date; ev.start = start;
        save(); render();
        toast(isRepeating(ev) ? `Serie movida ↻ · ahora ${fmtLong(ev.date).split(',')[0]} a las ${start}` : 'Evento reubicado');
      }
    });
  });
};

/* ═══════════ VISTA: BIBLIOTECA ═══════════ */
const LIB_STATES = { pendiente: '○ Pendiente', leyendo: '◐ En curso', leido: '● Leído' };
const nextLibState = s => s === 'pendiente' ? 'leyendo' : s === 'leyendo' ? 'leido' : 'pendiente';

VIEWS.library = () => {
  const me = currentUser();
  const seeAll = canSeeAll(me);
  const prog = libProgress();
  const docs = STORE.meta.customDocs.filter(d => seeAll || d.addedBy === me.id || d.roles.includes(me.role));
  return `
  <div class="lib-hero">
    <p class="epigraph">Camino de estudio · Tradición masónica</p>
    <h1 class="lib-title">La Biblioteca</h1>
    <p class="lib-intro">${LIBRARY.intro}</p>
    <div class="lib-actions">
      <a class="btn gold" href="${DRIVE_FOLDER}" target="_blank" rel="noopener">▲ Abrir carpeta en Google Drive</a>
      <span class="lib-progress-note">${prog.read} de ${prog.total} obras leídas · ${prog.pct}% del camino</span>
    </div>
  </div>

  ${LIBRARY.sections.map(sec => {
    const unlocked = sectionVisibleTo(sec, me);
    if (!unlocked) return `
    <section class="lib-section locked">
      <div class="lib-sec-head">
        <span class="lib-roman">${sec.roman}</span>
        <h2 class="lib-sec-title">${sec.title}</h2>
      </div>
      <div class="lib-locked-card">Este conocimiento se revelará al avanzar de grado.<br>Continúa el trabajo sobre la piedra.</div>
    </section>`;
    const read = sec.books.filter(b => DB.libStatus[b.id] === 'leido').length;
    const hidden = sectionHidden(sec);
    return `
    <section class="lib-section${hidden ? ' locked' : ''}">
      <div class="lib-sec-head">
        <span class="lib-roman">${sec.roman}</span>
        <h2 class="lib-sec-title">${sec.title}</h2>
        ${me.role === 'gadu'
          ? `<button class="chip${hidden ? ' on' : ''}" data-action="lib-hide" data-roman="${sec.roman}" title="${hidden ? 'Nadie más que el Or∴ la ve. Pulsa para mostrarla.' : 'Ocultar esta sección para todos los roles.'}">${hidden ? '⊘ Oculta para todos' : '👁 Visible'}</button>`
          : hidden ? '<span class="role-badge pending">⊘ oculta para la logia</span>' : ''}
        <div class="lib-sec-bar"><div class="progress-rail"><div class="progress-fill" style="width:${sec.books.length ? Math.round(read / sec.books.length * 100) : 0}%"></div></div></div>
      </div>
      <p class="lib-sec-desc">${sec.desc}</p>
      <div class="book-grid">
        ${sec.books.map(b => {
          const st = DB.libStatus[b.id] || 'pendiente';
          return `
          <article class="book st-${st}">
            <span class="b-author">${esc(b.author)}</span>
            <h3 class="b-title">${b.url
              ? `<a href="${b.url}" target="_blank" rel="noopener" title="Abrir el documento en Google Drive">${esc(b.title)}<span class="ext"> ↗</span></a>`
              : esc(b.title)}</h3>
            <p class="b-desc">${esc(b.desc)}</p>
            <div class="b-foot">
              <button class="b-status st-${st}" data-action="lib-status" data-id="${b.id}" title="Cambiar estado de lectura">${LIB_STATES[st]}</button>
              <a class="b-link" href="${b.url || driveSearch(b.q)}" target="_blank" rel="noopener" title="${b.url ? 'Abrir el documento en Google Drive' : 'Buscar este documento en Drive'}">▲ ${b.url ? 'Abrir' : 'Buscar en Drive'}</a>
              <button class="b-link" data-action="lib-note" data-id="${b.id}" title="Crear o abrir nota de estudio" style="background:none;border:none;cursor:pointer">✒ Nota</button>
            </div>
          </article>`;
        }).join('')}
      </div>
    </section>`;
  }).join('')}

  ${docs.length ? `
  <section class="lib-section">
    <div class="lib-sec-head">
      <span class="lib-roman">☩</span>
      <h2 class="lib-sec-title">Trabajos y materiales asignados</h2>
    </div>
    <p class="lib-sec-desc">Documentos de estudio entregados por los Vigilantes y el Or∴ de administración.</p>
    <div class="book-grid">
      ${docs.map(d => `
      <article class="book">
        <span class="b-author">Asignado por ${esc(userName(d.addedBy))} · ${fmtShort(d.created)}</span>
        <h3 class="b-title">${d.url
          ? `<a href="${esc(d.url)}" target="_blank" rel="noopener" title="Abrir el material">${esc(d.title)}<span class="ext"> ↗</span></a>`
          : d.dataUrl
            ? `<a href="${d.dataUrl}" download="${esc(d.fileName || 'material')}" title="Descargar el material">${esc(d.title)}<span class="ext"> ⇩</span></a>`
            : esc(d.title)}</h3>
        <p class="b-desc">${esc(d.desc) || '—'}</p>
        <div class="b-foot">
          ${(seeAll || d.addedBy === me.id) ? d.roles.map(r => `<span class="role-badge">${esc((ROLES[r] || {}).short || r)}</span>`).join('') : ''}
          ${(me.role === 'gadu' || d.addedBy === me.id) ? `<button class="b-link" data-action="doc-del" data-id="${d.id}" style="background:none;border:none;cursor:pointer;margin-left:auto">✕ Retirar</button>` : ''}
        </div>
      </article>`).join('')}
    </div>
  </section>` : ''}

  <p class="side-motto" style="margin-top:3rem">∴ De lo general a lo particular; de la piedra bruta a la piedra pulida. ∴</p>`;
};

/* ═══════════ VISTA: ADMINISTRACIÓN ═══════════ */
VIEWS.admin = () => {
  const me = currentUser();
  if (!canSeeAll(me)) return '<div class="empty">Reservado al Or∴ de administración.</div>';
  const isGadu = me.role === 'gadu';
  const pending = STORE.users.filter(u => u.status === 'pending');
  const active = STORE.users.filter(u => u.status === 'active');

  const roleOptions = (u, selected) => Object.entries(ROLES)
    .filter(([k]) => isGadu || ROLES[k].rank < 5)
    .map(([k, r]) => `<option value="${k}"${selected === k ? ' selected' : ''}>${r.label}</option>`).join('');

  const stats = u => {
    const d = u.data || {};
    return `<span class="u-stats">
      <span><b>${(d.notes || []).length}</b> notas</span>
      <span><b>${(d.tasks || []).filter(t => t.status !== 'done').length}</b> abiertas</span>
      <span><b>${(d.tasks || []).filter(t => t.status === 'done').length}</b> hechas</span>
    </span>`;
  };

  return `
  <div class="dash-hero">
    <span class="watermark">⚖</span>
    <p class="epigraph">Or∴ de administración</p>
    <h1 class="dash-title">El Templo</h1>
    <p class="dash-sub">${STORE.users.length} miembro${STORE.users.length === 1 ? '' : 's'} · ${pending.length} solicitud${pending.length === 1 ? '' : 'es'} pendiente${pending.length === 1 ? '' : 's'}.</p>
  </div>

  <div class="admin-grid">
    ${pending.length ? `
    <section class="panel">
      <div class="panel-head"><span class="panel-title">⧗ Solicitudes de ingreso</span></div>
      <div class="panel-body">
        ${pending.map(u => `
          <div class="admin-row">
            <span class="u-avatar">${esc(u.name.charAt(0).toUpperCase())}</span>
            <span class="u-meta"><b>${esc(u.name)}</b><span>solicita: ${esc((ROLES[u.requestedRole] || ROLES.aprendiz).label)} · desde ${fmtShort(u.created)}</span></span>
            <select id="approve-role-${u.id}">${roleOptions(u, u.requestedRole || 'aprendiz')}</select>
            <button class="btn sm gold" data-action="approve-user" data-id="${u.id}">✓ Aprobar</button>
            <button class="btn sm ghost" data-action="reject-user" data-id="${u.id}">Rechazar</button>
          </div>`).join('')}
      </div>
    </section>` : ''}

    <section class="panel">
      <div class="panel-head"><span class="panel-title">☩ Miembros del templo</span></div>
      <div class="panel-body">
        ${active.map(u => `
          <div class="admin-row">
            <span class="u-avatar">${esc(u.name.charAt(0).toUpperCase())}</span>
            <span class="u-meta"><b>${esc(u.name)}${u.id === me.id ? ' <span style="color:var(--muted)">(tú)</span>' : ''}</b>
              <span>última actividad: ${u.lastActive ? fmtShort(u.lastActive) : '—'}</span></span>
            ${stats(u)}
            ${u.id === me.id
              ? `<span class="role-badge">${esc(ROLES[u.role].label)}</span>`
              : (isGadu || rankOf(u) < 5)
                ? `<select data-role-user="${u.id}">${roleOptions(u, u.role)}</select>`
                : `<span class="role-badge">${esc(ROLES[u.role].label)}</span>`}
            ${u.id !== me.id ? `<button class="btn sm" data-action="view-as" data-id="${u.id}" title="Modo GADU: contemplar su taller">◉ Ver taller</button>` : ''}
            ${u.id !== me.id && (isGadu || rankOf(u) < 5) ? `<button class="btn sm" data-action="reset-pass" data-id="${u.id}">Clave</button>` : ''}
            ${isGadu && u.id !== me.id ? `<button class="btn sm ghost" data-action="del-user" data-id="${u.id}">Eliminar</button>` : ''}
          </div>`).join('')}
      </div>
    </section>

    ${isGadu ? `
    <section class="panel">
      <div class="panel-head"><span class="panel-title">▤ Biblioteca — lista blanca por rol</span></div>
      <div class="panel-body">
        <p style="font-family:var(--font-serif);font-style:italic;color:var(--muted);margin-bottom:.9rem">
          Designa qué roles ven cada sección. El GADU y el V∴M∴ siempre lo ven todo.
        </p>
        ${LIBRARY.sections.map(s => `
          <div class="admin-row">
            <span class="lib-roman" style="font-size:1.3rem;min-width:1.4em">${s.roman}</span>
            <span class="u-meta"><b>${s.title}</b></span>
            ${['aprendiz','companero','vig2','vig1'].map(r => `
              <button class="chip${sectionRoles(s).includes(r) ? ' on' : ''}" data-action="lib-acc" data-roman="${s.roman}" data-role="${r}" title="${ROLES[r].label}">${ROLES[r].short}</button>`).join('')}
            <button class="chip${sectionHidden(s) ? ' on' : ''}" data-action="lib-hide" data-roman="${s.roman}" title="Ocultar la sección para todos los roles">⊘ Todos</button>
          </div>`).join('')}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><span class="panel-title">⌂ Templo en la nube (solo GADU)</span></div>
      <div class="panel-body">
        <p style="font-family:var(--font-serif);font-style:italic;color:var(--muted);margin-bottom:.9rem">
          El templo «${esc(TEMPLE ? TEMPLE.name : '')}» vive centralizado en Supabase: los usuarios y talleres se
          comparten entre todos los dispositivos conectados. Los cambios se suben solos; usa «Sincronizar» para
          traer al instante lo que hayan hecho los demás. El respaldo JSON sigue disponible como custodia en Drive.
        </p>
        <div style="display:flex;gap:.7rem;flex-wrap:wrap">
          <button class="btn gold" data-action="sync">⟳ Sincronizar ahora</button>
          <button class="btn" data-action="export-all">⇩ Exportar respaldo</button>
          <button class="btn" data-action="import">⇪ Restaurar respaldo</button>
          <a class="btn" href="${DRIVE_FOLDER}" target="_blank" rel="noopener">▲ Abrir Drive</a>
          <button class="btn ghost" data-action="leave-temple">⌂ Cambiar de templo</button>
        </div>
      </div>
    </section>` : ''}
  </div>`;
};

BINDERS.admin = () => {
  $$('[data-role-user]').forEach(sel => sel.addEventListener('change', () => {
    const u = getUser(sel.dataset.roleUser);
    if (!u) return;
    u.role = sel.value;
    save(); render();
    toast(`${u.name} ahora es ${ROLES[sel.value].label}`);
  }));
};

/* ═══════════ VISTA: MONITOREO ═══════════ */
VIEWS.monitor = () => {
  const me = currentUser();
  if (!canMonitor(me)) return '<div class="empty">Reservado a los Vigilantes y al Or∴.</div>';

  const CHAINS = [
    { vig:'vig1', sub:'companero', label:'Primer Vigilante → Compañeros Masones' },
    { vig:'vig2', sub:'aprendiz',  label:'Segundo Vigilante → Aprendices Masones' },
  ].filter(c => canSeeAll(me) || me.role === c.vig);

  const reviewBadge = t => !t.review ? ''
    : t.review.verdict === 'jp'
      ? `<span class="jp-badge" title="Calificado por ${esc(userName(t.review.by))} el ${fmtShort(t.review.date)}">∴ Justo y Perfecto</span>`
      : `<span class="jp-badge redo" title="Devuelto por ${esc(userName(t.review.by))}">↺ En ajustes</span>`;

  const subBlock = (u, gradable) => {
    const assigned = (u.data.tasks || []).filter(t => t.assignedBy);
    const jp = assigned.filter(t => t.review && t.review.verdict === 'jp').length;
    const pct = assigned.length ? Math.round(jp / assigned.length * 100) : 0;
    return `
    <div class="mon-sub">
      <div class="mon-sub-head">
        <span class="u-avatar">${esc(u.name.charAt(0).toUpperCase())}</span>
        <span class="u-meta"><b>${esc(u.name)}</b><span>${esc(roleLabel(u))} · última actividad: ${u.lastActive ? fmtShort(u.lastActive) : '—'}</span></span>
        <span class="u-stats">
          <span><b>${assigned.length}</b> asignados</span>
          <span><b>${assigned.filter(t => t.status === 'done').length}</b> terminados</span>
          <span><b>${jp}</b> J∴P∴</span>
        </span>
        <div class="mon-bar"><div class="progress-rail"><div class="progress-fill" style="width:${pct}%"></div></div></div>
      </div>
      ${assigned.map(t => `
        <div class="deleg-row">
          <span class="d-title${t.status === 'done' ? '" style="color:var(--faint)' : ''}">${esc(t.title)}</span>
          ${taskDueBadge(t)}
          <span class="d-status">${STATUS_META[t.status][0]}</span>
          ${reviewBadge(t)}
          ${gradable && t.status === 'done' && (!t.review || t.review.verdict === 'ajustes') ? `
            <button class="btn sm gold" data-action="grade-jp" data-user="${u.id}" data-task="${t.id}">∴ Justo y Perfecto</button>
            <button class="btn sm" data-action="grade-redo" data-user="${u.id}" data-task="${t.id}">↺ Volver a labrar</button>` : ''}
        </div>`).join('') || '<p class="tray-hint">Sin trabajos asignados todavía.</p>'}
    </div>`;
  };

  return `
  <div class="dash-hero">
    <span class="watermark">◎</span>
    <p class="epigraph">Vigilancia del trabajo</p>
    <h1 class="dash-title">Monitoreo</h1>
    <p class="dash-sub">Sigue el avance de los hermanos a tu cargo y declara los trabajos Justos y Perfectos.</p>
  </div>
  <div class="tasks-toolbar">
    ${assignTargets(me).length ? '<button class="btn gold" data-action="assign-work">☩ Asignar trabajo</button>' : ''}
  </div>
  ${CHAINS.map(c => {
    const vigs = STORE.users.filter(u => u.role === c.vig && u.status === 'active');
    const subs = STORE.users.filter(u => u.role === c.sub && u.status === 'active');
    return `
    <section class="panel" style="margin-bottom:1.1rem">
      <div class="panel-head"><span class="panel-title">◎ ${c.label}</span>
        ${canSeeAll(me) ? `<span style="margin-left:auto;font-size:.75rem;color:var(--muted)">Vigilante${vigs.length === 1 ? '' : 's'}: ${vigs.map(v => esc(v.name)).join(', ') || '— sin asignar —'}</span>` : ''}
      </div>
      <div class="panel-body">
        ${subs.map(u => subBlock(u, canGradeRole(me, c.sub))).join('') || '<div class="empty">Aún no hay hermanos en este grado.</div>'}
      </div>
    </section>`;
  }).join('')}`;
};

/* ═══════════ MODAL: ASIGNAR TRABAJO ═══════════ */
function openAssignModal() {
  const me = currentUser();
  const targets = assignTargets(me);
  if (!targets.length) { toast('No tienes hermanos a tu cargo'); return; }
  openModal(`
  <div class="modal">
    <div class="modal-head"><h3>☩ Asignar trabajo</h3>
      <button class="icon-btn" data-action="close-modal">✕</button></div>
    <div class="modal-body">
      <div class="field"><label>Título del trabajo</label><input id="am-title" placeholder="p. ej. Plancha sobre el silencio del aprendiz"></div>
      <div class="field"><label>Encomendar a</label>
        <select id="am-target">${targets.map(u => `<option value="${u.id}">${esc(u.name)} — ${esc(roleLabel(u))}</option>`).join('')}</select>
      </div>
      <div class="field-row">
        <div class="field"><label>Fecha de entrega</label><input id="am-due" type="date" value="${addDays(today(), 7)}"></div>
        <div class="field"><label>Prioridad</label>
          <select id="am-priority"><option value="alta">Alta</option><option value="media" selected>Media</option><option value="baja">Baja</option></select>
        </div>
      </div>
      <div class="field"><label>Instrucciones</label><textarea id="am-brief" rows="3" placeholder="Qué se espera del trabajo, extensión, enfoque…"></textarea></div>
      <hr>
      <p style="font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)">Material de estudio (opcional — aparecerá en la Biblioteca)</p>
      <div class="field"><label>Título del material</label><input id="am-doc-title" placeholder="Se usa el título del trabajo si lo dejas vacío"></div>
      <div class="field"><label>Enlace (Drive, web…)</label><input id="am-doc-url" type="url" placeholder="https://drive.google.com/…"></div>
      <div class="field"><label>… o archivo pequeño (máx. 1,5 MB)</label><input id="am-doc-file" type="file"></div>
      <div class="field"><label>Descripción del material</label><input id="am-doc-desc" placeholder="Qué es y para qué estudiarlo"></div>
      <div class="modal-foot">
        <button class="btn" data-action="close-modal">Cancelar</button>
        <button class="btn gold" id="am-save">☩ Asignar</button>
      </div>
    </div>
  </div>`, () => {
    $('#am-save').addEventListener('click', () => {
      const title = $('#am-title').value.trim();
      if (!title) { toast('El trabajo necesita un título'); $('#am-title').focus(); return; }
      const target = getUser($('#am-target').value);
      if (!target) return;
      const docTitle = $('#am-doc-title').value.trim() || `Material: ${title}`;
      const docDesc = $('#am-doc-desc').value.trim();
      const url = $('#am-doc-url').value.trim();
      const file = $('#am-doc-file').files[0];

      const finish = doc => {
        let docId = null;
        if (doc) {
          docId = uid();
          STORE.meta.customDocs.push({ id: docId, title: doc.title, desc: doc.desc, url: doc.url || '', dataUrl: doc.dataUrl || '', fileName: doc.fileName || '', addedBy: me.id, roles: [target.role], created: today() });
        }
        target.data.tasks.unshift({
          id: uid(), title, status: 'todo', priority: $('#am-priority').value,
          due: $('#am-due').value, project: 'Encomienda', subtasks: [],
          created: today(), assignedBy: me.id, brief: $('#am-brief').value.trim(), docId,
        });
        save(); closeModal(); render();
        toast(`☩ Trabajo asignado a ${target.name}${doc ? ' con material en la Biblioteca' : ''}`);
      };

      if (file) {
        if (file.size > 1.5 * 1024 * 1024) { toast('Archivo demasiado grande (máx. 1,5 MB) — sube a Drive y pega el enlace'); return; }
        const r = new FileReader();
        r.onload = () => finish({ title: docTitle, desc: docDesc, dataUrl: r.result, fileName: file.name });
        r.readAsDataURL(file);
      } else if (url) {
        finish({ title: docTitle, desc: docDesc, url });
      } else {
        finish(null);
      }
    });
  });
}

/* ═══════════ MODALES ═══════════ */
const modalRoot = $('#modal-root');
function openModal(html, onBind) {
  modalRoot.innerHTML = html;
  modalRoot.hidden = false;
  if (onBind) onBind();
  const first = modalRoot.querySelector('input,textarea,select');
  if (first) first.focus();
}
function closeModal() { modalRoot.hidden = true; modalRoot.innerHTML = ''; }
modalRoot.addEventListener('mousedown', e => { if (e.target === modalRoot) closeModal(); });

function openTaskModal(task) {
  const me = currentUser();
  const isNew = !task;
  const t = task || { title:'', status:'todo', priority:'media', due:'', project:'', subtasks:[] };
  let subtasks = t.subtasks.map(s => ({...s}));
  const targets = (isNew && !UI.viewAs) ? assignTargets(me) : [];

  const subHtml = () => subtasks.map((s, i) => `
    <div class="subtask-row">
      <span class="tickbox${s.done ? ' done' : ''}" data-sub-toggle="${i}">${s.done ? '✓' : ''}</span>
      <span class="${s.done ? 'done' : ''}">${esc(s.text)}</span>
      <button class="rm" data-sub-rm="${i}" title="Quitar">✕</button>
    </div>`).join('');

  openModal(`
  <div class="modal">
    <div class="modal-head"><h3>${isNew ? '⚒ Nueva tarea' : '⚒ Editar tarea'}</h3>
      <button class="icon-btn" data-action="close-modal">✕</button></div>
    <div class="modal-body">
      <div class="field"><label>Título</label><input id="tm-title" value="${esc(t.title)}" placeholder="¿Qué hay que labrar?"></div>
      <div class="field-row">
        <div class="field"><label>Estado</label>
          <select id="tm-status">
            ${Object.entries(STATUS_META).map(([k,[l]]) => `<option value="${k}"${t.status === k ? ' selected' : ''}>${l}</option>`).join('')}
          </select></div>
        <div class="field"><label>Prioridad</label>
          <select id="tm-priority">
            ${['alta','media','baja'].map(p => `<option value="${p}"${t.priority === p ? ' selected' : ''}>${cap(p)}</option>`).join('')}
          </select></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Vence</label><input id="tm-due" type="date" value="${t.due || ''}"></div>
        <div class="field"><label>Proyecto</label><input id="tm-project" value="${esc(t.project)}" placeholder="p. ej. Planchas" list="tm-projects">
          <datalist id="tm-projects">${[...new Set(DB.tasks.map(x => x.project).filter(Boolean))].map(p => `<option value="${esc(p)}">`).join('')}</datalist>
        </div>
      </div>
      <div class="field"><label>↻ Repetición — al completarla se agenda la siguiente</label>
        <select id="tm-repeat">
          ${Object.entries(TASK_REPEAT_LABELS).map(([k, l]) => `<option value="${k}"${(t.repeat || 'none') === k ? ' selected' : ''}>${l}</option>`).join('')}
        </select>
      </div>
      ${targets.length ? `
      <div class="field"><label>☩ Encomendar a</label>
        <select id="tm-assign">
          <option value="">Mi propio taller</option>
          ${targets.map(u => `<option value="${u.id}">${esc(u.name)} — ${esc(roleLabel(u))}</option>`).join('')}
        </select>
      </div>` : ''}
      ${t.assignedBy ? `<p style="font-size:.85rem;color:var(--muted)">☩ Trabajo encomendado por «${esc(userName(t.assignedBy))}»${t.review ? (t.review.verdict === 'jp' ? ' · <b style="color:var(--gold)">declarado Justo y Perfecto ∴</b>' : ' · <b style="color:var(--red)">devuelto para ajustes ↺</b>') : ''}</p>` : ''}
      ${t.brief ? `<blockquote style="font-family:var(--font-serif);font-style:italic;font-size:.98rem;color:var(--ink-2);border-left:2px solid var(--gold-dim);padding:.2em 0 .2em .9em;margin:0">${esc(t.brief)}</blockquote>` : ''}
      ${(() => { const doc = t.docId && STORE.meta.customDocs.find(x => x.id === t.docId); return doc ? `<p style="font-size:.85rem">▤ Material: ${doc.url ? `<a href="${esc(doc.url)}" target="_blank" rel="noopener">${esc(doc.title)} ↗</a>` : doc.dataUrl ? `<a href="${doc.dataUrl}" download="${esc(doc.fileName || 'material')}">${esc(doc.title)} ⇩</a>` : esc(doc.title)}</p>` : ''; })()}
      <div class="field"><label>Subtareas</label>
        <div id="tm-subs">${subHtml()}</div>
        <div class="subtask-row"><input type="text" id="tm-newsub" placeholder="Añadir subtarea y pulsar Enter…"></div>
      </div>
      <div class="modal-foot">
        ${isNew ? '' : `<button class="btn ghost" id="tm-del">Eliminar</button>`}
        ${isNew ? '' : `<button class="btn" id="tm-schedule" title="Crear un bloque de tiempo hoy">☉ Agendar hoy</button>`}
        <button class="btn" data-action="close-modal">Cancelar</button>
        <button class="btn gold" id="tm-save">Guardar</button>
      </div>
    </div>
  </div>`, () => {
    const refreshSubs = () => { $('#tm-subs').innerHTML = subHtml(); bindSubs(); };
    const bindSubs = () => {
      $$('#tm-subs [data-sub-toggle]').forEach(el => el.addEventListener('click', () => { const i = +el.dataset.subToggle; subtasks[i].done = !subtasks[i].done; refreshSubs(); }));
      $$('#tm-subs [data-sub-rm]').forEach(el => el.addEventListener('click', () => { subtasks.splice(+el.dataset.subRm, 1); refreshSubs(); }));
    };
    bindSubs();
    $('#tm-newsub').addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.value.trim()) { subtasks.push({text: e.target.value.trim(), done: false}); e.target.value = ''; refreshSubs(); }
    });
    const collect = () => ({
      title: $('#tm-title').value.trim() || 'Tarea sin título',
      status: $('#tm-status').value, priority: $('#tm-priority').value,
      due: $('#tm-due').value, project: $('#tm-project').value.trim(), subtasks,
      repeat: $('#tm-repeat').value,
    });
    $('#tm-save').addEventListener('click', () => {
      const v = collect();
      const assignSel = $('#tm-assign');
      const targetId = assignSel ? assignSel.value : '';
      if (isNew && targetId) {
        const target = getUser(targetId);
        target.data.tasks.unshift({ id: uid(), created: today(), assignedBy: me.id, ...v });
        save(); closeModal(); render();
        toast(`☩ Trabajo encomendado a ${target.name}`);
        return;
      }
      if (isNew) newTask(v.title, v); else Object.assign(t, v);
      save(); closeModal(); render(); toast(isNew ? 'Tarea creada' : 'Tarea guardada');
    });
    const del = $('#tm-del');
    if (del) del.addEventListener('click', () => {
      DB.tasks = DB.tasks.filter(x => x.id !== t.id);
      DB.events = DB.events.map(e => e.taskId === t.id ? {...e, taskId: null} : e);
      save(); closeModal(); render(); toast('Tarea eliminada');
    });
    const sched = $('#tm-schedule');
    if (sched) sched.addEventListener('click', () => {
      Object.assign(t, collect()); save();
      closeModal();
      openEventModal({ title: t.title, date: today(), taskId: t.id });
    });
    $('#tm-title').addEventListener('keydown', e => { if (e.key === 'Enter') $('#tm-save').click(); });
  });
}

function openEventModal(preset = {}, existing = null) {
  const e0 = existing || { title: preset.title || '', date: preset.date || today(), start: preset.start || '19:00', dur: preset.dur || 60, taskId: preset.taskId || null, repeat: 'none' };
  const occDate = preset.occDate || null;
  const canSkip = existing && isRepeating(existing) && occDate;
  openModal(`
  <div class="modal">
    <div class="modal-head"><h3>☉ ${existing ? 'Editar evento' : 'Nuevo evento'}</h3>
      <button class="icon-btn" data-action="close-modal">✕</button></div>
    <div class="modal-body">
      <div class="field"><label>Título</label><input id="em-title" value="${esc(e0.title)}" placeholder="Tenida, estudio, cita…"></div>
      <div class="field-row">
        <div class="field"><label>Fecha${isRepeating(e0) ? ' (inicio de la serie)' : ''}</label><input id="em-date" type="date" value="${e0.date}"></div>
        <div class="field"><label>Hora</label><input id="em-start" type="time" value="${e0.start}"></div>
        <div class="field"><label>Duración (min)</label><input id="em-dur" type="number" min="15" step="15" value="${e0.dur}"></div>
      </div>
      <div class="field-row">
        <div class="field" style="flex:2"><label>↻ Repetición</label>
          <select id="em-repeat">
            ${Object.entries(REPEAT_LABELS).map(([k, l]) => `<option value="${k}"${(e0.repeat || 'none') === k ? ' selected' : ''}>${l}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label>Termina (opcional)</label><input id="em-until" type="date" value="${e0.until || ''}"></div>
      </div>
      ${e0.taskId && getTask(e0.taskId) ? `<p style="font-size:.85rem;color:var(--muted)">⚒ Vinculado a la tarea «${esc(getTask(e0.taskId).title)}»</p>` : ''}
      <div class="modal-foot">
        ${existing ? `<button class="btn ghost" id="em-del">${isRepeating(existing) ? 'Eliminar serie' : 'Eliminar'}</button>` : ''}
        ${canSkip ? `<button class="btn" id="em-skip" title="La serie continúa; solo se omite el ${fmtShort(occDate)}">Omitir el ${fmtShort(occDate)}</button>` : ''}
        <button class="btn" data-action="close-modal">Cancelar</button>
        <button class="btn gold" id="em-save">Guardar</button>
      </div>
    </div>
  </div>`, () => {
    $('#em-save').addEventListener('click', () => {
      const v = {
        title: $('#em-title').value.trim() || 'Evento',
        date: $('#em-date').value || today(),
        start: $('#em-start').value || '19:00',
        dur: Math.max(15, +$('#em-dur').value || 60),
        repeat: $('#em-repeat').value,
        until: $('#em-until').value || '',
      };
      if (existing) Object.assign(existing, v);
      else DB.events.push({ id: uid(), taskId: e0.taskId, skip: [], ...v });
      save(); closeModal(); render(); toast(existing ? 'Evento guardado' : (v.repeat !== 'none' ? 'Serie agendada ↻' : 'Evento agendado'));
    });
    const del = $('#em-del');
    if (del) del.addEventListener('click', () => {
      DB.events = DB.events.filter(x => x.id !== existing.id);
      save(); closeModal(); render(); toast(isRepeating(existing) ? 'Serie eliminada' : 'Evento eliminado');
    });
    const skip = $('#em-skip');
    if (skip) skip.addEventListener('click', () => {
      existing.skip = existing.skip || [];
      if (!existing.skip.includes(occDate)) existing.skip.push(occDate);
      save(); closeModal(); render(); toast(`Omitido: ${fmtShort(occDate)} · la serie continúa`);
    });
    $('#em-title').addEventListener('keydown', e => { if (e.key === 'Enter') $('#em-save').click(); });
  });
}

/* ═══════════ PALETA DE COMANDOS ═══════════ */
const paletteEl = $('#palette');
const palInput = $('#palette-input');
const palList = $('#palette-list');

function paletteItems(query) {
  const q = norm(query);
  const items = [];
  const push = (group, glyph, label, hint, run) => items.push({group, glyph, label, hint, run});
  const me = currentUser();

  const actions = [
    ['✒','Nueva nota','N', () => { const n = newNote('Nota sin título'); UI.noteId = n.id; UI.editMode = true; go('notes'); }],
    ['⚒','Nueva tarea','T', () => openTaskModal(null)],
    ['☉','Nuevo evento','E', () => openEventModal()],
    ['◫','Ir al Tablero','1', () => go('dashboard')],
    ['✒','Ir a Notas','2', () => go('notes')],
    ['⚒','Ir a Tareas','3', () => go('tasks')],
    ['☉','Ir al Calendario','4', () => go('calendar')],
    ['▤','Ir a la Biblioteca','5', () => go('library')],
    ...(canMonitor(me) ? [['◎','Ir a Monitoreo','7', () => go('monitor')]] : []),
    ...(canSeeAll(me) ? [['⚖','Ir a Administración','6', () => go('admin')]] : []),
    ...(assignTargets(me).length ? [['☩','Asignar trabajo','', () => openAssignModal()]] : []),
    ['▲','Abrir carpeta de Drive','', () => window.open(DRIVE_FOLDER, '_blank')],
    ['◐','Alternar tema claro/oscuro','', () => ACTIONS.theme()],
    ['☰','Alternar barra lateral','[', () => ACTIONS.sidebar()],
    ...(me.role === 'gadu' ? [['⇩','Exportar respaldo JSON','', () => ACTIONS.export()]] : []),
    ['⏻','Cerrar sesión','', () => ACTIONS.logout()],
  ];
  actions.forEach(([g, l, h, r]) => { if (!q || norm(l).includes(q)) push('Comandos', g, l, h, r); });

  DB.notes.forEach(n => {
    if (!q || norm(n.title).includes(q) || norm(n.body).includes(q))
      push('Notas', '✒', n.title, fmtShort(n.updated), () => { UI.noteId = n.id; UI.editMode = false; go('notes'); });
  });
  DB.tasks.forEach(t => {
    if (q && norm(t.title).includes(q))
      push('Tareas', '⚒', t.title, STATUS_META[t.status][0], () => openTaskModal(t));
  });
  visibleBooks().forEach(b => {
    if (q && (norm(b.title).includes(q) || norm(b.author).includes(q)))
      push('Biblioteca', '▤', `${b.title} — ${b.author}`, b.url ? '↗ abrir doc' : LIB_STATES[DB.libStatus[b.id] || 'pendiente'],
        () => b.url ? window.open(b.url, '_blank') : go('library'));
  });
  return items.slice(0, 24);
}
function renderPalette() {
  UI.palItems = paletteItems(palInput.value);
  UI.palSel = Math.min(UI.palSel, Math.max(0, UI.palItems.length - 1));
  let lastGroup = null;
  palList.innerHTML = UI.palItems.map((it, i) => {
    const head = it.group !== lastGroup ? `<div class="pal-group">${it.group}</div>` : '';
    lastGroup = it.group;
    return head + `
      <div class="pal-item${i === UI.palSel ? ' sel' : ''}" data-pal="${i}">
        <span class="p-glyph">${it.glyph}</span><span class="p-label">${esc(it.label)}</span>
        ${it.hint ? `<span class="p-hint">${esc(it.hint)}</span>` : ''}
      </div>`;
  }).join('') || '<div class="empty">Nada encontrado en el templo.</div>';
  $$('.pal-item', palList).forEach(el => {
    el.addEventListener('mouseenter', () => {
      UI.palSel = +el.dataset.pal;
      $$('.pal-item', palList).forEach(x => x.classList.toggle('sel', +x.dataset.pal === UI.palSel));
    });
    el.addEventListener('mousedown', e => { e.preventDefault(); runPalette(+el.dataset.pal); });
  });
}
function openPalette() { paletteEl.hidden = false; palInput.value = ''; UI.palSel = 0; renderPalette(); palInput.focus(); }
function closePalette() { paletteEl.hidden = true; }
function runPalette(i) { const it = UI.palItems[i]; if (!it) return; closePalette(); it.run(); }
palInput.addEventListener('input', () => { UI.palSel = 0; renderPalette(); });
palInput.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); UI.palSel = Math.min(UI.palSel + 1, UI.palItems.length - 1); renderPalette(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); UI.palSel = Math.max(UI.palSel - 1, 0); renderPalette(); }
  else if (e.key === 'Enter') { e.preventDefault(); runPalette(UI.palSel); }
});
paletteEl.addEventListener('mousedown', e => { if (e.target === paletteEl) closePalette(); });

/* ═══════════ TOASTS ═══════════ */
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="t-glyph">∴</span>${esc(msg)}`;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 350); }, 2600);
}

/* ═══════════ ACCIONES (delegación) ═══════════ */
const ACTIONS = {
  go: d => go(d.view),
  sidebar: () => {
    if (isMobile()) { UI.sideOpen = !UI.sideOpen; render(); return; }
    const p = currentUser().data.prefs; p.sidebar = !p.sidebar; save(); render();
  },
  theme: () => { const p = currentUser().data.prefs; p.theme = p.theme === 'dark' ? 'light' : 'dark'; save(); render(); toast(p.theme === 'dark' ? 'Cámara oscura' : 'Pergamino claro'); },
  palette: () => {
    if (isMobile() && UI.sideOpen) { UI.sideOpen = false; render(); }
    openPalette();
  },
  logout: () => {
    SESSION.userId = null; saveSession();
    UI.viewAs = null; UI.noteId = null; UI.view = 'dashboard';
    AUTH.mode = 'login'; AUTH.pick = null; AUTH.error = '';
    render();
  },
  help: () => openModal(`
    <div class="modal"><div class="modal-head"><h3>∴ Atajos</h3><button class="icon-btn" data-action="close-modal">✕</button></div>
    <div class="modal-body">
      ${[['Ctrl K','Paleta de comandos / búsqueda global'],['N','Nueva nota'],['T','Nueva tarea'],['E','Nuevo evento'],
         ['1 – 6','Navegar entre módulos'],['[','Mostrar / ocultar barra lateral'],['Esc','Cerrar diálogos'],['Doble clic','En una nota: pasar a edición']]
        .map(([k, d]) => `<div style="display:flex;gap:1rem;align-items:baseline"><kbd style="min-width:4.2em;text-align:center">${k}</kbd><span style="font-size:.92rem;color:var(--ink-2)">${d}</span></div>`).join('')}
    </div></div>`),
  'close-modal': () => closeModal(),
  export: () => {
    if (currentUser().role !== 'gadu') { toast('Solo el GADU custodia los respaldos'); return; }
    const owner = viewedUser();
    const blob = new Blob([JSON.stringify(owner.data, null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `gadu-${norm(owner.name).replace(/\s+/g, '-')}-${today()}.json`;
    a.click(); URL.revokeObjectURL(a.href);
    toast('Respaldo del taller exportado');
  },
  'export-all': () => {
    if (currentUser().role !== 'gadu') { toast('Solo el GADU custodia los respaldos'); return; }
    const blob = new Blob([JSON.stringify(STORE, null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `gadu-templo-${today()}.json`;
    a.click(); URL.revokeObjectURL(a.href);
    toast('Respaldo completo del templo exportado — guárdalo en Drive');
  },
  import: () => {
    if (currentUser().role !== 'gadu') { toast('Solo el GADU custodia los respaldos'); return; }
    $('#import-file').click();
  },
  sync: async () => {
    if (SYNC.dirty) { await pushTemple(); }
    await pullTemple(false);
  },
  'leave-temple': () => leaveTemple(),

  /* monitoreo y encomiendas */
  'assign-work': () => openAssignModal(),
  'grade-jp': d => {
    const u = getUser(d.user); if (!u) return;
    const t = (u.data.tasks || []).find(x => x.id === d.task); if (!t) return;
    if (!canGradeRole(currentUser(), u.role)) { toast('No te corresponde calificar este grado'); return; }
    t.review = { by: currentUser().id, verdict: 'jp', date: today() };
    save(); render(); toast(`∴ Trabajo de ${u.name} declarado Justo y Perfecto`);
  },
  'grade-redo': d => {
    const u = getUser(d.user); if (!u) return;
    const t = (u.data.tasks || []).find(x => x.id === d.task); if (!t) return;
    if (!canGradeRole(currentUser(), u.role)) { toast('No te corresponde calificar este grado'); return; }
    t.review = { by: currentUser().id, verdict: 'ajustes', date: today() };
    t.status = 'doing';
    save(); render(); toast(`↺ Trabajo devuelto a ${u.name} para ajustes`);
  },
  'lib-acc': d => {
    if (currentUser().role !== 'gadu') { toast('Solo el GADU designa la visibilidad'); return; }
    const sec = LIBRARY.sections.find(s => s.roman === d.roman); if (!sec) return;
    const cur = [...sectionRoles(sec)];
    const i = cur.indexOf(d.role);
    if (i >= 0) cur.splice(i, 1); else cur.push(d.role);
    STORE.meta.libAccess[sec.roman] = cur;
    save(); render();
  },
  'lib-hide': d => {
    if (currentUser().role !== 'gadu') { toast('Solo el GADU designa la visibilidad'); return; }
    STORE.meta.libHidden[d.roman] = !STORE.meta.libHidden[d.roman];
    save(); render();
    toast(STORE.meta.libHidden[d.roman] ? `⊘ Sección ${d.roman} oculta para toda la logia` : `👁 Sección ${d.roman} visible de nuevo`);
  },
  'doc-del': d => {
    const doc = STORE.meta.customDocs.find(x => x.id === d.id); if (!doc) return;
    const me = currentUser();
    if (me.role !== 'gadu' && doc.addedBy !== me.id) { toast('No puedes retirar este material'); return; }
    if (!confirm(`¿Retirar «${doc.title}» de la Biblioteca?`)) return;
    STORE.meta.customDocs = STORE.meta.customDocs.filter(x => x.id !== d.id);
    save(); render(); toast('Material retirado');
  },

  /* usuarios */
  'view-as': d => { UI.viewAs = d.id; UI.noteId = null; go('dashboard'); toast(`◉ Modo GADU: taller de ${userName(d.id)}`); },
  'exit-viewas': () => { UI.viewAs = null; UI.noteId = null; go('admin'); },
  'approve-user': d => {
    const u = getUser(d.id); if (!u) return;
    const sel = $(`#approve-role-${u.id}`);
    u.role = sel ? sel.value : (u.requestedRole || 'aprendiz');
    u.status = 'active'; u.requestedRole = null;
    save(); render(); toast(`✓ ${u.name} aprobado como ${ROLES[u.role].label}`);
  },
  'reject-user': d => {
    const u = getUser(d.id); if (!u) return;
    if (!confirm(`¿Rechazar y eliminar la solicitud de «${u.name}»?`)) return;
    STORE.users = STORE.users.filter(x => x.id !== u.id);
    save(); render(); toast('Solicitud rechazada');
  },
  'reset-pass': d => {
    const u = getUser(d.id); if (!u) return;
    const p = prompt(`Nueva contraseña para ${u.name} (mínimo 4 caracteres):`);
    if (!p || p.length < 4) { if (p !== null) toast('Contraseña demasiado corta'); return; }
    u.pass = pwHash(p);
    save(); toast(`Contraseña de ${u.name} restablecida`);
  },
  'del-user': d => {
    const u = getUser(d.id); if (!u) return;
    if (!confirm(`¿Eliminar a «${u.name}» y TODO su taller (notas, tareas, eventos)? Esta acción no se puede deshacer.`)) return;
    STORE.users = STORE.users.filter(x => x.id !== u.id);
    if (UI.viewAs === u.id) UI.viewAs = null;
    save(); render(); toast(`${u.name} ha dejado el templo`);
  },

  /* notas */
  'new-note': () => { const n = newNote('Nota sin título'); UI.noteId = n.id; UI.editMode = true; go('notes'); },
  'open-note': d => { UI.noteId = d.id; UI.editMode = false; go('notes'); },
  'note-mode': d => { UI.editMode = d.mode === 'edit'; render(); },
  'pin-note': d => { const n = getNote(d.id); n.pinned = !n.pinned; save(); render(); },
  'del-note': d => {
    const n = getNote(d.id);
    if (!confirm(`¿Eliminar la nota «${n.title}»?`)) return;
    DB.notes = DB.notes.filter(x => x.id !== d.id);
    UI.noteId = null; save(); render(); toast('Nota eliminada');
  },
  'note-tag': d => { UI.noteTag = UI.noteTag === d.tag ? null : d.tag; go('notes'); },
  wikilink: d => {
    let n = DB.notes.find(x => norm(x.title) === norm(d.wl));
    if (!n) { n = newNote(d.wl); toast(`Nota creada: «${d.wl}»`); }
    UI.noteId = n.id; UI.editMode = false; go('notes');
  },

  /* tareas */
  'new-task': () => openTaskModal(null),
  'edit-task': d => openTaskModal(getTask(d.id)),
  'toggle-task': d => {
    const t = getTask(d.id);
    /* tarea recurrente: al completarla se archiva la cumplida y se agenda la siguiente */
    if (t.status !== 'done' && t.repeat && t.repeat !== 'none') {
      DB.tasks.push({
        ...t, id: uid(), repeat: 'none', status: 'done', review: t.review || null,
        subtasks: t.subtasks.map(s => ({...s, done: true})),
      });
      t.due = nextDue(t.due, t.repeat);
      t.status = 'todo';
      t.subtasks = t.subtasks.map(s => ({...s, done: false}));
      t.review = null;
      save(); render();
      toast(`∴ Cumplida · próxima: ${fmtShort(t.due)} ↻`);
      return;
    }
    t.status = t.status === 'done' ? 'todo' : 'done';
    save(); render();
    if (t.status === 'done') toast('∴ Trabajo terminado');
  },
  'task-view': d => { UI.taskView = d.tv; render(); },
  'task-project': d => { UI.taskFilter.project = d.project || null; render(); },
  'open-project': d => { UI.taskFilter.project = d.project; go('tasks'); },

  /* calendario */
  'new-event': () => openEventModal({ date: UI.view === 'calendar' ? UI.calCursor : today() }),
  'edit-event': d => openEventModal({ occDate: d.date || null }, getEvent(d.id)),
  'cal-mode': d => { UI.calMode = d.cm; render(); },
  'cal-nav': d => {
    const dir = +d.dir;
    if (dir === 0) { UI.calCursor = today(); }
    else if (UI.calMode === 'month') { const c = parseYMD(UI.calCursor); c.setMonth(c.getMonth() + dir, 1); UI.calCursor = ymd(c); }
    else UI.calCursor = addDays(UI.calCursor, dir * 7);
    render();
  },
  'cal-day': d => { UI.calCursor = d.date; UI.calMode = 'week'; render(); },

  /* biblioteca */
  'lib-status': d => {
    DB.libStatus[d.id] = nextLibState(DB.libStatus[d.id] || 'pendiente');
    save(); render();
    if (DB.libStatus[d.id] === 'leido') toast('∴ Obra completada');
  },
  'lib-note': d => {
    const b = ALL_BOOKS.find(x => x.id === d.id);
    const title = `Lectura: ${b.title}`;
    let n = DB.notes.find(x => norm(x.title) === norm(title));
    if (!n) {
      const docLink = b.url ? `[Abrir documento en Drive](${b.url})\n\n` : '';
      n = newNote(title, `# ${b.title}\n*${b.author}* — Sección ${b.section.roman}: ${b.section.title}\n\n${docLink}#lectura #biblioteca\n\n> ${b.desc}\n\n## Ideas clave\n\n- \n\n## Citas\n\n> \n\n## Reflexión personal\n\n`);
      toast('Nota de estudio creada');
    }
    UI.noteId = n.id; UI.editMode = true; go('notes');
  },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const fn = ACTIONS[el.dataset.action];
  if (fn) { e.preventDefault(); fn(el.dataset, el, e); }
});

/* importación */
$('#import-file').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (Array.isArray(data.users)) {
        /* respaldo completo del templo */
        if (!canSeeAll(currentUser())) { toast('Solo el administrador puede restaurar el templo completo'); return; }
        if (!confirm('Esto reemplazará TODOS los usuarios y talleres por el respaldo. ¿Continuar?')) return;
        STORE = { users: data.users, meta: data.meta || {} };
        ensureMeta();
        SESSION.userId = null; saveSession();
        persist();
        UI.viewAs = null;
        render();
        return;
      }
      if (!data.notes || !data.tasks) throw new Error('formato');
      if (!confirm('Esto reemplazará los datos de este taller por el respaldo. ¿Continuar?')) return;
      const owner = viewedUser();
      owner.data = {
        notes: data.notes, tasks: data.tasks, events: data.events || [],
        libStatus: data.libStatus || {}, prefs: data.prefs || { theme:'dark', sidebar:true },
      };
      bindData();
      save(); render(); toast('Respaldo restaurado');
    } catch { toast('Archivo no válido'); }
  };
  reader.readAsText(file);
  e.target.value = '';
});

/* ═══════════ ATAJOS GLOBALES ═══════════ */
document.addEventListener('keydown', e => {
  if (!currentUser()) return; /* pantalla de acceso maneja sus propias teclas */
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    paletteEl.hidden ? openPalette() : closePalette();
    return;
  }
  if (e.key === 'Escape') {
    if (!paletteEl.hidden) closePalette();
    else if (!modalRoot.hidden) closeModal();
    return;
  }
  if (!paletteEl.hidden || !modalRoot.hidden) return;
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const k = e.key.toLowerCase();
  const views = { '1':'dashboard', '2':'notes', '3':'tasks', '4':'calendar', '5':'library', '6':'admin', '7':'monitor' };
  if (views[k]) { go(views[k]); }
  else if (k === 'n') { e.preventDefault(); ACTIONS['new-note'](); }
  else if (k === 't') { e.preventDefault(); openTaskModal(null); }
  else if (k === 'e') { e.preventDefault(); openEventModal(); }
  else if (k === '[') { ACTIONS.sidebar(); }
  else if (k === '?') { ACTIONS.help(); }
});

/* ═══════════ RUTA INICIAL ═══════════ */
const HASH_VIEWS = { '#/tablero':'dashboard', '#/notas':'notes', '#/tareas':'tasks', '#/calendario':'calendar', '#/biblioteca':'library', '#/administracion':'admin', '#/monitoreo':'monitor' };
if (HASH_VIEWS[location.hash]) UI.view = HASH_VIEWS[location.hash];
else history.replaceState(null, '', '#/tablero'); /* entrada base del historial */

window.addEventListener('hashchange', () => {
  if (!currentUser()) return;
  let v = HASH_VIEWS[location.hash] || 'dashboard';
  if ((v === 'admin' && !canSeeAll(currentUser())) || (v === 'monitor' && !canMonitor(currentUser()))) v = 'dashboard';
  if (v === UI.view) return; /* el hash lo acaba de fijar go(): no re-render */
  UI.view = v;
  if (isMobile()) UI.sideOpen = false;
  render();
});

/* service worker: offline + instalable (GitHub Pages sirve por HTTPS) */
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

/* re-render al cruzar el punto de quiebre móvil/escritorio */
window.addEventListener('resize', debounce(() => { if (currentUser()) render(); }, 250));

/* sincronización con el templo: al volver a la pestaña o recuperar conexión */
window.addEventListener('focus', () => { if (TEMPLE) pullTemple(); });
window.addEventListener('online', () => { if (TEMPLE) (SYNC.dirty ? pushTemple() : pullTemple()); });

render();
if (currentUser()) showSplash(currentUser());
if (TEMPLE) pullTemple();
