import {
  getConfirmPasswordError,
  getEmailError,
  getNicknameError,
  getPasswordError
} from "./utils/validation.js";
import { signUp } from "./api/user.js";
import { setHelperText } from "./common/ui.js";

function initializeSignUpPage() {
  const signUpForm = document.getElementById("sign-up-form");
  const emailInput = document.getElementById("email");
  const emailHelperText = document.getElementById("email-helper-text");
  const passwordInput = document.getElementById("password");
  const passwordHelperText = document.getElementById("password-helper-text");
  const passwordConfirmInput = document.getElementById("password-confirm");
  const passwordConfirmHelperText = document.getElementById(
    "confirm-password-helper-text"
  );
  const nicknameInput = document.getElementById("nickname");
  const nicknameHelperText = document.getElementById("nickname-helper-text");
  const submitButton = document.getElementById("sign-up-button");
  const profileImageInput = document.getElementById("profile-image");
  const profileImageButton = document.getElementById("profile-image-button");
  const profileImagePreview = document.getElementById("profile-image-preview");
  const profileImagePlaceholder = document.getElementById(
    "profile-image-placeholder"
  );
  const profileImageHelperText = document.getElementById(
    "profile-helper-text"
  );

  let selectedProfileImageUrl = "";

  function getProfileImageError(profileImageUrl) {
    return profileImageUrl === ""
      ? "* 프로필 사진을 추가해주세요."
      : "";
  }

  function getSignUpErrors(values) {
    return {
      email: getEmailError(values.email),
      password: getPasswordError(
        values.password,
        values.passwordConfirm
      ),
      passwordConfirm: getConfirmPasswordError(
        values.password,
        values.passwordConfirm
      ),
      nickname: getNicknameError(values.nickname)
    };
  }

  function createSignUpPayload(values) {
    return {
      email: values.email,
      password: values.password,
      passwordConfirm: values.passwordConfirm,
      nickname: values.nickname,
      profileImageUrl: values.profileImageUrl
    };
  }

  function readSignUpFormValues() {
    return {
      email: emailInput.value,
      password: passwordInput.value,
      passwordConfirm: passwordConfirmInput.value,
      nickname: nicknameInput.value,
      profileImageUrl: selectedProfileImageUrl
    };
  }

  function isSignUpFormValid(values) {
    return Object.values(getSignUpErrors(values)).every(
      (message) => message === ""
    );
  }

  function updateSubmitButtonState() {
    submitButton.disabled = !isSignUpFormValid(
      readSignUpFormValues()
    );
  }

  function validateEmail() {
    const message = getEmailError(emailInput.value);
    setHelperText(emailHelperText, message);
    return message === "";
  }

  function validatePassword() {
    const message = getPasswordError(
      passwordInput.value,
      passwordConfirmInput.value
    );
    setHelperText(passwordHelperText, message);
    return message === "";
  }

  function validatePasswordConfirm() {
    const message = getConfirmPasswordError(
      passwordInput.value,
      passwordConfirmInput.value
    );
    setHelperText(passwordConfirmHelperText, message);
    return message === "";
  }

  function validateNickname() {
    const message = getNicknameError(nicknameInput.value);
    setHelperText(nicknameHelperText, message);
    return message === "";
  }

  function validateProfileImage() {
    const message = getProfileImageError(selectedProfileImageUrl);
    setHelperText(profileImageHelperText, message);
    return message === "";
  }

  function renderProfileImage(profileImageUrl) {
    selectedProfileImageUrl = profileImageUrl;
    profileImagePreview.src = profileImageUrl;
    profileImagePreview.hidden = false;
    profileImagePlaceholder.hidden = true;
    setHelperText(profileImageHelperText, "");
    updateSubmitButtonState();
  }

  profileImageButton.addEventListener("click", function() {
    profileImageInput.click();
  });

  function handleProfileImageChange() {
    const [imageFile] = profileImageInput.files;

    if (!imageFile) {
      validateProfileImage();
      return;
    }

    if (!imageFile.type.startsWith("image/")) {
      profileImageInput.value = "";
      setHelperText(
        profileImageHelperText,
        "* 이미지 파일을 선택해주세요."
      );
      updateSubmitButtonState();
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", function() {
      renderProfileImage(reader.result);
    });
    reader.addEventListener("error", function() {
      setHelperText(
        profileImageHelperText,
        "* 이미지를 불러오지 못했습니다."
      );
      updateSubmitButtonState();
    });
    reader.readAsDataURL(imageFile);
  }

  emailInput.addEventListener("blur", validateEmail);
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
  nicknameInput.addEventListener("blur", validateNickname);

  [
    emailInput,
    passwordInput,
    passwordConfirmInput,
    nicknameInput
  ].forEach(function(input) {
    input.addEventListener("input", updateSubmitButtonState);
  });

  async function handleSignUpFormSubmit(event) {
    event.preventDefault();

    const isValid = [
      validateEmail(),
      validatePassword(),
      validatePasswordConfirm(),
      validateNickname(),
      validateProfileImage()
    ].every(Boolean);

    if (!isValid) {
      updateSubmitButtonState();
      return;
    }

    submitButton.disabled = true;

    try {
      const response = await signUp(createSignUpPayload(readSignUpFormValues()));

      if (response !== undefined) {
        window.location.href = "./sign-in.html";
      }
    } catch (error) {
      window.alert(error.message);
      updateSubmitButtonState();
    }
  }

  profileImageInput.addEventListener("change", handleProfileImageChange);
  signUpForm.addEventListener("submit", handleSignUpFormSubmit);
  updateSubmitButtonState();
}

initializeSignUpPage();
