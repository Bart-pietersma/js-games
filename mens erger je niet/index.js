import { GameGrid } from "https://rtdb.nl/bplib/grid.js";
import {animatePiece} from "https://rtdb.nl/functions.js";
import { Pawn } from "./pawn.js";
import {RtSocket} from "https://rtdb.nl/rtsocket.js";

import { EndScreen } from "https://rtdb.nl/bplib/end-screen.js";
//! simulate other mouses to give a more inclusive veeling ?
//todo walk backwarts when going past
//todo fix the end tiles to count from the correct side
/* 
seprate dice and move comands for ws?
make die sides svgs to whow other players trown dice

cros msg locations
change turn?
rolldice ?
drophandler?
*/
class MensErgerJeNiet extends HTMLElement {
    constructor() {
      super();
        this.grid = new GameGrid(11,11,{pattern : 'none', playerCount : 4 , draggable:true});
        this.turn = 1
        this.socket = new RtSocket();
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

      //ws evt
      document.addEventListener('db-echo', e => this.handleSocket(e));
    
    }

    handleSocket(e){
      e = e.detail;
      //todo
      //is going to give dice number and pawn move?
      console.log(e);

    }

    diceRoll(e){
      e = e.detail;
      console.log(e);
      if(e.name == 'dice-throw-start'){
        this.toggleBlockDice(true);
      }else if(e.name == 'dice-rolled'){
        const diceValue = e.dice[0].value;
        //todo send to others the rolled dice.
        this.socket.testMsg({'action' : 'echo', diceValue});

        //check if player can play
        if(diceValue == 6 || this.playerPiecesInPlay.length > 0){
          console.log('we can play');
          this.toggleBlockPieces(false);
        }
        //player cant play skip turn
        else{
          // this.dice.roll();
          this.changeTurn();
        }
      }
    }

    onDragstart(e){
      const piece = e.detail.piece;
      if(piece.moveTiles){
        this.grid.setMoves({move :[piece.moveTiles]});
      }
      
    }

    drophandler(e){
      e = e.detail;
      if(e.target.moveType){
        //we can move here
        //check if other pawn is there then return that to base
        if(e.target.piece){
          const enemy = e.target.piece;
          const base = this.getEmptyBase(enemy.team);
          animatePiece(base,enemy);
        }
        animatePiece(e.target,e.piece);
        //check for winncondition
        if(this.checkwin) this.handleWin();
        //check for second trow
        if(this.diceValue == 6){
          //update draggable so new location is set
          this.grid.setDragable();
          this.toggleBlockDice(false);
          this.toggleBlockPieces(true);
        }
        else this.changeTurn();

      }
      else{
        //wrong move return piece
        animatePiece(e.from,e.piece);
      }
      this.grid.clearMoves();
      // e.detail.from.append(e.detail.piece);
    }

    changeTurn(){
      //todo implement multiplayer with the information of the given turn ?
      this.turn ++;
      if(this.turn > 4) this.turn = this.turn % 4;
      this.setAttribute('turn', this.turn);
      this.grid.changeTurn();
      this.toggleBlockDice(false);
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
        const cells = cell.adjacentCells;
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

    //win
    handleWin(){
      //todo 
      this.append(new EndScreen(`${this.player} `));
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

    getEmptyBase(team =1){
      return this.querySelector(`[basetile="${team}"]:empty`);
    }

    getFinish(team = 1){
      return Array.from(this.querySelectorAll(`[finish="${team}"]`));
    }

    get playerpath(){
      // make a coppie of the path then change the startingpoint
      const path = this.walkingPath.slice();
      const x = (this.turn -1) *10;
      for(let i = 0; i < x ; i++){
        let tile = path.shift();
        path.push(tile);
      }
      //add the player ending tiles to the path
      path.push(...this.finishTiles);
      return path;
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

    get checkwin(){
      return this.querySelectorAll(`grid-tile[finish="${this.turn}"]:has(*)`).length == 4? true : false;
      
    }

    get corners(){
      return this.grid.getCells([[0,0],[this.grid.x -1 , 0],[this.grid.x-1,this.grid.y-1],[0,this.grid.y-1]]);
    }

    get playerPiecesInPlay(){
      return this.playerPieces.filter(piece => {
        if(!piece.onBase)return piece;
      });
    }

    get player(){
      const arr = ['blauw','rood','groen','geel'];
      return arr[this.turn];
    }

    get playerPieces(){
      return Array.from(this.querySelectorAll(`niet-pawn[player="${this.turn}"]`));
    }

    get finishTiles(){
      return Array.from(this.querySelectorAll(`grid-tile[finish="${this.turn}"]`));
    }

    get dice(){
      return document.querySelector('roll-dice');
    }

    get diceObj(){
      return this.dice.dice[0];
    }

    toggleBlockDice(force){
      this.dice.toggleAttribute('block',force);
    }
    toggleBlockPieces(force){
      this.playerPieces.forEach(piece => piece.tile.toggleAttribute('block', force));
    }

    get diceValue(){
      return this.dice.dice[0].value;
    }

  }

  customElements.define('mens-erger-je-niet', MensErgerJeNiet);