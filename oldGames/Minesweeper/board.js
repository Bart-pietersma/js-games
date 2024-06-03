import { importCss } from "./functions.js";
import { GameGrid } from "https://rtdb.nl/bplib/grid.js";

class Board extends HTMLElement {
    constructor(x =16 , y = 12) {
        super();
        this.setAttribute('x',x);
        this.setAttribute('y',y);
        this.init = 1;
        this.firstClick = true;
        this.life = this.hasAttribute("life") ? this.getAttribute("life") : 1;
        this.chain = [];

        //work in progres
        this.grid = new GameGrid(this.x, this.y);

    }

    connectedCallback() {
        if (this.init == 1) {
            importCss("./board.css");
            //create cell grid
            this.append(this.grid);
            //setbombs
            this.setbombs();
            this.init = 0
            //evt listners
            this.addEventListener("click", (e) => this.clickevent(e));
            this.addEventListener("contextmenu", (e) => this.rightClickevent(e));
        }
    }



    get x() {
        return this.getAttribute("x");
    }

    get y() {
        return this.getAttribute("y");
    }

    get cellCount() {
        return this.grid.grid.length;
    }

    get bombratio() {
        return 1 / 5;
    }

    get maxbombs() {
        return Math.round(this.cellCount * this.bombratio);
    }

    get bombcount() {
        return this.querySelectorAll(`[mine]`).length;
    }

    get hiddenCellCount() {
        return this.querySelectorAll(`sweep-cell:not([sweep])`).length;
    }

    get flagcount() {
        return this.querySelectorAll(`[flag]`).length;
    }

    get flaggedBombsCount() {
        return this.querySelectorAll(`[flag][mine]`).length;
    }

    //laying mines
    setbombs(coords = []) {
        // make random coords and set a bomb there until all the bombs are placed if setting a bomb on a bomb find new place till empty is found
        let bombs = this.bombcount;
        while (bombs < this.maxbombs) {
            // const cell = this.querySelector(`[coord=${this.randomCoord()}]`);
            const cell = this.grid.randomCell();
            if (cell.hasAttribute('mine') == false && !coords.includes(cell.coord)) {
                this.toggleMine(cell, true);
                bombs++;
            }
        }
    }

    toggleMine(cell, bool = !this.hasAttribute("mine")) {
        return cell.toggleAttribute("mine", bool);
    }

    randomCoord() {
        const x = Math.floor(Math.random() * this.grid.x);
        const y = Math.floor(Math.random() * this.grid.y);
        return [x, y];
    }


    //end laying mines

    //click handlers
    // firstclick then check if were klicking on a sweeped or unsweeped do coresponing functions
    clickevent(e) {
        if (e.target.nodeName == 'GRID-TILE') {
            const cell = e.target;
            if (this.firstClick) {
                this.handleFirstClick(cell);
            } else {
                if (cell?.getAttribute(`sweep`) != null) {
                    this.hilight(cell);
                } else {
                    if (this.checkMine(cell) == "") {
                        while (this.chain.lengt > 0) {
                            const cell = this.board.chain.shift();
                            this.checkAdjecentMines(cell);
                        }
                    }
                    else if (this.checkMine(cell) == "💣") {
                        this.explosion(cell);
                    }
                }
                this.checkWin();
            }


        }
    }

    rightClickevent(e) {
        e.preventDefault();
        if (e.target.nodeName == 'GRID-TILE' && !e.target.hasAttribute(`sweep`)) {
            this.toggleFlag(e.target);
            this.checkWin();
        }
    }

    handleFirstClick(cell) {
        if (cell.hasAttribute("mine")) {
            //move mine
            this.toggleMine(cell, false);
        }
        if (this.adjacentMines(cell) > 0) {
            //move adjecentmines
            this.adjacentMinecells(cell).forEach(n => {
                this.toggleMine(n, false);
            })

        }
        if (this.bombcount < this.maxbombs) {
            //get coords to avoid placing new mines that were removed
            const coords = [cell.coord];
            cell.adjacentCells.map(cell => { coords.push(cell.coord) });
            this.setbombs(coords);
        }
        this.checkMine(cell);
        this.firstClick = false;
    }

    //end clickhandlers
    //tile     
    checkMine(cell) {
        //looks for mines on and around
        const number = cell.hasAttribute('mine') ? "💣" : this.adjacentMines(cell);
        cell.setAttribute("sweep", number == 0 ? '' : number);
        if (number == "") this.checkAdjecentMines(cell);
        return number;
    }

    toggleFlag(cell, bool) {
        if (!bool) bool = !cell.hasAttribute("flag")
        return cell.toggleAttribute("flag", bool);
    }
    toggleMine(cell, bool = !cell.hasAttribute("mine")) {
        return cell.toggleAttribute("mine", bool);
    }

    adjacentMinecells(cell) {
        return this.grid.adjacentCells(cell).map(n => {
            return n.hasAttribute('mine') ? n : '';
        }).filter(n => n);
    }

    adjacentMines(cell) {
        return this.adjacentMinecells(cell).length;
    }

    checkAdjecentMines(ocell) {
        this.grid.adjacentCells(ocell).forEach(cell => {
            if (!cell.hasAttribute(`sweep`)) {
                if (this.checkMine(cell) == "") this.chain.push(cell);
            }
        });
    }

    hilight(cell) {
        const arr = this.grid.adjacentCells(cell).filter(n => { return n.hasAttribute(`sweep`) == false });
        arr.forEach(cell => {
            cell.animate({

                boxShadow: [``, `inset 0 0 calc(var(--square-size) * 0.5) var(--color-hover)`,'']
            }, 450);
        });
    }


    // end tile

    checkWin() {
        // all flaggs are on mines or only mines hidden
        if (this.flaggedBombsCount == this.flagcount && this.flagcount == this.bombcount || this.hiddenCellCount == this.bombcount) this.handleWin();
    }

    handleWin() {
        window.alert("u won");
    }

    explosion(cell) {
        // lose a life no lifes left lose
        this.life--;
        this.toggleFlag(cell, true);
        if (this.life < 1) this.handleLoss();
    }

    handleLoss() {
        window.alert("u loose");
    }

};
customElements.define("minesweeper-board",Board);
console.log(`board.js loaded`);
export {Board}