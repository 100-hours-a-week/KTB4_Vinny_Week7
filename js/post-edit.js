import { setupPostForm } from "./shared/post-form.js";

setupPostForm({
  form: document.getElementById("post-edit-form"),
  titleInput: document.getElementById("title"),
  contentInput: document.getElementById("content"),
  helper: document.getElementById("post-edit-helper-text"),
  submitButton: document.getElementById("post-edit-button"),
  onSubmit() {
    window.location.href = "./post-detail.html";
  }
});
