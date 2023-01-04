let input = document.querySelector(".input");
let button = document.querySelector(".button");

button.disabled = true; //setting button state to disabled

input.addEventListener("keypress", stateHandle);

function stateHandle() {
    if (input.value === " ") {
        button.disabled = true; //button remains disabled
    } else {
        button.disabled = false; //button is enabled
    }
}
