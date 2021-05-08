import Bomb from "./bomb.js"
import Fruit from "./fruit.js"
import Player from "./player.js"
import { highscore } from "./auth.js"
import { setHighScore } from "./auth.js"
import { userData } from "./auth.js"
import { isMuted } from "./auth.js"
export { darkMode }
export { lightMode }
export { mute }
export { unmute }

const board = document.getElementById('board');
const player = new Player();
const statusView = document.createElement('div');
const scoreView = document.createElement('div');
const livesView = document.createElement('div');
const playButton = document.createElement('button');
const overlay = document.createElement('div');
const resetButton = document.getElementById('reset');
const startButton = document.getElementById('start');
const iconView = document.getElementById('icon');
const cityView = document.getElementById('city');
const weatherView = document.getElementById('weather');
const tempView = document.getElementById('temp');
const lightButton = document.getElementById('light');
const darkButton = document.getElementById('dark');
const tabs = document.querySelectorAll('.tab');
const search = document.getElementById('search-form');
const title = document.querySelector('.title');
const subtitle = document.querySelector('.subtitle');
const fact = document.getElementById('fact');
const factModal = document.getElementById('fact-modal');
const factBG = document.getElementById('fact-bg');
const muteButton = document.getElementById('mute');


const explosion = document.createElement('audio');
explosion.src = './sfx/8bit_bomb_explosion.wav';
const fruitsfx = document.createElement('audio');
fruitsfx.src = './sfx/Collect_Point_01.wav';
const gameOversfx = document.createElement('audio');
gameOversfx.src = './sfx/Jingle_Lose_00.wav';
const startsfx = document.createElement('audio');
startsfx.src = './sfx/Jingle_Achievement_00.wav'
const song = document.createElement('audio');
song.src = './sfx/song.mp3'

let reqAnim;
let isFirst = true;
let isGameOver = false;
let score = 0;
let lives = 3;
let gameFrame = 0;
let bombArr = [];
let fruitArr = [];
let hasStarted = false;
let locAllow = false;
let city = 'Chapel Hill';
let coor = {
    lon: 0,
    lat: 0
}
let defaultBG = "url('./img/daybg.png')"
let isDefault = false;
let charChose = false;

function drawAssets() {

    scoreView.classList.add('score');
    scoreView.innerHTML = 'Score: 0';
    board.appendChild(scoreView)

    livesView.classList.add('lives');
    livesView.innerHTML = 'Lives: 3';
    board.appendChild(livesView);

    overlay.classList.add('overlay');
    overlay.style.display = 'none';
    board.appendChild(overlay)

    playButton.classList.add('play')
    playButton.innerHTML = '<img src="'

}


function createFruit() {
    if (gameFrame % 200 == 0) {
        let fruit = new Fruit();
        fruit.draw()
        fruitArr.push(fruit);
    }
}

function moveFruit() {
    for (let i = 0; i<fruitArr.length; i++) {
        fruitArr[i].y -= fruitArr[i].speed;
        let view = fruitArr[i].view;
        if(fruitArr[i].y < 0) {
            view.classList.remove('fruit');
            fruitArr.splice(i,1);
        } else {
            view.style.bottom = fruitArr[i].y + 'px';
        }
        
    }
}

function createBombs() {
    if (gameFrame % 300 == 0) {
        let bomb = new Bomb();
        bomb.draw();
        bombArr.push(bomb);
    }
}

function moveBombs() {
    for (let i = 0; i<bombArr.length; i++) {
        bombArr[i].y -= bombArr[i].speed;
        let view = bombArr[i].view;
        if(bombArr[i].y < 0) {
            view.classList.remove('bomb');
            bombArr.splice(i,1);
        } else {
            view.style.bottom = bombArr[i].y + 'px';
        }
        
    }
}


function moveHandler(e) {
    if (e.key === 'ArrowLeft') {
        moveLeft();
    } else if (e.key === 'ArrowRight') {
        moveRight();
    }
}

function moveLeft() {
    player.x -= player.speed;
    let view = player.view;
    if (player.x < 0) {
        player.x = 0;
    }
    view.style.left = player.x + 'px';
}

function moveRight() {
    player.x += player.speed;
    let view = player.view;
    if (player.x > 700) {
        player.x = 700;
    }
    view.style.left = player.x + 'px';
}

function testScore() {
    for (let i = 0; i<fruitArr.length; i++) {
        if ((player.x <= fruitArr[i].centerX && player.x + 50 >= fruitArr[i].centerX) && (player.y <= fruitArr[i].y && player.y + 104 >= fruitArr[i].y)) {
            fruitsfx.play();
            let view = fruitArr[i].view;
            view.classList.remove('fruit');
            fruitArr.splice(i,1);
            score++;
            scoreView.innerHTML = `Score: ${score}`;
            scoreView.style.color = 'green';
            setTimeout(function(){scoreView.style.color = 'black'}, 1000);
            
        }
    }
}

