import React from "react";
import { useAuth } from "../../context/AouthContext";
import { useProject } from "../../context/ProjectContext";

const TaskSection = () => {
  const { user } = useAuth();
  const { projects, completeTask } = useProject();

  //  Get only current user's tasks
  const myTasks = projects.flatMap((project) =>
    project.members
      ?.filter((m) => m.userId === user?.id)
      .map((m) => ({
        ...m,
        projectId: project.id,
        projectName: project.name,
      }))
  ).reverse()



  return (
    <div className="bg-white p-6 rounded-2xl w-70 md:w-110 h-fit shadow-2xl ">

      <h2 className="text-xl font-bold mb-4 text-center">
        My Tasks
      </h2>

      <div className="space-y-3 overflow-y-auto h-50 no-scrollbar">

        {myTasks.length === 0 && (
          <p className="text-gray-500 text-center">
            No tasks assigned
          </p>
        )}

        {myTasks.flatMap((task, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
          >

            {/* LEFT */}
            <div>
              <p className="font-semibold text-sm">
                {task.projectName}
              </p>
              <p className="text-xs text-gray-600">
                {task.task}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">

              <span
                className={
                  task.status === "completed"
                    ? "text-green-600 text-xs"
                    : "text-orange-500 text-xs"
                }
              >
                {task.status}
              </span>

              {task.status !== "completed" && (
                <button
                  onClick={() =>
                    completeTask(task.projectId, user.id)
                  }
                  className="bg-black text-white px-2 py-1 text-xs rounded"
                >
                  Done
                </button>
              )}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default TaskSection;