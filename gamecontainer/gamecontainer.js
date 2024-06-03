import { RTChatbox } from 'https://rtdb.nl/rtchatbox.js';
import { RtSocket} from "https://rtdb.nl/rtsocket.js";
import { RtGameMenu } from './rtgamemenu.js';
import { importCss } from '../functions.js';
import paths from './paths.json' with {type:'json'};

class GameContainer extends HTMLElement{
    constructor(){
        super()
        //import the 
        if(window.location.search.length > 0){
            //we have a joinrequest
        };
        // import(this.src).then((module) =>{
        //     console.log(module);
        //     this.game = module[this.gameName]
        //     //load samenamed css file
        //     importCss(this.src.slice(0,-2)+'css');
        // });
        //todo localstorage check for user

        //ws
        this.ws = new RtSocket(this);
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

    get src(){
        return this.getAttribute('src');
    }
    get gameName(){
        return this.getAttribute('name');
    }

    connectedCallback(){
        this.setEventListners();
        this.makeGameMenu();

    }

    setEventListners(){
        this.addEventListener(`db-newgame`, e => this.makeBoard(e));
        document.addEventListener(`db-joinGame`, e => this.makeBoard(e));
        document.addEventListener(`db-getOpenGames`, e => this.makeLobyBrowser(e));
        document.addEventListener(`gameSelected`, e => this.makeSelectedGame(e));
    }
    closestElement(selector, el = this) {
        return (
            (el && el != document && el != window && el.closest(selector)) ||
            this.closestElement(selector, el.getRootNode().host)
        );
    }

    makeGameMenu(){
        this.clear();
        this.append(new RtGameMenu(this,paths));
    }
    makeSelectedGame(e){
        this.clear();
        const [name,path] = e.detail.split('|');
        import(path).then((module) =>{
            console.log(module);
            this.game = module[name]
            // this.game =module;
            //load samenamed css file
            console.log(name);
            importCss(path.slice(0,-2)+'css');
            this.append(new this.game());
        });
    }

    makeBoard(e){
        console.log(123);
        this.clear();
        const game = new this.game();
        // game.id = e.detail.id;
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