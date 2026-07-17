import { movies } from "./data/movies.js";

const hero = document.getElementById("featured-movie");
const movieList = document.getElementById("movie-list");
const reviewList = document.getElementById("review-list");
const movieHome = document.querySelector(".movie-home");
const movieSectionTitle = document.getElementById("popular-movies-title");
const movieSectionMore = document.querySelector(".movie-section__more");
const searchParams = new URLSearchParams(window.location.search);
const isAllMoviesView = searchParams.get("view") === "all";
const heroMovies = movies.slice(0, 5);
const mainMovies = movies.slice(5, 10);
const pageMovies = isAllMoviesView ? movies : mainMovies;
const movieById = new Map([
  ...movies.map(function(movie) {
    return [movie.movieId, movie];
  })
]);

let activeHeroIndex = 0;
let heroStartX = 0;
let heroPointerId = null;
let heroAutoplayId = null;

function createStarRating(rating) {
  const ratingElement = document.createElement("span");
  ratingElement.className = "movie-rating";
  ratingElement.setAttribute("aria-label", `평점 ${rating}`);
  ratingElement.textContent = "★";
  ratingElement.append(` ${rating.toFixed(1)}`);

  return ratingElement;
}

function renderHero(movie) {
  hero.style.backgroundImage =
    `linear-gradient(90deg, rgba(8, 14, 24, .9), rgba(8, 14, 24, .56) 52%, rgba(8, 14, 24, .08)), url("${movie.backdropUrl}")`;
  hero.innerHTML = `
    <div class="movie-hero__content" aria-live="polite">
      <p class="movie-hero__eyebrow">추천 영화</p>
      <h1 class="movie-hero__title">${movie.title}</h1>
      <p class="movie-hero__meta">${movie.originalTitle} · ${movie.releaseYear}</p>
      <p class="movie-hero__description">${movie.description}</p>
      <a class="movie-hero__button" href="./movie-detail.html?movieId=${encodeURIComponent(movie.movieId)}">자세히 보기 <span aria-hidden="true">▶</span></a>
    </div>
    <button class="movie-hero__control movie-hero__control--prev" type="button" data-hero-direction="-1" aria-label="이전 추천 영화">‹</button>
    <button class="movie-hero__control movie-hero__control--next" type="button" data-hero-direction="1" aria-label="다음 추천 영화">›</button>
    <div class="movie-hero__dots" aria-label="추천 영화 슬라이드">
      ${heroMovies.map(function(heroMovie, index) {
        return `
          <button
            class="${index === activeHeroIndex ? "is-active" : ""}"
            type="button"
            data-hero-index="${index}"
            aria-label="${heroMovie.title} 보기"
            aria-current="${index === activeHeroIndex ? "true" : "false"}"></button>
        `;
      }).join("")}
    </div>
  `;
}

function getNextHeroIndex(direction) {
  return (activeHeroIndex + direction + heroMovies.length) % heroMovies.length;
}

function showHero(index) {
  activeHeroIndex = (index + heroMovies.length) % heroMovies.length;
  renderHero(heroMovies[activeHeroIndex]);
}

function restartHeroAutoplay() {
  window.clearInterval(heroAutoplayId);
  heroAutoplayId = window.setInterval(function() {
    showHero(getNextHeroIndex(1));
  }, 4000);
}

function handleHeroClick(event) {
  const directionButton = event.target.closest("[data-hero-direction]");
  const dotButton = event.target.closest("[data-hero-index]");

  if (directionButton) {
    showHero(getNextHeroIndex(Number(directionButton.dataset.heroDirection)));
    restartHeroAutoplay();
    return;
  }

  if (dotButton) {
    showHero(Number(dotButton.dataset.heroIndex));
    restartHeroAutoplay();
  }
}

function handleHeroPointerDown(event) {
  if (event.target.closest("a, button")) {
    return;
  }

  heroPointerId = event.pointerId;
  heroStartX = event.clientX;
  hero.setPointerCapture(heroPointerId);
}

