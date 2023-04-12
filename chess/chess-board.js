import { ChessGrid } from "./chess-grid.js";
import { importCss } from "./functions.js";
import { ChessPlayer } from "./chess-player.js";
import { ChessPiece } from "./chess-piece.js";

customElements.define('chess-board',class ChessBoard extends HTMLElement {
    constructor(){
        super()
        this.player1 = new ChessPlayer('white');
        this.player2 = new ChessPlayer('black');
    }
    
    connectedCallback(){
        importCss('chess-board.css');
        this.constructBoard();
        this.fen = this.hasAttribute('fen')?  this.getAttribute('fen') : this.defaultFen ;
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
            return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0';
        }

        get fen(){
            return this.gridNode.gridFen
        }

        set fen(fen){
            const [gridFen,playerFen,castlingFen,apFen,fulFen,halfFen] = fen.split(' ');

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