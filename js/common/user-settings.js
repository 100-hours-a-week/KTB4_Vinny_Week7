import { logout } from "../api/user.js";
import { clearAuthSession, getAuth } from "./auth-storage.js";
import { setBackgroundImage } from "../utils/image.js";

function renderSettingsProfile() {
  const authSession = getAuth();

  document.querySelectorAll("[data-settings-nickname]").forEach(function(element) {
    element.textContent = authSession?.nickname || "회원";
  });
  document.querySelectorAll("[data-settings-email]").forEach(function(element) {
    element.textContent = authSession?.email || "";
  });
  document.querySelectorAll("[data-settings-avatar]").forEach(function(element) {
    setBackgroundImage(element, authSession?.profileImage || "");
  });
}

async function handleSettingsLogout(event) {
  const button = event.currentTarget;
  button.disabled = true;

  try {
    await logout();
    clearAuthSession();
    window.location.href = "./login.html";
  } catch (error) {
    button.disabled = false;
    window.alert(error.message);
  }
}

document.querySelectorAll("[data-settings-logout]").forEach(function(button) {
  button.addEventListener("click", handleSettingsLogout);
});

renderSettingsProfile();
