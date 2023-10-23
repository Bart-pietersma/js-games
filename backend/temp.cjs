const WebSocketServer = require('ws');
const mysql = require('mysql');
const wss = new WebSocketServer.Server({ port: 8080 });

class ApiHandler {
  constructor() {
    //   this.pool = mysql.createPool({
        // connectionLimit: 10,
    //       host:'localhost',
    //       database: 'rtdb-db',
    //       user:'rtdbadmin',
    //       password:'Z25j8&v9p',
    // });
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: `schaakzet.nl`,
      database: `schaakzet_main`,
      user: `schaakzet_mainadmin`,
      password: `SCH@@K!mat`
    });

    this.querys = {
      //board stuff
      newGame: 'INSERT INTO boards (boardID,boardType,players,playerlimit,boardState) VALUES (?,?,?,?,?)',
      move: 'INSERT INTO moves (boardID, move) VALUES (?,?) ',
      getMoves : 'SELECT move FROM moves where boardID = ? ',
      updateBoardState: 'UPDATE boards SET boardState = ? where boardID = ?',
      getPlayers: 'SELECT players, playerlimit from boards where boardID = ?',
      addPlayer: 'UPDATE boards set players = ?, playerlimit = ? WHERE boardID = ?',
      endGame: 'UPDATE boards set resolution = ?, endtime = CURENT_TIMESTAMP() WHERE boardID = ?',

      //lobby stuf
      showAvailbleBoards: 'SELECT boardID,boardType,playerLimit FROM boards Where playerLimit != "full" ',

      //observer
      ongoingGames: 'SELECT boardID,boardType,playerLimit FROM boards Where playerLimit = "full" ',

      //delete stuf
      deleteGame: 'DELETE FROM boards WHERE boardID = ?',
      deleteMoves: 'DELETE FROM moves WHERE boardID = ?',
    }

  }

  //! make safty check to comfirm if query is a duplicate

  createBoard(arr, callback) {
    //send a createboard query to the database return a okpacket object
    this.EscapeQuery(
      this.querys.newGame,
      arr,
      (response) => {
        callback(response);
      });
  }

  checkdubbel(string, check){
    return string.split(`,`).includes(check);
  }

  joinBoard(boardID, newplayer, callback) {
    //todo make so acidentel joingames to same user not good
    this.EscapeQuery(this.querys.getPlayers, boardID, (response) => {
      if(response[0]){
        const players = response[0].players;
        let playerlimit = response[0].playerlimit;
        playerlimit == `full` && callback(`match full`);
        //check dubbel user
        if(this.checkdubbel(response[0].players,newplayer)){
          callback(`user already in game`);
        }else{
          //todo check if player is in last spot then add full to playerlimit
          newplayer = players + `,` + newplayer;
          if(newplayer.split(`,`).length == playerlimit) playerlimit = `full`;
          this.EscapeQuery(this.querys.addPlayer, [newplayer,playerlimit, boardID], (response) => {
            callback(boardID);
          });
        } 
      }
      else{
        console.log(`eror board undifined`);
       callback(`boardID undifined`); 
      }
    });
  }

  endGame(boardID, resolution, callback) {
    this.EscapeQuery(this.querys.endGame,[resolution,boardID],(response)=>{
      callback(response);
    })
  }

  sendMove(boardID, move, boardState, callback) {
    let ok = 0;
    this.EscapeQuery(
      this.querys.move,
      [boardID, move],
      (response) => {
        response && ok++;
        this.EscapeQuery(
          this.querys.updateBoardState,
          [boardState, boardID],
          (response) => {
            response && ok++;
            if (ok == 2) {
              callback('sucsesful')
            } else {
              callback('error');
            }
          });
      });
  }

  getOpenGames(callback) {
    this.Query(
      this.querys.showAvailbleBoards,
      (response) => {
        //returns a arr[] with obj{boardID,boardType,playerlimit}
        callback(response);
      });
  }

  getOngoingGames(callback){
    this.Query(
      this.querys.ongoingGames,
      (response) => {
        console.log(response);
        callback(response);
      });
  }
  getMoves(boardID,callback){
    this.EscapeQuery(
      this.querys.getMoves,
      boardID,
      (response) => {
        console.log(response);
        callback(response);
      });
  }

  Query(query, callback) {
    this.pool.query(query, (error, results, fields) => {
      if (error) throw error;
      callback(results);
    });
  };

  EscapeQuery(query, arr, callback) {
    this.pool.query(query, arr, (error, results, fields) => {
      if (error) throw error;
      callback(results);
    });
  };

  close() {
    this.pool.end((err) => { });
  }

}

const sql = new ApiHandler();

wss.on("connection", ws => {
    console.log("new client connected");
    //seting data on client
    ws.id = uuidv4();
    ws.boardID = 'observer';


    // sending message to client
    ws.send(JSON.stringify(`conection has happend`));

    //on message from client
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`)
        const msg = JSON.parse(data);

        switch(msg.action){
            case `matchChat`:
                wss.clients.forEach(client => {
                    //todo test
                    if(boardData.get(msg.boardID).inculde(client.id))client.send(JSON.stringify(msg));
                });
            break;
            case `globalChat`:
                wss.clients.forEach(client => {
                    client.send(JSON.stringify(msg));
                });
            break;
            case 'move':
                //send move to other user
                sql.sendMove(
                    msg.id, msg.move, msg.boardState,
                    (response) =>{
                        wss.clients.forEach(client => {
                            client != ws && (ws.boardID == msg.id || ws.boardID == 'observer') && client.send(JSON.stringify(msg));
                            // client.send(JSON.stringify(msg))
                        });
                })
            break;
            case 'makeGame':
                //make board in the db
                const boardID = uuidv4();
                sql.createBoard(
                    [boardID,msg.type,msg.player,parseInt(msg.playerlimit),msg.boardstate],
                    (response)=> {
                        ws.boardID = boardID;
                        ws.send(JSON.stringify({'action':'newgame','response': boardID}));
                    })
            break;
            case 'joinGame':
                sql.joinBoard(msg.boardID,msg.player,(response) =>{
                    ws.board = msg.boardID;
                    ws.send(JSON.stringify({'action':'joinGame', response}));
                });
            break;
            case 'spectateGame':

            break;
            case 'endgame':
                sql.endGame(msg.boardID,msg.resolution,(response) =>{
                    ws.board = msg.boardID;
                    ws.send(JSON.stringify({'action':'endGame', 'response':msg.resolution}));
                });
            break;
            case 'getOpenGames':
                sql.getOpenGames((response) =>{
                    ws.send(JSON.stringify({'action':'getOpenGames',response}));
                });

            break;
            case `getOngoinGames`:
                sql.getOngoinGames((response) =>{
                    ws.send(JSON.stringify({'action':'getOngoinGames',response}));
                });
            break;
            case 'getMoves':
                sql.getMoves(msg.boardID,(response) =>{
                    ws.send(JSON.stringify({'action':'getMoves',response}));
                });
            break;

            //maby remove bellow
            case 'requestID':

            break;
            case 'query':
                //how to prune a full query from user?
            break;
        }
    });

    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has disconnected");
        //todo remove user from data
        //todo send user quited to others on the same board

    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});
}
console.log("The WebSocket server is running on port 8080");
