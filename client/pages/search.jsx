import React from 'react';
// import GmapsSetUp from '../components/gmapsSetUp';

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(props) {
    const jwt = window.localStorage.getItem('react-context-jwt');
    const req = {
      method: 'GET',
      headers: {
        'x-access-token': jwt
      }
    };
    // const { sport, zipCode, radius } = this.props.params;
    // const latLng = <GmapsSetUp zipCode={zipCode} />;
    // const sql = `

    // `;
    fetch('/api/search/', req)
      .then(res => res.json())
      .then(data => {
        this.setState({ events: data });
      });
  }

  render() {
    // console.log(this.props.params);
    return (
      <h1>Hello world</h1>
    );
  }
}
