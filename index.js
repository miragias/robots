const express = require('express');
const Websocket = require('ws');
const boardLogic = require('./public/js/boardLogic');
const app = express();
const server = require('http').Server(app);
const wss = new Websocket.Server({server});
//import {myExport} from './public/js/boardLogic';

var directory = __dirname + '/public';
app.use(express.static(__dirname + '/public'));

wss.on('connection' , function connection(ws){
	console.log("connected");
});
 
app.get('/', function (req, res) {
  res.sendFile(directory + '/index.html');
});

wss.on('connection' , (ws) => {

	ws.on('message' , (message) => 
		{
			console.log('received: %s', message);
			ws.send('HEY THERE');
		});

	ws.send(boardLogic.createBoard());
});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});
