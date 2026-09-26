import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { crearApp } from '../src/app.js';

const SECRET = 'test-secret';

// Repositorio en memoria para tests de integración (sin PostgreSQL)
class RepositorioMock {
    constructor() {
        this.alumnos = [
            { id: '1', nombre: 'Ana',  apellido: 'López',  email: 'ana@umg.gt',  edad: 20 },
            { id: '2', nombre: 'Luis', apellido: 'Pérez',  email: 'luis@umg.gt', edad: 22 },
        ];
        this.sig = 3;
    }
    async listar() { return [...this.alumnos]; }
    async obtener(id) { return this.alumnos.find(a => a.id === id); }
    async crear(datos) {
        const nuevo = { id: String(this.sig++), ...datos };
        this.alumnos.push(nuevo);
        return nuevo;
    }
    async actualizar(id, datos) {
        const idx = this.alumnos.findIndex(a => a.id === id);
        if (idx === -1) return undefined;
        this.alumnos[idx] = { ...this.alumnos[idx], ...datos };
        return this.alumnos[idx];
    }
    async eliminar(id) {
        const antes = this.alumnos.length;
        this.alumnos = this.alumnos.filter(a => a.id !== id);
        return this.alumnos.length < antes;
    }
}

function levantar(app) {
    return new Promise(resolve => {
        const s = app.listen(0, '127.0.0.1', () => resolve(s));
    });
}

let servidor, base, token;

beforeEach(async () => {
    process.env.JWT_SECRET = SECRET;
    const app = crearApp(new RepositorioMock());
    servidor = await levantar(app);
    base = `http://127.0.0.1:${servidor.address().port}`;
    token = jwt.sign({ usuario: 'admin' }, SECRET, { expiresIn: '1h' });
});

afterEach(() => new Promise(resolve => servidor.close(resolve)));

const auth = () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });

describe('POST /login', () => {
    it('credenciales correctas devuelven token', async () => {
        const res = await fetch(`${base}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: 'admin', password: 'umg-2026' }),
        });
        assert.equal(res.status, 200);
        const body = await res.json();
        assert.ok(body.token);
    });

    it('credenciales incorrectas devuelven 401', async () => {
        const res = await fetch(`${base}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: 'admin', password: 'mala' }),
        });
        assert.equal(res.status, 401);
    });
});

describe('Autenticación JWT', () => {
    it('POST sin token responde 401', async () => {
        const res = await fetch(`${base}/alumnos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: 'X', apellido: 'Y', email: 'x@y.com', edad: 1 }),
        });
        assert.equal(res.status, 401);
    });

    it('POST con token inválido responde 401', async () => {
        const res = await fetch(`${base}/alumnos`, {
            method: 'POST',
            headers: { Authorization: 'Bearer token-falso', 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: 'X', apellido: 'Y', email: 'x@y.com', edad: 1 }),
        });
        assert.equal(res.status, 401);
    });
});

describe('Validación con express-validator', () => {
    it('POST sin nombre responde 400', async () => {
        const res = await fetch(`${base}/alumnos`, {
            method: 'POST',
            headers: auth(),
            body: JSON.stringify({ apellido: 'Y', email: 'x@y.com' }),
        });
        assert.equal(res.status, 400);
    });

    it('POST con email inválido responde 400', async () => {
        const res = await fetch(`${base}/alumnos`, {
            method: 'POST',
            headers: auth(),
            body: JSON.stringify({ nombre: 'X', apellido: 'Y', email: 'no-es-email' }),
        });
        assert.equal(res.status, 400);
    });

    it('POST con edad no numérica responde 400', async () => {
        const res = await fetch(`${base}/alumnos`, {
            method: 'POST',
            headers: auth(),
            body: JSON.stringify({ nombre: 'X', apellido: 'Y', email: 'x@y.com', edad: 'veinte' }),
        });
        assert.equal(res.status, 400);
    });
});

describe('CRUD /alumnos', () => {
    it('GET /alumnos devuelve la lista', async () => {
        const res = await fetch(`${base}/alumnos`);
        assert.equal(res.status, 200);
        assert.ok(Array.isArray(await res.json()));
    });

    it('GET /alumnos/:id devuelve un alumno', async () => {
        const res = await fetch(`${base}/alumnos/1`);
        assert.equal(res.status, 200);
        assert.equal((await res.json()).nombre, 'Ana');
    });

    it('GET /alumnos/:id inexistente responde 404', async () => {
        assert.equal((await fetch(`${base}/alumnos/999`)).status, 404);
    });

    it('POST /alumnos crea un alumno (201)', async () => {
        const res = await fetch(`${base}/alumnos`, {
            method: 'POST',
            headers: auth(),
            body: JSON.stringify({ nombre: 'Pedro', apellido: 'Ruiz', email: 'pedro@umg.gt', edad: 19 }),
        });
        assert.equal(res.status, 201);
        assert.equal((await res.json()).nombre, 'Pedro');
    });

    it('PUT /alumnos/:id actualiza (200)', async () => {
        const res = await fetch(`${base}/alumnos/1`, {
            method: 'PUT',
            headers: auth(),
            body: JSON.stringify({ nombre: 'Ana M', apellido: 'López', email: 'ana@umg.gt', edad: 21 }),
        });
        assert.equal(res.status, 200);
        assert.equal((await res.json()).nombre, 'Ana M');
    });

    it('PUT /alumnos/:id inexistente responde 404', async () => {
        const res = await fetch(`${base}/alumnos/999`, {
            method: 'PUT',
            headers: auth(),
            body: JSON.stringify({ nombre: 'X', apellido: 'Y', email: 'x@y.com', edad: 1 }),
        });
        assert.equal(res.status, 404);
    });

    it('DELETE /alumnos/:id elimina (204)', async () => {
        assert.equal((await fetch(`${base}/alumnos/2`, { method: 'DELETE', headers: auth() })).status, 204);
        assert.equal((await fetch(`${base}/alumnos/2`)).status, 404);
    });

    it('DELETE /alumnos/:id inexistente responde 404', async () => {
        assert.equal((await fetch(`${base}/alumnos/999`, { method: 'DELETE', headers: auth() })).status, 404);
    });
});
