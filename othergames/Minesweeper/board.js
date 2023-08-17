import "./minesweeperCell.js";
import { importCss } from "./functions.js";

customElements.define( "minesweeper-board", class Board extends HTMLElement {
    constructor(){
        super();
        this.init = 1;
        this.firstClick = true;
        this.life = this.hasAttribute("life")? this.getAttribute("life") : 1 ;
        this.chain = [];
        this.style=`--x:${this.x}; --y:${this.y};`;
    }

    connectedCallback(){
        if(this.init == 1){
            importCss("./board.css");
            //create cell grid
            for(let y = 0 ; y < this.y ; y++){
                for(let x = 0 ; x < this.x ; x++){
                    const cell = document.createElement("sweep-cell");
                    cell.setAttribute("coord",`${x},${y}`);
                    this.append(cell);
                }
            }
            //setbombs
            this.setbombs();
            this.init = 0
        }
    }

    get x(){
        return this.getAttribute("x");
    }

    get y(){
        return this.getAttribute("y");
    }

    get cellCount(){
        return this.querySelectorAll("sweep-cell").length;
    }

    get bombratio(){
        return 1/5;
    }

    get maxbombs(){
        return Math.round(this.cellCount * this.bombratio);
    }

    get bombcount(){
        return this.querySelectorAll(`[mine]`).length;
    }

    get hiddenCellCount(){
        return this.querySelectorAll(`sweep-cell:not([sweep])`).length;
    }

    get flagcount(){
        return this.querySelectorAll(`[flag]`).length;
    }

    get flaggedBombsCount(){
        return this.querySelectorAll(`[flag][mine]`).length;
    }  

    setbombs(coords = []){
        // make random coords and set a bomb there until all the bombs are placed if setting a bomb on a bomb find new place till empty is found
        let bombs = this.bombcount;
        while(bombs < this.maxbombs){
            const cell = this.querySelector(`[coord=${this.randomCoord()}]`);
            if(cell.mine == false && !coords.includes(cell.coord)){
                cell.toggleMine(true);
                bombs ++;
            }
        }
    }

    randomCoord(){
        const x = Math.floor(Math.random() * this.x);
        const y = Math.floor(Math.random() * this.y);
        return `"${x},${y}"`;
    }

    handleFirstClick(cell){
        if(cell.mine){
            //move mine
            cell.toggleMine(false);
        }
        if(cell.adjacentMines > 0){
            //move adjecentmines
            for(const n of cell.adjacentMineCells){
                n.toggleMine(false);
            }
        }
        if( this.bombcount < this.maxbombs ){
            //get coords to avoid placing new mines that were removed
            const coords = [cell.coord];
            cell.adjacentCells.map(cell => {coords.push(cell.coord) });
            this.setbombs(coords);
        } 
        cell.checkMine();
        this.firstClick = false;
    }

    checkWin(){
        // all flaggs are on mines or only mines hidden
        if(this.flaggedBombsCount == this.flagcount && this.flagcount == this.bombcount || this.hiddenCellCount == this.bombcount )this.handleWin();
    }

    handleWin(){
        window.alert("u won");
    }

    explosion(cell){
        // lose a life no lifes left lose
        this.life --;
        cell.toggleFlag(true);
        if(this.life < 1)this.handleLoss();
    }

    handleLoss(){
        window.alert("u loose");
    }

});