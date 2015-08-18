var express = require('express');
var favicon = require('serve-favicon');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var lastData = null;

app.set('port', (process.env.PORT || 5000));
app.use(favicon(__dirname + '/client/images/favicon.ico'));
app.use('/', express.static(__dirname + '/client'));


var pg = require('pg');

var conString = "postgres://postgres:wellcraft210dc@localhost/MyFirst";

var dbclient = new pg.Client(conString);
dbclient.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  dbclient.query('SELECT pet_name from ppapale.pet', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    } 	
	
	for (var i=0; i < result.rows.length; i++){
		console.log(result.rows[i].pet_name);
	}
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
	result.rows.forEach(function (row) {
       console.log(row.pet_name);		
	});
//    dbclient.end();
  });
});

io.sockets.on('connection', function(socket) {
	var client = socket.client.request.connection.remoteAddress;
	console.log(client, 'connected');

	if (lastData !== null) {
		socket.emit('change:positions', lastData);
	}

	socket.on('change:positions', function(data) {
		console.log(client, 'changed position');
		lastData = data;
		var command='insert into ppapale.scacchi values (\'' + JSON.stringify(data) + '\')';
		console.log(command);
        dbclient.query(command, function(err, result) {
			if(err) {
				console.error('error running query', err);
			}
			else {
				console.log('successfully wrote to database')
			}
        });			
		socket.broadcast.emit('change:positions', data);
	});

	socket.on('disconnect', function() {
		console.log(client, 'disconnected');
	});
});

server.listen(app.get('port'), function() {
	console.log('listening on ', app.get('port'));
});
