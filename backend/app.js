import { WebSocketServer } from 'ws';
import {ApiHandler} from './api.js';

//todo list
/* 
mysql database conn
test querys
add observer role
test stuf

*/

const wss = new WebSocketServer({ port: 8080 });
const sql = new ApiHandler();
const BoardData = new Map();

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
                        ws.send(JSON.stringify({'action':'makegame','response': boardID}));
                        console.log(ws.boardID);
                    })
            break;
            case 'joinGame':
                sql.joinBoard(msg.boardID,msg.player,(response) =>{
                    ws.board = msg.boardID;
                    ws.send(JSON.stringify({'action':'joinGame', 'response':msg.boardID}));
                });
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
