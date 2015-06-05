define(
	[
		'jquery',
		'underscore',
		'socketio'
	],
	function(
		$,
		_,
		io
	) {
		return function(model) {
			this.model = model;
			this.socket = io('http://' + window.location.hostname + ':3000');

			this.model.board.on('change:positions', function() {
				this.socket.emit('change:positions', this.model.board.get('positions'));
			}.bind(this));

			this.socket.on('change:positions', function(data) {
				this.model.board.set('positions', data);
			}.bind(this));
		};
	}
);