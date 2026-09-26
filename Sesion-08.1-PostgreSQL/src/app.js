import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const JWT_SECRET = () => process.env.JWT_SECRET || 'umg-secret-2026';

export function autenticarJWT(req, res, next) {
    const auth = req.get('Authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Token requerido' });
    try {
        req.usuario = jwt.verify(token, JWT_SECRET());
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

export const reglasAlumno = [
    body('nombre').isString().trim().notEmpty().withMessage('nombre es requerido'),
    body('apellido').isString().trim().notEmpty().withMessage('apellido es requerido'),
    body('email').isEmail().withMessage('email inválido'),
    body('edad').optional().isInt({ min: 0 }).withMessage('edad debe ser un entero >= 0'),
];

export function manejarErroresValidacion(req, res, next) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    next();
}

export function crearApp(repositorio) {
    const app = express();

    app.use(express.json());
    app.use(express.static(join(__dirname, '..', 'public')));

    app.post('/login', (req, res) => {
        const { usuario, password } = req.body ?? {};
        if (usuario === 'admin' && password === 'umg-2026') {
            const token = jwt.sign({ usuario }, JWT_SECRET(), {
                expiresIn: process.env.JWT_EXPIRES_IN || '1h',
            });
            return res.json({ token });
        }
        res.status(401).json({ error: 'Credenciales incorrectas' });
    });

    app.get('/alumnos', async (req, res) => {
        res.json(await repositorio.listar());
    });

    app.get('/alumnos/:id', async (req, res) => {
        const alumno = await repositorio.obtener(req.params.id);
        alumno ? res.json(alumno) : res.status(404).json({ error: 'Alumno no encontrado' });
    });

    app.post('/alumnos', autenticarJWT, reglasAlumno, manejarErroresValidacion, async (req, res) => {
        const nuevo = await repositorio.crear(req.body);
        res.status(201).json(nuevo);
    });

    app.put('/alumnos/:id', autenticarJWT, reglasAlumno, manejarErroresValidacion, async (req, res) => {
        const actualizado = await repositorio.actualizar(req.params.id, req.body);
        actualizado ? res.json(actualizado) : res.status(404).json({ error: 'Alumno no encontrado' });
    });

    app.delete('/alumnos/:id', autenticarJWT, async (req, res) => {
        const eliminado = await repositorio.eliminar(req.params.id);
        eliminado ? res.status(204).send() : res.status(404).json({ error: 'Alumno no encontrado' });
    });

    return app;
}
