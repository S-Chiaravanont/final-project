import React from 'react';
import Home from './pages/home';
import parseRoute from './lib/parse-route';
import AppContext from './lib/app-context';
import ResponsiveAppBar from './components/navbar';
import LoginPage from './pages/login';
import SignUpPage from './pages/signup';
import SuccessAlerts from './components/successAlert';
import CreateEventPage from './pages/createEvent';
import EventPage from './pages/event';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      route: parseRoute(window.location.hash),
      eventId: null
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleEventId = this.handleEventId.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
  }

  handleEventId(result) {
    const eventId = result;
    this.setState({ eventId });
    window.location.replace(`#event/${eventId}`);
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('react-context-jwt');
    this.setState({ user: null });
    window.location.replace('#home');
  }

  renderThisPage(data) {
    const { path, params } = this.state.route;
    if (path === 'home' || path === '') {
      return <Home />;
    } else if (path === 'account') {
      return null;
    } else if (path === 'log-in') {
      return <LoginPage />;
    } else if (path === 'sign-up') {
      return <SignUpPage />;
    } else if (path === 'successAlert') {
      return <SuccessAlerts />;
    } else if (path === 'createEvent') {
      return <CreateEventPage />;
    } else if (path === 'event') {
      const eventId = params.get('eventId');
      return <EventPage eventId={eventId} />;
    }
  }

  render() {
    const { user } = this.state;
    const { handleSignIn, handleSignOut, handleEventId } = this;
    const contextValue = { user, handleSignIn, handleSignOut, handleEventId };
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
