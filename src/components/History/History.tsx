import React from 'react';

import { EntryHistoryMain } from '../EntryHistory/EntryHistoryMain';
import { EntryHistoryEdit } from '../EntryHistory/EntryHistoryEdit';

import { Entry, HistoryList } from '../../modules/interfaces';

interface Props {
  stateForm: {
    formUpdate: string;
    allForms: { [key: string]: HistoryList };
    arrNamesForms: string[];
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
    const {
      props: {
        stateForm: { arrNamesForms, formUpdate, allForms },
      },
    } = this;

    let hl: Entry[] = [];

    if (arrNamesForms.includes(formUpdate)) {
      hl = allForms[formUpdate].historyList;
    }

    return (
      <div className="history">
        {hl.map((entry: Entry, index: number) =>
          entry.state === 'edit' ? (
            <EntryHistoryEdit
              date={entry.date}
              sumStr={entry.sumStr}
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
