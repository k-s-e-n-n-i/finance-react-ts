import React from 'react';
import './link.scss';

type Props = {
  url?: string;
  text?: string;
  type?: string;
  classBlock?: string;
};

class Link extends React.Component<Props> {
  data: Props;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
  }

  defineType(type: string) {
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
      data: { url = './link-stub', text = 'Ссылка', type = '', classBlock = '' },
    } = this;
    return (
      <div className={classBlock}>
        <a className={this.defineType(type)} href={url}>
          {text}
        </a>
      </div>
    );
  }
}

export default Link;
