import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const RoleContext = createContext();

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:3001/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const addRole = async (roleData) => {
    try {
      const newRole = {
        id: Date.now().toString(),
        name: roleData.name,
        permissions: roleData.permissions || [], // Store permissions
      };
      const response = await axios.post("http://localhost:3001/roles", newRole);
      setRoles([...roles, response.data]);
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  const updateRole = async (updatedRole) => {
    try {
      await axios.put(`http://localhost:3001/roles/${updatedRole.id}`, updatedRole);
      setRoles(roles.map(role => role.id === updatedRole.id ? updatedRole : role));
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const deleteRole = async (roleId) => {
    try {
      await axios.delete(`http://localhost:3001/roles/${roleId}`);
      setRoles(roles.filter(role => role.id !== roleId));
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  // Helper function to check if a role has a specific permission
  const hasPermission = (roleName, permission) => {
    if (roleName === "super_admin") return true;
    const role = roles.find(r => r.name === roleName);
    return role?.permissions?.includes(permission) || false;
  };

  return (
    <RoleContext.Provider value={{
      roles,
      addRole,
      updateRole,
      deleteRole,
      hasPermission,
      fetchRoles,
    }}>
      {children}
    </RoleContext.Provider>
  );
};