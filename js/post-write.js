const postWriteForm = document.getElementById("post-write-form");
const postTitle = document.getElementById("title");
const postContent = document.getElementById("content");
const postWriteHelperText = document.getElementById(
  "post-write-helper-text"
);
const postWriteButton = document.getElementById("post-write-button");

function setHelperText(helper, message) {
  helper.textContent = message;
  helper.classList.toggle("helper--visible", message !== "");
}

function getPostWriteError() {
  const title = postTitle.value.trim();
  const content = postContent.value.trim();

  if (title === "" || content === "") {
    return "* 제목, 내용을 모두 작성해주세요";
  }

  return "";
}

function validatePostWriteFields() {
  const error = getPostWriteError();
  setHelperText(postWriteHelperText, error);
  return error === "";
}

function isPostWriteFormValid() {
  return getPostWriteError() === "";
}

function updatePostWriteButtonState() {
  postWriteButton.disabled = !isPostWriteFormValid();
}

postTitle.addEventListener("blur", validatePostWriteFields);
postContent.addEventListener("blur", validatePostWriteFields);

[postTitle, postContent].forEach(function(input) {
  input.addEventListener("input", updatePostWriteButtonState);
});

postWriteForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const isValid = validatePostWriteFields();
  updatePostWriteButtonState();

  if (!isValid) {
    return;
  }

  window.location.href = "./post-detail.html";
});

updatePostWriteButtonState();
