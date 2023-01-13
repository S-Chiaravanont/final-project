/* eslint-disable camelcase */
/* eslint-disable no-undef */
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { GoogleMap, useLoadScript, Marker, MarkerF } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

export function GmapsSetUp(props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });
  if (!isLoaded) return <div>Loading...</div>;
  if (Object.keys(props).length < 1) {
    return <Map />;
  } else if (props.search) {
    return <SearchAutocomplete />;
  } else if (props.markers) {
    const { markers, center, radius } = props;
    return <SearchPageMap markers={markers} center={center} radius={radius} />;
  } else {
    const { location, lat, lng } = props;
    return <DisplayMap location={location} lat={lat} lng={lng} />;
  }
}

function Map() {
  const [selected, setSelected] = useState({ lat: 34.0522342, lng: -118.2436849 });

  return (
    <>
      <Grid item xs={4}>
        <Typography sx={{ mt: 1 }}>
          Location:
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <PlacesAutocomplete setSelected={setSelected} />
        <TextField
                 id="filled-required"
                 variant="filled"
                 fullWidth
                 sx={{ display: 'none' }}
                 value={selected.lat}
                 />
        <TextField
                 id="filled-required"
                 variant="filled"
                 fullWidth
                 sx={{ display: 'none' }}
                 value={selected.lng}
                 />
      </Grid>
      <Grid item xs={12}>
        <GoogleMap
          zoom={14}
          center={selected}
          mapContainerClassName="map-container">
          {selected && <Marker position={selected} />}
        </GoogleMap>
      </Grid>
    </>
  );
}

const PlacesAutocomplete = ({ setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'us' }
    },
    debounce: 300
  });

  const handleSelect = ({ description }) =>
    () => {
      setValue(description, false);
      clearSuggestions();

      getGeocode({ address: description }).then(results => {
        const { lat, lng } = getLatLng(results[0]);
        setSelected({ lat, lng });
      });
    };

  const handleInput = e => {
    setValue(e.target.value);
  };

  const renderSuggestions = () =>
    data.map(suggestion => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text }
      } = suggestion;

      return (
        <ListItem key={place_id} onClick={handleSelect(suggestion)}>
          <ListItemButton>
            <ListItemText>
              <strong>{main_text}</strong> <small>{secondary_text}</small>
            </ListItemText>
          </ListItemButton>
        </ListItem>
      );
    });

  return (
    <div onSelect={handleSelect}>
      <TextField
        required
        variant="filled"
        fullWidth
        value={value}
        disabled={!ready}
        onChange={handleInput}
        placeholder='Search address...'
      />
      {status === 'OK' &&
        <List sx={{ position: 'absolute', zIndex: '5', bgcolor: 'white', border: '1px solid black' }}>{renderSuggestions()}</List>}
    </div>
  );
};

function DisplayMap(props) {
  const lat = Number(props.lat);
  const lng = Number(props.lng);
  const center = { lat, lng };
  return (
    <>
      <Grid item xs={4}>
        <Typography sx={{ mt: 1 }}>
          Location:
        </Typography>
      </Grid>
      <Grid item xs={8} bgcolor='rgb(255,250,255)' borderRadius='2px' borderBottom='1px solid black'>
        <Typography sx={{ mt: 1 }}>
          {props.location}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <GoogleMap
          zoom={14}
          center={center}
          mapContainerClassName="map-container">
          <Marker position={center} />
        </GoogleMap>
      </Grid>
    </>
  );
}

function SearchAutocomplete() {
  const [selected, setSelected] = useState({ lat: 34.0522342, lng: -118.2436849 });
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'us' },
      setTypes: '(cities)'
    },
    debounce: 300
  });

  const handleSelect = ({ description }) =>
    () => {
      setValue(description, false);
      clearSuggestions();

      getGeocode({ address: description }).then(results => {
        const { lat, lng } = getLatLng(results[0]);
        setSelected({ lat, lng });
      });
    };

  const handleInput = e => {
    setValue(e.target.value);
  };

  const renderSuggestions = () =>
    data.map(suggestion => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text }
      } = suggestion;

      return (
        <ListItem key={place_id} onClick={handleSelect(suggestion)}>
          <ListItemButton>
            <ListItemText>
              <strong>{main_text}</strong> <small>{secondary_text}</small>
            </ListItemText>
          </ListItemButton>
        </ListItem>
      );
    });

  return (
    <div onSelect={handleSelect}>
      <TextField
        id="lat"
        variant="filled"
        fullWidth
        sx={{ display: 'none' }}
        value={selected.lat}
      />
      <TextField
        id="lng"
        variant="filled"
        fullWidth
        sx={{ display: 'none' }}
        value={selected.lng}
      />
      <TextField
        required
        variant="filled"
        fullWidth
        value={value}
        disabled={!ready}
        onChange={handleInput}
        placeholder='Search address...'
        sx={{ position: 'relative' }}
      />
      {status === 'OK' &&
        <List sx={{ position: 'absolute', zIndex: '5', bgcolor: 'white', border: '1px solid black' }}>{renderSuggestions()}</List>}
    </div>
  );
}

function SearchPageMap(props) {
  const { markers, center, radius } = props;
  let zoom;
  if (parseInt(radius) === 5) {
    zoom = 13;
  } else if (parseInt(radius) === 10) {
    zoom = 11;
  } else if (parseInt(radius) === 25) {
    zoom = 10;
  } else {
    zoom = 9;
  }
  const quantity = markers.length > 0;
  if (quantity) {
    return (
      <Grid item xs={12}>
        <GoogleMap
          zoom={zoom}
          center={center}
          mapContainerClassName="search-map-container">
          {markers.map(marker => <MarkerF key={marker.lat} position={marker} />)}
        </GoogleMap>
      </Grid>
    );
  } else {
    return (
      <Grid item xs={12}>
        <GoogleMap
          zoom={zoom}
          center={center}
          mapContainerClassName="search-map-container" />
      </Grid>
    );
  }
}
