import { describe, it, expect } from 'vitest';

import { formatRUT, formatPhoneNumber } from './formatters';


describe('formatters - formatRUT', () => {

    describe('Casos básicos', () => {

        it('debe retornar string vacío para input vacío', () => {
            expect(formatRUT('')).toBe('');
        });

        it('debe formatear RUT de 8 dígitos con puntos y guión', () => {
            expect(formatRUT('123456785')).toBe('12.345.678-5');
        });

        it('debe formatear RUT de 7 dígitos con puntos y guión', () => {
            expect(formatRUT('6520431')).toBe('652.043-1');
        });

        it('debe formatear RUT con K mayúscula', () => {
            expect(formatRUT('18365232K')).toBe('18.365.232-K');
        });

        it('debe convertir k minúscula a K mayúscula', () => {
            expect(formatRUT('18365232k')).toBe('18.365.232-K');
        });

    });



    describe('Casos con caracteres especiales', () => {
        it('debe remover puntos existentes y reformatear', () => {
            expect(formatRUT('12.345.678-5')).toBe('12.345.678-5');
        });

        it('debe remover guiones existentes y reformatear', () => {
            expect(formatRUT('12345678-5')).toBe('12.345.678-5');
        });

        it('debe remover caracteres no numéricos excepto K', () => {
            expect(formatRUT('12abc345def678-5')).toBe('12.345.678-5');
        });

        it('debe remover espacios y reformatear', () => {
            expect(formatRUT('12 345 678 5')).toBe('12.345.678-5');
        });

    });



    describe('Casos edge', () => {
        it('debe manejar solo un carácter', () => {
            expect(formatRUT('K')).toBe('K');
        });

        it('debe manejar dos caracteres', () => {
            expect(formatRUT('1K')).toBe('1-K');
        });



        it('debe manejar tres caracteres', () => {

            expect(formatRUT('12K')).toBe('12-K');

        });



        it('debe formatear correctamente RUT con dígito verificador 0', () => {

            expect(formatRUT('201414660')).toBe('20.141.466-0');

        });

    });

});



describe('formatters - formatPhoneNumber', () => {

    describe('Casos básicos - celular (9XXXXXXXX)', () => {

        it('debe retornar string vacío para input vacío', () => {

            expect(formatPhoneNumber('')).toBe('');

        });



        it('debe formatear celular de 9 dígitos correctamente', () => {

            expect(formatPhoneNumber('912345678')).toBe('+56 9 1234 5678');

        });



        it('debe formatear celular con código de país 56', () => {

            expect(formatPhoneNumber('56912345678')).toBe('+56 9 1234 5678');

        });



        it('debe formatear celular parcial (5 dígitos)', () => {

            expect(formatPhoneNumber('91234')).toBe('+56 9 1234');

        });



        it('debe formatear celular parcial (menos de 5 dígitos)', () => {

            expect(formatPhoneNumber('912')).toBe('+56 9 12');

        });

    });



    describe('Casos básicos - teléfono fijo', () => {

        it('debe formatear teléfono fijo de 8 dígitos', () => {

            expect(formatPhoneNumber('22345678')).toBe('+56 2234 5678');

        });



        it('debe formatear teléfono fijo de 9 dígitos', () => {

            expect(formatPhoneNumber('223456789')).toBe('+56 2234 56789');

        });



        it('debe formatear teléfono fijo parcial (4 dígitos)', () => {

            expect(formatPhoneNumber('2234')).toBe('+56 2234');

        });



        it('debe formatear teléfono fijo parcial (menos de 4 dígitos)', () => {

            expect(formatPhoneNumber('22')).toBe('+56 22');

        });

    });



    describe('Casos con caracteres especiales', () => {

        it('debe remover caracteres no numéricos', () => {
            expect(formatPhoneNumber('9-1234-5678')).toBe('+56 9 1234 5678');
        });

        it('debe remover espacios y reformatear', () => {
            expect(formatPhoneNumber('9 1234 5678')).toBe('+56 9 1234 5678');
        });


        it('debe remover paréntesis y reformatear', () => {
            expect(formatPhoneNumber('(9) 1234-5678')).toBe('+56 9 1234 5678');
        });


        it('debe remover código +56 si ya existe', () => {
            expect(formatPhoneNumber('+56 9 1234 5678')).toBe('+56 9 1234 5678');
        });

    });



    describe('Casos edge', () => {

        it('debe manejar solo un dígito', () => {
            expect(formatPhoneNumber('9')).toBe('+56 9');
        });


        it('debe manejar código de país con espacios', () => {
            expect(formatPhoneNumber('56 9 1234 5678')).toBe('+56 9 1234 5678');
        });

        it('debe manejar input con solo letras', () => {
            expect(formatPhoneNumber('abc')).toBe('');
        });

    });

});