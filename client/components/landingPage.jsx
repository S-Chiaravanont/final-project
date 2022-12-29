import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

export default function LandingPage() {
  return (
    <Box
      maxWidth="md"
      padding='44px'
      margin='auto'
    >
      <Typography
        variant='h5'
        marginBottom='30px'
      >
        Hello, User!
      </Typography>
      <Box
      marginBottom='30px'
      display='flex'
      justifyContent='space-evenly'
      sx={{ flexGrow: 1, display: 'flex' }}
    >
        <Button variant='contained' color='error' size='medium' sx={{ flexGrow: 0.1 }}>
          SEARCH
        </Button>
        <Button variant='contained' size='medium' color='error' sx={{ flexGrow: 0.1 }}>
          CREATE
        </Button>
      </Box>

      <Box
        backgroundColor='rgb(22,100,192)'
        height='4rem'
        borderRadius='5px'
        display='flex'
        sx={{ flexGrow: 1 }}>
        <EventAvailableIcon fontSize='large' sx={{ color: 'white', lineHeight: '4rem' }} />
        <Typography color='white' lineHeight='4rem'>Upcoming Events</Typography>
      </Box>
    </Box>
  );
}
