import React from 'react';
import './EntryHistory.scss';

import ButtonSubmit from '../ButtonSubmit/ButtonSubmit';
import InputText from '../InputText/InputText';

type Props = {
  date: string;
  sum: string;
  name: string;
  idItem: number;
  state: string;
};

export class EntryHistoryEdit extends React.Component<Props> {
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
    const {
      data: { date, idItem, sum, name },
    } = this;
    return (
      <form className="entry-history entry-history_edit" name={`entry${idItem}`} id={`${idItem}`}>
        <div className="entry-history__item-edit entry-history__item_input-date">
          <InputText id={'ff_date'} name={'date'} inputText={date} />
        </div>
        <div className="entry-history__item-edit entry-history__item_input-sum">
          <InputText id={'ff_sum'} name={'sumEntry'} inputText={sum} placeholder={'1000'} />
        </div>
        <div className="entry-history__item-edit">
          <InputText id={'ff_name'} name={'nameEntry'} inputText={name} placeholder={'наименование'} />
        </div>
        <div className="entry-history__item-edit entry-history__item-edit_buttons">
          <ButtonSubmit text={'сохр.'} border={false} name="save" />
          <ButtonSubmit text={'X'} name="delete" />
        </div>
      </form>
    );
  }

  componentDidMount() {}
}

export default EntryHistoryEdit;
