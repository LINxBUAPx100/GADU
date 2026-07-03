# ∴ GADU

Cuaderno personal de trabajos y avances masónicos: **notas, tareas, calendario y biblioteca** en un ecosistema unificado.

## Publicación en GitHub Pages

El proyecto está preparado para vivir 100% en GitHub Pages (incluye `.nojekyll`, workflow de despliegue, manifest PWA y service worker offline):

1. Crea un repositorio en GitHub (p. ej. `GADU`).
2. Sube el proyecto:
   ```
   git remote add origin https://github.com/TU-USUARIO/GADU.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Source: GitHub Actions**.
4. El workflow `deploy.yml` publica automáticamente en cada push a `main`.
5. Tu templo quedará en `https://TU-USUARIO.github.io/GADU/`.

Al servirse por HTTPS, GADU funciona **offline** tras la primera visita y puede **instalarse como app** (menú del navegador → "Instalar" / "Añadir a pantalla de inicio").

### Importante: los datos viven en cada dispositivo

GitHub Pages solo sirve los archivos; no hay servidor de datos. Cada navegador/dispositivo guarda su propio templo en `localStorage`. Para mover o compartir el estado entre equipos usa **Administración → Exportar templo completo** y guarda el JSON en la carpeta de Google Drive; en el otro dispositivo, **Restaurar respaldo**.

## Uso local

- **Abrir directamente:** doble clic en `index.html`.
- **Con servidor local:** `npx http-server -p 4173` y abrir `http://localhost:4173`.

## Usuarios y roles

Al abrir por primera vez se **funda el templo**: se crea el Administrador supremo (GADU). Los demás usuarios "llaman a la puerta" con nombre + contraseña (sin correos) y solicitan un rol; el Administrador los aprueba en **Administración**.

Jerarquía: **GADU** → **Venerable Maestro** → **Primer Vigilante** → **Segundo Vigilante** → **Compañero** → **Aprendiz**.

- Cada usuario tiene su taller privado (notas, tareas, calendario, progreso de lectura).
- GADU y el V∴M∴ ven todo: **Modo GADU** («Ver taller») para contemplar el taller de cualquier miembro.
- El 1er Vigilante encomienda trabajos a los Compañeros; el 2do Vigilante, a los Aprendices (campo «☩ Encomendar a» al crear una tarea).
- La Biblioteca se revela por grados: el Aprendiz ve las secciones I, II y V; el Compañero suma la III; los Vigilantes y superiores lo ven todo.
- **Nota de seguridad:** los datos y contraseñas viven en el navegador (localStorage, con hash). Es privacidad entre hermanos que comparten un equipo, no seguridad de nivel bancario.

## Módulos

| Módulo | Qué hace |
|---|---|
| **Tablero** | Visión del día, captura rápida, progreso del camino de estudio, proyectos activos. |
| **Notas** | Markdown, enlaces `[[bidireccionales]]`, `#etiquetas`, backlinks, notas fijadas. |
| **Tareas** | Kanban (arrastrar y soltar) o lista, subtareas, prioridades, vencimientos, proyectos. |
| **Calendario** | Vista mensual y semanal; *time-blocking* arrastrando tareas a la rejilla. |
| **Biblioteca** | Camino de estudio en 5 secciones con estado de lectura, enlaces a Google Drive y notas de estudio por obra. |

## Atajos

- `Ctrl + K` — paleta de comandos / búsqueda global
- `N` / `T` / `E` — nueva nota / tarea / evento
- `1`–`5` — navegar entre módulos
- `[` — ocultar barra lateral · `?` — ayuda

## Estructura

```
index.html   — estructura de la aplicación
styles.css   — tema «Cámara de Reflexión» (oscuro) y «Pergamino» (claro)
app.js       — lógica completa, sin dependencias externas
```

∴ A la Gloria del G∴A∴D∴U∴
