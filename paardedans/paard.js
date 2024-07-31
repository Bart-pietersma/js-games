
class Paard extends HTMLElement{
    constructor(){
        super()
        
            const type = this.pieceTypes["n"];
            type && this.toggleAttribute(type , true);
            this.setAttribute(`player`, 1);

            //make img
            // const img = document.createElement('img');
            // img.src = `./black-knight.svg`
            // img.width = 80;
            // img.height = 80;
            // this.append(img);
    }

    connectedCallback(){
        this.cell && this.cell.setDragable();
    }

    closestElement(selector, el = this) {
        return (
            (el && el != document && el != window && el.closest(selector)) ||
            this.closestElement(selector, el.getRootNode().host)
        );
    }
    get grid() {
        return this.closestElement("game-grid");
    }


    get cell(){
        //to prefent a inf loop when a piece is not on the board
        return this.parentElement.nodeName == 'GRID-TILE'? this.closestElement("grid-tile"): false;
    }

    get x(){
        return this.cell.x;
    }

    get y(){
        return this.cell.y;
    }

    get letter(){
        if(this.type == 'knight')return this.color == 'white'? 'N' : 'n';
        return this.color == 'white'? this.type.charAt(0).toUpperCase() : this.type.charAt(0).toLowerCase() ;
    }

    get type(){
        return [...this.attributes].map(atibute =>{
            if(atibute.name == 'knight')return this.pieceTypes['n'];
            else if(this.pieceTypes[atibute.name.charAt(0)] == atibute.name)return atibute.name
        }).filter(n => n)[0];
    }

    get color(){
        return [...this.attributes].map(atibute =>{
            if(this.teams.includes(atibute.name)) return atibute.name;
        }).filter(n => n)[0];
    }
    get team(){
        return this.color;
    }
    get otherColor(){
       return this.color == 'black'? 'white' : 'black';
    }

    get pieceTypes(){
        return {'r':'rook','n':'knight','b':'bishop','q':'queen','k':'king','p':'pawn'};
    }

    get teams(){
        return ['black','white'];
    }

    get moves(){
        // look at type and give back its moves
        return { move : this.allowedMoves};
    }

    get knightMoves(){
        const moves = [[this.x-2,this.y-1],[this.x -2, this.y+1],[this.x -1, this.y-2],[this.x -1, this.y+2],[this.x +1, this.y-2],[this.x +1, this.y+2],[this.x +2,this.y-1],[this.x +2,this.y+1]];
        return this.grid.getCells(moves.map(coord =>{
            if((coord[0] >= 0 && coord[0] < this.grid.columns.length )&&(coord[1] >= 0 && coord[1] < this.grid.rows.length))return coord ;
        }).filter(n => n));
    }

    get allowedMoves(){
            return this.knightMoves.filter(cell => !cell.hasAttribute('checked'));
    }

    attackcell(cell,king = false){
        // return true if it can attack the cell
        if(this.type == 'pawn')return this.pawnAttackMoves.includes(cell)
        else if(this.type == 'king')return this.kingAttackMoves.includes(cell)
        else return this.allowedMoves.includes(cell) 
    }
    
}

customElements.define('paard-springer', Paard);
export {Paard}
