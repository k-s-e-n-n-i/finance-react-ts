import React from 'react';

type Props = {
  item: Menu;
};
type Menu = {
  menuItem: string;
  link?: string;
  type?: string;
  state?: string;
  submenu?: Menu[];
};

class MenuLiExpand extends React.Component<Props> {
  static defaultProps = {
    item: {},
  };

  data: Props;
  myRef: React.RefObject<HTMLLIElement>;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
    this.myRef = React.createRef();
  }

  printSubmenu(sbm: Menu[]) {
    return sbm.map((sbmItem: Menu, index: number) => (
      <li className="header__submenu-li" key={`submenu${index}`}>
        <a className="header__submenu-a" href={sbmItem.link}>
          {sbmItem.menuItem}
        </a>
      </li>
    ));
  }

  render() {
    const {
      data: {
        item: { menuItem, link, state, submenu },
      },
    } = this;
    return (
      <li
        className={
          'header__menu-li header__menu-li_expand js-header__menu-li_expand' +
          (state === 'active' ? 'header__menu-li_active' : '')
        }
        ref={this.myRef}
      >
        <a className="header__menu-a" href={link}>
          {menuItem}
        </a>
        {submenu && <ul className="header__submenu">{this.printSubmenu(submenu)}</ul>}
      </li>
    );
  }

  componentDidMount(): void {
    this.initScriptsMenu();
  }

  initScriptsMenu(): void {
    const liExpand = this.myRef.current;
    const submenu = liExpand?.querySelector('.header__submenu');

    liExpand?.addEventListener('click', (event) => {
      if (submenu) {
        this.handleItemMenuWithSubmenuClick(event, submenu);
      }
    });

    document.addEventListener('click', (event: Event) => {
      if (liExpand && submenu) {
        this.hideSubmenu(event, liExpand, submenu);
      }
    });
  }

  handleItemMenuWithSubmenuClick(event: Event, submenu: Element): void {
    if (submenu) {
      if (this.hasContains(submenu, event)) {
        return;
      }
      submenu.classList.toggle('header__submenu_open');
    }
  }

  hideSubmenu(event: Event, liExpand: Element, submenu: Element): void {
    if (this.hasContains(liExpand, event)) {
      return;
    }
    submenu?.classList.remove('header__submenu_open');
  }

  hasContains(element: Element, event: Event): boolean {
    if (event.target instanceof Node && element.contains(event.target)) {
      return true;
    } else {
      return false;
    }
  }
}

export default MenuLiExpand;
