import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { basename } from './modules/functions/functions';

import Layout from './components/layout/layout';
import StartPage from './pages/start-page/start-page';
import LandingPage from './pages/landing-page/landing-page';
import Finance from './pages/finance/finance';

class App extends Component<{}> {
  render() {
    const startPage = <StartPage />;
    const landingPage = <LandingPage />;
    const finance = <Finance />;

    return (
      <Router basename={basename}>
        <Routes>
          <Route path="/" element={<Layout header={0} content={startPage} footer={0} />} />
          <Route path="/landing-page" element={<Layout content={landingPage} />} />
          <Route path="/finance" element={<Layout header={0} content={finance} footer={0} />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
