import axios from 'axios';

let emailInputEl: HTMLInputElement = document.querySelector('#email');
let phoneInputEl: HTMLInputElement = document.querySelector('#phone');
let passwordInputEl: HTMLInputElement = document.querySelector('#password');

type UserInfo = {
	userId: string;
	token: string;
};

let loginEventHandler: (event: Event) => Promise<void> = async (event) => {
	console.log(event);
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

export { loginEventHandler };
