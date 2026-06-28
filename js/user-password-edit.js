import {
  getConfirmPasswordError,
  getPasswordError
} from "./utils/validation.js";
import { setHelperText, showToast } from "./utils/ui.js";
import { updateUserPassword } from "./api/user.js";
import { getAuthenticatedUserId } from "./shared/auth-session.js";

const passwordForm = document.getElementById("user-password-edit-form");
const passwordInput = document.getElementById("password");
const passwordHelperText = document.getElementById("password-helper-text");
const passwordConfirmInput = document.getElementById("password-confirm");
const passwordConfirmHelperText = document.getElementById(
  "confirm-password-helper-text"
);
const submitButton = document.getElementById("user-password-edit-button");
const successToast = document.getElementById("user-password-edit-toast");

function createPasswordUpdatePayload(password, passwordConfirm) {
  return { password, passwordConfirm };
}

function readPasswordValues() {
  return {
    password: passwordInput.value,
    passwordConfirm: passwordConfirmInput.value
  };
}

function isPasswordFormValid(values) {
  return (
    getPasswordError(
      values.password,
      values.passwordConfirm
    ) === "" &&
    getConfirmPasswordError(
      values.password,
      values.passwordConfirm
    ) === ""
  );
}

function validatePassword() {
  const values = readPasswordValues();
  const message = getPasswordError(
    values.password,
    values.passwordConfirm
  );

  setHelperText(passwordHelperText, message);
  return message === "";
}

function validatePasswordConfirm() {
  const values = readPasswordValues();
  const message = getConfirmPasswordError(
    values.password,
    values.passwordConfirm
  );

  setHelperText(passwordConfirmHelperText, message);
  return message === "";
}

function updateSubmitButtonState() {
  submitButton.disabled = !isPasswordFormValid(readPasswordValues());
}

passwordInput.addEventListener("blur", function() {
  validatePassword();

  if (passwordConfirmInput.value !== "") {
    validatePasswordConfirm();
  }
});

passwordConfirmInput.addEventListener("blur", function() {
  validatePasswordConfirm();
  validatePassword();
});

[passwordInput, passwordConfirmInput].forEach(function(input) {
  input.addEventListener("input", updateSubmitButtonState);
});

async function handlePasswordSubmit(event) {
  event.preventDefault();

  const isValid = [
    validatePassword(),
    validatePasswordConfirm()
  ].every(Boolean);

  if (!isValid) {
    updateSubmitButtonState();
    return;
  }

  const userId = getAuthenticatedUserId();

  if (!userId) {
    setHelperText(passwordHelperText, "* 로그인 정보를 확인해주세요.");
    return;
  }

  submitButton.disabled = true;

  try {
    await updateUserPassword(
      userId,
      createPasswordUpdatePayload(
        passwordInput.value,
        passwordConfirmInput.value
      )
    );
    passwordForm.reset();
    setHelperText(passwordHelperText, "");
    setHelperText(passwordConfirmHelperText, "");
    showToast(successToast);
  } catch (error) {
    setHelperText(passwordHelperText, error.message);
  } finally {
    updateSubmitButtonState();
  }
}

passwordForm.addEventListener("submit", handlePasswordSubmit);
updateSubmitButtonState();
