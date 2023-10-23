import {GameGrid} from 'https://rtdb.nl/bplib/grid.js';


class CheckerPiece extends HTMLElement {
    constructor(team){
        super()
       this.setAttribute('player',team);
    }

    connectedCallback(){
    }

    closestElement(selector, el = this) {
        return (
            (el && el != document && el != window && el.closest(selector)) ||
            this.closestElement(selector, el.getRootNode().host)
        );
    }

    get team(){
        return this.getAttribute('team')
    }

    get board(){
        return this.closestElement('checker-board')
    }

    get cell(){
        return this.closestElement('grid-tile')
    }

    get grid(){
        return this.board.grid
    }

    get moves(){
       const dirs =  this.grid.getDirections(this.cell);

       console.log(dirs);

       return this.team == '1'? [dirs.topLeft,dirs.topRight] : [dirs.bottomLeft,dirs.bottomRight];
    }

}
customElements.define('checker-piece', CheckerPiece);


class CheckerBoard extends HTMLElement {
    constructor(){
        super()
        this.grid = new GameGrid(10,10,{ pattern:'checkered', draggable : true});
    }

    connectedCallback(){
        this.append(this.grid);
        this.placePieces();
    }

    get startfen(){
        return 'ppppp/ppppp/ppppp/ppppp/5/5/PPPPP/PPPPP/PPPPP/PPPPP';
    }
    

    placePieces(){
        //players get 20 pieces each and a middle zone empty of 10

        let count = 0;
        const cells = Array.from(this.grid.querySelectorAll('[color="2"]'));
        this.startfen.split('/').forEach(row => {
            Array.from(row).forEach(letter => {
                if(letter != +letter){
                    cells[count].append(new CheckerPiece(letter.toLocaleUpperCase() == letter? '1': '2'));
                    count ++
                }
                else count += +letter
            })
        })
    }


}
customElements.define('checker-board', CheckerBoard);

document.body.append(new CheckerBoard())
export {CheckerBoard};