import React from 'react';

import { EntryHistoryMain } from '../EntryHistory/EntryHistoryMain';
import { EntryHistoryEdit } from '../EntryHistory/EntryHistoryEdit';

import { Entry, HistoryList } from '../../modules/interfaces';

class History extends React.Component<HistoryList> {
  static defaultProps = {
    date: 'дд.мм.гггг',
    sum: '0',
    name: '',
    id: '0',
  };

  data: HistoryList;

  constructor(props: HistoryList) {
    super(props);
    this.data = this.props;
  }

  render() {
    return (
      <div className="history">
        {this.props.historyList.map((entry: Entry, index: number) =>
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
