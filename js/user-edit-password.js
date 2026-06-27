const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,20}$/;

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

let toastTimer;

function getStoredUsers() {
  try {
    const users = JSON.parse(
      localStorage.getItem("community-users")
    );
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("logged-in-user"));
  } catch {
    return null;
  }
}

function setHelperText(helper, message) {
  helper.textContent = message;
  helper.classList.toggle("helper--visible", message !== "");
}

function getPasswordError() {
  const password = userEditPassword.value;

  if (password === "") {
    return "* 비밀번호를 입력해주세요";
  }

  if (!PASSWORD_PATTERN.test(password)) {
    return "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
  }

  if (
    userEditConfirmPassword.value !== "" &&
    password !== userEditConfirmPassword.value
  ) {
    return "* 비밀번호 확인과 다릅니다.";
  }

  return "";
}

function getConfirmPasswordError() {
  if (userEditConfirmPassword.value === "") {
    return "* 비밀번호를 한번 더 입력해주세요";
  }

  if (userEditPassword.value !== userEditConfirmPassword.value) {
    return "* 비밀번호와 다릅니다.";
  }

  return "";
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

function showEditToast() {
  window.clearTimeout(toastTimer);
  userEditPasswordToast.classList.add("toast--visible");

  toastTimer = window.setTimeout(function() {
    userEditPasswordToast.classList.remove("toast--visible");
  }, 2000);
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
  const updatedUsers = getStoredUsers().map((user) =>
    user.id === currentUser.id ? updatedUser : user
  );

  try {
    localStorage.setItem(
      "community-users",
      JSON.stringify(updatedUsers)
    );
    localStorage.setItem(
      "logged-in-user",
      JSON.stringify(updatedUser)
    );
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
  showEditToast();
});

updatePasswordButtonState();
