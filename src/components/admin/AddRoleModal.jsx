// src/components/admin/AddRoleModal.jsx
import React, { useState } from "react";

const AddRoleModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  title, 
  initialName = "", 
  initialPermissions = [], 
  isEditing = false 
}) => {
  const [localPermissions, setLocalPermissions] = useState(initialPermissions);
  const [localName, setLocalName] = useState(initialName);
  const [error, setError] = useState("");

  // Permission options
  const permissionOptions = [
    { id: "view_employees", label: "View Employees" },
    { id: "add_employee", label: "Add Employee" },
    { id: "edit_employee", label: "Edit Employee" },
    { id: "delete_employee", label: "Delete Employee" },
    { id: "view_projects", label: "View Projects" },
    { id: "add_project", label: "Add Project" },
    { id: "edit_project", label: "Edit Project" },
    { id: "delete_project", label: "Delete Project" },
    { id: "view_tasks", label: "View Tasks" },
    { id: "complete_task", label: "Complete Task" },
    { id: "assign_task" , label: "Assign Task"},
    { id: "edit_task" , label: "Edit Task"},
    { id: "view_roles", label: "View Roles" },
    { id: "add_role", label: "Add Role" },
    { id: "edit_role", label: "Edit Role" },
    { id: "delete_role", label: "Delete Role" },
  ];

  const toggleLocalPermission = (permissionId) => {
    setLocalPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = () => {
    if (isEditing && !localName.trim()) {
      setError("Role name cannot be empty");
      return;
    }
    setError("");
    onSave(localPermissions, localName);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto no-scrollbar">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✖
          </button>
        </div>

        {/* Role Name Input - Only show when editing */}
        {isEditing && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Role Name
            </label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter role name"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        )}

        {/* Quick Select Buttons */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Permissions
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setLocalPermissions(permissionOptions.map(p => p.id))}
              className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 transition"
            >
              Select All
            </button>
            <button
              onClick={() => setLocalPermissions([])}
              className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 transition"
            >
              Clear All
            </button>
            <button
              onClick={() => setLocalPermissions(["view_projects", "add_project", "edit_project", "delete_project"])}
              className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 transition"
            >
              Projects Only
            </button>
            <button
              onClick={() => setLocalPermissions(["view_employees", "add_employee", "edit_employee", "delete_employee"])}
              className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 transition"
            >
              Employees Only
            </button>
            <button
              onClick={() => setLocalPermissions(["view_tasks", "complete_task"])}
              className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 transition"
            >
              Tasks Only
            </button>
          </div>
        </div>

        {/* Permission Checkboxes Grid */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            {permissionOptions.map(permission => (
              <label key={permission.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPermissions.includes(permission.id)}
                  onChange={() => toggleLocalPermission(permission.id)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm">{permission.label}</span>
              </label>
            ))}
          </div>
        </div>

        

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            {isEditing ? 'Save Changes' : `Create Role with ${localPermissions.length} Permissions`}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoleModal;