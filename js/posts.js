function formatPostCount(value) {
  const count = Number(value);

  if (!Number.isFinite(count) || count < 0) {
    return "0";
  }

  const integerCount = Math.floor(count);

  if (integerCount < 1000) {
    return String(integerCount);
  }

  const countInThousands = Math.floor(integerCount / 100) / 10;
  return `${countInThousands.toFixed(1).replace(".0", "")}k`;
}

function renderPostCounts(root = document) {
  const countElements = root.querySelectorAll("[data-post-count]");

  countElements.forEach(function(countElement) {
    countElement.textContent = formatPostCount(countElement.dataset.postCount);
  });
}

renderPostCounts();
