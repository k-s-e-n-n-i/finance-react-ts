import React, { ReactElement } from 'react';
import './layout.scss';
import Header from '../header/header';
import Footer from '../footer/footer';

type Props = {
  header: number;
  content?: ReactElement;
  footer: number;
};

interface HeaderType {
  on: boolean;
  items: Menu[];
}
interface Menu {
  menuItem: string;
  type?: string;
  submenu?: Menu[];
}

class Layout extends React.Component<Props> {
  static defaultProps = {
    header: 1,
    content: <h1>Hi!</h1>,
    footer: 1,
  };

  header: HeaderType;
  footer: {
    on: Boolean;
  };

  constructor(props: Props) {
    super(props);
    this.header = {
      on: this.props.header === 0 ? false : true,
      items: [
        {
          menuItem: 'О нас',
        },
        {
          menuItem: 'Услуги',
          type: 'expand',
          submenu: [
            {
              menuItem: 'Услуга №1',
            },
            {
              menuItem: 'Услуга №2',
            },
          ],
        },
        {
          menuItem: 'Вакансии',
        },
        {
          menuItem: 'Новости',
        },
        {
          menuItem: 'Соглашения',
          type: 'expand',
          submenu: [
            {
              menuItem: 'Соглашение №1',
            },
            {
              menuItem: 'Соглашение №2',
            },
          ],
        },
      ],
    };
    this.footer = {
      on: this.props.footer === 0 ? false : true,
    };
  }

  render() {
    return (
      <div>
        {this.header.on && <Header menuItems={this.header.items} />}
        {this.props.content}
        {this.footer.on && <Footer />}
      </div>
    );
  }
}

export default Layout;
