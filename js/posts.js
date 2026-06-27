import { formatPostCount } from "./utils/formatters.js";

function renderPostCounts(root = document) {
  const countElements = root.querySelectorAll("[data-post-count]");

  countElements.forEach(function(countElement) {
    countElement.textContent = formatPostCount(countElement.dataset.postCount);
  });
}

renderPostCounts();
