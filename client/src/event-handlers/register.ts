import axios from 'axios';

type UserInfo = {
	userId: string;
	token: string;
};

let debounce = false;

let registerEventHandler = async (event: Event) => {
	// switch to svelte
	event.preventDefault();
	if (debounce) return;

	let firstNameInput: HTMLInputElement = document.querySelector('#first');
	let lastNameInput: HTMLInputElement = document.querySelector('#last');
	let emailInput: HTMLInputElement = document.querySelector('#email');
	let phoneInput: HTMLInputElement = document.querySelector('#phone');
	let countryInput: HTMLInputElement = document.querySelector('#country');
	let dobInput: HTMLInputElement = document.querySelector('#dob');
	let passwordInput: HTMLInputElement = document.querySelector('#password');
	let confirmPasswordInput: HTMLInputElement =
		document.querySelector('#confirmPassword');

	let firstName: string = firstNameInput.value;
	let lastName: string = lastNameInput.value;
	let email: string = emailInput.value;
	let phone: string = phoneInput.value;
	let country: string = countryInput.value;
	let dob: string = dobInput.value;
	let password: string = passwordInput.value;
	let confirmPassword: string = confirmPasswordInput.value;

	try {
		// work on throttling this
		setTimeout(() => {
			debounce = !debounce;
		});
		setTimeout(() => {
			debounce = !debounce;
		}, 2000);
		if (password !== confirmPassword)
			throw new Error(
				'The password does not match please re-enter password'
			);
		let response = await axios.post('/api/v1/auth/register', {
			firstName,
			lastName,
			email,
			phone,
			password,
			country,
			dob,
		});
		let { token }: UserInfo = response.data;
		sessionStorage.setItem('token', token);
		location.replace('/user');
	} catch (error) {
		console.error(error.response.data);
	}
};

export { registerEventHandler };
