import React from "react";
import { useAuth } from "../../context/AouthContext";
import TaskSection from "./TaskSection";
import DashboardStats from "../dashbordContents/DashboardStats";

const Admin = () => {
    const { user } = useAuth();

    return (
        <div className="flex flex-col gap-6 md:gap-10 w-full max-w-6xl">
            
            {/* Welcome Section */}
            <div className="bg-white/70 backdrop-blur-lg p-6 md:p-10 rounded-3xl shadow-2xl text-center">
                <h1 className="text-4xl font-bold mb-4">
                    Welcome, {user?.name || "User"}!
                </h1>
                <p className="text-gray-600">
                    {user?.role === "admin" || user?.role === "super_admin"
                        ? "Manage your employees, projects, and tasks from here."
                        : "View your assigned projects and update your tasks."}
                </p>
            </div>

            {/* Dashboard Statistics */}
            <DashboardStats />

            {/* Task Section */}
            <div className=" w-full mb-10">
                <TaskSection />
            </div>

        </div>
    );
};

export default Admin;