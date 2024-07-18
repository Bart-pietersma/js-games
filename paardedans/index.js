import { GameGrid } from 'https://rtdb.nl/bplib/grid.js';
import { animatePiece } from 'https://rtdb.nl/functions.js';
import { Paard } from './paard.js';

class template extends HTMLElement{
    constructor(){
        super()
        this.board = new GameGrid(8,8,{pattern: 'checkered', draggable: true});
        this.append(this.board);


        // this.piece = new Paard();
        // this.append(this.piece);
    }

    connectedCallback(){
        this.addEventListener(`click`, e => this.clickHandler(e));
    }

    clickHandler(e){
        // check if clicked insode of board
        if(e.target.nodeName == 'GRID-TILE'){
            //check first click
            if(!this.piece) this.firstclick(e.target);
            //move the horse
            else {
                this.movePaard(e.target);
            }
        }
    }

    firstclick(cell){
        this.piece = new Paard();
        cell.append(this.piece)
    }

    movePaard(cell){

    }

}
customElements.define('template-plate', template);