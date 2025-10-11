import { IoIosArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

export default function BackToHome() {
    const navigate = useNavigate();
    return (
        <span onClick={() => navigate('/')} className="text-gray-600 cursor-pointer"   >
            <IoIosArrowRoundBack className="inline-block mr-1" />
            Volver al inicio</span>
    )
}
