import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { basename } from './modules/functions/functions';

import Layout from './components/layout/layout';
import StartPage from './pages/start-page/start-page';
import Finance from './pages/finance/finance';
import Finance2 from './pages/finance2/finance2';

class App extends Component<{}> {
  render() {
    const startPage = <StartPage />;
    const finance = <Finance />;
    const finance2 = <Finance2 />;

    return (
      <Router basename={basename}>
        <Routes>
          <Route path="/" element={<Layout header={0} content={startPage} footer={0} />} />
          <Route path="/finance" element={<Layout header={0} content={finance} footer={0} />} />
          <Route path="/finance2" element={<Layout header={0} content={finance2} footer={0} />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
