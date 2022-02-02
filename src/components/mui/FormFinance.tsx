import React from 'react';
import '../forms/FormFinance.scss';

import ButtonSubmit from '../ButtonSubmit/ButtonSubmit';
import InputText from '../InputText/InputText';
import History from '../History/History';

import { Requests } from '../forms/FormFinance.Requests';
import { HistoryList } from '../../modules/interfaces';

// import { withStyles } from '@material-ui/core/styles';
import { FormControl, Button, Paper, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

// import TextField from '@mui/material/TextField';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import DatePicker from '@mui/lab/DatePicker';

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
  value: string;
  setValue: string;
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
      value: '',
      setValue: '',
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

    const Item = styled(Paper)(({ theme }) => ({
      ...theme.typography.body2,
      textAlign: 'center',
      color: theme.palette.text.secondary,
      height: 60,
      lineHeight: '60px',
    }));

    return (
      <Item key={3} elevation={30}>
        <h1 className="form-finance__topic">{caption}</h1>

        <form className="form-finance__ff-send" name={name}>
          <TextField id={'ff_date'} name={'date'} type="date" value={todayDate} />
          <TextField id={'ff_sum'} name={'sumEntry'} type="text" placeholder={'1000'} />
          <TextField id={'ff_name'} name={'nameEntry'} type="text" placeholder={'наименование'} />
          <Button variant="contained">Добавить</Button>
          <div className="form-finance__item_1-5">
            <p className="form-finance__notification"></p>
          </div>
        </form>

        <hr className="form-finance__hr-line "></hr>

        <History stateForm={this.state} />

        <hr className="form-finance__hr-line "></hr>

        <div className="form-finance__total">Итого: {this.state.allSumForm}</div>
      </Item>
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
