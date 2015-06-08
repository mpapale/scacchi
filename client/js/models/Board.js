define(
	[
		'jquery',
		'underscore',
		'backbone'
	],
	function(
		$,
		_,
		Backbone
	) {
		var PIECES = {
				PAWN: 'P',
				KNIGHT: 'N',
				BISHOP: 'B',
				ROOK: 'R',
				QUEEN: 'Q',
				KING: 'K'
			},
			COLORS = {
				WHITE: 'white',
				BLACK: 'black'
			},
			Piece = function(type, color) {
				this.type = type;
				this.color = color;

				switch (this.color) {
					case COLORS.BLACK:
						switch (this.type) {
							case PIECES.PAWN:
								this.label = '\u265F';
								break;
							case PIECES.KNIGHT:
								this.label = '\u265E';
								break;
							case PIECES.BISHOP:
								this.label = '\u265D';
								break;
							case PIECES.ROOK:
								this.label = '\u265C';
								break;
							case PIECES.QUEEN:
								this.label = '\u265B';
								break;
							case PIECES.KING:
								this.label = '\u265A';
								break;
						}
						break;
					case COLORS.WHITE:
						switch (this.type) {
							case PIECES.PAWN:
								this.label = '\u2659';
								break;
							case PIECES.KNIGHT:
								this.label = '\u2658';
								break;
							case PIECES.BISHOP:
								this.label = '\u2657';
								break;
							case PIECES.ROOK:
								this.label = '\u2656';
								break;
							case PIECES.QUEEN:
								this.label = '\u2655';
								break;
							case PIECES.KING:
								this.label = '\u2654';
								break;
						}
						break;
					default:
						break;
				}

			},
			INITIAL_POSITIONS = [
				[new Piece(PIECES.ROOK, COLORS.BLACK), new Piece(PIECES.KNIGHT, COLORS.BLACK), new Piece(PIECES.BISHOP, COLORS.BLACK), new Piece(PIECES.QUEEN, COLORS.BLACK), new Piece(PIECES.KING, COLORS.BLACK), new Piece(PIECES.BISHOP, COLORS.BLACK), new Piece(PIECES.KNIGHT, COLORS.BLACK), new Piece(PIECES.ROOK, COLORS.BLACK)],
				[new Piece(PIECES.PAWN, COLORS.BLACK), new Piece(PIECES.PAWN, COLORS.BLACK), new Piece(PIECES.PAWN, COLORS.BLACK), new Piece(PIECES.PAWN, COLORS.BLACK), new Piece(PIECES.PAWN, COLORS.BLACK), new Piece(PIECES.PAWN, COLORS.BLACK), new Piece(PIECES.PAWN, COLORS.BLACK), new Piece(PIECES.PAWN, COLORS.BLACK)],
				[null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null],
				[new Piece(PIECES.PAWN, COLORS.WHITE), new Piece(PIECES.PAWN, COLORS.WHITE), new Piece(PIECES.PAWN, COLORS.WHITE), new Piece(PIECES.PAWN, COLORS.WHITE), new Piece(PIECES.PAWN, COLORS.WHITE), new Piece(PIECES.PAWN, COLORS.WHITE), new Piece(PIECES.PAWN, COLORS.WHITE), new Piece(PIECES.PAWN, COLORS.WHITE)],
				[new Piece(PIECES.ROOK, COLORS.WHITE), new Piece(PIECES.KNIGHT, COLORS.WHITE), new Piece(PIECES.BISHOP, COLORS.WHITE), new Piece(PIECES.QUEEN, COLORS.WHITE), new Piece(PIECES.KING, COLORS.WHITE), new Piece(PIECES.BISHOP, COLORS.WHITE), new Piece(PIECES.KNIGHT, COLORS.WHITE), new Piece(PIECES.ROOK, COLORS.WHITE)]
			];

		return Backbone.Model.extend({
			initialize: function() {
				Backbone.Model.prototype.initialize.apply(this, arguments);
				this.setDefault();
			},

			save: function() {
				this.trigger('save');
			},

			movePiece: function() {
				var piece,
					oldRank,
					oldFile,
					newRank,
					newFile,
					existingPiece,
					existingColor,
					capturedKey,
					captured,
					setOld = false;

				if (_.isObject(arguments[0])) {
					piece = arguments[0];
					newRank = arguments[1];
					newFile = arguments[2];
					setOld = false;
				} else {
					oldRank = arguments[0];
					oldFile = arguments[1];
					piece = this.get('positions')[oldRank][oldFile];
					newRank = arguments[2];
					newFile = arguments[3];
					setOld = true;
				}
				existingPiece = this.get('positions')[newRank][newFile];
				existingColor = existingPiece && existingPiece.color;

				if (piece !== null) {
					if (existingPiece === null || existingPiece.color !== piece.color) {
						if (existingPiece !== null) {
							capturedKey = 'captured-' + existingPiece.color;
							captured = this.get(capturedKey);
							captured.push(existingPiece);
							this.trigger('change:' + capturedKey);
						}

						if (setOld) {
							this.get('positions')[oldRank][oldFile] = null;
						} else {
							this.set({
								'captured-white': _.without(this.get('captured-white'), piece),
								'captured-black': _.without(this.get('captured-black'), piece)
							});
						}
						this.get('positions')[newRank][newFile] = piece;	
						this.trigger('change:positions');
					}
				}

			},

			setDefault: function() {
				this.set({
					positions: INITIAL_POSITIONS,
					'captured-white': [],
					'captured-black': []
				});
			}
		});
	}
);