import { signOut } from "../api/user.js";
import { clearAuthSession } from "./auth-storage.js";

function createHeader(element) {
  const backHref = element.getAttribute("back-href");
  const titleHref = element.getAttribute("title-href");
  const showProfile = element.hasAttribute("show-profile");
  const header = document.createElement("header");
  const title = titleHref
    ? `<a class="site-header__title" href="${titleHref}">아무 말 대잔치</a>`
    : '<h1 class="site-header__title">아무 말 대잔치</h1>';
  const profileMenu = showProfile
    ? `
      <nav class="profile-menu" aria-label="프로필 메뉴">
        <button class="icon-button" type="button" aria-label="프로필 메뉴 열기">
          <span class="avatar"></span>
        </button>
        <div class="profile-menu__panel">
          <a class="profile-menu__item" href="./user-profile-edit.html">회원정보수정</a>
          <a class="profile-menu__item" href="./user-password-edit.html">비밀번호수정</a>
          <a class="profile-menu__item" href="./sign-in.html" data-sign-out>로그아웃</a>
        </div>
      </nav>
    `
    : "<div></div>";

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

  return header;
}

async function handleSignOut(event) {
  event.preventDefault();

  const signOutLink = event.currentTarget;

  try {
    await signOut();
    clearAuthSession();
    window.location.href = signOutLink.href;
  } catch (error) {
    signOutLink.removeAttribute("aria-disabled");
    window.alert(error.message);
  }
}

function signOutEvent(header) {
  const signOutLink = header.querySelector("[data-sign-out]");

  if (signOutLink) {
    signOutLink.addEventListener("click", handleSignOut);
  }
}

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const header = createHeader(this);

    signOutEvent(header);
    this.replaceWith(header);
  }
}

customElements.define("site-header", SiteHeader);
