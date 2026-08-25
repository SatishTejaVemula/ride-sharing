import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

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
    Star,
    Loader2,
} from "lucide-react";


const API_URL =
    "http://localhost:8080";


const Profile = () => {

    const navigate = useNavigate();

    /*
     * =========================================================
     * USER ID
     *
     * If userId exists:
     *
     * /profile/5
     *
     * we are viewing another user's profile.
     *
     * If userId doesn't exist:
     *
     * we are viewing our own profile.
     * =========================================================
     */

    const { userId } = useParams();


    /*
     * =========================================================
     * STATE
     * =========================================================
     */

    const [user, setUser] =
        useState(null);

    const [editing, setEditing] =
        useState(false);

    const [formData, setFormData] =
        useState({
            name: "",
            phone: "",
            profileImage: null,
        });

    const [previewImage, setPreviewImage] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);


    /*
     * =========================================================
     * VIEW MODE
     * =========================================================
     */

    const isViewingOtherUser =
        Boolean(userId);


    /*
     * =========================================================
     * GET PROFILE IMAGE URL
     * =========================================================
     */

    const getProfileImageUrl = (
        profileImage
    ) => {

        if (!profileImage) {
            return "";
        }


        /*
         * Already full URL
         */

        if (
            profileImage.startsWith(
                "http://"
            ) ||
            profileImage.startsWith(
                "https://"
            ) ||
            profileImage.startsWith(
                "blob:"
            )
        ) {

            return profileImage;
        }


        /*
         * Backend returned:
         *
         * /api/users/profile-images/example.jpg
         */

        if (
            profileImage.startsWith(
                "/api/users/profile-images/"
            )
        ) {

            return `${API_URL}${profileImage}`;
        }


        /*
         * Backend returned:
         *
         * /profile-images/example.jpg
         */

        if (
            profileImage.startsWith(
                "/profile-images/"
            )
        ) {

            return `${API_URL}/api/users${profileImage}`;
        }


        /*
         * Backend returned filename only.
         */

        return `${API_URL}/api/users/profile-images/${encodeURIComponent(
            profileImage
        )}`;
    };


    /*
     * =========================================================
     * LOAD PROFILE
     * =========================================================
     */

    useEffect(() => {

        loadProfile();

    }, [userId]);


    const loadProfile = async () => {

        const token =
            localStorage.getItem(
                "token"
            );


        if (!token) {

            toast.error(
                "Please login again."
            );

            navigate("/login");

            return;
        }


        try {

            setLoading(true);


            /*
             * =================================================
             * IMPORTANT
             *
             * Own profile:
             *
             * GET /api/users/profile
             *
             * Other user:
             *
             * GET /api/users/profile/{userId}
             * =================================================
             */

            const endpoint =
                userId
                    ? `${API_URL}/api/users/profile/${userId}`
                    : `${API_URL}/api/users/profile`;


            const response =
                await axios.get(
                    endpoint,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            const profile =
                response.data;


            console.log(
                "PROFILE RESPONSE:",
                profile
            );


            setUser(
                profile
            );


            /*
             * Form data is only useful
             * for own profile.
             */

            if (!userId) {

                setFormData({
                    name:
                        profile.name ||
                        "",

                    phone:
                        profile.phone ||
                        "",

                    profileImage:
                        null,
                });

            }


            /*
             * PROFILE IMAGE
             */

            if (
                profile.profileImage
            ) {

                const imageUrl =
                    getProfileImageUrl(
                        profile.profileImage
                    );


                console.log(
                    "PROFILE IMAGE URL:",
                    imageUrl
                );


                setPreviewImage(
                    imageUrl
                );

            } else {

                setPreviewImage("");

            }


            /*
             * =================================================
             * Only synchronize localStorage
             * for our OWN profile.
             *
             * Never overwrite logged-in user
             * with another person's data.
             * =================================================
             */

            if (!userId) {

                const storedUser =
                    localStorage.getItem(
                        "user"
                    );


                if (storedUser) {

                    try {

                        const oldUser =
                            JSON.parse(
                                storedUser
                            );


                        localStorage.setItem(
                            "user",
                            JSON.stringify({
                                ...oldUser,
                                ...profile,
                            })
                        );

                    } catch (
                        error
                    ) {

                        console.error(
                            "Failed to sync local user:",
                            error
                        );

                    }
                }
            }

        } catch (error) {

            console.error(
                "Failed to load profile:",
                error
            );


            /*
             * Unauthorized
             */

            if (
                error.response?.status ===
                401
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );


                toast.error(
                    "Session expired. Please login again."
                );


                navigate("/login");

                return;
            }


            /*
             * Profile not found
             */

            if (
                error.response?.status ===
                404
            ) {

                toast.error(
                    "Profile not found."
                );


                if (userId) {

                    navigate(-1);

                } else {

                    navigate("/");

                }

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


    /*
     * =========================================================
     * INPUT CHANGE
     * =========================================================
     */

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;


        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );
    };


    /*
     * =========================================================
     * IMAGE CHANGE
     * =========================================================
     */

    const handleImageChange = (
        event
    ) => {

        const file =
            event.target.files?.[0];


        if (!file) {
            return;
        }


        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            toast.error(
                "Only JPG, PNG, WEBP or GIF images are allowed."
            );


            event.target.value =
                "";


            return;
        }


        const maxSize =
            5 * 1024 * 1024;


        if (
            file.size > maxSize
        ) {

            toast.error(
                "Image size must be less than 5 MB."
            );


            event.target.value =
                "";


            return;
        }


        setFormData(
            (previous) => ({
                ...previous,
                profileImage: file,
            })
        );


        const imageUrl =
            URL.createObjectURL(
                file
            );


        setPreviewImage(
            imageUrl
        );
    };


    /*
     * =========================================================
     * EDIT PROFILE
     * =========================================================
     */

    const handleEdit = () => {

        if (!user) {
            return;
        }


        /*
         * Never allow editing
         * another user's profile.
         */

        if (isViewingOtherUser) {
            return;
        }


        setFormData({
            name:
                user.name || "",

            phone:
                user.phone || "",

            profileImage:
                null,
        });


        if (
            user.profileImage
        ) {

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


    /*
     * =========================================================
     * CANCEL EDIT
     * =========================================================
     */

    const handleCancel = () => {

        if (!user) {
            return;
        }


        setFormData({
            name:
                user.name || "",

            phone:
                user.phone || "",

            profileImage:
                null,
        });


        if (
            user.profileImage
        ) {

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


    /*
     * =========================================================
     * SAVE PROFILE
     * =========================================================
     */

    const handleSave = async (
        event
    ) => {

        event.preventDefault();


        if (isViewingOtherUser) {

            toast.error(
                "You cannot edit another user's profile."
            );

            return;
        }


        const token =
            localStorage.getItem(
                "token"
            );


        if (!token) {

            toast.error(
                "Please login again."
            );

            navigate("/login");

            return;
        }


        try {

            setSaving(true);


            /*
             * Multipart form data
             */

            const data =
                new FormData();


            data.append(
                "name",
                formData.name
            );


            data.append(
                "phone",
                formData.phone
            );


            if (
                formData.profileImage
            ) {

                data.append(
                    "profileImage",
                    formData.profileImage
                );
            }


            /*
             * Existing profile update endpoint
             *
             * PUT /api/users/profile
             */

            const response =
                await axios.put(
                    `${API_URL}/api/users/profile`,
                    data,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            const updatedProfile =
                response.data;


            setUser(
                updatedProfile
            );


            /*
             * Update image
             */

            if (
                updatedProfile.profileImage
            ) {

                setPreviewImage(
                    getProfileImageUrl(
                        updatedProfile.profileImage
                    )
                );

            }


            /*
             * Update local storage
             */

            const storedUser =
                localStorage.getItem(
                    "user"
                );


            if (storedUser) {

                try {

                    const oldUser =
                        JSON.parse(
                            storedUser
                        );


                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            ...oldUser,
                            ...updatedProfile,
                        })
                    );

                } catch (
                    error
                ) {

                    console.error(
                        "Failed to update local user:",
                        error
                    );

                }
            }


            setFormData({
                name:
                    updatedProfile.name ||
                    "",

                phone:
                    updatedProfile.phone ||
                    "",

                profileImage:
                    null,
            });


            setEditing(false);


            toast.success(
                "Profile updated successfully."
            );

        } catch (error) {

            console.error(
                "Failed to update profile:",
                error
            );


            if (
                error.response?.status ===
                401
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );


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


    /*
     * =========================================================
     * LOADING
     * =========================================================
     */

    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">

                <div className="flex items-center gap-3 text-sm text-slate-400">

                    <Loader2
                        size={20}
                        className="animate-spin text-blue-500"
                    />

                    Loading profile...

                </div>

            </div>
        );
    }


    /*
     * =========================================================
     * NO USER
     * =========================================================
     */

    if (!user) {
        return null;
    }


    /*
     * =========================================================
     * DISPLAY VALUES
     * =========================================================
     */

    const displayName =
        user.name ||
        "User";


    const initial =
        displayName
            .charAt(0)
            .toUpperCase();


    const role =
        user.role ||
        user.authRole ||
        "USER";


    /*
     * =========================================================
     * UI
     * =========================================================
     */

    return (

        <div className="min-h-screen bg-slate-950 text-white">


            {/* Background */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />

                <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-600/10 blur-[130px]" />

            </div>


            {/* Header */}

            <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">

                <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">


                    <button
                        onClick={() =>
                            navigate(-1)
                        }
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white"
                    >

                        <ArrowLeft
                            size={18}
                        />

                        <span className="hidden sm:inline">
                            Back
                        </span>

                    </button>


                    <div className="flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">

                            <CarFront
                                size={18}
                            />

                        </div>


                        <span className="text-lg font-black">

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

                <div className="mb-8">

                    <p className="text-sm font-semibold text-blue-400">

                        {isViewingOtherUser
                            ? "RideFlow member"
                            : "My account"}

                    </p>


                    <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">

                        {isViewingOtherUser
                            ? "Profile"
                            : "My Profile"}

                    </h1>


                    <p className="mt-2 text-sm leading-6 text-slate-400">

                        {isViewingOtherUser
                            ? "View this RideFlow user's profile information."
                            : "Manage your RideFlow account information."}

                    </p>

                </div>


                {/* Profile card */}

                <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 shadow-2xl backdrop-blur-xl">


                    {/* Profile hero */}

                    <div className="relative border-b border-slate-800/80 p-6 sm:p-8">

                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">


                            <div className="flex items-center gap-5">


                                {/* Avatar */}

                                <div className="relative">

                                    {previewImage ? (

                                        <img
                                            src={
                                                previewImage
                                            }
                                            alt={
                                                displayName
                                            }
                                            className="h-24 w-24 rounded-3xl object-cover ring-2 ring-blue-500/20"
                                        />

                                    ) : (

                                        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-500/10 text-3xl font-black text-blue-400 ring-2 ring-blue-500/20">

                                            {initial}

                                        </div>

                                    )}


                                    {/* Upload button only for own profile */}

                                    {!isViewingOtherUser &&
                                        editing && (

                                            <label className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500">

                                                <Upload
                                                    size={
                                                        16
                                                    }
                                                />

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={
                                                        handleImageChange
                                                    }
                                                    className="hidden"
                                                />

                                            </label>

                                        )}

                                </div>


                                <div>

                                    <div className="flex flex-wrap items-center gap-2">

                                        <h2 className="text-2xl font-black">

                                            {
                                                displayName
                                            }

                                        </h2>


                                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">

                                            {role}

                                        </span>

                                    </div>


                                    <p className="mt-2 text-sm text-slate-500">

                                        RideFlow member

                                    </p>

                                </div>

                            </div>


                            {/* Edit button */}

                            {!isViewingOtherUser &&
                                !editing && (

                                    <button
                                        onClick={
                                            handleEdit
                                        }
                                        className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-blue-500/30 hover:bg-slate-800 hover:text-white"
                                    >

                                        <Pencil
                                            size={
                                                16
                                            }
                                        />

                                        Edit profile

                                    </button>

                                )}

                        </div>

                    </div>


                    {/* Profile information */}

                    <div className="p-6 sm:p-8">


                        {editing &&
                        !isViewingOtherUser ? (

                            <form
                                onSubmit={
                                    handleSave
                                }
                                className="space-y-6"
                            >


                                {/* Name */}

                                <div>

                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Full name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={
                                            formData.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500"
                                        placeholder="Enter your name"
                                    />

                                </div>


                                {/* Phone */}

                                <div>

                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Phone
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={
                                            formData.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500"
                                        placeholder="Enter your phone number"
                                    />

                                </div>


                                {/* Buttons */}

                                <div className="flex flex-col gap-3 border-t border-slate-800/70 pt-5 sm:flex-row sm:justify-end">


                                    <button
                                        type="button"
                                        onClick={
                                            handleCancel
                                        }
                                        disabled={
                                            saving
                                        }
                                        className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                                    >

                                        <X
                                            size={
                                                16
                                            }
                                        />

                                        Cancel

                                    </button>


                                    <button
                                        type="submit"
                                        disabled={
                                            saving
                                        }
                                        className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {saving ? (

                                            <Loader2
                                                size={
                                                    16
                                                }
                                                className="animate-spin"
                                            />

                                        ) : (

                                            <Save
                                                size={
                                                    16
                                                }
                                            />

                                        )}

                                        {saving
                                            ? "Saving..."
                                            : "Save changes"}

                                    </button>

                                </div>

                            </form>

                        ) : (

                            <div className="space-y-4">


                                {/* Email */}

                                <InfoRow
                                    icon={
                                        Mail
                                    }
                                    label="Email"
                                    value={
                                        user.email ||
                                        "Not available"
                                    }
                                />


                                {/* Phone */}

                                <InfoRow
                                    icon={
                                        Phone
                                    }
                                    label="Phone"
                                    value={
                                        user.phone ||
                                        "Not available"
                                    }
                                />


                                {/* Role */}

                                <InfoRow
                                    icon={
                                        ShieldCheck
                                    }
                                    label="Role"
                                    value={
                                        role
                                    }
                                />


                                {/* User ID */}

                                <InfoRow
                                    icon={
                                        UserRound
                                    }
                                    label="User ID"
                                    value={
                                        user.id ||
                                        user.authUserId ||
                                        user.userId ||
                                        "Not available"
                                    }
                                />


                                {/* Rating */}

                                {user.rating !==
                                    undefined &&
                                    user.rating !==
                                        null && (

                                    <InfoRow
                                        icon={
                                            Star
                                        }
                                        label="Rating"
                                        value={
                                            user.rating
                                        }
                                    />

                                )}

                            </div>

                        )}

                    </div>


                    {/* Trust section */}

                    <div className="border-t border-slate-800/80 bg-blue-500/5 p-6 sm:p-8">

                        <div className="flex gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">

                                <ShieldCheck
                                    size={
                                        22
                                    }
                                />

                            </div>


                            <div>

                                <h3 className="font-bold">

                                    RideFlow verified member

                                </h3>


                                <p className="mt-1 text-sm leading-6 text-slate-500">

                                    {isViewingOtherUser
                                        ? "Review the available profile information before travelling together."
                                        : "Keep your profile information up to date so other RideFlow members can identify you."}

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
};


/*
 * =========================================================
 * INFO ROW
 * =========================================================
 */

const InfoRow = ({
    icon: Icon,
    label,
    value,
}) => {

    return (

        <div className="flex items-center gap-4 rounded-2xl border border-slate-800/70 bg-slate-950/50 p-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">

                <Icon
                    size={18}
                />

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


export default Profile;