const fs = require('fs');

function handle1() {
  const list = require('./1.js');
  const result = {};
  list.forEach(function(e) {
    if ('defaultMessage' in e && 'id' in e) {
      if (result[e.id]) {
        throw new Error('exist!!!', e.id);
      }
      result[e.id] = e.defaultMessage;
    } else {
      Object.values(e).forEach(function(item) {
        if (result[item.id]) {
          throw new Error('exist!!!', item.id);
        }
        result[item.id] = item.defaultMessage;
      });
    }
  });
  fs.writeFileSync('./r1.json', JSON.stringify(result, null, 2));
}

function handle2() {
  const txt = fs.readFileSync('./2.txt', { encoding: 'utf8' });
  const list = txt.split('\n').filter(e => !!e);
  const result = {};
  list.forEach(function(e) {
    const [_, id, defaultMessage] = e.match(/id="(.+?)" defaultMessage="(.+?)"/);
    if (result[id]) {
      console.log(_, id, defaultMessage);
      throw new Error('existed id', id);
    }
    result[id] = defaultMessage;
  });
  fs.writeFileSync('./r2.json', JSON.stringify(result, null, 2));
}

handle2();
