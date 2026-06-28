import { getNicknameError as getNicknameValidationError } from "./utils/validation.js";
import {
  closeDialog,
  openDialog,
  setHelperText,
  showToast
} from "./utils/ui.js";

const userEditForm = document.getElementById("user-profile-edit-form");
const userEditNickname = document.getElementById("nickname");
const nicknameHelperText = document.getElementById("nickname-helper-text");
const userEditButton = document.getElementById("user-edit-button");
const userEmail = document.getElementById("user-email");
const profilePreviewImage = document.getElementById(
  "profile-preview-image"
);
const profileImageInput = document.getElementById("profile-image-input");
const userEditToast = document.getElementById("user-edit-toast");
const userDeleteButton = document.getElementById("user-delete-button");
const userDeleteDialog = document.getElementById("user-delete-dialog");
const userDeleteCancelButton = document.getElementById(
  "user-delete-cancel-button"
);
const userDeleteConfirmButton = document.getElementById(
  "user-delete-confirm-button"
);

let profileImageData = "";

function getNicknameError() {
  const currentUser = getCurrentUser();
  return getNicknameValidationError(userEditNickname.value, {
    users: getStoredUsers(),
    currentUserId: currentUser?.id
  });
}

function validateUserEditFields() {
  const error = getNicknameError();
  setHelperText(nicknameHelperText, error);
  return error === "";
}

function isUserEditFormValid() {
  return getNicknameError() === "";
}

function updateUserEditButtonState() {
  userEditButton.disabled = !isUserEditFormValid();
}

function showProfileImage(imageData) {
  profileImageData = imageData;
  profilePreviewImage.style.backgroundImage = `url("${imageData}")`;
}

function initializeUserEditForm() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    updateUserEditButtonState();
    return;
  }

  userEmail.textContent = currentUser.email || "";
  userEditNickname.value = currentUser.nickname || "";

  if (currentUser.profileImage) {
    showProfileImage(currentUser.profileImage);
  }

  updateUserEditButtonState();
}

function saveUserChanges() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    setHelperText(
      nicknameHelperText,
      "* 로그인 정보를 확인해주세요."
    );
    return false;
  }

  const updatedUser = {
    ...currentUser,
    nickname: userEditNickname.value,
    profileImage: profileImageData || currentUser.profileImage
  };

  try {
    updateCurrentUser(updatedUser);
  } catch {
    window.alert("회원정보를 저장하지 못했습니다.");
    return false;
  }

  if (updatedUser.profileImage) {
    document.querySelector(".avatar").style.backgroundImage =
      `url("${updatedUser.profileImage}")`;
  }

  return true;
}

function openUserDeleteDialog() {
  openDialog(userDeleteDialog);
}

function closeUserDeleteDialog(returnValue = "cancel") {
  closeDialog(userDeleteDialog, returnValue);
}

function deleteCurrentUser() {
  try {
    removeCurrentUser();
  } catch {
    // 로그인 정보가 없거나 손상되어도 로그아웃 처리는 계속한다.
  }

  window.location.href = "./sign-in.html";
}

userEditNickname.addEventListener("blur", validateUserEditFields);
userEditNickname.addEventListener("input", updateUserEditButtonState);

profilePreviewImage.addEventListener("click", function() {
  profileImageInput.click();
});

profileImageInput.addEventListener("change", function() {
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
    showProfileImage(reader.result);
  });
  reader.addEventListener("error", function() {
    window.alert("이미지를 불러오지 못했습니다.");
  });
  reader.readAsDataURL(imageFile);
});

userEditForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const isValid = validateUserEditFields();
  updateUserEditButtonState();

  if (!isValid) {
    return;
  }

  if (saveUserChanges()) {
    showToast(userEditToast);
  }
});

userDeleteButton.addEventListener("click", openUserDeleteDialog);

userDeleteCancelButton.addEventListener("click", function() {
  closeUserDeleteDialog();
});

userDeleteConfirmButton.addEventListener("click", function() {
  closeUserDeleteDialog("confirm");
  deleteCurrentUser();
});

userDeleteDialog.addEventListener("close", function() {
  document.body.classList.remove("modal-open");
});

initializeUserEditForm();
