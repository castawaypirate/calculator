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

const minFontSize = 40;
const maxFontSize = 60;

const standardIconFontSize = 30;


function pressed() {
    const lower = document.querySelector(".lower-half");
    const upper = document.querySelector(".upper-half");

    let lowerFontSize = parseInt(getCssStyle(lower, 'font-size'), 10);

    if(this.value === "clear") {
        a.clearValue();
        upper.innerHTML = "";
        b.clearValue();
        lower.innerHTML = "0";
        operator = undefined;
    }

    if(this.value === "delete") {
        // delete the last digit's operator along with it
        if(b.getValue() < 0 && lower.textContent.length === 1) {
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
                lower.innerHTML = lower.innerHTML.slice(0, -1);            
            } else {
                // if there is only one digit replace it with 0 else operate delete normally
                if(lower.textContent.length === 1) {
                    b.integerPart = "0";
                    lower.textContent = "0";
                } else {
                    b.integerPart = b.integerPart.slice(0, -1);
                    lower.innerHTML = lower.innerHTML.slice(0, -1);
                }
            }
        }
    }

    if(this.value === "digit") {
        // disable dot button when there is already the dot in b
        if((lower.textContent.includes(".") && this.digit === ".") || (lowerFontSize === minFontSize)) {
            return;
        } else {
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
                lower.innerHTML += this.digit;
            }
        }
    }

    if(this.value === "operator") {
        if(operator) {
            let i = upper.querySelectorAll("i");
            if (i.length === 2) {
                const iconFontSize = i[1].style.fontSize;
                upper.removeChild(i[1]);
                upper.insertAdjacentHTML("beforeend", this.content);
                changeIconFontSize(upper, iconFontSize);
            } else {
                const iconFontSize = i[0].style.fontSize;
                upper.removeChild(i[0]);
                upper.insertAdjacentHTML("beforeend", this.content);
                changeIconFontSize(upper, iconFontSize);
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
                    lower.innerHTML += -result;

                    changeIconFontSize(lower, `${standardIconFontSize}px`);
                    lower.style.fontSize = `${maxFontSize}px`;

                    const { integerPart, decimalPart } = breakFloat(result);
                    b.integerPart = integerPart.toString();
                    b.decimalPart = decimalPart.toString();
                } else {
                    lower.innerHTML = result;
                    
                    lower.style.fontSize = `${maxFontSize}px`;

                    const { integerPart, decimalPart } = breakFloat(result);
                    b.integerPart = integerPart.toString();
                    b.decimalPart = decimalPart.toString();
                }
                upper.innerHTML = "";

                upper.style.fontSize = `${maxFontSize}px`;

                operator = undefined;
                a.clearValue();
            }
        }
    }

    adjustFontSize(upper);
    let handled = adjustFontSize(lower);
    if(!handled) {
        alert("Apologies, we're unable to process such a large result. Data will be automatically cleared!");
        a.clearValue();
        upper.innerHTML = "";
        b.clearValue();
        lower.innerHTML = "0";
        operator = undefined;
        changeIconFontSize(lower, `${standardIconFontSize}px`);
        lower.style.fontSize = `${maxFontSize}px`;
    }
}

function changeIconFontSize(element, fontSize) {
    const icons = element.getElementsByTagName('i');

    for (let icon of icons) {
        icon.style.fontSize = fontSize;
    }
}


function breakFloat(input) {
    const inputString = input.toString();
    const parts = inputString.split('.');
    let integerPart = parseInt(parts[0], 10);
    let decimalPart = parseInt(parts[1], 10);

    if(isNaN(decimalPart)) {
        decimalPart = 0;
    }
  
    return {
      integerPart,
      decimalPart
    };
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


function getElementTextWidth(el) {
    const testDiv = document.createElement('div');
    document.body.appendChild(testDiv);
    testDiv.style.position = 'absolute';
    testDiv.style.visibility = 'hidden';
    testDiv.style.whiteSpace = 'nowrap';
    testDiv.style.fontSize = getCssStyle(el, 'font-size');
    testDiv.style.fontFamily = getCssStyle(el, 'font-family');
    testDiv.style.fontWeight = getCssStyle(el, 'font-weight');
    testDiv.textContent = el.textContent;
    const width = testDiv.clientWidth;
    document.body.removeChild(testDiv);
    return width;
}


function getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
}


function adjustFontSize(displayElement) {
    const parentStyle = window.getComputedStyle(displayElement.parentElement);
    const parentPadding = parseInt(parentStyle.paddingLeft, 10) + parseInt(parentStyle.paddingRight, 10);
    const parentWidth = displayElement.parentElement.offsetWidth - parentPadding - 35;

    let contentWidth = getElementTextWidth(displayElement);
    const icons = displayElement.getElementsByTagName('i');
    for (let icon of icons) {
        contentWidth += icon.offsetWidth;
    }

    let fontSize = parseInt(getCssStyle(displayElement, 'font-size'), 10);

    while (contentWidth > parentWidth && fontSize > minFontSize) {
        fontSize -= 2;
        displayElement.style.fontSize = `${fontSize}px`;

        let sumIconWidths = 0;
        for(let icon of icons) {
            let iconFontSize = parseInt(getCssStyle(icon, 'font-size'), 10);
            iconFontSize -= 1;
            icon.style.fontSize = `${iconFontSize}px`;
            sumIconWidths += icon.offsetWidth;
        }
        contentWidth = getElementTextWidth(displayElement) + sumIconWidths;
    }

    while (contentWidth < parentWidth && fontSize < maxFontSize) {
        fontSize += 2;
        displayElement.style.fontSize = `${fontSize}px`;

        let sumIconWidths = 0;
        for(let icon of icons) {
            let iconFontSize = parseInt(getCssStyle(icon, 'font-size'), 10);
            iconFontSize += 1;
            icon.style.fontSize = `${iconFontSize}px`;
            sumIconWidths += icon.offsetWidth;
        }
        contentWidth = getElementTextWidth(displayElement) + sumIconWidths;
    }

    if (contentWidth > parentWidth + 40) {
        return false
    }
    return true;
}

document.querySelector(".lower-half").textContent = "0";
const buttons = document.querySelectorAll(".button");
for(let button of buttons) {
    digitOrOperator(button);
    button.addEventListener("click", pressed);
}

var currentYear = new Date().getFullYear();

document.querySelector(".footer").innerHTML += currentYear;