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
		var SIZE = Math.min($(window).width(), $(window).height()) - 20;

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
				this.listenTo(this.model.board, 'change:captured-white', this.render);
				this.listenTo(this.model.board, 'change:captured-black', this.render);
				this.listenTo(this.model.board, 'change:last-moved', this.render);
			},

			render: function() {
				var boardPositions = this.model.board.get('positions'),
					capturedWhite = this.model.board.get('captured-white'),
					capturedBlack = this.model.board.get('captured-black'),
					positionSize = SIZE / boardPositions.length,
					fontSize = positionSize/1.5,
					white = true,
					drawX = 0,
					drawY = 0,
					$position = null;

				// delegate events?
				this.$el.empty();

				this.$el.attr({
					width: SIZE,
					height: SIZE * 2
				});

				if (this.perspective === 'black') {
					boardPositions = _.clone(boardPositions);
					boardPositions.reverse();
				}

				// Render the real board
				_.each(boardPositions, function(rank, rankIndex) {
					drawX = 0;

					if (this.perspective === 'black') {
						rank = _.clone(rank);
						rank.reverse();
					}

					_.each(rank, function(piece, pieceIndex) {
						var data = {
							rank: this.perspective === 'black' ? boardPositions.length - rankIndex - 1: rankIndex, 
							file: this.perspective === 'black' ? rank.length - pieceIndex - 1 : pieceIndex
						};
						$position = $createElement('rect');
						$position.attr({
								x: drawX,
								y: drawY,
								width: positionSize,
								height: positionSize,
								fill: white ? 'white' : '#bbb'
							})
							.data({ 
								$target: $position,
								rank: data.rank,
								file: data.file
							})
							.click(this.positionClick.bind(this));
						this.$el.append($position);

						if (piece !== null) {
							this.$el.append($createElement('text')
								.attr({
									x: drawX + (positionSize/2),
									y: drawY + (positionSize/2) + (fontSize/2.5),
									width: positionSize,
									height: positionSize,
									'font-size': fontSize,
									'text-anchor': 'middle',
									'class': 'board-piece'
								})
								.data({
									$target: $position,
									rank: data.rank,
									file: data.file
								})
								.text(piece.label)
								.click(this.positionClick.bind(this))
							);
						}

						white = !white;
						drawX += positionSize;
					}, this);

					white = !white;
					drawY += positionSize;
				}, this);

				// Render the captured pieces
				drawY += 20; // random buffer, refactor TODO

				$createElement('text')
					.attr({
						x: 0,
						y: drawY,
						'font-size': '20'
					})
					.text('Last moved: ' + 
						(this.model.board.get('last-moved') || 'none') 
					)
					.appendTo(this.$el);

				drawY += 20; // random buffer, TODO
				_.each(this._chunkCaptured(capturedWhite), function(chunk) {
					var $target;
					drawX = 0;
					_.each(chunk, function(piece) {
						$target = $createElement('rect');
						$target.attr({
								x: drawX,
								y: drawY,
								width: positionSize,
								height: positionSize,
								fill: '#eee'
							})
							.data({ 
								$target: $target,
								piece: piece
							})
							.click(this.positionClick.bind(this));
						this.$el.append($target);

						this.$el.append($createElement('text')
							.attr({
								x: drawX + (positionSize/2),
								y: drawY + (positionSize/2) + (fontSize/2.5),
								width: positionSize,
								height: positionSize,
								'font-size': fontSize,
								'text-anchor': 'middle',
								'class': 'board-piece'
							})
							.text(piece.label)
							.data({ 
								$target: $target,
								piece: piece
							})
							.click(this.positionClick.bind(this))
						);
						drawX += positionSize;
					}, this);
					drawY += positionSize;
				}, this);

				drawY += 20; // TODO random buffer refactor
				_.each(this._chunkCaptured(capturedBlack), function(chunk) {
					var $target;
					drawX = 0;
					_.each(chunk, function(piece) {
						$target = $createElement('rect');
						$target.attr({
								x: drawX,
								y: drawY,
								width: positionSize,
								height: positionSize,
								fill: '#eee'
							})
							.data({ 
								$target: $target,
								piece: piece
							})
							.click(this.positionClick.bind(this));
						this.$el.append($target);

						this.$el.append($createElement('text')
							.attr({
								x: drawX + (positionSize/2),
								y: drawY + (positionSize/2) + (fontSize/2.5),
								width: positionSize,
								height: positionSize,
								'font-size': fontSize,
								'text-anchor': 'middle',
								'class': 'board-piece'
							})
							.text(piece.label)
							.data({ 
								$target: $target,
								piece: piece
							})
							.click(this.positionClick.bind(this))
						);
						drawX += positionSize;
					}, this);
					drawY += positionSize;
				}, this);

				return this;
			},

			positionClick: function(e) {
				var $el = $(e.target),
					$target = $el.data('$target'),
					cssClass = $target.attr('class'),
					highlightedPositions = this.$el.find('.highlight'),
					$highlightedPosition = highlightedPositions.length && $(highlightedPositions.get(0)),
					piece = $highlightedPosition && $highlightedPosition.data('piece'),
					args = [];

				if (cssClass === 'highlight') {
					$target.attr('class', '');
				} else if ($highlightedPosition && !$el.data('piece')) {
					if (piece) {
						args.push(piece);
					} else {
						args.push($highlightedPosition.data('rank'));
						args.push($highlightedPosition.data('file'));
					}
					args.push($el.data('rank'));
					args.push($el.data('file'));
					this.model.board.movePiece.apply(this.model.board, args);
					$highlightedPosition.attr('class', '');
					this.model.board.save();
				} else {
					$target.attr('class', 'highlight');
				}
			},

			_chunkCaptured: function(captured) {
				return _.toArray(
					_.groupBy(captured, function(piece, index) {
						return Math.floor(index / 8);
					})
				) || [];
			}
		});
	}
);