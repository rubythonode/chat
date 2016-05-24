const io = require('socket.io').listen(4000);

io.sockets.on('connect', socket => {
    socket.on('join', profile => io.sockets.emit('join', profile));
    socket.on('message', message => {
        const date = new Date();
        message.time = [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
        io.sockets.emit('message', message);
    })
});
