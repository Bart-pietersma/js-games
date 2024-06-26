class Pawn extends HTMLElement{
    constructor(team,pawnNumber){
        super();
        this.team = team;
        this.pawnNumber = pawnNumber;
    }

    connectedCallback(){
        this.setAttribute('player', this.team);
        this.setAttribute('number', this.pawnNumber);
    }

    get grid(){
        return this.tile.parentElement.nodeName == 'GAME-GRID' ? this.tile.parentElement : 'not in the grid';
    }

    get tile(){
        return this.parentElement.nodeName == 'GRID-TILE' ? this.parentElement : 'not in the grid';
    }

    get board(){
        return document.querySelector('mens-erger-je-niet');
    }

    get number() {
        return this.pawnNumber;
    }

    get color(){
        const arr = ['blauw','rood','groen','geel'];
        return  arr[this.team -1];
    }

    get path(){
        return this.board.playerpath;
    }

    get location(){
        if(!this.onBase && !this.onFinish){
            let i = 0;
            while(this.path[i] != this.tile ){
                i++;
            }
            return i;
        }
        return false;
    }

    get onBase(){
        return this.tile.getAttribute('basetile') ? true : false;
    }

    get onFinish(){
        return this.tile.getAttribute('finish') ? true : false;
    }

    get moveTiles(){
        const diceroll = this.board.diceValue;
        if(this.onBase && diceroll == 6 && this.path[0].piece?.team != this.team) return this.path[0];
        else if(this.onFinish)return false;
        else if(!this.onBase){
            //check if going past finish and counts backwards
            if(this.location + diceroll >= this.path.length){
                const fromBack = this.location + diceroll - (this.path.length - 1) + 1;
                return this.path[this.path.length - fromBack];
            }

            const tile = this.path[this.location + diceroll];
            if(tile.piece?.team != this.team)return tile; 
            return false;
        }
        return false;
    }

}
customElements.define('niet-pawn', Pawn);
export {Pawn};