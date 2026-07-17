import { getNicknameError } from "./utils/validation.js";
import {
  closeDialog,
  openDialog,
  setHelperText,
  showToast
} from "./common/ui.js";
import {
  getUserInfo,
  updateUserProfile,
  withdrawUser
} from "./api/user.js";
import {
  clearAuthSession,
  getAuth,
  saveUser
} from "./common/auth-storage.js";
import { getFullImageUrl, setBackgroundImage } from "./utils/image.js";

function createProfileUpdatePayload(
  nickname,
  profileImageFile
) {
  return {
    nickname,
    profileImage: profileImageFile
  };
}

function mergeUserProfile(userProfile, payload, response) {
  return {
    ...userProfile,
    nickname: payload.nickname,
    ...(response ?? {})
  };
}

// 페이지 존재하지 않아서 하드코딩
function createWithdrawPayload() {
  return {
    withdrawReasonType: 1,
    withdrawReasonDetail: "사용하지 않음"
  };
}

function isProfileFormValid(nickname) {
  return getNicknameError(nickname) === "";
}

async function saveUserProfile(
  userProfile,
  nickname,
  profileImageFile
) {
  const payload = createProfileUpdatePayload(
    nickname,
    profileImageFile
  );
  const response = await updateUserProfile(payload);

  return mergeUserProfile(userProfile, payload, response);
}

async function withdrawAuthenticatedUser() {
  await withdrawUser( createWithdrawPayload());
  clearAuthSession();
}

function updateHeaderAvatar(profileImage) {
  const headerAvatar = document.querySelector(".avatar");

  if (headerAvatar && profileImage) {
    setBackgroundImage(headerAvatar, profileImage);
  }
}

function initializeUserProfileEditPage() {
  const profileForm = document.getElementById("user-profile-edit-form");
  const emailText = document.getElementById("user-email");
  const nicknameInput = document.getElementById("nickname");
  const nicknameHelperText = document.getElementById("nickname-helper-text");
  const profileImageButton = document.getElementById("profile-preview-image");
  const profileImageInput = document.getElementById("profile-image-input");
  const submitButton = document.getElementById("user-edit-button");
  const successToast = document.getElementById("user-edit-toast");
  const failToast = document.getElementById("user-edit-fail-toast");
  const withdrawButton = document.getElementById("user-delete-button");
  const withdrawDialog = document.getElementById("user-delete-dialog");
  const withdrawCancelButton = document.getElementById(
    "user-delete-cancel-button"
  );
  const withdrawConfirmButton = document.getElementById(
    "user-delete-confirm-button"
  );

  let loadedUserProfile = null;
  let selectedImageFile = null;
  let displayImage = null;

  function updateSubmitButtonState() {
    submitButton.disabled = !isProfileFormValid(nicknameInput.value);
  }

  function validateNickname() {
    const message = getNicknameError(nicknameInput.value);
    setHelperText(nicknameHelperText, message);
    return message === "";
  }

  function renderProfileImage(imageUrl) {
    displayImage = imageUrl;
    const fullUrl = getFullImageUrl(imageUrl);

    if (!fullUrl) {
      profileImageButton.style.removeProperty("background-image");
      return;
    }

    profileImageButton.style.backgroundImage = `url("${fullUrl}")`;
  }

  function renderUserProfile(userProfile) {
    emailText.textContent = userProfile.email || "";
    nicknameInput.value = userProfile.nickname || "";

    if (userProfile.profileImage) {
      renderProfileImage(userProfile.profileImage);
    }

    updateSubmitButtonState();
  }

  async function loadUserProfile() {

    try {
      loadedUserProfile = await getUserInfo();
      renderUserProfile(loadedUserProfile);
    } catch (error) {
      window.alert(error.message);
    }
  }

  nicknameInput.addEventListener("blur", validateNickname);
  nicknameInput.addEventListener("input", updateSubmitButtonState);

  profileImageButton.addEventListener("click", function() {
    profileImageInput.click();
  });

  function handleProfileImageChange() {
    const [imageFile] = profileImageInput.files;

    if (!imageFile) {
      return;
    }

    if (!imageFile.type.startsWith("image/")) {
      window.alert("이미지 파일을 선택해주세요.");
      profileImageInput.value = "";
      return;
    }

    selectedImageFile = imageFile;
    const reader = new FileReader();

    reader.addEventListener("load", function() {
      renderProfileImage(reader.result);
    });
    reader.addEventListener("error", function() {
      window.alert("이미지를 불러오지 못했습니다.");
    });
    reader.readAsDataURL(imageFile);
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();

    if (!validateNickname()) {
      updateSubmitButtonState();
      return;
    }

    submitButton.disabled = true;

    try {
      loadedUserProfile = await saveUserProfile(
        loadedUserProfile,
        nicknameInput.value,
        selectedImageFile
      );
      renderUserProfile(loadedUserProfile);
      updateHeaderAvatar(loadedUserProfile.profileImage);
      showToast(successToast);
      
      const currentAuth = getAuth();
      if (currentAuth) {
        const updatedAuth = {
          ...currentAuth,
          ...loadedUserProfile
        };
        saveUser(updatedAuth);
      }
    } catch (error) {
      showToast(failToast);
    } finally {
      updateSubmitButtonState();
    }
  }

  withdrawButton.addEventListener("click", function() {
    openDialog(withdrawDialog);
  });

  withdrawCancelButton.addEventListener("click", function() {
    closeDialog(withdrawDialog);
  });

  async function handleWithdrawConfirm() {

    closeDialog(withdrawDialog, "confirm");

    try {
      await withdrawAuthenticatedUser();
      closeDialog(withdrawDialog, "confirm");
      window.alert("회원 탈퇴가 완료되었습니다.");
      window.location.href = "./login.html";
    } catch (error) {
      window.alert(error.message);
    }
  }

  profileImageInput.addEventListener("change", handleProfileImageChange);
  profileForm.addEventListener("submit", handleProfileSubmit);
  withdrawConfirmButton.addEventListener("click", handleWithdrawConfirm);

  withdrawDialog.addEventListener("close", function() {
    document.body.classList.remove("modal-open");
  });

  loadUserProfile();
}

initializeUserProfileEditPage();
