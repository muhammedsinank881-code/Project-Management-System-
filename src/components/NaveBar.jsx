import { LuLogOut } from "react-icons/lu";
import { IoIosNotificationsOutline } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth, usePermission } from "../context/AouthContext";
import { useNotification } from "../context/NotificationContext";



const NaveBar = () => {

    const menuItems = [
        {
            name: "Home",
            path: "/home",
            permission: null, // always visible
        },
        {
            name: "Employee",
            path: "employee",
            permission: "view_employees",
        },
        {
            name: "Role",
            path: "role",
            permission: "view_roles",
        },
        {
            name: "Project",
            path: "project",
            permission: "view_projects",
        },
        {
            name: "Tasks",
            path: "tasks",
            permission: "view_tasks",
        },
    ];

    const { user, logout } = useAuth();
    const { hasPermission } = usePermission();
    const navigate = useNavigate()

    const isAdmin = user?.role === "admin" || user?.role === "super_admin";

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    const { getUnreadCount } = useNotification();
    const unreadCount = getUnreadCount(user?.id);



    return (

        <div>
            <nav className="absolute top-0 left-0 w-20 md:w-50 h-screen z-20 p-6 flex flex-col items-center justify-between 
            bg-white border-r-2 border-indigo-600 shadow-2xl">

                {/* LOGO */}
                <h1 className="text-2xl font-bold tracking-wide">
                    ROle
                </h1>



                <div className="flex flex-col gap-5 md:gap-10 text-gray-700 font-medium">
                    {menuItems.map((item, i) => {
                        // permission check
                        if (item.permission && !hasPermission(item.permission)) return null;

                        return (
                            <NavLink
                                key={i}
                                to={item.path}
                                end={item.path === "/home"}
                                className={({ isActive }) =>
                                    `relative group pb-1 ${isActive ? "text-black font-semibold" : "text-gray-600"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {item.name}

                                        <span
                                            className={`absolute left-0 -bottom-1 h-[2px] bg-linear-to-r from-pink-500 to-violet-700 transition-all duration-300
              ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                                        ></span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>

                {/* RIGHT ICONS */}
                <div className="flex flex-col md:gap-6 items-center text-xl justify-center">


                    <button
                        className="relative hover:scale-110 transition duration-200"
                        onClick={() => navigate("notifications")}
                    >
                        <IoIosNotificationsOutline />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="hover:scale-110 transition duration-200">
                        <LuLogOut />
                    </button>

                </div>

            </nav>
        </div>
    );
};

export default NaveBar;