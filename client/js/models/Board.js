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
				WHITE: 1,
				BLACK: 2
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

				// TODO user input for definition
				this.set('positions', INITIAL_POSITIONS);
			},

			movePiece: function(oldRank, oldFile, newRank, newFile) {
				var piece = this.get('positions')[oldRank][oldFile];

				if (piece !== null) {
					this.get('positions')[oldRank][oldFile] = null;
					this.get('positions')[newRank][newFile] = piece;	
					this.trigger('change:positions');
				}
			}
		});
	}
);