function testBomb() {
    for (let i = 0; i<bombArr.length; i++) {
        if ((player.x <= bombArr[i].centerX && player.x + 50 >= bombArr[i].centerX) && (player.y <= bombArr[i].y && player.y + 104 >= bombArr[i].y)) {
            explosion.play();
            let view = bombArr[i].view;
            view.classList.remove('bomb');
            bombArr.splice(i,1);
            lives--;
            //console.log(score);
            livesView.innerHTML = `Lives: ${lives}`;
            if (lives === 0) {
                isGameOver = true;
            }
            overlay.style.display = "block";
            setTimeout(function() {
                overlay.style.display = "none";
            }, 1000);
            livesView.style.color = 'red';
            setTimeout(function(){livesView.style.color = 'black'}, 1000);
        
        }
    }
}

function clear() {
    cancelAnimationFrame(reqAnim);
    fruitArr.forEach(fruit => {
        let fview = fruit.view;
        fview.classList.remove('fruit');
    })
    bombArr.forEach(bomb => {
        let bview = bomb.view;
        bview.classList.remove('bomb');
    })
}

function gameOver() {
    song.pause();
    gameOversfx.play();
    player.invis();
    let html = ''
    let url = "http://numbersapi.com/" + score;
    fetch(url)
        .then( (response) => response.text() )
        .then( (data) => {
            fact.innerHTML = data;
        })
        .then( () => {
            html += `<h3>Game Over!</h3>`
            if (highscore >= 0) {
                let hs = highscore;
                if (score > hs) {
                    hs = score;
                    setHighScore(hs);
                    html += `<p style="color:#5dd972;">New High Score!</p>`
                    let highscoreNum = document.getElementById('highscore-num')
                    highscoreNum.innerHTML = hs;
                } else {
                    html += `
                    <p>Your score was: ${score}</p>
                    <p style="color:#5dd972;">Your high score is: ${hs}</p>
                    `;
                }
            } else {
                html += `<p>Login to store your scores!`;
            }
            html += `<button class="button is-rounded is-info" id="fact-button">Click for a fun fact about your score</button>`
            statusView.innerHTML = html;
            clear();
            window.removeEventListener('keydown', moveHandler);
            let factButton = document.getElementById('fact-button');
            factButton.addEventListener('click', () => {
                factModal.classList.add('is-active');
            })
            factBG.addEventListener('click', () => {
                factModal.classList.remove('is-active');
            })
        })
}

let reset = function() {
    if (!charChose) {
        return
    }
    if (isFirst) {
        return
    }
    if (!isMuted) {
        song.play();
    }
    player.draw();
    clear();
    player.x = 350;
    let view = player.view;
    view.style.left = player.x + 'px';
    isGameOver = false;
    score = 0;
    lives = 3;
    gameFrame = 0;
    bombArr = [];
    fruitArr = [];
    hasStarted = false;
    scoreView.innerHTML = `Score: ${score}`;
    livesView.innerHTML = `Lives: ${lives}`;
    statusView.innerHTML = `<div class="start-prompt">Press Start</div>`;
}

function start() {
    isFirst = false;
    if (isGameOver) {
        return
    }
    if (!charChose) {
        return
    }
    statusView.innerHTML = '';
    if (!hasStarted) {
        window.addEventListener('keydown', moveHandler);
        startsfx.play();
        resetButton.disabled = true;
        setTimeout(function() {
            animate();
            resetButton.disabled = false;
        }, 3000);
        hasStarted = true;
    }
}

function setCityBG() {
    let cityURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=0c87cc862e25e5890b9092056495a1f4";
    fetch(cityURL)
        .then( (data) => data.json() )
        .then( function(d) {
            isDefault = false;
            if (d.weather[0].main === 'Clouds') {
                board.style.backgroundImage = "url('./img/cloudy.png')"
            } else if (d.weather[0].main === 'Rain' || d.weather[0].main === 'Thunderstorm') {
                board.style.backgroundImage = "url('./img/rain.png')"
            } else if (d.weather[0].main === 'Snow') {
                board.style.backgroundImage = "url('./img/snow.png')"
            } else {
                board.style.backgroundImage = defaultBG;
                isDefault = true;
            }
        })
        .then( function() {
            getWeather(cityURL)
        })
}

function setCoorBG() {
    let coorURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + coor.lat + "&lon=" + coor.lon + "&units=imperial&APPID=0c87cc862e25e5890b9092056495a1f4"
    fetch(coorURL)
        .then( (data) => data.json() )
        .then( function(d) {
            isDefault = false;
            if (d.weather[0].main === 'Clouds') {
                board.style.backgroundImage = "url('./img/cloudy.png')"
            } else if (d.weather[0].main === 'Rain') {
                board.style.backgroundImage = "url('./img/rain.png')"
            } else if (d.weather[0].main === 'Snow') {
                board.style.backgroundImage = "url('./img/snow.png')"
            } else {
                board.style.backgroundImage = defaultBG
                isDefault = true;
            }
        })
        .then( function() {
            getWeather(coorURL)
        })
}

function locationBG(position) {
    //console.log('in locationBG')
    coor.lon = position.coords.longitude;
    coor.lat = position.coords.latitude;
    locAllow = true;
    setCoorBG();
}

