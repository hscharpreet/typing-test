const RAMDOM_QUOTE_API_URL = "https://api.quotable.io/random";
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const progressElement = document.getElementById("progress");
const resultElement = document.getElementById("result");
const restartButton = document.getElementById("restart");
const themeSetting = document.getElementById("themeSettings");
const themeOptions = document.getElementById("themeOptions");
let quote = "";

const allThemes = ["jade", "eco", "paper", "splash", "retro"];
allThemes.forEach(function (theme) {
    x = document.createElement("div");
    x.className = "theme-option";
    x.id = theme + "Theme";
    x.innerHTML = theme;
    themeOptions.appendChild(x);
});

let currentTheme = localStorage.getItem("theme")
    ? localStorage.getItem("theme")
    : null;
if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
}

function switchTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    currentTheme = theme;
}

let quoteSize = localStorage.getItem("quote-size")
    ? localStorage.getItem("quote-size")
    : "medium";
if (quoteSize) {
    document.documentElement.setAttribute("quote-size", quoteSize);
}

function switchQuoteSize(quoteSize) {
    localStorage.setItem("quote-size", quoteSize);
    renderNewQuote();
}

function getRandomQuote() {
    param = "";
    if (quoteSize == "short") param = "?maxLength=100";
    else if (quoteSize == "medium") param = "?minLength=120&maxLength=160";
    else param = "?minLength=180";
    url = RAMDOM_QUOTE_API_URL.concat(param);
    return fetch(url)
        .then((response) => response.json())
        .then((data) => data.content);
}

async function renderNewQuote() {
    quote = await getRandomQuote();
    quoteDisplayElement.innerHTML = "";
    quote.split("").forEach((character) => {
        const characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });
    quoteInputElement.value = null;
    quoteInputElement.focus();
    updateProgress();
    updateSettings();
}

quoteInputElement.addEventListener("input", () => {
    checkQuote();
    updateProgress();
    if (progress == false) {
        progress = true;
        startTime = new Date();
    }
});

function checkQuote() {
    const arrayQuote = quoteDisplayElement.querySelectorAll("span");
    const arrayValue = quoteInputElement.value.split("");

    let correct = true;
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove("correct");
            characterSpan.classList.remove("incorrect");
            correct = false;
        } else if (character === characterSpan.innerHTML) {
            characterSpan.classList.add("correct");
            characterSpan.classList.remove("incorrect");
        } else {
            characterSpan.classList.add("incorrect");
            characterSpan.classList.remove("correct");
            correct = false;
        }
    });

    if (correct) endProgress();
}

function updateSettings() {
    document.getElementById("shortQuote").classList.remove("active");
    document.getElementById("mediumQuote").classList.remove("active");
    document.getElementById("longQuote").classList.remove("active");
    
    document.getElementById(quoteSize+"Quote").classList.add("active");
}

let progress = false;
resultElement.style.display = "none";
let startTime = 0;
function updateProgress() {
    quoteLength = quote.split(" ").length;
    inputLength = quoteInputElement.value.split(" ").length - 1;
    progressElement.innerHTML = inputLength + " / " + quoteLength;
}

function endProgress() {
    timeElapsed = (new Date() - startTime) / 1000;
    characterTyped = quote.length;
    quoteInputElement.disabled = true;
    let wpm = Math.round((characterTyped / 5 / timeElapsed) * 60);

    resultElement.style.display = "block";
    progressElement.style.display = "none";
    resultElement.innerText = wpm + " wpm";

    restartButton.focus();
    progress = false;
}

restartButton.onclick = function () {
    resultElement.style.display = "none";
    progressElement.style.display = "block";
    quoteInputElement.disabled = false;
    progress = false;
    quoteInputElement.focus();
    renderNewQuote();
};

themeSetting.onmouseleave = function () {
    document.documentElement.setAttribute("data-theme", currentTheme);
};

themeOptions.addEventListener("mouseover", (e) => {
    let myEvent = e.target || e.currentTarget;
    theme = myEvent.innerHTML;
    document.documentElement.setAttribute("data-theme", theme);
});

themeOptions.addEventListener("click", (e) => {
    let myEvent = e.target || e.currentTarget;
    theme = myEvent.innerHTML;
    switchTheme(theme);
});

testOptions.addEventListener("click", (e) => {
    let myEvent = e.target || e.currentTarget;
    quoteSize = myEvent.innerHTML;
    switchQuoteSize(quoteSize);
});

renderNewQuote();
