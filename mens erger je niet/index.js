import { GameGrid } from "https://rtdb.nl/bplib/grid.js";
import {animatePiece} from "https://rtdb.nl/functions.js";
import { Pawn } from "./pawn.js";

class MensErgerJeNiet extends HTMLElement {
    constructor() {
      super();
        this.grid = new GameGrid(11,11,{pattern : 'none', playerCount : 4 , draggable:true});
        this.turn = 1
    }

    connectedCallback() {
      this.createBoard();
      this.placePawns();
      this.setAttribute('turn',this.turn);
      this.grid.setDragable();

      //add eventlistners
      document.addEventListener('gamegriddrop', e => this.drophandler(e));
      document.addEventListener('griddragstart', e => this.onDragstart(e));
      document.addEventListener('roll-dice', e => this.diceRoll(e));
    
    }

    diceRoll(e){
      console.log(e);
      const diceValue = e.detail.dice[0].value;
      console.log(diceValue);

      //check if player can play
      if(diceValue == 6 || this.playerPiecesInPlay.length > 0){

      }
      //player cant play skip turn
      else{
        this.changeTurn();
      }

    }

    onDragstart(e){
      const piece = e.detail.piece;
      
    }

    drophandler(e){
      console.log(e.detail);
      e.detail.from.append(e.detail.piece);
    }

    changeTurn(){
      this.turn ++;
      this.setAttribute('turn', this.turn);
      this.grid.changeTurn(this.turn);
    }

    createBoard(){
      this.append(this.grid);  
      // make a walking path for mens erger je niet use 10 % to add a starttile for player 

        //the path contains turn directon only ? { dir :top , length : 4} ?
      this.walkingPath =  this.grid.walkingPath(this.grid.getTile(0,4) , this.defaultPath);

      //placing the playingfield
      for(let i = 0 ; i < this.walkingPath.length ; i++){
        this.walkingPath[i].setAttribute('path','');
        if(i % 10 == 0){
          this.walkingPath[i].setAttribute('startile', i/10 +1);
        }
      }

      //seting the corner tiles
      let i = 1;
      this.corners.map(cell => {
        const cells = cell.adjacentCells
        cells.push(cell);
        cells.map(cell => cell.setAttribute('baseTile' , i ));
        i++;
      });

      //setting the endingtiles
      const startTiles = [[1,5],[5,1],[9,5],[5,9]];
      const dirs = ['right','bottom','left','top'];
      for(let i = 1; i <=4 ; i ++){
        const obj = { dir : dirs.shift(), length : 3};
        const startile = this.grid.getTile(startTiles.shift());
        const cells = this.grid.walkingPath(startile, obj);
        cells.map(cell => cell.setAttribute('finish', i));
      }

    }
    
    // init for placing the pawns
    placePawns(){
      for(let i = 1; i <=4 ; i++){
        this.getBase(i).map(tile => tile.append(new Pawn(i)));
      }
    }

    getBase(team = 1){
      return Array.from(this.querySelectorAll(`[basetile="${team}"]`));
    }

    getFinish(team = 1){
      return Array.from(this.querySelectorAll(`[finish="${team}"]`));
    }

    //default path
    get defaultPath(){
      return [
        {dir : 'right' , length :4 },
        {dir : 'top' , length : 4 },
        {dir : 'right' , length : 2 },
        {dir : 'bottom' , length : 4},
        {dir : 'right' , length : 4},
        {dir : 'bottom' , length : 2 },
        {dir : 'left' , length : 4 },
        {dir : 'bottom' , length :4 },
        {dir : 'left' , length : 2 },
        {dir : 'top' , length : 4 },
        {dir : 'left' , length : 4 },
        {dir : 'top' , length : 1 }
      ]
    }

    get corners(){
      return this.grid.getCells([[0,0],[this.grid.x -1 , 0],[this.grid.x-1,this.grid.y-1],[0,this.grid.y-1]]);
    }

    get playerPiecesInPlay(){
      return this.playerPieces.filter(piece => {
        if(!piece.onBase)piece;
      });
    }

    get playerPieces(){
      return Array.from(this.querySelectorAll(`niet-pawn[player="${this.turn}"]`));
    }

  }

  customElements.define('mens-erger-je-niet', MensErgerJeNiet);