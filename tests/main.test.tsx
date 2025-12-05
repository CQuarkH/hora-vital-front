import { describe, it, expect, vi } from 'vitest';

// Mock ReactDOM
const mockRender = vi.fn();
const mockCreateRoot = vi.fn().mockReturnValue({ render: mockRender });

vi.mock('react-dom/client', () => ({
    createRoot: mockCreateRoot
}));

vi.mock('./App.tsx', () => ({
    default: () => <div>App</div>
}));

describe('Main Entry Point', () => {
    it('debe inicializar la aplicación', async () => {
        const root = document.createElement('div');
        root.id = 'root';
        document.body.appendChild(root);

        await import('../src/main');

        expect(mockCreateRoot).toHaveBeenCalledWith(root);
        expect(mockRender).toHaveBeenCalled();
    });
});
