import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import AlertTitle from '@mui/material/AlertTitle';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      alert: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.UnsuccessAlerts = this.UnsuccessAlerts.bind(this);
    this.AlertOnClick = this.AlertOnClick.bind(this);
  }

  AlertOnClick(event) {
    this.setState({ alert: false });
  }

  UnsuccessAlerts() {
    if (this.state.alert) {
      return (
        <Box
        sx={{ width: '350px', mt: 8 }}>
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
              <AlertTitle>Error</AlertTitle>
              Invalid log in!
            </Alert>
          </Collapse>
        </Box>
      );
    } else {
      return null;
    }
  }

  onSubmit(event) {
    event.preventDefault();
    const username = event.target.elements[0].value;
    const password = event.target.elements[1].value;
    const payload = {
      username, password
    };
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };
    fetch('/api/auth/sign-in', req)
      .then(res => res.json())
      .then(result => {
        const { error } = result;
        if (error) {
          this.setState({ error: true, alert: true });
          return null;
        }
        this.context.handleSignIn(result);
      });
  }

  render() {
    if (this.context.user) return <Redirect to="home" />;
    return (
      <Box width='400px' height='400px'
        sx={{ boxShadow: 4, ml: 'auto', mr: 'auto', p: 3, mt: '5%' }}>
        <Typography variant='h4' sx={{ mt: 1, mb: 2 }}>
          Sign in
        </Typography>
        <Typography color='gray'>
          New user? <Link href="#sign-up" underline='hover' >Create an account</Link>
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Username:
        </Typography>
        <form onSubmit={this.onSubmit}>
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
            type="password"
            autoComplete="current-password"
            variant="filled"
            fullWidth
            />
          </Box>
          <Button type='submit' variant='contained' fullWidth height='30px' sx={{ mt: 2 }}>
            Log in
          </Button>
        </form>
        {this.UnsuccessAlerts()}
      </Box>
    );
  }
}
LoginPage.contextType = AppContext;
