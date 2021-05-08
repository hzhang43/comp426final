export default class Fruit {
    
    constructor() {
        this.x = Math.random() * 710 + 10;
        this.y = 470;
        this.speed = Math.random() * 3 + 1;
        this.view = document.createElement('div');
        this.centerX = this.x + 15;
    }

    draw() {
        let board = document.getElementById('board');
        const view = this.view;
        view.classList.add('fruit');
        view.style.left = this.x + 'px';
        view.style.bottom = this.y + 'px';
        let rand = Math.random();
        if (rand < 0.4) {
            view.style.backgroundImage = "url('./img/apple.png')";
        } else if (rand < 0.7) {
            view.style.backgroundImage = "url('./img/orange.png')";
        } else {
            view.style.backgroundImage = "url('./img/peach.png')";
        }
        board.appendChild(view);
    }

}
