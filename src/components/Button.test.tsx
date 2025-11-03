import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
    describe('Renderizado básico', () => {
        it('debe renderizar correctamente con children', () => {
            render(<Button>Click me</Button>);

            expect(screen.getByText('Click me')).toBeInTheDocument();
        });

        it('debe renderizar como button por defecto', () => {
            render(<Button>Submit</Button>);

            const button = screen.getByText('Submit');
            expect(button.tagName).toBe('BUTTON');
        });

        it('debe tener type="button" por defecto', () => {
            render(<Button>Click</Button>);

            const button = screen.getByText('Click');
            expect(button).toHaveAttribute('type', 'button');
        });

        it('debe aplicar estilos base correctamente', () => {
            render(<Button>Click</Button>);

            const button = screen.getByText('Click');
            expect(button).toHaveClass('bg-medical-700', 'text-white', 'px-4', 'py-3', 'rounded-lg');
        });
    });

    describe('Estado isLoading', () => {
        it('debe mostrar spinner cuando isLoading es true', () => {
            const { container } = render(<Button isLoading>Submit</Button>);

            const spinner = container.querySelector('.animate-spin');
            expect(spinner).toBeInTheDocument();
            expect(screen.queryByText('Submit')).not.toBeInTheDocument();
        });

        it('debe mostrar children cuando isLoading es false', () => {
            render(<Button isLoading={false}>Submit</Button>);

            expect(screen.getByText('Submit')).toBeInTheDocument();
        });

        it('debe estar disabled cuando isLoading es true', () => {
            render(<Button isLoading>Submit</Button>);

            const button = screen.getByRole('button');
            expect(button).toBeDisabled();
        });

        it('debe aplicar estilos de disabled cuando isLoading', () => {
            render(<Button isLoading>Submit</Button>);

            const button = screen.getByRole('button');
            expect(button).toHaveClass('disabled:opacity-70', 'disabled:cursor-not-allowed');
        });

        it('no debe ejecutar onClick cuando isLoading', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();

            render(<Button isLoading onClick={handleClick}>Submit</Button>);

            const button = screen.getByRole('button');
            await user.click(button);

            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe('Estado disabled', () => {
        it('debe estar disabled cuando la prop disabled es true', () => {
            render(<Button disabled>Submit</Button>);

            const button = screen.getByText('Submit');
            expect(button).toBeDisabled();
        });

        it('debe mostrar children incluso cuando disabled', () => {
            render(<Button disabled>Click me</Button>);

            expect(screen.getByText('Click me')).toBeInTheDocument();
        });

        it('no debe ejecutar onClick cuando disabled', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();

            render(<Button disabled onClick={handleClick}>Submit</Button>);

            const button = screen.getByText('Submit');
            await user.click(button);

            expect(handleClick).not.toHaveBeenCalled();
        });

        it('debe estar disabled si tanto isLoading como disabled son true', () => {
            render(<Button isLoading disabled>Submit</Button>);

            const button = screen.getByRole('button');
            expect(button).toBeDisabled();
        });
    });

    describe('Estado isActive', () => {
        it('debe aceptar prop isActive sin errores', () => {
            render(<Button isActive>Active Button</Button>);

            expect(screen.getByText('Active Button')).toBeInTheDocument();
        });

        it('debe aceptar isActive={false} sin errores', () => {
            render(<Button isActive={false}>Inactive Button</Button>);

            expect(screen.getByText('Inactive Button')).toBeInTheDocument();
        });
    });

    describe('Eventos', () => {
        it('debe ejecutar onClick cuando se hace click', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();

            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByText('Click me');
            await user.click(button);

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('debe pasar el evento al onClick handler', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();

            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByText('Click me');
            await user.click(button);

            expect(handleClick).toHaveBeenCalled();
            const event = handleClick.mock.calls[0][0];
            expect(event.type).toBe('click');
        });

        it('debe funcionar sin onClick definido', async () => {
            const user = userEvent.setup();

            render(<Button>Click me</Button>);

            const button = screen.getByText('Click me');
            await expect(user.click(button)).resolves.not.toThrow();
        });

        it('debe permitir múltiples clicks', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();

            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByText('Click me');
            await user.click(button);
            await user.click(button);
            await user.click(button);

            expect(handleClick).toHaveBeenCalledTimes(3);
        });
    });

    describe('Props adicionales', () => {
        it('debe aplicar className personalizado', () => {
            render(<Button className="custom-class">Click</Button>);

            const button = screen.getByText('Click');
            expect(button).toHaveClass('custom-class');
        });

        it('debe preservar clases base con className personalizado', () => {
            render(<Button className="custom-class">Click</Button>);

            const button = screen.getByText('Click');
            expect(button).toHaveClass('bg-medical-700', 'custom-class');
        });

        it('debe aplicar className vacío por defecto', () => {
            render(<Button>Click</Button>);

            const button = screen.getByText('Click');
            expect(button).toBeInTheDocument();
        });

        it('debe aceptar type personalizado', () => {
            render(<Button type="submit">Submit</Button>);

            const button = screen.getByText('Submit');
            expect(button).toHaveAttribute('type', 'submit');
        });

        it('debe pasar props HTML adicionales', () => {
            render(
                <Button
                    aria-label="Custom button"
                    data-testid="custom-btn"
                >
                    Click
                </Button>
            );

            const button = screen.getByText('Click');
            expect(button).toHaveAttribute('aria-label', 'Custom button');
            expect(button).toHaveAttribute('data-testid', 'custom-btn');
        });

        it('debe soportar name attribute', () => {
            render(<Button name="submit-button">Submit</Button>);

            const button = screen.getByText('Submit');
            expect(button).toHaveAttribute('name', 'submit-button');
        });
    });

    describe('Estilos visuales', () => {
        it('debe tener estilos de hover', () => {
            render(<Button>Hover me</Button>);

            const button = screen.getByText('Hover me');
            expect(button).toHaveClass('hover:bg-green-800');
        });

        it('debe tener transiciones de color', () => {
            render(<Button>Click</Button>);

            const button = screen.getByText('Click');
            expect(button).toHaveClass('transition-colors');
        });

        it('debe tener estilos de flexbox para centrar contenido', () => {
            render(<Button>Click</Button>);

            const button = screen.getByText('Click');
            expect(button).toHaveClass('flex', 'items-center', 'justify-center');
        });

        it('debe tener gap entre elementos', () => {
            render(<Button>Click</Button>);

            const button = screen.getByText('Click');
            expect(button).toHaveClass('gap-2');
        });
    });

    describe('Spinner de carga', () => {
        it('debe renderizar spinner con clases correctas', () => {
            const { container } = render(<Button isLoading>Loading</Button>);

            const spinner = container.querySelector('.animate-spin');
            expect(spinner).toHaveClass('w-5', 'h-5', 'border-2', 'border-white', 'border-t-transparent', 'rounded-full');
        });

        it('debe mostrar solo spinner cuando isLoading', () => {
            const { container } = render(
                <Button isLoading>
                    <span>Text</span>
                    <span>More text</span>
                </Button>
            );

            const spinner = container.querySelector('.animate-spin');
            expect(spinner).toBeInTheDocument();
            expect(screen.queryByText('Text')).not.toBeInTheDocument();
            expect(screen.queryByText('More text')).not.toBeInTheDocument();
        });
    });

    describe('Children variados', () => {
        it('debe renderizar children con texto simple', () => {
            render(<Button>Simple text</Button>);

            expect(screen.getByText('Simple text')).toBeInTheDocument();
        });

        it('debe renderizar children con elementos JSX', () => {
            render(
                <Button>
                    <span>Icon</span>
                    <span>Text</span>
                </Button>
            );

            expect(screen.getByText('Icon')).toBeInTheDocument();
            expect(screen.getByText('Text')).toBeInTheDocument();
        });

        it('debe renderizar children con iconos', () => {
            render(
                <Button>
                    <svg data-testid="icon">
                        <path d="M0 0h24v24H0z" />
                    </svg>
                    Submit
                </Button>
            );

            expect(screen.getByTestId('icon')).toBeInTheDocument();
            expect(screen.getByText('Submit')).toBeInTheDocument();
        });
    });
});