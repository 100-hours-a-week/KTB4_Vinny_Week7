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
  getUserId
} from "./common/auth-storage.js";

function createProfileUpdatePayload(
  userProfile,
  nickname,
  profileImageUrl
) {
  return {
    nickname,
    profileImageUrl:
      profileImageUrl || userProfile.profileImageUrl || ""
  };
}

function mergeUserProfile(userProfile, payload, response) {
  return {
    ...userProfile,
    ...payload,
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
  userId,
  userProfile,
  nickname,
  profileImageUrl
) {
  const payload = createProfileUpdatePayload(
    userProfile,
    nickname,
    profileImageUrl
  );
  const response = await updateUserProfile(userId, payload);

  return mergeUserProfile(userProfile, payload, response);
}

async function withdrawAuthenticatedUser(userId) {
  await withdrawUser(userId, createWithdrawPayload());
  clearAuthSession();
}

function updateHeaderAvatar(profileImageUrl) {
  const headerAvatar = document.querySelector(".avatar");

  if (headerAvatar && profileImageUrl) {
    headerAvatar.style.backgroundImage =
      `url("${profileImageUrl}")`;
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
  const withdrawButton = document.getElementById("user-delete-button");
  const withdrawDialog = document.getElementById("user-delete-dialog");
  const withdrawCancelButton = document.getElementById(
    "user-delete-cancel-button"
  );
  const withdrawConfirmButton = document.getElementById(
    "user-delete-confirm-button"
  );

  let loadedUserProfile = null;
  let selectedProfileImageUrl = "";

  function updateSubmitButtonState() {
    submitButton.disabled = !isProfileFormValid(nicknameInput.value);
  }

  function validateNickname() {
    const message = getNicknameError(nicknameInput.value);
    setHelperText(nicknameHelperText, message);
    return message === "";
  }

  function renderProfileImage(profileImageUrl) {
    selectedProfileImageUrl = profileImageUrl;
    profileImageButton.style.backgroundImage = `url("${profileImageUrl}")`;
  }

  function renderUserProfile(userProfile) {
    emailText.textContent = userProfile.email || "";
    nicknameInput.value = userProfile.nickname || "";

    if (userProfile.profileImageUrl) {
      renderProfileImage(userProfile.profileImageUrl);
    }

    updateSubmitButtonState();
  }

  async function loadUserProfile() {
    const userId = getUserId();

    if (!userId) {
      setHelperText(nicknameHelperText, "* 로그인 정보를 확인해주세요.");
      return;
    }

    try {
      loadedUserProfile = await getUserInfo(userId);
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

    const userId = getUserId();

    if (!userId || !loadedUserProfile) {
      window.alert("로그인 정보를 확인해주세요.");
      return;
    }

    submitButton.disabled = true;

    try {
      loadedUserProfile = await saveUserProfile(
        userId,
        loadedUserProfile,
        nicknameInput.value,
        selectedProfileImageUrl
      );
      renderUserProfile(loadedUserProfile);
      updateHeaderAvatar(loadedUserProfile.profileImageUrl);
      showToast(successToast);
    } catch (error) {
      window.alert(error.message);
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
    const userId = getUserId();

    if (!userId) {
      window.location.href = "./sign-in.html";
      return;
    }

    closeDialog(withdrawDialog, "confirm");

    try {
      await withdrawAuthenticatedUser(userId);
      window.location.href = "./sign-in.html";
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
