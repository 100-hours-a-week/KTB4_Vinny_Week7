import { logout } from "../api/user.js";
import { clearAuthSession, getAuth } from "./auth-storage.js";

function getProfileImageUrl(authSession) {
  return (
    authSession?.profileImageUrl ||
    authSession?.user?.profileImageUrl ||
    authSession?.userProfile?.profileImageUrl ||
    ""
  );
}

function renderProfileAvatar(header, authSession) {
  const avatar = header.querySelector(".avatar");
  const profileImageUrl = getProfileImageUrl(authSession);

  if (!avatar || !profileImageUrl) {
    return;
  }

  avatar.style.backgroundImage = `url("${profileImageUrl}")`;
}

function createHeader(element) {
  const backHref = element.getAttribute("back-href");
  const titleHref = element.getAttribute("title-href");
  const showProfile = element.hasAttribute("show-profile");
  const showSearch = element.hasAttribute("show-search");
  const loginLink = element.getAttribute("login-link");
  const authSession = getAuth();
  const shouldShowProfile = showProfile || Boolean(loginLink && authSession);
  const header = document.createElement("header");
  const title = titleHref
    ? `<a class="site-header__title" href="${titleHref}">CINEON</a>`
    : '<h1 class="site-header__title">CINEON</h1>';
  const search = showSearch
    ? `
      <label class="site-header__search">
        <span class="visually-hidden">영화 검색</span>
        <input data-movie-search type="search" placeholder="영화 제목을 검색해보세요" />
        <span aria-hidden="true">⌕</span>
      </label>
    `
    : "";
  const profileMenu = shouldShowProfile
    ? `
      <nav class="profile-menu" aria-label="프로필 메뉴">
        <button class="icon-button" type="button" aria-label="프로필 메뉴 열기">
          <span class="avatar"></span>
        </button>
        <div class="profile-menu__panel">
          <a class="profile-menu__item" href="./user-profile-edit.html">회원정보수정</a>
          <a class="profile-menu__item" href="./login.html" data-logout>로그아웃</a>
        </div>
      </nav>
    `
    : loginLink
      ? `<a class="site-header__login btn btn--primary btn--rounded" href="${loginLink}">로그인</a>`
      : "<div></div>";

  if (showSearch) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="site-header__inner site-header__inner--movie">
        ${title}
        ${search}
        ${profileMenu}
      </div>
    `;

    renderProfileAvatar(header, authSession);

    return header;
  }

  header.className = "site-header";
  header.innerHTML = `
    <div class="site-header__inner">
      ${
        backHref
          ? `<a class="icon-button" href="${backHref}" aria-label="뒤로가기"><span class="back-icon"></span></a>`
          : "<div></div>"
      }
      ${title}
      ${profileMenu}
    </div>
  `;

  renderProfileAvatar(header, authSession);

  return header;
}

async function handleLogout(event) {
  event.preventDefault();

  const logoutLink = event.currentTarget;

  try {
    await logout();
    clearAuthSession();
    window.location.href = logoutLink.href;
  } catch (error) {
    logoutLink.removeAttribute("aria-disabled");
    window.alert(error.message);
  }
}

function logoutEvent(header) {
  const logoutLink = header.querySelector("[data-logout]");

  if (logoutLink) {
    logoutLink.addEventListener("click", handleLogout);
  }
}

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const header = createHeader(this);

    logoutEvent(header);
    this.replaceWith(header);
  }
}

customElements.define("site-header", SiteHeader);
