import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import {
    ArrowLeft,
    CarFront,
    Mail,
    Phone,
    ShieldCheck,
    UserRound,
    Star,
} from "lucide-react";

const API_URL = "http://localhost:8080";

const ViewDriverProfile = () => {
    const navigate = useNavigate();
    const { driverId } = useParams();

    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // BUILD PROFILE IMAGE URL
    // ==========================================

    const getProfileImageUrl = (profileImage) => {
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

        if (
            profileImage.startsWith(
                "/api/users/profile-images/"
            )
        ) {
            return `${API_URL}${profileImage}`;
        }

        if (
            profileImage.startsWith("/profile-images/")
        ) {
            return `${API_URL}/api/users${profileImage}`;
        }

        return `${API_URL}/api/users/profile-images/${encodeURIComponent(
            profileImage
        )}`;
    };

    // ==========================================
    // LOAD DRIVER PROFILE
    // ==========================================

    useEffect(() => {
        loadDriverProfile();
    }, [driverId]);

    const loadDriverProfile = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login again.");
            navigate("/login");
            return;
        }

        if (!driverId) {
            toast.error("Driver information unavailable.");
            navigate(-1);
            return;
        }

        try {
            setLoading(true);

            console.log(
                "Loading driver profile:",
                driverId
            );

            const response = await axios.get(
                `${API_URL}/api/rides/driver-profile/${driverId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(
                "DRIVER PROFILE RESPONSE:",
                response.data
            );

            setDriver(response.data);
        } catch (error) {
            console.error(
                "Failed to load driver profile:",
                error
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                toast.error(
                    "Session expired. Please login again."
                );

                navigate("/login");
                return;
            }

            if (error.response?.status === 404) {
                toast.error("Driver profile not found.");
            } else {
                toast.error(
                    error.response?.data?.message ||
                        "Failed to load driver profile."
                );
            }

            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

                    <p className="text-sm text-slate-500">
                        Loading driver profile...
                    </p>
                </div>
            </div>
        );
    }

    if (!driver) {
        return null;
    }

    // ==========================================
    // DRIVER DATA
    // ==========================================

    const name =
        driver.name ||
        driver.driverName ||
        "Driver";

    const email =
        driver.email ||
        driver.driverEmail ||
        "Not available";

    const phone =
        driver.phone ||
        driver.driverPhone ||
        "Not available";

    const rating =
        driver.rating !== null &&
        driver.rating !== undefined
            ? Number(driver.rating).toFixed(1)
            : "5.0";

    const profileImage =
        driver.profileImage ||
        driver.driverProfileImage ||
        "";

    const imageUrl =
        getProfileImageUrl(profileImage);

    const initial =
        name.charAt(0).toUpperCase();

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Background Effects */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

                <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />

            </div>

            {/* Header */}

            <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">

                <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
                    >
                        <ArrowLeft size={18} />

                        <span>
                            Back
                        </span>
                    </button>

                    <div className="flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                            <CarFront size={18} />
                        </div>

                        <span className="text-lg font-black tracking-tight">
                            RideFlow
                            <span className="text-blue-500">
                                .
                            </span>
                        </span>

                    </div>

                    <div className="w-20" />

                </div>

            </header>

            {/* Main */}

            <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

                {/* Heading */}

                <section className="mb-8">

                    <p className="text-sm font-semibold text-blue-400">
                        Driver information
                    </p>

                    <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                        Driver Profile
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        View information about your ride driver.
                    </p>

                </section>

                {/* Profile Card */}

                <section className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 shadow-xl shadow-black/10 backdrop-blur-xl">

                    {/* Profile Header */}

                    <div className="relative border-b border-slate-800/80 px-6 py-8 sm:px-8">

                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-indigo-600/10" />

                        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-5">

                                {/* Avatar */}

                                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-blue-600 text-3xl font-black text-white shadow-xl shadow-blue-600/20">

                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={name}
                                            className="h-full w-full object-cover"
                                            onError={(event) => {
                                                event.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />
                                    ) : (
                                        initial
                                    )}

                                </div>

                                {/* Name */}

                                <div>

                                    <div className="flex flex-wrap items-center gap-3">

                                        <h2 className="text-2xl font-black">
                                            {name}
                                        </h2>

                                        <span className="flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">

                                            <ShieldCheck size={13} />

                                            Driver

                                        </span>

                                    </div>

                                    <p className="mt-2 text-sm text-slate-500">
                                        RideFlow driver
                                    </p>

                                </div>

                            </div>

                            {/* Rating */}

                            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 px-5 py-4">

                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Driver Rating
                                </p>

                                <div className="mt-1 flex items-center gap-2">

                                    <Star
                                        size={19}
                                        className="fill-yellow-400 text-yellow-400"
                                    />

                                    <span className="text-xl font-black">
                                        {rating}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Information */}

                    <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">

                        {/* Name */}

                        <ProfileItem
                            icon={UserRound}
                            label="Full Name"
                            value={name}
                        />

                        {/* Email */}

                        <ProfileItem
                            icon={Mail}
                            label="Email Address"
                            value={email}
                        />

                        {/* Phone */}

                        <ProfileItem
                            icon={Phone}
                            label="Phone Number"
                            value={phone}
                        />

                        {/* Role */}

                        <ProfileItem
                            icon={ShieldCheck}
                            label="Account Role"
                            value="DRIVER"
                        />

                    </div>

                </section>

                {/* Driver Status */}

                <section className="mt-5 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl sm:p-8">

                    <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">

                            <ShieldCheck size={20} />

                        </div>

                        <div>

                            <h3 className="font-bold">
                                Verified Driver
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                This driver is registered with RideFlow.
                            </p>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
};

// ==========================================
// PROFILE INFORMATION ITEM
// ==========================================

const ProfileItem = ({
    icon: Icon,
    label,
    value,
}) => {
    return (
        <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">

                <Icon size={19} />

            </div>

            <div className="min-w-0">

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {label}
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-300">
                    {value}
                </p>

            </div>

        </div>
    );
};

export default ViewDriverProfile;