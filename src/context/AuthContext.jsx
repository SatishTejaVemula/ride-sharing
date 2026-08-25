import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../api/authApi";
import { getMyProfile } from "../api/userApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");

        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(
        () => localStorage.getItem("token")
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            const storedToken = localStorage.getItem("token");

            if (!storedToken) {
                setLoading(false);
                return;
            }

            try {
                const profile = await getMyProfile();

                setUser(profile);
                localStorage.setItem(
                    "user",
                    JSON.stringify(profile)
                );
            } catch (error) {
                console.error("Session restore failed:", error);

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    const login = async (credentials) => {
        let response;

        try {
            response = await loginUser(credentials);
        } catch (error) {
            console.error("loginUser failed:", error);
            throw error;
        }

        const extractedToken =
            response?.token ||
            response?.accessToken ||
            response?.jwt ||
            response?.data?.token ||
            response?.data?.accessToken;

        if (!extractedToken) {
            console.error(
                "Login succeeded but no token found in response. Full response:",
                response
            );
            throw new Error(
                "Login response did not include an authentication token."
            );
        }

        localStorage.setItem("token", extractedToken);
        setToken(extractedToken);

        /*
         * Login response already contains:
         * name
         * email
         * role
         *
         * But we fetch the actual profile afterward
         * because it also contains authUserId, phone,
         * rating, profileImage, etc.
         */

        let profile;

        try {
            profile = await getMyProfile();
        } catch (error) {
            // Token was saved but the profile call failed —
            // this is a DIFFERENT problem than bad credentials.
            console.error(
                "Login succeeded, but fetching profile failed:",
                error
            );

            // Roll back so the app isn't left in a half-logged-in state
            localStorage.removeItem("token");
            setToken(null);

            throw new Error(
                "Logged in, but failed to load your profile. Please try again."
            );
        }

        localStorage.setItem("user", JSON.stringify(profile));
        setUser(profile);

        return profile;
    };

    const register = async (data) => {
        return await registerUser(data);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};