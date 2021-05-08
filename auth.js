let highscore;
export { highscore };
let userData;
export { userData }
export {setHighScore};
let isDarkMode;
export { isDarkMode };
let isMuted;
export { isMuted };
import { darkMode, lightMode, mute, unmute } from "./script.js";

auth.onAuthStateChanged( async (user) => {
    if (user) {
        userData = user;
        await getHighScore(user);
        let docRef = db.collection('scores').doc(user.uid);
        docRef.get().then( (doc) => {
            if (doc.exists) {
                isDarkMode = doc.data().isDarkMode;
                isMuted = doc.data().isMuted;
            }
        }).then( () => {setupUI(userData)} )
    } else {
        highscore = undefined;
        userData = null;
        isDarkMode = false;
        setupUI();
    }


})

// signup
const signupModal = document.getElementById('signup');
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signupForm['signup-email'].value;
    const pass = signupForm['signup-password'].value;
    auth.createUserWithEmailAndPassword(email, pass)
        .then( (cred) => {
            signupModal.classList.remove('is-active');
            signupForm.reset();
            let uid = cred.user.uid;
            let userEmail = cred.user.email;
            db.collection('scores').doc(uid).set({
                highscore: 0,
                email: userEmail,
                isDarkMode: false,
                isMuted: false
            })
        })
})


// login
const loginModal = document.getElementById('login');
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const pass = loginForm['login-password'].value;
    auth.signInWithEmailAndPassword(email, pass)
        .then( () => {
            loginModal.classList.remove('is-active');
            loginForm.reset();
        })
})

// logout
const logout = document.getElementById('logout-button');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
})


const getHighScore = async function(user) {
    let scoresRef = db.collection('scores').doc(user.uid);
    let userScores = await scoresRef.onSnapshot( (doc) => {
        if (doc.exists) {
            highscore = doc.data().highscore;
        }
    })
}

const setHighScore = function(score) {
    db.collection('scores').doc(userData.uid).update({
        highscore: score,
    })
}



const loggedOut = document.querySelectorAll('.logged-out');
const loggedIn = document.querySelectorAll('.logged-in');
const acct = document.getElementById('account-details')
let setupUI = function(user) {
    if (user) {
        let docRef = db.collection('scores').doc(user.uid)
        docRef.get().then( (doc) => {
            let html = `
            <p>Logged in as ${user.email}</p>
            <p>Your high score is: <span id="highscore-num">${doc.data().highscore}</span></p>
            `
            acct.innerHTML = html;
        })
        loggedOut.forEach( (item) => item.style.display = 'none' );
        loggedIn.forEach( (item) => item.style.display = 'block' );
        if (isDarkMode) {
            darkMode();
        } else {
            lightMode();
        }
    } else {
        loggedIn.forEach( (item) => item.style.display = 'none' );
        loggedOut.forEach( (item) => item.style.display = 'block' );
        lightMode();
    }
    if (isMuted) {
        mute();
    } else {
        unmute();
    }
}
