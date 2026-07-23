# 📝 Tarea: HTTP Inspector CLI

**Curso:** Desarrollo Web — Sesión 1 (Fundamentos de la Web)
**Universidad:** Mariano Gálvez de Guatemala
**Docente:** Ing. Marco Tulio Valdez
**Duración:** 4 días · 30–45 min/día

## 🎯 Objetivo

Construir una pequeña herramienta de línea de comandos en **Node.js + TypeScript** que demuestre que entendiste los conceptos básicos de HTTP, URLs, códigos de estado y cabeceras — todo lo que vimos en la Sesión 1.

## 📋 Requisitos

La CLI debe implementar 4 funciones en `src/index.ts`:

| Función | Descripción |
|---------|-------------|
| `parseUrl(url)` | Analiza una URL y devuelve sus partes (protocolo, host, path, query params) |
| `classifyStatus(code)` | Clasifica un código HTTP en: informativo, éxito, redirección, error cliente, error servidor |
| `parseHeaders(text)` | Parsea líneas `Nombre: valor` a un objeto |
| `summarizeRequest(url, status, headers)` | Combina las 3 anteriores en un resumen legible |

Todas deben:
- Tipar correctamente entradas y salidas (usa `interface` y `type` básicos, **sin `any`**)

## 🗓️ Plan de 4 días

| Día | Actividad | Commit sugerido |
|-----|-----------|-----------------|
| 1 | Setup (`npm install`) + implementar `parseUrl` | `chore: initial setup` + `feat: implement parseUrl` |
| 2 | Implementar `classifyStatus` | `feat: add classifyStatus function` |
| 3 | Implementar `parseHeaders` y `summarizeRequest` | `feat: add parseHeaders and summarizeRequest` |
| 4 | Pasar todos los tests, añadir JSDoc, pulir | `docs: add JSDoc comments` |

## 🚀 Cómo empezar

### Una sola vez: agrega el remote del instructor

Si tu repo personal aún no tiene el remote `instructor`, agrégalo (el
instructor te pasa la URL):

```bash
# Si esta utilizando git con https, usar este commando
git remote add instructor https://github.com/MvaldezUMG/DesarrolloWeb2026.git
# Si esta utilizando git ssh, usar este commando en su lugar
gir remote add instructor git@github.com:MvaldezUMG/DesarrolloWeb2026.git
git remote -v
```

### Cada lunes: trae la nueva sesión

```bash
# Desde la raíz de tu repo
git pull instructor main
```

### Trabaja en la carpeta de esta sesión

```bash
# 1. Entra a la carpeta
cd Sesion-01-Fundamentos-Web

# 2. Instala dependencias
npm install

# 3. Reemplaza cada "throw new Error('Not implemented')" en src/index.ts

# 4. Mientras programas, corre los tests
npm test
# o en modo watch:
npm run test:watch

# 5. Cuando todo esté verde, sube tus commits a TU repo
git add .
git commit -m "feat: implement parseUrl function"
git push origin main
```

## 🧪 Probar la CLI manualmente

```bash
# Analizar una URL
npm start parse-url "https://api.ejemplo.com/users?id=1&name=Ana"
# →
# {
#   "protocol": "https:",
#   "host": "api.ejemplo.com",
#   "pathname": "/users",
#   "search": "?id=1&name=Ana",
#   "query": [["id","1"], ["name","Ana"]]
# }

# Clasificar un código
npm start status 404
# → "4xx Error del cliente"

# Parsear cabeceras
npm start headers "Content-Type: application/json
Authorization: Bearer abc"
# → { "Content-Type": "application/json", "Authorization": "Bearer abc" }

# Resumen completo
npm start summary "https://api.ejemplo.com/users" 200 "Content-Type: application/json"
```

## ✅ Cómo se califica

| Criterio | Peso |
|----------|------|
| **Tests automatizados verdes** (`npm test`) | 60% |
| **Conventional Commits** (uno por día) | 20% |
| **Calidad del código** (sin `any`, JSDoc, nombres claros) | 20% |

Los tests verifican:

- ✅ `parseUrl` extrae correctamente protocolo, host, path y query
- ✅ `parseUrl` maneja URLs inválidas (lanza error)
- ✅ `parseUrl` maneja URLs sin query params
- ✅ `classifyStatus` clasifica correctamente 1xx, 2xx, 3xx, 4xx, 5xx y desconocidos
- ✅ `parseHeaders` parsea líneas válidas e ignora vacías o sin `:`
- ✅ `parseHeaders` recorta espacios sobrantes
- ✅ `summarizeRequest` devuelve un string que incluye la URL y el código
- ✅ El código NO usa `any` en ningún lugar

## 📝 Conventional Commits — Ejemplos válidos

```bash
git commit -m "feat: add URL parser function"
git commit -m "fix: handle invalid URLs correctly"
git commit -m "docs: add JSDoc comments to public functions"
git commit -m "test: add tests for header edge cases"
git commit -m "chore: initial project setup with TypeScript and Jest"
```

**Tipos válidos:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `build`, `ci`

## 📚 Recursos

- [MDN — `URL`](https://developer.mozilla.org/es/docs/Web/API/URL) · la API que usas en `parseUrl`
- [MDN — Códigos de estado HTTP](https://developer.mozilla.org/es/docs/Web/HTTP/Status) · referencia para `classifyStatus`
- [MDN — Cabeceras HTTP](https://developer.mozilla.org/es/docs/Web/HTTP/Headers) · referencia para `parseHeaders`
- [Conventional Commits](https://www.conventionalcommits.org/) · guía de formato de commits

## ❓ ¿Dudas?

Consulta la presentación de la Sesión 1 o pregunta en clase. ¡Éxito! 🚀
