import React from 'react';
import './dropdown.scss';
import Link from '../../components/link/link';
import TopicLabel from '../../components/topic-label/topic-label';

type Props = {
  name?: string;
  topic: string;
  label?: string;
  activeText?: string;
  id: string;
  state?: string;
  hasBtns?: boolean;
  items: {
    text: string;
    number?: number;
  }[];
};

class Dropdown extends React.Component<Props> {
  static defaultProps = {
    name: 'nameDropdown',
    topic: 'Заголовок',
    label: '',
    activeText: 'Текст',
    id: '',
    state: 'close',
    hasBtns: true,
    items: [],
  };

  data: Props;
  dropdownOpenClass: string;
  dropdownItemsHiddenClass: string;

  constructor(props: Props) {
    super(props);
    this.data = this.props;

    this.dropdownOpenClass = '';
    this.dropdownItemsHiddenClass = '';
  }

  render() {
    let {
      data: { name, topic, label, activeText, id, state, hasBtns, items },
      dropdownOpenClass,
      dropdownItemsHiddenClass,
    } = this;

    state === 'close'
      ? (dropdownItemsHiddenClass = 'dropdown__items_hidden')
      : (dropdownOpenClass = 'dropdown__field_actived');

    return (
      <div className="dropdown js-dropdown" data-name={name} id={id}>
        <TopicLabel topic={topic} label={label} />

        {items.length !== 0 ? (
          <div className={`dropdown__field js-dropdown__field ${dropdownOpenClass}`}>{activeText}</div>
        ) : (
          <div className={`dropdown__field js-dropdown__field`}>{activeText}</div>
        )}

        {items.length !== 0 && (
          <div className={`dropdown__items ${dropdownItemsHiddenClass}`}>
            {hasBtns && (
              <div className="dropdown__btns js-dropdown__btns">
                <div className="dropdown__btn-link dropdown__btn-link_clean">
                  <Link text="Очистить" type="clean" />
                </div>
                <div className="dropdown__btn-link dropdown__btn-link_ok">
                  <Link text="Применить" type="ok" />
                </div>
              </div>
            )}
          </div>
        )}

        {name === 'date' && <div className="dropdown__calendar"></div>}
      </div>
    );
  }
}

export default Dropdown;
