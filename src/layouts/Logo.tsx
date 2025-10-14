import { FaHeartbeat } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function Logo() {
    const navigate = useNavigate()

    return (
        <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/home')}
        >
            <FaHeartbeat className="text-2xl text-medical-600" />
            <span className="text-2xl font-bold text-gray-900 mb-1">Hora Vital</span>
        </div>
    )
}


export default Logo