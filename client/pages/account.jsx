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
import Modal from '@mui/material/Modal';

export default class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      edit: false,
      open: false,
      value: null,
      alert: false,
      alertPassword: false,
      newPass: '',
      rNewPass: '',
      oldPass: '',
      changePasswordSuccess: false
    };
    this.AlertOnClick = this.AlertOnClick.bind(this);
    this.UnsuccessAlerts = this.UnsuccessAlerts.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.accountEditOnClick = this.accountEditOnClick.bind(this);
    this.cancelOnClick = this.cancelOnClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.confirmPassword = this.confirmPassword.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onChangeNP = this.onChangeNP.bind(this);
    this.onChangeRNP = this.onChangeRNP.bind(this);
    this.onChangeOP = this.onChangeOP.bind(this);
    this.passwordCheck = this.passwordCheck.bind(this);
    this.changePasswordSuccessHandle = this.changePasswordSuccessHandle.bind(this);
    this.style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      borderRadius: '5px',
      boxShadow: 24,
      p: 4
    };
  }

  passwordCheck() {
    if (this.state.alertPassword) {
      return (
        <Typography color='red'>Incorrect Password</Typography>
      );
    } else {
      return null;
    }
  }

  changePasswordSuccessHandle() {
    if (this.state.changePasswordSuccess) {
      return (
        <Box
          sx={{ width: '100%' }}>
          <Collapse in={true}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    this.setState({ changePasswordSuccess: false });
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              Password Changed successfully!
            </Alert>
          </Collapse>
        </Box>
      );
    }
  }

  onChangeNP(event) {
    this.setState({ newPass: event.target.value });
  }

  onChangeRNP(event) {
    this.setState({ rNewPass: event.target.value });
  }

  onChangeOP(event) {
    this.setState({ oldPass: event.target.value });
  }

  isMatch() {
    const { newPass, rNewPass } = this.state;
    if (newPass !== rNewPass) {
      return (
        <Typography color='red'>* Not Matching</Typography>
      );
    } else {
      return null;
    }
  }

  onSave(event) {
    event.preventDefault();
    const fullName = event.target.elements.fullName.value;
    const userName = event.target.elements.userName.value;
    const gender = event.target.elements[3].checked ? event.target.elements[3].value : event.target.elements[4].value;
    const DOB = event.target.elements[5].value;
    const preference = event.target.elements.preference.value;
    const payload = { fullName, userName, gender, DOB, preference };
    const { userId } = this.context.user;
    const jwt = window.localStorage.getItem('react-context-jwt');
    const req = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': jwt
      },
      body: JSON.stringify(payload)
    };
    fetch(`/api/account/edit/${userId}`, req)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          this.setState({ alert: true });
          return null;
        }
        const { user, token } = data;
        window.localStorage.removeItem('react-context-jwt');
        window.localStorage.setItem('react-context-jwt', token);
        this.setState({ edit: false, user });
      });
    return null;
  }

  confirmPassword() {
    const { newPass, rNewPass, oldPass } = this.state;
    if (newPass !== rNewPass) {
      return null;
    }
    const { userId } = this.context.user;
    const payload = { newPass, oldPass };
    const jwt = window.localStorage.getItem('react-context-jwt');
    const req = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': jwt
      },
      body: JSON.stringify(payload)
    };
    fetch(`/api/password/change/${userId}`, req)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          this.setState({ alertPassword: true });
          return null;
        }
        this.handleClose();
        this.setState({ changePasswordSuccess: true });
        return null;
      });
  }

  handleClose() {
    this.setState({ open: false, newPass: '', oldPass: '', rNewPass: '', alertPassword: false });
  }

  handleOpen() {
    this.setState({ open: true });
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
        const dob = data[0].yearOfBirth;
        this.setState({ user: data[0], value: dob });
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
                  {this.UnsuccessAlerts()}
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ mt: 1 }}>
                    Password:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Button onClick={this.handleOpen}>Change Password</Button>
                  {this.changePasswordSuccessHandle()}
                  <Modal
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={this.style}>
                      <Typography>
                        Current Password:
                      </Typography>
                      {this.passwordCheck()}
                      <TextField
                        required
                        size='small'
                        name='oldPassword'
                        type='password'
                        variant="filled"
                        value={this.state.oldPass}
                        onChange={this.onChangeOP}
                        fullWidth
                      />
                      <Typography>
                        New Password:
                      </Typography>
                      <TextField
                        required
                        size='small'
                        name='newPassword'
                        type='password'
                        variant="filled"
                        value={this.state.newPass}
                        onChange={this.onChangeNP}
                        fullWidth
                      />
                      <Typography>
                        Confirm New Password:
                      </Typography>
                      {this.isMatch()}
                      <TextField
                        required
                        size='small'
                        name='repeatNewPassword'
                        type='password'
                        variant="filled"
                        value={this.state.rNewPass}
                        onChange={this.onChangeRNP}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <Button onClick={this.confirmPassword} sx={{ ml: 5, mr: 12 }} >Confirm</Button>
                      <Button onClick={this.handleClose}>Cancel</Button>
                    </Box>
                  </Modal>
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
                    Sport Preference:
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
