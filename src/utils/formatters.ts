export const formatRUT = (value: string): string => {
    // Remover todo excepto números y K/k
    const clean = value.replace(/[^0-9kK]/g, '');

    if (clean.length === 0) return '';

    // Separar el dígito verificador
    const rut = clean.slice(0, -1);
    const dv = clean.slice(-1).toUpperCase();

    if (rut.length === 0) return dv;

    // Formatear el RUT con puntos
    const formatted = rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formatted}-${dv}`;
};

export const formatPhoneNumber = (value: string): string => {
    // Remover todo excepto números
    let clean = value.replace(/\D/g, '');

    // Quitar el código de país si ya está
    if (clean.startsWith('56')) {
        clean = clean.slice(2);
    }

    if (clean.length === 0) return '';

    // Celular: 9XXXXXXX
    if (clean.startsWith('9')) {
        let part1 = clean.slice(0, 1); // 9
        let part2 = clean.slice(1, 5); // XXXX
        let part3 = clean.slice(5, 9); // XXXX
        return `+56 ${part1} ${part2}${part3 ? ' ' + part3 : ''}`.trim();
    }

    // Teléfono fijo: XXXX XXXX (sin 9 al inicio)
    let part1 = clean.slice(0, 4);
    let part2 = clean.slice(4, 8);
    let part3 = clean.slice(8, 12); // opcional, por si hay extensión
    return `+56 ${part1}${part2 ? ' ' + part2 : ''}${part3 ? ' ' + part3 : ''}`.trim();
};
