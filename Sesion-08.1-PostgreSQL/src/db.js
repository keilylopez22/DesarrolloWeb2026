import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
    host:     process.env.DB_HOST     || 'localhost',
    port:     Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME     || 'alumnos_db',
    user:     process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
});

export async function inicializarDB() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS alumnos (
            id      SERIAL PRIMARY KEY,
            nombre  VARCHAR(100) NOT NULL,
            apellido VARCHAR(100) NOT NULL,
            email   VARCHAR(150) NOT NULL UNIQUE,
            edad    INTEGER
        )
    `);
}
