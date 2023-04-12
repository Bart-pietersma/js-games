import {ChessTile} from "./chess-tile.js";
import { importCss } from "./functions.js";

class ChessGrid extends HTMLElement{
    constructor(columns = 8 , rows = 8 ){
        super()
        this.x = columns;
        this.y = rows;
        this.grid = this.makeGrid(columns,rows);
        this.style = `--x : ${columns} ;`;

    }

    connectedCallback(){
        importCss('chess-grid.css');

        this.append(...this.grid)
    }

    get columns(){
        const arr = [];
        for(let i=0 ; i < this.x ; i++)arr.push([]);
        this.grid.map(cell =>{
            arr[cell.x].push(cell);
        });
    return arr
    }

    get rows(){
        const arr = [];
        for(let i=0 ; i < this.y ; i++)arr.push([]);
        this.grid.map(cell =>{
            arr[cell.y].push(cell);
        });
    return arr
    }

    get blackPieces(){
        return Array.from(this.querySelectorAll(`[black]`));
    }

    get whitePieces(){
        return Array.from(this.querySelectorAll(`[white]`));
    }

    getCell(x = 0,y = 0){
        if(typeof x == 'object'){
            if(x[0] >= 0 && x[0] < this.columns.length && x[1] >= 0 && x[1] < this.rows.length) return this.columns[x[0]][x[1]] ;
        } 
        else if (typeof x == 'string'){
            const rows = ['a','b','c','d','e','f','g','h'];
            y = +x[1] -1;
            x = rows.indexOf(x[0]);
        }
        if (x >= 0 && x < this.columns.length && y >= 0 && y < this.rows.length)return this.columns[x][y];
    }

    getCells(array){
        return array.map(coord =>{
            return this.getCell(coord);
            ;
        });
    }

    get gridFen(){
        //build a fen string 	rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
        let string = '';
        this.rows.map(row =>{
            let empty = 0;
            row.map(cell => {
                if(cell.piece){
                    string += empty > 0? empty+cell.piece.letter : cell.piece.letter;
                    empty = 0;
                }else{
                    empty ++
                }
            });
            string += empty? `${empty}/` : "/";
        });
        //get rid of last / with slice
        return string.slice(0 , -1);
    }

    makeGrid(columns,rows){
        const arr = []
        for(let y = 0 ; y < rows ; y++){
            for(let x = 0; x < columns; x++){
               arr.push(new ChessTile(x,y));
            }
        }
        return arr;
    }
}
customElements.define('chess-grid', ChessGrid);

export {ChessGrid};
console.log('chess-grid.js loaded');