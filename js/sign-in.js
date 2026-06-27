import {
  getEmailError as getEmailValidationError,
  getPasswordError as getPasswordValidationError
} from "./utils/validation.js";
import {
  getStoredUsers,
  setCurrentUser
} from "./shared/storage.js";
import { setHelperText } from "./utils/ui.js";

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

signInForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const isValid = [validateEmail(), validatePassword()].every(Boolean);
  updateSignInButtonState();

  if (!isValid) {
    return;
  }

  const email = signInEmail.value.toLowerCase();
  const password = signInPassword.value;
  const user = getStoredUsers().find(
    (storedUser) =>
      typeof storedUser.email === "string" &&
      storedUser.email.toLowerCase() === email &&
      storedUser.password === password
  );

  if (!user) {
    setHelperText(
      passwordHelperText,
      "*아이디 또는 비밀번호를 확인해주세요"
    );
    return;
  }

  setCurrentUser(user);
  window.location.href = "./posts.html";
});

updateSignInButtonState();
