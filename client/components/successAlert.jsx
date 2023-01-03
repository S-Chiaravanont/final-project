import React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

export default function UnsuccessAlerts() {
  const [open, setOpen] = React.useState(true);

  return (
    <Box
      position='absolute'
      bottom='10%'
      right='10%'
      sx={{ width: '30%' }}>
      <Collapse in={open}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Logged in!
        </Alert>
      </Collapse>
    </Box>
  );
}
