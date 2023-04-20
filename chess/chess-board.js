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
        console.log('second click');
        if(e.target.moveType != false){
            //move

        }else{
            this.clearSelected()
            this.clickHandler(e);
        }
    }

    rightClickHandler(e){
        e.preventDefault();
        this.clickHandler(e);
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
            return this.gridNode.gridFen
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
            this.inPassing = this.gridNode.getCell(apFen);
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
    //end board creation

});//end ChessBoard

console.log('chess-board.js loaded');