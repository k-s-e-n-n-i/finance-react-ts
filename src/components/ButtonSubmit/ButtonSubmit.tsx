import React from 'react';
import './ButtonSubmit.scss';

type Props = {
  text: string;
  link?: string;
  height?: string;
  border?: boolean;
  arrow?: boolean;
  hover?: boolean;
};

class ButtonSubmit extends React.Component<Props> {
  static defaultProps = {
    text: 'Текст',
    link: './link-stub',
    height: 'wide',
    border: true,
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
      data: { text, height, border, arrow, hover },
    } = this;

    return (
      <div
        className={
          'button-submit ' +
          (border ? 'button-submit_border ' : 'button-submit_gradient ') +
          (height === 'narrow' ? 'button-submit_narrow ' : 'button-submit_wide ') +
          (hover ? 'button-submit_hover ' : '')
        }
      >
        <input
          type="submit"
          className={
            'button-submit__block' +
            (border
              ? ' button-submit__block_border '
              : ' button-submit__block_gradient ' + (arrow ? 'button-submit__block_gradient_arrow' : ''))
          }
          value={text}
        ></input>
        {arrow ? <div className="button-submit__arrow button-submit__arrow_white"></div> : ''}
        {border ? (
          <div className={'button-submit__border ' + (hover ? 'button-submit__border_hover ' : '')}></div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default ButtonSubmit;
