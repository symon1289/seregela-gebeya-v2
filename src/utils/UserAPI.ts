import api from "./axios";

interface User {
    id: number;
    user_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
}

interface AuthResponse {
    access_token: string;
    user: User;
}

interface Notification {
    id: number;
    message: string;
    created_at: string;
}

interface ApiError {
    message: string;
    status?: number;
}
class UserAPI {
    // User login with phone and Firebase token
    static async userLogin(
        phone: string,
        authToken: string
    ): Promise<AuthResponse> {
        try {
            const res = await api.post<AuthResponse>("firebase-login", {
                phone_number: phone,
                firebase_token: authToken,
            });
            return res.data;
        } catch (error) {
            throw new Error((error as ApiError).message || "Login failed");
        }
    }

    // Get user profile with loan and balance information
    static async getUser(): Promise<User> {
        try {
            const token = window.localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const res = await api.get<User>("profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        } catch (error) {
            throw new Error(
                (error as ApiError).message || "Failed to fetch user profile"
            );
        }
    }

    // Register a new user
    static async registerUser(
        userInfo: {
            user_name: string;
            first_name: string;
            last_name: string;
            email: string;
            password: string;
            password_confirmation: string;
        },
        phoneNumber: string
    ): Promise<User> {
        try {
            const res = await api.post<User>("register", {
                user_name: userInfo.user_name,
                first_name: userInfo.first_name,
                last_name: userInfo.last_name,
                email: userInfo.email,
                phone_number: phoneNumber,
                password: userInfo.password,
                password_confirmation: userInfo.password_confirmation,
            });
            return res.data;
        } catch (error) {
            throw new Error(
                (error as ApiError).message || "Registration failed"
            );
        }
    }

    // Get user notifications
    static async getNotifications(): Promise<Notification[]> {
        try {
            const token = window.localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const res = await api.get<{ data: Notification[] }>(
                "/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data.data;
        } catch (error) {
            throw new Error(
                (error as ApiError).message || "Failed to fetch notifications"
            );
        }
    }
}

export default UserAPI;
