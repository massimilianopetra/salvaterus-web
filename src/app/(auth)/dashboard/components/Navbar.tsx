'use client';

import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeToggle from '@/app/(auth)/dashboard/components/ThemeToggle';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const cookies = Object.fromEntries(
      document.cookie
        .split('; ')
        .map(c => {
          const [k, v] = c.split('=');
          return [k, decodeURIComponent(v)];
        })
    );

    if (cookies.auth === 'true' && cookies.username) {
      setUsername(cookies.username);
    } else {
      setUsername(null);
    }
  }, []);

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  // Voci del menu
  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Calendario', href: '/dashboard/calendario' },
    ...(username === 'admin'
      ? [{ label: 'DbTools', href: '/dashboard/seed' }]
      : []),
  ];

  return (
    <>
      <AppBar position="static">
        <Toolbar className="flex justify-between">
          {/* Titolo e menu hamburger */}
          <Box className="flex items-center space-x-4">

            {/* Mostra bottoni solo su schermi medi e grandi */}
            <Box className="hidden sm:flex space-x-2">
              {menuItems.map(item => (
                <Button
                  key={item.href}
                  color="inherit"
                  component={Link}
                  href={item.href}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Bottone hamburger su mobile */}
            <Box className="sm:hidden">
              <IconButton color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Login/Logout + tema */}
          <Box className="flex items-center space-x-4">
            {username ? (
              <>
                <Typography variant="body1">
                  Ciao, <strong>{username}</strong>
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" component={Link} href="/login">
                Login
              </Button>
            )}
            <ThemeToggle />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer laterale per mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map(item => (
              <ListItem key={item.href} disablePadding>
                <ListItemButton component={Link} href={item.href}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
