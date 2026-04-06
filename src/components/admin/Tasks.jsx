// src/components/admin/Tasks.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AouthContext";
import { useProject } from "../../context/ProjectContext";
import { usePermission } from "../../context/AouthContext";

const Tasks = () => {
  const { user } = useAuth();
  const { projects, updateProject } = useProject();
  const { hasPermission } = usePermission();
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [taskForm, setTaskForm] = useState({
    task: "",
    startDate: "",
    submissionDate: "",
    status: "pending"
  });
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [search, setSearch] = useState("");

  // Permissions
  const canAssignTask = hasPermission("assign_task");
  const canEditTask = hasPermission("edit_task");

  // Filter projects based on user role
  const visibleProjects = user?.role === "super_admin" || user?.role === "admin" 
    ? projects 
    : projects.filter(project => 
        project.members?.some(m => m.userId === user?.id)
      );

  const filteredProjects = visibleProjects.filter(project =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssignTask = (project, member) => {
    setSelectedProject(project);
    setSelectedMember(member);
    setTaskForm({
      task: member.task || "",
      startDate: member.startDate || new Date().toISOString().split('T')[0],
      submissionDate: member.submissionDate || "",
      status: member.status || "pending"
    });
    setShowAssignModal(true);
  };

  const handleSaveTask = async () => {
    if (!taskForm.task.trim()) {
      alert("Please enter task description");
      return;
    }
    if (!taskForm.submissionDate) {
      alert("Please select submission date");
      return;
    }

    const updatedMembers = selectedProject.members.map(m =>
      m.userId === selectedMember.userId
        ? {
            ...m,
            task: taskForm.task,
            startDate: taskForm.startDate,
            submissionDate: taskForm.submissionDate,
            status: taskForm.status
          }
        : m
    );

    const updatedProject = {
      ...selectedProject,
      members: updatedMembers
    };

    await updateProject(updatedProject);
    setShowAssignModal(false);
    setSelectedMember(null);
    setSelectedProject(null);
    alert("Task assigned successfully!");
  };

  const getTaskStatusBadge = (status) => {
    const statuses = {
      pending: "bg-yellow-100 text-yellow-700",
      "in-progress": "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-600"
    };
    return statuses[status] || statuses.pending;
  };

  return (
    <div className="p-6 md:w-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Task Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Assign and manage tasks for project members
          </p>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-64"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar">
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-500">
            No projects found
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Project Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{project.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  </div>
                  <div className="text-sm text-right">
                    <div>
                      <span className="font-medium">Deadline:</span>{" "}
                      {project.deadline || "Not set"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {project.members?.filter(m => m.task && m.task !== "").length || 0} / {project.members?.length || 0} tasks assigned
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Employee</th>
                      <th className="p-3 text-left">Task Description</th>
                      <th className="p-3 text-left">Start Date</th>
                      <th className="p-3 text-left">Submission Date</th>
                      <th className="p-3 text-left">Status</th>
                      {canAssignTask && <th className="p-3 text-center">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {project.members?.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-4 text-center text-gray-500">
                          No members assigned to this project
                        </td>
                      </tr>
                    ) : (
                      project.members.map((member) => (
                        <tr key={member.userId} className="border-t hover:bg-gray-50">
                          <td className="p-3 font-medium">{member.username}</td>
                          <td className="p-3">
                            {member.task ? (
                              <span className="text-gray-800">{member.task}</span>
                            ) : (
                              <span className="text-gray-400 italic">Not assigned</span>
                            )}
                          </td>
                          <td className="p-3">
                            {member.startDate || <span className="text-gray-400">—</span>}
                          </td>
                          <td className="p-3">
                            {member.submissionDate ? (
                              <span className={new Date(member.submissionDate) < new Date() && member.status !== "completed" ? "text-red-600 font-medium" : ""}>
                                {member.submissionDate}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusBadge(member.status)}`}>
                              {member.status || "pending"}
                            </span>
                          </td>
                          {canAssignTask && (
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleAssignTask(project, member)}
                                className={`px-3 py-1 rounded text-sm transition ${
                                  member.task 
                                    ? "bg-blue-500 text-white hover:bg-blue-600" 
                                    : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                              >
                                {member.task ? "Edit Task" : "Assign Task"}
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assign/Edit Task Modal */}
      {showAssignModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedMember.task ? "Edit Task" : "Assign Task"}
              </h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✖
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project</label>
                <input
                  type="text"
                  value={selectedProject?.name}
                  disabled
                  className="w-full border p-2 rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Employee</label>
                <input
                  type="text"
                  value={selectedMember.username}
                  disabled
                  className="w-full border p-2 rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Task Description *</label>
                <textarea
                  value={taskForm.task}
                  onChange={(e) => setTaskForm({...taskForm, task: e.target.value})}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Describe the task in detail..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={taskForm.startDate}
                    onChange={(e) => setTaskForm({...taskForm, startDate: e.target.value})}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Submission Date *</label>
                  <input
                    type="date"
                    value={taskForm.submissionDate}
                    onChange={(e) => setTaskForm({...taskForm, submissionDate: e.target.value})}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={taskForm.status}
                  onChange={(e) => setTaskForm({...taskForm, status: e.target.value})}
                  className="w-full border p-2 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveTask}
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                  {selectedMember.task ? "Update Task" : "Assign Task"}
                </button>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;