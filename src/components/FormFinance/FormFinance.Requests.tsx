import History from '../History/History';

import { HistoryList, Entry, StateFF } from '../../modules/interfaces';

class Requests {
  formSearchRoom: HTMLFormElement | null = null;
  formFinance: HTMLFormElement | null = null;
  constructor() {
    this.formSearchRoom = document.forms.namedItem('formSearchRoom');
    this.formFinance = document.forms.namedItem('formFinance');
  }

  /*sendEntry(hl: React.Component) {
    const { formFinance } = this;

    if (!window.WebSocket) {
      document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
    }

    var socket = new WebSocket('ws://localhost:9001');

    this.sendFormFinance(socket);

    // обработчик входящих сообщений
    socket.onmessage = (event) => {
      const incomingMessage = event.data;
      const data = JSON.parse(incomingMessage);

      console.log(event.data);

      
    };

    socket.onopen = function () {
      console.log('Соединение установлено.');
    };

    socket.onerror = function (error: Event) {
      //alert('Ошибка ' + error);
    };
  }*/

  getHistory(hl: React.Component) {
    const { formFinance } = this;

    if (!window.WebSocket) {
      document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
    }

    var socket = new WebSocket('ws://localhost:9001');

    // обработчик входящих сообщений
    socket.onmessage = (event) => {
      const incomingMessage = event.data;
      console.log(`Приняты данные: ${incomingMessage}`);

      const finance = JSON.parse(incomingMessage);

      if (finance !== undefined) {
        hl.setState({
          historyList: finance,
        });
      }
    };

    socket.onopen = () => {
      console.log('Соединение установлено.');

      if (formFinance) {
        this.sendGetData(socket);
      }
    };

    socket.onerror = (error: Event) => {
      alert('Ошибка ' + error);
    };
  }

  sendFormFinance(socket: WebSocket, form: HTMLFormElement) {
    form.onsubmit = function () {
      const postJSON = {
        finance: {
          date: form.date.value,
          sum: form.sumEntry.value,
          name: form.nameEntry.value,
        },
      };
      console.log(`Отправлены данные:${JSON.stringify(postJSON)}`);
      socket.send(JSON.stringify(postJSON));
      return false;
    };
  }

  sendGetData(socket: WebSocket) {
    const postJSON = {
      getData: {},
    };
    console.log(`Отправлены данные:${JSON.stringify(postJSON)}`);
    socket.send(JSON.stringify(postJSON));
    return false;
  }

  showHistoryFinance(data: Entry[]) {
    const { formFinance } = this;

    //console.log(data);
    const messageElem = document.querySelector('.form-finance__history-list');

    const entryHistory = <History historyList={data} />;

    //ReactDOM.render(entryHistory, messageElem);
  }
}

export { Requests };
