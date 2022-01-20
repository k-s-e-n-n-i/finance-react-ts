import React from 'react';
import './form-search-room.scss';

import ButtonSubmit from '../ButtonSubmit/ButtonSubmit';
import Dropdown from '../dropdown/dropdown';
import DropdownDates from '../dropdown-dates/dropdown-dates';

import { createdDropdowGuests } from './form-search-room.instances';
import { Requests } from './FormSearchRoom.Requests';

type Props = {
  text: string;
  type: string;
  classBlock: string;
};

class FormSearchRoom extends React.Component<Props> {
  static defaultProps = {
    text: 'Ссылка',
    type: '',
    classBlock: '',
  };

  data: Props;
  button: {
    text: string;
    arrow: boolean;
  };
  guests: {
    topic: string;
    id: string;
    items: {
      text: string;
      number?: number;
    }[];
  };
  fieldsDates: {
    topic: string;
  }[];

  constructor(props: Props) {
    super(props);
    this.data = this.props;
    this.button = {
      text: 'подобрать номер',
      arrow: true,
    };
    this.guests = {
      topic: 'Гости',
      id: 'dropdownFormSearchRoom',
      items: [
        {
          text: 'взрослые',
          number: 2,
        },
        {
          text: 'дети',
          number: 1,
        },
        {
          text: 'младенцы',
        },
      ],
    };
    this.fieldsDates = [
      {
        topic: 'Прибытие',
      },
      {
        topic: 'Выезд',
      },
    ];
  }

  render() {
    let { button, guests, fieldsDates } = this;

    return (
      <form className="form-search-room" name="formSearchRoom">
        <h1 className="form-search-room__topic">Найдём номера под ваши пожелания</h1>
        <div className="form-search-room__dropdown-dates">
          <DropdownDates data={fieldsDates} />
        </div>
        <Dropdown topic={guests.topic} id={guests.id} items={guests.items} />
        <div className="form-search-room__button">
          <ButtonSubmit text={button.text} border={false} />
        </div>
      </form>
    );
  }

  componentDidMount() {
    createdDropdowGuests(this.guests.id);

    const socket = new Requests();
    socket.socketsGO();
  }
}

export default FormSearchRoom;
