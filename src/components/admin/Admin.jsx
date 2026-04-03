import React from "react";
import NaveBar from "../NaveBar";
import { useAuth } from "../../context/AouthContext";
import TaskSection from "./TaskSection";
const Admin = () => {
    const { user } = useAuth();

    return (
       
            <div className="flex flex-col gap-6 md:gap-10 items-center justify-center md:h-[80vh] ">
                <div className="bg-white/70 backdrop-blur-lg p-6 dm:p-10 rounded-3xl shadow-2xl text-center">

                    <h1 className="text-4xl font-bold mb-4">
                        Welcome, {user?.name || "User"}
                    </h1>

                    <p className="text-gray-600">
                        {user?.role === "admin" || user?.role === "super_admin"
                            ? "Manage your employees, projects, and tasks from here."
                            : "View your assigned projects and update your tasks."}
                    </p>

                </div>

                 <div className="max-w-md mx-auto">
                    <TaskSection />
                </div>

            </div>
    );
};

export default Admin;