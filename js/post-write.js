import { createPost } from "./api/post.js";
import { getAuthenticatedUserId } from "./shared/auth-session.js";
import { setupPostForm } from "./shared/post-form.js";
import { setHelperText } from "./utils/ui.js";

const postForm = document.getElementById("post-write-form");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const imageInput = document.getElementById("image");
const helperText = document.getElementById("post-write-helper-text");
const submitButton = document.getElementById("post-write-button");

function createPostPayload(title, content, images) {
  return { title, content, images };
}

function getSelectedImages() {
  return Array.from(imageInput.files);
}

setupPostForm({
  form: postForm,
  titleInput,
  contentInput,
  helper: helperText,
  submitButton,
  async onSubmit() {
    const userId = getAuthenticatedUserId();

    if (!userId) {
      window.alert("로그인 정보를 확인해주세요.");
      return;
    }

    try {
      const images = getSelectedImages();
      const createdPost = await createPost(
        userId,
        createPostPayload(
          titleInput.value,
          contentInput.value,
          images
        )
      );

      window.location.href = createdPost?.postId
        ? `./post-detail.html?postId=${encodeURIComponent(createdPost.postId)}`
        : "./posts.html";
    } catch (error) {
      setHelperText(helperText, error.message);
    }
  }
});
