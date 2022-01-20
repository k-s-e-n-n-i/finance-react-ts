import React from 'react';
import './button.scss';

type Props = {
  text: string;
  link?: string;
  height?: string;
  border?: boolean;
  arrow?: boolean;
  hover?: boolean;
};

class Button extends React.Component<Props> {
  static defaultProps = {
    text: 'Текст',
    link: './link-stub',
    height: 'wide',
    border: false,
    arrow: false,
    hover: false,
  };

  data: Props;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
  }
  render() {
    let {
      data: { text, link, height, border, arrow, hover },
    } = this;

    return (
      <div
        className={
          'button ' +
          (border ? 'button_border ' : 'button_gradient ') +
          (height === 'narrow' ? 'button_narrow ' : 'button_wide ') +
          (hover ? 'button_hover ' : '')
        }
      >
        <button
          type="button"
          className={
            'button__block' +
            (border
              ? ' button__block_border '
              : ' button__block_gradient ' + (arrow ? 'button__block_gradient_arrow' : ''))
          }
        >
          <a className="button__link" href={link}>
            {text}
          </a>
          {arrow ? <div className="button__arrow button__arrow_white"></div> : ''}
        </button>

        {border ? <div className={'button__border ' + (hover ? 'button__border_hover ' : '')}></div> : ''}
      </div>
    );
  }
}

export default Button;
