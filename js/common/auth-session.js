const AUTH_SESSION_KEY = "auth-session";
const LEGACY_USER_ID_KEY = "userId";

function parseJson(value) {
  if (value === null) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function getAuthSession() {
  const session = parseJson(window.localStorage.getItem(AUTH_SESSION_KEY));

  if (session?.userId) {
    return session;
  }

  const legacyUserId = parseJson(
    window.localStorage.getItem(LEGACY_USER_ID_KEY)
  );

  return legacyUserId ? { userId: String(legacyUserId), token: "" } : null;
}

export function saveAuthSession(session) {
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  window.localStorage.removeItem(LEGACY_USER_ID_KEY);
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_SESSION_KEY);
  window.localStorage.removeItem(LEGACY_USER_ID_KEY);
}

export function getAuthenticatedUserId() {
  return getAuthSession()?.userId ?? null;
}
