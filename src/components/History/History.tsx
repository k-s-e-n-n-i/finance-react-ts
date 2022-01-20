import React from 'react';
import './History.scss';

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
  };

  data: Props;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
    this.state = this.props;

    this.setState({ historyList: this.props.historyList });
  }

  render() {
    return (
      <div className="form-finance__history-list">
        {this.props.historyList.map((entry: Entry, index: number) => (
          <EntryHistory date={entry.date} sum={entry.sum} name={entry.name} key={`entry${index}`} />
        ))}
      </div>
    );
  }

  componentDidMount() {}
}

export default History;
