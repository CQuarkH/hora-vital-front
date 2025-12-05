import { describe, it, expect } from 'vitest';
import { router } from '../../src/routes/index';

describe('Router Configuration', () => {
    it('debe tener las rutas principales configuradas', () => {
        const routes = router.routes;
        expect(routes).toHaveLength(2);

        const mainRoute = routes[0];
        expect(mainRoute.path).toBe('/');
        expect(mainRoute.children).toBeDefined();

        const childrenPaths = mainRoute.children?.map(r => r.path || (r.index ? 'index' : ''));
        expect(childrenPaths).toContain('index');
        expect(childrenPaths).toContain('login');
        expect(childrenPaths).toContain('register');
        expect(childrenPaths).toContain('home');
        expect(childrenPaths).toContain('profile');
    });
});
