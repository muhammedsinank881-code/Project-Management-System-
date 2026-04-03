import { Navigate } from "react-router-dom";
import { usePermission } from "../context/AouthContext";
import { useRole } from "../context/RoleContext";

const PermissionGuard = ({ permission, children }) => {
  const { hasPermission } = usePermission();
  const { roles } = useRole();

  // ✅ Wait for roles to load before deciding — prevents false redirects
  if (roles.length === 0) return null;

  if (!hasPermission(permission)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PermissionGuard;