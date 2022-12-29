import React from 'react';
import ResponsiveAppBar from '../components/navbar';
import LandingPage from '../components/landingPage';

export default function Home(props) {
  return (
    <div>
      <ResponsiveAppBar />
      <LandingPage />
    </div>
  );
}
