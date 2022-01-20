import React from 'react';
import './footer.scss';
import logo from './img/logo.svg';
import Social from '../../components/social/social';
import InputText from '../../components/InputText/InputText';

type Props = {
  id?: string;
  footerMenu?: ColumnMenu[];
  authorization?: boolean;
  userName?: string;
};

type ColumnMenu = {
  text: string;
  listMenu?: ItemMenu[];
};
type ItemMenu = {
  text: string;
  link?: string;
};

class Footer extends React.Component<Props> {
  static defaultProps = {
    id: 'footer',
    footerMenu: false,
    authorization: false,
    userName: 'Имя',
  };

  data: Props;
  footerMenu: ColumnMenu[];
  inputSubscription: {
    placeholder: string;
    id: string;
    type: string;
  };

  constructor(props: Props) {
    super(props);
    this.data = this.props;
    this.footerMenu = [
      {
        text: 'Навигация',
        listMenu: [
          {
            text: 'О нас',
          },
          {
            text: 'Новости',
          },
          {
            text: 'Служба поддержки',
          },
          {
            text: 'Услуги',
          },
        ],
      },
      {
        text: 'О нас',
        listMenu: [
          {
            text: 'О сервисе',
          },
          {
            text: 'Наша команда',
          },
          {
            text: 'Вакансии',
          },
          {
            text: 'Инвесторы',
          },
        ],
      },
      {
        text: 'Служба поддержки',
        listMenu: [
          {
            text: 'Соглашения',
          },
          {
            text: 'Сообщества',
          },
          {
            text: 'Связь с нами',
          },
        ],
      },
    ];
    this.inputSubscription = {
      placeholder: 'Email',
      id: 'Footer',
      type: 'subscription',
    };
  }

  render() {
    return (
      <footer className="footer">
        <div className="footer__block-menu">
          <div className="footer__content-container">
            <div className="footer__logo-block">
              <img className="footer__logo" src={logo} alt="logo" />
              <p className="footer__logo-text">
                Бронирование номеров в лучшем отеле 2019 года по версии ассоциации «Отельные взгляды»
              </p>
            </div>

            <ul className="footer__footer-menu">
              {this.footerMenu.map((column: ColumnMenu, index) => (
                <li className="footer__menu-column" key={`${this.data.id}col${index}`}>
                  <ul className="footer__menu-list">
                    <li className="footer__menu-topic-column">{column.text}</li>
                    {column.listMenu &&
                      column.listMenu.map((itemLink: ItemMenu, index) => (
                        <li className="footer__menu-li" key={`${this.data.id}li${index}`}>
                          <a className="footer__menu-a" href={itemLink.link || './link-stub'}>
                            {itemLink.text}
                          </a>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>

            <div className="footer__subscription">
              <p className="footer__subscription-topic"> Подписка</p>
              <p className="footer__subscription-text">Получайте специальные предложения и новости сервиса</p>
              <div className="footer__subscription-input">
                <InputText
                  placeholder={this.inputSubscription.placeholder}
                  id={this.inputSubscription.id}
                  type={this.inputSubscription.type}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="footer__copyright-block">
          <div className="footer__copyright-content">
            <p className="footer__copyright-text"> Copyright © 2018 Toxin отель. Все права защищены.</p>
            <Social
              twitter={'https://twitter.com/'}
              facebook={'https://www.facebook.com/'}
              instagram={'https://www.instagram.com/'}
            />
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
