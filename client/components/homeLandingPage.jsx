import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import img from '../images/istockphoto.jpeg';

export default function HomeLandingPage() {
  return (
    <Container maxWidth="md">
      <Box>
        <Typography variant='h4' textAlign="center"
        sx={{ m: 3 }}>
          Looking for <br /> pick-up sports <br /> in your area?
        </Typography>
        <Box height='300px' textalign='center'
        sx={{ ml: 'auto', mr: 'auto', mb: 3, width: { xs: '90%', md: '500px' } }}>
          <Card>
            <CardMedia
            sx={{ height: 300 }}
            image={img} />
          </Card>
        </Box>
        <Box textAlign='center'>
          <Button variant='contained' size='medium' color='error'
            sx={{ width: '150px', m: 2 }}
            href='/#sign-up'>
            Sign Up
          </Button>
        </Box>
        <Box textAlign='center'>
          <Button variant='contained' size='medium' color='error'
          sx={{ width: '150px', m: 2 }}
          href='/#log-in'>
            Log In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
