/*
    only need basic rules?
    rook moves on x or y axis
    knight  moves 1 x or y then 1 diagnol
    bishop  moves on diagnol axis
    queen   rook + bishop

    need special rules
    king    moves 1 anny direction
    pawn    moves 1 forward and atacks 1 diagnaly forward and has a potential move of 2 forward at startposition

    <chess-piece type= pawn  team = black></chesspiece>
*/

import { importCss } from "./functions.js";


class ChessPiece extends HTMLElement{
    constructor(letter){
        super()
        console.log();
        if(letter){
            const team = letter == letter.toUpperCase()? 'white' : 'black';
            const type = this.pieceTypes[letter.toLowerCase()];
            type && this.toggleAttribute(type , true);
            team && this.toggleAttribute(team, true);
        }
    }

    connectedCallback(){
        importCss('chess-piece.css');
    }

    closestElement(selector, el = this) {
        return (
            (el && el != document && el != window && el.closest(selector)) ||
            this.closestElement(selector, el.getRootNode().host)
        );
    }
    get grid() {
        return this.closestElement("chess-grid");
    }

    get cell(){
        return this.closestElement("chess-tile");
    }

    get x(){
        return this.cell.x;
    }

    get y(){
        return this.cell.y;
    }

    get letter(){
        //todo knight bs
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
        return this[this.type+'Moves'];
    }

    get allowedMoves(){
        //looks at the moves and check ec dont go over pieces cant move in a direction that alowes the king to be taken
        if(this.type == 'rook' || this.type == 'bishop' || this.type == 'queen'){
            // reduced the rows till a piece and flat to make 1 array witt cells
           return this.moves.map(row => this.allowedRowMove(row)).flat();
        }
        else if(this.type == 'knight'){
            //check friendly fire
            return this.moves.map(cell => {return cell.piece?.color == this.otherColor || !cell.piece? cell : ''}).filter(n => n);
        }
        else if(this.type == 'pawn'){
            return this.moves
        }
        else if(this.type == 'king'){
            //todo test
            return this.moves.map(cell => {

                if(cell.piece) return ''
                else{
                  return !this.grid[this.otherColor+'Pieces'].map(piece => piece.attackcell(cell)).includes(true) && cell
                }
            }).filter(n => n);
        }
    }
    

    allowedRowMove(row){
        //stop the row if encounter a piece then look if its fomr other player
        let stop = 0
        return row.map(cell =>{
            if(stop == 0 && cell.piece){
                stop++
                //add cell if the blocker is a enemy
              return  cell.piece.color == this.otherColor &&  cell
            } 
            return stop == 0? cell :  '';
        }).filter(n => n);
    }

    get rookMoves(){
        // make 4 arrays 1 for each direction so later can break the array if it found a block
        const arr = [];

        let a = [];
        // <
        for(let x = this.cell.x -1; x >= 0; x--){
            a.push(this.grid.getCell(x, this.cell.y));
        }
        a.length > 0 && arr.push(a);
        
        a = [];
        // >
        for(let x = this.cell.x +1; x < this.grid.x; x++){
            a.push(this.grid.getCell(x, this.cell.y));
        }
        a.length > 0 && arr.push(a);

        a = [];
        // ^
        for(let y = this.cell.y -1; y >= 0 ; y--){
            a.push(this.grid.getCell(this.cell.x,y));
        }
        a.length > 0 && arr.push(a);

        a = [];
        // down
        for(let y = this.cell.y +1; y < this.grid.y; y++){
            a.push(this.grid.getCell(this.cell.x, y));
        }
        a.length > 0 && arr.push(a);

        return arr;
    }

    get bishopMoves(){
            // make 4 arrays 1 for each direction so later can break the array if it found a block
            const arr = [];

            let [a,x,y] = [[],this.cell.x +1,this.cell.y -1];
            // top right
            while(x < this.grid.x && y >= 0 ){
                a.push(this.grid.getCell(x,y));
                x ++;
                y--;
            }
            a.length > 0 && arr.push(a);

            [a,x,y] = [[],this.cell.x +1,this.cell.y +1];
            // bottom right
            while(x < this.grid.x && y < this.grid.y ){
                a.push(this.grid.getCell(x,y));
                x ++;
                y++;
            }
            a.length > 0 && arr.push(a);
            
            [a,x,y] = [[],this.cell.x -1,this.cell.y +1];
            // bottom left
            while(x >= 0 && y < this.grid.y ){
                a.push(this.grid.getCell(x,y));
                x --;
                y++;
            }
            a.length > 0 && arr.push(a);

            [a,x,y] = [[],this.cell.x -1,this.cell.y -1];
            // bottom right
            while(x >= 0 && y >= 0 ){
                a.push(this.grid.getCell(x,y));
                x--;
                y--;
            }
            a.length > 0 && arr.push(a);


        return arr;
    }

    get queenMoves(){
        return this.rookMoves.concat(this.bishopMoves);
    }

    get knightMoves(){
        const moves = [[this.x-2,this.y-1],[this.x -2, this.y+1],[this.x -1, this.y-2],[this.x -1, this.y+2],[this.x +1, this.y-2],[this.x +1, this.y+2],[this.x +2,this.y-1],[this.x +2,this.y+1]];
        return this.grid.getCells(moves.map(coord =>{
            if((coord[0] >= 0 && coord[0] < this.grid.columns.length )&&(coord[1] >= 0 && coord[1] < this.grid.rows.length))return coord ;
        }).filter(n => n));
    }

    get pawnMoves(){
        const dir = this.color == 'white'? this.y - 1 : this.y + 1;
        const moves = this.grid.getCell(this.x, dir).piece == null? [this.grid.getCell(this.x, dir)] : [];
        //startmoves
        this.color == 'black' && this.y == 1 && moves.length > 0 && moves.push(this.grid.getCell(this.x , dir +1));
        this.color == 'white' && this.y == 6 && moves.length > 0&& moves.push(this.grid.getCell(this.x , dir -1));
        // attack moves
        //! problem for attackcell
        //todo add enpassant (|| (this.getCell(stuf) == enpassantCell)
        this.grid.getCell(this.x -1, dir)?.color == this.otherColor && moves.push(this.grid.getCell(this.x -1,dir));
        this.grid.getCell(this.x + 1, dir)?.color == this.otherColor && moves.push(this.grid.getCell(this.x + 1,dir));
        return moves;
    }
    get pawnAttackMoves(){
        const dir = this.color == 'white'? this.y - 1 : this.y + 1;
        return [this.grid.getCell(this.x -1,dir),this.grid.getCell(this.x + 1,dir)]
    }

    get kingMoves(){
        const moves = this.queenMoves.map(array => array[0]).filter(n => n);
        //todo check castling
        // add castling moves
        return moves
    }

    attackcell(cell,king = false){
        //todo
        // return true if it can attack the cell
        if(this.type == 'pawn')return this.pawnAttackMoves.includes(cell)
        //! 2 kings bugg imposivle
        else if(this.type == 'king')return this.moves.includes(cell)
        else return this.allowedMoves.includes(cell) 
    }
    
}
customElements.define('chess-piece', ChessPiece);

export {ChessPiece}
console.log('chess-piece.js loaded');