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

function modulo(a, b) {
    return a % b;
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
    } else if(operator === "%") {
        return modulo(a, b);
    }
}

class CalculatorNumber {
    constructor(integerPart, decimalPart) {
        this.integerPart = integerPart || "0";
        this.decimalPart = decimalPart || "";
    }
  
    getValue() {
        let x = this.integerPart;
        let y = this.decimalPart;
        if(this.zeroOrEmpty(this.integerPart)) {
            x = "0";
        }
        if(this.zeroOrEmpty(this.decimalPart)) {
            y = "0";
        }
        return parseFloat(`${x}.${y}`);
    }

    clearValue() {
        this.integerPart = "0";
        this.decimalPart = "";
    }

    zeroOrEmpty(x) {
        if(x === "" || x ==="0") {
            return true;
        }
        return false;
    }
}

let a = new CalculatorNumber();
let b = new CalculatorNumber();
let operator;


function pressed() {
    const lower = document.querySelector(".lower-half");
    const upper = document.querySelector(".upper-half");

    if(this.value === "clear") {
        a.clearValue();
        upper.innerHTML = "";
        b.clearValue();
        lower.innerHTML = "0";
        operator = undefined;
    }

    if(this.value === "delete") {
        // delete the last digit's operator along with it
        if(b.getValue() < 0 && lower.textContent.length === 2) {
            lower.innerHTML = "0";
            b.clearValue();
        } else {
            // if only 0 is displayed don't do anything
            if(lower.textContent === "0") {
                return;
            } else if (lower.textContent.includes(".")){
                // delete digit from b only if it is not the dot or 0
                if(lower.textContent.slice(-1) !== ".") {
                    b.decimalPart = b.decimalPart.slice(0, -1);
                }
                lower.textContent = lower.textContent.slice(0, -1);            
            } else {
                // if there is only one digit replace it with 0 else operate delete normally
                if(lower.textContent.length === 1) {
                    b.integerPart = "0";
                    lower.textContent = "0";
                } else {
                    b.integerPart = b.integerPart.slice(0, -1);
                    lower.textContent = lower.textContent.slice(0, -1);
                }
            }
        }
    }

    if(this.value === "digit") {
        // disable dot button when there is already the dot in b
        if(lower.textContent.includes(".") && this.digit === ".") {
            return;
        } else {
            // 9 characters is the maximum characters the screen can fit
            if(b.getValue().toString().length < 9) {
                // if b is 0 and pressed digit is not the dot replace 0 with it
                if(lower.textContent === "0" && this.digit !== ".") {
                    lower.textContent = this.digit;
                    b.integerPart = this.digit;
                } else {
                    if(this.digit !== ".") {
                        // if there is the dot add to demicalPart else to integerPart
                        if(lower.textContent.includes(".")) {
                            b.decimalPart += this.digit;
                        } else {
                            b.integerPart += this.digit;
                        }
                    }
                    lower.textContent += this.digit;
                    lower.textContent;
                }
            }
        }
    }

    if(this.value === "operator") {
        if(operator) {
            let i = upper.querySelectorAll("i");
            if (i.length === 2) {
                upper.removeChild(i[1]);
                upper.insertAdjacentHTML("beforeend", this.content);
            } else {
                upper.removeChild(i[0]);
                upper.insertAdjacentHTML("beforeend", this.content);
            }
        } else {
            a.decimalPart = b.decimalPart;
            a.integerPart = b.integerPart;
            upper.innerHTML = lower.innerHTML + this.content; 
            lower.innerHTML = "0";
            b.clearValue();
        }
        operator = this.operator;
    }

    if(this.value === "equals") {
        if(upper.innerHTML) {
            let result = operate(a.getValue(), b.getValue(), operator);
            if(result === Infinity || result === -Infinity || isNaN(result)) {
                alert("Invalid computation!");
            } else {
                if (result < 0) {
                    lower.innerHTML = "";
                    lower.insertAdjacentHTML("afterbegin", minus);
                    lower.innerHTML += -result
                    const { integerPart, decimalPart } = breakFloat(result);
                    b.integerPart = integerPart;
                    b.decimalPart = decimalPart;
                } else {
                    lower.innerHTML = result;
                    upper.innerHTML = "";
                    const { integerPart, decimalPart } = breakFloat(result);
                    b.integerPart = integerPart;
                    b.decimalPart = decimalPart;
                }
                upper.innerHTML = "";
                operator = undefined;
                a.clearValue();
            }
        }
    }
}


function breakFloat(floatNumber) {
    const integerPart = Math.floor(floatNumber);
    const decimalPart = floatNumber - integerPart;
    return { integerPart, decimalPart };
}
  

let minus;

function digitOrOperator(button) {
    const content = button.innerHTML;
    if (content === "AC") {
        button.value = "clear";
    } else if (content.includes("delete-left")) {
        button.value = "delete"
    } else if(content.includes("percent")) {
        button.value = "operator";
        button.operator = "%";
        button.content = content;
    } else if(content.includes("divide")) {
        button.value = "operator";
        button.operator = "/";
        button.content = content;
    } else if(content.includes("xmark")) {
        button.value = "operator";
        button.operator = "*";
        button.content = content;
    } else if(content.includes("minus")) {
        button.value = "operator";
        button.operator = "-";
        button.content = content;
        minus = content;
    } else if(content.includes("plus")) {
        button.value = "operator";
        button.operator = "+";
        button.content = content;
    } else if(content.includes("equals")) {
        button.value = "equals";
    } else {
        button.value = "digit";
        button.digit = content;
    }
}

document.querySelector(".lower-half").textContent = "0";
const buttons = document.querySelectorAll(".button");
for(let button of buttons) {
    digitOrOperator(button);
    button.addEventListener("click", pressed);
} 