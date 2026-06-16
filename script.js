console.log("Script loaded");

(() => {
    const input = document.querySelector("#result");
const clearButton = document.querySelector("#btn-clear");

console.log("Input element:", input);
console.log("Clear button:", clearButton);

clearButton.addEventListener("click", () => {
    input.value = "";
});

document.querySelectorAll(".value").forEach((button) => {
    button.addEventListener("click", () => {
        if (input.value.slice(-1) !== "." && button.textContent === ".") {
            input.value += button.textContent;
        } else if (input.value.slice(-1) === "." && button.textContent === ".") {
            // Do nothing, prevent multiple decimal points
        } else {
            input.value += button.textContent;
        }
    });
})
document.querySelectorAll(".operation").forEach((button) => {
    button.addEventListener("click", () => {
        if (input.value.slice(-1) !== "+" && input.value.slice(-1) !== "-" && input.value.slice(-1) !== "x" && input.value.slice(-1) !== "/" && input.value.slice(-1) !== "%") {
            input.value += button.textContent;
        } else {
            input.value = input.value.slice(0, -1) + button.textContent;
        }
    });
})
document.querySelectorAll(".backspace").forEach((button) => {
    button.addEventListener("click", () => {
        input.value = input.value.slice(0, -1);
    });
})
const evaluate = () => {
    try {
        const calcul = input.value;
        let expression = input.value.replace(/x/g, "*").replace(/%/g, "/100");
        if (!/^[0-9+\-*/().eE\s]+$/.test(expression)) {
            input.value = "Error";
            return;
        }
        const result = Function('"use strict"; return (' + expression + ')')();
        
        // Vérifier seulement si c'est NaN
        if (isNaN(result)) {
            input.value = "Error";
            return;
        }
        
        input.value = result;
        
        // Ajouter le résultat à la liste seulement s'il y a un calcul (avec opérateur)
        if (/[+\-x/%]/.test(calcul)) {
            addToList(calcul, result);
        }
    } catch (e) {
        input.value = "Error";
    }
};

const addToList = (calcul, value) => {
    const scrollList = document.querySelector("#scroll-list");
    const newItem = document.createElement("li");
    newItem.textContent = calcul + " = " + value;
    
    // Au clic, ajouter le contenu à l'input
    newItem.addEventListener("click", () => {
        input.value = newItem.textContent.split("=")[1].trim();
    });
    
    scrollList.appendChild(newItem);
    
    // Scroll automatiquement vers le bas
    setTimeout(() => {
        scrollList.scrollTop = scrollList.scrollHeight;
    }, 0);
};

const equalButton = document.querySelector(".btn-equal");
if (equalButton) {
    equalButton.addEventListener("click", evaluate);
}

input.addEventListener("keypress", (e) => {
    const allowed = "0123456789+-x/%eE";
    if (!allowed.includes(e.key)) {
        e.preventDefault(); // Bloque les caractères invalides
    }
});

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        evaluate();
    }
});

})();
