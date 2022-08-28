import axios from 'axios';
import { loginEventHandler } from './auth/event-handlers';

let loginForm: HTMLFormElement = document.querySelector('#login');
let emailInputEl: HTMLInputElement = document.querySelector('#email');
let phoneInputEl: HTMLInputElement = document.querySelector('#phone');
let passwordInputEl: HTMLInputElement = document.querySelector('#password');

async function postData(url: string, data: any) {
	try {
		const response = await axios(url, data);
		return response.data();
	} catch (error) {
		console.error(error);
	}
}

type UserInfo = {
	userId: string;
	token: string;
};

let loginEventHandler: (event: Event) => Promise<void> = async (event) => {
	event.preventDefault();
	let email: string = emailInputEl.value;
	let phone: string = phoneInputEl.value;
	let password: string = passwordInputEl.value;
	try {
		let response = await axios.post('/api/v1/auth/login', {
			email,
			phone,
			password,
		});
		let { token }: UserInfo = response.data;
		sessionStorage.setItem('token', token);
		location.replace('/user-account');
	} catch (error) {
		console.error(error);
	}
};

loginForm.addEventListener('submit', loginEventHandler);
