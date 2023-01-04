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

export default class CreateEventPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: dayjs(),
      sport: null
    };
    this.onCreateEvent = this.onCreateEvent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sportHandleChange = this.sportHandleChange.bind(this);
  }

  onCreateEvent(event) {
    return null;
  }

  handleChange(event) {
    this.setState({ value: dayjs(event) });
  }

  sportHandleChange(event) {
    this.setState({ sport: event.target.value });
  }

  render() {
    if (!this.context.user) {
      return <Redirect to="home" />;
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
                  <Typography sx={{ mt: 2 }}>
                    Event Name:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                 required
                 id="filled-required"
                 variant="filled"
                 fullWidth
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
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={this.state.sport}
                      onChange={this.sportHandleChange}
                      label="Sport"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value='Soccer'>Soccer</MenuItem>
                      <MenuItem value='Basketball'>Basketball</MenuItem>
                      <MenuItem value='Laser tage'>Laser Tag</MenuItem>
                    </Select>
                  </FormControl>
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
                    Location:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    required
                    id="filled-required"
                    variant="filled"
                    fullWidth
                  />
                </Grid>
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
