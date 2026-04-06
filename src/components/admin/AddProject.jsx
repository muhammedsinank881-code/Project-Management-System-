// src/components/admin/AddProject.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProject } from "../../context/ProjectContext";

const USER_API = "http://localhost:3001/users";

const AddProject = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", deadline: "" });
  const [members, setMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { addProject, updateProject } = useProject();

  const editProject = location.state;

  useEffect(() => {
    fetch(USER_API).then((r) => r.json()).then(setEmployees);
  }, []);

  useEffect(() => {
    if (editProject) {
      setForm({
        name: editProject.name,
        description: editProject.description,
        deadline: editProject.deadline || "",
      });
      setMembers(editProject.members || []);
    }
  }, [editProject]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddMember = () => {
    if (!selectedUser) return;
    if (members.some((m) => m.userId === selectedUser)) {
      alert("User already added");
      return;
    }
    const emp = employees.find((e) => e.id === selectedUser);
    setMembers([...members, {
      userId: selectedUser,
      username: emp?.name,
      task: "",  // Empty task - will be assigned in Tasks page
      startDate: "",
      submissionDate: "",
      status: "pending",
    }]);
    setSelectedUser("");
  };

  const removeMember = (index) => setMembers(members.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (members.length === 0) {
      alert("Please assign at least one employee to the project");
      return;
    }
    
    if (editProject) {
      await updateProject({ ...editProject, ...form, members });
      alert("Project updated ✅");
    } else {
      await addProject({ ...form, members });
      alert("Project created ✅");
    }
    navigate("/home/project");
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-125">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {editProject ? "Edit Project" : "Create Project"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            name="name"
            placeholder="Project Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <div className="flex items-center justify-between gap-6">
            <h1 className="shrink-0">Dead-line :</h1>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Assign Employees Section - No Task Input */}
          <div className="border-t pt-4 mt-2">
            <h3 className="font-semibold mb-2">Assign Employees to Project</h3>
            <div className="flex gap-2">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddMember}
                className="bg-black text-white px-4 rounded hover:bg-gray-800"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              * Tasks will be assigned later in the Tasks page
            </p>
          </div>

          {/* Assigned Members List */}
          <div className="space-y-2 overflow-y-auto h-40 no-scrollbar">
            {members.length === 0 ? (
              <div className="text-center text-gray-400 py-4">
                No employees assigned yet
              </div>
            ) : (
              members.map((m, i) => {
                const emp = employees.find((e) => e.id === m.userId);
                return (
                  <div key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                    <div>
                      <span className="font-medium">{emp?.name || m.username}</span>
                      {m.task && m.task !== "" && (
                        <span className="text-xs text-green-600 ml-2">
                          ✓ Task assigned
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMember(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <button
            type="submit"
            className="bg-black text-white py-2 rounded hover:scale-105 transition"
          >
            {editProject ? "Update Project" : "Create Project"}
          </button>

        </form>
      </div>
    </div>
  );
};
 
export default AddProject;