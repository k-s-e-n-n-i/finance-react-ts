import React from 'react';
import './social.scss';

type Props = {
  id?: string;
  twitter: string;
  facebook: string;
  instagram: string;
};

type Soc = {
  on: boolean;
  name: string;
  link: string;
  icon: string;
};

class Social extends React.Component<Props> {
  static defaultProps = {
    id: 'soc',
  };

  data: Props;
  twitter: Soc;
  facebook: Soc;
  instagram: Soc;
  socs: Soc[];

  constructor(props: Props) {
    super(props);
    this.data = this.props;

    this.twitter = {
      on: this.props.twitter ? true : false,
      name: 'twitter',
      link: this.props.twitter || './link-stub',
      icon: require('./img/twitter.svg').default,
    };
    this.facebook = {
      on: this.props.facebook ? true : false,
      name: 'facebook',
      link: this.props.facebook || './link-stub',
      icon: require('./img/facebook.svg').default,
    };
    this.instagram = {
      on: this.props.instagram ? true : false,
      name: 'instagram',
      link: this.props.instagram || './link-stub',
      icon: require('./img/instagram.svg').default,
    };

    this.socs = [this.twitter, this.facebook, this.instagram];
  }

  render() {
    return (
      <div className="social">
        {this.socs.map(
          (soc, index) =>
            soc.on && (
              <span className="social__item" key={`${this.data.id}item${index}`}>
                <a href={soc.link}>
                  <img className={`social__item ${soc.name}`} src={soc.icon} alt={soc.name}></img>
                </a>
              </span>
            )
        )}
      </div>
    );
  }
}

export default Social;
