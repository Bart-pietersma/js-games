import { GameGrid } from 'https://rtdb.nl/bplib/grid.js';
import { animatePiece } from 'https://rtdb.nl/functions.js';
import {EndScreen} from 'https://rtdb.nl/bplib/end-screen.js';
import { Paard } from './paard.js';
import { dailyNumber, makeElement } from '../functions.js';
import wordlist from './woorden.json' with {type :"json"};

class template extends HTMLElement{
    constructor(daily = true){
        super()
        //make and place the topbar with undo and reset buttons
        this.makeTopBar();
        
        //make and place the 3x3 chessboard
        this.board = new GameGrid(3,3,{pattern: 'checkered', draggable: false});
        this.append(this.board);
        
        //uses a seeded randomizer to get a daily random word
        this.path = [];
        this.word = daily ?  wordlist[dailyNumber(wordlist.length-1)] : wordlist[Math.round(Math.random() * wordlist.length)];
        this.word = this.word.toLocaleLowerCase();
        this.placeWord(this.word);

        //place the bottombar wich has the guesed word to show progres of the game
        this.makeBottomBar();
    }

    placeWord(word){
        // word = Array.from(word);
       const start = this.getStartTile();
       start.innerText = word[0];
       let nextTile = this.knightMoves(start);
       for(let i = 1;i<word.length;i++){
        nextTile.innerText = word[i];
        nextTile = this.knightMoves(nextTile);
       }
    }

    knightMoves(cell){
        const moves = [[cell.x-2,cell.y-1],[cell.x -2, cell.y+1],[cell.x -1, cell.y-2],[cell.x -1, cell.y+2],[cell.x +1, cell.y-2],[cell.x +1, cell.y+2],[cell.x +2,cell.y-1],[cell.x +2,cell.y+1]];
        const tiles = this.board.getCells(moves.filter(coord =>{
            if((coord[0] >= 0 && coord[0] < cell.grid.columns.length )&&(coord[1] >= 0 && coord[1] < cell.grid.rows.length))return coord ;
        })).filter(cell => cell.innerText == '');
        return tiles.length > 1 ? tiles[Math.floor(Math.random() * 1)] : tiles[0]
    }

    getStartTile(){
        let x = Math.floor(Math.random() * 3);
        let y = Math.floor(Math.random() * 3);
        //keep going untile the coords are not the middle
        while (x == 1 && y == 1){
            x = Math.floor(Math.random() * 3);
            y = Math.floor(Math.random() * 3);
        }
        return this.board.getTile(x,y);
    }

    connectedCallback(){
        this.addEventListener(`click`, e => this.clickHandler(e));
        document.addEventListener('griddragstart', e => this.dragStartHandler(e));
        document.addEventListener('gamegriddrop', e => this.onDragDrop(e));
    }

    clickHandler(e){
        // check if clicked insode of board
        if(e.target.nodeName == 'GRID-TILE'){
            //check first click
            if(!this.piece) this.firstclick(e.target);
            //move the horse
            else if(e.target.moveType == 'move') {
                this.movePaard(e.target);
                if(this.path.length == 8) this.checkword()
            }
            //todo need more ?
            this.updateGuesedWord();
        }
    }

    firstclick(cell){
        this.piece = new Paard();
        cell.append(this.piece)
        this.board.setMoves(this.piece.moves);
        cell.toggleAttribute('checked');
        this.path.push(cell);

        // this.board.setDragable();
    }

    movePaard(cell){
        this.path.push(cell);
        cell.toggleAttribute('checked');
        this.board.clearMoves();
        animatePiece(cell,this.piece);
        this.board.setMoves(this.piece.moves);
    }

    undoMove(){
        const cell = this.path.pop();
        if (cell) {
            cell.toggleAttribute('checked');
            this.board.clearMoves()
            if(this.path.length >= 1){
                animatePiece(this.path[this.path.length-1],this.piece);
                this.board.setMoves(this.piece.moves);
            }
            else {
                this.piece.remove();
                this.piece = false
            }
            //update the guesword
            const arr = this.guesedWord.innerText.split('.')
            arr[this.path.length] = '-';
            this.guesedWord.innerText = arr.join('.');
        }
    }
    resetBoard(){
        //lazy
            while(this.path.length > 0){
                this.undoMove()
            }
    }

    updateGuesedWord(){
        const letter = this.path[this.path.length-1].innerText;
       const arr =  this.guesedWord.innerText.split('.');
       arr[this.path.length-1] = letter
       this.guesedWord.innerText = arr.join('.')
    }

    checkword(){
        const PlayerWord = this.path.map(cell => cell.innerText).join('');
        if(PlayerWord == this.word) {
            this.append(new EndScreen('je hebt goed geraden'));
        }
        else if(wordlist.includes(PlayerWord)){
            this.append(new EndScreen('je hebt een correct woord geraden maar het is niet het word van de dag'));
        }
        else console.log('u lose');
    }

    makeTopBar(){
        const bar = makeElement('div','topbar');
        const undobtn = makeElement('button', 'undobutton');
        undobtn.innerText = '← undo';
        undobtn.onclick = e => this.undoMove();
        const resetbtn = makeElement('button', 'resetbutton');
        resetbtn.innerText = '↺ reset';
        resetbtn.onclick = e => this.resetBoard();
        bar.append(...[undobtn,resetbtn]);
        this.append(bar);
    }
    makeBottomBar(){
        const bar = makeElement('div','bottombar');
        this.guesedWord = makeElement('p','guesedword');
        this.guesedWord.innerText = '-.-.-.-.-.-.-.-';
        bar.append(this.guesedWord);
        this.append(bar);
    }

    //todo disable dragable for now
    dragStartHandler(e){
        //light the posible spaces
        console.log(e.detail.piece.moves);
        this.board.setMoves(e.detail.piece.moves);
    }
    onDragDrop(e){
        // check if place is valid place it if not return horse
        console.log(e.detail);
    }

}
customElements.define('template-plate', template);