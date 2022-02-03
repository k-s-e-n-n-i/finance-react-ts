import React from 'react';
import './start-page.scss';
import Link from '../../components/link/link';

interface Props {
  dirs: string[];
}

class StartPage extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      arrDirMonth: [],
    };
  }
  render() {
    return (
      <div>
        <div className="start-page">
          <h2>Pages Toxin:</h2>
          <div className="start-page__links">
            <Link classBlock="start-page__link" text="finance" url={`/finance`} />
            {this.props.dirs.map((item, index) => (
              <Link
                classBlock="start-page__link"
                text={`finance ${item}`}
                url={`/finance${item}`}
                key={`sp-link-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default StartPage;
