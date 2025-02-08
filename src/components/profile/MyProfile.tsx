import React, { useEffect, useState } from "react";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaWallet,
    FaEdit,
    FaSave,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { UserData } from "../../types/user";
import { useTranslation } from "react-i18next";
import useUser from "../../hooks/useUser";
import PriceFormatter from "../../components/PriceFormatter";
import { getProfilePageMetaTags } from "../../config/meta";
import Meta from "../Meta";
// Reusable Profile Field Component
const ProfileField = ({
    icon,
    value,
    name,
    isEditing,
    onChange,
    type = "text",
    placeholder,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    name: string;
    isEditing: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
}) => (
    <div className="flex items-center space-x-4">
        {icon}
        {isEditing ? (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border rounded px-2 py-1 focus:border-primary focus:ring-primary"
                placeholder={placeholder}
            />
        ) : (
            <p>{value}</p>
        )}
    </div>
);

// Reusable Address Fields Component
const AddressFields = ({
    user,
    isEditing,
    onChange,
}: {
    user: UserData | null;
    isEditing: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
    <div className="flex items-center space-x-4">
        <FaMapMarkerAlt className="text-gray-500" />
        {isEditing ? (
            <div className="grid grid-cols-2 gap-2 w-full">
                <input
                    type="text"
                    name="address.city"
                    value={user?.address?.city || ""}
                    onChange={onChange}
                    className="border rounded px-2 py-1 focus:border-primary focus:ring-primary"
                    placeholder="City"
                />
                <input
                    type="text"
                    name="address.sub_city"
                    value={user?.address?.sub_city || ""}
                    onChange={onChange}
                    className="border rounded px-2 py-1 focus:border-primary focus:ring-primary"
                    placeholder="Sub City"
                />
                <input
                    type="text"
                    name="address.woreda"
                    value={user?.address?.woreda || ""}
                    onChange={onChange}
                    className="border rounded px-2 py-1 focus:border-primary focus:ring-primary"
                    placeholder="Woreda"
                />
            </div>
        ) : (
            <p>
                {`${user?.address?.city || ""}, ${user?.address?.sub_city || ""}, ${
                    user?.address?.woreda || ""
                }`}
            </p>
        )}
    </div>
);

const Myprofile: React.FC = () => {
    const { t } = useTranslation();
    const { updateUser } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const [field, subField] = name.split(".");

        setUser((prev) => {
            if (!prev) return null;
            if (subField) {
                return {
                    ...prev,
                    [field]: {
                        ...(prev[
                            field as keyof UserData
                        ] as unknown as UserData),
                        [subField]: value,
                    },
                };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleEditToggle = () => {
        if (isEditing && user) {
            if (!user.email.includes("@")) {
                toast.error("Invalid email address.");
                return;
            }
            if (user.phone_number.length < 10) {
                toast.error("Invalid phone number.");
                return;
            }
            try {
                updateUser(user, user.phone_number);
                localStorage.setItem("user", JSON.stringify(user));
                toast.success("Profile updated successfully!");
            } catch (error) {
                console.error("Error saving user data:", error);
                toast.error("Failed to save profile.");
            }
        }
        setIsEditing(!isEditing);
    };

    return (
        <>
            <Meta
                config={getProfilePageMetaTags(
                    user?.first_name || "Abebe",
                    user?.last_name || "Kebede"
                )}
            />
            <div className="mb-6 col-span-1 bg-white min-h-screen">
                <div className="flex items-center justify-end mb-6">
                    <button
                        onClick={handleEditToggle}
                        className="text-primary hover:text-[#f1c87d] transition-colors"
                    >
                        {isEditing ? (
                            <FaSave className="text-xl" />
                        ) : (
                            <FaEdit className="text-xl" />
                        )}
                    </button>
                </div>

                <div className="flex items-center space-x-6 mb-6 w-full">
                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 flex items-center justify-center">
                        <FaUser className="text-4xl text-gray-500" />
                    </div>
                    <div className="flex space-x-2">
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={user?.first_name || ""}
                                    onChange={handleInputChange}
                                    className="w-1/2 border rounded px-2 py-1 focus:border-primary focus:ring-primary"
                                    placeholder={t("First Name")}
                                />
                                <input
                                    type="text"
                                    name="last_name"
                                    value={user?.last_name || ""}
                                    onChange={handleInputChange}
                                    className="w-1/2 border rounded px-2 py-1 focus:border-primary focus:ring-primary"
                                    placeholder={t("Last Name")}
                                />
                            </>
                        ) : (
                            <h3 className="text-xl font-semibold">
                                {user?.first_name} {user?.last_name}
                            </h3>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <ProfileField
                        icon={<FaEnvelope className="text-gray-500" />}
                        label="Email"
                        value={user?.email || ""}
                        name="email"
                        isEditing={isEditing}
                        onChange={handleInputChange}
                        type="email"
                        placeholder={t("Email")}
                    />
                    <ProfileField
                        icon={<FaPhone className="text-gray-500" />}
                        label="Phone"
                        value={user?.phone_number || ""}
                        name="phone_number"
                        isEditing={isEditing}
                        onChange={handleInputChange}
                        type="tel"
                        placeholder={t("Phone Number")}
                    />
                    <AddressFields
                        user={user}
                        isEditing={isEditing}
                        onChange={handleInputChange}
                    />
                    <div className="flex items-center space-x-4">
                        <FaWallet className="text-gray-500" />
                        <PriceFormatter
                            price={String(user?.wallet_balance?.toFixed(2))}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Myprofile;
