require.config({
    baseUrl: 'js',
    paths: {
        'jquery': 'contrib/jquery/dist/jquery.min',
        'underscore': 'contrib/underscore/underscore-min',
        'backbone': 'contrib/backbone/backbone',
        'bootstrap': 'contrib/bootstrap/dist/js/bootstrap.min',
        'socketio': 'contrib/socket.io-client/socket.io'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: '$.fn.popover'
        }
    }
});

require(
    [
        'jquery',
        'underscore',
        'backbone',
        'bridges/Server',
        'models/Board',
        'views/SvgBoard'
    ], 
    function(
        $,
        _,
        Backbone,
        ServerBridge,
        BoardModel,
        SvgBoardView
    ) {
        var boardModel = new BoardModel();
        var serverBridge = new ServerBridge({
            board: boardModel
        });
        var boardView1 = new SvgBoardView({
            className: 'float-left',
            perspective: window.location.search.indexOf('black') !== -1 ? 'black' : 'white',
            model: {
                board: boardModel
            }
        });
        boardView1.render().$el.appendTo($('body'));
    }
);