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
        // Effacer Error ou Infinity en commençant un nouveau calcul
        if (input.value === "Error" || input.value === "Infinity") {
            input.value = button.textContent;
        } else if (input.value.slice(-1) !== "." && button.textContent === ".") {
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
        // Effacer Error ou Infinity quand on commence une opération
        if (input.value === "Error" || input.value === "Infinity") {
            input.value = "";
        }
        
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
        
        // Vérifier si c'est NaN ou Infinity
        if (isNaN(result) || !isFinite(result)) {
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
    
    // Créer un span pour le texte
    const textSpan = document.createElement("span");
    textSpan.textContent = calcul + " = " + value;
    textSpan.style.cursor = "pointer";
    
    // Au clic sur le texte, ajouter le contenu à l'input
    textSpan.addEventListener("click", (e) => {
        e.stopPropagation();
        input.value = textSpan.textContent.split("=")[1].trim();
    });
    
    // Créer un bouton supprimer
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    const deleteImg = document.createElement("img");
    deleteImg.src = "https://cdn-icons-png.flaticon.com/512/1345/1345874.png";
    deleteImg.alt = "Supprimer";
    deleteBtn.appendChild(deleteImg);
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        newItem.remove();
        saveToLocalStorage();
    });
    
    newItem.appendChild(textSpan);
    newItem.appendChild(deleteBtn);
    scrollList.appendChild(newItem);
    
    // Sauvegarder dans localStorage
    saveToLocalStorage();
    
    // Scroll automatiquement vers le bas
    setTimeout(() => {
        scrollList.scrollTop = scrollList.scrollHeight;
    }, 0);
};

const saveToLocalStorage = () => {
    const list = document.querySelectorAll("#scroll-list li");
    const data = Array.from(list).map(li => {
        const span = li.querySelector("span");
        return span ? span.textContent : li.textContent;
    });
    localStorage.setItem('calculatrice-historique', JSON.stringify(data));
};

const loadFromLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem('calculatrice-historique'));
    if (data && Array.isArray(data)) {
        data.forEach(item => {
            const scrollList = document.querySelector("#scroll-list");
            const newItem = document.createElement("li");
            
            const textSpan = document.createElement("span");
            textSpan.textContent = item;
            textSpan.style.cursor = "pointer";
            
            textSpan.addEventListener("click", (e) => {
                e.stopPropagation();
                input.value = item.split("=")[1].trim();
            });
            
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            const deleteImg = document.createElement("img");
            deleteImg.src = "https://cdn-icons-png.flaticon.com/512/1345/1345874.png";
            deleteImg.alt = "Supprimer";
            deleteBtn.appendChild(deleteImg);
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                newItem.remove();
                saveToLocalStorage();
            });
            
            newItem.appendChild(textSpan);
            newItem.appendChild(deleteBtn);
            scrollList.appendChild(newItem);
        });
    }
};

const equalButton = document.querySelector(".btn-equal");
if (equalButton) {
    equalButton.addEventListener("click", evaluate);
}

input.addEventListener("keypress", (e) => {
    const allowed = "0123456789+-x/%eE";
    if (!allowed.includes(e.key)) {
        e.preventDefault(); // Bloque les caractères invalides
        return;
    }
    
    // Effacer Error ou Infinity quand on commence à taper
    if (input.value === "Error" || input.value === "Infinity") {
        if (/[0-9]/.test(e.key)) {
            input.value = e.key;
            e.preventDefault();
        } else if (/[+\-x/%]/.test(e.key)) {
            input.value = "";
        }
    }
});

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        evaluate();
    }
});

// Charger l'historique au démarrage
loadFromLocalStorage();

})();
