const WebSocketServer = new require('ws');
const fs = require('fs');
const clients = new Set();

// Определение текущей даты
const today = new Date();
const day = today.getDate();
const month = today.getMonth();
let monthStr, monthForFile;
if (day < 25) {
  // если число с 1 до 24, то файл считается за предыдущий месяц, поэтому значение месяца уменьшаем на 1
  monthStr = month < 10 ? `0${month}` : `${month}`; // т.к. месяцы с 0 до 11, для строки не уменьшаем
  monthForFile = month - 1;
} else {
  monthStr = month + 1 < 10 ? `0${month + 1}` : month + 1;
  monthForFile = month;
}
const year = today.getFullYear();

const startPepriod = 25; // задаем число, которое является началом периода

try {
  // проверяем наличие файла ХХХХ.ХХ.listDates.json
  const fileListDates = fs.readFileSync(`data/${year}.${monthStr}.listDates.json`, 'utf8');
  const listDates = JSON.parse(fileListDates)[`${year}.${monthStr}.listDates`];

  if (listDates.length == 0) {
    // если файл есть, но пустой, то создаем от ближайшего прошедшего 25го числа
    createListDates(new Date(year, monthForFile, startPepriod));
  }
} catch (e) {
  // если файла нет, то создаем от ближайшего прошедшего 25го числа
  createListDates(new Date(year, monthForFile, startPepriod));
}

// запускаем WebSocketServer
const webSocketServer = new WebSocketServer.Server({ port: 9001 });
webSocketServer.on('connection', function (ws) {
  clients.add(ws);
  console.log(`Новое соединение ${clients}`);

  ws.on('message', function (msg) {
    console.log(`\nПолучено сообщение: ${msg}`);

    const msgString = JSON.parse(msg);

    updateFormTotal(); // получаем сводную статистику и отправляем данные в форму FormTotal

    // проверяем какой запрос пришел
    switch (msgString.get) {
      case 'getData': {
        sendData(msgString.getData);
        break;
      }
      case 'addFinance': {
        sendAddedFinance(msgString.addFinance);
        break;
      }
      case 'editEntry': {
        sendEditedEntry(msgString.editEntry);
        break;
      }
      case 'saveEntry': {
        sendSavedEntry(msgString.saveEntry);
        break;
      }
      case 'deleteEntry': {
        sendWithoutDeletedEntry(msgString.deleteEntry);
        break;
      }
      default:
        console.log(`В сообщении не оказалось 'get' параметра`);
    }
  });

  ws.on('close', function () {
    console.log(`Соединение закрыто ${clients}`);
    clients.delete(ws);
  });
});

//--------------------------------------------------------------

function sendData(formName) {
  if (formName !== undefined) {
    runStart(formName);
    const getDataFile = getDataFromFile(formName);
    sortData(formName);

    const allSum = total(formName);

    if (getDataFile[formName] !== undefined) {
      for (const client of clients) {
        const getJSON = JSON.stringify({
          form: formName,
          [formName]: getDataFile[formName],
          allSum: allSum,
        });
        client.send(getJSON);
      }
    }
  }
}

