const userEditForm = document.getElementById("user-edit-profile-form");
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

function getNicknameError() {
  const nickname = userEditNickname.value;

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

  const currentUser = getCurrentUser();
  const isDuplicated = getStoredUsers().some(
    (user) =>
      typeof user.nickname === "string" &&
      user.nickname === nickname &&
      user.id !== currentUser?.id
  );

  return isDuplicated ? "* 중복된 닉네임입니다." : "";
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

function showEditToast() {
  window.clearTimeout(toastTimer);
  userEditToast.classList.add("toast--visible");

  toastTimer = window.setTimeout(function() {
    userEditToast.classList.remove("toast--visible");
  }, 2000);
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
    window.alert("회원정보를 저장하지 못했습니다. 더 작은 이미지를 선택해주세요.");
    return false;
  }

  if (updatedUser.profileImage) {
    document.querySelector(".avatar").style.backgroundImage =
      `url("${updatedUser.profileImage}")`;
  }

  return true;
}

function openUserDeleteDialog() {
  userDeleteDialog.showModal();
  document.body.classList.add("modal-open");
}

function closeUserDeleteDialog(returnValue = "cancel") {
  userDeleteDialog.close(returnValue);
}

function deleteCurrentUser() {
  try {
    const currentUser = JSON.parse(
      localStorage.getItem("logged-in-user")
    );
    const users = JSON.parse(
      localStorage.getItem("community-users")
    );

    if (currentUser && Array.isArray(users)) {
      const remainingUsers = users.filter(
        (user) => user.id !== currentUser.id
      );
      localStorage.setItem(
        "community-users",
        JSON.stringify(remainingUsers)
      );
    }
  } catch {
    // 로그인 정보가 없거나 손상되어도 로그아웃 처리는 계속한다.
  }

  localStorage.removeItem("logged-in-user");
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
    showEditToast();
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
