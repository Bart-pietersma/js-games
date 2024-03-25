import { RTChatbox } from 'https://rtdb.nl/rtchatbox.js';
import { RtSocket} from "https://rtdb.nl/rtsocket.js";
import { RtGameMenu } from './rtgamemenu.js';
import { importCss } from '../functions.js';
// import { MensErgerJeNiet } from "../mens erger je niet/index.js";

class GameContainer extends HTMLElement{
    constructor(){
        super()
        //import the 
        import(this.src).then((module) =>{
            this.game = module[this.gameName]
            //load samenamed css file
            importCss(this.src.slice(0,-2)+'css');
        });
        //todo localstorage check for user

        //ws
        // document.ws = new RtSocket;
    }

    get playerData(){
        return JSON.parse(localStorage.getItem('playerData'));
    }

    get userID(){
        return this.playerData.userID;
    }

    get userName(){
        return this.playerData.userName;
    }

    get ws(){
        return document.ws;
    }
    get src(){
        return this.getAttribute('src');
    }
    get gameName(){
        return this.getAttribute('name');
    }

    connectedCallback(){
        this.makeGameMenu();

    }

    setEventListners(){
        document.addEventListener(`db-newgame`, e => this.makeBoard(e));
        document.addEventListener(`db-joinGame`, e => this.makeBoard(e));
        document.addEventListener(`db-getOpenGames`, e => this.makeLobyBrowser(e));
    }
    closestElement(selector, el = this) {
        return (
            (el && el != document && el != window && el.closest(selector)) ||
            this.closestElement(selector, el.getRootNode().host)
        );
    }

    makeGameMenu(){
        this.clear();
        this.append(new RtGameMenu(this.name,this.src));
    }

    makeBoard(e){
        const game = new this.game();
        this.append(game);

    }
    loadGame(e){
        //todo
    }

    makeLobyBrowser(e){
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
    
    makeChatbox(){
        this.append(new RTChatbox());
    }

    clear(){
        // this.innerHTML = '';
        this.childNodes.forEach(node => node.nodeName != `CHAT-BOX` && node.remove());
    }
  
}
customElements.define('game-container', GameContainer);

export {GameContainer};
console.log('container.js loaded');