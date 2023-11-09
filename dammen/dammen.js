import { GameGrid } from 'https://rtdb.nl/bplib/grid.js';
import { animatePiece } from 'https://rtdb.nl/functions.js'


class CheckerPiece extends HTMLElement {
    constructor(letter) {
        super()
        this.setAttribute('player', letter.toLocaleUpperCase() == letter ? '1' : '2');
        letter.toLocaleUpperCase() == 'K' && this.toggleAttribute('king', true);
    }

    connectedCallback() {
        this.addEventListener('transitioned', e => this.remove());
    }

    get canAttack() {
        if (this.moves.attack.length > 0) {
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

    get player() {
        return this.getAttribute('player')
    }

    get board() {
        return this.closestElement('checker-board')
    }

    get promoted() {
        return this.hasAttribute('king');
    }

    get cell() {
        return this.closestElement('grid-tile')
    }

    get grid() {
        return this.board.grid
    }

    get dirs() {
        const dirs = this.grid.getDirections(this.cell);

        return this.player == '1' ? [dirs.topLeft, dirs.topRight, dirs.bottomLeft, dirs.bottomRight] :
            [dirs.bottomLeft, dirs.bottomRight, dirs.topLeft, dirs.topRight];
    }
    get arrDirs() {
        return Array.from(this.dirs).filter(n => n);
    }

    get moves() {
        if (this.promoted) return this.kingMoves;
        const moves = { move: [], attack: [] }
        //using a for loop couse only the firs 2 direction needs a movment check
        for (let i = 0; i < 4; i++) {
            const dir = this.dirs[i];
            if (i < 2) {
                if (dir[0] && !dir[0]?.piece) moves.move.push(dir[0]);
            }
            if (dir[0]?.piece && dir[0]?.piece?.player != this.player && dir[1] && !dir[1]?.piece) moves.attack.push(dir[1]);
        }
        return moves;
    }

    get kingMoves() {
        //push moves until enemy then push attacks until second
        const moves = { move: [], attack: [] };
        this.arrDirs.map(arr => {
            if (arr) {
                let enemy = false;
                let second = false;
                arr.map(cell => {
                    if (!enemy && !cell.piece) moves.move.push(cell);
                    else if (cell.piece && !enemy) enemy = true;
                    else if (enemy && !cell.piece && !second) moves.attack.push(cell);
                    else if (enemy && cell.piece) second = true;
                })
            }
        });
        return moves;
    }

    promote(force = false) {
        if (this.player == 1 && this.grid.rows[0].includes(this.cell) || this.player == 2 && this.grid.rows[this.grid.rows.length - 1].includes(this.cell) || force) {
            this.toggleAttribute('king', true);
            return true
        }
        else return false;
    }

    removeAnimation() {
        const timeout = 500;
        animatePiece(this.grid.dragtile, this, 0.005);
        this.animate([{ opacity: '1' }, { opacity: '0' }], { duration: timeout, iterations: 1 });
        setTimeout(() => {
            this.remove();
        }, timeout - 5);
    }

}
customElements.define('checker-piece', CheckerPiece);


class CheckerBoard extends HTMLElement {
    constructor(player = 1) {
        super()
        this.setAttribute('player', player);
        this.grid = new GameGrid(10, 10, { pattern: 'checkered', draggable: true });
    }

    connectedCallback() {
        this.append(this.grid);
        this.placePieces();
        this.grid.setdraggable();

        //eventlistners

        document.addEventListener('gamegriddrop', e => this.drophandler(e));
        document.addEventListener('griddragstart', e => this.onDragstart(e));
    }

    get startfen() {
        return 'ppppp/ppppp/ppppp/ppppp/5/5/PPPPP/PPPPP/PPPPP/PPPPP';
    }
    get player() {
        return this.getAttribute('player');
    }
    get cells() {
        return this.grid.grid.filter(cell => {
            return cell.color == '2' && cell;
        })
    }

    onDragstart(e) {
        const piece = e.detail.piece;
        if (piece.canAttack == false) {
            if (this.getPieces(piece.player).filter(piece => piece.canAttack).length > 0) {

            }
            else {
                this.grid.setMoves(piece.moves);
            }
        } else {
            this.grid.setMoves({ attack: piece.moves.attack })
        }
    }

    drophandler(e) {
        //todo can find piece now now to check if piece and enemy are only 1 removed to allow chaining
        const target = e.detail.target;
        const piece = e.detail.piece;
        const from = e.detail.from;
        //allow drop check
        if (target?.moveType == 'move') {
            target.append(piece);
            piece.promote();
            this.grid.changeTurn();
        }
        else if (target?.moveType == 'attack') {
            target.append(piece);
            piece.promote();

            //to find enemy we look for the dir that has the "from" tile then filter to find pieces on the dir and get the first piece
            const dir = piece.arrDirs.filter(arr => arr.includes(from)).flat();
            const enemy = dir.filter(cell => cell.piece)[0];
            enemy.piece.removeAnimation();
            if (dir[0] != enemy || (dir[0] == enemy && !piece.canAttack)) this.grid.changeTurn();
        }
        else {
            animatePiece(from, piece, 1.25);
        }
        this.grid.dispatchEvent(new CustomEvent('changeturn'));
        this.grid.clearMoves();
    }

    getPieces(player) {
        return Array.from(this.querySelectorAll(`checker-piece[player = "${player}"]`));
    }

    placePieces() {
        //players get 20 pieces each and a middle zone empty of 10

        let count = 0;
        const cells = this.cells;
        this.startfen.split('/').forEach(row => {
            Array.from(row).forEach(letter => {
                if (letter != +letter) {
                    cells[count].append(new CheckerPiece(letter));
                    count++
                }
                else count += +letter
            })
        })
    }


}
customElements.define('checker-board', CheckerBoard);

document.body.append(new CheckerBoard())
export { CheckerBoard };