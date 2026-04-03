import { createContext, useContext, useEffect, useState } from "react";
import { useRole } from "./RoleContext";

const AuthContext = createContext();
const API = "http://localhost:3001/users";

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); }
      catch { localStorage.removeItem("currentUser"); }
    }
    setLoading(false);
  }, []);

  const addUser = async (newUser) => {
    try {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      await fetchUsers();
      return true;
    } catch (err) {
      console.error("Add user error:", err);
      return false;
    }
  };

  // ✅ FIX: was returning plain object — Login.jsx was checking it wrong
  const login = (email, password) => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      const safeUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };
      setUser(safeUser);
      localStorage.setItem("currentUser", JSON.stringify(safeUser));
      return { success: true };
    }
    return { success: false, error: "Invalid credentials" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      await fetchUsers();
      return true;
    } catch (err) {
      console.error("Delete error:", err);
      return false;
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      await fetch(`${API}/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      await fetchUsers();
      return true;
    } catch (err) {
      console.error("Update error:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ users, user, loading, addUser, login, logout, deleteUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// ✅ usePermission hook — reads current user's role, checks against RoleContext
export const usePermission = () => {
  const { user } = useAuth();
  const { hasPermission } = useRole();

  return {
    hasPermission: (permission) => {
      if (!user) return false;
      return hasPermission(user.role, permission);
    },
  };
};