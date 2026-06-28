import {
  createComment,
  deleteComment,
  getComments,
  updateComment
} from "./api/comment.js";
import { getAuthenticatedUserId } from "./shared/auth-session.js";
import { closeDialog, openDialog } from "./utils/ui.js";

function createCommentElement(commentData) {
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
  comment.dataset.commentId = commentData.commentId;
  authorLine.className = "author-line";
  avatar.className = "tiny-avatar";
  author.textContent =
    commentData.author?.nickname || "알 수 없는 사용자";
  time.textContent = commentData.createdAt || "";

  if (commentData.author?.profileImageUrl) {
    avatar.style.backgroundImage =
      `url("${commentData.author.profileImageUrl}")`;
    avatar.style.backgroundPosition = "center";
    avatar.style.backgroundSize = "cover";
  }

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
  body.textContent = commentData.content;
  comment.append(authorLine, actions, body);

  return comment;
}

export function initializeCommentSection({
  postId,
  onCountChange
}) {
  const commentForm = document.getElementById("comment-form");
  const commentInput = document.getElementById("comment-input");
  const commentSubmitButton = document.getElementById(
    "comment-submit-button"
  );
  const commentList = document.getElementById("comment-list");
  const commentDeleteDialog = document.getElementById(
    "comment-delete-dialog"
  );
  const commentDeleteConfirmButton = document.getElementById(
    "comment-delete-confirm-button"
  );

  let editingComment = null;
  let deletingComment = null;

  function updateButtonState() {
    commentSubmitButton.disabled = commentInput.value.trim() === "";
  }

  function resetForm() {
    editingComment = null;
    commentInput.value = "";
    commentSubmitButton.textContent = "댓글 등록";
    updateButtonState();
  }

  async function loadComments() {
    try {
      const comments = await getComments(postId);
      commentList.replaceChildren(
        ...comments.map(createCommentElement)
      );
    } catch (error) {
      commentList.textContent = error.message;
    }
  }

  async function handleCommentSubmit(event) {
    event.preventDefault();

    const content = commentInput.value.trim();
    const userId = getAuthenticatedUserId();

    if (content === "") {
      updateButtonState();
      return;
    }

    if (!editingComment && !userId) {
      window.alert("로그인이 필요합니다.");
      return;
    }

    commentSubmitButton.disabled = true;

    try {
      if (editingComment) {
        const commentId = editingComment.dataset.commentId;
        const updatedComment = await updateComment(
          postId,
          commentId,
          { content }
        );

        if (updatedComment?.commentId) {
          editingComment.replaceWith(createCommentElement(updatedComment));
        } else {
          editingComment.querySelector(
            ".comment-item__body"
          ).textContent = content;
        }
      } else {
        const createdComment = await createComment(
          userId,
          postId,
          { content }
        );
        commentList.append(createCommentElement(createdComment));
        onCountChange(1);
      }

      resetForm();
    } catch (error) {
      window.alert(error.message);
    } finally {
      updateButtonState();
    }
  }

  function handleCommentListClick(event) {
    const editButton = event.target.closest(".comment-edit-button");
    const deleteButton = event.target.closest(".comment-delete-button");
    const comment = event.target.closest(".comment-item");

    if (editButton && comment) {
      editingComment = comment;
      commentInput.value = comment
        .querySelector(".comment-item__body")
        .textContent.trim();
      commentSubmitButton.textContent = "댓글 수정";
      updateButtonState();
      commentInput.focus();
      return;
    }

    if (deleteButton && comment) {
      deletingComment = comment;
      openDialog(commentDeleteDialog);
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingComment) {
      window.alert("댓글 정보를 확인해주세요.");
      return;
    }

    commentDeleteConfirmButton.disabled = true;

    try {
      await deleteComment(postId, deletingComment.dataset.commentId);

      if (editingComment === deletingComment) {
        resetForm();
      }

      deletingComment.remove();
      deletingComment = null;
      onCountChange(-1);
      closeDialog(commentDeleteDialog, "confirm");
    } catch (error) {
      window.alert(error.message);
    } finally {
      commentDeleteConfirmButton.disabled = false;
    }
  }

  function handleDialogCloseClick(event) {
    closeDialog(commentDeleteDialog, event.currentTarget.value);
  }

  function handleDialogClose() {
    if (!document.querySelector("dialog[open]")) {
      document.body.classList.remove("modal-open");
    }

    deletingComment = null;
  }

  const closeButtons = Array.from(
    commentDeleteDialog.querySelectorAll("[data-dialog-close]")
  );

  commentInput.addEventListener("input", updateButtonState);
  commentForm.addEventListener("submit", handleCommentSubmit);
  commentList.addEventListener("click", handleCommentListClick);
  commentDeleteConfirmButton.addEventListener(
    "click",
    handleDeleteConfirm
  );
  closeButtons.forEach(function(closeButton) {
    closeButton.addEventListener("click", handleDialogCloseClick);
  });
  commentDeleteDialog.addEventListener("close", handleDialogClose);

  updateButtonState();
  loadComments();

  return function destroyCommentSection() {
    commentInput.removeEventListener("input", updateButtonState);
    commentForm.removeEventListener("submit", handleCommentSubmit);
    commentList.removeEventListener("click", handleCommentListClick);
    commentDeleteConfirmButton.removeEventListener(
      "click",
      handleDeleteConfirm
    );
    closeButtons.forEach(function(closeButton) {
      closeButton.removeEventListener("click", handleDialogCloseClick);
    });
    commentDeleteDialog.removeEventListener("close", handleDialogClose);
  };
}
