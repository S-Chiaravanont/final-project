import React from 'react';
import Redirect from '../components/redirect';

export default class ResearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { sport, lat, lng, city, radius } = this.props;
    const newHash = `#search?sport=${sport}&city=${city}&lat=${lat}&lng=${lng}&radius=${radius}`;
    return <Redirect to={newHash} />;
  }
}
