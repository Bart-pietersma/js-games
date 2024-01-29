class Pawn extends HTMLElement{
    constructor(team){
        super();
        this.team = team;
    }

    connectedCallback(){
        this.setAttribute('player', this.team);
    }

    get grid(){
        return 
    }

    get tile(){

    }

    move(amount){

    }

}
customElements.define('niet-pawn', Pawn);
export {Pawn};