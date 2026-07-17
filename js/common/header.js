import { logout } from "../api/user.js";
import { clearAuthSession, getAuth } from "./auth-storage.js";
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
  const showSearch = element.hasAttribute("show-search");
  const loginLink = element.getAttribute("login-link");
  const authSession = getAuth();
  const shouldShowProfile = showProfile || Boolean(loginLink && authSession);
  const header = document.createElement("header");
  const title = '<a class="site-header__title" href="./movies.html">CINEON</a>';
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
