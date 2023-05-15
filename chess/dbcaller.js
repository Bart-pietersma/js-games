    /* 
        actions: initgame, joingame, move, completegame, getopengames, getongoinggames,getmoves

        initgame: create
        send: type,player,playerlimit,boardstate
        resive: guid

        joingame: update
        send: player,guid
        resive: comfirmation

        move: create & update
        send: guid,move,boardstate
        resive comfirmation

        completegame:
        send: guid,winner,boardstate
        resive: comfirmation

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
        matches: id,type,players,playerlimit,boardstate,guid,winner,movelist?
        moves:  id,guid,move
    */
class ApiHandler{
    constructor(url = "../database/chessgame.php", eUrl = "../database/matchmoves_eventsource.php"){

        this.dbUrl = url;

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
        if(document.querySelector(`#${e.data['id']}`)){
            //send event
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
        if(obj) for(const [key,value] of Object.entries(obj))data.append(key,value);
        return data;
    }

    sendFectch(obj){
        //todo return response
       return fetch(this.dbUrl,{
            method: 'POST',
            body: this.makeData(obj),
        }).then((response) => response.json()).then(result);

        // then((response) => response.json()).then((result) =>{result});

    }

    initGame(arr){
        const [type, player, playerlimit,boardstate] = arr
        const obj = {'action':'newGame','type': type,'player':player,'playerlimit':playerlimit,'boardstate':boardstate};
        return this.sendFectch(obj);
    }
 
    joinGame(arr){

    }
    move(obj){

    }

}
export {ApiHandler};

