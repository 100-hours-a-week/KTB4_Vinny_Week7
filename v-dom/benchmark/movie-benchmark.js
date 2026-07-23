import { movies } from "../../js/data/movies.js";
import { patch } from "../patch.js";
import { mount } from "../render.js";
import { createVNode as h } from "../vnode.js";

const ROUND_COUNT = 30;
const itemCountSelect = document.getElementById("item-count");
const status = document.getElementById("benchmark-status");
const mountTarget = document.getElementById("mount-target");
const patchTarget = document.getElementById("patch-target");
const operationButtons = Array.from(
  document.querySelectorAll("[data-operation]")
);

function createMovieItems(count) {
  return Array.from({ length: count }, (_, index) => {
    const movie = movies[index % movies.length];

    return {
      ...movie,
      movieId: `${movie.movieId}-${index}`,
      benchmarkIndex: index
    };
  });
}

function createMovieListVNode(movieItems) {
  return h(
    "div",
    { class: "benchmark-movie-grid__inner" },
    movieItems.map((movie) =>
      h(
        "article",
        {
          key: movie.movieId,
          class: "benchmark-movie-card",
          "data-movie-id": movie.movieId
        },
        h("strong", null, movie.title),
        h(
          "span",
          null,
          `${movie.releaseYear} · ${movie.genre} · #${movie.benchmarkIndex}`
        )
      )
    )
  );
}

function applyOperation(movieItems, operation) {
  if (operation === "update") {
    const middleIndex = Math.floor(movieItems.length / 2);

    return movieItems.map((movie, index) =>
      index === middleIndex
        ? { ...movie, title: `${movie.title} (수정됨)` }
        : movie
    );
  }

  if (operation === "rotate") {
    return [...movieItems.slice(1), movieItems[0]];
  }

  if (operation === "reverse") {
    return [...movieItems].reverse();
  }

  if (operation === "remove") {
    return movieItems.slice(Math.floor(movieItems.length * 0.2));
  }

  throw new Error(`지원하지 않는 작업입니다: ${operation}`);
}

function countNodeTree(node) {
  let count = 1;

  node.childNodes.forEach((child) => {
    count += countNodeTree(child);
  });

  return count;
}

function countMutations(records) {
  return records.reduce((count, record) => {
    if (record.type === "childList") {
      const changedNodes = [
        ...record.addedNodes,
        ...record.removedNodes
      ];

      return count + changedNodes.reduce(
        (nodeCount, node) => nodeCount + countNodeTree(node),
        0
      );
    }

    return count + 1;
  }, 0);
}

async function measureRender(render) {
  let mutationCount = 0;
  const observer = new MutationObserver((records) => {
    mutationCount += countMutations(records);
  });

  observer.observe(render.target, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true
  });

  const startedAt = performance.now();
  render.run();
  const duration = performance.now() - startedAt;

  await Promise.resolve();
  mutationCount += countMutations(observer.takeRecords());
  observer.disconnect();

  return { duration, mutationCount };
}

function getSummary(measurements) {
  const durations = measurements
    .map((measurement) => measurement.duration)
    .sort((a, b) => a - b);
  const mutationAverage = measurements.reduce(
    (total, measurement) => total + measurement.mutationCount,
    0
  ) / measurements.length;

  return {
    median: durations[Math.floor(durations.length * 0.5)],
    p95: durations[Math.ceil(durations.length * 0.95) - 1],
    mutations: mutationAverage
  };
}

async function runMountBenchmark(initialItems, nextItems) {
  const measurements = [];
  const nextVNode = createMovieListVNode(nextItems);

  for (let round = 0; round < ROUND_COUNT; round += 1) {
    mount(createMovieListVNode(initialItems), mountTarget);
    measurements.push(await measureRender({
      target: mountTarget,
      run() {
        mount(nextVNode, mountTarget);
      }
    }));
  }

  return getSummary(measurements);
}

async function runPatchBenchmark(initialItems, nextItems) {
  const measurements = [];
  const initialVNode = createMovieListVNode(initialItems);
  const nextVNode = createMovieListVNode(nextItems);

  for (let round = 0; round < ROUND_COUNT; round += 1) {
    mount(initialVNode, patchTarget);
    measurements.push(await measureRender({
      target: patchTarget,
      run() {
        patch(patchTarget, nextVNode, initialVNode);
      }
    }));
  }

  return getSummary(measurements);
}

function renderSummary(prefix, summary) {
  document.getElementById(`${prefix}-median`).textContent =
    `${summary.median.toFixed(3)} ms`;
  document.getElementById(`${prefix}-p95`).textContent =
    `${summary.p95.toFixed(3)} ms`;
  document.getElementById(`${prefix}-mutations`).textContent =
    `${summary.mutations.toFixed(1)}개`;
}

function setRunningState(isRunning) {
  operationButtons.forEach((button) => {
    button.disabled = isRunning;
  });
  itemCountSelect.disabled = isRunning;
}

async function runComparison(operation) {
  const itemCount = Number(itemCountSelect.value);
  const initialItems = createMovieItems(itemCount);
  const nextItems = applyOperation(initialItems, operation);

  setRunningState(true);
  status.textContent =
    `${itemCount.toLocaleString("ko-KR")}개 영화로 비교하고 있습니다…`;

  try {
    const initialVNode = createMovieListVNode(initialItems);
    const nextVNode = createMovieListVNode(nextItems);

    mount(initialVNode, mountTarget);
    mount(nextVNode, mountTarget);
    mount(initialVNode, patchTarget);
    patch(patchTarget, nextVNode, initialVNode);

    await new Promise(requestAnimationFrame);
    const mountSummary = await runMountBenchmark(initialItems, nextItems);
    await new Promise(requestAnimationFrame);
    const patchSummary = await runPatchBenchmark(initialItems, nextItems);

    renderSummary("mount", mountSummary);
    renderSummary("patch", patchSummary);
    status.textContent =
      `${ROUND_COUNT}회 측정이 완료되었습니다. 중앙값과 DOM 변경량을 비교해보세요.`;
  } catch (error) {
    status.textContent = `측정 실패: ${error.message}`;
  } finally {
    setRunningState(false);
  }
}

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    runComparison(button.dataset.operation);
  });
});

const initialItems = createMovieItems(Number(itemCountSelect.value));
mount(createMovieListVNode(initialItems), mountTarget);
mount(createMovieListVNode(initialItems), patchTarget);
