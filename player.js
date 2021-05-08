export default class Player {
    
    constructor() {
        this.x = 350;
        this.y = 0;
        this.speed = 10;
        this.view = document.createElement('div');
        this.centerX = this.x + 25;
        this.centerY = 52;
        this.img = "url('./img/boy.png')";
    }

    draw() {
        let board = document.getElementById('board');
        const view = this.view;
        view.classList.add('player');
        view.style.left = this.x + 'px';
        view.style.bottom = this.y + 'px';
        view.style.backgroundImage = this.img;
        board.appendChild(view);
    }

    invis() {
        const view = this.view;
        view.style.backgroundImage = '';
    }

}