function handleHeroPointerUp(event) {
  if (event.pointerId !== heroPointerId) {
    return;
  }

  const swipeDistance = event.clientX - heroStartX;

  heroPointerId = null;
  hero.releasePointerCapture(event.pointerId);

  if (Math.abs(swipeDistance) < 48) {
    return;
  }

  showHero(getNextHeroIndex(swipeDistance < 0 ? 1 : -1));
  restartHeroAutoplay();
}

function handleHeroPointerCancel(event) {
  if (event.pointerId !== heroPointerId) {
    return;
  }

  heroPointerId = null;
  hero.releasePointerCapture(event.pointerId);
}

function createMovieCard(movie) {
  const card = document.createElement("a");
  const poster = document.createElement("img");
  const info = document.createElement("div");
  const title = document.createElement("h3");

  card.className = "movie-card";
  card.href = `./movie-detail.html?movieId=${encodeURIComponent(movie.movieId)}`;
  poster.className = "movie-card__poster";
  poster.src = movie.posterUrl;
  poster.alt = `${movie.title} 포스터`;
  poster.loading = "lazy";

  info.className = "movie-card__info";
  title.className = "movie-card__title";
  title.textContent = movie.title;

  info.append(title, createStarRating(movie.rating));
  card.append(poster, info);

  return card;
}

function createReviewCard(review) {
  const movie = movieById.get(review.movieId);
  const card = document.createElement("article");
  const header = document.createElement("div");
  const avatar = document.createElement("img");
  const userInfo = document.createElement("div");
  const nickname = document.createElement("strong");
  const body = document.createElement("p");
  const moviePreview = document.createElement("div");
  const poster = document.createElement("img");
  const movieInfo = document.createElement("div");
  const movieTitle = document.createElement("strong");
  const movieYear = document.createElement("span");
  const footer = document.createElement("p");

  card.className = "review-card";
  header.className = "review-card__header";
  avatar.className = "review-card__avatar";
  avatar.src = review.avatarUrl;
  avatar.alt = `${review.nickname} 프로필`;
  avatar.loading = "lazy";
  userInfo.className = "review-card__user";
  nickname.textContent = review.nickname;
  userInfo.append(nickname, createStarRating(review.rating));
  header.append(avatar, userInfo);

  body.className = "review-card__content";
  body.textContent = review.content;

  moviePreview.className = "review-card__movie";
  poster.src = movie.posterUrl;
  poster.alt = `${movie.title} 포스터`;
  poster.loading = "lazy";
  movieTitle.textContent = movie.title;
  movieYear.textContent = movie.releaseYear;
  movieInfo.append(movieTitle, movieYear);
  moviePreview.append(poster, movieInfo);

  footer.className = "review-card__footer";
  footer.textContent =
    `${review.createdAt}`;

  card.append(header, body, moviePreview, footer);

  return card;
}

function renderMovies(movieItems) {
  movieList.replaceChildren();

  if (movieItems.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "movie-empty";
    emptyMessage.textContent = "표시할 영화가 없습니다.";
    movieList.append(emptyMessage);
    return;
  }

  movieList.append(...movieItems.map(createMovieCard));
}

function renderReviews(reviewItems) {
  if (!reviewList) {
    return;
  }
  reviewList.replaceChildren(...reviewItems.map(createReviewCard));
}

if (isAllMoviesView) {
  movieHome.classList.add("movie-home--all");
  movieSectionTitle.textContent = "전체 영화";
  movieSectionMore.hidden = true;
} else {
  showHero(activeHeroIndex);
  restartHeroAutoplay();

  hero.addEventListener("click", handleHeroClick);
  hero.addEventListener("pointerdown", handleHeroPointerDown);
  hero.addEventListener("pointerup", handleHeroPointerUp);
  hero.addEventListener("pointercancel", handleHeroPointerCancel);
  hero.addEventListener("mouseenter", function() {
    window.clearInterval(heroAutoplayId);
  });
  hero.addEventListener("mouseleave", restartHeroAutoplay);
}

renderMovies(pageMovies);
renderReviews([]);
