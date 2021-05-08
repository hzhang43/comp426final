window.addEventListener('load', () => {
    const signupButton = document.getElementById('signup-button');
    const loginButton = document.getElementById('login-button');
    const rulesButton = document.getElementById('rules-button');
    const acctButton = document.getElementById('account-button');

    const signupModal = document.getElementById('signup');
    const loginModal = document.getElementById('login');
    const rulesModal = document.getElementById('rules');
    const acctModal = document.getElementById('account');

    const signupBG = document.getElementById('signup-bg');
    const loginBG = document.getElementById('login-bg');
    const rulesBG = document.getElementById('rules-bg');
    const acctBG = document.getElementById('account-bg');

    signupButton.addEventListener('click', () => {
        signupModal.classList.add('is-active');
    })

    signupBG.addEventListener('click', () => {
        signupModal.classList.remove('is-active');
    })

    loginButton.addEventListener('click', () => {
        loginModal.classList.add('is-active');
    })

    loginBG.addEventListener('click', () => {
        loginModal.classList.remove('is-active');
    })

    rulesButton.addEventListener('click', () => {
        rulesModal.classList.add('is-active');
    })

    rulesBG.addEventListener('click', () => {
        rulesModal.classList.remove('is-active');
    })

    acctButton.addEventListener('click', () => {
        acctModal.classList.add('is-active');
    })

    acctBG.addEventListener('click', () => {
        acctModal.classList.remove('is-active');
    })
})

