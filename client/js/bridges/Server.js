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
			this.socket = io();

			this.model.board.on('save', function() {
				this.socket.emit('change:positions', this.model.board.toJSON());
			}.bind(this));

			this.socket.on('change:positions', function(data) {
				this.model.board.set(data);
			}.bind(this));
		};
	}
);