import { useNavigate } from "react-router-dom";
import type { User } from "../types/auth/auth_types";

export default function ProfileTile(user: User) {
    const initials = user.firstName.charAt(0) + user.lastName.charAt(0);
    const navigate = useNavigate();

    return (
        <div className="flex gap-2 items-center text-sm cursor-pointer" onClick={() => navigate(`/profile`)}>
            <div className="w-8 h-8 rounded-full bg-medical-600 flex items-center justify-center text-white font-bold">
                {initials.toUpperCase()}
            </div>
            <div className="flex flex-col text-xs">
                <span className="font-semibold">{`${user.firstName} ${user.lastName}`}</span>
                <span className="text-xs text-gray-600">{user.rut}</span>
            </div>
        </div>
    )
}
