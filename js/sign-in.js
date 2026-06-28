import {
  getEmailError as getEmailValidationError,
  getPasswordError as getPasswordValidationError
} from "./utils/validation.js";
import {
  getStoredUsers,
  setCurrentUser
} from "./shared/storage.js";
import { setHelperText } from "./utils/ui.js";
import { signIn } from "./api/user.js";

const signInForm = document.getElementById("sign-in-form");
const signInEmail = document.getElementById("email");
const emailHelperText = document.getElementById("email-helper-text");
const signInPassword = document.getElementById("password");
const passwordHelperText = document.getElementById("password-helper-text");
const signInButton = document.getElementById("sign-in-button");

function getEmailError() {
  return getEmailValidationError(signInEmail.value);
}

function getPasswordError() {
  return getPasswordValidationError(signInPassword.value);
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
  signInButton.disabled = !isSignInFormValid();
}

signInEmail.addEventListener("blur", validateEmail);
signInPassword.addEventListener("blur", validatePassword);

[signInEmail, signInPassword].forEach(function(input) {
  input.addEventListener("input", updateSignInButtonState);
});

signInForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const isValid = [
    validateEmail(),
    validatePassword()
  ].every(Boolean);

  updateSignInButtonState();

  if (!isValid) {
    return;
  }

  signInButton.disabled = true;

  try {
    await signIn({
      email: signInEmail.value,
      password: signInPassword.value
    });
    window.location.href = "./posts.html";
  } catch (error) {
    setHelperText(passwordHelperText, error.message);
    updateSignInButtonState();
  }
});

updateSignInButtonState();
