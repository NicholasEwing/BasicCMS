function displayReqs() {
	document.querySelector("#message").style.display = "block"
}

function hideReqs() {
	document.querySelector("#message").style.display = "none"
}

function validate() {
	var password1 = document.querySelector("#password");
	var password2 = document.querySelector("#confirm-password");
	var letter = document.querySelector("#letter");
	var capital = document.querySelector("#capital");
	var number = document.querySelector("#number");
	var length = document.querySelector("#length");
	var match = document.querySelector("#match");

	var lowerCaseLetters = /[a-z]/g;
	if(password1.value.match(lowerCaseLetters)) {  
		letter.classList.remove("invalid");
		letter.classList.add("valid");
	} else {
		letter.classList.remove("valid");
		letter.classList.add("invalid");
	}

	// Validate capital letters
	var upperCaseLetters = /[A-Z]/g;
	if(password1.value.match(upperCaseLetters)) {  
		capital.classList.remove("invalid");
		capital.classList.add("valid");
	} else {
		capital.classList.remove("valid");
		capital.classList.add("invalid");
	}

	// Validate numbers
	var numbers = /[0-9]/g;
	if(password1.value.match(numbers)) {  
		number.classList.remove("invalid");
		number.classList.add("valid");
	} else {
		number.classList.remove("valid");
		number.classList.add("invalid");
	}

	// Validate length
	if(password1.value.length >= 8) {
		length.classList.remove("invalid");
		length.classList.add("valid");
	} else {
		length.classList.remove("valid");
		length.classList.add("invalid");
	}

	// Validate passwords match
	if(password1.value === password2.value) {
		match.classList.remove("invalid");
		match.classList.add("valid");
	} else {
		match.classList.remove("valid");
		match.classList.add("invalid");
	}
}

function match(input) {
	var password1 = document.querySelector("#password");
	var password2 = document.querySelector("#confirm-password");
	var match = document.querySelector("#match");

	// Validate passwords match
	if(password1.value === password2.value) {
		input.setCustomValidity("");
		match.classList.remove("invalid");
		match.classList.add("valid");
	} else {
		input.setCustomValidity("Both passwords must match.");
		match.classList.remove("valid");
		match.classList.add("invalid");
	}
}

function closeToast() {
	let ele = document.querySelector(".toast");
	ele.style.opacity = 0;
	setTimeout(function(){
		ele.parentNode.removeChild(ele);
	}, 200);
}