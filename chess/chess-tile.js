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

    get chessCoord(){// ec e1 or g6
        return String.fromCharCode(this.coord[0]+65).toLocaleLowerCase()+(this.coord[1]+1);
    }

    get piece(){
        //todo
        return this.querySelector('chess-piece');
    }

    get moveType(){
        // return move attack or false
    return  this.hasAttribute('attack')? 'attack' : this.hasAttribute('move')? "move" : false;
    }

    setBackgroundColor(){
        // if row and column are even color 1 and if row and culomn are odd color 1 else color 2
        this.toggleAttribute((((this.y +1) % 2 == 0 && (this.x + 1) % 2 == 0) || ((this.y +1) % 2 != 0 && (this.x + 1) % 2 != 0) ? 'light' : 'dark') ,true)
    }
}
customElements.define('chess-tile', ChessTile);

export {ChessTile}
console.log('chess-tile.js loaded');