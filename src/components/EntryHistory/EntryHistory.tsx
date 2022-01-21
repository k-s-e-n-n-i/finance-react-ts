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

interface StateEnHi {
  edit: boolean;
}

class EntryHistory extends React.Component<Props, StateEnHi> {
  static defaultProps = {
    date: 'дд.мм.гггг',
    sum: '0',
    name: '',
  };

  data: Props;

  constructor(props: Props) {
    super(props);
    this.data = this.props;

    const edit = this.data.state === 'edit' ? true : false;
    this.state = { edit: edit };
  }

  render() {
    let Comp;

    if (this.state.edit) {
      Comp = <EntryEdit data={this.props} />;
    } else {
      Comp = <EntryMain data={this.props} />;
    }

    return <div>{Comp}</div>;
  }

  componentDidMount() {}
}

type Props2 = {
  data: Props;
};

class EntryMain extends React.Component<Props2> {
  datas: Props2;

  constructor(props: Props2) {
    super(props);
    this.datas = this.props;
  }

  render() {
    const {
      datas: { data },
    } = this;
    return (
      <form className="entry-history" name={`entry${data.idItem}`} id={`${data.idItem}`}>
        <p className="entry-history__item">{data.date}</p>
        <p className="entry-history__item">{data.sum}</p>
        <p className="entry-history__item">{data.name}</p>
        <ButtonSubmit text={'ред.'} />
      </form>
    );
  }

  componentDidMount() {}
}

class EntryEdit extends React.Component<Props2> {
  datas: Props2;

  constructor(props: Props2) {
    super(props);
    this.datas = this.props;
  }

  render() {
    const {
      datas: { data },
    } = this;
    return (
      <form className="entry-history" name={`entry${data.idItem}`} id={`${data.idItem}`}>
        <div className="entry-history__item-edit entry-history__item_input-date">
          <InputText id={'ff_date'} name={'date'} inputText={data.date} />
        </div>
        <div className="entry-history__item-edit entry-history__item_input-sum">
          <InputText id={'ff_sum'} name={'sumEntry'} inputText={data.sum} placeholder={'1000'} />
        </div>
        <div className="entry-history__item-edit">
          <InputText id={'ff_name'} name={'nameEntry'} inputText={data.name} placeholder={'наименование'} />
        </div>
        <ButtonSubmit text={'сохр.'} border={false} />
      </form>
    );
  }

  componentDidMount() {}
}

export default EntryHistory;
