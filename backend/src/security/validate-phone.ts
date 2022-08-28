import { isValidPhoneNumber } from 'libphonenumber-js';
// const axios = require('axios');
// const fileName = path.basename(__filename)
//
// module.exports = (phoneNumber) => {
// 	if (isValidPhoneNumber(phoneNumber)) {
// 		// Verify with sms verification api instead if possible...
// 		axios.get(`https://phonevalidation.abstractapi.com/v1/?api_key=process.env.ABSTRACT_API_KEY_PHONE&phone=${phoneNumber}`)
// 			.then(response => {
// 				console.log(response.data);
// 				console.log(fileName);
// 			})
// 			.catch(error => {
// 				console.error(error);
// 				console.log(fileName);
// 			});
// 		// return boolean
// 	}
// }
