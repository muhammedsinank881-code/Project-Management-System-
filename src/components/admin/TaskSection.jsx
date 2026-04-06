import React, { useState } from "react";
import { useAuth } from "../../context/AouthContext";
import { useProject } from "../../context/ProjectContext";

const TaskSection = () => {
  const { user } = useAuth();
  const { projects, completeTask } = useProject();
  const [filter, setFilter] = useState("all"); // "all", "pending", "completed"

  // Get only current user's tasks
  const myTasks = projects.flatMap((project) =>
    project.members
      ?.filter((m) => m.userId === user?.id)
      .map((m) => ({
        ...m,
        projectId: project.id,
        projectName: project.name,
      }))
  ).reverse();

  // Filter tasks based on selected filter
  const filteredTasks = myTasks.filter((task) => {
    if (filter === "pending") return task.status !== "completed";
    if (filter === "completed") return task.status === "completed";
    return true; // "all" filter
  });

  // Count tasks by status
  const pendingCount = myTasks.filter(t => t.status !== "completed").length;
  const completedCount = myTasks.filter(t => t.status === "completed").length;

  return (
    <div className="bg-white p-6 rounded-2xl w-full h-fit shadow-2xl mb-10">

      <h2 className="text-xl font-bold mb-4 text-center">
        My Tasks
      </h2>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 justify-center">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
            filter === "all"
              ? "bg-gray-800 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All ({myTasks.length})
        </button>
        
        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
            filter === "pending"
              ? "bg-orange-500 text-white"
              : "bg-orange-100 text-orange-700 hover:bg-orange-200"
          }`}
        >
          Pending ({pendingCount})
        </button>
        
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
            filter === "completed"
              ? "bg-green-600 text-white"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto h-50 no-scrollbar">

        {filteredTasks.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            {filter === "pending" && " No pending tasks! Great job!"}
            {filter === "completed" && " No completed tasks yet"}
            {filter === "all" && "No tasks assigned"}
          </p>
        )}

        {filteredTasks.map((task, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
          >
            {/* LEFT */}
            <div className="flex-1">
              <p className="font-semibold text-sm">
                {task.projectName}
              </p>
              <p className="text-xs text-gray-600">
                {task.task}
              </p>
              {/* Show submission date if exists */}
              {task.submissionDate && (
                <p className="text-xs text-gray-400 mt-1">
                  Due: {task.submissionDate}
                </p>
              )}
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 ml-2">

              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {task.status === "completed" ? "✓ Done" : " Pending"}
              </span>

              {task.status !== "completed" && (
                <button
                  onClick={() => completeTask(task.projectId, user.id)}
                  className="bg-black text-white px-3 py-1 text-xs rounded hover:bg-gray-800 transition"
                >
                  Complete
                </button>
              )}

            </div>

          </div>
        ))}

      </div>

      {/* Progress Summary */}
      {myTasks.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round((completedCount / myTasks.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / myTasks.length) * 100}%` }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default TaskSection;