let loginForm: HTMLFormElement = document.querySelector('#login');
let emailInputEl: HTMLInputElement = document.querySelector('#email');
let phoneInputEl: HTMLInputElement = document.querySelector('#phone');
let passwordInputEl: HTMLInputElement = document.querySelector('#password');

async function postData(url = '', data = {}) {
	const response = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		body: JSON.stringify(data), // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
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
		let { userId, token }: UserInfo = await postData('/api/v1/auth/login', {
			email,
			phone,
			password,
		});
		// store token with session storage
		// fetch a get request from /api/v1/user-account with Bearer token
		// Do a client-side rerouting with history api
	} catch (error) {
		console.error(error);
	}
};

loginForm.addEventListener('submit', async (event: Event): Promise<void> => {});
