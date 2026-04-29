/**
 * Jezreel Vet — Helper de API compartido entre index.html y admin.html
 * Incluir este archivo con: <script src="assets/api.js"></script>
 */

// ── CAMBIA ESTA URL EN PRODUCCIÓN ──────────────────────────────────────────
const JV_API = 'http://localhost:5000';

// ── Auth helpers ──────────────────────────────────────────────────────────────
const JVAuth = {
  getToken : ()=> localStorage.getItem('jv_token'),
  getUser  : ()=> JSON.parse(localStorage.getItem('jv_user') || '{}'),
  isLogged : ()=> !!localStorage.getItem('jv_token'),
  isAdmin  : ()=> JVAuth.getUser().rol === 'admin',
  logout   : ()=>{ localStorage.removeItem('jv_token'); localStorage.removeItem('jv_user'); },
  headers  : ()=> ({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JVAuth.getToken()
  }),
  headersNoJson: ()=> ({'Authorization': 'Bearer ' + JVAuth.getToken()}),
};

// ── Fetch wrapper ─────────────────────────────────────────────────────────────
async function jvFetch(path, opts = {}) {
  try {
    const res  = await fetch(JV_API + path, opts);
    const data = await res.json();
    return data;
  } catch (e) {
    console.error('jvFetch error:', e);
    return { ok: false, error: 'Error de conexión' };
  }
}

// ── Cargar perfil del usuario actual ─────────────────────────────────────────
async function jvGetMe() {
  if (!JVAuth.isLogged()) return null;
  return jvFetch('/api/auth/me', { headers: JVAuth.headers() });
}

// ── Exportar globalmente ──────────────────────────────────────────────────────
window.JV_API   = JV_API;
window.JVAuth   = JVAuth;
window.jvFetch  = jvFetch;
window.jvGetMe  = jvGetMe;
