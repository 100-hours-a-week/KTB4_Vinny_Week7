import { deletePost, getPost, likePost } from "./api/post.js";
import { initializeComment } from "./comment.js";
import { formatCount } from "./utils/format.js";
import { closeDialog, openDialog } from "./common/ui.js";
import { getPostIdFromUrl } from "./utils/url.js";

const postTitle = document.getElementById("post-title");
const postAuthorAvatar = document.getElementById("post-author-avatar");
const postAuthorName = document.getElementById("post-author-name");
const postCreatedAt = document.getElementById("post-created-at");
const postActions = document.getElementById("post-actions");
const postEditLink = document.getElementById("post-edit-link");
const postImages = document.getElementById("post-images");
const postContent = document.getElementById("post-content");
const postDeleteButton = document.getElementById("post-delete-button");
const postDeleteDialog = document.getElementById("post-delete-dialog");
const postDeleteConfirmButton = document.getElementById(
  "post-delete-confirm-button"
);
const likeButton = document.getElementById("like-button");
const likeCount = document.getElementById("like-count");
const viewCount = document.getElementById("view-count");
const commentCount = document.getElementById("comment-count");

const postId = getPostIdFromUrl();

function renderPostCount(countElement) {
  countElement.textContent = formatCount(
    countElement.dataset.postCount
  );
}

function setPostCount(countElement, count) {
  countElement.dataset.postCount = String(count ?? 0);
  renderPostCount(countElement);
}

function changeCount(countElement, delta) {
  const currentCount = Number(countElement.dataset.postCount);
  setPostCount(countElement, Math.max(0, currentCount + delta));
}

function setLikeState(isLiked) {
  const isActive = isLiked === true;

  likeButton.classList.toggle("is-liked", isActive);
  likeButton.setAttribute("aria-pressed", String(isActive));
  likeCount.classList.toggle("is-liked", isActive);
  likeCount.setAttribute("aria-pressed", String(isActive));
}

function renderPostImages(images) {
  postImages.replaceChildren();

  images.forEach(function(imageUrl) {
    const imageFrame = document.createElement("div");
    const image = document.createElement("img");
    const fallbackText = document.createElement("span");

    imageFrame.className = "post-detail__image-frame";
    image.className = "post-detail__image";
    image.alt = "게시글 이미지";
    fallbackText.className = "post-detail__image-fallback";
    fallbackText.textContent = "이미지를 불러올 수 없습니다.";

    image.addEventListener("error", function() {
      imageFrame.classList.add("is-error");
      image.remove();
    });

    imageFrame.append(image, fallbackText);
    postImages.append(imageFrame);

    const normalizedImageUrl =
      typeof imageUrl === "string" ? imageUrl.trim() : "";

    if (normalizedImageUrl) {
      image.src = normalizedImageUrl;
    } else {
      imageFrame.classList.add("is-error");
      image.remove();
    }
  });
}

function renderPost(post, postId) {
  const isOwner = Boolean(post.isOwner);

  postTitle.textContent = post.title || "";
  postContent.textContent = post.content || "";
  postAuthorName.textContent = post.author?.nickname || "알 수 없는 사용자";
  postCreatedAt.textContent = post.createdAt || "";
  postActions.hidden = !isOwner;
  postEditLink.href =
    `./post-edit.html?postId=${encodeURIComponent(post.postId ?? postId)}`;

  if (post.author?.profileImageUrl) {
    postAuthorAvatar.style.backgroundImage =
      `url("${post.author.profileImageUrl}")`;
    postAuthorAvatar.style.backgroundPosition = "center";
    postAuthorAvatar.style.backgroundSize = "cover";
  }

  renderPostImages(Array.isArray(post.images) ? post.images : []);
  setLikeState(post.isLiked === true || post.likes === true);
  setPostCount(likeCount, post.likeCount);
  setPostCount(viewCount, post.viewCount);
  setPostCount(commentCount, post.commentCount);
  document.title = `${post.title} | 아무 말 대잔치`;
}

async function getPostDetail() {

  if (!postId) {
    window.alert("게시글 정보를 확인해주세요.");
    window.location.href = "./posts.html";
    return;
  }

  try {
    renderPost(await getPost(postId), postId);
  } catch (error) {
    postTitle.textContent = error.message;
  }
}

async function handleLikeClick() {

  if (!postId) {
    window.alert("게시글 정보를 확인해주세요.");
    return;
  }

  likeButton.disabled = true;

  try {
    const response = await likePost(postId);
    const isLiked = response?.isLiked ?? response?.likes === true;

    setLikeState(isLiked);
    changeCount(likeCount, isLiked ? 1 : -1);
  } catch (error) {
    window.alert(error.message);
  } finally {
    likeButton.disabled = false;
  }
}

function handlePostDeleteClick() {
  openDialog(postDeleteDialog);
}

async function handlePostDeleteConfirm() {

  if (!postId) {
    window.alert("게시글 정보를 확인해주세요.");
    window.location.href = "./posts.html";
    return;
  }

  postDeleteConfirmButton.disabled = true;

  try {
    await deletePost(postId);
    closeDialog(postDeleteDialog, "confirm");
    window.alert("게시글이 삭제되었습니다.");
    window.location.href = "./posts.html";
  } catch (error) {
    postDeleteConfirmButton.disabled = false;
    window.alert(error.message);
  }
}

function handlePostDeleteDialogClose() {
  if (!document.querySelector("dialog[open]")) {
    document.body.classList.remove("modal-open");
  }
}

likeButton.addEventListener("click", handleLikeClick);
postDeleteButton.addEventListener("click", handlePostDeleteClick);
postDeleteConfirmButton.addEventListener(
  "click",
  handlePostDeleteConfirm
);

postDeleteDialog
  .querySelectorAll("[data-dialog-close]")
  .forEach(function(closeButton) {
    closeButton.addEventListener("click", function() {
      closeDialog(postDeleteDialog, closeButton.value);
    });
  });

postDeleteDialog.addEventListener("close", handlePostDeleteDialogClose);

getPostDetail();

if (postId) {
  initializeComment({
    postId,
    onCommentCountChange(delta) {
      changeCount(commentCount, delta);
    }
  });
}
