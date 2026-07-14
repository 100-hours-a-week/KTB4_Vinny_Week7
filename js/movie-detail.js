import { closeDialog, openDialog } from "./common/ui.js";
import { featuredMovie, movies, reviews } from "./data/movies.js";

const movieItems = [featuredMovie, ...movies];
const movieById = new Map(
  movieItems.map(function(movie) {
    return [movie.movieId, movie];
  })
);

const breadcrumbMovieTitle = document.getElementById("breadcrumb-movie-title");
const detailHero = document.getElementById("movie-detail-hero");
const moviePoster = document.getElementById("movie-poster");
const movieTitle = document.getElementById("movie-title");
const movieMeta = document.getElementById("movie-meta");
const movieRating = document.getElementById("movie-rating");
const movieRatingCount = document.getElementById("movie-rating-count");
const movieDescription = document.getElementById("movie-description");
const ratingStars = document.getElementById("rating-stars");
const ratingHelper = document.getElementById("rating-helper");
const reviewForm = document.getElementById("review-form");
const reviewFormTitle = document.getElementById("review-form-title");
const reviewInput = document.getElementById("review-input");
const reviewCount = document.getElementById("review-count");
const reviewSubmitButton = document.getElementById("review-submit-button");
const movieReviewCount = document.getElementById("movie-review-count");
const movieReviewList = document.getElementById("movie-review-list");
const reviewDeleteDialog = document.getElementById("review-delete-dialog");
const reviewDeleteConfirmButton = document.getElementById(
  "review-delete-confirm-button"
);

let selectedRating = 0;
let editingReviewId = null;
let deletingReviewId = null;
let currentMovieReviews = [];

function getMovieIdFromUrl() {
  return new URLSearchParams(window.location.search).get("movieId");
}

function formatNumber(value) {
  return Number(value ?? 0).toLocaleString("ko-KR");
}

function getCurrentMovie() {
  const movieId = getMovieIdFromUrl();

  return movieById.get(movieId) || featuredMovie;
}

function createStarText(rating) {
  const fullStarCount = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStarCount = 5 - fullStarCount - (hasHalfStar ? 1 : 0);

  return "★".repeat(fullStarCount) +
    (hasHalfStar ? "★" : "") +
    "☆".repeat(emptyStarCount);
}

function getMovieReviews(movie) {
  const matchedReviews = reviews.filter(function(review) {
    return review.movieId === movie.movieId;
  });

  return matchedReviews.length > 1 ? matchedReviews : reviews;
}

function renderMovie(movie) {
  breadcrumbMovieTitle.textContent = movie.title;
  moviePoster.src = movie.posterUrl;
  moviePoster.alt = `${movie.title} 포스터`;
  movieTitle.textContent = movie.title;
  movieMeta.textContent = `${movie.releaseYear} · ${movie.genre} · ${movie.runtime}`;
  movieRating.textContent = movie.rating.toFixed(1);
  movieRatingCount.textContent = `(평점 ${formatNumber(movie.ratingCount)}명)`;
  movieDescription.textContent = movie.description;
  detailHero.style.backgroundImage =
    `linear-gradient(90deg, rgba(8, 14, 24, .96), rgba(8, 14, 24, .68) 50%, rgba(8, 14, 24, .18)), url("${movie.backdropUrl}")`;
  document.title = `${movie.title} | CINEON`;
}

function renderRatingStars(rating) {
  ratingStars.querySelectorAll("button").forEach(function(button) {
    const buttonRating = Number(button.dataset.rating);
    const isActive = buttonRating <= rating;

    button.textContent = isActive ? "★" : "☆";
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-checked", String(buttonRating === rating));
  });

  ratingHelper.textContent = rating > 0
    ? `${rating}점을 선택했어요`
    : "별점을 선택해주세요 (클릭)";
}

function createReviewElement(review) {
  const item = document.createElement("article");
  const profile = document.createElement("div");
  const avatar = document.createElement("img");
  const user = document.createElement("div");
  const nickname = document.createElement("strong");
  const rating = document.createElement("span");
  const content = document.createElement("p");
  const footer = document.createElement("p");
  const actionMenu = document.createElement("div");
  const moreButton = document.createElement("button");
  const menuPanel = document.createElement("div");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  item.className = "movie-review-item";
  profile.className = "movie-review-item__profile";
  avatar.src = review.avatarUrl;
  avatar.alt = `${review.nickname} 프로필`;
  avatar.loading = "lazy";
  user.className = "movie-review-item__user";
  nickname.textContent = review.nickname;
  rating.className = "movie-review-item__stars";
  rating.textContent = `${createStarText(review.rating)} ${review.rating.toFixed(1)}`;
  user.append(nickname, rating);
  profile.append(avatar, user);

  content.className = "movie-review-item__content";
  content.textContent = review.content;

  footer.className = "movie-review-item__footer";
  footer.textContent =
    `${review.createdAt}`;

  actionMenu.className = "movie-review-item__actions";
  moreButton.className = "movie-review-item__more";
  moreButton.type = "button";
  moreButton.setAttribute("aria-label", "리뷰 더보기");
  moreButton.setAttribute("aria-expanded", "false");
  moreButton.textContent = "···";

  menuPanel.className = "movie-review-item__menu";
  editButton.type = "button";
  editButton.dataset.reviewEdit = review.reviewId;
  editButton.textContent = "수정";
  deleteButton.type = "button";
  deleteButton.dataset.reviewDelete = review.reviewId;
  deleteButton.textContent = "삭제";
  menuPanel.append(editButton, deleteButton);
  actionMenu.append(moreButton, menuPanel);

  item.append(profile, content, actionMenu, footer);

  return item;
}

