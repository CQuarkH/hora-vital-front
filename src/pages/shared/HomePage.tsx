import { useAuth } from '../../context/AuthContext';
import AdminHomePage from '../admin/AdminHomePage';
import PatientHomePage from '../patient/PatientHomePage';
import SecretaryHomePage from '../secretary/SecretaryHomePage';
import OnboardingPage from '../auth/OnboardingPage';

const HomePage = () => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div role="status" className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
    );

    if (!user) return <OnboardingPage />;

    switch (user.role) {
        case 'admin':
            return <AdminHomePage />;
        case 'patient':
            return <PatientHomePage />;
        case 'secretary':
            return <SecretaryHomePage />;
        default:
            return <div>No se encontró un dashboard para tu rol.</div>;
    }
};

export default HomePage;