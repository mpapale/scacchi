var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var lastData = null;

app.set('port', (process.env.PORT || 5000));
app.use('/', express.static(__dirname + '/client'));

io.sockets.on('connection', function(socket) {
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

server.listen(app.get('port'), function() {
	console.log('listening on ', app.get('port'));
});
