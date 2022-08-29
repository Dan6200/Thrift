import axios from 'axios';
import $ from 'jquery';

type UserInfo = {
	userId: string;
	token: string;
};

let loginEventHandler = async (event: JQuery.Event) => {
	event.preventDefault();
	let email = <string>$('#email').val();
	let phone = <string>$('#phone').val();
	let password = <string>$('#password').val();
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
