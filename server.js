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

    checkGuests(message, messageToString);
    checkGetData(messageToString);
    checkAddFinance(messageToString);
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

function checkGetData(messageToString) {
  if (messageToString.getData !== undefined) {
    const getDataFile = getDataFromFile();

    if (getDataFile.finance !== undefined) {
      for (const key in clients) {
        const getJSON = JSON.stringify({ finance: getDataFile.finance });
        clients[key].send(getJSON);
      }
    }
  }
}

function checkAddFinance(messageToString) {
  if (messageToString.finance !== undefined) {
    writeData(messageToString);

    const getDataFile = getDataFromFile();

    if (getDataFile.finance !== undefined) {
      for (const key in clients) {
        const getJSON = JSON.stringify({
          addFinance: `Данные зафиксированы`,
          finance: getDataFile.finance,
        });
        clients[key].send(getJSON);
      }
    } else {
      for (const key in clients) {
        const getJSON = JSON.stringify({
          addFinance: `Данные зафиксированы, но получение обновленных данных не удалось`,
        });
        clients[key].send(getJSON);
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
