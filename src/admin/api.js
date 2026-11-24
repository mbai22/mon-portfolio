// Thin client for the PHP admin API (public/api/*.php)

let csrf = '';

async function call(path, { method = 'GET', body, json = true } = {}) {
  const headers = { Accept: 'application/json' };
  if (method !== 'GET') headers['X-CSRF-Token'] = csrf;
  if (json && body !== undefined) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(path, {
      method,
      headers,
      credentials: 'same-origin',
      cache: 'no-store',
      body: body === undefined ? undefined : json ? JSON.stringify(body) : body,
    });
  } catch {
    throw new Error('Serveur injoignable. Vérifiez votre connexion internet.');
  }

  const type = res.headers.get('content-type') || '';
  if (!type.includes('application/json')) {
    throw new Error("L'API d'administration ne répond pas (PHP absent ou fichier manquant sur le serveur).");
  }
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.error || `Erreur ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return data;
}

export async function getSession() {
  const data = await call('/api/auth.php');
  csrf = data.csrf || '';
  return data;
}

export async function login(password) {
  const data = await call('/api/auth.php', { method: 'POST', body: { password } });
  csrf = data.csrf || '';
  return data;
}

export async function logout() {
  await call('/api/auth.php', { method: 'DELETE' }).catch(() => {});
  csrf = '';
}

export const getContent = () => call('/api/content.php');

export const saveSection = (section, data) =>
  call('/api/content.php', { method: 'PUT', body: { section, data } });

export const resetSection = (section) =>
  call(`/api/content.php?section=${encodeURIComponent(section)}`, { method: 'DELETE' });

// Large photos are scaled down (max 2000 px) and re-encoded as WebP before upload
async function shrink(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || !('createImageBitmap' in window)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 600 * 1024) return file;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' });
  } catch {
    return file;
  }
}

export async function uploadImage(file) {
  const form = new FormData();
  form.append('file', await shrink(file));
  return call('/api/upload.php', { method: 'POST', body: form, json: false });
}
