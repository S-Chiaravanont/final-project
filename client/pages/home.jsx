import React from 'react';
import LandingPage from '../components/userLandingPage';
import AppContext from '../lib/app-context';
import HomeLandingPage from '../components/homeLandingPage';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = null;
  }

  render() {
    const { user } = this.context;
    if (user) {
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
