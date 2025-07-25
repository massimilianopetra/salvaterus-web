'use client';

import { useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { seedDatabase, destroyDatabase } from '@/app/lib/actions';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSeedDatabase = async () => {
    setLoading(true);
    setSuccess(false);
    setError('');
    
    try {
      const response = await seedDatabase();
      
      if (!response) {
        throw new Error('Errore durante il seeding del database');
      }
      
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  const handleDestroyDatabase = async () => {
    setLoading(true);
    setSuccess(false);
    setError('');
    
    try {
      await destroyDatabase();
      
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      p: 4,
      minHeight: '100vh',
      bgcolor: 'background.default',
      color: 'text.primary',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Typography variant="h4" gutterBottom>
        Seeding del Database
      </Typography>
      
      <Typography sx={{ mb: 3 }}>
        Questo pulsante creerà la tabelle degli eventi e inserirà alcuni dati di esempio.
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={handleSeedDatabase}
        disabled={loading}
      >
        {loading ? 'Elaborazione...' : 'Esegui Seeding'}
      </Button>

      &nbsp;

      <Typography sx={{ mb: 3 }}>
        Questo pulsante cancellerà il database.
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={handleDestroyDatabase}
        disabled={loading}
      >
        {loading ? 'Elaborazione...' : 'Esegui Cancellazione'}
      </Button>
      
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Operazione su db effettuata con successo!
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}