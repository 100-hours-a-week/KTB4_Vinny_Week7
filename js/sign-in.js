const USERS_STORAGE_KEY = "community-users";
const EMAIL_PATTERN =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,20}$/;

const signInForm = document.getElementById("sign-in-form");
const signInEmail = document.getElementById("email");
const emailHelperText = document.getElementById("email-helper-text");
const signInPassword = document.getElementById("password");
const passwordHelperText = document.getElementById("password-helper-text");
const signInButton = document.getElementById("sign-in-button");

function getStoredUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY));
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function setHelperText(helper, message) {
  helper.textContent = message;
  helper.classList.toggle("helper--visible", message !== "");
}

function getEmailError() {
  if (signInEmail.value === "") {
    return "*이메일을 입력해주세요.";
  }

  if (!EMAIL_PATTERN.test(signInEmail.value)) {
    return "*올바른 이메일 주소 형식을 입력해주세요. (예: example@adapterz.kr)";
  }

  return "";
}

function getPasswordError() {
  if (signInPassword.value === "") {
    return "*비밀번호를 입력해주세요";
  }

  if (!PASSWORD_PATTERN.test(signInPassword.value)) {
    return "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
  }

  return "";
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

  localStorage.setItem("logged-in-user", JSON.stringify(user));
  window.location.href = "./posts.html";
});

updateSignInButtonState();
