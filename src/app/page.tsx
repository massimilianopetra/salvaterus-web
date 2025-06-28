'use client';

import { Box, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Benvenuto in Salvaterus Web
      </Typography>
      <Typography gutterBottom>
        Questa è la homepage per la gestione delle attività familiari.
      </Typography>
    </Box>
  );
}
