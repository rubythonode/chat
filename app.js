(function(win, doc, $){
    "use strict";
    var $input = $('#input'),
        $chat = $('#chat'),
        $doc = $(doc),
        profile = {
            id : Math.random() + new Date().getTime(),
            nick : prompt('닉네임을 입력하세요') || '손님',
            image : 'http://www.sherv.net/cm/emo/laughing/avatar-laughter-smiley-emoticon.gif'
        },
        socket = io('http://localhost:4000'),
        joined = false;

    socket.on('connect', function(){
        if(joined) return;
        socket.emit('join', profile);
    });

    socket.on('join', function(profile){
        joined = true;
        $chat.append(`<li class="divider">${profile.nick} 님이 입장하셨습니다.</li>`);
    });

    socket.on('message', onReceivedMessage);

    $input.on('keyup', function(e){
        var text = e.target.value;
        if(!text) return;
        if(e.keyCode === 13){
            send(text);
            e.target.value = '';
        }
    });
    
    function template(msg){
        return `
            <li class="${msg.id === profile.id ? 'self' : 'other'}">
                <div class="avatar">
                    <img src="${msg.image}">
                </div>
                <div class="msg">
                    <p>${msg.nick}</p>
                    <p>${msg.text}</p>
                    <time>${msg.time}</time>
                </div>
            </li>
        `
    }
    
    function send(text) {
        var _profile = profile,
            message = {
                text : text,
                image : _profile.image,
                id : _profile.id,
                nick : _profile.nick
            };
        socket.emit('message', message);
        //onReceivedMessage(message);
    }
    function onReceivedMessage(msg) {
        $chat.append(template(msg));
        $doc.scrollTop($doc.height());
    }
}(window, document, jQuery));
