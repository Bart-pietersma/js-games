class ChessTile extends HTMLElement{
    constructor(x,y){
        super()
        this.x = x;
        this.y = y;
        this.setAttribute('coord', `[${x},${y}]`);
    }

    connectedCallback(){
        this.setBackgroundColor();
    }

    get coord(){
        return JSON.parse(this.getAttribute('coord'));
    }

    get piece(){
        //todo
        return this.querySelector('chess-piece');
    }

    setBackgroundColor(){
        // if row and column are even color 1 and if row and culomn are odd color 1 else color 2
        this.style.backgroundColor = ((this.y +1) % 2 == 0 && (this.x + 1) % 2 == 0) || ((this.y +1) % 2 != 0 && (this.x + 1) % 2 != 0) ? 'var(--square-color-1)' : 'var(--square-color-2)';
    }
}
customElements.define('chess-tile', ChessTile);

export {ChessTile}
console.log('chess-tile.js loaded');