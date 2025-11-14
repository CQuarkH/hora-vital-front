import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleSwitch } from './ToggleSwitch';

describe('ToggleSwitch Component', () => {
    it('debe renderizar en estado "enabled" (encendido)', () => {
        render(<ToggleSwitch enabled={true} onChange={() => {}} />);
        const button = screen.getByRole('switch');
        expect(button).toHaveAttribute('aria-checked', 'true');
        expect(button).toHaveClass('bg-medical-600');
    });

    it('debe renderizar en estado "disabled" (apagado)', () => {
        render(<ToggleSwitch enabled={false} onChange={() => {}} />);
        const button = screen.getByRole('switch');
        expect(button).toHaveAttribute('aria-checked', 'false');
        expect(button).toHaveClass('bg-gray-200');
    });

    it('debe llamar a onChange con "true" cuando se hace clic y estaba apagado', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(<ToggleSwitch enabled={false} onChange={handleChange} />);

        await user.click(screen.getByRole('switch'));

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('debe llamar a onChange con "false" cuando se hace clic y estaba encendido', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(<ToggleSwitch enabled={true} onChange={handleChange} />);

        await user.click(screen.getByRole('switch'));

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('no debe llamar a onChange si está deshabilitado', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(<ToggleSwitch enabled={false} onChange={handleChange} disabled={true} />);

        const button = screen.getByRole('switch');
        await user.click(button);

        expect(handleChange).not.toHaveBeenCalled();
        expect(button).toHaveClass('cursor-not-allowed', 'opacity-50');
    });
});