var name, owner, sessionId, db, ref, isX = true, finished = false, cells = {}, moves = [], checkLines = [[0, 1], [1, 0], [1, 1], [1, -1]], movesList = document.getElementById('moves');

function move(td, sign) {
    var x = +td.id[1], y = +td.id[2], key = '' + x + y, sign = sign ? sign : isX ? 'x': 'o';
    if (!cells[key] && !finished && (!owner || owner == name || !isX)) {
        moves.push([td.id, sign]);
        cells[key] = sign;
        td.className = sign;

        ref.child(moves.length).setWithPriority({move: td.id, sign: sign, name: name}, moves.length);
        isX = sign == 'o';
        // Check wins
        for (var i = 0; i < 4; i++) {
            var count = 0, d = checkLines[i], x1 = x - 2 * d[0], y1 = y - 2 * d[1], tds = [];
            for (j = 0; j < 5; j++) {
                var key = '' + x1 + y1, c = cells[key];
                if (c) {
                    if (c == sign && count < 3) {
                        count++;
                        tds.push(document.getElementById('c' + key));
                    } else break;
                }
                x1 += d[0];
                y1 += d[1];
            }
            if (count == 3) {
                finished = true;
                for (var k in tds) {
                    tds[k].className = tds[k].className + ' won';
                }
            }
        }
        // Update UI

        document.getElementById('move').innerHTML = (owner && owner == name ? (isX ? 'Your, ' + name : 'opponent') : name) + '\'s (' + (isX ? 'x': 'o') + ') ';
        var m = document.createElement('li');
        m.innerHTML = sign + ' &rarr; ' + (x + 1) + ' : ' + (y + 1);
        movesList.appendChild(m);
    }
}

function setVisibility(id, state) {
    var el = document.getElementById(id);
    if (el) {
        el.className = state ? '': 'hidden';
    }
}

function createCookie(key, value, days) {
    document.cookie = key + '=' + value;
    console.log(document.cookie);
}

function readCookie(key) {
    var value = '';
    var cookieArray = document.cookie.split(';');
    console.log(document.cookie);
    for (var i = 0; i < cookieArray.length; i++) {
        var keyValuePair = cookieArray[i].split('=');
        if (keyValuePair[0].replace(' ', '') == key) {
            value = keyValuePair[1];
            break;
        }
    }
    return value;
}

function start(id) {
    db = new Firebase('https://burning-fire-3834.firebaseio.com');
    name = document.getElementById("name").value || name;
    createCookie('xoname', name);
    document.getElementById('move').innerText = (owner && owner == name ? (isX ? 'Your, ' + name : 'opponent') : name) + '\'s (' + (isX ? 'x': 'o') + ') ';

    if (id) {
        sessionId = id;
        ref = db.child(sessionId);
    } else {
        sessionId = '';
        for (var i = 0; i < 20; i++) sessionId += String.fromCharCode(i % 2 ? 65 + 26 * Math.random(): 49 + 9 * Math.random());
        window.location.hash = sessionId;
        ref = db.child(sessionId);
        if (name) ref.child(moves.length).setWithPriority({owner: name}, null);
    }
    setVisibility('welcome', false);
    setVisibility('playground', true);

    ref.on('child_added', function(i) {
        var val = i.val();
        if (val.owner) owner = val.owner;
        else move(document.getElementById(i.val().move), i.val().sign);
    })
}

window.onload = function() {
    name = readCookie('xoname');
    document.getElementById('name').value = name;
    console.log(name);

    if (window.location.hash) start(window.location.hash.replace('#', ''));
}