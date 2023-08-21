//boxes
const autBox = document.getElementById('autBox')
const regBox = document.getElementById('regBox')
const mainBox = document.getElementById('mainBox')
const mainBoxBody = document.querySelectorAll('.mainBoxBody .flexList')
const mainBody = document.getElementById('mainBoxBody')

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
// const userToken = document.getElementById('userToken')
const userMainBoxName = document.getElementById('userMainBoxName')

// variables
let userIDActiveCheckBox = -1
let userToken = -1
let userState = -1

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
document.getElementById('deleteBtn').onclick = function () {
	deletetUser(userIDActiveCheckBox, userToken)
	console.log(userIDActiveCheckBox, userToken)
	console.log('DELETE') 
}
document.getElementById('unblockBtn').onclick = function () {
	if (userState === 'BLOCK') {
		console.log(userIDActiveCheckBox, userToken)
		changeStateUSer(userIDActiveCheckBox, userToken)
		console.log('unblock')
		userState = -1
	} else{
		userState = -1
	}
}
document.getElementById('blockBtn').onclick = function () {
	if (userState === 'UNBLOCK') {
		console.log(userIDActiveCheckBox, userToken)
		changeStateUSer(userIDActiveCheckBox, userToken)
		console.log('block')
		userState = -1 
	} else{
		userState = -1
	}
}
mainBody.onclick = function(event) {
	const checkboxses = document.querySelectorAll('.form-check-input')
	const userID = document.querySelectorAll('.userID')
	const userStList = document.querySelectorAll('.userState')
	const index = parseInt(event.target.dataset.index)
	if (checkboxses[index].checked) {
		userIDActiveCheckBox = userID[index].textContent
		userState = userStList[index].textContent
		return userIDActiveCheckBox, userState
	}
}
document.querySelectorAll('.login-form').forEach(form => {
    form.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        form.reset(); 
    });
});



//Functions
function bearer(token){
	userToken = token
	return userToken
}
function showPassword() {
	var key_attr = $('.key').attr('type');
	if(key_attr != 'text') {
		$('.key').attr('type', 'text');
	} else {
		$('.key').attr('type', 'password');
	}
	
}
function UserFormToList(id, user, email, regDate, lastAct, state, index, checkID) {
    return `
	<div class="flexList" data-index="${index}">
		<div class="col-list bg-info bg-opacity-10 border border-top-0 border-info"><input type="radio" class="form-check-input" name="flexRadioDefault" id="${checkID}" data-index="${index}" ></div>
		<div class="col-list bg-info bg-opacity-10 border border-info border-start-0 border-top-0 userID" style="overflow-wrap: break-word" data-index="${index}">${id}</div>
		<div class="col-list bg-info bg-opacity-10 border border-info border-start-0 border-top-0" style="overflow-wrap: break-word" data-index="${index}">${user}</div>
		<div class="col-list bg-info bg-opacity-10 border border-info border-start-0 border-top-0" style="overflow-wrap: break-word" data-index="${index}">${email}</div>
		<div class="col-list bg-info bg-opacity-10 border border-info border-start-0 border-top-0" style="overflow-wrap: break-word" data-index="${index}">${regDate}</div>
		<div class="col-list bg-info bg-opacity-10 border border-info border-start-0 border-top-0" style="overflow-wrap: break-word" data-index="${index}">${lastAct}</div>
		<div class="col-list bg-info bg-opacity-10 border border-info border-start-0 border-top-0 userState" style="overflow-wrap: break-word" data-index="${index}">${state}</div>
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
		if (response.message === 'Пользователь успешно зарегистрирован') {
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
	if (response.message === `Пользователь ${userInfo.username} не найден`) {
		alert("Такого пользователя не существует!");
	}else {
		bearer(response.token)
		getUsersInfo(response.token)
	} 
}

async function getUsersInfo(token) {
	mainBody.innerHTML = ''
	let response = await sendRequestForBearer("/users", "GET", null, token); // Передаем токен как четвертый аргумент
	console.log()
    if (!response.message) {
		regBox.classList.add('none')
        autBox.classList.add('none')
        mainBox.classList.remove('none')
		if (mainBody.length === 0) {
			mainBody.innerHTML = '<h5 class="text-light">Список пуст</h5>'
		}
		for (let i = 0; i < response.length; i++) {
			const lastActiveDate = new Date(response[i].lastActiveAt);
			const regDate = new Date(response[i].registeredAt);
			let checkID = "flexRadioDefault" + (i + 1)
			const actDate = `${lastActiveDate.getDate()}.${lastActiveDate.getMonth() + 1}.${lastActiveDate.getFullYear()} ${lastActiveDate.getHours()}:${lastActiveDate.getMinutes()}`;
			const formattedRegDate = `${regDate.getDate()}.${regDate.getMonth() + 1}.${regDate.getFullYear()} ${regDate.getHours()}:${regDate.getMinutes()}`;
		
			mainBody.insertAdjacentHTML("beforeend", UserFormToList(response[i]._id, response[i].username, response[i].email, formattedRegDate, actDate, response[i].roles[0], i, checkID));
		}
		
    } else {
        alert(response.message)
    }
   
}

async function changeStateUSer(id, token) {
	if (userIDActiveCheckBox !== -1 && userToken !== -1){
		let response = await sendRequestForDelete("/changeState", "GET", id, token);
		let elem = 'BLOCK'
		return checkUserIDActive(elem, token)
	}else{
		alert('Error')
	}
}
async function checkUserIDActive (elem, token){
	let responseId = await sendRequestForBearer("/getUserIdByToken", "GET", null, token); // Передаем токен как четвертый аргумент
		console.log(responseId.userId)
		console.log(userIDActiveCheckBox)
		// let 
		if (userIDActiveCheckBox !== responseId.userId) {
			getUsersInfo(token)
		} else {
			regBox.classList.add('none')
			autBox.classList.remove('none')
			mainBox.classList.add('none')
			alert(`Пользователь ${elem} сам себя`)
		}
}
async function deletetUser(id, token) {
	if (userIDActiveCheckBox !== -1 && userToken !== -1){
		let response = await sendRequestForDelete("/users", "DELETE", id, token);
		let elem = 'DELETE'
		return checkUserIDActive(elem, token)
	}else{
		alert('Error')
	}
}
async function sendRequest(url, method, data) {
	url = `https://alex-nodejs-d873a2e08f3b.herokuapp.com/auth${url}`;
	// url = `http://localhost:5000/auth${url}`;

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
    url = `https://alex-nodejs-d873a2e08f3b.herokuapp.com/auth${url}`;
    // url = `http://localhost:5000/auth${url}`;
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
async function sendRequestForDelete(url, method, data, token){
	url = `https://alex-nodejs-d873a2e08f3b.herokuapp.com/auth${url}/${data}`;
	// url = `http://localhost:5000/auth${url}/${data}`;
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
	let response = await fetch(url, {
		method: method,
		headers: headers,
	});
	response = await response.json();
	return response;
}
