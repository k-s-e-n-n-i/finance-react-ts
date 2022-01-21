import React from 'react';

import EntryHistory from '../EntryHistory/EntryHistory';

import { Entry, StateFF } from '../../modules/interfaces';
type Props = {
  historyList: Entry[];
};

class History extends React.Component<Props, StateFF> {
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
    console.log(`Новое historyList в History ${this.props.historyList[0]}`);

    return (
      <div className="history">
        {this.props.historyList.map((entry: Entry, index: number) => (
          <EntryHistory
            date={entry.date}
            sum={entry.sum}
            name={entry.name}
            idItem={entry.id}
            state={entry.state}
            key={`${entry.id}${index}`}
          />
        ))}
      </div>
    );
  }

  componentDidMount() {}
}

export default History;
