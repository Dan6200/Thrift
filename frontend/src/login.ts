import { loginEventHandler } from './auth/event-handler';
import $ from 'jquery';

$('#login').on('submit', loginEventHandler);
