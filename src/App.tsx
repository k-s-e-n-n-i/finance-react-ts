import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { basename } from './modules/functions/functions';
import { Requests } from './pages/start-page/start-page.Requests';

import Layout from './components/layout/layout';
import StartPage from './pages/start-page/start-page';
import Finance from './pages/finance/finance';

interface Props {}
interface State {
  arrDirMonth: string[];
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      arrDirMonth: [],
    };
  }

  render() {
    const startPage = <StartPage dirs={this.state.arrDirMonth} />;

    return (
      <Router basename={basename}>
        <Routes>
          <Route path="/" element={<Layout header={0} content={startPage} footer={0} />} />
          <Route
            path="/finance"
            element={<Layout header={0} content={<Finance date={'2022.01'} />} footer={0} />}
          />
          {this.state.arrDirMonth.map((item, index) => (
            <Route
              path={`/finance${item}`}
              element={<Layout header={0} content={<Finance date={item} />} footer={0} />}
              key={`app-${index}`}
            />
          ))}
        </Routes>
      </Router>
    );
  }

  componentDidMount() {
    const socket = new Requests(this);
    socket.getHistory();
  }
}

export default App;
