class Requests {
  arrNamesFormsEntry: string[] = [];

  constructor() {}

  getHistory(hl: React.Component, form: HTMLElement) {
    const {} = this;
    let { arrNamesFormsEntry } = this;

    if (!window.WebSocket) {
      document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
    }

    var socket = new WebSocket('ws://localhost:9001');

    const formSend: HTMLFormElement | null = form.querySelector('.form-finance__ff-send');
    const nameFormSend = formSend?.getAttribute('name');

    if (formSend && nameFormSend) {
      this.sendMessAddFinance(socket, formSend, nameFormSend);
    }

    socket.onopen = () => {
      console.log('Соединение установлено.');

      if (nameFormSend) {
        this.sendMessGetData(socket, nameFormSend);
      }
    };

    socket.onmessage = (event) => {
      const promise = new Promise((resolve) => {
        const incomingMessage = event.data;
        console.log(`Приняты данные: ${incomingMessage}`);

        const data = JSON.parse(incomingMessage);
        const formName = data.form;

        if (nameFormSend === formName && data[formName] !== undefined) {
          hl.setState({
            [formName]: {
              historyList: data[formName],
            },
            form: formName,
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

  sendMessAddFinance(socket: WebSocket, form: HTMLFormElement, nameFormSend: string) {
    form.onsubmit = () => {
      const notification = form.querySelector('.form-finance__notification');
      if (form.date.value !== '' && form.sumEntry.value !== '') {
        const postJSON = {
          addFinance: {
            date: form.date.value,
            sum: form.sumEntry.value,
            name: form.nameEntry.value,
            state: 'main',
            id: new Date().getTime(),
          },
          formName: nameFormSend,
        };
        console.log(`Отправлены данные:${JSON.stringify(postJSON)}`);
        socket.send(JSON.stringify(postJSON));

        form.reset();
        if (notification) {
          notification.innerHTML = '';
        }
      } else {
        if (notification) {
          notification.innerHTML = 'Поля заполнены некорректно';
        }
      }
      return false;
    };
  }

  sendMessGetData(socket: WebSocket, formName: string) {
    const postJSON = {
      getData: formName,
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
    const notification = form.querySelector('.form-finance__notification');
    if (form.date.value !== '' && form.sumEntry.value !== '') {
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

      if (notification) {
        notification.innerHTML = '';
      }
    } else {
      if (notification) {
        notification.innerHTML = 'Поля заполнены некорректно';
      }
    }
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
