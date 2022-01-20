import React from 'react';
import './header.scss';

import { getElementBySelector } from '../../modules/functions/getElementBySelector.function';

import logo from './img/logo.svg';

import Btn from '../button/button';
import MenuLiExpand from '../MenuLiExpand/MenuLiExpand';

type Props = {
  id: string;
  menuItems?: Menu[];
  authorization?: boolean;
  userName?: string;
};
type Menu = {
  menuItem: string;
  link?: string;
  type?: string;
  state?: string;
  submenu?: Menu[];
};

type Button = {
  height: string;
  text: string;
  border?: boolean;
};

class Header extends React.Component<Props> {
  static defaultProps = {
    id: 'header',
    menuItems: false,
    authorization: false,
    userName: 'Имя',
  };

  data: Props;
  myRef: React.RefObject<HTMLHeadingElement>;
  btnLogin: Button;
  btnRegistr: Button;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
    this.myRef = React.createRef();

    this.btnLogin = {
      height: 'narrow',
      text: 'Войти',
      border: true,
    };
    this.btnRegistr = {
      height: 'narrow',
      text: 'Зарегистрироваться',
    };
  }

  printMenu(items: Menu[]) {
    return items.map((item: Menu, index) =>
      item.type === 'expand' ? (
        <MenuLiExpand item={item} key={`${this.data.id}menu${index}`} />
      ) : (
        <li
          className={
            'header__menu-li ' +
            (item.state === 'active' ? 'header__menu-li_active' : '') +
            (item.type === 'expand' ? 'header__menu-li_expand js-header__menu-li_expand' : '')
          }
          key={`${this.data.id}menu${index}`}
        >
          <a className="header__menu-a" href={item.link}>
            {item.menuItem}
          </a>
        </li>
      )
    );
  }

  render() {
    let {
      data: { menuItems, authorization, userName },
      btnLogin,
      btnRegistr,
    } = this;

    return (
      <header className="header" ref={this.myRef}>
        <div className="header__content-container">
          <a className="header__logo-link" href="./landing-page.html">
            <img className="header__logo" src={logo} alt="logo" />
          </a>
          <div className="header__menu-mobile js-header__menu-mobile"></div>
          <div className="header__links header__links_hidden">
            {menuItems && (
              <nav className="header__block-menu">
                <ul className="header__menu">{this.printMenu(menuItems)}</ul>
              </nav>
            )}
            {authorization ? (
              <div className="header__block-login">
                <div className="header__login-vertical-line"></div>
                <p>{userName}</p>
              </div>
            ) : (
              <div className="header__block-login">
                <div className="header__btn header__btn_border">
                  <Btn text={btnLogin.text} height={btnLogin.height} border={btnLogin.border} />
                </div>
                <div className="header__btn header__btn_gradient">
                  <Btn text={btnRegistr.text} height={btnRegistr.height} />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  componentDidMount() {
    const header = this.myRef.current;

    if (header) {
      this.initMenuMobile(header);
    }
  }

  initMenuMobile(header: HTMLElement) {
    const menuMobile = getElementBySelector(header, '.js-header__menu-mobile');
    const headerNav = getElementBySelector(header, '.header__links');

    menuMobile.addEventListener('click', () => {
      this.handleMenuMobileClick(menuMobile, headerNav);
    });
  }

  handleMenuMobileClick(menuMobile: HTMLElement, headerNav: HTMLElement): void {
    headerNav.classList.toggle('header__links_mobile');
    headerNav.classList.toggle('header__links_hidden');
    menuMobile.classList.toggle('header__menu-mobile_cross');
  }
}

export default Header;
