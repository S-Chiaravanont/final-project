import React from 'react';
import latLngConversion from '../components/latLngConverter';
import { GmapsSetUp } from '../components/gmapsSetUp';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: null,
      city: null,
      radius: null,
      searchBar: 'none',
      searchRadius: '5',
      sport: ''
    };
    this.searchButtonClick = this.searchButtonClick.bind(this);
    this.sportHandleChange = this.sportHandleChange.bind(this);
    this.radiusHandleChange = this.radiusHandleChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  searchButtonClick() {
    this.state.searchBar === 'none' ? this.setState({ searchBar: 'flex' }) : this.setState({ searchBar: 'none' });
  }

  sportHandleChange(event) {
    const selectedSport = event.target.value;
    this.setState({ sport: selectedSport });
  }

  radiusHandleChange(event) {
    const selectedRadius = event.target.value;
    this.setState({ searchRadius: selectedRadius });
  }

  onSearch(event) {
    event.preventDefault();
    const sport = event.target.elements[0].value;
    const lat = event.target.elements[1].value;
    const lng = event.target.elements[2].value;
    const city = event.target.elements[3].value;
    const radius = event.target.elements[4].value;
    const newHash = `#search?sport=${sport}&city=${city}&lat=${lat}&lng=${lng}&radius=${radius}`;
    this.setState({
      events: null,
      city: null,
      radius: null,
      searchBar: 'none',
      searchRadius: '5',
      sport: ''
    });
    window.location.replace(newHash);
  }

  componentDidMount() {
    const { sport, lat, lng, radius } = this.props;
    const latLng = { lat, lng };
    const latLngLimit = latLngConversion(latLng, radius);
    const payload = { sport, latLngLimit };
    const jwt = window.localStorage.getItem('react-context-jwt');
    const city = {
      lat: parseFloat(latLng.lat),
      lng: parseFloat(latLng.lng)
    };
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': jwt
      },
      body: JSON.stringify(payload)
    };
    fetch('/api/search/', req)
      .then(res => res.json())
      .then(data => {
        this.setState({ events: data, city, radius });
      });
  }

  render() {
    if (!this.state.events) {
      return null;
    } else {
      const markerLatLng = this.state.events.map(({ lat, lng }) => [{ lat: parseFloat(lat), lng: parseFloat(lng) }]);
      const { city, radius, events, searchBar } = this.state;
      return (
        <Box maxWidth='md' margin='auto' padding='30px'>
          <Typography variant='h4' marginBottom='10px'>
            Search Result:
          </Typography>
          <GmapsSetUp markers={markerLatLng} center={city} radius={radius}/>

          {/* <Box sx={{ height: '600px', width: '100%', border: '1px solid black' }} /> */}

          <Box marginBottom='30px' display='flex' justifyContent='space-evenly'
            sx={{ flexGrow: 1, display: 'flex', mt: 2 }}>
            <Button variant='contained' color='error' size='medium' sx={{ flexGrow: 0.1 }}
              onClick={this.searchButtonClick}>
              NEW SEARCH
            </Button>
          </Box>
          <Box sx={{ mb: 1 }} display={searchBar} bgcolor='rgba(150,150,150,0.3)' height='280px' padding='20px'>
            <form onSubmit={this.onSearch}>
              <Box maxWidth='md' margin='auto'>
                <Box sx={{ flexGrow: 1, p: 1 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant='h6'>
                        Search Event:
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography>
                        Sport:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl variant="standard" sx={{ minWidth: 120 }}>
                        <Select
                          required
                          labelId="Sport-select-label"
                          id="select-standard"
                          value={this.state.sport}
                          onChange={this.sportHandleChange}
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
                          <MenuItem value='Laser tage'>Laser Tag</MenuItem>
                          <MenuItem value='Ping pong'>Ping pong</MenuItem>
                          <MenuItem value='Soccer'>Soccer</MenuItem>
                          <MenuItem value='Swimming'>Swimming</MenuItem>
                          <MenuItem value='Tennis'>Tennis</MenuItem>
                          <MenuItem value='Volleyball'>Volleyball</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography>
                        City:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <GmapsSetUp search={true} />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography>
                        Search Radius:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl variant="standard" sx={{ minWidth: 120 }}>
                        <Select
                          required
                          labelId="Radius-select-label"
                          id="select-standard"
                          value={this.state.searchRadius}
                          onChange={this.radiusHandleChange}
                          defaultValue="5"
                        >
                          <MenuItem value='5'>5 miles</MenuItem>
                          <MenuItem value='10'>10 miles</MenuItem>
                          <MenuItem value='25'>25 miles</MenuItem>
                          <MenuItem value='50'>50 miles</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button type='submit' variant='contained' fullWidth height='30px' sx={{ mt: 2 }}>
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </form>
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
                      Page: <a href={`#events?eventId=${event.eventId}`}>Event Link Here</a> <br />
                      Event: {event.eventName} <br />
                      Date: {event.date} <br />
                      Time: {event.time} <br />
                      Location: {event.location} <br />
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
