import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from '../../../hooks/auth/authHook';

export const AuthOutlet = ({fallBackPath}) => {
    return isAuthenticated() == 'true' ? <Outlet /> : <Navigate to={fallBackPath} replace/>;
}