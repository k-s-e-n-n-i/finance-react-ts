interface Guests {
  grown: string;
  children: string;
  babies: string;
}

class Requests {
  formSearchRoom: HTMLFormElement | null = null;
  formFinance: HTMLFormElement | null = null;
  constructor() {
    this.formSearchRoom = document.forms.namedItem('formSearchRoom');
    this.formFinance = document.forms.namedItem('formFinance');
  }

  socketsGO() {
    console.log('socketGO');
    const { formSearchRoom } = this;

    if (!window.WebSocket) {
      document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
    }

    var socket = new WebSocket('ws://localhost:9001');

    if (formSearchRoom) {
      this.sendFormSearchRoom(socket, formSearchRoom);
    }

    // обработчик входящих сообщений
    socket.onmessage = (event) => {
      const incomingMessage = event.data;
      const data = JSON.parse(incomingMessage);

      if (data.guests !== undefined) {
        this.showSentGuests(data.guests);
      }
    };

    socket.onopen = function () {
      console.log('Соединение установлено.');
    };

    socket.onerror = function (error: Event) {
      //alert('Ошибка ' + error);
    };
  }

  sendFormSearchRoom(socket: WebSocket, form: HTMLFormElement) {
    form.onsubmit = function () {
      const postJSON = {
        guests: {
          grown: form.grown.value,
          children: form.childs.value,
          babies: form.babies.value,
        },
      };
      console.log(`Отправлены данные:${JSON.stringify(postJSON)}`);
      socket.send(JSON.stringify(postJSON));
      return false;
    };
  }

  showSentGuests(guests: Guests) {
    const { formSearchRoom } = this;

    const oldBlockGET = document.querySelector('.blockGET');
    if (oldBlockGET) {
      oldBlockGET.remove();
    }

    const messageElem = document.createElement('div');
    messageElem.className = 'blockGET';

    const grown = document.createElement('p');
    grown.innerText = `Взрослых: ${guests.grown}`;
    const children = document.createElement('p');
    children.innerText = `Детей: ${guests.children}`;
    const babies = document.createElement('p');
    babies.innerText = `Младенцев: ${guests.babies}`;

    messageElem.appendChild(grown);
    messageElem.appendChild(children);
    messageElem.appendChild(babies);

    formSearchRoom?.appendChild(messageElem);
  }
}

export { Requests };
