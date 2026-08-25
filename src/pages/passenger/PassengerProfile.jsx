import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import {
    ArrowLeft,
    CarFront,
    Check,
    Mail,
    Pencil,
    Phone,
    Save,
    ShieldCheck,
    UserRound,
    X,
    Upload,
} from "lucide-react";

const API_URL = "http://localhost:8080";

const PassengerProfile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        profileImage: null,
    });

    const [previewImage, setPreviewImage] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ==========================================
    // BUILD PROFILE IMAGE URL
    // ==========================================

    const getProfileImageUrl = (profileImage) => {
        if (!profileImage) {
            return "";
        }

        // Already a complete URL
        if (
            profileImage.startsWith("http://") ||
            profileImage.startsWith("https://") ||
            profileImage.startsWith("blob:")
        ) {
            return profileImage;
        }

        // Backend already returned the complete API path
        if (profileImage.startsWith("/api/users/profile-images/")) {
            return `${API_URL}${profileImage}`;
        }

        // Backend returned something like:
        // /profile-images/abc.jpg
        if (profileImage.startsWith("/profile-images/")) {
            return `${API_URL}/api/users${profileImage}`;
        }

        // Backend returned only filename:
        // abc.jpg
        return `${API_URL}/api/users/profile-images/${encodeURIComponent(
            profileImage
        )}`;
    };

    // ==========================================
    // LOAD PROFILE
    // ==========================================

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login again.");
            navigate("/login");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.get(
                `${API_URL}/api/users/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const profile = response.data;

            console.log("PROFILE RESPONSE:", profile);
            console.log(
                "PROFILE IMAGE:",
                profile.profileImage
            );

            setUser(profile);

            setFormData({
                name: profile.name || "",
                phone: profile.phone || "",
                profileImage: null,
            });

            // ==========================================
            // PROFILE IMAGE
            // ==========================================

            if (profile.profileImage) {
                const imageUrl = getProfileImageUrl(
                    profile.profileImage
                );

                console.log(
                    "PROFILE IMAGE URL:",
                    imageUrl
                );

                setPreviewImage(imageUrl);
            } else {
                setPreviewImage("");
            }

            // ==========================================
            // SYNC LOCAL STORAGE
            // ==========================================

            const storedUser =
                localStorage.getItem("user");

            if (storedUser) {
                try {
                    const oldUser =
                        JSON.parse(storedUser);

                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            ...oldUser,
                            ...profile,
                        })
                    );
                } catch (error) {
                    console.error(
                        "Failed to sync local user:",
                        error
                    );
                }
            }
        } catch (error) {
            console.error(
                "Failed to load profile:",
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

            toast.error(
                error.response?.data?.message ||
                    "Failed to load profile."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ==========================================
    // HANDLE IMAGE CHANGE
    // ==========================================

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        // ==========================================
        // IMAGE TYPE VALIDATION
        // ==========================================

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error(
                "Only JPG, PNG, WEBP or GIF images are allowed."
            );

            event.target.value = "";
            return;
        }

        // ==========================================
        // IMAGE SIZE VALIDATION
        // ==========================================

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            toast.error(
                "Image size must be less than 5 MB."
            );

            event.target.value = "";
            return;
        }

        // ==========================================
        // SAVE FILE IN FORM DATA
        // ==========================================

        setFormData((previous) => ({
            ...previous,
            profileImage: file,
        }));

        // ==========================================
        // LOCAL PREVIEW
        // ==========================================

        const imageUrl = URL.createObjectURL(file);

        setPreviewImage(imageUrl);
    };

    // ==========================================
    // EDIT PROFILE
    // ==========================================

    const handleEdit = () => {
        if (!user) {
            return;
        }

        setFormData({
            name: user.name || "",
            phone: user.phone || "",
            profileImage: null,
        });

        if (user.profileImage) {
            setPreviewImage(
                getProfileImageUrl(
                    user.profileImage
                )
            );
        } else {
            setPreviewImage("");
        }

        setEditing(true);
    };

    // ==========================================
    // CANCEL EDIT
    // ==========================================

    const handleCancel = () => {
        if (!user) {
            return;
        }

        setFormData({
            name: user.name || "",
            phone: user.phone || "",
            profileImage: null,
        });

        if (user.profileImage) {
            setPreviewImage(
                getProfileImageUrl(
                    user.profileImage
                )
            );
        } else {
            setPreviewImage("");
        }

        setEditing(false);
    };

    // ==========================================
    // SAVE PROFILE
    // ==========================================

    const handleSave = async (event) => {
        event.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Name is required.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login again.");
            navigate("/login");
            return;
        }

        try {
            setSaving(true);

            // ==========================================
            // MULTIPART FORM DATA
            // ==========================================

            const data = new FormData();

            data.append(
                "name",
                formData.name.trim()
            );

            data.append(
                "phone",
                formData.phone.trim()
            );

            // Add image only if selected
            if (formData.profileImage) {
                data.append(
                    "profileImage",
                    formData.profileImage
                );
            }

            console.log(
                "Uploading profile image:",
                formData.profileImage
            );

            // ==========================================
            // UPDATE PROFILE
            // ==========================================

            const response = await axios.put(
                `${API_URL}/api/users/profile`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedProfile =
                response.data;

            console.log(
                "UPDATED PROFILE:",
                updatedProfile
            );

            console.log(
                "UPDATED IMAGE:",
                updatedProfile.profileImage
            );

            setUser(updatedProfile);

            setFormData({
                name:
                    updatedProfile.name || "",
                phone:
                    updatedProfile.phone || "",
                profileImage: null,
            });

            // ==========================================
            // UPDATE IMAGE PREVIEW
            // ==========================================

            if (updatedProfile.profileImage) {
                const imageUrl =
                    getProfileImageUrl(
                        updatedProfile.profileImage
                    );

                console.log(
                    "UPDATED IMAGE URL:",
                    imageUrl
                );

                setPreviewImage(imageUrl);
            } else {
                setPreviewImage("");
            }

            // ==========================================
            // UPDATE LOCAL STORAGE
            // ==========================================

            const storedUser =
                localStorage.getItem("user");

            if (storedUser) {
                try {
                    const oldUser =
                        JSON.parse(storedUser);

                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            ...oldUser,
                            ...updatedProfile,
                        })
                    );
                } catch (error) {
                    console.error(
                        "Failed to update local user:",
                        error
                    );
                }
            }

            setEditing(false);

            toast.success(
                "Profile updated successfully."
            );
        } catch (error) {
            console.error(
                "Failed to update profile:",
                error
            );

            console.error(
                "Server response:",
                error.response?.data
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

            toast.error(
                error.response?.data?.message ||
                    "Failed to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

                    <p className="text-sm text-slate-500">
                        Loading profile...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // ==========================================
    // USER DATA
    // ==========================================

    const name =
        user.name || "Passenger";

    const email =
        user.email || "Not available";

    const phone =
        user.phone || "Not available";

    const role =
        user.role || "PASSENGER";

    const userId =
        user.authUserId ||
        user.id ||
        "Not available";

    const initial =
        name.charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* =================================
                BACKGROUND
            ================================= */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

                <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />

            </div>

            {/* =================================
                HEADER
            ================================= */}

            <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">

                <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/passenger/dashboard"
                            )
                        }
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
                    >
                        <ArrowLeft size={18} />

                        <span className="hidden sm:inline">
                            Dashboard
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

                    <div className="w-24" />

                </div>

            </header>

            {/* =================================
                MAIN
            ================================= */}

            <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

                {/* =================================
                    HEADING
                ================================= */}

                <section className="mb-8">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <p className="text-sm font-semibold text-blue-400">
                                Passenger workspace
                            </p>

                            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                                Profile
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                Manage your RideFlow account information.
                            </p>

                        </div>

                        {!editing && (
                            <button
                                type="button"
                                onClick={handleEdit}
                                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                            >
                                <Pencil size={17} />

                                Edit Profile
                            </button>
                        )}

                    </div>

                </section>

                {/* =================================
                    PROFILE CARD
                ================================= */}

                <section className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 shadow-xl shadow-black/10 backdrop-blur-xl">

                    {/* Profile Header */}

                    <div className="relative border-b border-slate-800/80 px-6 py-8 sm:px-8">

                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-indigo-600/10" />

                        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-5">

                                {/* Avatar */}

                                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-blue-600 text-3xl font-black text-white shadow-xl shadow-blue-600/20">

                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt={name}
                                            className="h-full w-full object-cover"
                                            onError={(event) => {
                                                console.error(
                                                    "IMAGE LOAD ERROR:",
                                                    previewImage
                                                );

                                                event.currentTarget.style.display =
                                                    "none";

                                                setPreviewImage("");
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

                                            Passenger

                                        </span>

                                    </div>

                                    <p className="mt-2 text-sm text-slate-500">
                                        RideFlow passenger account
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* =================================
                        EDIT FORM
                    ================================= */}

                    {editing ? (

                        <form
                            onSubmit={handleSave}
                            className="p-6 sm:p-8"
                        >

                            <div className="grid gap-6 sm:grid-cols-2">

                                {/* Name */}

                                <div className="sm:col-span-2">

                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                                    >
                                        Full Name
                                    </label>

                                    <div className="relative">

                                        <UserRound
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                                        />

                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={
                                                formData.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter your name"
                                            className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500"
                                        />

                                    </div>

                                </div>

                                {/* Email */}

                                <div>

                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                                    >
                                        Email Address
                                    </label>

                                    <div className="relative">

                                        <Mail
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700"
                                        />

                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            disabled
                                            className="w-full cursor-not-allowed rounded-2xl border border-slate-800 bg-slate-900 py-3.5 pl-12 pr-4 text-sm text-slate-500 outline-none"
                                        />

                                    </div>

                                    <p className="mt-2 text-xs text-slate-600">
                                        Email cannot be changed here.
                                    </p>

                                </div>

                                {/* Phone */}

                                <div>

                                    <label
                                        htmlFor="phone"
                                        className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                                    >
                                        Phone Number
                                    </label>

                                    <div className="relative">

                                        <Phone
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                                        />

                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={
                                                formData.phone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter phone number"
                                            className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500"
                                        />

                                    </div>

                                </div>

                                {/* Profile Image */}

                                <div className="sm:col-span-2">

                                    <label
                                        htmlFor="profileImage"
                                        className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                                    >
                                        Profile Image
                                    </label>

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                                        {/* Image Preview */}

                                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">

                                            {previewImage ? (
                                                <img
                                                    src={previewImage}
                                                    alt="Profile preview"
                                                    className="h-full w-full object-cover"
                                                    onError={() => {
                                                        console.error(
                                                            "PREVIEW IMAGE ERROR:",
                                                            previewImage
                                                        );

                                                        setPreviewImage(
                                                            ""
                                                        );
                                                    }}
                                                />
                                            ) : (
                                                <UserRound
                                                    size={32}
                                                    className="text-slate-700"
                                                />
                                            )}

                                        </div>

                                        {/* Upload */}

                                        <div className="flex-1">

                                            <label
                                                htmlFor="profileImage"
                                                className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-5 py-3.5 text-sm font-bold text-slate-300 transition hover:border-blue-500 hover:bg-slate-900 hover:text-white"
                                            >

                                                <Upload size={18} />

                                                Choose Image

                                            </label>

                                            <input
                                                id="profileImage"
                                                name="profileImage"
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                                onChange={
                                                    handleImageChange
                                                }
                                                className="hidden"
                                            />

                                            <p className="mt-2 text-xs text-slate-600">
                                                JPG, PNG, WEBP or GIF. Maximum 5 MB.
                                            </p>

                                            {formData.profileImage && (
                                                <p className="mt-1 truncate text-xs text-blue-400">
                                                    Selected:{" "}
                                                    {
                                                        formData
                                                            .profileImage
                                                            .name
                                                    }
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* Buttons */}

                            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-bold text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                                >
                                    <X size={17} />

                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {saving ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-white" />

                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={17} />

                                            Save Changes
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    ) : (

                        /* VIEW MODE */

                        <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">

                            <ProfileItem
                                icon={UserRound}
                                label="Full Name"
                                value={name}
                            />

                            <ProfileItem
                                icon={Mail}
                                label="Email Address"
                                value={email}
                            />

                            <ProfileItem
                                icon={Phone}
                                label="Phone Number"
                                value={phone}
                            />

                            <ProfileItem
                                icon={ShieldCheck}
                                label="Account Role"
                                value={role}
                            />

                        </div>

                    )}

                </section>

                {/* =================================
                    ACCOUNT INFORMATION
                ================================= */}

                {!editing && (
                    <>
                        <section className="mt-5 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl sm:p-8">

                            <div className="flex items-start gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">

                                    <ShieldCheck size={20} />

                                </div>

                                <div className="min-w-0 flex-1">

                                    <h3 className="font-bold">
                                        Account information
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        Your account identifier is used internally by RideFlow.
                                    </p>

                                    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">

                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                            Account ID
                                        </p>

                                        <p className="mt-1 break-all font-mono text-sm text-slate-300">
                                            {userId}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </section>

                        {/* =================================
                            PASSENGER STATUS
                        ================================= */}

                        <section className="mt-5 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl sm:p-8">

                            <div className="flex items-center gap-4">

                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">

                                    <Check size={20} />

                                </div>

                                <div>

                                    <h3 className="font-bold">
                                        Passenger account
                                    </h3>

                                    <div className="mt-1 flex items-center gap-2">

                                        <span className="h-2 w-2 rounded-full bg-emerald-400" />

                                        <span className="text-sm text-emerald-400">
                                            Active
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </section>
                    </>
                )}

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

export default PassengerProfile;