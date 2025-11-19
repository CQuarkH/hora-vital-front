import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Input } from '../../src/components/Input';
import { formatRUT } from '../../src/utils/formatters';

describe('Input Component', () => {
    describe('Renderizado básico', () => {
        it('debe renderizar correctamente', () => {
            render(<Input placeholder="Enter text" />);

            const input = screen.getByPlaceholderText('Enter text');
            expect(input).toBeInTheDocument();
        });

        it('debe renderizar con label', () => {
            render(<Input label="Nombre" placeholder="Tu nombre" />);

            expect(screen.getByText('Nombre')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Tu nombre')).toBeInTheDocument();
        });

        it('debe renderizar sin label', () => {
            render(<Input placeholder="Sin label" />);

            const input = screen.getByPlaceholderText('Sin label');
            expect(input).toBeInTheDocument();
            expect(screen.queryByRole('label')).not.toBeInTheDocument();
        });

        it('debe aplicar type correctamente', () => {
            render(<Input type="email" placeholder="Email" />);

            const input = screen.getByPlaceholderText('Email');
            expect(input).toHaveAttribute('type', 'email');
        });

        it('debe usar type="text" por defecto', () => {
            render(<Input placeholder="Text" />);

            const input = screen.getByPlaceholderText('Text');
            expect(input).toHaveAttribute('type', 'text');
        });
    });

    describe('Estados de error y helper text', () => {
        it('debe mostrar mensaje de error', () => {
            render(<Input label="Email" error="Email inválido" />);

            expect(screen.getByText('Email inválido')).toBeInTheDocument();
        });

        it('debe mostrar helper text cuando no hay error', () => {
            render(<Input label="Password" helperText="Mínimo 8 caracteres" />);

            expect(screen.getByText('Mínimo 8 caracteres')).toBeInTheDocument();
        });

        it('debe priorizar error sobre helper text', () => {
            render(
                <Input
                    label="Email"
                    error="Email inválido"
                    helperText="Ingresa tu email"
                />
            );

            expect(screen.getByText('Email inválido')).toBeInTheDocument();
            expect(screen.queryByText('Ingresa tu email')).not.toBeInTheDocument();
        });

        it('no debe mostrar nada si no hay error ni helper text', () => {
            const { container } = render(<Input label="Nombre" />);

            const errorOrHelper = container.querySelector('.text-xs');
            expect(errorOrHelper).not.toBeInTheDocument();
        });

        it('debe aplicar clase de error al input', () => {
            render(<Input placeholder="Email" error="Error" />);

            const input = screen.getByPlaceholderText('Email');
            expect(input).toHaveClass('border-red-500');
        });

        it('debe aplicar clase normal sin error', () => {
            render(<Input placeholder="Email" />);

            const input = screen.getByPlaceholderText('Email');
            expect(input).toHaveClass('border-gray-300');
            expect(input).not.toHaveClass('border-red-500');
        });
    });

    describe('Estado disabled', () => {
        it('debe renderizar input deshabilitado', () => {
            render(<Input placeholder="Disabled" disabled />);

            const input = screen.getByPlaceholderText('Disabled');
            expect(input).toBeDisabled();
        });

        it('debe aplicar estilos de disabled al input', () => {
            render(<Input placeholder="Disabled" disabled />);

            const input = screen.getByPlaceholderText('Disabled');
            expect(input).toHaveClass('opacity-50', 'cursor-not-allowed');
        });

        it('debe aplicar opacidad al label cuando disabled', () => {
            const { container } = render(
                <Input label="Nombre" placeholder="Input" disabled />
            );

            const label = container.querySelector('label');
            expect(label).toHaveClass('opacity-70');
        });

        it('no debe permitir escribir cuando está disabled', async () => {
            const user = userEvent.setup();
            render(<Input placeholder="Disabled" disabled />);

            const input = screen.getByPlaceholderText('Disabled') as HTMLInputElement;
            await user.type(input, 'text');

            expect(input.value).toBe('');
        });
    });

    describe('Formatter', () => {
        it('debe aplicar formatter al escribir', async () => {
            const user = userEvent.setup();
            render(
                <Input
                    placeholder="RUT"
                    formatter={formatRUT}
                />
            );

            const input = screen.getByPlaceholderText('RUT') as HTMLInputElement;
            await user.type(input, '123456785');

            expect(input.value).toBe('12.345.678-5');
        });

        it('debe llamar onChange después de formatear', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();

            render(
                <Input
                    placeholder="RUT"
                    formatter={formatRUT}
                    onChange={handleChange}
                />
            );

            const input = screen.getByPlaceholderText('RUT');
            await user.type(input, '1');

            expect(handleChange).toHaveBeenCalled();
        });

        it('debe funcionar sin formatter', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();

            render(
                <Input
                    placeholder="Text"
                    onChange={handleChange}
                />
            );

            const input = screen.getByPlaceholderText('Text') as HTMLInputElement;
            await user.type(input, 'hello');

            expect(input.value).toBe('hello');
            expect(handleChange).toHaveBeenCalled();
        });

        it('debe aplicar formatter personalizado', async () => {
            const user = userEvent.setup();
            const upperCaseFormatter = (value: string) => value.toUpperCase();

            render(
                <Input
                    placeholder="Text"
                    formatter={upperCaseFormatter}
                />
            );

            const input = screen.getByPlaceholderText('Text') as HTMLInputElement;
            await user.type(input, 'hello');

            expect(input.value).toBe('HELLO');
        });
    });

    describe('Eventos y callbacks', () => {
        it('debe llamar onChange cuando el usuario escribe', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();

            render(<Input placeholder="Text" onChange={handleChange} />);

            const input = screen.getByPlaceholderText('Text');
            await user.type(input, 'a');

            expect(handleChange).toHaveBeenCalledTimes(1);
        });

        it('debe pasar el evento correcto a onChange', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();

            render(<Input placeholder="Text" onChange={handleChange} />);

            const input = screen.getByPlaceholderText('Text');
            await user.type(input, 'test');

            expect(handleChange).toHaveBeenCalled();
            const event = handleChange.mock.calls[0][0];
            expect(event.target).toBe(input);
        });

        it('debe funcionar sin onChange', async () => {
            const user = userEvent.setup();

            render(<Input placeholder="Text" />);

            const input = screen.getByPlaceholderText('Text') as HTMLInputElement;
            await user.type(input, 'test');

            expect(input.value).toBe('test');
        });
    });

    describe('Props adicionales', () => {
        it('debe aplicar className personalizado', () => {
            render(<Input placeholder="Text" className="custom-class" />);

            const input = screen.getByPlaceholderText('Text');
            expect(input).toHaveClass('custom-class');
        });

        it('debe preservar clases base con className personalizado', () => {
            render(<Input placeholder="Text" className="custom-class" />);

            const input = screen.getByPlaceholderText('Text');
            expect(input).toHaveClass('p-2', 'w-full', 'custom-class');
        });

        it('debe pasar props HTML adicionales', () => {
            render(
                <Input
                    placeholder="Text"
                    maxLength={10}
                    autoComplete="off"
                />
            );

            const input = screen.getByPlaceholderText('Text');
            expect(input).toHaveAttribute('maxLength', '10');
            expect(input).toHaveAttribute('autoComplete', 'off');
        });
    });

    describe('ForwardRef', () => {
        it('debe soportar ref correctamente', () => {
            const ref = React.createRef<HTMLInputElement>();

            render(<Input placeholder="Text" ref={ref} />);

            expect(ref.current).toBeInstanceOf(HTMLInputElement);
            expect(ref.current?.placeholder).toBe('Text');
        });

        it('debe permitir focus vía ref', () => {
            const ref = React.createRef<HTMLInputElement>();

            render(<Input placeholder="Text" ref={ref} />);

            ref.current?.focus();
            expect(ref.current).toHaveFocus();
        });
    });
});