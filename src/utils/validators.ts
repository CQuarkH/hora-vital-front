export function isValidRUT(rut: string): boolean {
    // Limpiar espacios, puntos y guion, convertir a mayúsculas
    const cleanRut = rut.trim().replace(/\./g, '').replace(/-/g, '').toUpperCase();

    // Verificar formato básico: 7-8 dígitos seguidos de dígito verificador
    if (!/^\d{7,8}[\dK]$/.test(cleanRut)) {
        return false;
    }

    // Separar cuerpo y dígito verificador
    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    // Calcular dígito verificador usando algoritmo módulo 11
    let sum = 0;
    let multiplier = 2;

    // Recorrer dígitos del cuerpo desde el final
    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i], 10) * multiplier;
        multiplier = multiplier < 7 ? multiplier + 1 : 2;
    }

    const remainder = 11 - (sum % 11);
    const computedDV =
        remainder === 11 ? '0' : remainder === 10 ? 'K' : remainder.toString();

    return dv === computedDV;
}