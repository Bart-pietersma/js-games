import {GameGrid} from 'https://rtdb.nl/bplib/grid.js';
import {animatePiece} from 'https://rtdb.nl/functions.js'


class CheckerPiece extends HTMLElement {
    constructor(team){
        super()
       this.setAttribute('player',team);
    }

    connectedCallback(){
        this.addEventListener('transitioned', e => this.remove());
    }

    get canAttack(){
        if(this.moves.attack.length > 0){
            return true;
        }
        else return false;
    }

    closestElement(selector, el = this) {
        return (
            (el && el != document && el != window && el.closest(selector)) ||
            this.closestElement(selector, el.getRootNode().host)
        );
    }

    get player(){
        return this.getAttribute('player')
    }

    get board(){
        return this.closestElement('checker-board')
    }

    get promoted(){
        return this.hasAttribute('king');
    }

    get cell(){
        return this.closestElement('grid-tile')
    }

    get grid(){
        return this.board.grid
    }

    get dirs(){
       const dirs =  this.grid.getDirections(this.cell);

       return this.player == '1'? [dirs.topLeft, dirs.topRight,dirs.bottomLeft,dirs.bottomRight] : 
       [dirs.bottomLeft, dirs.bottomRight,dirs.topLeft ,dirs.topRight];
    }

    get moves(){
        if(this.promoted) return this.kingMoves;
        const moves = {move : [], attack : []}
        //using a for loop couse only the firs 2 direction needs a movment check
        for(let i = 0 ; i < 4; i++){
            const dir = this.dirs[i];
            if(i < 2){
                if(dir[0] && !dir[0]?.piece) moves.move.push(dir[0]);
            }
            if(dir[0]?.piece && dir[0]?.piece?.player != this.player && dir[1] && !dir[1]?.piece) moves.attack.push(dir[1]);
        }
        return moves;
    }

    get kingMoves(){
        console.log(this.dirs);
    }

    promote(){
        if(this.player == 1 && this.grid.rows[0].includes(this.cell) || this.player == 2 && this.grid.rows[this.grid.rows.length-1].includes(this.cell) ){
            !this.canAttack && this.toggleAttribute('king', true);
            return true
        }
        else return false;
    }

    removeAnimation(){
        const timeout = 500;
        animatePiece(this.grid.dragtile,this,0.005);
       this.animate([{opacity : '1'},{opacity : '0'}],{duration : timeout, iterations : 1});
       setTimeout(() => {
              this.remove();
       }, timeout-5);
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
        this.grid.setdraggable();

        //eventlistners

        document.addEventListener('gamegriddrop', e => this.drophandler(e));
        document.addEventListener('griddragstart', e => this.onDragstart(e));
    }

    get startfen(){
        return 'pp1pp/ppPpp/ppppp/ppppp/5/5/PPPPP/PPPPP/PPPPP/P1PPP';
    }

    onDragstart(e){
        const piece = e.detail.piece;
        if(piece.canAttack == false){
           if (this.getPieces(piece.player).filter(piece => piece.canAttack).length > 0 ){
           }
           else{
            this.grid.setMoves(piece.moves);    
           }
        }else{
            this.grid.setMoves({ attack : piece.moves.attack})
        }
    }

    drophandler(e){
        const target = e.detail.target;
        const piece = e.detail.piece;
        const from = e.detail.from;
        //allow drop check
        if(target?.moveType == 'move'){
            target.append(piece);
            piece.promote();
            this.grid.changeTurn();
        }
        else if(target?.moveType == 'attack'){
            target.append(piece);
            piece.promote();

            //todo make it beter!
            //getting the tile thats 'jumped over' by making the obj direction a key value pair array then filtering of the arr contains target then single out the tile
            const attacking = Object.entries(this.grid.getDirections(from)).filter( arr => { 
               if(arr[1]) return arr[1].includes(target) 
            })[0][1][0];
            attacking.piece.removeAnimation();
            if(!piece.canAttack) this.grid.changeTurn();

        }
        else{
            animatePiece(from,piece,1.25);
        }
        this.grid.dispatchEvent(new CustomEvent('changeturn'));
        this.grid.clearMoves();
    }

    getPieces(player){
       return Array.from(this.querySelectorAll(`checker-piece[player = "${player}"]`));
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