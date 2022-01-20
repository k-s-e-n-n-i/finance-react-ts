import { Dropdown } from '../dropdown/dropdown.class';

const createdDropdowGuests = (idDropdown: string) => {
  new Dropdown({
    dropdown: document.getElementById(idDropdown),
    valueDefault: 'Сколько гостей',
    wordsFormSum: ['гость', 'гостя', 'гостей'],
    items: [
      {
        text: 'взрослые',
        number: 0,
        name: 'grown',
        countAdditionally: false,
        wordsForm: ['взрослый', 'взрослых', 'взрослых'],
      },
      {
        text: 'дети',
        number: 0,
        name: 'childs',
        countAdditionally: false,
        wordsForm: ['ребенок', 'ребенка', 'детей'],
      },
      {
        text: 'младенцы',
        number: 0,
        name: 'babies',
        countAdditionally: true,
        wordsForm: ['младенец', 'младенца', 'младенцев'],
      },
    ],
  });
};

export { createdDropdowGuests };
