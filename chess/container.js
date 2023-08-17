import './chessboard/chess-board.js';
import { ChessBoard } from './chessboard/chess-board.js';
import { DbHandler } from './dbcaller.js';
import {uuidv4 } from './functions.js';
import { MainMenu } from './optionmenu.js';

//! todo chess grid fix A1 is bottom left where white rook sits

class GameContainer extends HTMLElement{
    constructor(){
        super()

        this.playerData = JSON.parse(localStorage.getItem('playerData'));
        if(this.playerData == null){
            localStorage.setItem('playerData',JSON.stringify({'userID' : uuidv4()}));
            this.playerData = localStorage.getItem('playerData');
        }

        //ws
        this.ws = new DbHandler;
    }

    connectedCallback(){
        if(this.playerData == null){
            //make optionscreen to give 
        }

        this.setEventListners();
    }

    setEventListners(){
        console.log(55);
        this.addEventListener(`db-newgame`, e => this.makeChessBoard(e));
    }
    closestElement(selector, el = this) {
        return (
            (el && el != document && el != window && el.closest(selector)) ||
            this.closestElement(selector, el.getRootNode().host)
        );
    }

    //todo remake to make implement generic game
    makeChessBoard(e){
        this.clear();
        console.log(e);
        const chesBoard = new ChessBoard(e.detail,true);
        console.log(chesBoard);
        this.append(chesBoard);
        
    }

    makeOptionMenu(){
        //todo
    }

    makeLobybrowser(){
        //todo
    }
    makeMainmenu(){
        //todo
        this.clear()
        /* new game | joingame | lobybrowser | watch game | optionmenu */
        // const newgameBtn = this.makeButton(`newgame`,`new game`,this,this.btnNewGame);
        // this.append(newgameBtn);
        this.append(new MainMenu());

    }

    clear(){
        this.innerHTML = '';
    }
    btnNewGame(e){
        //the this for the funtion is button so wen need to pass the button to 
        //send ws call to newgame
        //
        e.clear()
        console.log(e);
        e.makeChessBoard()
    }

    makeButton(id, text,node, click){
        const button = document.createElement('button');
        button.id = id;
        button.innerText = text? text : id;
        button.onclick = ( e => click(node));
        return button;
    }
      


  
}
customElements.define('game-container', GameContainer);

export {GameContainer};
console.log('container.js loaded');