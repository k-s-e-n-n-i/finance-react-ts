class Requests {
  arrNamesFormsEntry: string[] = [];
  formGeneral: HTMLElement;
  formSend: HTMLFormElement | null;
  nameFormSend: string | null | undefined = '';
  compFormFinance: React.Component;

  /**
   *
   * @param compFormFinance - this у компонента FormFinance
   * @param form - родительский блок всего компонента FormFinance ('.form-finance')
   */
  constructor(compFormFinance: React.Component, form: HTMLElement) {
    this.formGeneral = form;
    this.formSend = form.querySelector('.form-finance__ff-send');
    this.nameFormSend = this.formSend?.getAttribute('name');
    this.compFormFinance = compFormFinance;
  }

  getHistory() {
    let { arrNamesFormsEntry, formSend, nameFormSend, compFormFinance } = this;

    if (!window.WebSocket) {
      document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
    }

    const socket = new WebSocket('ws://localhost:9001');

    if (formSend && nameFormSend) {
      this.sendMessAddFinance(socket, formSend);
    }

    socket.onopen = () => {
      console.log('Соединение установлено.');

      if (nameFormSend) {
        this.sendMessGetData(socket);
      }
    };

    socket.onmessage = (event) => {
      const incomingMessage = event.data;
      const data = JSON.parse(incomingMessage);
      const formName = data.form;

      const promise = new Promise((resolve) => {
        if (nameFormSend === formName && data[formName] !== undefined) {
          console.log(`Приняты и обновлены данные: ${incomingMessage}`);
          compFormFinance.setState({
            [formName]: {
              historyList: data[formName],
            },
            form: formName,
          });
        }

        resolve(true);
      });

      promise.then(() => {
        if (nameFormSend === formName) {
          this.checkFormsEntry(socket, arrNamesFormsEntry);
        }
      });
    };

    socket.onerror = (error: Event) => {
      alert(`Ошибка ${error} (не запущен сервер)`);
    };
  }

  sendMessAddFinance(socket: WebSocket, form: HTMLFormElement) {
    const { nameFormSend } = this;

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

  sendMessGetData(socket: WebSocket) {
    const { nameFormSend } = this;
    const postJSON = {
      getData: nameFormSend,
    };
    console.log(`Отправлены данные:${JSON.stringify(postJSON)}`);
    socket.send(JSON.stringify(postJSON));
    return false;
  }

  sendEditEntry(socket: WebSocket, form: HTMLFormElement) {
    const { nameFormSend } = this;
    form.onsubmit = () => {
      console.log('edit', form);
      const postJSON = {
        editEntry: {
          id: form.getAttribute('id'),
          formName: nameFormSend,
        },
      };
      console.log(`Отправлены данные:${JSON.stringify(postJSON)}`);
      socket.send(JSON.stringify(postJSON));
      return false;
    };
  }

  checkFormsEntry(socket: WebSocket, arrNamesFormsEntry: string[]) {
    const { formGeneral } = this;
    const mas = formGeneral.querySelectorAll('form.entry-history');
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
    const { nameFormSend } = this;
    const notification = form.querySelector('.form-finance__notification');
    if (form.date.value !== '' && form.sumEntry.value !== '') {
      const postJSON = {
        saveEntry: {
          id: form.getAttribute('id'),
          date: form.date.value,
          sum: form.sumEntry.value,
          name: form.nameEntry.value,
          state: 'main',
          formName: nameFormSend,
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
    const { nameFormSend } = this;
    const postJSON = {
      deleteEntry: {
        id: form.getAttribute('id'),
        formName: nameFormSend,
      },
    };
    console.log(`Отправлены данные:${JSON.stringify(postJSON)}`);
    socket.send(JSON.stringify(postJSON));
  }
}

export { Requests };
