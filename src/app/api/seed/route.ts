import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function POST() {
  try {
    const client = await pool.connect();
    
    // Crea la tabella se non esiste
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        start TIMESTAMP NOT NULL,
        end TIMESTAMP NOT NULL,
        description TEXT,
        color VARCHAR(50),
        is_deadline BOOLEAN DEFAULT FALSE
      )
    `);
    
    // Inserisci dati di esempio (solo se la tabella è vuota)
    const { rows } = await client.query('SELECT COUNT(*) FROM events');
    if (parseInt(rows[0].count) === 0) {
      await client.query(`
        INSERT INTO events (title, start, end, description, color, is_deadline)
        VALUES
          ('Riunione team', '2023-10-15T09:00:00', '2023-10-15T10:30:00', 'Riunione settimanale del team', '#2196F3', false),
          ('Scadenza progetto', '2023-10-18T23:59:59', '2023-10-18T23:59:59', 'Consegna finale del progetto', '#F44336', true),
          ('Presentazione cliente', '2023-10-20T14:00:00', '2023-10-20T15:30:00', 'Demo prodotto per il cliente', '#4CAF50', false),
          ('Revisione codice', '2023-10-22T11:00:00', '2023-10-22T12:00:00', 'Code review con il team', '#FFC107', false)
      `);
    }
    
    client.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}