// todo: make web socket server
const WebSocket = require('ws');
const redis = require('redis');

const wss = new WebSocket.Server({port : 6000} );

const redisClient = redis.createClient();

const chatMessages = [];

//sends a message to all clients
const broadcast = (obj) => {
    wss.clients.forEach((client) => {
        client.send(JSON.stringify(obj));
    });
};

redisClient.on('message', (channel, message) => {
    // console.log(`Message on channel: ${channel} is ${message}`);
    const messageJSON = JSON.parse(message);
    // console.log('JSON: ' + messageJSON.userId);
    //messages each client if the client id and the message id match
    wss.clients.forEach((client) => {
        // console.log('client: ' + client.userId);
        if(client.userId === messageJSON.userId) {
            client.send(message);
        }
    });
});
    
redisClient.subscribe('testPublish');

//triggers when a client connects
//saves userId and sends messages to everyone who connects
wss.on('connection', (ws) => {
    console.log('Client has connected.');
    //event handler when a message is received
    //saves message into chatMessages array 
    ws.on('message', (data) => {
        const dataID = JSON.parse(data);
        console.log(dataID)
        chatMessages.push(dataID);
        broadcast({
            type: 'UPDATE_CHAT',
            chatMessages: chatMessages,
        });
    });
});