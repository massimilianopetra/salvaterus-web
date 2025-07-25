'use client';

import { Box, Typography, Button} from '@mui/material';
import Link from 'next/link';


export default function Home() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Benvenuto in Salvaterus Web
      </Typography>
      <Button color="inherit" component={Link} href="/login">Login</Button>
    </Box>
  );
}
