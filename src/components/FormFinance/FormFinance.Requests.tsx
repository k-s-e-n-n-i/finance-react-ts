class Requests {
  formSearchRoom: HTMLFormElement | null = null;
  formFinance: HTMLFormElement | null = null;
  arrNamesFormsEntry: string[] = [];
  constructor() {
    this.formSearchRoom = document.forms.namedItem('formSearchRoom');
    this.formFinance = document.forms.namedItem('formFinance');
  }

  getHistory(hl: React.Component) {
    const { formFinance } = this;
    let { arrNamesFormsEntry } = this;

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
      const promise = new Promise((resolve) => {
        const incomingMessage = event.data;
        console.log(`Приняты данные: ${incomingMessage}`);

        const data = JSON.parse(incomingMessage);

        if (data.finance !== undefined) {
          hl.setState({
            historyList: data.finance,
          });
        }

        resolve(true);
      });

      promise.then(() => {
        this.checkFormsEntry(socket, arrNamesFormsEntry);
      });
    };

    socket.onerror = (error: Event) => {
      alert(`Ошибка ${error} (не запущен сервер)`);
    };
  }

  sendMessAddFinance(socket: WebSocket, form: HTMLFormElement) {
    form.onsubmit = () => {
      const postJSON = {
        finance: {
          date: form.date.value,
          sum: form.sumEntry.value,
          name: form.nameEntry.value,
          state: 'main',
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

  sendEditEntry(socket: WebSocket, form: HTMLFormElement) {
    form.onsubmit = () => {
      console.log('edit', form);
      const postJSON = {
        editEntry: {
          id: form.getAttribute('id'),
        },
      };
      console.log(`Отправлены данные:${JSON.stringify(postJSON)}`);
      socket.send(JSON.stringify(postJSON));
      return false;
    };
  }

  checkFormsEntry(socket: WebSocket, arrNamesFormsEntry: string[]) {
    const mas = document.querySelectorAll('form.entry-history');
    arrNamesFormsEntry = [];

    mas.forEach((item) => {
      const nameItem = item.getAttribute('name');
      if (nameItem) {
        arrNamesFormsEntry.push(nameItem);
      }
    });

    arrNamesFormsEntry.forEach((item) => {
      const form = document.forms.namedItem(item);

      if (form && form.classList.contains('entry-history_main')) {
        this.sendEditEntry(socket, form);
      }
      if (form && form.classList.contains('entry-history_edit')) {
        this.checkEditForm(socket, form);
      }
    });
  }

  checkEditForm(socket: WebSocket, form: HTMLFormElement) {
    form.onsubmit = (e) => {
      console.log('saved', form);

      const nameButtonClick = e.submitter?.getAttribute('name');
      if (nameButtonClick === 'save') {
        this.sendSaveEntry(socket, form);
      }
      if (nameButtonClick === 'delete') {
        this.sendDeleteEntry(socket, form);
      }

      return false;
    };
  }

  sendSaveEntry(socket: WebSocket, form: HTMLFormElement) {
    const postJSON = {
      saveEntry: {
        id: form.getAttribute('id'),
        date: form.date.value,
        sum: form.sumEntry.value,
        name: form.nameEntry.value,
        state: 'main',
      },
    };
    console.log(`Отправлены данные:${JSON.stringify(postJSON)}`);
    socket.send(JSON.stringify(postJSON));
  }

  sendDeleteEntry(socket: WebSocket, form: HTMLFormElement) {
    const postJSON = {
      deleteEntry: {
        id: form.getAttribute('id'),
      },
    };
    console.log(`Отправлены данные:${JSON.stringify(postJSON)}`);
    socket.send(JSON.stringify(postJSON));
  }
}

export { Requests };
