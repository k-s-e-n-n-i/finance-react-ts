import React from 'react';
import './dropdown-dates.scss';

type Props = {
  data: ItemDropdown[];
};
type ItemDropdown = {
  topic: string;
  activeDate?: string;
};

class DropdownDates extends React.Component<Props> {
  static defaultProps = {
    topic: '',
    activeDate: 'ДД.ММ.ГГГГ',
  };

  data: Props;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
  }

  getObj(obj: ItemDropdown) {
    const topic = obj.topic || '';
    const activeDate = obj.activeDate || 'ДД.ММ.ГГГГ';
    const newObj = { topic: topic, activeDate: activeDate };
    return newObj;
  }

  render() {
    let {
      data: { data },
    } = this;

    return (
      <div className="dropdown-dates js-dropdown-dates">
        {data.map((obj, index) => (
          <div className="dropdown-dates__date-block" data-name="date" key={index}>
            {this.getObj(obj).topic !== '' && <h3>{this.getObj(obj).topic}</h3>}
            <div className="dropdown-dates__dropdown js-dropdown-dates__dropdown">
              {this.getObj(obj).activeDate}
            </div>
          </div>
        ))}
      </div>
    );
  }

  componentDidMount() {
    //runCalendar();
  }
}

export default DropdownDates;
