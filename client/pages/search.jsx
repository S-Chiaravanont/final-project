import React from 'react';
import latLngConversion from '../components/latLngConverter';
// import { GmapsSetUp } from '../components/gmapsSetUp';

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: null,
      city: null
    };
  }

  componentDidMount() {
    const { sport, lat, lng, city, radius } = this.props;
    const latLng = { lat, lng };
    const latLngLimit = latLngConversion(latLng, radius);
    const payload = { sport, latLngLimit };
    const jwt = window.localStorage.getItem('react-context-jwt');
    const req = {
      method: 'POST',
      headers: {
        'x-access-token': jwt
      },
      body: JSON.stringify(payload)
    };
    fetch('/api/search/', req)
      .then(res => res.json())
      .then(data => {
        this.setState({ events: data, city });
      });
  }

  render() {
    if (!this.state.events) {
      return null;
    } else {
      return (
        <h1>Hello world</h1>
      );
    }
  }
}
