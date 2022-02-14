import React from 'react';
import './ButtonSubmit.scss';

type Props = {
  text: string;
  name?: string;
  height?: string;
  border?: boolean;
  arrow?: boolean;
  hover?: boolean;
};

class ButtonSubmit extends React.Component<Props> {
  data: Props;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
  }
  render() {
    let {
      data: { text = 'Текст', name = '', height = 'wide', border = true, arrow = false, hover = false },
    } = this;

    const classBorder = border ? 'button-submit_border ' : 'button-submit_gradient ';
    const classHeight = height === 'narrow' ? 'button-submit_narrow ' : 'button-submit_wide ';
    const classHover = hover ? 'button-submit_hover ' : '';

    const classBtnArrow = arrow ? 'button-submit__block_gradient_arrow' : '';
    const classBtnBorder = border
      ? `button-submit__block_border`
      : `button-submit__block_gradient ${classBtnArrow}`;

    const arrowBlock = arrow ? <div className="button-submit__arrow button-submit__arrow_white"></div> : null;

    const classBorderHover = hover ? 'button-submit__border_hover ' : '';
    const borderBlock = border ? <div className={`button-submit__border ${classBorderHover}`}></div> : null;

    return (
      <div className={`button-submit ${classBorder} ${classHeight} ${classHover}`}>
        <input
          type="submit"
          className={`button-submit__block ${classBtnBorder}`}
          value={text}
          name={name}
        ></input>
        {arrowBlock}
        {borderBlock}
      </div>
    );
  }
}

export default ButtonSubmit;
