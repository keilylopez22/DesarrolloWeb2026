/**
 * HTTP Inspector CLI
 *
 * Tarea de la Sesión 1: Fundamentos de la Web
 *
 * Esta tarea NO usa la red, ni async/await, ni librerías externas.
 * Solo la biblioteca estándar de Node + tipos básicos de TypeScript.
 *
 * Idea: aplicar lo que aprendiste sobre HTTP (URLs, métodos, códigos
 * de estado y cabeceras) implementando pequeñas funciones puras.
 */

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

/** Resultado de analizar una URL. */
export interface UrlParts {
  /** Protocolo tal como lo devuelve la WHATWG URL, p. ej. "https:". */
  protocol: string;
  /** Host (puede incluir puerto), p. ej. "api.ejemplo.com:443". */
  host: string;
  /** Ruta, p. ej. "/users". */
  pathname: string;
  /** Query string con el "?" inicial, p. ej. "?id=1&name=Ana". */
  search: string;
  /** Lista de pares [clave, valor] de los query params. */
  query: Array<[string, string]>;
}

/** Categoría de un código de estado HTTP. */
export type StatusCategory =
  | "1xx Informativo"
  | "2xx Éxito"
  | "3xx Redirección"
  | "4xx Error del cliente"
  | "5xx Error del servidor"
  | "Desconocido";

/** Mapa de cabeceras HTTP. */
export type Headers = Record<string, string>;

// ---------------------------------------------------------------------------
// Funciones a implementar
// ---------------------------------------------------------------------------

/**
 * TODO: Analiza una URL y devuelve sus partes.
 *
 * Pista: usa el constructor `new URL(url)` (viene con Node, no requiere
 * ninguna librería). Sus propiedades te dan todo lo que necesitas:
 *
 *   const u = new URL("https://api.ejemplo.com/users?id=1");
 *   u.protocol // → "https:"
 *   u.host     // → "api.ejemplo.com"
 *   u.pathname // → "/users"
 *   u.search   // → "?id=1"
 *   u.searchParams.entries() // → iterador [["id","1"]]
 *
 * Si la URL no es válida, `new URL()` lanza TypeError — no hace falta
 * que lo manejes aparte, se propagará solo.
 */
/**
 * analiza las partes de una url y devuelve un objeto con las partes de la url
 * @param url - texto de la url 
 * @returns {UrlParts} - objeto con las partes de la url
 */
export function parseUrl(url: string): UrlParts {
  // TODO: tu implementación aquí
  const u = new URL(url);
  const urlParts: UrlParts =
  {
    protocol: u.protocol,
    host: u.host,
    pathname: u.pathname,
    search: u.search,
    query: Array.from(u.searchParams.entries()),
  }
  return urlParts;
}

/**
 * TODO: Clasifica un código de estado HTTP en su categoría.
 *
 * Reglas:
 *   100–199 → "1xx Informativo"
 *   200–299 → "2xx Éxito"
 *   300–399 → "3xx Redirección"
 *   400–499 → "4xx Error del cliente"
 *   500–599 → "5xx Error del servidor"
 *   otro    → "Desconocido"
 *
 * Pista: un único `if / else if` con comparaciones de rangos basta.
 */
/**
 * 
 * @param code - numero que identifica el status htpp
 * @returns  {StatusCategory} - categoria del status http
 */
export function classifyStatus(code: number): StatusCategory {
    if (code  >= 100 && code <= 199) {
        return "1xx Informativo";
        // TODO: tu implementación aquí
      }else if (code >=200 && code <=299) {
        return "2xx Éxito";
      } else if (code >=300 && code <=399) {
        return "3xx Redirección";
      } else if (code >=400 && code <=499) {
        return "4xx Error del cliente";
      } else if (code >=500 && code <=599) {
        return "5xx Error del servidor";
      } else {
        return "Desconocido";
      }
 
}

/**
 * TODO: Parsea un texto con líneas de cabeceras HTTP al formato
 * `Record<string, string>`. El separador entre nombre y valor es ":".
 *
 * Reglas:
 *   - Cada línea no vacía debe tener formato "Nombre: valor".
 *   - Ignora líneas vacías o que no contengan ":".
 *   - No tienes que normalizar mayúsculas/minúsculas del nombre.
 *
 * Ejemplo:
 *   parseHeaders("Content-Type: application/json\nAuthorization: Bearer abc")
 *   → { "Content-Type": "application/json", "Authorization": "Bearer abc" }
 *
 * Pista: `text.split("\n")` te da las líneas; `String.split(":")` te separa
 * nombre y valor. Recuerda `.trim()` para quitar espacios sobrantes.
 */
/**
 *  Parsea un texto con líneas de cabeceras HTTP al formato
 * `Record<string, string>`. El separador entre nombre y valor es ":".
 * @param text - tiene las lineas de las cabeceras
 * @returns {Headers} - objeto con las cabeceras
 */
export function parseHeaders(text: string): Headers {
  const lines = text.split("\n");
  const headers: Headers = {};
  for (const line of lines) {
    if (line.trim() === "" || !line.includes(":")) {
      continue; 
    }
    const [name, value] = line.split(":");
    //const record: Record<string, string> = {name.trim(), value.trim()};
    headers[name.trim()] = value.trim();
   } 
  // TODO: tu implementación aquí
  return headers;
}

/**
 * TODO: Combina las funciones anteriores en un resumen legible.
 *
 * El formato exacto lo decides tú (los tests solo verifican que el string
 * no esté vacío y que contenga la URL y el código). Un ejemplo:
 *
 *   Resumen de la petición
 *   ──────────────────────
 *   URL:     https://api.ejemplo.com/users
 *   Status:  200 (2xx Éxito)
 *   Headers:
 *     • Content-Type: application/json
 *     • Authorization: Bearer abc
 */

/**
 * Combina las funciones anteriores en un resumen legible.
 * @param url - url formato valido
 * @param status  codigo del status htpp
 * @param headersText - texto con las cabeceras 
 * @returns {string} - resumen de la peticion
 */
export function summarizeRequest(
  url: string,
  status: number,
  headersText: string,
): string {
  const summary = "Resumen de la petición\n"
  + "──────────────────────\n"
  + `URL:     ${url}\n`
  + `Status:  ${status} (${classifyStatus(status)})\n`
  + "Headers:\n";
  const headers = parseHeaders(headersText);
  return summary;
  // TODO: tu implementación aquí
 
}

// ---------------------------------------------------------------------------
// CLI (opcional, pero recomendado para probar manualmente)
// ---------------------------------------------------------------------------

if (require.main === module) {
  const [, , cmd, ...args] = process.argv;
  try {
    if (cmd === "parse-url" && args[0]) {
      const parts = parseUrl(args[0]);
      console.log(JSON.stringify(parts, null, 2));
    } else if (cmd === "status" && args[0]) {
      const cat = classifyStatus(Number(args[0]));
      console.log(cat);
    } else if (cmd === "headers" && args.length > 0) {
      const h = parseHeaders(args.join(" "));
      console.log(JSON.stringify(h, null, 2));
    } else if (cmd === "summary" && args.length >= 2) {
      const [url, status, ...rest] = args;
      console.log(summarizeRequest(url, Number(status), rest.join(" ")));
    } else {
      console.log("Uso:");
      console.log('  npm start parse-url "https://ejemplo.com/path?a=1"');
      console.log("  npm start status 404");
      console.log('  npm start headers "Content-Type: application/json"');
      console.log('  npm start summary "https://x.com" 200 "Content-Type: application/json"');
    }
  } catch (e) {
    console.error("Error:", (e as Error).message);
    process.exit(1);
  }
}
