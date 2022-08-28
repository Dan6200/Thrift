import { loginEventHandler } from './auth/event-handler';

let loginForm: HTMLFormElement = document.querySelector('#login');

loginForm.addEventListener('submit', loginEventHandler);
