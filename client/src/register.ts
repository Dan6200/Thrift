import { registerEventHandler } from './event-handlers/register';

const register = document.querySelector('#register');

if (register) register.addEventListener('submit', registerEventHandler);
