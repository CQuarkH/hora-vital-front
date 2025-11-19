import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminSettingsPage from '../../../src/pages/secretary/AdminSettingsPage';

describe('AdminSettingsPage', () => {
    it('debe renderizar el título y la descripción', () => {
        render(<AdminSettingsPage />);
        
        expect(screen.getByText('Configuración del Sistema')).toBeInTheDocument();
        expect(screen.getByText(/Panel para configurar los ajustes generales del sistema/)).toBeInTheDocument();
    });
});