function renderReviews(movie) {
  currentMovieReviews = getMovieReviews(movie);

  movieReviewCount.textContent =
    `${formatNumber(movie.reviewCount ?? currentMovieReviews.length)}개`;
  movieReviewList.replaceChildren(
    ...currentMovieReviews.map(createReviewElement)
  );
}

function handleRatingClick(event) {
  const ratingButton = event.target.closest("[data-rating]");

  if (!ratingButton) {
    return;
  }

  selectedRating = Number(ratingButton.dataset.rating);
  renderRatingStars(selectedRating);
}

function updateReviewCount() {
  reviewCount.textContent = `${reviewInput.value.length}/500`;
}

function handleReviewSubmit(event) {
  event.preventDefault();

  if (selectedRating === 0) {
    ratingHelper.textContent = "리뷰를 등록하려면 별점을 먼저 선택해주세요.";
    return;
  }

  if (reviewInput.value.trim() === "") {
    reviewInput.focus();
    return;
  }

  window.alert(
    editingReviewId
      ? "더미 화면이라 리뷰 수정은 저장되지 않습니다."
      : "더미 화면이라 리뷰는 저장되지 않습니다."
  );
  reviewInput.value = "";
  selectedRating = 0;
  editingReviewId = null;
  reviewFormTitle.textContent = "리뷰 작성하기";
  reviewSubmitButton.textContent = "리뷰 등록";
  updateReviewCount();
  renderRatingStars(selectedRating);
}

function startReviewEdit(reviewId) {
  const review = currentMovieReviews.find(function(reviewItem) {
    return reviewItem.reviewId === reviewId;
  });

  if (!review) {
    return;
  }

  editingReviewId = review.reviewId;
  selectedRating = Math.round(review.rating);
  reviewInput.value = review.content;
  reviewFormTitle.textContent = "리뷰 수정하기";
  reviewSubmitButton.textContent = "수정 완료";
  ratingHelper.textContent = `${selectedRating}점을 수정 중이에요`;
  renderRatingStars(selectedRating);
  updateReviewCount();
  reviewForm.scrollIntoView({ behavior: "smooth", block: "center" });
  reviewInput.focus({ preventScroll: true });
}

function closeReviewMenus() {
  movieReviewList
    .querySelectorAll(".movie-review-item__actions.is-open")
    .forEach(function(actionMenu) {
      const toggleButton = actionMenu.querySelector(".movie-review-item__more");

      actionMenu.classList.remove("is-open");
      toggleButton?.setAttribute("aria-expanded", "false");
    });
}

function handleReviewListClick(event) {
  const moreButton = event.target.closest(".movie-review-item__more");
  const editButton = event.target.closest("[data-review-edit]");
  const deleteButton = event.target.closest("[data-review-delete]");

  if (moreButton) {
    const actionMenu = moreButton.closest(".movie-review-item__actions");
    const shouldOpen = !actionMenu.classList.contains("is-open");

    closeReviewMenus();
    actionMenu.classList.toggle("is-open", shouldOpen);
    moreButton.setAttribute("aria-expanded", String(shouldOpen));
    return;
  }

  if (editButton) {
    closeReviewMenus();
    startReviewEdit(editButton.dataset.reviewEdit);
    return;
  }

  if (deleteButton) {
    closeReviewMenus();
    deletingReviewId = deleteButton.dataset.reviewDelete;
    openDialog(reviewDeleteDialog);
  }
}

function handleReviewDeleteConfirm() {
  if (!deletingReviewId) {
    closeDialog(reviewDeleteDialog, "cancel");
    return;
  }

  currentMovieReviews = currentMovieReviews.filter(function(review) {
    return review.reviewId !== deletingReviewId;
  });
  movieReviewCount.textContent = `${formatNumber(currentMovieReviews.length)}개`;
  movieReviewList.replaceChildren(
    ...currentMovieReviews.map(createReviewElement)
  );
  deletingReviewId = null;
  closeDialog(reviewDeleteDialog, "confirm");
}

function handleReviewDeleteCancel(event) {
  deletingReviewId = null;
  closeDialog(reviewDeleteDialog, event.currentTarget.value);
}

function handleReviewDeleteDialogClose() {
  deletingReviewId = null;
  document.body.classList.remove("modal-open");
}

function handleDocumentClick(event) {
  if (!event.target.closest(".movie-review-item__actions")) {
    closeReviewMenus();
  }
}

function handleDocumentKeydown(event) {
  if (event.key === "Escape") {
    closeReviewMenus();
  }
}

const currentMovie = getCurrentMovie();

renderMovie(currentMovie);
renderReviews(currentMovie);
renderRatingStars(selectedRating);
updateReviewCount();

ratingStars.addEventListener("click", handleRatingClick);
reviewInput.addEventListener("input", updateReviewCount);
reviewForm.addEventListener("submit", handleReviewSubmit);
movieReviewList.addEventListener("click", handleReviewListClick);
document.addEventListener("click", handleDocumentClick);
document.addEventListener("keydown", handleDocumentKeydown);
reviewDeleteConfirmButton.addEventListener("click", handleReviewDeleteConfirm);
reviewDeleteDialog
  .querySelectorAll("[data-dialog-close]")
  .forEach(function(closeButton) {
    closeButton.addEventListener("click", handleReviewDeleteCancel);
  });
reviewDeleteDialog.addEventListener("close", handleReviewDeleteDialogClose);