function getWeather(url) {
    fetch(url)
        .then( (data) => data.json() )
        .then( function(w) {
            //console.log(w)
            let icon = "https://openweathermap.org/img/w/" + w.weather[0].icon + ".png";
            let weather = w.weather[0].main
            let temp = Math.floor(w.main.temp);
            let city = (w.name === 'Globe') ? 'Your Location' : w.name;
            iconView.src = icon;
            weatherView.innerHTML = weather;
            tempView.innerHTML = temp;
            cityView.innerHTML = `<img id="marker" src="./img/marker.png"></img> ${city}`;
        })
}



function animate() {
    gameFrame++;
    createFruit();
    moveFruit();
    createBombs();
    moveBombs();
    testScore();
    testBomb();
    if (isGameOver) {
        gameOver();
        return;
    }
    reqAnim = requestAnimationFrame(animate);
}


let darkMode = function() {
    if (userData) {
        let docRef = db.collection('scores').doc(userData.uid)
        docRef.update({
            isDarkMode: true,
        })
    }
    document.body.style.background = "#383838"
    title.style.color = "#b8b8b8";
    subtitle.style.color = "#b8b8b8";
    tabs.forEach( (tab) => {tab.style.color = "#b8b8b8"});
    lightButton.classList.remove('is-black')
    lightButton.classList.remove('is-selected')
    lightButton.classList.add('is-light')
    darkButton.classList.remove('is-light')
    darkButton.classList.add('is-black')
    darkButton.classList.add('is-selected')
    defaultBG = "url('./img/nightbg.png')"
    if (isDefault) {
        board.style.backgroundImage = defaultBG;
    } 
}

let lightMode = function() {
    if (userData) {
        let docRef = db.collection('scores').doc(userData.uid)
        docRef.update({
            isDarkMode: false,
        })
    }
    document.body.style.background = 'white'
    title.style.color = "black";
    subtitle.style.color = "black";
    tabs.forEach( (tab) => {tab.style.color = "black"});
    darkButton.classList.remove('is-black')
    darkButton.classList.remove('is-selected')
    darkButton.classList.add('is-light')
    lightButton.classList.remove('is-light')
    lightButton.classList.add('is-black')
    lightButton.classList.add('is-selected')
    defaultBG = "url('./img/daybg.png')"
    if (isDefault) {
        board.style.backgroundImage = defaultBG;
    } 
}

let mute = function() {
    if (isGameOver) {
        return
    }
    if (userData) {
        let docRef = db.collection('scores').doc(userData.uid)
        docRef.update({
            isMuted: true,
        })
    }
    if (charChose) {
        song.pause();
    }
    muteButton.classList.remove('is-success');
    muteButton.classList.add('is-danger');
    muteButton.innerHTML = `<img src="./img/soundoff.png" width="30" height="30"></img>`
    muteButton.removeEventListener('click', mute);
    muteButton.addEventListener('click', unmute);
}

let unmute = function() {
    if (isGameOver) {
        return
    }
    if (userData) {
        let docRef = db.collection('scores').doc(userData.uid)
        docRef.update({
            isMuted: false,
        })
    }
    if (charChose) {
        song.play();
    }
    muteButton.classList.remove('is-danger');
    muteButton.classList.add('is-success');
    muteButton.innerHTML = `<img src="./img/soundon.png" width="30" height="30"></img>`
    muteButton.removeEventListener('click', unmute);
    muteButton.addEventListener('click', mute);
}


let selectChar = function() {
    statusView.innerHTML = `
    <div class="char-select">
    <p>Choose Your Character: </p>
    <button id="girl"><img src="./img/girl.png"></button>
    <button id="boy"><img src="./img/boy.png"></button>
    </div>
    `;
    const girlButton = document.getElementById('girl');
    const boyButton = document.getElementById('boy');
    girlButton.addEventListener('click', girlHandler);
    boyButton.addEventListener('click', boyHandler);
}

let girlHandler = function() {
    player.img = "url('./img/girl.png')"
    drawAssets();
    player.draw();
    statusView.innerHTML = '<div class="start-prompt">Press Start</div>';
    charChose = true;
    if (!isMuted) {
        song.play();
    }
    muteButton.disabled = false;
}

let boyHandler = function() {
    player.img = "url('./img/boy.png')"
    drawAssets();
    player.draw();
    statusView.innerHTML = '<div class="start-prompt">Press Start</div>';
    charChose = true;
    if (!isMuted) {
        song.play();
    }
    muteButton.disabled = false;
}


window.addEventListener('load', () => {
    board.style.backgroundImage = "url('./img/daybg.png')";
    navigator.geolocation.getCurrentPosition(locationBG, setCityBG);
    resetButton.addEventListener('click', reset);
    startButton.addEventListener('click', start);
    lightButton.addEventListener('click', lightMode);
    darkButton.addEventListener('click', darkMode);
    muteButton.addEventListener('click', mute);
    search.addEventListener('submit', (e) => {
        console.log('in search')
        e.preventDefault();
        city = search['search'].value;
        setCityBG();
        search['search'].value = '';
    })
    muteButton.disabled = true;
    statusView.classList.add('status');
    board.appendChild(statusView);
    selectChar();
})
