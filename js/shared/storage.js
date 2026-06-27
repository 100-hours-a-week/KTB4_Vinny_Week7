const USERS_STORAGE_KEY = "community-users";
const CURRENT_USER_STORAGE_KEY = "logged-in-user";

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function getStoredUsers() {
  const users = readJson(USERS_STORAGE_KEY, []);
  return Array.isArray(users) ? users : [];
}

export function getCurrentUser() {
  return readJson(CURRENT_USER_STORAGE_KEY, null);
}

export function addUser(user) {
  const users = [...getStoredUsers(), user];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
}

export function updateCurrentUser(updatedUser) {
  const users = getStoredUsers().map((user) =>
    user.id === updatedUser.id ? updatedUser : user
  );

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  setCurrentUser(updatedUser);
}

export function removeCurrentUser() {
  const currentUser = getCurrentUser();

  if (currentUser) {
    const users = getStoredUsers().filter(
      (user) => user.id !== currentUser.id
    );
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}
