import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';

const MainLayout = () => {
    const location = useLocation();
    const hideHeaderRoutes = ['/login', '/register'];
    const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col gap-10">
            {!shouldHideHeader && <Header />}
            <main className="flex-1 container mx-auto max-w-[1280px]">
                <Outlet />
            </main>

        </div>
    );
};

export default MainLayout;