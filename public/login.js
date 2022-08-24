var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let loginForm = document.querySelector('#login');
let emailInputEl = document.querySelector('#email');
let phoneInputEl = document.querySelector('#phone');
let passwordInputEl = document.querySelector('#password');
// Example POST method implementation:
function postData(url = '', data = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // Default options are marked with *
        const response = yield fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    });
}
loginForm.addEventListener('submit', (event) => __awaiter(this, void 0, void 0, function* () {
    event.preventDefault();
    let email = emailInputEl.value;
    let phone = phoneInputEl.value;
    let password = passwordInputEl.value;
    try {
        let response = yield postData('/api/v1/auth/login', {
            email,
            phone,
            password,
        });
        console.log(response);
    }
    catch (error) {
        console.error(error);
    }
}));
