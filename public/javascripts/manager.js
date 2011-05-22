var EVENT_CONNECT          = 'connect',
    EVENT_DISCONNECT       = 'disconnect',
    EVENT_MESSAGE          = 'message',
    EVENT_RECONNECT        = 'reconnect',
    EVENT_RECONNECTING     = 'reconnecting',
    EVENT_RECONNECT_FAILED = 'reconnect_failed',
    socket,
    isInitialized = false;

function initializeSocket() {
    socket = new io.Socket('192.168.1.6', 3000);
    socket.on(EVENT_MESSAGE, function(obj) { messageHandler(obj); });
    socket.on(EVENT_CONNECT, function() {
        messageHandler({ info: 'System Connected' });
    });
    socket.on(EVENT_DISCONNECT, function() {
        messageHandler({ info: 'System Disconnected' });
    });
    socket.on(EVENT_RECONNECT, function() {
        messageHandler({ info: 'System Reconnected to server' });
    });
    socket.on(EVENT_RECONNECTING, function(nextRetry){
        messageHandler({ info: 'System Attempting to re-connect to the server, next attempt in ' + nextRetry + 'ms'});
    });
    socket.on(EVENT_RECONNECT_FAILED, function() {
        messageHandler({ info: 'System Reconnected to server FAILED.'});
    });
    socket.connect();
}

function messageHandler(msg) {
    if ('buffer' in msg) {
        var buf = msg.buffer;
        for (var i in buf) {
            if ('info' in buf[i]) {
                notify(buf[i].info);
            } else if ('sticky' in buf[i]) {
                var s = buf[i].sticky;
                if (!isInitialized) {
                    s.options.stickifyId = buf.length;
                    isInitialized = true;
                }
                createSticky(s.text, s.options);
            }
        }
    } else if ('info' in msg) {
        notify(msg.info);
    } else if ('sticky' in msg) {
        var s = msg[i].sticky;
        createSticky(s.text, s.options);
    }
}

// Growl風アラートを作成.
function notify(msg) {
    $('<div></div>')
        .addClass('notification')
        .text(msg)
        .appendTo('#info')
        .fadeIn(1000)
        .delay(2000)
        .fadeOut(500);
}

// サーバーへ新規スティッキーの情報を送信.
function registerSticky(text, options) {
    options.authorId = socket.transport.sessionid;
    var newSticky = createSticky(text, options);
    options.stickifyId = parseInt($(newSticky).data('stickify_id'));
    var stickyObj = {
        sticky: {
            text: text,
            options: options
        }
    };
    socket.send(stickyObj);
}

// 新規スティッキーを作成.
function createSticky(text, options) {
    return $('<div></div>').stickify(text, options);
}

function sendMessage(msg) {
    socket.send(msg);
    messageHandler({ message: ['you', msg] });
}