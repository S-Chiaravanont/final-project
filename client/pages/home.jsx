import React from 'react';
import LandingPage from '../components/userLandingPage';
import AppContext from '../lib/app-context';
import HomeLandingPage from '../components/homeLandingPage';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false
    };
  }

  componentDidMount(props) {
    const { user } = this.context;
    if (user) {
      this.setState({ login: true });
    } else {
      this.setState({ login: false });
    }
  }

  render() {
    const { login } = this.state;
    if (login) {
      return (
        <div>
          <LandingPage />
        </div>
      );
    } else {
      return <HomeLandingPage />;
    }
  }
}
Home.contextType = AppContext;
