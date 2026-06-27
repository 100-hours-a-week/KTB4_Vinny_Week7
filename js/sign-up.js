const USERS_STORAGE_KEY = "community-users";
const EMAIL_PATTERN =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,20}$/;

const signUpForm = document.getElementById("sign-up-form");
const signUpEmail = document.getElementById("email");
const emailHelperText = document.getElementById("email-helper-text");
const signUpPassword = document.getElementById("password");
const passwordHelperText = document.getElementById("password-helper-text");
const signUpConfirmPassword = document.getElementById("password-confirm");
const confirmPasswordHelperText = document.getElementById(
  "confirm-password-helper-text"
);
const signUpNickname = document.getElementById("nickname");
const nicknameHelperText = document.getElementById("nickname-helper-text");
const signUpButton = document.getElementById("sign-up-button");
const profileImageInput = document.getElementById("profile-image");
const profileImageButton = document.getElementById("profile-image-button");
const profileImagePreview = document.getElementById("profile-image-preview");
const profileImagePlaceholder = document.getElementById(
  "profile-image-placeholder"
);
const profileHelperText = document.getElementById("profile-helper-text");

let profileImageData = "";

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
  const email = signUpEmail.value;

  if (email === "") {
    return "* 이메일을 입력해주세요";
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "* 올바른 이메일 주소 형식을 입력해주세요 (예: example@example.com)";
  }

  const isDuplicated = getStoredUsers().some(
    (user) =>
      typeof user.email === "string" &&
      user.email.toLowerCase() === email.toLowerCase()
  );

  return isDuplicated ? "* 중복된 이메일입니다." : "";
}

function getPasswordError() {
  const password = signUpPassword.value;

  if (password === "") {
    return "* 비밀번호를 입력해주세요";
  }

  if (!PASSWORD_PATTERN.test(password)) {
    return "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
  }

  if (
    signUpConfirmPassword.value !== "" &&
    password !== signUpConfirmPassword.value
  ) {
    return "* 비밀번호가 확인과 다릅니다.";
  }

  return "";
}

function getConfirmPasswordError() {
  if (signUpConfirmPassword.value === "") {
    return "* 비밀번호를 한번더 입력해주세요";
  }

  if (signUpPassword.value !== signUpConfirmPassword.value) {
    return "* 비밀번호가 다릅니다.";
  }

  return "";
}

function getNicknameError() {
  const nickname = signUpNickname.value;

  if (nickname === "") {
    return "* 닉네임을 입력해주세요";
  }

  if (/\s/.test(nickname)) {
    return "* 띄어쓰기를 없애주세요";
  }

  if (nickname.length < 2) {
    return "* 닉네임은 최소 2자 이상 작성해야 합니다.";
  }

  if (nickname.length > 10) {
    return "* 닉네임은 최대 10자까지 작성 가능합니다.";
  }

  const isDuplicated = getStoredUsers().some(
    (user) => typeof user.nickname === "string" && user.nickname === nickname
  );

  return isDuplicated ? "* 중복된 닉네임입니다." : "";
}

function getProfileImageError() {
  return profileImageData === "" ? "* 프로필 사진을 추가해주세요." : "";
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

function validateConfirmPassword() {
  const error = getConfirmPasswordError();
  setHelperText(confirmPasswordHelperText, error);
  return error === "";
}

function validateNickname() {
  const error = getNicknameError();
  setHelperText(nicknameHelperText, error);
  return error === "";
}

function validateProfileImage() {
  const error = getProfileImageError();
  setHelperText(profileHelperText, error);
  return error === "";
}

function isSignUpFormValid() {
  return (
    getEmailError() === "" &&
    getPasswordError() === "" &&
    getConfirmPasswordError() === "" &&
    getNicknameError() === "" &&
    getProfileImageError() === ""
  );
}

function updateSignUpButtonState() {
  signUpButton.disabled = !isSignUpFormValid();
}

function resetProfileImage() {
  profileImageData = "";
  profileImageInput.value = "";
  profileImagePreview.removeAttribute("src");
  profileImagePreview.hidden = true;
  profileImagePlaceholder.hidden = false;
}

function showProfileImage(imageData) {
  profileImageData = imageData;
  profileImagePreview.src = imageData;
  profileImagePreview.hidden = false;
  profileImagePlaceholder.hidden = true;
  setHelperText(profileHelperText, "");
  updateSignUpButtonState();
}

profileImageButton.addEventListener("click", function() {
  if (profileImageData !== "") {
    resetProfileImage();
    updateSignUpButtonState();
  }

  profileImageInput.click();
});

profileImageInput.addEventListener("change", function() {
  const [imageFile] = profileImageInput.files;

  if (!imageFile) {
    validateProfileImage();
    updateSignUpButtonState();
    return;
  }

  if (!imageFile.type.startsWith("image/")) {
    resetProfileImage();
    setHelperText(profileHelperText, "* 이미지 파일을 선택해주세요.");
    updateSignUpButtonState();
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", function() {
    showProfileImage(reader.result);
  });
  reader.addEventListener("error", function() {
    resetProfileImage();
    setHelperText(profileHelperText, "* 이미지를 불러오지 못했습니다.");
    updateSignUpButtonState();
  });
  reader.readAsDataURL(imageFile);
});

profileImageInput.addEventListener("cancel", function() {
  validateProfileImage();
  updateSignUpButtonState();
});

signUpEmail.addEventListener("blur", validateEmail);
signUpPassword.addEventListener("blur", function() {
  validatePassword();

  if (signUpConfirmPassword.value !== "") {
    validateConfirmPassword();
  }
});
signUpConfirmPassword.addEventListener("blur", function() {
  validateConfirmPassword();
  validatePassword();
});
signUpNickname.addEventListener("blur", validateNickname);

[
  signUpEmail,
  signUpPassword,
  signUpConfirmPassword,
  signUpNickname
].forEach(function(input) {
  input.addEventListener("input", updateSignUpButtonState);
});

signUpForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const isValid = [
    validateEmail(),
    validatePassword(),
    validateConfirmPassword(),
    validateNickname(),
    validateProfileImage()
  ].every(Boolean);

  updateSignUpButtonState();

  if (!isValid) {
    return;
  }

  const users = getStoredUsers();
  users.push({
    id: Date.now(),
    email: signUpEmail.value,
    password: signUpPassword.value,
    nickname: signUpNickname.value,
    profileImage: profileImageData
  });

  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    window.location.href = "./sign-in.html";
  } catch {
    window.alert("회원정보를 저장하지 못했습니다. 더 작은 이미지를 선택해주세요.");
  }
});

updateSignUpButtonState();
