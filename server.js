var io      = require('socket.io'),
    express = require('express'),
    port    = 3000,
    host    = 'localhost';

if (process.argv.length == 3) {
    port = process.argv[2];
} else if (process.argv.length == 4) {
    port = parseInt(process.argv[2]);
    host = process.argv[3];
}

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
    res.render('index', {
        title: 'BrainSocket'
    });
});


app.listen(port, host);

var socket = io.listen(app),
    buffer = [];

socket.on('connection', function(client) {
    client.send({ buffer: buffer });
    client.broadcast({ info: client.sessionId + ' connected' });
    
    client.on('message', function(msg) {
        if ('sticky' in msg) {
            buffer.push(msg);
            client.broadcast(msg);
        } else if ('position' in msg) {
            console.log(msg.position);
            client.broadcast(msg.position);
        }
    });
    
    client.on('disconnect', function() {
        client.broadcast({ info: client.sessionId + ' disconnected' });
    });
});
console.log("Express server running at http://" + app.address().address + ':' + app.address().port);
