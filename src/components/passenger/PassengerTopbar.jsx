import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Menu, UserRound, LogOut } from "lucide-react";

const API_URL = "http://localhost:8080";

const PassengerTopbar = ({
    onMenuClick,
    onLogout,
}) => {
    const navigate = useNavigate();

    const [user, setUser] = useState({});

    // ==========================================
    // GET IMAGE URL
    // ==========================================

    const getImageUrl = (profileImage) => {
        if (!profileImage) {
            return "";
        }

        if (
            profileImage.startsWith("http://") ||
            profileImage.startsWith("https://") ||
            profileImage.startsWith("blob:")
        ) {
            return profileImage;
        }

        return `${API_URL}/api/users/profile-images/${profileImage}`;
    };

    // ==========================================
    // LOAD USER
    // ==========================================

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const token = localStorage.getItem("token");

        // First load from localStorage
        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error(
                    "Invalid user data:",
                    error
                );
            }
        }

        // Then get latest profile from backend
        if (!token) {
            return;
        }

        try {
            const response = await axios.get(
                `${API_URL}/api/users/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const profile = response.data;

            console.log(
                "PASSENGER TOPBAR PROFILE:",
                profile
            );

            setUser(profile);

            // Keep localStorage synchronized
            const currentStoredUser =
                localStorage.getItem("user");

            if (currentStoredUser) {
                try {
                    const oldUser =
                        JSON.parse(
                            currentStoredUser
                        );

                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            ...oldUser,
                            ...profile,
                        })
                    );
                } catch (error) {
                    console.error(
                        "Failed to sync user:",
                        error
                    );
                }
            }
        } catch (error) {
            console.error(
                "Failed to load passenger profile:",
                error
            );

            // Do not force logout here.
            // Dashboard can continue using localStorage.
        }
    };

    // ==========================================
    // USER DATA
    // ==========================================

    const name =
        user.name ||
        user.fullName ||
        user.username ||
        "Passenger";

    const initial =
        name.charAt(0).toUpperCase();

    const profileImage =
        getImageUrl(user.profileImage);

    // ==========================================
    // IMAGE ERROR
    // ==========================================

    const handleImageError = (event) => {
        console.error(
            "PASSENGER TOPBAR IMAGE LOAD ERROR:",
            event.currentTarget.src
        );

        event.currentTarget.style.display =
            "none";
    };

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">

            {/* ==================================
                LEFT
            ================================== */}

            <div className="flex items-center gap-3">

                <button
                    type="button"
                    onClick={onMenuClick}
                    className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white lg:hidden"
                >
                    <Menu size={21} />
                </button>

                <div className="hidden sm:block">

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                        Passenger
                    </p>

                    <h2 className="text-lg font-bold text-white">
                        Welcome back, {name}
                    </h2>

                </div>

            </div>

            {/* ==================================
                RIGHT
            ================================== */}

            <div className="flex items-center gap-3">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/passenger/profile"
                        )
                    }
                    className="flex items-center gap-3 rounded-2xl px-2 py-1.5 transition hover:bg-slate-900"
                >

                    {/* ==================================
                        PROFILE IMAGE
                    ================================== */}

                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-600/20">

                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt={name}
                                className="h-full w-full object-cover"
                                onError={
                                    handleImageError
                                }
                            />
                        ) : (
                            initial
                        )}

                    </div>

                    {/* ==================================
                        NAME
                    ================================== */}

                    <div className="hidden text-left sm:block">

                        <p className="max-w-32 truncate text-sm font-bold text-white">
                            {name}
                        </p>

                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                            Passenger
                        </p>

                    </div>

                    <UserRound
                        size={16}
                        className="hidden text-slate-600 sm:block"
                    />

                </button>

                {/* ==================================
                    LOGOUT
                ================================== */}

                <button
                    type="button"
                    onClick={onLogout}
                    className="rounded-xl p-2.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                    title="Sign out"
                >
                    <LogOut size={18} />
                </button>

            </div>

        </header>
    );
};

export default PassengerTopbar;