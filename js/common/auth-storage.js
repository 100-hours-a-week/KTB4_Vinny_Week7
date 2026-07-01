const AUTH_STORAGE_KEY = "auth";

export function getAuth() {
  const savedUserInfo = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!savedUserInfo) {
    return null;
  }

  try {
    return JSON.parse(savedUserInfo);
  } catch {
    return null;
  }
}

export function saveUser(session) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getUserId() {
  return getAuth()?.userId ?? null;
}
