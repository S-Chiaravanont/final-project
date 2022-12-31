import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
// import AppContext from '../lib/app-context';
import Container from '@mui/material/Container';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import LoginPage from './login';

export default class SignUpPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: dayjs('1999-08-18T21:11:54')
    };
    this.onRegister = this.onRegister.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: dayjs(event) });
  }

  onRegister(event) {
    event.preventDefault();
    const username = event.target.elements[0].value;
    const password = event.target.elements[1].value;
    const fullName = event.target.elements[2].value;
    const gender = event.target.elements[3].checked ? event.target.elements[3].value : event.target.elements[4].value;
    const DOB = event.target.elements[5].value;
    const payload = {
      username, password, fullName, gender, DOB
    };
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };
    fetch('/api/auth/sign-up', req)
      .then(res => res.json())
      .then(result => {
        const { error } = result;
        if (error) {
          // eslint-disable-next-line no-console
          console.log(error);
          return null;
        }
      });
  }

  render() {
    return (
      <Container maxWidth='md' sx={{ p: 3 }}>
        <Typography variant='h4' sx={{ mt: 1, mb: 2 }}>
          Sign up
        </Typography>
        <form onSubmit={this.onRegister}>
          <Typography sx={{ mt: 2 }}>
            Username:
          </Typography>
          <Box>
            <TextField
              required
              id="filled-required"
              variant="filled"
              fullWidth
            />
          </Box>
          <Typography sx={{ mt: 1 }}>
            Password:
          </Typography>
          <Box>
            <TextField
              required
              id="filled-password-input"
              variant="filled"
              fullWidth
            />
          </Box>
          <Typography sx={{ mt: 1 }}>
            Name:
          </Typography>
          <Box>
            <TextField
              required
              id="filled-password-input"
              variant="filled"
              fullWidth
            />
          </Box>
          <FormControl>
            <FormLabel sx={{ mt: 1 }} id="demo-row-radio-buttons-group-label">Gender</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue="male"
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>
          <Box sx={{ mt: 2, mb: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Date of Birth"
                inputFormat="MM/DD/YYYY"
                value={this.state.value}
                onChange={this.handleChange}
                renderInput={params => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
          <Button type='submit' variant='contained' fullWidth height='30px' sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Container>
    );
  }
}
