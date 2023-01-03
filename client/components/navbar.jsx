import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AppContext from '../lib/app-context';

function ResponsiveAppBar() {
  const user = useContext(AppContext).user;
  const { handleSignOut } = useContext(AppContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget);
  };

  function handleCloseNavMenu(event) {
    setAnchorElNav(null);
  }

  function isLoggedIn() {
    if (user) {
      return (
        <>
          <Box
            display='flex'
            justifyContent='flex-end'
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              href='#account'
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Account
            </Button>
            <Button
              onClick={handleSignOut}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Sign Out
            </Button>
          </Box>
          <Box display='flex'
            justifyContent='flex-end'
           sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              <MenuItem
              onClick={handleCloseNavMenu}>
                <Button
                  href='#account'>
                  Account
                </Button>
              </MenuItem>
              <MenuItem
                onClick={handleSignOut}>
                <Button>
                  Sign Out
                </Button>
              </MenuItem>
            </Menu>
          </Box>
        </>
      );
    } else {
      return (
        <Box
          display='flex'
          justifyContent='flex-end'
          sx={{ flexGrow: 1, display: 'flex' }}>
          <Button
              href='#log-in'
              sx={{ my: 2, color: 'white', display: 'block' }}>
            Sign In
          </Button>
        </Box>
      );
    }
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: 'rgba(255,122,122)' }}>
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#home"
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            PICKUP
          </Typography>
          {isLoggedIn()}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
