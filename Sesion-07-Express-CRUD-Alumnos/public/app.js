/**
 * app.js — Lógica del sitio (Fetch + Dialogs)
 * Tarea Sesión 7 · Desarrollo Web · UMG
 *
 * TODO: implementa las funciones marcadas. La API exige el header
 * `x-api-key` en las operaciones de escritura (POST, PUT, DELETE).
 */

const API = '/alumnos';
const API_KEY = 'umg-2026'; // debe coincidir con config.env

// Helper ya resuelto: cabeceras para las peticiones
const cabeceras = (conJson = true) => ({
    ...(conJson ? { 'Content-Type': 'application/json' } : {}),
    'x-api-key': API_KEY,
});

// Referencias del DOM (ya resueltas)
const tabla = document.querySelector('#tablaAlumnos tbody');
const mensaje = document.querySelector('#mensaje');
const dialogoForm = document.querySelector('#dialogoForm');
const dialogoEliminar = document.querySelector('#dialogoEliminar');
const form = document.querySelector('#formAlumno');
const tituloForm = document.querySelector('#tituloForm');
const nombreEliminar = document.querySelector('#nombreEliminar');

let idEnEdicion = null;        // null = crear | string = editar
let idAEliminar = null;

/**
 * TODO: GET /alumnos y pinta las filas en la tabla.
 * Cada fila debe incluir botones "Editar" y "Eliminar".
 */
async function cargarAlumnos() {
    try {
        const res = await fetch(API);
        const alumnos = await res.json();
        tabla.innerHTML = alumnos.map((a, i) => `
            <tr>
                <td>${a.id}</td>
                <td>${a.nombre}</td>
                <td>${a.apellido}</td>
                <td>${a.email}</td>
                <td>${a.edad ?? ''}</td>
                <td>
                    <button onclick="abrirDialogoEditar('${a.id}')">Editar</button>
                    <button onclick="eliminarAlumno('${a.id}')">Eliminar</button>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        mostrarMensaje('Error al cargar alumnos', 'error');
    }
}

/**
 * TODO: limpia el formulario, pone el título "Nuevo alumno",
 * idEnEdicion = null y abre dialogoForm con showModal().
 */
function abrirDialogoNuevo() {
    form.reset();
    tituloForm.textContent = 'Nuevo alumno';
    idEnEdicion = null;
    dialogoForm.showModal();
}

/**
 * TODO: precarga los datos del alumno en el formulario,
 * guarda su id en idEnEdicion, cambia el título a "Editar alumno"
 * y abre dialogoForm.
 */
async function abrirDialogoEditar(id) {
    const res = await fetch(`${API}/${id}`);
    const alumno = await res.json();
    document.querySelector('#nombre').value = alumno.nombre;
    document.querySelector('#apellido').value = alumno.apellido;
    document.querySelector('#email').value = alumno.email;
    document.querySelector('#edad').value = alumno.edad ?? '';
    tituloForm.textContent = 'Editar alumno';
    idEnEdicion = id;
    dialogoForm.showModal();
}

/**
 * TODO: lee los campos del formulario y llama a la API.
 *   - Si idEnEdicion es null → POST /alumnos            (201)
 *   - Si hay id             → PUT /alumnos/:id          (200)
 * Usa cabeceras() y JSON.stringify(). Al terminar: cierra el dialog,
 * recarga la lista y muestra un mensaje.
 */
async function guardarAlumno(event) {
    event.preventDefault();
    const datos = {
        nombre: document.querySelector('#nombre').value.trim(),
        apellido: document.querySelector('#apellido').value.trim(),
        email: document.querySelector('#email').value.trim(),
        edad: Number(document.querySelector('#edad').value),
    };
    const url = idEnEdicion ? `${API}/${idEnEdicion}` : API;
    const method = idEnEdicion ? 'PUT' : 'POST';
    try {
        const res = await fetch(url, { method, headers: cabeceras(), body: JSON.stringify(datos) });
        if (!res.ok) throw new Error();
        dialogoForm.close();
        await cargarAlumnos();
        mostrarMensaje(idEnEdicion ? 'Alumno actualizado' : 'Alumno creado');
    } catch {
        mostrarMensaje('Error al guardar alumno', 'error');
    }
}

/**
 * TODO: abre dialogoEliminar guardando el id, y al confirmar hace
 * DELETE /alumnos/:id con cabeceras(false). Luego recarga y avisa.
 */
function eliminarAlumno(id) {
    idAEliminar = id;
    const fila = tabla.querySelector(`button[onclick="eliminarAlumno('${id}')"]`);
    nombreEliminar.textContent = fila ? fila.closest('tr').cells[1].textContent : id;
    dialogoEliminar.showModal();
}

/**
 * TODO: helper para mostrar mensajes (error en rojo, éxito en verde).
 */
function mostrarMensaje(texto, tipo = 'ok') {
    mensaje.textContent = texto;
    mensaje.style.color = tipo === 'error' ? 'red' : 'green';
}

// ============================================================
// Conexión de eventos (TODO: completa lo que falte)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#btnNuevo').addEventListener('click', abrirDialogoNuevo);
    form.addEventListener('submit', guardarAlumno);
    document.querySelector('#btnCancelar').addEventListener('click', () => dialogoForm.close());
    document.querySelector('#btnCancelarEliminar').addEventListener('click', () => dialogoEliminar.close());
    document.querySelector('#btnConfirmarEliminar').addEventListener('click', async () => {
        try {
            const res = await fetch(`${API}/${idAEliminar}`, { method: 'DELETE', headers: cabeceras(false) });
            if (!res.ok) throw new Error();
            dialogoEliminar.close();
            await cargarAlumnos();
            mostrarMensaje('Alumno eliminado');
        } catch {
            mostrarMensaje('Error al eliminar alumno', 'error');
        }
    });
    cargarAlumnos();
});
