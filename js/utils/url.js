export function getPostIdFromUrl() {
  return new URLSearchParams(window.location.search).get("postId");
}