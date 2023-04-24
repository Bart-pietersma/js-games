import { ChessGrid } from "./chess-grid.js";
import { importCss } from "./functions.js";
import { ChessPlayer } from "./chess-player.js";
import { ChessPiece } from "./chess-piece.js";

//todo
/*
include board collor
allow all movement until a color is asigned to board
leave a way to walk for script input
send a msg to api when a move has been send and board has coresponding atribute

*/

customElements.define('chess-board',class ChessBoard extends HTMLElement {
    constructor(){
        super()
        this.player1 = new ChessPlayer('white');
        this.player2 = new ChessPlayer('black');
        this.selected = 0;
        // this.socket = new WebSocket();
    }
    
    connectedCallback(){
        importCss('chess-board.css');
        this.constructBoard();
        this.fen = this.hasAttribute('fen')?  this.getAttribute('fen') : this.defaultFen ;

        //click, touch and drag handlers
        document.addEventListener('click', e => this.clickHandler(e));
        this.addEventListener('contextmenu', e => this.rightClickHandler(e));
    }

//interaction functions

    clickHandler(e){
        if(e.target.nodeName == 'CHESS-TILE' && e.pointerId == 1){
            //we clicked in the gird
            this.selected == 0? this.firstClick(e) : this.secondClick(e);

        }else{
            // cliked away 
            this.clearSelected();
        }
    }

    firstClick(e){
            e.target.piece?.color[0] == this.turnColor && this.setSelected(e.target.piece);
    }

    secondClick(e){
        if(e.target.moveType != false){
            //move
            this.moveHandler(e.target,this.selected[1],true);

        }else{
            this.clearSelected();
            //go to clichandler to skip a click if another piece is selected
            this.clickHandler(e);
        }
    }

    rightClickHandler(e){
        //make right click same as leftclick or holding for touch
        // e.preventDefault();
        // this.clickHandler(e);
    }

    setSelected(piece){
        this.selected = [piece,piece.cell];
        this.gridNode.showSelect(this.selected);
    }

    clearSelected(){
        console.log('clearselected');
        this.gridNode.clearHighlight();
        this.selected = 0;
    }

//end interaction funtcions

//movement functions

moveHandler(toCell,fromCell,animate = false){
    if(toCell.nodeName !=  "CHESS-TILE"){
        toCell = this.gridNode.getCell(toCell);
        fromCell = this.gridNode.getCell(fromCell);
    }
    const piece = fromCell.piece;
    const moveType = toCell.moveType;
    const move = fromCell.chessCoord+(moveType == 'move'? '-': 'x')+toCell.chessCoord;
    console.log(move);

    //move piece
    this.movePiece(toCell,piece,animate);
    this.clearSelected();

    //update fen
    this.updateFen(toCell,fromCell,piece);


    //send to db?
}

movePiece(toCell,piece,animate){
    if(toCell.moveType == "attack"){
        //todo send piece to graveyard
        this.querySelector(`#graveyard_${toCell.piece.color}`).append(toCell.piece);
    }
    toCell.append(piece);
}

updateFen(toCell,fromCell,piece){
    //updatecastling
    if(piece.type == 'rook' || piece.type == 'king'){
        //todo reduce castling
    }
    //update inPassing if the move is even and piece = pawn get passing tile otherwise -
    this.inPassing =  (toCell.y - fromCell.y) % 2 == 0 && piece.type == "pawn"? this.gridNode.getCell(toCell.x,fromCell.y +(toCell.y - fromCell.y)/2).chessCoord : '-';
    //update turncollor
    this.turnColor = this.othercolor;
    //todo update fen atribute ?
}

// end movement functions

    //grid getters
        get gridNode(){
            return this.querySelector('chess-grid');
        }

        get grid(){
            return this.gridNode.grid;
        }

        get rowCount(){
            return this.gridNode.x
        }

        get columnCount(){
        return this.gridNode.y;
        }

        get rows(){
        return this.gridNode.rows;
        }

        get columns(){
        return this.gridNode.columns;
        }
    //end grid getters
    //fen stuf
        get defaultFen(){
            // return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0';
            return 'rnbqkbnr/p2ppppp/8/Pp6/8/2p5/1PPPPPPP/RNBQKBNR w KQkq b3 1 0'
        }

        get fen(){
            return this.gridNode.gridFen+' '+this.turnColor+' '+this.castlingFen+' '+this.inPassing;
        }

        set fen(fen){
            const [gridFen,turnColor,castlingFen,apFen,fulFen,halfFen] = fen.split(' ');

            //gridFen
            let count = 0;
            gridFen.split('/').map(row => { 
               Array.from(row).map(letter =>{
                if (letter != +letter){
                    // we have a piece
                    //todo place piece
                    this.grid[count].append(new ChessPiece(letter));
                    count ++;
                }
                else{
                    count += +letter;
                }
               });
            });

            this.turnColor = turnColor;
            this.castlingFen = castlingFen;
            this.inPassing = apFen;
        }

        get othercolor(){
            return this.turnColor == 'w'? 'b' : 'w'; 
        }

        checkFen(fen){
            // check valid fen
        }

    //end fen stuf
    //board creation
        constructBoard(){
            //make board grid and border
            this.append(new ChessGrid);
            this.append(...this.makeBorder());
            this.append(this.makeGraveyard());
            
            //todo
            //make moves log earya and graveyard

        }  
        makeBorder(){
            const arr = [];
            for(let i = 0; i < 4; i++){
                const div = document.createElement('div');
                if(i % 2){
                    // make column bar
                    div.classList.add('columnbar');
                    div.setAttribute('y', this.columnCount)
                    for(let i = 0;i<this.rowCount;i++){
                        const letter = document.createElement("div");
                        letter.innerText = String.fromCharCode(i+65);
                        div.append(letter);
                    }
                }
                else{
                    //make row bar
                    div.classList.add('rowbar');
                    for(let i = 0;i<this.columnCount;i++){
                        const number = document.createElement("div");
                        number.innerText = i +1;
                        div.append(number);
                    }
                }
                arr.push(div);
            }
            return arr;
        }
        makeGraveyard(){
            const div1 = document.createElement('div');
            const div2 = document.createElement('div');
            div1.id = 'graveyard_white';
            div2.id = 'graveyard_black';
            const div3 = document.createElement('div');
            div3.id = 'graveyards';
            div3.append(...[div1,div2]);
            return div3;
        }
    //end board creation

});//end ChessBoard

console.log('chess-board.js loaded');