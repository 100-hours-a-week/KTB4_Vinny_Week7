import { createVNode as h, mount, patch } from './v-dom.js';
import {
  getEmailError as getEmailValidationError,
  getPasswordError as getPasswordValidationError
} from '../js/utils/validation.js';
import { getUserInfo, login } from "../js/api/user.js";
import { saveUser } from "../js/common/auth-storage.js";

const state = {
  email: '',
  emailError: '',
  password: '',
  passwordError: '',
  isSubmitting: false
};

function getEmailError() {
  return getEmailValidationError(state.email);
}

function getPasswordError() {
  return getPasswordValidationError(state.password);
}

function validateEmail() {
  const error = getEmailError();
  state.emailError = error;
  return error === "";
}

function validatePassword() {
  const error = getPasswordError();
  state.passwordError = error;
  return error === "";
}

function isLoginFormValid() {
  return getEmailError() === "" && getPasswordError() === "";
}

function handleEmailInput(event) {
  state.email = event.target.value; 
  update();
}

function handlePasswordInput(event) {
  state.password = event.target.value;
  update();
}

function handleEmailBlur() {
  validateEmail();
  update();
}

function handlePasswordBlur() {
  validatePassword();
  update();
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  
  const isValid = [
    validateEmail(),
    validatePassword()
  ].every(Boolean);

  if (!isValid) {
    update();
    return;
  }

  state.isSubmitting = true;
  update();

  try {
    const authSession = await login({
      email: state.email,
      password: state.password
    });
    
    saveUser(authSession);

    const userProfile = await getUserInfo();
    saveUser({
      ...authSession,
      ...userProfile
    });

    window.location.href = "../movies.html";
  } catch (error) {
    state.isSubmitting = false;
    alert(error.message);
    update();
  }
}

function getHelperClass(error) {
  return error === "" ? "helper" : "helper helper--visible";
}

function createPosterItems() {
  return Array.from(
    { length: 10 },
    (_, index) => h('span', { key: `poster-${index}` })
  );
}

function createSignInVNode() {
  return h(
    'div', { class: 'auth-shell' },
    h(
      'section', { class: 'auth-form', 'aria-labelledby': 'login-title' },
      h('h1', { id: 'login-title', class: 'section-title' }, "로그인"),
      h('p', { class: 'auth-form__summary' }, "좋아하는 영화를 다시 만나고, 남겨둔 리뷰를 이어서 확인하세요."),
      h('form', {
        id: 'login-form',
        class: 'form form--login',
        action: '/login',
        method: 'POST',
        noValidate: true,
        onSubmit: handleLoginSubmit
      },
        h('div', { class: 'form-group' },
          h('label', { class: 'label', for: 'email' }, "이메일"),
          h('input', {
            id: 'email',
            class: 'input',
            type: 'email',
            value: state.email,
            name: 'username',
            placeholder: '이메일을 입력하세요',
            required: true,
            onInput: handleEmailInput,
            onBlur: handleEmailBlur
          }),
          h('p', { id: 'email-helper-text', class: getHelperClass(state.emailError) }, state.emailError)
        ),
        h('div', { class: 'form-group' },
          h('label', { class: 'label', for: 'password' }, "비밀번호"),
          h('input', {
            id: 'password',
            class: 'input',
            type: 'password',
            value: state.password,
            name: 'password',
            placeholder: '비밀번호를 입력하세요',
            required: true,
            onInput: handlePasswordInput,
            onBlur: handlePasswordBlur
          }),
          h('p', { id: 'password-helper-text', class: getHelperClass(state.passwordError) }, state.passwordError)
        ),
        h('button', {
          id: 'login-button',
          class: 'btn btn--primary btn--wide btn--rounded',
          type: 'submit',
          disabled: !isLoginFormValid() || state.isSubmitting
        }, "로그인")
      ),
      h('a', {
        id: 'sign-up-link',
        class: 'link-button',
        href: '../sign-up.html'
      }, "아직 계정이 없나요? 회원가입")

    ),
    h('aside', { class: 'auth-poster-panel', 'aria-hidden': 'true' },
      h('div', { class: 'auth-poster-panel__track auth-poster-panel__track--top' },
        createPosterItems()
      ),
      h('div', { class: 'auth-poster-panel__track auth-poster-panel__track--bottom' },
        createPosterItems()
      ),
      h('div', { class: 'auth-poster-panel__copy' },
        h('strong', null, "CINEON"),
        h('p', null, "한 편의 영화처럼 취향을 기록하세요.")
      )
    )
  )
}

const target = document.querySelector('.main--auth');
let currentVNode = createSignInVNode();
mount(currentVNode, target);

function update() {
  const newVNode = createSignInVNode();
  patch(target, newVNode, currentVNode);
  currentVNode = newVNode;
}
