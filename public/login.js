import { loginEventHandler } from './auth/event-handler.js';
let loginForm = document.querySelector('#login');
let emailInputEl = document.querySelector('#email');
let phoneInputEl = document.querySelector('#phone');
let passwordInputEl = document.querySelector('#password');
loginForm.addEventListener('submit', loginEventHandler.call(null, emailInputEl, phoneInputEl, passwordInputEl));
