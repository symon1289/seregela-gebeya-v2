import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaWallet,
  FaEdit,
  FaSave,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import useOrder from "../hooks/useOrder";
import { OrderDetails } from "../types/order";
import { UserData } from "../types/user";
import { useTranslation } from "react-i18next";
import useUser from "../hooks/useUser";
import PriceFormatter from "../components/PriceFormatter";

const UserProfile: React.FC = () => {
  const { t } = useTranslation();
  const { getOrders } = useOrder();
  const { updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<OrderDetails[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);

    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders.");
      }
    };

    fetchOrders();
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
            ...(prev[field as keyof UserData] as unknown as UserData),
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

  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 grid sm:grid-cols-3 gap-6 bg-white shadow-md p-6 mt-4">
      {/* User Profile Section */}
      <div className="mb-6 col-span-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("User Profile")}
          </h2>
          <button
            onClick={handleEditToggle}
            className="text-[#e9a83a] hover:text-[#f1c87d] transition-colors"
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
                  className="w-1/2 border rounded px-2 py-1 focus:border-[#e9a83a] focus:ring-[#e9a83a]"
                  placeholder={t("First Name")}
                />
                <input
                  type="text"
                  name="last_name"
                  value={user?.last_name || ""}
                  onChange={handleInputChange}
                  className="w-1/2 border rounded px-2 py-1 focus:border-[#e9a83a] focus:ring-[#e9a83a]"
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
          {/* Email */}
          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-gray-500" />
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={user?.email || ""}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1 focus:border-[#e9a83a] focus:ring-[#e9a83a]"
                placeholder={t("Email")}
              />
            ) : (
              <p>{user?.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center space-x-4">
            <FaPhone className="text-gray-500" />
            {isEditing ? (
              <input
                type="tel"
                name="phone_number"
                value={user?.phone_number || ""}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1 focus:border-[#e9a83a] focus:ring-[#e9a83a]"
                placeholder={t("Phone Number")}
              />
            ) : (
              <p>{user?.phone_number}</p>
            )}
          </div>

          {/* Address */}
          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="text-gray-500" />
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2 w-full">
                <input
                  type="text"
                  name="address.city"
                  value={user?.address?.city || ""}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 focus:border-[#e9a83a] focus:ring-[#e9a83a]"
                  placeholder={t("City")}
                />
                <input
                  type="text"
                  name="address.sub_city"
                  value={user?.address?.sub_city || ""}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 focus:border-[#e9a83a] focus:ring-[#e9a83a]"
                  placeholder={t("Sub City")}
                />
                <input
                  type="text"
                  name="address.woreda"
                  value={user?.address?.woreda || ""}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 focus:border-[#e9a83a] focus:ring-[#e9a83a]"
                  placeholder={t("Woreda")}
                />
              </div>
            ) : (
              <p>
                {`${user?.address?.city || ""}, ${
                  user?.address?.sub_city || ""
                }, ${user?.address?.woreda || ""}`}
              </p>
            )}
          </div>

          {/* Wallet Balance */}
          <div className="flex items-center space-x-4">
            <FaWallet className="text-gray-500" />
            <p>
              {t("Wallet Balance")}: {user?.wallet_balance?.toFixed(2)}{" "}
              {t("birr")}
            </p>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="col-span-2">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {t("Order History")}
        </h3>
        <div className="bg-gray-50 rounded-lg">
          <div className="grid grid-cols-4 p-3 bg-gray-100 font-medium text-gray-700">
            <div>{t("Order Number")}</div>
            <div>{t("Date")}</div>
            <div>{t("Total")}</div>
            <div>{t("Actions")}</div>
          </div>
          {orders.map((order) => (
            <div key={order.id} className="border-b last:border-b-0">
              <div className="grid grid-cols-4 p-3 items-center">
                <div>{order.id}</div>
                <div>{order.created_at.slice(0, 10)}</div>
                <div>
                  <PriceFormatter price={order.order_cost.toFixed(2)} />
                </div>
                <button
                  onClick={() => toggleOrderExpand(order.id)}
                  className="text-[#e9a83a] hover:text-[#f1c87d] flex items-center"
                >
                  {expandedOrderId === order.id ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                  <span className="ml-2">
                    {expandedOrderId === order.id ? t("Collapse") : t("Expand")}
                  </span>
                </button>
              </div>
              {expandedOrderId === order.id && (
                <div className="p-4 bg-white">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">{t("Product Name")}</th>
                        <th className="p-2 text-left">{t("Quantity")}</th>
                        <th className="p-2 text-left">{t("Price")}</th>
                        <th className="p-2 text-left">{t("Subtotal")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b last:border-b-0"
                        >
                          <td className="p-2">{product.name}</td>
                          <td className="p-2">{product.pivot.quantity}</td>
                          <td className="p-2">
                            {parseInt(product.price).toFixed(2)} {t("birr")}
                          </td>
                          <td className="p-2">
                            {(
                              product.pivot.quantity * parseInt(product.price)
                            ).toFixed(2)}{" "}
                            {t("birr")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
