import { signOut } from "../api/user.js";
import { clearAuthSession } from "./auth-session.js";

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const backHref = this.getAttribute("back-href");
    const header = document.createElement("header");

    header.className = "site-header";
    header.innerHTML = `
      <div class="site-header__inner">
        ${
          backHref
            ? `<a class="icon-button" href="${backHref}" aria-label="뒤로가기"><span class="back-icon"></span></a>`
            : "<div></div>"
        }
        <a class="site-header__title" href="./posts.html">아무 말 대잔치</a>
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
      </div>
    `;

    const signOutLink = header.querySelector("[data-sign-out]");

    signOutLink.addEventListener("click", async function(event) {
      event.preventDefault();

      if (signOutLink.getAttribute("aria-disabled") === "true") {
        return;
      }

      signOutLink.setAttribute("aria-disabled", "true");

      try {
        await signOut();
        clearAuthSession();
        window.location.href = signOutLink.href;
      } catch (error) {
        signOutLink.removeAttribute("aria-disabled");
        window.alert(error.message);
      }
    });

    this.replaceWith(header);
  }
}

customElements.define("site-header", SiteHeader);
