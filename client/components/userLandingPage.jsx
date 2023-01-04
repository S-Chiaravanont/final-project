import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AppContext from '../lib/app-context';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

export default class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: null
    };
  }

  componentDidMount(props) {
    const { userId } = this.context.user;
    fetch(`/api/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ events: data });
      });
  }

  render() {
    const { fullName } = this.context.user;
    if (!this.state.events) {
      return null;
    } else {
      const events = this.state.events;
      return (
        <Box maxWidth="md" padding='44px' margin='auto'>
          <Typography variant='h5' marginBottom='30px'>
            `Hello, { fullName }!`
          </Typography>
          <Box marginBottom='30px' display='flex' justifyContent='space-evenly'
          sx={{ flexGrow: 1, display: 'flex' }}>
            <Button variant='contained' color='error' size='medium' sx={{ flexGrow: 0.1 }}>
              SEARCH
            </Button>
            <Button variant='contained' size='medium' href='#createEvent'
            color='error' sx={{ flexGrow: 0.1 }}>
              CREATE
            </Button>
          </Box>

          <Box
          backgroundColor='rgb(1, 112, 117)' height='4rem'
          borderRadius='5px' display='flex' alignItems='center'
          padding='10px' sx={{ flexGrow: 1 }}>
            <EventAvailableIcon fontSize='large' sx={{ color: 'white', mr: 1 }} />
            <Typography color='white'>Upcoming Events</Typography>
          </Box>
          {
          events.map((event, index) => {
            return (
              <Accordion key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Event #{Number(index) + 1}</Typography>
                  <Typography>{event.sport}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <hr />
                  <Typography>
                    Page: Event Link Here <br />
                    Event: {event.eventName} <br />
                    Date: {event.date} <br />
                    Time: {event.time} <br />
                    Location: TBD <br />
                    Map: map_placeholder
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })
        }
        </Box>
      );
    }
  }
}

LandingPage.contextType = AppContext;
