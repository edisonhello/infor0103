var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.sockets.on('connection', function(socket){
	io.sockets.on('sendchat', function(text){
		io.emit("pubchat", text);
	});
});

server.listen(3001);