import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { RepositorioAlumnos } from '../src/repositorio.js';

// Pool simulado en memoria para no necesitar PostgreSQL en los tests unitarios
function crearPoolMock(semilla = []) {
    let filas = semilla.map((a, i) => ({ ...a, id: i + 1 }));
    let siguiente = filas.length + 1;

    return {
        query(sql, params = []) {
            const s = sql.trim().toUpperCase();

            if (s.startsWith('SELECT * FROM ALUMNOS ORDER BY ID')) {
                return { rows: [...filas] };
            }
            if (s.startsWith('SELECT * FROM ALUMNOS WHERE ID')) {
                const id = Number(params[0]);
                return { rows: filas.filter(f => f.id === id) };
            }
            if (s.startsWith('INSERT')) {
                const [nombre, apellido, email, edad] = params;
                const nueva = { id: siguiente++, nombre, apellido, email, edad };
                filas.push(nueva);
                return { rows: [nueva] };
            }
            if (s.startsWith('UPDATE')) {
                const id = Number(params[params.length - 1]);
                const idx = filas.findIndex(f => f.id === id);
                if (idx === -1) return { rows: [] };
                // reconstruir campos desde el SQL SET
                const setCols = sql.match(/SET (.+) WHERE/i)[1].split(',').map(p => p.trim().split(' = ')[0]);
                setCols.forEach((col, i) => { filas[idx][col] = params[i]; });
                return { rows: [filas[idx]] };
            }
            if (s.startsWith('DELETE')) {
                const id = Number(params[0]);
                const antes = filas.length;
                filas = filas.filter(f => f.id !== id);
                return { rowCount: antes - filas.length };
            }
            return { rows: [], rowCount: 0 };
        },
    };
}

const semilla = [
    { nombre: 'Ana',   apellido: 'López',  email: 'ana@umg.gt',  edad: 20 },
    { nombre: 'Luis',  apellido: 'Pérez',  email: 'luis@umg.gt', edad: 22 },
    { nombre: 'Marta', apellido: 'García', email: 'marta@umg.gt', edad: 21 },
];

describe('RepositorioAlumnos (unitario con mock)', () => {
    let repo;
    beforeEach(() => { repo = new RepositorioAlumnos(crearPoolMock(semilla)); });

    it('listar() devuelve todos los alumnos', async () => {
        const lista = await repo.listar();
        assert.equal(lista.length, semilla.length);
        assert.equal(lista[0].nombre, 'Ana');
    });

    it('listar() devuelve ids como string', async () => {
        const lista = await repo.listar();
        assert.equal(typeof lista[0].id, 'string');
    });

    it('obtener(id) devuelve el alumno correcto', async () => {
        const alumno = await repo.obtener('2');
        assert.equal(alumno.email, 'luis@umg.gt');
    });

    it('obtener(id) devuelve undefined si no existe', async () => {
        assert.equal(await repo.obtener('999'), undefined);
    });

    it('crear() agrega el alumno y devuelve el nuevo con id', async () => {
        const nuevo = await repo.crear({ nombre: 'Pedro', apellido: 'Ruiz', email: 'pedro@umg.gt', edad: 19 });
        assert.equal(typeof nuevo.id, 'string');
        assert.equal(nuevo.nombre, 'Pedro');
        assert.equal((await repo.listar()).length, semilla.length + 1);
    });

    it('actualizar() modifica los campos enviados', async () => {
        const act = await repo.actualizar('1', { edad: 99 });
        assert.equal(act.edad, 99);
    });

    it('actualizar() devuelve undefined si no existe', async () => {
        assert.equal(await repo.actualizar('999', { edad: 1 }), undefined);
    });

    it('eliminar() devuelve true y quita el alumno', async () => {
        assert.equal(await repo.eliminar('3'), true);
        assert.equal(await repo.obtener('3'), undefined);
    });

    it('eliminar() devuelve false si no existe', async () => {
        assert.equal(await repo.eliminar('999'), false);
    });
});
