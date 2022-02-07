import React from 'react';
import './EntryHistory.scss';

import ButtonSubmit from '../ButtonSubmit/ButtonSubmit';

type Props = {
  date: string;
  sum: string;
  name: string;
  idItem: number;
  state: string;
};

export class EntryHistoryMain extends React.Component<Props> {
  data: Props;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
  }

  render() {
    const {
      data: { date = 'дд.мм.гггг', idItem, sum = '0', name = '' },
    } = this;
    return (
      <form className="entry-history entry-history_main" name={`entry${idItem}`} id={`${idItem}`}>
        <p className="entry-history__item">{date}</p>
        <p className="entry-history__item">{sum}</p>
        <p className="entry-history__item">{name}</p>
        <ButtonSubmit text={'ред.'} name="edit" />
      </form>
    );
  }

  componentDidMount() {}
}

export default EntryHistoryMain;
