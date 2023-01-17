import React from 'react';
import AppContext from '../lib/app-context';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

export default class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      edit: false
    };
    this.AlertOnClick = this.AlertOnClick.bind(this);
    this.UnsuccessAlerts = this.UnsuccessAlerts.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.accountEditOnClick = this.accountEditOnClick.bind(this);
    this.cancelOnClick = this.cancelOnClick.bind(this);
  }

  cancelOnClick() {
    this.setState({ edit: false });
  }

  accountEditOnClick() {
    this.setState({ edit: true });
  }

  AlertOnClick(event) {
    this.setState({ alert: false });
  }

  UnsuccessAlerts() {
    if (this.state.alert) {
      return (
        <Box
          sx={{ width: '350px', mt: 1, mb: 1 }}>
          <Collapse in={this.state.alert}>
            <Alert
              severity='error'
              variant="filled"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={this.AlertOnClick}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              Username unavailable
            </Alert>
          </Collapse>
        </Box>
      );
    } else {
      return null;
    }
  }

  handleChange(event) {
    this.setState({ value: dayjs(event) });
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
    fetch(`/api/user/account/${userId}`, req)
      .then(res => res.json())
      .then(data => {
        this.setState({ user: data[0] });
      });
  }

  render() {
    if (!this.state.user) {
      return null;
    }
    const { fullName, gender, yearOfBirth, preference, userName } = this.state.user;
    if (!this.state.edit) {
      return (
        <Box maxWidth='md' margin='auto'>
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant='h4' sx={{ mt: 1, mb: 2 }}>
                  Account Information
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h4' sx={{ textAlign: 'end' }}>
                  <Button onClick={this.accountEditOnClick} >Edit</Button>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Name:
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(240,240,240)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {fullName}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Username:
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(240,240,240)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {userName}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Password:
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(240,240,240)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  *********
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Gender:
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(240,240,240)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {gender}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Birthday:
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(240,240,240)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {yearOfBirth}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ mt: 1 }}>
                  Preference:
                </Typography>
              </Grid>
              <Grid item xs={8} bgcolor='rgb(240,240,240)' borderRadius='2px' borderBottom='1px solid black'>
                <Typography sx={{ mt: 1 }}>
                  {preference}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      );
    } else {
      return (
        <form onSubmit={this.onSave}>
          <Box maxWidth='md' margin='auto'>
            <Box sx={{ flexGrow: 1, p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='h4' sx={{ mt: 1, mb: 2 }}>
                    Edit Account Information
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ mt: 1 }}>
                    Name:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    required
                    name='fullName'
                    variant="filled"
                    fullWidth
                    defaultValue={fullName}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ mt: 1 }}>
                    Username:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    required
                    name='userName'
                    variant="filled"
                    fullWidth
                    defaultValue={userName}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ mt: 1 }}>
                    Password:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Button onClick={this.confirmPassword}>Change Password</Button>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ mt: 1 }}>
                    Gender:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <FormControl>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        defaultValue={gender}
                      >
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ mt: 1 }}>
                    Birthday:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      label="Date of Birth"
                      inputFormat="MM/DD/YYYY"
                      value={this.state.value}
                      onChange={this.handleChange}
                      renderInput={params => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ mt: 1 }}>
                    Preference:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    required
                    name='preference'
                    variant="filled"
                    fullWidth
                    defaultValue={preference}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Button type='submit' variant='contained' fullWidth height='30px' sx={{ mt: 2, bgcolor: 'rgb(1, 112, 117)' }}>
                  SAVE
                </Button>
                <Button onClick={this.cancelOnClick} variant='contained' fullWidth height='30px' sx={{ mt: 2, bgcolor: 'rgb(132, 132, 132)' }}>
                  CANCEL
                </Button>
              </Grid>
            </Box>
          </Box>
        </form >
      );
    }
  }
}
AccountPage.contextType = AppContext;
