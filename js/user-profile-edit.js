import { getNicknameError } from "./utils/validation.js";
import {
  closeDialog,
  openDialog,
  setHelperText,
  showToast
} from "./utils/ui.js";
import {
  getUserInfo,
  updateUserProfile,
  withdrawUser
} from "./api/user.js";
import {
  clearAuthSession,
  getAuthenticatedUserId
} from "./shared/auth-session.js";

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
    const userId = getAuthenticatedUserId();

    if (!userId) {
      setHelperText(nicknameHelperText, "* 로그인 정보를 확인해주세요.");
      return;
    }

    try {
      loadedUserProfile = await getUserInfo(userId);
      renderUserProfile(loadedUserProfile);
    } catch (error) {
      setHelperText(nicknameHelperText, error.message);
    }
  }

  async function submitProfileUpdate() {
    const userId = getAuthenticatedUserId();

    if (!userId || !loadedUserProfile) {
      setHelperText(nicknameHelperText, "* 로그인 정보를 확인해주세요.");
      return false;
    }

    const payload = createProfileUpdatePayload(
      loadedUserProfile,
      nicknameInput.value,
      selectedProfileImageUrl
    );

    try {
      const response = await updateUserProfile(userId, payload);
      loadedUserProfile = mergeUserProfile(
        loadedUserProfile,
        payload,
        response
      );
      renderUserProfile(loadedUserProfile);

      const headerAvatar = document.querySelector(".avatar");

      if (headerAvatar && loadedUserProfile.profileImageUrl) {
        headerAvatar.style.backgroundImage =
          `url("${loadedUserProfile.profileImageUrl}")`;
      }

      return true;
    } catch (error) {
      setHelperText(nicknameHelperText, error.message);
      return false;
    }
  }

  async function withdrawAuthenticatedUser() {
    const userId = getAuthenticatedUserId();

    if (!userId) {
      window.location.href = "./sign-in.html";
      return;
    }

    try {
      await withdrawUser(userId, createWithdrawPayload());
      clearAuthSession();
      window.location.href = "./sign-in.html";
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

    submitButton.disabled = true;

    if (await submitProfileUpdate()) {
      showToast(successToast);
    }

    updateSubmitButtonState();
  }

  withdrawButton.addEventListener("click", function() {
    openDialog(withdrawDialog);
  });

  withdrawCancelButton.addEventListener("click", function() {
    closeDialog(withdrawDialog);
  });

  async function handleWithdrawConfirm() {
    closeDialog(withdrawDialog, "confirm");
    await withdrawAuthenticatedUser();
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
