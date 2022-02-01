import React from 'react';
import './FormTotal.scss';

import { Requests } from './FormTotal.Requests';

interface Props {
  caption: string;
  name: string;
  type: string;
  classBlock: string;
}

interface State {
  finance: number;
  expMain: number;
  expMonth: number;
  expenses: number;
  balance: number;
}

class FormTotal extends React.Component<Props, State> {
  static defaultProps = {
    caption: 'Имя формы',
    name: '',
    type: '',
    classBlock: '',
  };

  data: Props;
  refForm: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
    this.refForm = React.createRef();

    this.state = {
      finance: 0,
      expMain: 0,
      expMonth: 0,
      expenses: 0,
      balance: 0,
    };
  }

  render() {
    let {
      data: { caption },
      refForm,
    } = this;

    return (
      <div className="form-total" ref={refForm}>
        <h1 className="form-total__topic">{caption}</h1>

        <p className="form-total__item">
          Приход: <span className="form-total__item-count">{this.state.finance}</span>
        </p>
        <p className="form-total__item">
          Расход: <span className="form-total__item-count">{this.state.expMain} </span>+
          <span className="form-total__item-count"> {this.state.expMonth} </span>=
          <span className="form-total__item-count"> {this.state.expenses} </span>
        </p>

        <hr className="form-total__hr-line "></hr>

        <div className="form-total__total">Текущее: {this.state.balance}</div>
      </div>
    );
  }

  componentDidMount() {
    const form = this.refForm.current;
    if (form) {
      const socket = new Requests(this);
      socket.getHistory();
    }
  }
}

export default FormTotal;
