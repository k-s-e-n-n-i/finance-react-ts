import React from 'react';
import './topic-label.scss';

type Props = {
  topic: string;
  label?: string;
};

class TopicLabel extends React.Component<Props> {
  static defaultProps = {
    data: {
      topic: '',
      label: '',
    },
  };

  data: Props;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
  }

  render() {
    let {
      data: { topic, label },
    } = this;

    return topic !== '' && label !== '' ? (
      <div className="topic-label">
        <h3 className="topic-label__topic">{topic}</h3>
        <p className="topic-label__additional-text">{label}</p>
      </div>
    ) : topic !== '' ? (
      <div className="topic-label">
        <h3 className="topic-label__topic">{topic}</h3>
      </div>
    ) : (
      label !== '' && (
        <div className="topic-label">
          <p className="topic-label__additional-text">{label}</p>
        </div>
      )
    );
  }
}

export default TopicLabel;
