/**
 * app.js — Servidor Express (API REST + sitio estático)
 * Tarea Sesión 7 · Desarrollo Web · UMG
 *
 * TODO: implementa los middlewares y las rutas marcadas.
 * Los tests de `tests/api.test.js` describen exactamente el contrato
 * que debe cumplir cada endpoint (son tu guía).
 */

import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// __dirname en ES Modules
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// ============================================================
// MIDDLEWARES
// ============================================================

/**
 * "Autenticación falsa": exige el header `x-api-key`.
 *
 * TODO:
 *   - Lee el header con req.get('x-api-key')
 *   - Compáralo con process.env.API_KEY (si no está definida usa 'umg-2026')
 *   - Si no coincide → res.status(401).json({ error: 'No autorizado' })
 *   - Si coincide    → next()
 *
 * @type {import('express').RequestHandler}
 */
export function autenticacionFalsa(req, res, next) {
    
    const apiKey = req.get('x-api-key') || '';
    const expectedApiKey = process.env.API_KEY || 'umg-2026';

    if (apiKey !== expectedApiKey) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    next(); // ← TODO: reemplazar por la validación del header
}

/**
 * Validación básica del cuerpo de un alumno.
 *
 * TODO: valida que
 *   - `nombre`, `apellido` y `email` sean strings no vacíos (trim)
 *   - `email` contenga '@'
 *   - `edad`, si viene, sea un número mayor o igual a 0
 *   Si algo falla responde 400 con { error: '<mensaje>' }.
 *   Si todo está bien, llama a next().
 *
 * @type {import('express').RequestHandler}
 */
export function validarAlumno(req, res, next) {
    
    const { nombre, apellido, email, edad } = req.body;
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre es requerido y debe ser un string no vacío' });
    }
    if (!apellido || typeof apellido !== 'string' || apellido.trim() === '') {
        return res.status(400).json({ error: 'El apellido es requerido y debe ser un string no vacío' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: 'El email es requerido y debe contener @' });
    }
    if (edad !== undefined && (typeof edad !== 'number' || edad < 0)) {
        return res.status(400).json({ error: 'La edad debe ser un número mayor o igual a 0' });
    }
    
    next(); // ← TODO: reemplazar por las validaciones
}

// ============================================================
// APP
// ============================================================

/**
 * Crea la app de Express con sus rutas.
 * Recibe el repositorio por parámetro (inyección de dependencias).
 *
 * @param {import('./repositorio.js').RepositorioAlumnos} repositorio
 * @returns {import('express').Express}
 */
export function crearApp(repositorio) {
    const app = express();

    // Middlewares base
    app.use(express.json());
    app.use(autenticacionFalsa);
 

    // Sitio web estático (public/index.html, styles.css, app.js)
    app.use(express.static(join(__dirname, '..', 'public')));

    // TODO: GET /alumnos → lista todos                    → 200 [ ...alumnos ]
    app.get('/alumnos', (req, res) => {
        const alumnos = repositorio.listar();
        res.status(200).json(alumnos)
    });

    // TODO: GET /alumnos/:id → uno o 404
    app.get('/alumnos/:id', (req, res) => {
        const alumno = repositorio.obtener(req.params.id);
        return alumno 
            ? res.status(200).json(alumno)
            : res.status(404).json({ error: 'Alumno no encontrado' })
    });

    // TODO: POST /alumnos → crear (requiere autenticacionFalsa + validarAlumno) → 201
    app.post('/alumnos', validarAlumno,(req, res) => {
       const nuevoAlumno = repositorio.crear(req.body);
       res.status(201).json(nuevoAlumno)

    });

    // TODO: PUT /alumnos/:id → actualizar (auth + validarAlumno) → 200 o 404
    app.put('/alumnos/:id',  validarAlumno, (req, res) => {
       const alumnoActualizado = repositorio.actualizar(req.params.id, req.body);
       return alumnoActualizado
           ? res.status(200).json(alumnoActualizado)
           : res.status(404).json({ error: 'Alumno no encontrado' })
    });

    // TODO: DELETE /alumnos/:id → eliminar (auth) → 204 o 404
    app.delete('/alumnos/:id', (req, res) => {
        const eliminado = repositorio.eliminar(req.params.id);
        return eliminado
            ? res.status(204).send()
            : res.status(404).json({ error: 'Alumno no encontrado' })
    });

    return app;
}
