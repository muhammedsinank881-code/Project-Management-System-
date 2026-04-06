// src/components/admin/DashboardStats.jsx
import React from "react";
import { useProject } from "../../context/ProjectContext";
import { useAuth } from "../../context/AouthContext";
import { 
  HiOutlineFolder, 
  HiOutlineCheckCircle, 
  HiOutlineClock, 
  HiOutlineChartBar,
  HiOutlineUsers
} from "react-icons/hi";

const DashboardStats = () => {
  const { projects } = useProject();
  const { user } = useAuth();

  // Calculate project statistics
  const totalProjects = projects.length;
  
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const activeProjects = projects.filter(p => p.status === "active").length;
  
  // Calculate task statistics
  const totalTasks = projects.reduce((acc, p) => acc + (p.members?.length || 0), 0);
  const completedTasks = projects.reduce((acc, p) => 
    acc + (p.members?.filter(m => m.status === "completed").length || 0), 0
  );
  const pendingTasks = totalTasks - completedTasks;
  
  // Calculate project completion rate
  const completionRate = totalProjects === 0 ? 0 : Math.round((completedProjects / totalProjects) * 100);
  
  // Get user's personal stats (if employee)
  const userProjects = projects.filter(p => 
    p.members?.some(m => m.userId === user?.id)
  );
  const userTasks = userProjects.flatMap(p => 
    p.members?.filter(m => m.userId === user?.id) || []
  );
  const userCompletedTasks = userTasks.filter(t => t.status === "completed").length;
  const userPendingTasks = userTasks.length - userCompletedTasks;

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: HiOutlineFolder,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      iconColor: "text-blue-500"
    },
    {
      title: "Active Projects",
      value: activeProjects,
      icon: HiOutlineClock,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
      iconColor: "text-yellow-500"
    },
    {
      title: "Completed Projects",
      value: completedProjects,
      icon: HiOutlineCheckCircle,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      iconColor: "text-green-500",
      subText: `${completionRate}% rate`
    },
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: HiOutlineChartBar,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      iconColor: "text-purple-500",
      subText: `${completedTasks} done · ${pendingTasks} pending`
    }
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  {stat.subText && (
                    <p className="text-xs text-gray-400 mt-2">{stat.subText}</p>
                  )}
                </div>
                <div className={`${stat.bgColor} p-3 rounded-2xl`}>
                  <Icon className={`${stat.iconColor} text-2xl`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress & Breakdown Section */}
      {totalProjects > 0 && (
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">
            Project Overview
          </h3>
          
          <div className="space-y-6">
            {/* Completion Rate Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Overall Completion</span>
                <span className="font-semibold text-gray-800">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {/* Status Distribution Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-yellow-50/50 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Active Projects</p>
                  <p className="text-2xl font-bold text-yellow-700">{activeProjects}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <HiOutlineClock className="text-yellow-600 text-2xl" />
                </div>
              </div>
              
              <div className="bg-green-50/50 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Completed Projects</p>
                  <p className="text-2xl font-bold text-green-700">{completedProjects}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <HiOutlineCheckCircle className="text-green-600 text-2xl" />
                </div>
              </div>
            </div>

            {/* Task Stats */}
            <div className="border-t border-gray-200 pt-6 mt-2">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-800">{totalTasks}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Task Completion</p>
                  <p className="text-2xl font-bold text-green-600">
                    {totalTasks === 0 ? "0%" : Math.round((completedTasks / totalTasks) * 100)}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-3 text-xs text-gray-500">
                <span>✓ {completedTasks} completed</span>
                <span>⏳ {pendingTasks} pending</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personal Stats for Employees */}
      {(user?.role === "employee" || user?.role !== "super_admin") && userTasks.length > 0 && (
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">
            My Performance
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-indigo-50/50 rounded-2xl p-6 text-center">
              <div className="inline-flex p-3 bg-indigo-100 rounded-2xl mb-3">
                <HiOutlineFolder className="text-indigo-600 text-2xl" />
              </div>
              <p className="text-sm text-indigo-600 font-medium mb-1">Projects Assigned</p>
              <p className="text-3xl font-bold text-indigo-700">{userProjects.length}</p>
            </div>
            
            <div className="bg-pink-50/50 rounded-2xl p-6 text-center">
              <div className="inline-flex p-3 bg-pink-100 rounded-2xl mb-3">
                <HiOutlineChartBar className="text-pink-600 text-2xl" />
              </div>
              <p className="text-sm text-pink-600 font-medium mb-1">My Tasks</p>
              <p className="text-3xl font-bold text-pink-700">{userTasks.length}</p>
              <p className="text-xs text-gray-500 mt-2">
                {userCompletedTasks} completed · {userPendingTasks} pending
              </p>
            </div>
          </div>

          {/* Personal Task Progress */}
          {userTasks.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">My Task Completion</span>
                <span className="font-semibold text-gray-800">
                  {Math.round((userCompletedTasks / userTasks.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(userCompletedTasks / userTasks.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardStats;