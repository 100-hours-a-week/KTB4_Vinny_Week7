import { getAuth } from "./auth-storage.js";
import { getFullImageUrl, setBackgroundImage } from "../utils/image.js";

function getProfileImageUrl(authSession) {
  return getFullImageUrl(authSession?.profileImage || "");
}

function renderProfileAvatar(header, authSession) {
  const avatar = header.querySelector(".avatar");
  const profileImage = getProfileImageUrl(authSession);

  if (!avatar) {
    return;
  }

  setBackgroundImage(avatar, profileImage);
}

function createHeader(element) {
  const showProfile = element.hasAttribute("show-profile");
  const isMovieHeader = element.hasAttribute("movie-header");
  const loginLink = element.getAttribute("login-link");
  const authSession = getAuth();
  const shouldShowProfile = showProfile || Boolean(loginLink && authSession);
  const header = document.createElement("header");
  const title = '<a class="site-header__title" href="./movies.html">CINEON</a>';
  const profileMenu = shouldShowProfile
    ? `
      <div class="profile-menu">
        <a class="icon-button" href="./user-profile-edit.html" aria-label="회원정보 관리로 이동">
          <span class="avatar"></span>
        </a>
      </div>
    `
    : loginLink
      ? `<a class="site-header__login btn btn--primary btn--rounded" href="${loginLink}">로그인</a>`
      : "<div></div>";

  if (isMovieHeader) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="site-header__inner site-header__inner--movie">
        ${title}
        ${profileMenu}
      </div>
    `;

    renderProfileAvatar(header, authSession);

    return header;
  }

  header.className = "site-header";
  header.innerHTML = `
    <div class="site-header__inner">
      ${title}
      ${profileMenu}
    </div>
  `;

  renderProfileAvatar(header, authSession);

  return header;
}

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const header = createHeader(this);

    this.replaceWith(header);
  }
}

customElements.define("site-header", SiteHeader);
