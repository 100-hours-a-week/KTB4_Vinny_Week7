import { getPost, updatePost } from "./api/post.js";
import { setupPostForm } from "./post-form.js";
import { setHelperText } from "./common/ui.js";
import { getPostIdFromUrl } from "./utils/url.js";

const postForm = document.getElementById("post-edit-form");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const imageInput = document.getElementById("image");
const helperText = document.getElementById("post-edit-helper-text");
const submitButton = document.getElementById("post-edit-button");

function createPostUpdatePayload(title, content, images) {
  return { title, content, images };
}

const postFormController = setupPostForm({
  form: postForm,
  titleInput,
  contentInput,
  helper: helperText,
  submitButton,
  async onSubmit() {
    const postId = getPostIdFromUrl();

    if (!postId) {
      setHelperText(helperText, "* 게시글 정보를 확인해주세요.");
      return;
    }

    try {
      await updatePost(
        postId,
        createPostUpdatePayload(
          titleInput.value,
          contentInput.value,
          Array.from(imageInput.files)
        )
      );
      window.location.href =
        `./post-detail.html?postId=${encodeURIComponent(postId)}`;
    } catch (error) {
      setHelperText(helperText, error.message);
    }
  }
});

async function getPostForEdit() {
  const postId = getPostIdFromUrl();

  if (!postId) {
    setHelperText(helperText, "* 게시글 정보를 확인해주세요.");
    return;
  }

  try {
    const post = await getPost(postId);
    titleInput.value = post.title || "";
    contentInput.value = post.content || "";
    postFormController.updateButtonState();
  } catch (error) {
    setHelperText(helperText, error.message);
  }
}

getPostForEdit();
