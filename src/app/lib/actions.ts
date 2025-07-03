'use server';

import { sql } from '@vercel/postgres';
import { Pool } from 'pg';
import { DbCalendarEvent } from '@/app/lib/definitions';




/* ******************** CONFIGURAZIONE CLIENT    ********************* */

const provider = process.env.DATABASE_PROVIDER; // "vercel" o "pg"
const pool = provider === 'pg' ? new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
}) : null;

console.log("*******************");
console.log(provider);

async function executeQuery<T>(query: string): Promise<T[] | undefined> {
  console.log(query);
  if (provider === 'pg') {
    if (!pool) {
      throw new Error('Pool non configurato per pg');
    }
    const client = await pool.connect();
    try {
      const res = await client.query(query);
      return res.rows;
    } finally {
      client.release();
    }
  } else {
    return (await sql.query(query)).rows;
  }
}


/* ************************ SEED DATABASE **************************** */

export async function destroyDatabase() {

  await executeQuery(`
    DROP TABLE IF EXISTS users;
   `);

   await executeQuery(`
    DROP TABLE IF EXISTS events;
   `);
}

export async function seedDatabase() : Promise<boolean> {

  await executeQuery(`
    CREATE TABLE IF NOT EXISTS users (
       id INTEGER PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email TEXT NOT NULL UNIQUE,
       password TEXT NOT NULL
     );
   `);

  await executeQuery(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      start TIMESTAMP NOT NULL,
      finish TIMESTAMP NOT NULL,
      description TEXT,
      color VARCHAR(50),
      is_deadline BOOLEAN DEFAULT FALSE
    );
  `);


  await executeQuery(`
    INSERT INTO events (title, start, finish, description, color, is_deadline)
    VALUES
      ('Visita Rosy Reumatologica', '2025-07-15T09:00:00', '2025-07-15T10:30:00', 'Visita Reumatologica Rosella', '#2196F3', false),
      ('Scadenza IMU', '2025-07-18T23:59:59', '2025-07-18T23:59:59', 'Scadenza IMU', '#FFC107', true),
      ('Esame Salvo', '2025-07-20T14:00:00', '2025-07-20T15:30:00', 'Esame Riparazione Salvo', '#4CAF50', false),
      ('Fatti miei', '2025-07-20T11:00:00', '2025-07-21T12:00:00', 'Mi faccio i fatti miei', '#FFC107', false);
  `);

  console.log("Database seeded");

  return true;
}


/* ************************ AUTHENTICATION **************************** */


/* ************************ GESTIONE DB **************************** */

export async function getCalendarEvents(): Promise<DbCalendarEvent[] | undefined> {
  try {
    const event = await executeQuery<DbCalendarEvent>(`SELECT * FROM events `);
    if (event)
      return event;
    else
      return undefined;
  } catch (error) {
    console.error('Failed to fetch CalendarEvents:', error);
    throw new Error('Failed to fetch CalendarEvents.');
  }
}