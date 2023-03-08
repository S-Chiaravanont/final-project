import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { GmapsSetUp } from '../components/gmapsSetUp';
import AppContext from '../lib/app-context';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default class EventPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: null,
      isOwner: false,
      eventId: null,
      participantId: null,
      joinStatus: false,
      newParticipant: false,
      comments: null
    };
    this.isEventOwner = this.isEventOwner.bind(this);
    this.eventEditOnClick = this.eventEditOnClick.bind(this);
    this.eventStatusUpdate = this.eventStatusUpdate.bind(this);
    this.addCommentOnClick = this.addCommentOnClick.bind(this);
    this.displayComment = this.displayComment.bind(this);
  }

  componentDidMount() {
    const { userId } = this.context.user;
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
            if (data.length < 1) {
              return null;
            } else {
              const id = data.map(user => user.userId);
              const statusKeyPairArray = data.map(({ userId, responseStatus }) => ({ [userId]: responseStatus }));
              const statusKeyPair = statusKeyPairArray.reduce((acc, cur) => Object.assign(acc, cur), {});
              if (!id.includes(userId)) {
                this.setState({ participantId: data, joinStatus: false, newParticipant: true });
              } else {
                this.setState({ participantId: data, joinStatus: statusKeyPair[userId] });
              }
            }
          });
      })
      .then(() => {
        fetch(`/api/event/${eventId}/comments`, req)
          .then(res => res.json())
          .then(data => {
            this.setState({ comments: data });
          });
      });
  }

  addCommentOnClick(e) {
    e.preventDefault();
    const comment = e.target.elements.commentbox.value;
    const { userId } = this.context.user;
    const { eventId } = this.state;
    const payload = { comment, userId };
    const jwt = window.localStorage.getItem('react-context-jwt');
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': jwt
      },
      body: JSON.stringify(payload)
    };
    fetch(`/api/event/${eventId}/comments`, req)
      .then(res => res.json())
      .then(data => {
        this.setState({ comments: data });
        e.target.elements.commentbox.value = '';
        return null;
      });
  }

  displayComment() {
    if (this.state.comments !== null) {
      const comments = this.state.comments;
      return comments.map((com, index) => {
        return (
          <Grid item xs={12} key={index}>
            <Typography sx={{ fontWeight: 'bold' }}>{com.fullName}</Typography>
            <Typography>{com.comment}</Typography>
          </Grid>
        );
      });
    } else {
      return null;
    }
  }

  eventEditOnClick() {
    const newHash = `#edit?eventId=${this.state.eventId}`;
    window.location.replace(newHash);
    return null;
  }

  eventStatusUpdate() {
    const { userId } = this.context.user;
    const { eventId } = this.state;
    const reqMethod = this.state.newParticipant === true ? 'POST' : 'PUT';
    const payload = { responseStatus: !this.state.joinStatus };
    const jwt = window.localStorage.getItem('react-context-jwt');
    const req = {
      method: reqMethod,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': jwt
      },
      body: JSON.stringify(payload)
    };
    fetch(`/api/event/${eventId}/join/${userId}`, req)
      .then(res => res.json())
      .then(data => {
        this.setState({ joinStatus: data.responseStatus, newParticipant: false });
        return null;
      });
  }

  isEventOwner() {
    if (!this.state.participantId) {
      return null;
    }
    if (this.state.isOwner) {
      return (
        <Button
          sx={{ color: '#f07167' }} onClick={this.eventEditOnClick} >Edit</Button>
      );
    } else {
      if (this.state.newParticipant) {
        return (
          <Button sx={{ color: '#f07167' }} onClick={this.eventStatusUpdate} >Join</Button>
        );
      } else {
        if (this.state.joinStatus) {
          return (
            <Button sx={{ color: '#f07167' }} onClick={this.eventStatusUpdate} >Unjoin</Button>
          );
        } else {
          return (
            <Button sx={{ color: '#f07167' }} onClick={this.eventStatusUpdate} >Join</Button>
          );
        }

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
                  {eventName}
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
                  Sport:
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(255,250,255)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {sport}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Participants (Maximum):
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(240,240,240)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {participant}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Date:
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(255,250,255)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {date}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Time:
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(240,240,240)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {time}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Notes:
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(255,250,255)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {note}
                </Typography>
              </Grid>
              <GmapsSetUp location={location} lat={lat} lng={lng} />
              <hr />
              <Grid item xs={12}>
                <Typography variant='h6' sx={{ textAlign: 'end' }}>
                  Comments:
                </Typography>
              </Grid>
              { this.displayComment() }
              <form onSubmit={this.addCommentOnClick} style={{ width: '100%', display: 'flex' }}>
                <Grid item xs={10}>
                  <TextField
                  multiline
                  fullWidth
                  id='commentbox'
                  rows={3}
                  variant='filled'
                  required
                  placeholder='Add comment here...'
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                  variant='outlined'
                  sx={{ height: '50%', width: '100%', color: '#f07167' }}
                  type='submit'
                  >Add</Button>
                </Grid>
              </form>
            </Grid>
          </Box>
        </Box>
      );
    }
  }
}

EventPage.contextType = AppContext;
