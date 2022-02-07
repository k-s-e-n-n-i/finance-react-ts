import React from 'react';
import './FormFinance.scss';

import MonthTable from '../MonthTable/MonthTable';

import { Requests } from './FormFinance.Requests';
import { Entry } from '../../modules/interfaces';

interface Props {
  caption: string;
  colorForm: string;
}

interface State {
  formUpdate: string;
  allSumForm: number;
  listDates: Entry[];
}

class FormMonth extends React.Component<Props, State> {
  data: Props;
  refForm: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
    this.refForm = React.createRef();

    this.state = {
      formUpdate: '',
      allSumForm: 0,
      listDates: [],
    };
  }

  render() {
    let {
      data: { caption = 'Имя формы', colorForm = '' },
      refForm,
    } = this;

    colorForm = colorForm != '' ? `form-finance_${colorForm}` : '';

    return (
      <div className={`form-finance ${colorForm}`} data-name="listDates" ref={refForm}>
        <h1 className="form-finance__topic">{caption}</h1>

        <MonthTable stateForm={this.state} />

        <hr className="form-finance__hr-line "></hr>

        <div className="form-finance__total">Итого: {this.state.allSumForm}</div>
      </div>
    );
  }

  componentDidMount() {
    const form = this.refForm.current;
    if (form) {
      const socket = new Requests(this, form);
      socket.getHistory();
    }
  }
}

export default FormMonth;
