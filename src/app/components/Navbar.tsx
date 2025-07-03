'use client';

import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import ThemeToggle from '@/app/components/ThemeToggle';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const cookies = Object.fromEntries(
      document.cookie
        .split('; ')
        .map(c => {
          const [k, v] = c.split('=');
          return [k, decodeURIComponent(v)];
        })
    );

    console.log('🍪 Cookie letti:', cookies);

    // Assicurati che username e auth siano presenti
    if (cookies.auth === 'true' && cookies.username) {
      setUsername(cookies.username);
    } else {
      setUsername(null);
    }
  }, []);

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between">
        <Box className="flex items-center space-x-4">
          <Typography variant="h6">Salvaterus Web</Typography>
          <Button color="inherit" component={Link} href="/">Home</Button>
          <Button color="inherit" component={Link} href="/calendario">Calendario</Button>
        </Box>
        <Box className="flex items-center space-x-4">
          {username ? (
            <>
              <Typography variant="body1">Ciao, <strong>{username}</strong></Typography>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Button color="inherit" component={Link} href="/login">Login</Button>
          )}
          <ThemeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
