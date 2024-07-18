import { GameGrid } from 'https://rtdb.nl/bplib/grid.js';
import { animatePiece } from 'https://rtdb.nl/functions.js'

class template extends HTMLElement{
    constructor(){
        super()

    }
    connectedCallback(){

    }

}
customElements.define('template-plate', template);