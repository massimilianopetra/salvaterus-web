// src/app/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import ThemeToggle from '@/app/components/ThemeToggle'


export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Salvaterus Web
        </Typography>
        <Button color="inherit" component={Link} href="/">Home</Button>
        <Button color="inherit" component={Link} href="/calendario">Calendario</Button>
        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
}
