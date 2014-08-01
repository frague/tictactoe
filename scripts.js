var isX = true, finished = false, cells = {}, moves = [], checkLines = [[0, 1], [1, 0], [1, 1], [1, -1]], moves = document.getElementById('moves');

function move(td) {
    var x = +td.id[1], y = +td.id[2], key = '' + x + y, sign = isX ? 'x': 'o';
    if (!cells[key] && !finished) {
        cells[key] = sign;
        td.className = sign;
        isX = !isX;
        // Check wins
        for (var i = 0; i < 4; i++) {
            var count = 0, d = checkLines[i], x1 = x - 2 * d[0], y1 = y - 2 * d[1], tds = [];
            for (j = 0; j < 5; j++) {
                console.log(i, j);
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
        document.getElementById('move').innerText = isX ? 'x': 'o';
        var m = document.createElement('li');
        m.innerHTML = sign + ' &rarr; ' + (x + 1) + ' : ' + (y + 1);
        moves.appendChild(m);
    }
}
