import React from 'react';
import Home from './pages/home';
import parseRoute from './lib/parse-route';
import AppContext from './lib/app-context';
import ResponsiveAppBar from './components/navbar';
import LoginPage from './pages/login';
import SignUpPage from './pages/signup';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      route: parseRoute(window.location.hash)
    };
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('react-context-jwt');
    this.setState({ user: null });
  }

  renderThisPage() {
    const { path } = this.state.route;
    if (path === 'home' || path === '') {
      return <Home />;
    } else if (path === 'account') {
      return null;
    } else if (path === 'log-in') {
      return <LoginPage />;
    } else if (path === 'sign-up') {
      return <SignUpPage />;
    }
  }

  render() {
    const { user } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, handleSignIn, handleSignOut };
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
