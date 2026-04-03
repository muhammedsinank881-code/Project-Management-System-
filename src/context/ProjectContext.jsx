import { createContext, useContext, useEffect, useState } from "react";
import { useNotification } from "./NotificationContext";   // ← add this

const ProjectContext = createContext();
const PROJECT_API = "http://localhost:3001/projects";
const USERS_API   = "http://localhost:3001/users";

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const { addNotification } = useNotification();           // ← add this

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const res  = await fetch(PROJECT_API);
    const data = await res.json();
    setProjects(data);
  };

  const addProject = async (project) => {
  const newProject = {
    ...project,
    status: "active",
    startDate: new Date().toISOString(),
    endDate: null,
  };

  const res = await fetch(PROJECT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProject),
  });
  const saved = await res.json(); // ← has the real id from json-server
  fetchProjects();

  // Fetch all users to find admins
  const usersRes = await fetch(USERS_API);
  const allUsers = await usersRes.json();

  // Notify admins
  const admins = allUsers.filter(
    (u) => u.role === "admin" || u.role === "super_admin"
  );
  await Promise.all(
    admins.map((admin) =>
      addNotification({
        userId: admin.id,
        message: `New project "${saved.name}" was created.`,
        type: "project",
        projectId: saved.id,
      })
    )
  );

  // Notify assigned members (skip if they're already notified as admin)
  const adminIds = new Set(admins.map((a) => a.id));
  if (newProject.members?.length) {
    await Promise.all(
      newProject.members
        .filter((m) => !adminIds.has(m.userId)) // avoid double-notifying admin members
        .map((member) =>
          addNotification({
            userId: member.userId,
            message: `You've been assigned "${member.task}" in project "${saved.name}".`,
            type: "task",
            projectId: saved.id,
          })
        )
    );
  }
};

  // deleteProject, updateProject, completeTask stay the same...
  const deleteProject = async (id) => {
    await fetch(`${PROJECT_API}/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  const updateProject = async (updatedProject) => {
    await fetch(`${PROJECT_API}/${updatedProject.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProject),
    });
    fetchProjects();
  };

  const completeTask = async (projectId, userId) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    const updatedMembers = project.members.map((m) =>
      m.userId === userId ? { ...m, status: "completed" } : m
    );
    const allDone = updatedMembers.every((m) => m.status === "completed");
    await updateProject({
      ...project,
      members: updatedMembers,
      status: allDone ? "completed" : project.status,
      endDate: allDone ? new Date().toISOString() : project.endDate,
    });
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, deleteProject, updateProject, completeTask }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);