# 📝 Tarea: Mini-sitio web semántico

**Curso:** Desarrollo Web — Sesión 2 (HTML)
**Universidad:** Mariano Gálvez de Guatemala
**Docente:** Ing. Marco Tulio Valdez
**Duración:** 4 días · 30–45 min/día

## 🎯 Objetivo

Construir un **sitio web estático de 4 páginas** sobre un tema libre (recetas, películas, hobbies, etc.) aplicando todos los elementos HTML vistos en la Sesión 2.

## 📋 Requisitos

- ✅ Mínimo **4 archivos `.html`** en la raíz
- ✅ Estructura HTML5 válida: `<!DOCTYPE html>`, `<html lang>`, `<head>`, `<body>`
- ✅ Uso de **`<header>`, `<main>`, `<footer>`, `<article>`, `<section>`, `<nav>`** semánticos
- ✅ **Navegación** entre las 4 páginas con `<a href="...html">`
- ✅ Al menos 1 enlace externo con `target="_blank" rel="noopener"`
- ✅ Imágenes con **`alt`** y al menos 1 con **`loading="lazy"`**
- ✅ Formulario con `<input>` y validación nativa
- ✅ **`<dialog>`** nativo
- ✅ **Popover API** (`popover`, `popovertarget`)
- ✅ **Invoker Commands** (`command`, `commandfor`)
- ✅ Listas (`<ul>` o `<ol>`) y al menos 1 `<table>`

## 🗓️ Plan de 4 días

| Día | Actividad | Commit sugerido |
|-----|-----------|-----------------|
| 1 | Estructura semántica + navegación entre páginas | `feat: add semantic structure and navigation` |
| 2 | Imágenes (locales, base64) + listas + tabla | `feat: add images, lists and table` |
| 3 | Formulario + `<dialog>` + Popover + Invoker Commands | `feat: add form, dialog, popover and invoker commands` |
| 4 | Pulir accesibilidad, validar y pasar tests | `docs: add accessibility improvements` |

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
cd Sesion-02-HTML5

# 2. Los tests deberían fallar al inicio
npm test

# 3. Edita los .html de la raíz hasta que pasen todos los tests
npm test

# 4. Para previsualizar localmente
npm run serve   # abre http://localhost:8080

# 5. Sube tus commits a TU repo
git add .
git commit -m "feat: add semantic structure"
git push origin main
```

## ✅ Cómo se califica

| Criterio | Peso |
|----------|------|
| **`npm test` pasa 100%** (todos los checks en verde) | 70% |
| **Conventional Commits** (mínimo 4 commits, mensajes claros) | 20% |
| **Accesibilidad** (alt en imágenes, labels en inputs) | 10% |

Los tests verifican automáticamente:

- ✓ 4+ archivos HTML
- ✓ DOCTYPE, lang, head, body en cada uno
- ✓ header, main, footer, article/section, nav en index.html
- ✓ Enlaces entre páginas
- ✓ Enlaces externos con `rel="noopener"`
- ✓ Imágenes con `alt` y al menos 1 con `loading="lazy"`
- ✓ `<dialog>`, `popover`, `command`/`commandfor` en index.html
- ✓ `<form>` con `<input>`

## 📝 Conventional Commits — Ejemplos

```bash
git commit -m "feat: add navigation menu to all pages"
git commit -m "feat: add contact form with validation"
git commit -m "feat: integrate dialog and popover API"
git commit -m "fix: add missing alt attributes to images"
git commit -m "docs: add accessibility improvements"
```

**Tipos válidos:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 📚 Recursos

- [MDN HTML](https://developer.mozilla.org/es/docs/Web/HTML)
- [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)
- [W3C Validator](https://validator.w3.org/)

## ❓ ¿Dudas?

Revisa la presentación de la Sesión 2 o pregunta en clase. ¡Éxito! 🚀
