import { useAuth } from '../../context/AuthContext';
import AdminHomePage from '../admin/AdminHomePage';
import PatientHomePage from '../patient/PatientHomePage';
import SecretaryHomePage from '../secretary/SecretaryHomePage';

const HomePage = () => {
    const { user } = useAuth();

    if (!user) return <div>Cargando...</div>;

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
