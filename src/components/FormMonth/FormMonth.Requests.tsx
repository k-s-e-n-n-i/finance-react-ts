class Requests {
  arrNamesFormsEntry: string[] = [];
  formGeneral: HTMLElement;
  formMonth: HTMLElement | null = null;
  nameformMonth: string | null | undefined = '';
  compFormFinance: React.Component;
  socket: WebSocket;

  /**
   *
   * @param compFormFinance - this у компонента FormFinance
   * @param form - родительский блок всего компонента FormFinance ('.form-finance')
   */
  constructor(compFormFinance: React.Component, form: HTMLElement) {
    this.formGeneral = form;
    this.compFormFinance = compFormFinance;
    this.init();

    if (!window.WebSocket) {
      document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
    }

    let socketHost = 'ws://localhost:9001';

    if (window.location.host === 'ksenni.ru') {
      socketHost = 'ws://ksenni.ru:9001';
    }

    const socket = new WebSocket(socketHost);

    this.socket = socket;
  }

  init() {
    this.formMonth = this.formGeneral;
    this.nameformMonth = this.formMonth?.getAttribute('data-name');
  }

  getHistory() {
    let { socket, arrNamesFormsEntry, formMonth, nameformMonth, compFormFinance } = this;

    socket.onopen = () => {
      console.log('Соединение установлено.');

      if (nameformMonth) {
        this.sendMessGetData();
      }
    };

    socket.onmessage = (event) => {
      const incomingMessage = event.data;
      const data = JSON.parse(incomingMessage);
      const formName = data.form;

      const promise = new Promise((resolve) => {
        if (nameformMonth === formName && data[formName] !== undefined) {
          console.log(`Приняты и обновлены данные (таблица месяца): ${incomingMessage}`);
          compFormFinance.setState({
            listDates: data[formName],
            formUpdate: formName,
            allSumForm: data.allSum,
          });
        }

        resolve(true);
      });

      promise.then(() => {
        if (nameformMonth === formName) {
          this.checkFormsEntry(arrNamesFormsEntry);
        }
      });
    };

    socket.onerror = (error: Event) => {
      alert(`Ошибка ${error} (не запущен сервер)`);
    };
  }

  sendMessGetData() {
    const { socket, nameformMonth } = this;
    const postJSON = {
      getData: 'listDates',
    };
    console.log(`Отправлены данные:${JSON.stringify(postJSON)}`);
    socket.send(JSON.stringify(postJSON));
  }

  /**
   *
   * @param form - форма конкретной записи в списке истории ('.entry-history')
   */
  sendEditEntry(form: HTMLFormElement) {
    const { socket, nameformMonth } = this;
    form.onsubmit = () => {
      console.log('edit', form);
      const postJSON = {
        editEntry: {
          id: form.getAttribute('id'),
          formName: nameformMonth,
        },
      };
      console.log(`Отправлены данные:${JSON.stringify(postJSON)}`);
      socket.send(JSON.stringify(postJSON));
      return false;
    };
  }

  /**
   *
   * @param arrNamesFormsEntry - массив имен (name) форм записей ('.entry-history') в списке истории
   */
  checkFormsEntry(arrNamesFormsEntry: string[]) {
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
        this.sendEditEntry(form);
      }
      if (form && form.classList.contains('entry-history_edit')) {
        this.checkEditForm(form);
      }
    });
  }

  /**
   *
   * @param form - форма конкретной записи в списке истории ('.entry-history')
   */
  checkEditForm(form: HTMLFormElement) {
    form.onsubmit = (e) => {
      console.log('saved', form);

      const nameButtonClick = e.submitter?.getAttribute('name');
      if (nameButtonClick === 'save') {
        this.sendSaveEntry(form);
      }
      if (nameButtonClick === 'delete') {
        this.sendDeleteEntry(form);
      }

      return false;
    };
  }

  /**
   *
   * @param form - форма конкретной записи в списке истории ('.entry-history')
   */
  sendSaveEntry(form: HTMLFormElement) {
    const { socket, nameformMonth } = this;
    const notification = form.querySelector('.form-finance__notification');
    if (form.sumEntry.value !== '') {
      const postJSON = {
        saveEntry: {
          id: form.getAttribute('id'),
          date: form.querySelector('.entry-history__item_date')?.innerHTML,
          sum: form.sumEntry.value,
          name: form.nameEntry.value,
          state: 'main',
          formName: nameformMonth,
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

  sendDeleteEntry(form: HTMLFormElement) {
    const { socket, nameformMonth } = this;
    const postJSON = {
      deleteEntry: {
        id: form.getAttribute('id'),
        formName: nameformMonth,
      },
    };
    console.log(`Отправлены данные:${JSON.stringify(postJSON)}`);
    socket.send(JSON.stringify(postJSON));
  }
}

export { Requests };
