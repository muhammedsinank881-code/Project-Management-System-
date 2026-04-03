import React, { useState } from "react";
import { useAuth, usePermission } from "../../context/AouthContext";
import { useNavigate } from "react-router-dom";

const Employees = () => {
  // ✅ FIX: destructure deleteUser and updateUser — they were missing before
  const { users, deleteUser, updateUser } = useAuth();
  const { hasPermission } = usePermission();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  // ✅ Edit modal state
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleEditOpen = (emp) => {
    setEditingUser(emp);
    setEditForm({ name: emp.name, email: emp.email, role: emp.role });
  };

  const handleEditSave = async () => {
    await updateUser({ ...editingUser, ...editForm });
    setEditingUser(null);
  };

  return (
    <div className="p-6 w-100 md:w-300 flex flex-col gap-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-start md:justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-1 md:p-2 rounded"
          />
          {hasPermission("add_employee") && (
            <button
              className="bg-black text-white px-1 md:px-4 md:py-2 rounded hover:scale-105 transition"
              onClick={() => navigate("/home/employee/addemployee")}
            >
              + Add Employee
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Name</th>
              <th>Email</th>
              <th className="hidden md:table-cell">Role</th>
              {(hasPermission("edit_employee") || hasPermission("delete_employee")) && (
                <th className="text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.map((emp) => (
              <tr key={emp.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{emp.name}</td>
                <td>{emp.email}</td>
                <td className="hidden md:table-cell">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    emp.role === "admin" ? "bg-blue-100 text-blue-600"
                    : emp.role === "super_admin" ? "bg-purple-100 text-purple-600"
                    : "bg-gray-200 text-gray-700"
                  }`}>
                    {emp.role}
                  </span>
                </td>
                <td className="flex gap-6 justify-center p-4">
                  {hasPermission("edit_employee") && (
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleEditOpen(emp)}
                    >
                      Edit
                    </button>
                  )}
                  {hasPermission("delete_employee") && (
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => {
                        if (window.confirm(`Delete ${emp.name}?`)) deleteUser(emp.id);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex gap-3 w-full justify-end">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-2 rounded ${currentPage === i + 1 ? "bg-gray-800 text-white" : "bg-white"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* ✅ EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 relative">
            <button onClick={() => setEditingUser(null)} className="absolute top-3 right-3">✖</button>
            <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
            <div className="flex flex-col gap-3">
              <input
                className="border p-2 rounded"
                placeholder="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <input
                className="border p-2 rounded"
                placeholder="Email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
              <input
                className="border p-2 rounded"
                placeholder="Role"
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              />
              <button
                onClick={handleEditSave}
                className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Employees;