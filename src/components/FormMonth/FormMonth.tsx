import React from 'react';
import '../FormFinance/FormFinance.scss';

import MonthTable from '../MonthTable/MonthTable';

import { Requests } from './FormMonth.Requests';
import { HistoryList, Entry } from '../../modules/interfaces';

interface Props {
  caption: string;
  name: string;
  type: string;
  classBlock: string;
}

interface State {
  formUpdate: string;
  allForms: { [key: string]: HistoryList };
  arrNamesForms: string[];
  allSumForm: number;

  listDates: Entry[];
}

class FormFinance extends React.Component<Props, State> {
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
      formUpdate: '',
      allForms: {},
      arrNamesForms: ['formFinance', 'formExpenses', 'formForm', 'newForm', 'finance'],
      allSumForm: 0,

      listDates: [],
    };
  }

  render() {
    let {
      data: { caption, name },
      refForm,
    } = this;

    return (
      <div className="form-finance month-table" data-name="listDates" ref={refForm}>
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

export default FormFinance;
