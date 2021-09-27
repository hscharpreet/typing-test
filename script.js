const RAMDOM_QUOTE_API_URL = "https://api.quotable.io/random"
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const progressElement = document.getElementById('progress')
const resultElement = document.getElementById('result')
const restartButton = document.getElementById('restart')
const jadeTheme = document.getElementById('themeJade')
const ecoTheme = document.getElementById('themeEco')
const paperTheme = document.getElementById('themePaper')
const splashTheme = document.getElementById('themeSplash')
const retroTheme = document.getElementById('themeRetro')
let quote = ''


const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
}

function switchTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function getRandomQuote() {
    return fetch(RAMDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content)
}

async function renderNewQuote() {
    quote = await getRandomQuote()
    quoteDisplayElement.innerHTML = ''
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span')
        characterSpan.innerText = character
        quoteDisplayElement.appendChild(characterSpan)
    })
    quoteInputElement.value = null
    quoteInputElement.focus()
    updateProgress()
}

quoteInputElement.addEventListener('input', () => {
    checkQuote()
    updateProgress()
    if (progress == false) {
        progress = true
        startTime = new Date()
    }
})

function checkQuote() {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span')
    const  arrayValue = quoteInputElement.value.split('')

    let correct = true
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index]
        if (character == null) {
            characterSpan.classList.remove('correct')
            characterSpan.classList.remove('incorrect')
            correct = false
        }else if (character === characterSpan.innerHTML) {
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')
        } else {
            characterSpan.classList.add('incorrect')
            characterSpan.classList.remove('correct')
            correct = false
        }
    })

    if (correct) endProgress()
}

let progress = false
resultElement.style.display = "none";
let StartTime = 0
function updateProgress() {
    quoteLength = quote.split(" ").length
    inputLength = quoteInputElement.value.split(" ").length - 1
    progressElement.innerHTML = inputLength + " / " + quoteLength
}

function endProgress() {
    timeElapsed = (new Date() - startTime) / 1000
    characterTyped = quote.length
    quoteInputElement.disabled = true
    let wpm = Math.round((((characterTyped / 5) / timeElapsed) * 60))
    
    resultElement.style.display = "block";
    progressElement.style.display = "none";
    resultElement.innerText = wpm + " wpm"

    restartButton.focus();
    progress = false
}

restartButton.onclick = function(){
    resultElement.style.display = "none";
    progressElement.style.display = "block";
    quoteInputElement.disabled = false
    progress = false
    quoteInputElement.focus()
    renderNewQuote()
};

jadeTheme.onclick = function(){
    switchTheme('jade')
};
ecoTheme.onclick = function(){
    switchTheme('eco')
};
paperTheme.onclick = function(){
    switchTheme('paper')
};
splashTheme.onclick = function(){
    switchTheme('splash')
};
retroTheme.onclick = function(){
    switchTheme('retro')
};

renderNewQuote()