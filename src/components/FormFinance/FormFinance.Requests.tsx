class Requests {
  formSearchRoom: HTMLFormElement | null = null;
  formFinance: HTMLFormElement | null = null;
  constructor() {
    this.formSearchRoom = document.forms.namedItem('formSearchRoom');
    this.formFinance = document.forms.namedItem('formFinance');
  }

  getHistory(hl: React.Component) {
    const { formFinance } = this;

    if (!window.WebSocket) {
      document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
    }

    var socket = new WebSocket('ws://localhost:9001');

    if (formFinance) {
      this.sendMessAddFinance(socket, formFinance);
    }

    socket.onopen = () => {
      console.log('Соединение установлено.');

      if (formFinance) {
        this.sendMessGetData(socket);
      }
    };

    socket.onmessage = (event) => {
      const incomingMessage = event.data;
      console.log(`Приняты данные: ${incomingMessage}`);

      const data = JSON.parse(incomingMessage);

      if (data.finance !== undefined) {
        hl.setState({
          historyList: data.finance,
        });
      }
    };

    socket.onerror = (error: Event) => {
      alert('Ошибка ' + error);
    };
  }

  sendMessAddFinance(socket: WebSocket, form: HTMLFormElement) {
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

  sendMessGetData(socket: WebSocket) {
    const postJSON = {
      getData: {},
    };
    console.log(`Отправлены данные:${JSON.stringify(postJSON)}`);
    socket.send(JSON.stringify(postJSON));
    return false;
  }
}

export { Requests };
