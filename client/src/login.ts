import { loginEventHandler } from 'event-handlers/login';

const login: HTMLFormElement = document.querySelector('#login');

if (login) login.onsubmit = loginEventHandler;
