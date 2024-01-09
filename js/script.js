function addition(a, b) {
    return a + b;
}

function subtraction(a, b) {
    return a - b;
}

function multiplication(a, b) {
    return a * b;
}

function division(a, b) {
    return a / b;
}

function operate(a, b, operator) {
    if(operator === "+") {
        return addition(a, b);
    } else if(operator === "-") {
        return subtraction(a, b);
    } else if(operator === "*") {
        return multiplication(a, b);
    } else if(operator === "/") {
        return division(a, b);
    }
}

function pressed() {
    const display = document.querySelector(".screen");
    display.textContent += this.innerHTML;
}

// function digitOrOperator(content) {
//     if(content.includes())
// }

const buttons = document.querySelectorAll(".button");
for(let button of buttons) {
    button.addEventListener("click", pressed);
} 
