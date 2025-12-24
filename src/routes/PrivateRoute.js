import { Navigate, Outlet } from "react-router-dom";
import { hasSession } from "../services/session";

const PrivateRoute = () => {
    return hasSession() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute; 
