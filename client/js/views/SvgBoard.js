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
		var SIZE = $(window).width() - 50;

		var $createElement = function(type) {
			return $(document.createElementNS('http://www.w3.org/2000/svg', type));
		};

		return Backbone.View.extend({
			initialize: function(options) {
				Backbone.View.prototype.initialize.apply(this, arguments);

				this.perspective = options.perspective || 'white';

				this.setElement($createElement('svg'));
				this.$el.attr('class', this.className);

				this.listenTo(this.model.board, 'change:positions', this.render);
			},

			render: function() {
				var boardPositions = this.model.board.get('positions'),
					positionSize = SIZE / boardPositions.length,
					white = true,
					drawX = 0,
					drawY = 0;

				// delegate events?
				this.$el.empty();

				this.$el.attr({
					width: SIZE,
					height: SIZE
				});

				if (this.perspective === 'black') {
					boardPositions = _.clone(boardPositions);
					boardPositions.reverse();
				}

				_.each(boardPositions, function(rank, rankIndex) {
					drawX = 0;

					if (this.perspective === 'black') {
						rank = _.clone(rank);
						rank.reverse();
					}

					_.each(rank, function(piece, pieceIndex) {
						this.$el.append($createElement('rect')
							.attr({
								x: drawX,
								y: drawY,
								width: positionSize,
								height: positionSize,
								fill: white ? 'white' : '#bbb'
							})
							.data({ 
								rank: this.perspective === 'black' ? boardPositions.length - rankIndex - 1: rankIndex, 
								file: this.perspective === 'black' ? rank.length - pieceIndex - 1 : pieceIndex
							})
							.click(this.positionClick.bind(this))
						);

						if (piece !== null) {
							this.$el.append($createElement('text')
								.attr({
									x: drawX + (positionSize/2),
									y: drawY + (positionSize/2) + 10,
									width: positionSize,
									height: positionSize,
									'font-size': positionSize/1.5,
									'text-anchor': 'middle'
								})
								.text(piece.label)
							);
						}

						white = !white;
						drawX += positionSize;
					}, this);

					white = !white;
					drawY += positionSize;
				}, this);

				return this;
			},

			positionClick: function(e) {
				var $el = $(e.target),
					cssClass = $el.attr('class'),
					highlightedPositions = this.$el.find('.highlight'),
					$highlightedPosition = highlightedPositions.length && $(highlightedPositions.get(0));

				if (cssClass === 'highlight') {
					$el.attr('class', '');
				} else if ($highlightedPosition) {
					this.model.board.movePiece(
						$highlightedPosition.data('rank'), $highlightedPosition.data('file'),
						$el.data('rank'), $el.data('file')
					);
					$highlightedPosition.attr('class', '');
				} else {
					$el.attr('class', 'highlight');
				}
			}
		});
	}
);