const WebSocketServer = new require('ws');
const fs = require('fs');
const clients = new Set();

const webSocketServer = new WebSocketServer.Server({ port: 9001 });
webSocketServer.on('connection', function (ws) {
  clients.add(ws);
  console.log(`Новое соединение ${clients}`);

  ws.on('message', function (message) {
    console.log(`Получено сообщение: ${message}`);

    const messageToString = JSON.parse(message);

    checkGuests(message, messageToString);
    checkGetData(messageToString);
    checkAddFinance(messageToString);
    checkEditEntry(messageToString);
    checkSaveEntry(messageToString);
    checkDeleteEntry(messageToString);
  });

  ws.on('close', function () {
    console.log(`Соединение закрыто ${clients}`);
    clients.delete(ws);
  });
});

//--------------------------------------------------------------

function checkGuests(message, messageToString) {
  if (messageToString.guests !== undefined) {
    writeData(messageToString);

    for (const client of clients) {
      client.send(message);
    }
  }
}

function checkGetData(messageToString) {
  if (messageToString.getData !== undefined) {
    runStart();
    const getDataFile = getDataFromFile();

    if (getDataFile[messageToString.getData] !== undefined) {
      for (const client of clients) {
        const getJSON = JSON.stringify({
          form: messageToString.getData,
          [messageToString.getData]: getDataFile[messageToString.getData],
        });
        client.send(getJSON);
      }
    }
  }
}

function checkAddFinance(messageToString) {
  if (messageToString.addFinance !== undefined) {
    const formName = messageToString.formName;

    writeData({
      [formName]: messageToString.addFinance,
    });

    const getDataFile = getDataFromFile();

    if (getDataFile[formName] !== undefined) {
      for (const client of clients) {
        const getJSON = JSON.stringify({
          addFinance: `Данные зафиксированы`,
          form: formName,
          [formName]: getDataFile[formName],
        });
        client.send(getJSON);
      }
    } else {
      for (const client of clients) {
        const getJSON = JSON.stringify({
          addFinance: `Данные зафиксированы, но получение обновленных данных не удалось`,
        });
        client.send(getJSON);
      }
    }
  }
}

function checkEditEntry(messageToString) {
  if (messageToString.editEntry !== undefined) {
    const editEntry = messageToString.editEntry;
    const idEdit = parseInt(editEntry.id);

    updateEntrys(idEdit, editEntry, 'edit');
  }
}

function checkSaveEntry(messageToString) {
  if (messageToString.saveEntry !== undefined) {
    const saveEntry = messageToString.saveEntry;
    const idEdit = parseInt(saveEntry.id);

    updateEntrys(idEdit, saveEntry, 'save');
  }
}

function checkDeleteEntry(messageToString) {
  if (messageToString.deleteEntry !== undefined) {
    const deleteEntry = messageToString.deleteEntry;
    const idEdit = parseInt(deleteEntry.id);

    updateEntrys(idEdit, deleteEntry, 'delete');
  }
}

function updateEntrys(idEntry, objData, typeRequest) {
  let newJSON = {},
    newFin = [];

  const getDataFile = getDataFromFile();
  getDataFile.finance.forEach((item) => {
    if (item.id === idEntry) {
      console.log(`Я нашел запись c id ${idEntry}`);

      if (typeRequest === 'save') {
        newFin.push({
          date: objData.date,
          sum: objData.sum,
          name: objData.name,
          id: item.id,
          state: objData.state,
        });
      }
      if (typeRequest === 'edit') {
        newFin.push({
          date: item.date,
          sum: item.sum,
          name: item.name,
          id: item.id,
          state: 'edit',
        });
      }
      if (typeRequest === 'delete') {
      }
    } else {
      newFin.push({ date: item.date, sum: item.sum, name: item.name, id: item.id, state: item.state });
    }
  });

  newJSON = Object.assign(getDataFile, { finance: newFin });

  fs.writeFileSync('data.json', JSON.stringify(newJSON));
  const json = getDataFromFile();
  console.log(`\n Перезаписан data.json: изменено состояние id=${idEntry} (${typeRequest}) \n`);

  sortData();

  const sendJSON = JSON.stringify({ finance: json.finance });
  for (const client of clients) {
    client.send(sendJSON);
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

  Object.keys(getJSON).forEach((key, i) => {
    if (postJSON[key] != null) {
      newJSON[key] = [].concat(getJSON[key], postJSON[key]);
    }
  });

  fs.writeFileSync('data.json', JSON.stringify(newJSON));
  sortData();

  const json = getDataFromFile();
  console.log('\n Перезаписан data.json:\n');
  return json;
}

function getDataFromFile() {
  const getData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  return getData;
}

function sortData() {
  const getDataFile = getDataFromFile();
  const forms = ['formFinance', 'formExpenses'];
  let fin;
  forms.forEach((formName) => {
    fin = getDataFile[formName];

    fin.sort((a, b) => {
      if (a.date > b.date) {
        return 1;
      }
      if (a.date < b.date) {
        return -1;
      }
      return 0;
    });

    const newFinance = Object.assign({ [formName]: fin }, getDataFile);

    fs.writeFileSync('data.json', JSON.stringify(newFinance));
  });
  console.log(`Данные отсортированы`);
}

function runStart() {
  let newJSON = {},
    newFin = [];

  const getDataFile = getDataFromFile();
  getDataFile.finance.forEach((item) => {
    newFin.push({
      date: item.date,
      sum: item.sum,
      name: item.name,
      id: item.id,
      state: 'main',
    });
  });

  newJSON = Object.assign(getDataFile, { finance: newFin });

  fs.writeFileSync('data.json', JSON.stringify(newJSON));

  console.log(`\n Перезаписан data.json: изменено состояние на main \n`);
}
