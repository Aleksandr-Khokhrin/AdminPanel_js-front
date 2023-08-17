//boxes
const autBox = document.getElementById('autBox')
const regBox = document.getElementById('regBox')
const mainBox = document.getElementById('mainBox')
const mainBoxBody = document.querySelectorAll('.mainBoxBody .flexList')
const mainBody = document.getElementById('mainBoxBody')
// console.log(mainBoxBody.length)

//inputs
const nameAut = document.getElementById('nameAut')
const keyAut = document.getElementById('keyAut')
const emailReg = document.getElementById('emailReg')
const nameReg = document.getElementById('nameReg')
const keyRegOne = document.getElementById('keyRegOne')
const keyRegTwo = document.getElementById('keyRegTwo')

//buttons
const getRegBox = document.getElementById('getRegBox')
const getAutBox = document.getElementById('getAutBox')
const autBtn = document.getElementById('autBtn')
const regBtn = document.getElementById('regBtn')



//span
const userToken = document.getElementById('userToken')
const userMainBoxName = document.getElementById('userMainBoxName')


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
		username: nameAut.value,
		password: keyAut.value,
	};
	userMainBoxName.textContent = nameAut.value
	authUser(userInfo);
}
regBtn.onclick = function () {
	let userInfo = {
		username: nameReg.value,
		password: keyRegOne.value,
		email: emailReg.value
	};
	regUser(userInfo);
}




//Functions
function showPassword() {
	var key_attr = $('.key').attr('type');
	if(key_attr != 'text') {
		$('.key').attr('type', 'text');
	} else {
		$('.key').attr('type', 'password');
	}
	
}
function UserFormToList(id, user, email, regDate, lastAct, state, index) {
    return `
	<div class="flexList" data-index="${index}">
		<div class="col-list bg-info bg-opacity-10 border border-top-0 border-info"><input type="checkbox" class="checkbox" data-index="${index}"></div>
		<div data-index="${index}" class="col-list bg-info bg-opacity-10 border border-info border-start-0 border-top-0" style="overflow-wrap: break-word;">${id}</div>
		<div data-index="${index}" class="col-list bg-info bg-opacity-10 border border-info border-start-0 border-top-0" style="overflow-wrap: break-word;">${user}</div>
		<div data-index="${index}" class="col-list bg-info bg-opacity-10 border border-info border-start-0 border-top-0" style="overflow-wrap: break-word;">${email}</div>
		<div data-index="${index}" class="col-list bg-info bg-opacity-10 border border-info border-start-0 border-top-0" style="overflow-wrap: break-word;">${regDate}</div>
		<div data-index="${index}" class="col-list bg-info bg-opacity-10 border border-info border-start-0 border-top-0" style="overflow-wrap: break-word;">${lastAct}</div>
		<div data-index="${index}" class="col-list bg-info bg-opacity-10 border border-info border-start-0 border-top-0" style="overflow-wrap: break-word;">${state}</div>
	</div>`;
}




//API
async function regUser(userInfo) {
	if(keyRegOne.value === '' || keyRegTwo.value === '' || nameReg.value === '' || emailReg.value === ''){
		return alert("Error! Enter all values");
	}
	if (keyRegTwo.value === keyRegOne.value) {
		let response = await sendRequest("/registration", "POST", userInfo);
		// console.log(response);
		if (response) {
			regBox.classList.add('none')
			mainBox.classList.add('none')
			autBox.classList.remove('none')
		} else {
			alert(response.message);
		}
	} else {
		alert("Error! Passwords do not match!");
	}
}
async function authUser(userInfo) {
	if(nameAut.value === '' || keyAut.value === ''){
		return alert("Error! Enter all values");
	}
	let response = await sendRequest("/login", "POST", userInfo);
	// console.log(response);
	if (response.message === "Пользователь user не найден") {
		alert("Такого пользователя не существует!");
	}else {
        regBox.classList.add('none')
        autBox.classList.add('none')
        mainBox.classList.remove('none')
		getUsersInfo(response.token)

	} 
}
async function getUsersInfo(token) {
    let response = await sendRequestForBearer("/users", "GET", null, token); // Передаем токен как четвертый аргумент
    if (response) {
		if (mainBoxBody.length === 0) {
			mainBoxBody.innerHTML = '<h5 class="text-light">Список пуст</h5>'
		}
		for (let i = 0; i < response.length; i++) {
			const lastActiveDate = new Date(response[i].lastActiveAt);
			const regDate = new Date(response[i].registeredAt);
			
			const actDate = `${lastActiveDate.getDate()}.0${lastActiveDate.getMonth() + 1}.${lastActiveDate.getFullYear()} ${lastActiveDate.getHours()}:${lastActiveDate.getMinutes()}`;
			const formattedRegDate = `${regDate.getDate()}.0${regDate.getMonth() + 1}.${regDate.getFullYear()} ${regDate.getHours()}:${regDate.getMinutes()}`;
		
			mainBody.insertAdjacentHTML("beforeend", UserFormToList(response[i]._id, response[i].username, response[i].email, formattedRegDate, actDate, response[i].roles[0], i));
		}
		
    } else {
        alert('Error')
    }
}
async function sendRequest(url, method, data) {
	// url = `https://bakerman-node-js-1fd874ff2f21.herokuapp.com/auth${url}`;
	url = `http://localhost:5000/auth${url}`;

	if (method == "POST") {
        // console.log(data);
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
async function sendRequestForBearer(url, method, data, token = null) {
    // url = `https://bakerman-node-js-1fd874ff2f21.herokuapp.com/auth${url}`;
    url = `http://localhost:5000/auth${url}`;
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const options = {
        method: method,
        headers: headers,
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    let response = await fetch(url, options);
    response = await response.json();
    return response;
}

