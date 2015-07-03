define(function(require) {
	var React = require('react');

	var App = function() {
		this.AppView = React.createClass({
			render: function() {
				return (
					<div>
						<p>Hello, Scacchi-React!</p>
					</div>
				);
			}
		});
	};

	App.prototype.init = function() {
		React.render(<this.AppView />, document.body);
	};

	return App;
});
