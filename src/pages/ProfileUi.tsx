import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FaEye, FaHeart, FaTruckFast, FaUserLarge } from "react-icons/fa6";
import MyOrders from "../components/profile/Myorders";
import RecentlyViewed from "../components/profile/RecentlyViewed";
import Myprofile from "../components/profile/MyProfile";
import Favorite from "../components/profile/Favorite";
import { logout } from "../store/features/authSlice";
import Loader from "../components/Loader";
import { UserData } from "../types/user";
const ProfilePage: React.FC = () => {
    const dispach = useDispatch();
    const [activeComponent, setActiveComponent] = useState("My orders");

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
    }, []);
    const handleLogout = () => {
        setLoading(true);
        dispach(logout());
        window.location.href = "/seregela-gebeya-v2";
    };

    const renderContent = () => {
        switch (activeComponent) {
            case "My Profile":
                return <Myprofile />;
            case "Recently Viewed":
                return <RecentlyViewed />;
            case "Favorite items":
                return <Favorite />;
            default:
                return <MyOrders />;
        }
    };

    if (loading) {
        return <Loader />;
    }

    const sideBar = [
        {
            id: 1,
            name: "My orders",
            icon: <FaTruckFast size={20} className="mr-3" />,
        },
        {
            id: 2,
            name: "My Profile",
            icon: <FaUserLarge size={20} className="mr-3" />,
        },
        {
            id: 3,
            name: "Recently Viewed",
            icon: <FaEye size={20} className="mr-3" />,
        },
        {
            id: 4,
            name: "Favorite items",
            icon: <FaHeart size={20} className="mr-3" />,
        },
    ];
    return (
        <div className="max-w-screen-xl mx-auto ">
            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <aside className="w-64 bg-white p-4 shadow-md">
                    <div className="flex items-center border-b pb-4">
                        <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12 flex items-center justify-center">
                            <FaUserLarge className="text-4xl text-gray-500" />
                        </div>
                        <div className="ml-4 flex flex-col">
                            <h2 className="text-lg font-semibold">
                                {user?.first_name} {user?.last_name}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <nav className="mt-4">
                        <ul className="space-y-2">
                            {sideBar.map((item) => (
                                <li
                                    key={item.id}
                                    className={`p-2 rounded-lg cursor-pointer flex items-center text-gray-600 ${
                                        activeComponent === item.name
                                            ? "bg-primary/30 text-quaternary font-semibold"
                                            : "hover:bg-primary/30 hover:text-quaternary transition-colors duration-300"
                                    }`}
                                    onClick={() => {
                                        setActiveComponent(item.name);
                                    }}
                                >
                                    {item.icon}
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <button
                        onClick={handleLogout}
                        className="mt-4 w-full bg-red-500 text-white justify-start p-2 rounded-lg flex"
                    >
                        <RiLogoutBoxRLine size={20} className="mr-3" />
                        Log out
                    </button>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-6">{renderContent()}</main>
            </div>
        </div>
    );
};

export default ProfilePage;
