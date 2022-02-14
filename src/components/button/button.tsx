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
  data: Props;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
  }
  render() {
    const {
      data: {
        text = 'Текст',
        link = './link-stub',
        height = 'wide',
        border = true,
        arrow = false,
        hover = false,
      },
    } = this;

    const classBorder = border ? 'button_border ' : 'button_gradient ';
    const classHeight = height === 'narrow' ? 'button_narrow ' : 'button_wide ';
    const classHover = hover ? 'button_hover ' : '';

    const classBtnArrow = arrow ? 'button__block_gradient_arrow' : '';
    const classBtnBorder = border ? `button__block_border` : `button__block_gradient ${classBtnArrow}`;

    const arrowBlock = arrow ? <div className="button__arrow button__arrow_white"></div> : null;

    const classBorderHover = hover ? 'button__border_hover ' : '';
    const borderBlock = border ? <div className={`button__border ${classBorderHover}`}></div> : null;

    return (
      <div className={`button ${classBorder} ${classHeight} ${classHover}`}>
        <button type="button" className={`button__block ${classBtnBorder}`}>
          <a className="button__link" href={link}>
            {text}
          </a>
          {arrowBlock}
        </button>
        {borderBlock}
      </div>
    );
  }
}

export default Button;
