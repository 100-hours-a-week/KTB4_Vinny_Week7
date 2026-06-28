import { getPosts } from "./api/post.js";
import { formatPostCount } from "./utils/formatters.js";

const postList = document.querySelector(".post-list");

function createCountText(label, count) {
  const fragment = document.createDocumentFragment();
  const countElement = document.createElement("span");

  fragment.append(`${label} `);
  countElement.textContent = formatPostCount(count);
  fragment.append(countElement);

  return fragment;
}

function createPostCard(post) {
  const card = document.createElement("a");
  const body = document.createElement("div");
  const title = document.createElement("h2");
  const meta = document.createElement("div");
  const counts = document.createElement("span");
  const createdAt = document.createElement("time");
  const footer = document.createElement("div");
  const avatar = document.createElement("span");

  card.className = "post-card";
  card.href =
    `./post-detail.html?postId=${encodeURIComponent(post.postId)}`;

  body.className = "post-card__body";
  title.className = "post-card__title";
  title.textContent = post.title;

  meta.className = "post-card__meta";
  counts.append(
    createCountText("좋아요", post.likeCount),
    "\u00a0\u00a0",
    createCountText("댓글", post.commentCount),
    "\u00a0\u00a0",
    createCountText("조회수", post.viewCount)
  );

  createdAt.dateTime = post.createdAt;
  createdAt.textContent = post.createdAt;
  meta.append(counts, createdAt);
  body.append(title, meta);

  footer.className = "post-card__footer";
  avatar.className = "tiny-avatar";

  if (post.author?.profileImageUrl) {
    avatar.style.backgroundImage =
      `url("${post.author.profileImageUrl}")`;
    avatar.style.backgroundPosition = "center";
    avatar.style.backgroundSize = "cover";
  }

  footer.append(avatar, post.author?.nickname || "알 수 없는 사용자");
  card.append(body, footer);

  return card;
}

function renderPostList(posts) {
  postList.replaceChildren();

  if (posts.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "";
    postList.append(emptyMessage);
    return;
  }

  postList.append(...posts.map(createPostCard));
}

async function loadPosts() {
  try {
    const posts = await getPosts();

    if (!Array.isArray(posts)) {
      throw new Error("게시글 목록 응답 형식이 올바르지 않습니다.");
    }

    renderPostList(posts);
  } catch (error) {
    postList.replaceChildren();

    const errorMessage = document.createElement("p");
    errorMessage.textContent = error.message;
    postList.append(errorMessage);
  }
}

loadPosts();
