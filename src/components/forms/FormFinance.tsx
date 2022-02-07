import React from 'react';
import './FormFinance.scss';

import ButtonSubmit from '../ButtonSubmit/ButtonSubmit';
import InputText from '../InputText/InputText';
import History from '../History/History';

import { Requests } from '../../pages/finance/finance.Requests';
import { HistoryList } from '../../modules/interfaces';

interface Props {
  caption: string;
  name: string;
  type: string;
  classBlock: string;
  colorForm: string;
}

interface State {
  formUpdate: string;
  allForms: { [key: string]: HistoryList };
  arrNamesForms: string[];
  allSumForm: number;
}

class FormFinance extends React.Component<Props, State> {
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
      allForms: {},
      arrNamesForms: ['formFinance', 'formExpenses', 'formAccumulation', 'formCheck'],
      allSumForm: 0,
    };
  }

  render() {
    let {
      data: { caption, name, colorForm },
      refForm,
    } = this;

    colorForm = `form-finance_${colorForm}`;

    const today = new Date();
    const month = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
    const todayDate = `${today.getDate()}.${month}.${today.getFullYear()}`;

    return (
      <div className={`form-finance ${colorForm}`} ref={refForm}>
        <h1 className="form-finance__topic">{caption}</h1>

        <form className="form-finance__ff-send" name={name}>
          <div className="form-finance__item form-finance__item_input-date">
            <InputText id={'ff_date'} name={'date'} inputText={todayDate} />
          </div>
          <div className="form-finance__item form-finance__item_input-sum">
            <InputText id={'ff_sum'} name={'sumEntry'} placeholder={'1000'} type="number" />
          </div>
          <div className="form-finance__item">
            <InputText id={'ff_name'} name={'nameEntry'} placeholder={'наименование'} />
          </div>
          <div className="form-finance__item">
            <ButtonSubmit text={'Добавить'} border={false} />
          </div>

          <div className="form-finance__item_1-5">
            <p className="form-finance__notification"></p>
          </div>
        </form>

        <hr className="form-finance__hr-line "></hr>

        <History stateForm={this.state} />

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
          requests.runUpdateFormFinance({
            formName: formName,
            data: data,
            incomingMessage: incomingMessage,
            compFormFinance: compFormFinance,
          });
        }
      };
    }
  }
}

export default FormFinance;
