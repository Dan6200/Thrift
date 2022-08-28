import axios from 'axios';

type UserInfo = {
	userId: string;
	token: string;
};

let loginEventHandler: (
	event: Event,
	emailInputEl: HTMLInputElement,
	phoneInputEl: HTMLInputElement,
	passwordInputEl: HTMLInputElement
) => Promise<void> = async (
	event,
	emailInputEl,
	phoneInputEl,
	passwordInputEl
) => {
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