function sendAddedFinance(addFinance) {
  if (addFinance !== undefined) {
    const formName = addFinance.formName;

    writeData(
      {
        [formName]: addFinance,
      },
      formName
    );

    const getDataFile = getDataFromFile(formName);
    const allSum = total(formName);

    if (getDataFile[formName] !== undefined) {
      for (const client of clients) {
        const getJSON = JSON.stringify({
          addFinance: `Данные зафиксированы`,
          form: formName,
          [formName]: getDataFile[formName],
          allSum: allSum,
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

function sendEditedEntry(editEntry) {
  if (editEntry !== undefined) {
    const idEdit = parseInt(editEntry.id);

    updateEntrys(idEdit, editEntry, 'edit');
  }
}

function sendSavedEntry(saveEntry) {
  if (saveEntry !== undefined) {
    const idEdit = parseInt(saveEntry.id);

    updateEntrys(idEdit, saveEntry, 'save');
  }
}

function sendWithoutDeletedEntry(deleteEntry) {
  if (deleteEntry !== undefined) {
    const idEdit = parseInt(deleteEntry.id);

    updateEntrys(idEdit, deleteEntry, 'delete');
  }
}

function updateEntrys(idEntry, objData, typeRequest) {
  const formName = objData.formName;
  const fileName = formName;
  let newJSON = {},
    newFin = [];

  const getDataFile = getDataFromFile(formName);

  if (getDataFile[formName] != undefined) {
    getDataFile[formName].forEach((item) => {
      if (parseInt(item.id) === idEntry) {
        if (typeRequest === 'save') {
          newFin.push({
            date: objData.date,
            sumStr: objData.sumStr,
            sum: objData.sum,
            name: objData.name,
            id: item.id,
            state: objData.state,
          });
        }
        if (typeRequest === 'edit') {
          newFin.push({
            date: item.date,
            sumStr: item.sumStr,
            sum: item.sum,
            name: item.name,
            id: item.id,
            state: 'edit',
          });
        }
        if (typeRequest === 'delete') {
        }

        return;
      } else {
        newFin.push({
          date: item.date,
          sumStr: item.sumStr,
          sum: item.sum,
          name: item.name,
          id: item.id,
          state: item.state,
        });
      }
    });
  }

  newJSON = Object.assign(getDataFile, { [formName]: newFin });

  fs.writeFileSync(`data/${fileName}.json`, JSON.stringify(newJSON));
  const json = getDataFromFile(formName);
  console.log(`Перезаписан data.json: изменено состояние id=${idEntry} (${typeRequest})`);

  sortData(formName);
  updateFormTotal();

  const allSum = total(formName);

  const sendJSON = JSON.stringify({
    form: formName,
    [formName]: json[formName],
    allSum: allSum,
  });
  for (const client of clients) {
    client.send(sendJSON);
  }
}

function writeData(postJSON, formName) {
  const fileName = formName;
  let getJSON = getDataFromFile(formName);
  let newJSON = getJSON;

  for (let key in postJSON) {
    if (getJSON[key] === undefined) {
      getJSON[key] = [];
    }
  }

  Object.keys(getJSON).forEach((key) => {
    if (postJSON[key] != null) {
      newJSON[key] = [].concat(getJSON[key], postJSON[key]);
    }
  });

  fs.writeFileSync(`data/${fileName}.json`, JSON.stringify(newJSON));
  sortData(formName);
  updateFormTotal();

  const json = getDataFromFile(formName);
  console.log('Перезаписан data.json:');
  return json;
}

function getDataFromFile(fileName) {
  let getData;
  try {
    getData = JSON.parse(fs.readFileSync(`data/${fileName}.json`, 'utf8'));
  } catch (e) {
    fs.writeFileSync(`data/${fileName}.json`, JSON.stringify({}));
    getData = JSON.parse(fs.readFileSync(`data/${fileName}.json`, 'utf8'));
  }
  return getData;
}

function sortData(formName) {
  const fileName = formName;
  const getDataFile = getDataFromFile(formName);
  let fin = getDataFile[formName];

  if (fin !== undefined) {
    fin.sort((a, b) => {
      const dateA = getDateFormat(a.date);
      const dateB = getDateFormat(b.date);

      return new Date(dateA) - new Date(dateB);
    });
  }

  const newFinance = Object.assign({ [formName]: fin }, getDataFile);

  fs.writeFileSync(`data/${fileName}.json`, JSON.stringify(newFinance));

  console.log(`Данные отсортированы`);
}

function runStart(formName) {
  const fileName = formName;
  let newJSON = {},
    newFin = [];

  const getDataFile = getDataFromFile(formName);
  if (getDataFile[formName] !== undefined) {
    getDataFile[formName].forEach((item) => {
      newFin.push({
        date: item.date,
        sumStr: item.sumStr,
        sum: item.sum,
        name: item.name,
        id: item.id,
        state: 'main',
      });
    });
  }

  newJSON = Object.assign(getDataFile, { [formName]: newFin });

  fs.writeFileSync(`data/${fileName}.json`, JSON.stringify(newJSON));

  console.log(`Перезаписан data.json: изменено состояние на main`);
}

//--------------------------------------------------------------

function total(fileName) {
  let getData,
    sum = 0;
  try {
    getData = JSON.parse(fs.readFileSync(`data/${fileName}.json`, 'utf8'));
    getData[fileName].forEach((item) => {
      item.sum != '' ? (sum = sum + parseFloat(item.sum)) : (sum = sum + 0);
    });
  } catch (e) {
    fs.writeFileSync(`data/${fileName}.json`, JSON.stringify({}));
    getData = JSON.parse(fs.readFileSync(`data/${fileName}.json`, 'utf8'));
  }

  return sum;
}

//--------------------------------------------------------------

function createListDates(startdate) {
  const day = startdate.getDate();
  const month = startdate.getMonth();
  const year = startdate.getFullYear();

  const monthStart = month + 1 < 10 ? `0${month + 1}` : month + 1;
  const monthEnd = month + 2 < 10 ? `0${month + 2}` : month + 2;
  const endDate = new Date(`${year}-${monthEnd}-${day}`);

  const listDates = [];
  let dayChange = day;
  let nextDate = startdate;

  while (nextDate != 'Invalid Date' && nextDate.valueOf() + 2 < endDate.valueOf()) {
    const dFact = nextDate.getDate();
    const d = dFact < 10 ? `0${dFact}` : dFact;
    const mFact = nextDate.getMonth();
    const m = mFact + 1 < 10 ? `0${mFact + 1}` : mFact + 1;
    const y = nextDate.getFullYear();
    listDates.push({
      date: `${d}.${m}.${y}`,
      sumStr: '',
      sum: 0,
      name: '',
      id: `${new Date().getTime()}${dayChange}`,
      state: 'main',
    });

    dayChange++;
    nextDate = new Date(year, month, dayChange, 23, 59, 59, 999);
  }

  let json = { [`${year}.${monthStart}.listDates`]: listDates };

  fs.writeFileSync(`data/${year}.${monthStart}.listDates.json`, JSON.stringify(json));

  return endDate;
}

function updateFormTotal() {
  const fileNameFormTotal = 'formTotal';
  const fileNameFormMonth = `${year}.${monthStr}.listDates`;
  const dataFormMonth = getDataFromFile(fileNameFormMonth);

  if (dataFormMonth[fileNameFormMonth] != undefined) {
    const sumFin = total('formFinance');
    const expMain = total('formExpenses');
    const expMonth = total(fileNameFormMonth);
    const sumEx = expMain + expMonth;
    const startBalance = (sumFin - expMain).toFixed(2);
    const balance = (sumFin - sumEx).toFixed(2);

    const listDates = dataFormMonth[fileNameFormMonth];
    const countDays = listDates.length;

    const prognosisInDay = (startBalance / countDays).toFixed(2);

    let dateFormat = '';

    let lastDays = 0;
    listDates.forEach((item) => {
      dateFormat = getDateFormat(item.date);
      if (dateFormat < new Date()) {
        lastDays++;
      }
    });

    const willDays = countDays - lastDays;

    const json = {
      form: fileNameFormTotal,
      [fileNameFormTotal]: {
        finance: sumFin,
        expMain: expMain,
        expMonth: expMonth,
        expenses: sumEx,
        startBalance: startBalance,
        balance: balance,
        countDays: countDays,
        lastDays: lastDays,
        willDays: willDays,
        prognosisInDay: prognosisInDay,
        mediumInDay: (expMonth / lastDays).toFixed(2),
        mediumInDayWill: (balance / willDays).toFixed(2),
        prognosisExpenses: prognosisInDay * lastDays,
      },
    };

    for (const client of clients) {
      client.send(JSON.stringify(json));
    }
  }
}

function getDateFormat(date) {
  const arrItemDate = date.split('.');
  const dateFormat = new Date(arrItemDate[2], arrItemDate[1] - 1, arrItemDate[0], 23, 59, 59, 999);

  return dateFormat;
}
