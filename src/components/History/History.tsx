import React from 'react';

import { EntryHistoryMain } from '../EntryHistory/EntryHistoryMain';
import { EntryHistoryEdit } from '../EntryHistory/EntryHistoryEdit';

import { Entry, HistoryList } from '../../modules/interfaces';

interface Props {
  stateForm: {
    form: string;
    formFinance: HistoryList;
    formExpenses: HistoryList;
  };
}

class History extends React.Component<Props> {
  static defaultProps = {
    date: 'дд.мм.гггг',
    sum: '0',
    name: '',
    id: '0',
  };

  data: Props;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
  }

  render() {
    let hl;
    if (this.props.stateForm.form === 'formFinance') {
      hl = this.props.stateForm.formFinance.historyList;
    }
    if (this.props.stateForm.form === 'formExpenses') {
      hl = this.props.stateForm.formExpenses.historyList;
    }
    return (
      <div className="history">
        {hl?.map((entry: Entry, index: number) =>
          entry.state === 'edit' ? (
            <EntryHistoryEdit
              date={entry.date}
              sum={entry.sum}
              name={entry.name}
              idItem={entry.id}
              state={entry.state}
              key={`${entry.id}${index}`}
            />
          ) : (
            <EntryHistoryMain
              date={entry.date}
              sum={entry.sum}
              name={entry.name}
              idItem={entry.id}
              state={entry.state}
              key={`${entry.id}${index}`}
            />
          )
        )}
      </div>
    );
  }

  componentDidMount() {}
}

export default History;
