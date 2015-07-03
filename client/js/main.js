require.config({
    baseUrl: 'js',
    paths: {
        'jquery': 'contrib/jquery/dist/jquery.min',
        'underscore': 'contrib/underscore/underscore-min',
        'backbone': 'contrib/backbone/backbone',
        'bootstrap': 'contrib/bootstrap/dist/js/bootstrap.min',
        'socketio': 'contrib/socket.io-client/socket.io',
        'react': 'contrib/react/react-with-addons',
        'JSXTransformer': 'contrib/react/JSXTransformer',
        'jsx': 'contrib/requirejs-react-jsx/jsx',
        'text': 'contrib/requirejs-text/text'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: '$.fn.popover'
        },
        'react': {
            exports: 'React'
        },
        'JSXTransformer': 'JSXTransformer'
    },
    config: {
        jsx: {
          fileExtension: '.jsx',
          transformOptions: {
            harmony: true,
            stripTypes: false,
            inlineSourceMap: true
          },
          usePragma: false
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
        'views/SvgBoard',
        'jsx!app'
    ], 
    function(
        $,
        _,
        Backbone,
        ServerBridge,
        BoardModel,
        SvgBoardView,
        App
    ) {
        // var qsp = {
        //     perspective: window.location.search.indexOf('black') !== -1 ? 'black' : 'white',
        //     reset: window.location.search.indexOf('reset') !== -1 
        // };
        // var boardModel = new BoardModel();
        // var serverBridge = new ServerBridge({
        //     board: boardModel
        // });
        // var boardView1 = new SvgBoardView({
        //     className: 'float-left',
        //     perspective: qsp.perspective,
        //     model: {
        //         board: boardModel
        //     }
        // });
        // boardView1.render().$el.appendTo($('body'));

        // // This doesn't work so great, needs a reload
        // // Should probably move the sync logic to the model
        // if (qsp.reset) {
        //     boardModel.setDefault();
        //     boardModel.save();
        // }
        var app = new App();
        app.init();
    }
);