import axios from 'axios';

type UserInfo = {
	userId: string;
	token: string;
};

let debounce = false;

let registerEventHandler = async (event: Event) => {
	event.preventDefault();
	if (debounce) return;

	const firstName: string = (<HTMLInputElement>(
		document.querySelector('#first')
	)).value;
	const lastName: string = (<HTMLInputElement>document.querySelector('#last'))
		.value;
	const email: string = (<HTMLInputElement>document.querySelector('#email'))
		.value;
	const phone: string = (<HTMLInputElement>document.querySelector('#phone'))
		.value;
	const country: string = (<HTMLInputElement>(
		document.querySelector('#country')
	)).value;
	const dob: string = (<HTMLInputElement>document.querySelector('#dob'))
		.value;
	const password: string = (<HTMLInputElement>(
		document.querySelector('#password')
	)).value;
	const confirmPassword: string = (<HTMLInputElement>(
		document.querySelector('#confirmPassword')
	)).value;

	try {
		// work on throttling this
		setTimeout(() => (debounce = !debounce));
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
		console.log(sessionStorage);
	} catch (error) {
		console.error(error.response.data);
	}
};

export { registerEventHandler };
