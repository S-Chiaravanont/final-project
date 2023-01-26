import React from 'react';
import dayjs from 'dayjs';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { GmapsSetUp } from '../components/gmapsSetUp';

export default class CreateEventPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: dayjs(),
      sport: ''
    };
    this.onCreateEvent = this.onCreateEvent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sportHandleChange = this.sportHandleChange.bind(this);
    this.renderMap = this.renderMap.bind(this);
  }

  onCreateEvent(event) {
    event.preventDefault();
    const host = this.context.user.userId;
    const eventName = event.target.elements[0].value;
    const sport = event.target.elements[1].value;
    const participant = event.target.elements[2].value;
    const date = event.target.elements[3].value;
    const time = event.target.elements[6].value;
    const note = event.target.elements[9].value;
    const location = event.target.elements[11].value;
    const lat = event.target.elements[12].value;
    const lng = event.target.elements[13].value;
    const payload = {
      host, eventName, sport, participant, date, time, note, location, lat, lng
    };
    const jwt = window.localStorage.getItem('react-context-jwt');
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': jwt
      },
      body: JSON.stringify(payload)
    };
    fetch(`/api/createEvent/${host}`, req)
      .then(res => res.json())
      .then(data => {
        const { error } = data;
        if (error) {
          // eslint-disable-next-line no-console
          console.log(error);
          return null;
        }
        window.location.replace('#home');
        return null;
      });
  }

  handleChange(event) {
    this.setState({ value: dayjs(event) });
  }

  sportHandleChange(event) {
    const selectedSport = event.target.value;
    this.setState({ sport: selectedSport });
  }

  renderMap(Status) {
    return <h1>{Status}</h1>;
  }

  render() {
    if (!this.context.user) {
      return <Redirect to="#home" />;
    } else {
      return (
        <form onSubmit={this.onCreateEvent}>
          <Box maxWidth='md' margin='auto'>
            <Box sx={{ flexGrow: 1, p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='h4' sx={{ mt: 1, mb: 2 }}>
                    Create Event
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ mt: 2 }}>
                    Host:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography sx={{ mt: 2 }}>
                    {this.context.user.fullName}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ mt: 1 }}>
                    Event Name:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                 required
                 id="filled-required"
                 variant="filled"
                 fullWidth
                 placeholder='Name your event'
                 />
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ mt: 1 }}>
                    Sport:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="select-sport-label">Sport</InputLabel>
                    <Select
                      required
                      labelId="Sport-select-label"
                      id="select-standard"
                      value={this.state.sport}
                      onChange={this.sportHandleChange}
                      label="Sport"
                      defaultValue=""
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value='Badminton'>Badminton</MenuItem>
                      <MenuItem value='Basketball'>Basketball</MenuItem>
                      <MenuItem value='Bowling'>Bowling</MenuItem>
                      <MenuItem value='Climbing'>Climbing</MenuItem>
                      <MenuItem value='Cycling'>Cycling</MenuItem>
                      <MenuItem value='Football'>Football</MenuItem>
                      <MenuItem value='Golf'>Golf</MenuItem>
                      <MenuItem value='Ice skating'>Ice skating</MenuItem>
                      <MenuItem value='Laser tag'>Laser Tag</MenuItem>
                      <MenuItem value='Ping pong'>Ping pong</MenuItem>
                      <MenuItem value='Soccer'>Soccer</MenuItem>
                      <MenuItem value='Swimming'>Swimming</MenuItem>
                      <MenuItem value='Tennis'>Tennis</MenuItem>
                      <MenuItem value='Volleyball'>Volleyball</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ mt: 1 }}>
                    Participants (Maximum):
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    required
                    id="filled-required"
                    variant="filled"
                    type='number'
                    inputProps={{ min: 1, max: 100, step: 1 }}
                    defaultValue='1'
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ mt: 1 }}>
                    Date:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      inputFormat="MM/DD/YYYY"
                      value={this.state.value}
                      onChange={this.handleChange}
                      renderInput={params => <TextField {...params} />}
                  />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ mt: 1 }}>
                    Time:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      value={this.state.value}
                      onChange={this.handleChange}
                      renderInput={params => <TextField {...params} />}
                      />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ mt: 1 }}>
                    Notes:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    required
                    id="filled-required"
                    variant="filled"
                    placeholder='Additional notes...'
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>
                <GmapsSetUp />
                <hr />
                <Grid item xs={12}>
                  <Button type='submit' variant='contained' fullWidth height='30px' sx={{ mt: 2 }}>
                    Create Event
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </form>
      );
    }
  }
}

CreateEventPage.contextType = AppContext;
