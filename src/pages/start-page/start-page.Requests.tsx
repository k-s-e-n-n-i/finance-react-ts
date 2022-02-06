class Requests {
  compStartPage: React.Component;
  socket: WebSocket;

  /**
   *
   * @param compStartPage - this у компонента FormTotal
   * @param form - родительский блок всего компонента FormTotal ('.form-finance')
   */
  constructor(compStartPage: React.Component) {
    this.compStartPage = compStartPage;

    if (!window.WebSocket) {
      document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
    }

    let socketHost = 'ws://localhost:9001';

    if (window.location.host === 'ksenni.ru') {
      socketHost = 'wss://ksenni.ru:9001';
    }

    const socket = new WebSocket(socketHost);

    this.socket = socket;
  }

  getHistory() {
    let { socket, compStartPage } = this;

    socket.onopen = () => {
      console.log('Соединение установлено.');
    };

    socket.onmessage = (event) => {
      const incomingMessage = event.data;
      const data = JSON.parse(incomingMessage);
      const arrDirMonth = data.arrDirMonth;

      if (arrDirMonth !== undefined) {
        console.log(`Принят массив имен папок: ${arrDirMonth}`);
        compStartPage.setState({
          arrDirMonth: arrDirMonth,
        });
      }
    };

    socket.onerror = (error: Event) => {
      alert(`Ошибка ${error} (не запущен сервер)`);
    };
  }
}

export { Requests };
