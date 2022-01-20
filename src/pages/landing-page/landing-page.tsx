import React from 'react';
import './landing-page.scss';
import FormSearchRoom from '../../components/form-search-room/form-search-room';

class LandingPage extends React.Component<{}> {
  render() {
    return (
      <main className="landing-page">
        <div className="landing-page__content-container">
          <div className="landing-page__form-search-num">
            <FormSearchRoom />
          </div>
          <p className="landing-page__background-text">
            Лучшие номера для вашей работы, отдыха и просто вдохновения
          </p>
        </div>
      </main>
    );
  }
}

export default LandingPage;
