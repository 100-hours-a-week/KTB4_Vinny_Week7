import { formatPostCount } from "./utils/formatters.js";
import { getCurrentUser } from "./shared/storage.js";
import { closeDialog, openDialog } from "./utils/ui.js";

const postDeleteButton = document.getElementById("post-delete-button");
const postDeleteDialog = document.getElementById("post-delete-dialog");
const postDeleteConfirmButton = document.getElementById(
  "post-delete-confirm-button"
);
const commentDeleteDialog = document.getElementById(
  "comment-delete-dialog"
);
const commentDeleteConfirmButton = document.getElementById(
  "comment-delete-confirm-button"
);
const dialogs = document.querySelectorAll("dialog.dialog");

const likeButton = document.getElementById("like-button");
const likeCount = document.getElementById("like-count");
const viewCount = document.getElementById("view-count");
const commentCount = document.getElementById("comment-count");

const commentForm = document.getElementById("comment-form");
const commentInput = document.getElementById("comment-input");
const commentSubmitButton = document.getElementById(
  "comment-submit-button"
);
const commentList = document.getElementById("comment-list");

let editingComment = null;
let deletingComment = null;

function renderPostCount(countElement) {
  countElement.textContent = formatPostCount(countElement.dataset.postCount);
}

function changeCount(countElement, amount) {
  const currentCount = Number(countElement.dataset.postCount);
  countElement.dataset.postCount = String(Math.max(0, currentCount + amount));
  renderPostCount(countElement);
}

function updateCommentButtonState() {
  commentSubmitButton.disabled = commentInput.value.trim() === "";
}

function resetCommentForm() {
  editingComment = null;
  commentInput.value = "";
  commentSubmitButton.textContent = "댓글 등록";
  updateCommentButtonState();
}

function getCurrentNickname() {
  return getCurrentUser()?.nickname || "데미 작성자 1";
}

function createCommentElement(content) {
  const comment = document.createElement("section");
  const authorLine = document.createElement("div");
  const avatar = document.createElement("span");
  const author = document.createElement("strong");
  const time = document.createElement("time");
  const actions = document.createElement("div");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  const body = document.createElement("p");

  comment.className = "comment-item";
  comment.dataset.commentId = String(Date.now());

  authorLine.className = "author-line";
  avatar.className = "tiny-avatar";
  author.textContent = getCurrentNickname();
  time.textContent = "방금 전";
  authorLine.append(avatar, author, time);

  actions.className = "comment-actions";
  editButton.className = "small-button comment-edit-button";
  editButton.type = "button";
  editButton.textContent = "수정";
  deleteButton.className = "small-button comment-delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "삭제";
  actions.append(editButton, deleteButton);

  body.className = "comment-item__body";
  body.textContent = content;

  comment.append(authorLine, actions, body);
  return comment;
}

[likeCount, viewCount, commentCount].forEach(renderPostCount);

likeButton.addEventListener("click", function() {
  const isLiked = likeButton.classList.toggle("is-liked");
  likeButton.setAttribute("aria-pressed", String(isLiked));
  changeCount(likeCount, isLiked ? 1 : -1);
});

commentInput.addEventListener("input", updateCommentButtonState);

commentForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const content = commentInput.value.trim();

  if (content === "") {
    updateCommentButtonState();
    return;
  }

  if (editingComment) {
    editingComment.querySelector(".comment-item__body").textContent = content;
  } else {
    commentList.append(createCommentElement(content));
    changeCount(commentCount, 1);
  }

  resetCommentForm();
});

commentList.addEventListener("click", function(event) {
  const editButton = event.target.closest(".comment-edit-button");
  const deleteButton = event.target.closest(".comment-delete-button");
  const comment = event.target.closest(".comment-item");

  if (editButton && comment) {
    editingComment = comment;
    commentInput.value = comment
      .querySelector(".comment-item__body")
      .textContent.trim();
    commentSubmitButton.textContent = "댓글 수정";
    updateCommentButtonState();
    commentInput.focus();
    return;
  }

  if (deleteButton && comment) {
    deletingComment = comment;
    openDialog(commentDeleteDialog);
  }
});

postDeleteButton.addEventListener("click", function() {
  openDialog(postDeleteDialog);
});

postDeleteConfirmButton.addEventListener("click", function() {
  closeDialog(postDeleteDialog, "confirm");
  window.location.href = "./posts.html";
});

commentDeleteConfirmButton.addEventListener("click", function() {
  if (deletingComment) {
    if (editingComment === deletingComment) {
      resetCommentForm();
    }

    deletingComment.remove();
    deletingComment = null;
    changeCount(commentCount, -1);
  }

  closeDialog(commentDeleteDialog, "confirm");
});

dialogs.forEach(function(dialog) {
  const closeButtons = dialog.querySelectorAll("[data-dialog-close]");

  closeButtons.forEach(function(closeButton) {
    closeButton.addEventListener("click", function() {
      closeDialog(dialog, closeButton.value);
    });
  });

  dialog.addEventListener("close", function() {
    if (!document.querySelector("dialog[open]")) {
      document.body.classList.remove("modal-open");
    }

    if (dialog === commentDeleteDialog) {
      deletingComment = null;
    }
  });
});

updateCommentButtonState();
