/**
 * Valida un RUT chileno según el algoritmo de módulo 11
 * @param rut - RUT en cualquier formato (con/sin puntos y guión)
 * @returns true si el RUT es válido, false en caso contrario
 */
export function isValidRUT(rut: string): boolean {
    const cleanRut = cleanRUTString(rut);

    if (!hasValidRUTFormat(cleanRut)) {
        return false;
    }

    const { body, verifierDigit } = extractRUTParts(cleanRut);
    const computedVerifier = calculateVerifierDigit(body);

    return verifierDigit === computedVerifier;
}

/**
 * Limpia el string del RUT removiendo puntos, guiones y espacios
 * @param rut - RUT sin procesar
 * @returns RUT limpio en mayúsculas
 */
function cleanRUTString(rut: string): string {
    return rut.trim().replace(/\./g, '').replace(/-/g, '').toUpperCase();
}

/**
 * Verifica que el RUT tenga el formato correcto: 7-8 dígitos + verificador
 * @param cleanRut - RUT ya limpio
 * @returns true si cumple el formato, false en caso contrario
 */
function hasValidRUTFormat(cleanRut: string): boolean {
    return /^\d{7,8}[\dK]$/.test(cleanRut);
}

/**
 * Extrae el cuerpo y dígito verificador del RUT
 * @param cleanRut - RUT limpio
 * @returns Objeto con body (cuerpo numérico) y verifierDigit (dígito verificador)
 */
function extractRUTParts(cleanRut: string): { body: string; verifierDigit: string } {
    return {
        body: cleanRut.slice(0, -1),
        verifierDigit: cleanRut.slice(-1),
    };
}

/**
 * Calcula el dígito verificador usando el algoritmo módulo 11
 * @param body - Cuerpo numérico del RUT (sin dígito verificador)
 * @returns Dígito verificador calculado ('0'-'9' o 'K')
 */
function calculateVerifierDigit(body: string): string {
    let sum = 0;
    let multiplier = 2;

    // Recorrer dígitos desde el final, multiplicando por 2-7 cíclicamente
    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i], 10) * multiplier;
        multiplier = multiplier < 7 ? multiplier + 1 : 2;
    }

    const remainder = 11 - (sum % 11);

    // Casos especiales: 11 → '0', 10 → 'K'
    if (remainder === 11) return '0';
    if (remainder === 10) return 'K';
    return remainder.toString();
}