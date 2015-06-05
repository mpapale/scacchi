var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var lastData = null;

io.on('connection', function(socket) {
	console.log('client connected');

	if (lastData !== null) {
		socket.emit('change:positions', lastData);
	}

	socket.on('change:positions', function(data) {
		console.log('client changed position');
		lastData = data;

		socket.broadcast.emit('change:positions', data);
	});

	socket.on('disconnect', function() {
		console.log('client disconnected');
	});
});

http.listen(3000, function() {
	console.log('listening on 3000');
});
