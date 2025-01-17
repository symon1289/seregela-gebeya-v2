import React, { useState } from "react";
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

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  total: number;
  products: Product[];
}

const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [userData, setUserData] = useState({
    id: 238,
    firstName: "Simon",
    lastName: "Solomon",
    email: "SimonSolomon@mail.com",
    phoneNumber: "251911817119",
    walletBalance: 349.65,
    address: {
      city: "AA",
      subCity: "AA",
      woreda: "ffg",
      neighborhood: "fgg",
      houseNumber: "tgt",
    },
  });

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      orderNumber: "ORD-2023-001",
      date: "2023-06-15",
      total: 250.5,
      products: [
        { id: 101, name: "Wireless Headphones", quantity: 1, price: 150.5 },
        { id: 102, name: "Laptop Stand", quantity: 2, price: 50 },
      ],
    },
    {
      id: 2,
      orderNumber: "ORD-2023-002",
      date: "2023-06-20",
      total: 350.75,
      products: [
        { id: 201, name: "Ergonomic Mouse", quantity: 1, price: 75.25 },
        { id: 202, name: "Mechanical Keyboard", quantity: 1, price: 275.5 },
      ],
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [field, subField] = name.split(".");
    setUserData((prev) => {
      if (subField) {
        return {
          ...prev,
          [field]: {
            ...prev[field as keyof typeof userData],
            [subField]: value,
          },
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      if (!userData.email.includes("@")) {
        toast.error("Invalid email address.");
        return;
      }
      if (userData.phoneNumber.length < 10) {
        toast.error("Invalid phone number.");
        return;
      }

      toast.success("Profile updated successfully!");
    }
    setIsEditing(!isEditing);
  };

  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="max-w-screen-xl mx-auto grid sm:grid-cols-2 gap-1  bg-white shadow-md rounded-xl p-6 mt-10">
      <div className="mb-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
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
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleInputChange}
                  className="w-1/2 border rounded px-2 py-1 focus:z-10 focus:border-[#e9a83a] focus:ring-[#e9a83a]"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleInputChange}
                  className="w-1/2 border rounded px-2 py-1 focus:z-10 focus:border-[#e9a83a] focus:ring-[#e9a83a]"
                  placeholder="Last Name"
                />
              </>
            ) : (
              <h3 className="text-xl font-semibold">
                {userData.firstName} {userData.lastName}
              </h3>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-gray-500" />
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1 focus:z-10 focus:border-[#e9a83a] focus:ring-[#e9a83a]"
                placeholder="Email"
              />
            ) : (
              <p>{userData.email}</p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <FaPhone className="text-gray-500" />
            {isEditing ? (
              <input
                type="tel"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1 focus:z-10 focus:border-[#e9a83a] focus:ring-[#e9a83a]"
                placeholder="Phone Number"
              />
            ) : (
              <p>{userData.phoneNumber}</p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="text-gray-500" />
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2 w-full">
                <input
                  type="text"
                  name="address.city"
                  value={userData.address.city}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 focus:z-10 focus:border-[#e9a83a] focus:ring-[#e9a83a]"
                  placeholder="City"
                />
                <input
                  type="text"
                  name="address.subCity"
                  value={userData.address.subCity}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 focus:z-10 focus:border-[#e9a83a] focus:ring-[#e9a83a]"
                  placeholder="Sub City"
                />
                <input
                  type="text"
                  name="address.woreda"
                  value={userData.address.woreda}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 focus:z-10 focus:border-[#e9a83a] focus:ring-[#e9a83a]"
                  placeholder="Woreda"
                />
              </div>
            ) : (
              <p>{`${userData.address.city}, ${userData.address.subCity}, ${userData.address.woreda}`}</p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <FaWallet className="text-gray-500" />
            <p>Wallet Balance: ${userData.walletBalance.toFixed(2)}</p>
          </div>
        </div>
      </div>
      {/* Orders Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Order History
        </h3>
        <div className="bg-gray-50 rounded-lg">
          <div className="grid grid-cols-4 p-3 bg-gray-100 font-medium text-gray-700">
            <div>Order Number</div>
            <div>Date</div>
            <div>Total</div>
            <div>Actions</div>
          </div>
          {orders.map((order) => (
            <div key={order.id} className="border-b last:border-b-0">
              <div className="grid grid-cols-4 p-3 items-center">
                <div>{order.orderNumber}</div>
                <div>{order.date}</div>
                <div>${order.total.toFixed(2)}</div>
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
                    {expandedOrderId === order.id ? "Collapse" : "Expand"}
                  </span>
                </button>
              </div>
              {expandedOrderId === order.id && (
                <div className="p-4 bg-white">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Product Name</th>
                        <th className="p-2 text-left">Quantity</th>
                        <th className="p-2 text-left">Price</th>
                        <th className="p-2 text-left">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((product) => (
                        <tr key={product.id} className="border-b">
                          <td className="p-2">{product.name}</td>
                          <td className="p-2">{product.quantity}</td>
                          <td className="p-2">${product.price.toFixed(2)}</td>
                          <td className="p-2">
                            ${(product.quantity * product.price).toFixed(2)}
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
