import {
  getEmailError as getEmailValidationError,
  getPasswordError as getPasswordValidationError
} from "./utils/validation.js";
import { setHelperText } from "./common/ui.js";
import { signIn } from "./api/user.js";
import { saveAuthSession } from "./common/auth-session.js";

const signInForm = document.getElementById("sign-in-form");
const emailInput = document.getElementById("email");
const emailHelperText = document.getElementById("email-helper-text");
const passwordInput = document.getElementById("password");
const passwordHelperText = document.getElementById("password-helper-text");
const submitButton = document.getElementById("sign-in-button");

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

function isSignInFormValid() {
  return getEmailError() === "" && getPasswordError() === "";
}

function updateSignInButtonState() {
  submitButton.disabled = !isSignInFormValid();
}

function createSignInPayload(email, password) {
  return { email, password };
}

[emailInput, passwordInput].forEach(function(input) {
  input.addEventListener("input", updateSignInButtonState);
});

emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);

async function handleSignInSubmit(event) {
  event.preventDefault();

  const isValid = [
    validateEmail(),
    validatePassword()
  ].every(Boolean);

  updateSignInButtonState();

  if (!isValid) {
    return;
  }

  submitButton.disabled = true;

  try {
    const authSession = await signIn(
      createSignInPayload(emailInput.value, passwordInput.value)
    );
    saveAuthSession(authSession);
    window.location.href = "./posts.html";
  } catch (error) {
    setHelperText(passwordHelperText, error.message);
    updateSignInButtonState();
  }
}

signInForm.addEventListener("submit", handleSignInSubmit);
updateSignInButtonState();
