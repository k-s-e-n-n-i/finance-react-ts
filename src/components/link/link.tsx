import React from 'react';
import './link.scss';

type Props = {
  url: string;
  text: string;
  type: string;
  classBlock: string;
};

class Link extends React.Component<Props> {
  static defaultProps = {
    url: './link-stub',
    text: 'Ссылка',
    type: '',
    classBlock: '',
  };

  data: Props;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
  }

  defineType() {
    const type = this.props.type;
    switch (type) {
      case 'gray': {
        return 'link link_gray';
      }
      case 'clean': {
        return 'link link_clean';
      }
      case 'ok': {
        return 'link link_ok';
      }
      default: {
        return 'link';
      }
    }
  }
  render() {
    const {
      data: { classBlock, url, text },
    } = this;
    return (
      <div className={classBlock}>
        <a className={this.defineType()} href={url}>
          {text}
        </a>
      </div>
    );
  }
}

export default Link;
