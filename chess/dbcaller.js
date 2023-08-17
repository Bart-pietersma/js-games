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
       constructor(ws = true,url = 'rtdb.nl'){
            //! ws for localhost wss for evrythign else
            //db
            this.url = '127.0.0.1:8080';
            
            //websocket
            if(ws){
                this.ws = new WebSocket(`ws://${this.url}`);
                this.ws.addEventListener("open", () =>{
                    console.log("We are connected");
                });
                this.ws.addEventListener('message', (e) => this.resiveMsg(e));
            }
        }

        get container(){
            return document.querySelector(`game-container`);
        }


        /*
                WS functions
        */
    makeGame(type = 'chess',player = 'test',playeramount = '1/2',boardInfo ='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0'){
        //sends the makegame to the db returns the boardid
        this.ws.send(JSON.stringify({'action':'makeGame',type,player,'playerlimit':playeramount,'boardstate':boardInfo}));
    }
    joinGame(boardID = 'test',player = 'test'){
        //sends a update in the db
        this.ws.send(JSON.stringify({'action':'joinGame',boardID,player}));
    }

    endGame(score){
        //sets the score in the db
        this.ws.send(JSON.stringify({'action':'endGame','resolution':score}));
    }
   
    getOpenGames(){
        this.ws.send(JSON.stringify({'action':'getOpenGames'}));
    }
    
    getOngoingGames(){
        this.ws.send(JSON.stringify({'action':'getOngoingGames'}));
    }

    getMoves(boardID){
        this.ws.send(JSON.stringify({'action':'getMoves',boardID}))
    }
    requestID(){
        this.ws.send(JSON.stringify({'action':'makeID'}));
    }
    move(id,move,boardState){
        //todo rename fen to boardstate and match_guid to match_id
        this.ws.send(JSON.stringify({'action':'move',id,move,boardState}));
    }

    /*
            ws comunication
    */
    resiveMsg(e){
        const data = JSON.parse(e.data);
        const board = document.getElementById(data.id);
        console.log(data);

        switch(data.action){
            case 'move':
                if(board && data.fen != board.fen){
                    //send move to board
                    console.log(data.move);
                   const [toCell,fromCell] = this.moveInterpreter(data.move,data.fen);
                   const evt = new CustomEvent('db-move',{detail : data});
                    board.moveHandler(toCell,fromCell,'db')
                    board.dispatchEvent(evt)
                }

            break;
            case `makegame`:
                console.log(666);
                const evt = new CustomEvent('db-newgame',{detail : data.response});
                this.container.dispatchEvent(evt);
            break;
            case 'globalChat':

            break;

            case 'matchChat':

            break;
        }
    }//end recivemsg

    //chess interpreter todo move to chess
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
console.log('apiHandler loaded');
export {DbHandler};

