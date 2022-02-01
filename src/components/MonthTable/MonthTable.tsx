import React from 'react';

import { EntryHistoryMainMonth } from '../EntryHistoryMonth/EntryHistoryMainMonth';
import { EntryHistoryEditMonth } from '../EntryHistoryMonth/EntryHistoryEditMonth';

import { Entry } from '../../modules/interfaces';

interface Props {
  stateForm: {
    listDates: Entry[];
  };
}

class MonthTable extends React.Component<Props> {
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
    const {
      props: {
        stateForm: { listDates },
      },
    } = this;

    return (
      <div className="history">
        {listDates.map((entry: Entry, index: number) =>
          entry.state === 'edit' ? (
            <EntryHistoryEditMonth
              date={entry.date}
              sumStr={entry.sumStr}
              sum={entry.sum}
              name={entry.name}
              idItem={entry.id}
              state={entry.state}
              key={`${entry.id}${index}`}
            />
          ) : (
            <EntryHistoryMainMonth
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

export default MonthTable;
