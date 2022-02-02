import React from 'react';
import './start-page.scss';
import Link from '../../components/link/link';

class StartPage extends React.Component {
  render() {
    return (
      <div>
        <div className="start-page">
          <h2>Pages Toxin:</h2>
          <div className="start-page__links">
            <Link classBlock="start-page__link" text="finance" url={`/finance`} />
            <Link classBlock="start-page__link" text="finance2" url={`/finance2`} />
          </div>
        </div>
      </div>
    );
  }
}

export default StartPage;
