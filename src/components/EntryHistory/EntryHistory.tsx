import React from 'react';
import './EntryHistory.scss';

import Button from '../button/button';

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
        <p className="entry-history__item">{date}</p>
        <p className="entry-history__item">{sum}</p>
        <p className="entry-history__item">{name}</p>
        <Button text={'ред.'} border={true} />
      </div>
    );
  }

  componentDidMount() {}
}

export default EntryHistory;
