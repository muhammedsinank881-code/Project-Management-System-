import { LuLogOut } from "react-icons/lu";
import { IoIosNotificationsOutline } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth, usePermission } from "../context/AouthContext";
import { useNotification } from "../context/NotificationContext";



const NaveBar = () => {
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
        // <nav className="absolute top-0 left-0 w-full z-20  md:px-16 py-6 flex items-center justify-between">

        //     {/* LOGO */}
        //     <h1 className="text-2xl font-bold tracking-wide">
        //         ROle
        //     </h1>

        //     {/* CENTER MENU */}
        //     <div className="flex md:gap-10 text-gray-700 font-medium">

        //         <NavLink
        //             to="/home"
        //             end
        //             className={({ isActive }) =>
        //                 `relative group pb-1 ${isActive ? "text-black font-semibold" : "text-gray-600"
        //                 }`
        //             }
        //         >
        //             {({ isActive }) => (
        //                 <>
        //                     Home

        //                     <span
        //                         className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300
        // ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
        //                     ></span>
        //                 </>
        //             )}
        //         </NavLink>

        //         <NavLink
        //             to="employee"

        //             className={({ isActive }) =>
        //                 `relative group pb-1 ${isActive ? "text-black font-semibold" : "text-gray-600"
        //                 }`
        //             }
        //         >
        //             {({ isActive }) => (
        //                 <>
        //                     Employee

        //                     <span
        //                         className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300
        // ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
        //                     ></span>
        //                 </>
        //             )}
        //         </NavLink>
        //         {isAdmin &&<NavLink
        //             to="role"

        //             className={({ isActive }) =>
        //                 `relative group pb-1 ${isActive ? "text-black font-semibold" : "text-gray-600"
        //                 }`
        //             }
        //         >
        //             {({ isActive }) => (
        //                 <>
        //                     Role

        //                     <span
        //                         className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300
        // ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
        //                     ></span>
        //                 </>
        //             )}
        //         </NavLink>}

        //         <NavLink
        //             to="project"

        //             className={({ isActive }) =>
        //                 `relative group pb-1 ${isActive ? "text-black font-semibold" : "text-gray-600"
        //                 }`
        //             }
        //         >
        //             {({ isActive }) => (
        //                 <>
        //                     Project

        //                     <span
        //                         className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300
        // ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
        //                     ></span>
        //                 </>
        //             )}
        //         </NavLink>


        //     </div>

        //     {/* RIGHT ICONS */}
        //     <div className="flex md:gap-6 items-center text-xl">


        //         <button className="hover:scale-110 transition duration-200">
        //             <IoIosNotificationsOutline />
        //         </button>

        //         <button className="hover:scale-110 transition duration-200">
        //             <RiMenu4Fill />
        //         </button>

        //         <button 
        //         onClick={handleLogout}
        //         className="hover:scale-110 transition duration-200">
        //             <LuLogOut />
        //         </button>

        //     </div>

        // </nav>
        <div>
            <nav className="absolute top-0 left-0 w-20 md:w-30 h-screen z-20 p-6 flex flex-col items-center justify-between ">

                {/* LOGO */}
                <h1 className="text-2xl font-bold tracking-wide">
                    ROle
                </h1>

                {/* CENTER MENU */}
                <div className="flex flex-col gap-5 md:gap-10 text-gray-700 font-medium">

                    <NavLink
                        to="/home"
                        end
                        className={({ isActive }) =>
                            `relative group pb-1 ${isActive ? "text-black font-semibold" : "text-gray-600"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                Home

                                <span
                                    className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300
        ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                                ></span>
                            </>
                        )}
                    </NavLink>

                    {hasPermission("view_employees") && (
                        <NavLink
                            to="employee"

                            className={({ isActive }) =>
                                `relative group pb-1 ${isActive ? "text-black font-semibold" : "text-gray-600"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    Employee

                                    <span
                                        className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300
        ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                                    ></span>
                                </>
                            )}
                        </NavLink>
                    )}

                    {hasPermission("view_roles") && (
                        <NavLink
                            to="role"

                            className={({ isActive }) =>
                                `relative group pb-1 ${isActive ? "text-black font-semibold" : "text-gray-600"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    Role

                                    <span
                                        className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300
        ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                                    ></span>
                                </>
                            )}
                        </NavLink>)}

                    {hasPermission("view_projects") && (
                        <NavLink
                            to="project"

                            className={({ isActive }) =>
                                `relative group pb-1 ${isActive ? "text-black font-semibold" : "text-gray-600"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    Project

                                    <span
                                        className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300
        ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                                    ></span>
                                </>
                            )}
                        </NavLink>
                    )}


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

                    {/* <button className="hover:scale-110 transition duration-200">
                    <RiMenu4Fill />
                </button> */}

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