// src/components/admin/Roles.jsx
import React, { useState } from "react";
import { useRole } from "../../context/RoleContext";
import { usePermission } from "../../context/AouthContext";
import AddRoleModal from "./AddRoleModal";

const Roles = () => {
  const { roles, addRole, deleteRole, updateRole } = useRole();
  const {hasPermission } = usePermission()

  const [roleName, setRoleName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false); 
  // For editing role
  const [editingRole, setEditingRole] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleOpenAddModal = () => {
    if (!roleName) {
      alert("Please enter a role name first");
      return;
    }
    setShowAddModal(true);
  };

  // Handle Edit - Open modal with existing role data
  const handleEdit = (role) => {
    setEditingRole(role);
    setShowEditModal(true);
  };

  return (
    <div className="p-6 md:w-300">
      <h1 className="text-2xl font-bold mb-6">Roles & Permissions</h1>

      {/* ADD ROLE SECTION */}
      {hasPermission("add_role") && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Create New Role</h2>
        <div className="flex gap-4">
          <input
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Enter role name (e.g., Manager, Team Lead)"
            className="border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-black"
            onKeyPress={(e) => e.key === 'Enter' && handleOpenAddModal()}
          />
          <button
            onClick={handleOpenAddModal}
            className="bg-black text-white px-6 rounded hover:bg-gray-800 transition"
          >
            Next: Set Permissions →
          </button>
        </div>
      </div>
      )}

      {/* ADD ROLE MODAL */}
      <AddRoleModal
        isOpen={showAddModal}
        title={`Set Permissions for: ${roleName}`}
        onSave={async (permissions) => {
          await addRole({ 
            name: roleName, 
            permissions: permissions 
          });
          setRoleName("");
          setShowAddModal(false);
        }}
        onClose={() => {
          setShowAddModal(false);
        }}
        initialPermissions={[]}
        isEditing={false}
      />

      {/* EDIT ROLE MODAL */}
      {editingRole && (
        <AddRoleModal
          isOpen={showEditModal}
          title={`Edit Role: ${editingRole.name}`}
          onSave={async (permissions, newName) => {
            const updatedRole = {
              ...editingRole,
              name: newName,
              permissions: permissions
            };
            await updateRole(updatedRole);
            setShowEditModal(false);
            setEditingRole(null);
          }}
          onClose={() => {
            setShowEditModal(false);
            setEditingRole(null);
          }}
          initialPermissions={editingRole.permissions || []}
          initialName={editingRole.name}
          isEditing={true}
        />
      )}

      {/* ROLES LIST */}
      <div className="bg-white rounded-lg shadow ">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Existing Roles</h2>
        </div>
        
        <div className="divide-y flex flex-col overflow-y-auto no-srcollbar h-90 no-scrollbar ">
          {roles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No roles created yet. Click "Next: Set Permissions" to create your first role.
            </div>
          ) : (
            roles.map((role) => (
              <div key={role.id} className="flex justify-between items-center p-4 hover:bg-gray-50 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{role.name}</span>
                    {role.name === "super_admin" && (
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">
                        Built-in
                      </span>
                    )}
                  </div>
                  <div className="mt-1">
                    <span className="text-xs text-gray-500">
                      {role.permissions?.length || 0} permission{role.permissions?.length !== 1 ? 's' : ''}
                    </span>
                   
                  </div>
                </div>

                <div className="flex gap-3">
                  {role.name !== "super_admin" ? (
                    <>
                      { hasPermission("edit_role") && (
                        <button 
                        onClick={() => handleEdit(role)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                      >
                        Edit
                      </button>
                      )}
                      { hasPermission("delete_role") && (
                        <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete role "${role.name}"?`)) {
                            deleteRole(role.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                      >
                        Delete
                      </button>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">Protected</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
};

export default Roles;