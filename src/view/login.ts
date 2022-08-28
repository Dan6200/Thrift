import { loginEventHandler } from './auth/event-handler.js';

let loginForm: HTMLFormElement = document.querySelector('#login');
let emailInputEl: HTMLInputElement = document.querySelector('#email');
let phoneInputEl: HTMLInputElement = document.querySelector('#phone');
let passwordInputEl: HTMLInputElement = document.querySelector('#password');

loginForm.addEventListener(
	'submit',
	loginEventHandler.call(null, emailInputEl, phoneInputEl, passwordInputEl)
);
