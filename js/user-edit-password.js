import {
  getConfirmPasswordError as getConfirmPasswordValidationError,
  getPasswordError as getPasswordValidationError
} from "./utils/validation.js";
import {
  getCurrentUser,
  updateCurrentUser
} from "./shared/storage.js";
import { setHelperText, showToast } from "./utils/ui.js";

const userEditPasswordForm = document.getElementById(
  "user-edit-password-form"
);
const userEditPassword = document.getElementById("password");
const passwordHelperText = document.getElementById(
  "password-helper-text"
);
const userEditConfirmPassword = document.getElementById(
  "password-confirm"
);
const confirmPasswordHelperText = document.getElementById(
  "confirm-password-helper-text"
);
const userEditPasswordButton = document.getElementById(
  "user-edit-password-button"
);
const userEditPasswordToast = document.getElementById(
  "user-edit-password-toast"
);

function getPasswordError() {
  return getPasswordValidationError(
    userEditPassword.value,
    userEditConfirmPassword.value
  );
}

function getConfirmPasswordError() {
  return getConfirmPasswordValidationError(
    userEditPassword.value,
    userEditConfirmPassword.value
  );
}

function validatePassword() {
  const error = getPasswordError();
  setHelperText(passwordHelperText, error);
  return error === "";
}

function validateConfirmPassword() {
  const error = getConfirmPasswordError();
  setHelperText(confirmPasswordHelperText, error);
  return error === "";
}

function isPasswordFormValid() {
  return (
    getPasswordError() === "" &&
    getConfirmPasswordError() === ""
  );
}

function updatePasswordButtonState() {
  userEditPasswordButton.disabled = !isPasswordFormValid();
}

function savePassword() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    setHelperText(
      passwordHelperText,
      "* 로그인 정보를 확인해주세요."
    );
    return false;
  }

  const updatedUser = {
    ...currentUser,
    password: userEditPassword.value
  };
  try {
    updateCurrentUser(updatedUser);
  } catch {
    window.alert("비밀번호를 저장하지 못했습니다.");
    return false;
  }

  return true;
}

userEditPassword.addEventListener("blur", function() {
  validatePassword();

  if (userEditConfirmPassword.value !== "") {
    validateConfirmPassword();
  }
});

userEditConfirmPassword.addEventListener("blur", function() {
  validateConfirmPassword();
  validatePassword();
});

[userEditPassword, userEditConfirmPassword].forEach(function(input) {
  input.addEventListener("input", updatePasswordButtonState);
});

userEditPasswordForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const isValid = [
    validatePassword(),
    validateConfirmPassword()
  ].every(Boolean);

  updatePasswordButtonState();

  if (!isValid || !savePassword()) {
    return;
  }

  userEditPasswordForm.reset();
  setHelperText(passwordHelperText, "");
  setHelperText(confirmPasswordHelperText, "");
  updatePasswordButtonState();
  showToast(userEditPasswordToast);
});

updatePasswordButtonState();
