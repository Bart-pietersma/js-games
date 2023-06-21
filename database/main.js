// Importing the required modules
const WebSocketServer = require('ws');
 
// Creating a new websocket server
const wss = new WebSocketServer.Server({ port: 8080 })
 
// Creating connection using websocket
wss.on("connection", ws => {
    console.log("new client connected");
    // sending message to client
    ws.send(JSON.stringify(`conection has happend`));
 
    //on message from client
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`)
        const msg = JSON.parse(data);

        switch(msg.action){
            case 'move':
                //send move to other user
                wss.clients.forEach(client => {
                    client.send(JSON.stringify(msg));
                });
            break;
            case 'makeID':
                ws.send(JSON.stringify({'id':uuidv4()}));
            break;
            default:

            break;
        }
    });
 
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has disconnected");
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}
console.log("The WebSocket server is running on port 8080");