function matchPasswords(input) {
	if (input.value != document.getElementById("password").value) {
		input.setCustomValidity("Password must be matching.");
	} else {
		input.setCustomValidity("");
	}
}

function closeToast() {
	let ele = document.querySelector(".toast");
	ele.style.opacity = 0;
	setTimeout(function(){
		ele.parentNode.removeChild(ele);
	}, 200);
}