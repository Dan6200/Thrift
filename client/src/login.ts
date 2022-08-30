import { loginEventHandler } from './event-handlers/login';

const login = document.querySelector('#login');

if (login) login.addEventListener('submit', loginEventHandler);
