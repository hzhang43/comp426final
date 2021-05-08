export default class Bomb{
    
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
        view.classList.add('bomb');
        view.style.left = this.x + 'px';
        view.style.bottom = this.y + 'px';
        board.appendChild(view);
    }

}
