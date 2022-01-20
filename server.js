var http = require('http');
var Static = require('node-static');
var WebSocketServer = new require('ws');
//var WebSocketServer = new require('websocket');

// подключенные клиенты
var clients = {};

// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({ port: 9001 });
webSocketServer.on('connection', function (ws) {
  var id = Math.random();
  clients[id] = ws;
  console.log(`Новое соединение ${id}`);

  ws.on('message', function (message) {
    console.log(`Получено сообщение: ${message}`);

    const messageToString = JSON.parse(message);

    if (messageToString.getData !== undefined) {
      console.log('getData');
      const getDataFile = getData();

      if (getDataFile.finance !== undefined) {
        console.log(JSON.stringify(getDataFile.finance));

        for (var key1 in clients) {
          clients[key1].send(JSON.stringify(getDataFile));
        }
      }
    }

    if (messageToString.guests !== undefined) {
      writeData(messageToString);

      for (var key2 in clients) {
        clients[key2].send(message);
      }
    }
  });

  ws.on('close', function () {
    console.log('Соединение закрыто ' + id);
    delete clients[id];
  });
});

// обычный сервер (статика) на порту 8080
/*var fileServer = new Static.Server('.');
http
  .createServer(function (req, res) {
    fileServer.serve(req, res);
  })
  .listen(9000);*/

//--------------------------------------------------------------
const fs = require('fs');

function writeData(postJSON) {
  let getJSON = JSON.parse(fs.readFileSync('data.json', 'utf8'));
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

  const json = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  console.log('\n Перезаписан data.json:\n', json);
  return json;
}

function getData() {
  const getData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  return getData;
}
