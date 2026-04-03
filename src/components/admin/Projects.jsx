import React, { useState } from "react";
import { useAuth } from "../../context/AouthContext";
import { useProject } from "../../context/ProjectContext";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext"; // Add this

const Projects = () => {
  const { user } = useAuth();
  const { hasPermission } = useRole(); // Add this
  const { projects, deleteProject, updateProject } = useProject();
  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Check permissions using user's role
  const canAddProject = hasPermission(user?.role, "add_project");
  const canEditProject = hasPermission(user?.role, "edit_project");
  const canDeleteProject = hasPermission(user?.role, "delete_project");
  const canViewProjects = hasPermission(user?.role, "view_projects");

  if (!canViewProjects) {
    return <div className="p-6">You don't have permission to view projects</div>;
  }

  const filteredProject = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedProject = filteredProject.slice().sort((a,b)=> new Date(b.startDate)- new Date(a.startDate))

  const [currentPage , setCurrentPage] = useState(1)
  const itemsPerPage = 9
  const startIndex = (currentPage -1)*itemsPerPage
  const currentData = sortedProject.slice(startIndex, startIndex+itemsPerPage)
  const totalPages = Math.ceil(filteredProject.length / itemsPerPage)

    

  return (
    <div className="p-6 md:w-300 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />
          {canAddProject && (
            <button
              className="bg-black text-white px-4 py-2 rounded hover:scale-105 transition"
              onClick={() => navigate("/home/project/addproject")}
            >
              + Add New Project
            </button>
          )}
        </div>
      </div>

      {/* Rest of your projects grid */}
      <div className="grid grid-cols-3 gap-6">
        {currentData?.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
          >
            <h2 className="text-lg font-semibold mb-2">{project.name}</h2>
            <p className="text-gray-600 text-sm mb-4">{project.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{project.members?.length || 0} Members</span>
              <span className={`px-3 py-1 rounded-full text-xs ${project.status === "completed" ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-700"}`}>
                {project.status || "active"}
              </span>
            </div>
          </div>
        ))}
      </div>

      

      {/* Modal with conditional edit/delete buttons */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
          <div className="bg-white w-125 p-6 rounded-2xl shadow-2xl relative">
            <button onClick={() => setSelectedProject(null)} className="absolute top-3 right-3">✖</button>
            
            <h2 className="text-2xl font-bold mb-3">{selectedProject.name}</h2>
            <p className="text-gray-600 mb-4">{selectedProject.description}</p>
            
            <div className="text-sm text-gray-500 mb-4">
              <p>Start: {selectedProject.startDate?.slice(0, 10)}</p>
              <p>Dead-Line: {selectedProject.deadline?.slice(0, 10)}</p>
              <p>End: {selectedProject.endDate ? selectedProject.endDate.slice(0, 10) : "Not completed"}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Team & Tasks</h3>
              <div className="space-y-2 overflow-y-auto h-60 no-scrollbar">
                {selectedProject.members?.map((m, i) => (
                  <div key={i} className="flex justify-between bg-gray-100 p-2 rounded">
                    <span>{m.username || "User"}</span>
                    <span className="text-sm">
                      {m.task} —{" "}
                      <span className={m.status === "completed" ? "text-green-600" : "text-orange-500"}>
                        {m.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {(canEditProject || canDeleteProject) && (
              <div className="flex gap-3 mt-6">
                {canEditProject && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/home/project/addproject", { state: selectedProject })}
                  >
                    Edit
                  </button>
                )}
                {canDeleteProject && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      if (window.confirm("Delete this project?")) {
                        deleteProject(selectedProject.id);
                        setSelectedProject(null);
                      }
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3 w-full justify-end mt-4">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-2 rounded shadow hover:shadow-lg ${currentPage === i + 1 ? "bg-gray-800 text-white" : "bg-white"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Projects;  