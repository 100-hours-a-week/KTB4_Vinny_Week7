import {
  getEmailError as getEmailValidationError,
  getPasswordError as getPasswordValidationError
} from "./utils/validation.js";
import { setHelperText } from "./common/ui.js";
import { login } from "./api/user.js";
import { saveUser } from "./common/auth-storage.js";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const emailHelperText = document.getElementById("email-helper-text");
const passwordInput = document.getElementById("password");
const passwordHelperText = document.getElementById("password-helper-text");
const submitButton = document.getElementById("login-button");

function getEmailError() {
  return getEmailValidationError(emailInput.value);
}

function getPasswordError() {
  return getPasswordValidationError(passwordInput.value);
}

function validateEmail() {
  const error = getEmailError();
  setHelperText(emailHelperText, error);
  return error === "";
}

function validatePassword() {
  const error = getPasswordError();
  setHelperText(passwordHelperText, error);
  return error === "";
}

function isLoginFormValid() {
  return getEmailError() === "" && getPasswordError() === "";
}

function updateLoginButtonState() {
  submitButton.disabled = !isLoginFormValid();
}

function createLoginPayload(email, password) {
  return { email, password };
}

[emailInput, passwordInput].forEach(function(input) {
  input.addEventListener("input", updateLoginButtonState);
});

emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);

async function handleLoginSubmit(event) {
  event.preventDefault();

  const isValid = [
    validateEmail(),
    validatePassword()
  ].every(Boolean);

  updateLoginButtonState();

  if (!isValid) {
    return;
  }

  submitButton.disabled = true;

  try {
    const authSession = await login(
      createLoginPayload(emailInput.value, passwordInput.value)
    );
    saveUser(authSession);
    window.location.href = "./posts.html";
  } catch (error) {
    setHelperText(passwordHelperText, error.message);
    updateLoginButtonState();
  }
}

loginForm.addEventListener("submit", handleLoginSubmit);
updateLoginButtonState();
