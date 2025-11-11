import { describe, it, expect } from 'vitest';
import { isValidRUT } from './validators';

describe('validators - isValidRUT', () => {
    describe('Casos inválidos', () => {
        it('debe rechazar RUT vacío', () => {
            expect(isValidRUT('')).toBe(false);
        });

        it('debe rechazar RUT con menos de 7 dígitos', () => {
            expect(isValidRUT('123456-7')).toBe(false);
        });

        it('debe rechazar RUT sin guión', () => {
            expect(isValidRUT('123456789')).toBe(false);
        });

        it('debe rechazar RUT con formato incorrecto', () => {
            expect(isValidRUT('12.345.678')).toBe(false);
            expect(isValidRUT('abc-d')).toBe(false);
        });

        it('debe rechazar RUT con dígito verificador incorrecto', () => {
            expect(isValidRUT('12.345.678-0')).toBe(false); // DV correcto es 5
            expect(isValidRUT('11.111.111-2')).toBe(false); // DV correcto es 1
        });
    });

    describe('Casos válidos', () => {
        it('debe aceptar RUT válido con puntos y guión', () => {
            expect(isValidRUT('12.345.678-5')).toBe(true);
        });

        it('debe aceptar RUT válido sin puntos', () => {
            expect(isValidRUT('12345678-5')).toBe(true);
        });

        it('debe aceptar RUT válido con K como dígito verificador', () => {
            expect(isValidRUT('11.111.111-1')).toBe(true); // RUT válido real
            expect(isValidRUT('18.365.232-K')).toBe(true);  // RUT válido con K
            expect(isValidRUT('18.365.232-k')).toBe(true);  // minúscula
        });

        it('debe aceptar RUT válido con 0 como dígito verificador', () => {
            expect(isValidRUT('20.141.466-0')).toBe(true); // RUT válido con 0
        });

        it('debe aceptar RUT de 7 dígitos', () => {
            expect(isValidRUT('6.520.431-2')).toBe(true);
        });

        it('debe aceptar RUT de 8 dígitos', () => {
            expect(isValidRUT('12.345.678-5')).toBe(true);
        });
    });

    describe('Casos especiales', () => {
        it('debe normalizar k minúscula a K mayúscula', () => {
            expect(isValidRUT('18.365.232-k')).toBe(true);
        });

        it('debe manejar espacios en blanco', () => {
            expect(isValidRUT('  12.345.678-5  ')).toBe(true);
        });
    });
});