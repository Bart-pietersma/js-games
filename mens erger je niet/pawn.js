class Pawn extends HTMLElement{
    constructor(team){
        super();
        this.team = team;
    }

    connectedCallback(){
        this.setAttribute('player', this.team);
    }

    get grid(){
        return this.tile.parentElement.nodeName == 'GAME-GRID' ? this.tile.parentElement : 'not in the grid';
    }

    get tile(){
        return this.parentElement.nodeName == 'GRID-TILE' ? this.parentElement : 'not in the grid';
    }

    move(amount){

    }

    get onBase(){
        return this.tile.getAttribute('basetile') ? true : false;
    }

}
customElements.define('niet-pawn', Pawn);
export {Pawn};