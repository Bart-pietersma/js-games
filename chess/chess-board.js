import { ChessGrid } from "./chess-grid.js";
import { importCss } from "./functions.js";
import { ChessPlayer } from "./chess-player.js";
import { ChessPiece } from "./chess-piece.js";

//todo
/*
include board color
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
            this.moveHandler(e.target,this.selected[1],'click');

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

moveHandler(toCell,fromCell,type = false){
    if(toCell.nodeName !=  "CHESS-TILE"){
        toCell = this.gridNode.getCell(toCell);
        fromCell = this.gridNode.getCell(fromCell);
    }
    const piece = this.selected[0];
    //move piece
    const move = piece.type == 'king' && (toCell.x - fromCell.x) % 2 == 0 && toCell.y == fromCell.y? this.castlingMove(toCell,fromCell,piece,type) : this.normalMove(toCell,fromCell,piece,type);
    
    this.clearSelected();
    this.updateLog(move);

    //update fen
    this.updateFen(toCell,fromCell,piece);

    //check win ?
    this.checkCheckMate();


    //send to db?
    if(type != 'db'){
        //send move
        //todo
    }
}

normalMove(toCell,fromCell,piece,type){
    this.movePiece(toCell,piece,(type == 'click'? true: false));
    return  fromCell.chessCoord+(toCell.moveType == 'move'? ' - ': ' x ')+toCell.chessCoord;
}
castlingMove(toCell,fromCell,piece,type){
    this.movePiece(toCell,piece,(type == 'click'? true:false));
    const rook = toCell.x - fromCell.x <0? this.gridNode.getCell([0,piece.y]).piece : this.gridNode.getCell([7,piece.y]).piece ;
    this.movePiece(this.gridNode.getCell(toCell.x -(toCell.x - fromCell.x)/2,fromCell.y) ,rook,(type == 'click'? true:false));
    return toCell.x - fromCell.x <0 ? 'o-o-o' : 'o-o';
}

movePiece(toCell,piece,animate){
    if(toCell.moveType == "attack"){
        //send piece to graveyard
        //check inpassing move
        if(toCell == this.gridNode.getCell(this.inPassing) && piece.type == 'pawn'){
                const y = piece.color == 'white'? 1 : -1;
                const tile = this.gridNode.getCell(toCell.x,toCell.y + y);
                setTimeout(() => {
                    this.animatePiece(this[`${tile.piece.color}graveyard`],tile.piece);
                },);
        }else{
            setTimeout(() => {
                this.animatePiece(this[`${toCell.piece.color}graveyard`],toCell.piece);
            },);
        }
    }
    animate? this.animatePiece(toCell,piece) : toCell.append(piece);
}

animatePiece(to,piece){
    //todo animate
    const from = piece.cell
     //get cords where the cards is
     const [x0, y0] = [piece.getBoundingClientRect().x, piece.getBoundingClientRect().y];
     //get cords where the cards has to go
     to.append(piece);
     const [x1, y1] = [piece.getBoundingClientRect().x, piece.getBoundingClientRect().y];
     from.append(piece);
     // calcutlate distanse and using that to get a time so cards move at a constant speed 
     const distanse = Math.sqrt(Math.pow(Math.abs(x0 - x1), 2) + Math.pow(Math.abs(y0 - y1), 2));
     const duration = 350;
     


     piece.animate(
         [{ zIndex: 1, transform: `translate(${x0 - x1}px,${y0 - y1}px)` }, { zIndex: 1, transform: `translate(0)` }],
         {
             duration: duration,
             easing: "linear",
         }
     );
     //when animation finishd apend to new cardpile
     to.append(piece);
}

updateLog(move){
    const p = document.createElement('li');
    p.innerText = move;
    this.movelog.append(p);
}

updateFen(toCell,fromCell,piece){
    //updatecastling
    if(piece.type == 'rook' || piece.type == 'king'){
        if(piece.type == 'rook'){
            const letter = fromCell.x == 0? piece.color == 'white'? "Q" : "q"  : fromCell.x == 7? piece.color == 'white'? 'K' : 'k' : false ;
           this.castlingFen = this.castlingFen.replace(letter ,'');
        }
        else if(piece.type == 'king'){
            if(piece.color == 'white' && fromCell == this.gridNode.getCell('e8')){
                this.castlingFen = this.castlingFen.replace('Q','');
                this.castlingFen = this.castlingFen.replace('K','');
            }
            else if (piece.color == 'black' && fromCell == this.gridNode.getCell('e1') ){
                this.castlingFen = this.castlingFen.replace('q','');
                this.castlingFen = this.castlingFen.replace('k','');
            }
        }
        if(this.castlingFen.length == 0)this.castlingFen = '-';
    }
    //update inPassing if the move is even and piece = pawn get passing tile otherwise -
    this.inPassing =  (toCell.y - fromCell.y) % 2 == 0 && piece.type == "pawn"? this.gridNode.getCell(toCell.x,fromCell.y +(toCell.y - fromCell.y)/2).chessCoord : '-';
    //update turncolor
    this.turnColor = this.othercolor;
    // update fen atribute ?
    this.setAttribute('fen',this.fen);
}

// end movement functions
//check win stuf

checkCheckMate(){
    //todo
    //this.gridNode.inCheck &&  all pieces.finalmoves.lengt == 0 //u loose
}

//end check win stuf

    get movelog(){
        return this.querySelector(`#movelog`);
    }
    get blackgraveyard(){
        return this.querySelector(`#graveyard_black`);
    }
    get whitegraveyard(){
        return this.querySelector(`#graveyard_white`);
    }

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
            // return '8/p7/8/1n6/k7/8/8/R6K b - - 1 0'
            return '1r6/n7/8/kQ6/8/2N5/8/7K b - -'
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
            //make moves log earya and graveyard
            this.append(this.makeGraveyard());
            this.append(this.makeMoveLog());

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
        makeMoveLog(){
            const div = document.createElement(`ol`);
            div.id = 'movelog';
            return div;
        }
    //end board creation

});//end ChessBoard

console.log('chess-board.js loaded');