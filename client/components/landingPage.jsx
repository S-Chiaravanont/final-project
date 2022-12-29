import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function LandingPage() {
  return (
    <Box
      maxWidth="md"
      padding='44px'
      margin='auto'>
      <Typography
        variant='h5'
        marginBottom='30px'>
        Hello, User!
      </Typography>
      <Box
      marginBottom='30px'
      display='flex'
      justifyContent='space-evenly'
      sx={{ flexGrow: 1, display: 'flex' }}>
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
        alignItems='center'
        padding='10px'
        sx={{ flexGrow: 1 }}>
        <EventAvailableIcon fontSize='large' sx={{ color: 'white', mr: 1 }} />
        <Typography color='white'>Upcoming Events</Typography>
      </Box>
      <Box
      borderBottom='1px solid gray'
      borderRight='1px solid gray'
      borderLeft='1px solid gray'
      height='4rem'
      borderRadius='5px'
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      padding='10px'
      sx={{ flexGrow: 1 }}>
        <Typography>
          Event #1
        </Typography>
        <Typography>
          Sport
        </Typography>
        <ExpandMoreIcon />
      </Box>
    </Box>
  );
}
