import { crearApp } from './app.js';
import { RepositorioAlumnos } from './repositorio.js';
import { pool, inicializarDB } from './db.js';

const PUERTO = process.env.PORT || 3000;

await inicializarDB();

const repositorio = new RepositorioAlumnos(pool);
const app = crearApp(repositorio);

app.listen(PUERTO, () => {
    console.log(`🚀 API:      http://localhost:${PUERTO}/alumnos`);
    console.log(`🌐 Sitio:    http://localhost:${PUERTO}/`);
    console.log(`🔑 Login:    POST http://localhost:${PUERTO}/login`);
});
