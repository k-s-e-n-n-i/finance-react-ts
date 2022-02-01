interface dataUpdateFormMonth {
  formName: string;
  data: any;
  incomingMessage: string;
  compFormFinance: React.Component;
}

class Requests {
  arrNamesFormsEntry: string[] = [];
  formGeneral: HTMLElement;
  formSend: HTMLFormElement | null = null;
  nameFormSend: string | null | undefined = '';
  compFormFinance: React.Component;
  socket: WebSocket;

  nameformMonth: string | null | undefined = '';
  year: number;
  m: number;
  month: string;
  day: number;

  /**
   *
   * @param compFormFinance - this у компонента FormFinance
   * @param form - родительский блок всего компонента FormFinance ('.form-finance')
   */
  constructor(compFormFinance: React.Component, form: HTMLElement) {
    this.formGeneral = form;
    this.compFormFinance = compFormFinance;
    this.initFormFinance();

    this.year = new Date().getFullYear();
    this.m = new Date().getMonth();
    this.day = new Date().getDate();
    this.day < 25
      ? (this.month = this.m < 10 ? `0${this.m}` : `${this.m}`)
      : (this.month = this.m + 1 < 10 ? `0${this.m + 1}` : `${this.m + 1}`);
    this.initFormMonth();

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

  initFormFinance() {
    this.formSend = this.formGeneral.querySelector('.form-finance__ff-send');
    this.nameFormSend = this.formSend?.getAttribute('name');
  }

  initFormMonth() {
    this.nameformMonth = this.formGeneral.getAttribute('data-name');
  }

  getHistory() {
    let { compFormFinance, socket, formSend, nameformMonth, year, month } = this;

    if (formSend) {
      this.sendMessAddFinance(formSend);
    }

    socket.onopen = () => {
      console.log('Соединение установлено.');
      this.sendMessGetData();
    };

    socket.onmessage = (event) => {
      const incomingMessage = event.data;
      const data = JSON.parse(incomingMessage);
      const formName = data.form;

      if (formName == `${year}.${month}.${nameformMonth}`) {
        this.runUpdateFormMonth({
          formName: formName,
          data: data,
          incomingMessage: incomingMessage,
          compFormFinance: compFormFinance,
        });
      } else {
        this.runUpdateFormFinance({
          formName: formName,
          data: data,
          incomingMessage: incomingMessage,
          compFormFinance: compFormFinance,
        });
      }
    };

    socket.onerror = (error: Event) => {
      alert(`Ошибка ${error} (не запущен сервер)`);
    };
  }

  /**
   *
   * @param obj - объект с даннымими необходимыми для выполнения дальнейших действий
   */
  runUpdateFormFinance(obj: dataUpdateFormMonth) {
    const { nameFormSend } = this;
    const { formName, data, incomingMessage, compFormFinance } = obj;

    const promise = new Promise((resolve) => {
      if (nameFormSend === formName && data[formName] !== undefined) {
        console.log(`Приняты и обновлены данные: ${incomingMessage}`);
        compFormFinance.setState({
          allForms: {
            [formName]: {
              historyList: data[formName],
            },
          },
          formUpdate: formName,
          allSumForm: data.allSum,
        });
      }

      resolve(true);
    });

    promise.then(() => {
      if (nameFormSend === formName) {
        this.checkFormsEntry();
      }
    });
  }
  /**
   *
   * @param obj - объект с даннымими необходимыми для выполнения дальнейших действий
   */
  runUpdateFormMonth(obj: dataUpdateFormMonth) {
    const { nameformMonth } = this;
    const { formName, data, incomingMessage, compFormFinance } = obj;

    const promise = new Promise((resolve) => {
      if (`${this.year}.${this.month}.${nameformMonth}` === formName && data[formName] !== undefined) {
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
      if (`${this.year}.${this.month}.${nameformMonth}` === formName) {
        this.checkFormsEntry();
      }
    });
  }

  /**
   *
   * @param form - форма добавления новой записи ('.form-finance__ff-send')
   */
  sendMessAddFinance(form: HTMLFormElement) {
    const { socket, nameFormSend } = this;

    form.onsubmit = () => {
      const { sumStr, sum } = this.getSum(form);

      const notification = form.querySelector('.form-finance__notification');
      if (form.date.value !== '' && form.sumEntry.value !== '') {
        const postJSON = {
          addFinance: {
            date: form.date.value,
            sumStr: sumStr,
            sum: sum,
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

  sendMessGetData() {
    const { socket, nameFormSend, nameformMonth, year, month } = this;
    let postJSON = {};

    if (nameformMonth) {
      postJSON = {
        getData: `${year}.${month}.listDates`,
      };
    } else {
      postJSON = {
        getData: nameFormSend,
      };
    }
    console.log(`Отправлены данные:${JSON.stringify(postJSON)}`);
    socket.send(JSON.stringify(postJSON));
  }

  /**
   *
   * @param form - форма конкретной записи в списке истории ('.entry-history')
   */
  sendEditEntry(form: HTMLFormElement) {
    const { socket, nameFormSend, nameformMonth } = this;
    let formName;

    form.onsubmit = () => {
      if (nameformMonth) {
        formName = `${this.year}.${this.month}.${nameformMonth}`;
      } else {
        formName = nameFormSend;
      }
      const postJSON = {
        editEntry: {
          id: form.getAttribute('id'),
          formName: formName,
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
  checkFormsEntry() {
    const { formGeneral } = this;
    let { arrNamesFormsEntry } = this;
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
    const { socket, nameFormSend, nameformMonth } = this;
    const notification = form.querySelector('.form-finance__notification');

    const { sumStr, sum } = this.getSum(form);

    let postJSON = {};

    if (nameformMonth && form.sumEntry.value !== '') {
      postJSON = {
        saveEntry: {
          id: form.getAttribute('id'),
          date: form.querySelector('.entry-history__item_date')?.innerHTML,
          sumStr: sumStr,
          sum: sum,
          name: form.nameEntry.value,
          state: 'main',
          formName: `${this.year}.${this.month}.${nameformMonth}`,
        },
      };
    } else {
      if (form.date.value !== '' && form.sumEntry.value !== '') {
        postJSON = {
          saveEntry: {
            id: form.getAttribute('id'),
            date: form.date.value,
            sumStr: sumStr,
            sum: sum,
            name: form.nameEntry.value,
            state: 'main',
            formName: nameFormSend,
          },
        };
      } else {
        if (notification) {
          notification.innerHTML = 'Поля заполнены некорректно';
        }
        return;
      }
    }

    console.log(`Отправлены данные:${JSON.stringify(postJSON)}`);
    socket.send(JSON.stringify(postJSON));

    if (notification) {
      notification.innerHTML = '';
    }
  }

  getSum(form: HTMLFormElement) {
    const sumStr = form.sumEntry.value;
    const arrSum = sumStr.split('+');
    let sum: number = 0;
    arrSum.forEach((item: string) => {
      sum = sum + parseFloat(item);
    });

    return { sumStr: sumStr, sum: sum };
  }

  /**
   *
   * @param form form - форма конкретной записи в списке истории ('.entry-history')
   */
  sendDeleteEntry(form: HTMLFormElement) {
    const { socket, nameFormSend } = this;
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
