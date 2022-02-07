import React from 'react';
import './FormFinance.scss';

import ButtonSubmit from '../ButtonSubmit/ButtonSubmit';
import InputText from '../InputText/InputText';
import History from '../History/History';

import { Requests } from './FormFinance.Requests';
import { HistoryList } from '../../modules/interfaces';

interface Props {
  caption?: string;
  name?: string;
  colorForm?: string;
}

interface State {
  formUpdate: string;
  allForms: { [key: string]: HistoryList };
  arrNamesForms: string[];
  allSumForm: number;
}

class FormFinance extends React.Component<Props, State> {
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
      data: { caption = 'Имя формы', name = '', colorForm = '' },
      refForm,
    } = this;

    colorForm = colorForm != '' ? `form-finance_${colorForm}` : '';

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
    const form = this.refForm.current;
    if (form) {
      const socket = new Requests(this, form);
      socket.getHistory();
    }
  }
}

export default FormFinance;
