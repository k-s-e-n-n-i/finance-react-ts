import React from 'react';
import './FormFinance.scss';

import MonthTable from '../MonthTable/MonthTable';

import { Requests } from '../../pages/finance/finance.Requests';
import { Entry } from '../../modules/interfaces';

interface Props {
  caption: string;
  name: string;
  type: string;
  classBlock: string;
  colorForm: string;
}

interface State {
  formUpdate: string;
  allSumForm: number;
  listDates: Entry[];
}

class FormMonth extends React.Component<Props, State> {
  static defaultProps = {
    caption: 'Имя формы',
    name: '',
    type: '',
    classBlock: '',
    colorForm: '',
  };

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
      data: { caption, colorForm },
      refForm,
    } = this;

    colorForm = `form-finance_${colorForm}`;

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
    const compFormFinance = this;
    const { socket, year, month, requests } = new Requests().getHistory();
    const form = this.refForm.current;
    const nameformMonth = form?.getAttribute('data-name');

    if (socket != null) {
      socket.onmessage = (event) => {
        const incomingMessage = event.data;
        const data = JSON.parse(incomingMessage);
        const formName = data.form;

        if (formName == `${year}.${month}.${nameformMonth}`) {
          requests.runUpdateFormMonth({
            formName: formName,
            data: data,
            incomingMessage: incomingMessage,
            compFormFinance: compFormFinance,
          });
        }
        //else {
        //   Requests.runUpdateFormFinance({
        //     formName: formName,
        //     data: data,
        //     incomingMessage: incomingMessage,
        //     // compFormFinance: compFormFinance,
        //   });
        // }
      };
    }
  }
}

export default FormMonth;
