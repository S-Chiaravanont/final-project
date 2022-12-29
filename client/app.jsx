import React from 'react';
import Home from './pages/home';
// import parseRoute from '../lib/parse-route';
import AppContext from './lib/app-context';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        userId: 1
      }
      // route: parseRoute(window.location.hash)
    };

  }

  renderThisPage() {
    // const { path } = this.state.route;
    // if (path === '') {
    //   return <Home />;
    // }
    return <Home />;
  }

  render() {
    const { user } = this.state;
    const contextValue = { user };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          { this.renderThisPage() }
        </>
      </AppContext.Provider>
    );
  }
}
