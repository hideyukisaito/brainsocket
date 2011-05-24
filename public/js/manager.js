var socket,
    isInitialized = false;

function initSocket() {
    socket = new io.Socket('192.168.1.6', 3000);
    socket.connect();
    socket.on('message', function(obj) { messageHandler(obj); });
    socket.on('connect', function() {
        messageHandler({ info: 'System Connected' });
    });
    socket.on('disconnect', function() {
        messageHandler({ info: 'System Disconnected' });
    });
    socket.on('reconnect', function() {
        messageHandler({ info: 'System Reconnected to server' });
    });
    socket.on('reconnecting', function(nextRetry){
        messageHandler({ info: 'System Attempting to re-connect to the server, next attempt in ' + nextRetry + 'ms'});
    });
    socket.on('reconnect_failed', function() {
        messageHandler({ info: 'System Reconnected to server FAILED.'});
    });
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
                createSticky(s.text, s.options, socket);
            }
        }
    } else if ('info' in msg) {
        notify(msg.info);
    } else if ('sticky' in msg) {
        console.log(msg);
        var s = msg.sticky;
        createSticky(s.text, s.options);
    } else if ('x' in msg && 'y' in msg) {
        console.log(msg);
        var sticky = $('#sticky_' + msg.stickify_id).css({'z-index': 1000});
        $(sticky).css({ 'left': msg.x + 'px', 'top': msg.y + 'px' });
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
function registerSticky(content, options) {
    options.authorId = socket.transport.sessionid;
    var newSticky;
    if (content.indexOf('iframe') != -1) {
        content = $(modIframeSize(content, 270, 222));
        newSticky = $('<div style="padding:10px;"></div>').append(content).stickify('', options, socket);
    } else {
        newSticky = createSticky(content, options, socket);
    }
    options.stickifyId = parseInt($(newSticky).data('stickify_id'));
    socket.send({
        sticky: {
            text: content,
            options: options
        }
    });
}

// 新規スティッキーを作成.
function createSticky(text, options, soc) {
    return $('<div></div>').stickify(text, options, soc);
}


function modIframeSize(iframe, w, h) {
    return iframe
        .replace(/(width="[0-9]{3}")/, 'width="' + w + '"')
        .replace(/(height="[0-9]{3}")/, 'height="' + h + '"');
}