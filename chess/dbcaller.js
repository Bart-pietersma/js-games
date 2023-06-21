    /* 
        actions: initgame, joingame, move, completegame, getopengames, getongoinggames,getmoves

        newgame: create
        send: type,player,playerlimit,boardstate
        resive: guid

        joingame: update
        send: player,guid
        resive: comfirmation
        
        endgame: update
        send: guid,winner,boardstate
        resive: comfirmation

        move: create & update
        send: guid,move,boardstate
        resive comfirmation


        getopengames: query
        send: 
        resive: arr opengames

        getongoinggames: query
        send:
        resive: arr ongoinggames

        getmoves: querry
        send: guid
        resive: array of all moves from guid board

        db: 
        matches: id,type,players,playerlimit,boardstate,guid,winner,starttime,endtime
        moves:  id,guid,move,timestamp

        */   
   class DbHandler{
       constructor(url = 'ws://localhost:8080'){
           
           //websocket
           this.ws = new WebSocket(url);
        this.ws.addEventListener("open", () =>{
            console.log("We are connected");
          });
        this.ws.addEventListener('message', (e) => this.resiveMsg(e));
    }
    

    move(id,move,fen){
        //todo rename fen to boardstate and match_guid to match_id
        // const obj = {'action': 'move','match_guid':id,'move':move,'fen':fen};
        // return this.sendFectch(obj);
        this.ws.send(JSON.stringify({'action':'move',id,move,fen}));
    }

    requestID(){
        this.ws.send(JSON.stringify({'action':'makeID'}));
    }
    
    resiveMsg(e){
        const data = JSON.parse(e.data);
        console.log(data);
        const board = document.getElementById(data.id);
        if(board && data.fen != board.fen){
            //send move to board
            console.log(data.move);
           const [toCell,fromCell] = this.moveInterpreter(data.move,data.fen);
           const evt = new CustomEvent('db-move',{detail : data});
            board.moveHandler(toCell,fromCell,'db')
            board.dispatchEvent(evt)
        }
    }

    moveInterpreter(move,fen){
        let toCell = '';
        let fromCell = '';
        if(move == `0-0-0` || move == '0-0' || move == 'o-o-o' || move == 'o-o'){
            //0-0-0 || 0-0
            const rank = fen.includes('w')? '1': '8';
            const file = move == '0-0-0' || move == 'o-o-o'? 'c' : 'g'
            fromCell = 'e'+rank;
            toCell = file+rank; 
        }
        else{
            //normal move
            toCell = move.substring(3);
            fromCell = move.substring(0,2);
        }
        console.log(fromCell);
        return [toCell,fromCell];
    }
}

class ApiHandler{
    //! old
    constructor(url = "https://schaakzet.nl/api/rt/db_api.php", eUrl = "https://schaakzet.nl/api/rt/matchmoves_eventsource.php"){

        // url = "../database/chessgame.php", eUrl = "../database/matchmoves_eventsource.php"
        this.dbUrl = url;

        //websocket
        this.ws = new WebSocket(`ws://www.roads-technology.com/websocket.js`);
        this.ws.onopen = (e) => this.onopen(e);

        //conect eventstream
        const source = new EventSource(eUrl);
        source.onopen = (e) => this.SoureOpen(e);
        source.onmessage = (e) => this.sourceMessage(e);
        source.onping = (e) => this.sourcePing(e);
        source.onerror = (e) => this.sourceError(e);
    }

    //eventSource functions
    SoureOpen(e){
        console.log("connection has happend");
    }

    sourceMessage(e){
        //todo send custom event "move" when a matching guid is found
        if(document.querySelector(`#${e.data['match_guid']}`)){
            //send event
            dispatchEvent(new CustomEvent('move',{
                bubbles : true,
                id: e.data['match_guid'],
                move : e.data['move'],
            }));
        }
    }

    sourcePing(e){
        //todo wat to do with this? just console 
    }
    sourceError(e){
        console.error("EventSource failed:", e);
    }
    // end eventSource functions
    //api functions

    makeData(obj){
        const data = new FormData();
        for(const [key,value] of Object.entries(obj)){
            console.log(key,value);
            data.append(key,value);
        }
        return data;
    }

    sendFectch(obj){
        //todo return response
       return fetch(this.dbUrl,{
            method: 'POST',
            body: this.makeData(obj),
        }).then((response) => response.json()).then((result) =>{result});

        // then((response) => response.json()).then((result) =>{result});

    }

    initGame(arr){
        const [type, player, playerlimit,boardstate] = arr
        const obj = {'action':'newGame','type': type,'player':player,'playerlimit':playerlimit,'boardstate':boardstate};
        return this.sendFectch(obj);
    }
 
    joinGame(arr){

    }
    move(id,move,fen){
        //todo rename fen to boardstate and match_guid to match_id
        const obj = {'action': 'move','match_guid':id,'move':move,'fen':fen};
        // return this.sendFectch(obj);
    }

}

console.log('apiHandler loaded');
export {ApiHandler, DbHandler};

