
//boxes
const autBox = document.getElementById('autBox')
const regBox = document.getElementById('regBox')
const mainBox = document.getElementById('mainBox')

//inputs
const emailAut = document.getElementById('emailAut')
const keyAut = document.getElementById('keyAut')

//buttons
const getRegBox = document.getElementById('getRegBox')
const getAutBox = document.getElementById('getAutBox')
const autBtn = document.getElementById('autBtn')

//span
const userToken = document.getElementById('userToken')

//listeners
getRegBox.onclick = () => {
    regBox.classList.remove('none')
    autBox.classList.add('none')
}
getAutBox.onclick = () => {
    autBox.classList.remove('none')
    regBox.classList.add('none')
    
}

autBtn.onclick = function () {
	let userInfo = {
		username: emailAut.value,
		password: keyAut.value,
	};
	authUser(userInfo);
}
async function authUser(userInfo) {
	let response = await sendRequest("/login", "POST", userInfo);
	console.log(response);
	if (response) {
        regBox.classList.add('none')
        autBox.classList.add('none')
        mainBox.classList.remove('none')
		userToken.textContent = `${response.token}`

	} else {
		alert("Такого пользователя не существует!");
	}
}
async function sendRequest(url, method, data) {
	// e.preventDefault();
	url = `http://localhost:5000/auth${url}`;

	if (method == "POST") {
        console.log(data);
		let response = await fetch(url, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		response = await response.json();
		return response;
	} else if (method == "GET") {
		url = url + "?" + new URLSearchParams(data);
		let response = await fetch(url, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});
		response = await response.json();
		return response;
	}
}


function showPassword() {
    
    var key_attr = $('.key').attr('type');
    
    if(key_attr != 'text') {
        
        $('.checkbox').addClass('show');
        $('.key').attr('type', 'text');
        
    } else {
        
        $('.checkbox').removeClass('show');
        $('.key').attr('type', 'password');
        
    }
    
}