import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { GmapsSetUp } from '../components/gmapsSetUp';

export default class EventPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: null
    };
  }

  componentDidMount() {
    const jwt = window.localStorage.getItem('react-context-jwt');
    const req = {
      method: 'GET',
      headers: {
        'x-access-token': jwt
      }
    };
    const eventId = this.props.eventId;
    fetch(`/api/event/${eventId}`, req)
      .then(res => res.json())
      .then(data => {
        this.setState({ event: data[0] });
      });
  }

  render() {
    if (!this.state.event) {
      return null;
    } else {
      const { date, eventName, fullName, lat, lng, location, note, participant, sport, time } = this.state.event;
      return (
        <Box maxWidth='md' margin='auto'>
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant='h4' sx={{ mt: 1, mb: 2 }}>
                  Event #{this.props.eventId}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Host:
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(240,240,240)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {fullName}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Event Name:
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(255,250,255)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {eventName}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Sport:
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(240,240,240)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {sport}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Participants (Maximum):
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(255,250,255)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {participant}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Date:
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(240,240,240)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {date}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Time:
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(255,250,255)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {time}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Notes:
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(240,240,240)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {note}
                </Typography>
              </Grid>
              <GmapsSetUp location={location} lat={lat} lng={lng} />
              <hr />
            </Grid>
          </Box>
        </Box>
      );
    }
  }
}
