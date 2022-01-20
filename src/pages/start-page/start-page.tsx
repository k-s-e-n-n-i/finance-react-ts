import React from 'react';
import './start-page.scss';
import Link from '../../components/link/link';

import { basename } from '../../modules/functions/functions';

class StartPage extends React.Component {
  render() {
    return (
      <div>
        <div className="start-page">
          <h2>Pages Toxin:</h2>
          <div className="start-page__links">
            <Link classBlock="start-page__link" text="landing page" url={`/landing-page.html`} />
            <Link classBlock="start-page__link" text="finance" url={`/finance.html`} />
          </div>
        </div>
      </div>
    );
  }
}

export default StartPage;
