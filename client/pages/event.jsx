import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { GmapsSetUp } from '../components/gmapsSetUp';
import AppContext from '../lib/app-context';
import Button from '@mui/material/Button';

export default class EventPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: null,
      isOwner: false,
      eventId: null,
      participantId: null,
      joinStatus: false
    };
    this.isEventOwner = this.isEventOwner.bind(this);
    this.eventEditOnClick = this.eventEditOnClick.bind(this);
    this.joinEventOnClick = this.joinEventOnClick.bind(this);
    this.unJoinEventOnClick = this.unJoinEventOnClick.bind(this);
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
        if (data[0].userId === this.context.user.userId) {
          this.setState({ event: data[0], isOwner: true, eventId });
        } else {
          this.setState({ event: data[0], eventId });
        }
      })
      .then(() => {
        fetch(`/api/eventStatus/${eventId}`, req)
          .then(res => res.json())
          .then(data => {
            this.setState({ participantId: data });
          });
      });
  }

  eventEditOnClick() {
    const newHash = `#edit?eventId=${this.state.eventId}`;
    window.location.replace(newHash);
    return null;
  }

  joinEventOnClick() {
    const { userId } = this.context.user;
    const { eventId } = this.state.eventId;
    const jwt = window.localStorage.getItem('react-context-jwt');
    const req = {
      method: 'POST',
      headers: {
        'x-access-token': jwt
      }
    };
    fetch(`/api/event/${eventId}/join/${userId}`, req)
      .then(res => res.json())
      .then(data => {
        this.setState({ joinStatus: true });
        return null;
      });
  }

  unJoinEventOnClick() {
    const { userId } = this.context.user;
    const { eventId } = this.state.eventId;
    const jwt = window.localStorage.getItem('react-context-jwt');
    const req = {
      method: 'POST',
      headers: {
        'x-access-token': jwt
      }
    };
    fetch(`/api/event/${eventId}/unjoin/${userId}`, req)
      .then(res => res.json())
      .then(data => {
        this.setState({ joinStatus: false });
        return null;
      });
  }

  isEventOwner() {
    const { userId } = this.context.user;
    if (this.state.isOwner) {
      return (
        <Button onClick={this.eventEditOnClick} >Edit</Button>
      );
    } else {
      if (!this.state.isNotAParticipant.includes(userId)) {
        return (
          <Button onClick={this.joinEventOnClick} >Join</Button>
        );
      } else {
        return (
          <Button onClick={this.unJoinEventOnClick} >Unjoin</Button>
        );
      }
    }
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
              <Grid item xs={12}>
                <Typography variant='h4' sx={{ textAlign: 'end' }}>
                  {this.isEventOwner()}
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

EventPage.contextType = AppContext;
