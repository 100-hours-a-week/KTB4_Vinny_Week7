import {
  getConfirmPasswordError as getConfirmPasswordValidationError,
  getEmailError as getEmailValidationError,
  getNicknameError as getNicknameValidationError,
  getPasswordError as getPasswordValidationError
} from "./utils/validation.js";
import { addUser, getStoredUsers } from "./shared/storage.js";
import { setHelperText } from "./utils/ui.js";

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

function getEmailError() {
  return getEmailValidationError(signUpEmail.value, {
    users: getStoredUsers(),
    checkDuplicate: true
  });
}

function getPasswordError() {
  return getPasswordValidationError(
    signUpPassword.value,
    signUpConfirmPassword.value
  );
}

function getConfirmPasswordError() {
  return getConfirmPasswordValidationError(
    signUpPassword.value,
    signUpConfirmPassword.value
  );
}

function getNicknameError() {
  return getNicknameValidationError(signUpNickname.value, {
    users: getStoredUsers()
  });
}

function getProfileImageError() {
  return profileImageData === "" ? "*프로필 사진을 추가해주세요." : "";
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

  try {
    addUser({
      id: Date.now(),
      email: signUpEmail.value,
      password: signUpPassword.value,
      nickname: signUpNickname.value,
      profileImage: profileImageData
    });
    window.location.href = "./sign-in.html";
  } catch {
    window.alert("회원정보를 저장하지 못했습니다. 더 작은 이미지를 선택해주세요.");
  }
});

validateProfileImage();
updateSignUpButtonState();
