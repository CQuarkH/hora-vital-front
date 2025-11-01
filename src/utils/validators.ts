export function isValidRUT(rut: string): boolean {
    // Limpiar puntos y guion
    const cleanRut = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();

    if (!/^\d{7,8}[\dkK]$/.test(cleanRut)) return false;

    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    let sum = 0;
    let multiplier = 2;

    // Recorrer los dígitos del cuerpo desde el final
    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i], 10) * multiplier;
        multiplier = multiplier < 7 ? multiplier + 1 : 2;
    }

    const remainder = 11 - (sum % 11);
    const computedDV =
        remainder === 11 ? '0' : remainder === 10 ? 'K' : remainder.toString();

    return dv === computedDV;
}
