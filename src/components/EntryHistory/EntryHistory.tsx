import React from 'react';
import './EntryHistory.scss';

import Button from '../button/button';
import ButtonSubmit from '../ButtonSubmit/ButtonSubmit';
import InputText from '../InputText/InputText';
import { Requests } from '../../modules/FormFinance.Requests';

type Props = {
  date: string;
  sum: string;
  name: string;
};

class EntryHistory extends React.Component<Props> {
  static defaultProps = {
    date: 'дд.мм.гггг',
    sum: '0',
    name: '',
  };

  data: Props;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
  }

  render() {
    let {
      data: { date, sum, name },
    } = this;

    return (
      <div className="entry-history">
        <div className="entry-history__item-history">{date}</div>
        <div className="entry-history__item-history">
          <p>{sum}</p>
        </div>
        <div className="entry-history__item-history">
          <p>{name}</p>
        </div>
        <Button text={'ред.'} border={true} />
      </div>
    );
  }

  componentDidMount() {}
}

export default EntryHistory;
