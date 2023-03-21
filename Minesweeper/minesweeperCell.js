import { importCss } from "./functions.js";

customElements.define("sweep-cell" , class Cell extends HTMLElement{
    constructor(){
        super();
        this.init = 1;
    }

    connectedCallback(){
        if(this.init == 1){

            importCss("./minesweepercell.css")

            this.addEventListener("click", (e) => this.clickevent(e));
            this.addEventListener("contextmenu", (e) => this.rightClickevent(e));
            this.init = 0;
        }
    }

    get x(){
        return +this.coord.split(",")[0];
    }

    get y(){
        return +this.coord.split(",")[1];
    }
    get coord(){
        return this.getAttribute("coord");
    }

    get mine(){
        return this.hasAttribute("mine");
    }

    get sweep(){
        return this.hasAttribute("sweep");
    }

    get adjacentMines(){
        //returns number of mines adjesent
        let mines = 0;
        for(const cell of this.adjacentCells){
            if(cell.mine) mines ++;
        }
        if(mines == 0) mines = "";
        return mines;
    }

    get adjacentCells(){
        // get all cels sarounding it x-+ and y-+ cells as array;
        const arr = []
        for(let x = this.x -1 ; x < this.x + 2 ; x++){
            for(let y = this.y -1 ; y < this.y + 2; y++){
                if(x == this.x && y == this.y){
                    // is this cell
                }else{
                    const cell = document.querySelector(`[coord="${x},${y}"]`);
                    if(cell) arr.push(cell);
                }
            }
        }
        return arr;
    }

    get adjacentMineCells(){
        const cells = []
        for(const cell of this.adjacentCells){
            if(cell.mine) cells.push(cell);
        }
        return cells;
    }

    closestElement(selector, el = this) {
        return (
            (el && el != document && el != window && el.closest(selector)) ||
            this.closestElement(selector, el.getRootNode().host)
        );
    }
    get board() {
        return this.closestElement("minesweeper-board");
    }


    checkMine(){
        //looks for mines on and around
            const number = this.mine? "💣" :  this.adjacentMines;
            this.setAttribute("sweep", number);
            if(number == "") this.checkAdjecentMines();
            return number;
    }

    toggleFlag(bool = !this.hasAttribute("flag")){
       return this.toggleAttribute("flag",bool);
    }

    checkAdjecentMines(){
        
        for(const cell of this.adjacentCells){
            if(!cell.sweep){
                if(cell.checkMine() == "") this.board.chain.push(cell) ;
            }
        }
    }

    toggleMine(bool = !this.hasAttribute("mine")){
        return this.toggleAttribute("mine", bool);
    }

    clickevent(e){
        if(this.board.firstClick){
            this.board.handleFirstClick(this); 
        }else{
            if(this.checkMine() == ""){
                while(this.board.chain.lengt > 0){
                    const cell = this.board.chain.shift();
                    cell.checkAdjecentMines();
                }
            }
            else if(this.checkMine() == "💣"){
                this.board.explosion(this);
            }
        } 
        this.board.checkWin();
    }

    rightClickevent(e){
        e.preventDefault();
        this.toggleFlag();
        this.board.checkWin();
    }
})

