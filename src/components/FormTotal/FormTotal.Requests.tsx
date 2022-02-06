class Requests {
  compFormTotal: React.Component;
  nameFormTotal: string;
  socket: WebSocket;

  /**
   *
   * @param compFormTotal - this у компонента FormTotal
   * @param form - родительский блок всего компонента FormTotal ('.form-finance')
   */
  constructor(compFormTotal: React.Component) {
    this.compFormTotal = compFormTotal;
    this.nameFormTotal = 'formTotal';

    if (!window.WebSocket) {
      document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
    }

    let socketHost = 'ws://localhost:9001';

    if (window.location.host === 'ksenni.ru') {
      socketHost = 'wss://212.193.53.202:9001';
    }

    const socket = new WebSocket(socketHost);

    this.socket = socket;
  }

  getHistory() {
    let { socket, nameFormTotal, compFormTotal } = this;

    socket.onopen = () => {
      console.log('Соединение установлено.');
    };

    socket.onmessage = (event) => {
      const incomingMessage = event.data;
      const data = JSON.parse(incomingMessage);
      const formName = data.form;

      new Promise((resolve) => {
        if (nameFormTotal === formName && data[formName] !== undefined) {
          console.log(`Приняты и обновлены данные: ${incomingMessage}`);
          compFormTotal.setState({
            finance: data[formName].finance,
            expMain: data[formName].expMain,
            expMonth: data[formName].expMonth,
            expenses: data[formName].expenses,
            balance: data[formName].balance,
            startBalance: data[formName].startBalance,
            countDays: data[formName].countDays,
            lastDays: data[formName].lastDays,
            willDays: data[formName].willDays,
            prognosisInDay: data[formName].prognosisInDay, //
            mediumInDay: data[formName].mediumInDay,
            mediumInDayWill: data[formName].mediumInDayWill,
            prognosisExpenses: data[formName].prognosisExpenses, //
          });
        }

        resolve(true);
      });
    };

    socket.onerror = (error: Event) => {
      alert(`Ошибка ${error} (не запущен сервер)`);
    };
  }
}

export { Requests };
