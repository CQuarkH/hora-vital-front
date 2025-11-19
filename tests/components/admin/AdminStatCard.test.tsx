import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminStatCard } from '../../../src/components/admin/AdminStatCard';
import { HiOutlineUser } from 'react-icons/hi';

describe('AdminStatCard', () => {
    it('debe renderizar el valor, la etiqueta y el icono', () => {
        render(
            <AdminStatCard
                value="150"
                label="Total de Usuarios"
                icon={<HiOutlineUser data-testid="card-icon" />}
            />
        );

        expect(screen.getByText('150')).toBeInTheDocument();
        expect(screen.getByText('Total de Usuarios')).toBeInTheDocument();
        expect(screen.getByTestId('card-icon')).toBeInTheDocument();
    });

    it('debe funcionar con un valor numérico', () => {
        render(
            <AdminStatCard
                value={50}
                label="Pacientes Activos"
                icon={<HiOutlineUser />}
            />
        );
        expect(screen.getByText('50')).toBeInTheDocument();
    });
});