const WebSocketServer = new require('ws');
const fs = require('fs');
const clients = {};

const webSocketServer = new WebSocketServer.Server({ port: 9001 });
webSocketServer.on('connection', function (ws) {
  const id = Math.random();
  clients[id] = ws;
  console.log(`Новое соединение ${id}`);

  ws.on('message', function (message) {
    console.log(`Получено сообщение: ${message}`);

    const messageToString = JSON.parse(message);

    checkGetDataFinance(messageToString);

    checkGuests(message, messageToString);
  });

  ws.on('close', function () {
    console.log('Соединение закрыто ' + id);
    delete clients[id];
  });
});

//--------------------------------------------------------------

function checkGuests(message, messageToString) {
  if (messageToString.guests !== undefined) {
    writeData(messageToString);

    for (const key2 in clients) {
      clients[key2].send(message);
    }
  }
}

function checkGetDataFinance(messageToString) {
  if (messageToString.getData !== undefined) {
    const getDataFile = getDataFromFile();

    if (getDataFile.finance !== undefined) {
      for (const key1 in clients) {
        clients[key1].send(JSON.stringify(getDataFile.finance));
      }
    }
  }
}

function writeData(postJSON) {
  let getJSON = getDataFromFile();
  let newJSON = getJSON;

  for (let key in postJSON) {
    if (getJSON[key] === undefined) {
      getJSON[key] = [];
    }
  }

  for (let key in getJSON) {
    if (postJSON[key] != null) {
      newJSON[key] = [].concat(getJSON[key], postJSON[key]);
    }
  }

  fs.writeFileSync('data.json', JSON.stringify(newJSON));

  const json = getDataFromFile();
  console.log('\n Перезаписан data.json:\n');
  return json;
}

function getDataFromFile() {
  const getData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  return getData;
}
