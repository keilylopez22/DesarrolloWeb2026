function mapear(row) {
    return {
        id:       String(row.id),
        nombre:   row.nombre,
        apellido: row.apellido,
        email:    row.email,
        edad:     row.edad,
    };
}

export class RepositorioAlumnos {
    constructor(pool) {
        this.pool = pool;
    }

    async listar() {
        const { rows } = await this.pool.query('SELECT * FROM alumnos ORDER BY id');
        return rows.map(mapear);
    }

    async obtener(id) {
        const { rows } = await this.pool.query('SELECT * FROM alumnos WHERE id = $1', [id]);
        return rows[0] ? mapear(rows[0]) : undefined;
    }

    async crear(datos) {
        const { nombre, apellido, email, edad } = datos;
        const { rows } = await this.pool.query(
            'INSERT INTO alumnos (nombre, apellido, email, edad) VALUES ($1,$2,$3,$4) RETURNING *',
            [nombre, apellido, email, edad ?? null]
        );
        return mapear(rows[0]);
    }

    async actualizar(id, datos) {
        const campos = [];
        const valores = [];
        let i = 1;
        for (const [clave, valor] of Object.entries(datos)) {
            campos.push(`${clave} = $${i++}`);
            valores.push(valor);
        }
        if (campos.length === 0) return this.obtener(id);
        valores.push(id);
        const { rows } = await this.pool.query(
            `UPDATE alumnos SET ${campos.join(', ')} WHERE id = $${i} RETURNING *`,
            valores
        );
        return rows[0] ? mapear(rows[0]) : undefined;
    }

    async eliminar(id) {
        const { rowCount } = await this.pool.query('DELETE FROM alumnos WHERE id = $1', [id]);
        return rowCount > 0;
    }
}
