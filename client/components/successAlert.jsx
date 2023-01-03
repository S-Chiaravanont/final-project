import React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Redirect from './redirect';

export default class SuccessAlerts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: false
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.setState({ message: true });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    if (this.state.message) {
      return <Redirect to="log-in" />;
    } else {
      return (
        <Box
      position='absolute'
      bottom='10%'
      right='10%'
      sx={{ width: '30%' }}>
          <Collapse in={true}>
            <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
              Account created successfully!
            </Alert>
          </Collapse>
        </Box>
      );
    }
  }
}
