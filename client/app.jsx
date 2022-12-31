import React from 'react';
import Home from './pages/home';
import parseRoute from './lib/parse-route';
import AppContext from './lib/app-context';
import ResponsiveAppBar from './components/navbar';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      // {
      //   userId: 1
      // },
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
  }

  renderThisPage() {
    const { path } = this.state.route;
    if (path === 'home') {
      return <Home />;
    } else if (path === 'account') {
      return null;
    }
  }

  render() {
    const { user } = this.state;
    const contextValue = { user };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          <ResponsiveAppBar />
          { this.renderThisPage() }
        </>
      </AppContext.Provider>
    );
  }
}
