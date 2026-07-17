import {
  createReview,
  deleteReview,
  getReviews,
  updateReview
} from "./api/review.js";
import { closeDialog, openDialog } from "./common/ui.js";

function getReviewList(response) {
  return Array.isArray(response?.reviews) ? response.reviews : [];
}

function getAuthorName(reviewData) {
  return (
    reviewData.author?.nickname ||
    "알 수 없는 사용자"
  );
}

function createReviewElement(reviewData) {
  const review = document.createElement("section");
  const authorLine = document.createElement("div");
  const avatar = document.createElement("span");
  const author = document.createElement("strong");
  const time = document.createElement("time");
  const body = document.createElement("p");
  const isOwner = Boolean(reviewData.isOwner);

  review.className = "review-item";
  review.dataset.reviewId = reviewData.reviewId;
  authorLine.className = "author-line";
  avatar.className = "tiny-avatar";
  author.textContent = getAuthorName(reviewData);
  time.textContent = reviewData.createdAt || "";

  if (reviewData.author?.profileImage) {
    avatar.style.backgroundImage =
      `url("${reviewData  .author.profileImage}")`;
    avatar.style.backgroundPosition = "center";
    avatar.style.backgroundSize = "cover";
  }

  authorLine.append(avatar, author, time);

  body.className = "review-item__body";
  body.textContent = reviewData.content;

  if (isOwner) {
    const actions = document.createElement("div");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    actions.className = "review-actions";
    editButton.className = "small-button review-edit-button";
    editButton.type = "button";
    editButton.textContent = "수정";
    deleteButton.className = "small-button review-delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";
    actions.append(editButton, deleteButton);
    review.append(authorLine, actions, body);
  } else {
    review.append(authorLine, body);
  }

  return review;
}

async function saveReview({
  movieId,
  reviewId,
  content
}) {
  const payload = { content };

  if (reviewId) {
    const reviewData = await updateReview(
      movieId,
      reviewId,
      payload
    );

    return { type: "update", reviewData };
  }

  const reviewData = await createReview(
    movieId,
    payload
  );

  return { type: "create", reviewData };
}

export function initializeReview({
  reviewId,
  onReviewCountChange
}) {
  const reviewForm = document.getElementById("review-form");
  const reviewInput = document.getElementById("review-input");
  const reviewSubmitButton = document.getElementById(
    "review-submit-button"
  );
  const reviewList = document.getElementById("review-list");
  const reviewDeleteDialog = document.getElementById(
    "review-delete-dialog"
  );
  const reviewDeleteConfirmButton = document.getElementById(
    "review-delete-confirm-button"
  );

  let editingReview = null;
  let deletingReview = null;

  function updateButtonState() {
    reviewSubmitButton.disabled = reviewInput.value.trim() === "";
  }

  function resetForm() {
    editingReview = null;
    reviewInput.value = "";
    reviewSubmitButton.textContent = "리뷰 등록";
    updateButtonState();
  }

  function renderReviewList(reviews) {
    reviewList.replaceChildren(
      ...reviews.map(createReviewElement)
    );
  }

  function renderSavedReview(result, content) {
    const reviewData = result.reviewData;

    if (result.type === "create") {
      reviewList.append(createReviewElement(reviewData));
      onReviewCountChange(1);
      return;
    }

    if (reviewData?.reviewId) {
      editingReview.replaceWith(createReviewElement(reviewData));
      return;
    }

    editingReview.querySelector(
      ".review-item__body"
    ).textContent = content;
  }

  async function loadReviews() {
    try {
      const response = await getReviews(reviewId);
      renderReviewList(getReviewList(response));
    } catch (error) {
      reviewList.textContent = error.message;
    }
  }

async function handleReviewSubmit(event) {
    event.preventDefault();

    const content = reviewInput.value.trim();

    if (content === "") {
      updateButtonState();
      return;
    }

    reviewSubmitButton.disabled = true;

    try {
      const result = await saveReview({
        movieId: reviewId,
        reviewId: editingReview?.dataset.reviewId,
        content
      });

      const responseData = result.reviewData;

      if (responseData) {
        renderReviewList(getReviewList(responseData));
        
        if (responseData.reviewCount !== undefined) {
          onReviewCountChange(responseData.reviewCount - parseInt(document.getElementById('review-count')?.innerText || 0)); 
        }
      }

      resetForm();
    } catch (error) {
      window.alert(error.message);
    } finally {
      updateButtonState();
    }
  }

  function handleReviewListClick(event) {
    const editButton = event.target.closest(".review-edit-button");
    const deleteButton = event.target.closest(".review-delete-button");
    const review = event.target.closest(".review-item");

    if (editButton && review) {
      editingReview = review;
      reviewInput.value = review
        .querySelector(".review-item__body")
        .textContent.trim();
      reviewSubmitButton.textContent = "리뷰 수정";
      updateButtonState();
      reviewInput.focus();
      return;
    }

    if (deleteButton && review) {
      deletingReview = review;
      openDialog(reviewDeleteDialog);
    }
  }

  async function handleDeleteConfirm() {
    reviewDeleteConfirmButton.disabled = true;

    try {
      await deleteReview(reviewId, deletingReview.dataset.reviewId);

      if (editingReview === deletingReview) {
        resetForm();
      }

      deletingReview.remove();
      deletingReview = null;
      onReviewCountChange(-1);
      closeDialog(reviewDeleteDialog, "confirm");
    } catch (error) {
      window.alert(error.message);
    } finally {
      reviewDeleteConfirmButton.disabled = false;
    }
  }

  function handleDialogCloseClick(event) {
    closeDialog(reviewDeleteDialog, event.currentTarget.value);
  }

  function handleDialogClose() {
    if (!document.querySelector("dialog[open]")) {
      document.body.classList.remove("modal-open");
    }

    deletingReview = null;
  }

  const closeButtons = Array.from(
    reviewDeleteDialog.querySelectorAll("[data-dialog-close]")
  );

  reviewInput.addEventListener("input", updateButtonState);
  reviewForm.addEventListener("submit", handleReviewSubmit);
  reviewList.addEventListener("click", handleReviewListClick);
  reviewDeleteConfirmButton.addEventListener(
    "click",
    handleDeleteConfirm
  );
  closeButtons.forEach(function(closeButton) {
    closeButton.addEventListener("click", handleDialogCloseClick);
  });
  reviewDeleteDialog.addEventListener("close", handleDialogClose);

  updateButtonState();
  loadReviews();

  return function removeReviewEvents() {
    reviewInput.removeEventListener("input", updateButtonState);
    reviewForm.removeEventListener("submit", handleReviewSubmit);
    reviewList.removeEventListener("click", handleReviewListClick);
    reviewDeleteConfirmButton.removeEventListener(
      "click",
      handleDeleteConfirm
    );
    closeButtons.forEach(function(closeButton) {
      closeButton.removeEventListener("click", handleDialogCloseClick);
    });
    reviewDeleteDialog.removeEventListener("close", handleDialogClose);
  };
}
