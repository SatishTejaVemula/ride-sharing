import {
    Bell,
    Menu,
    Plus,
    Search,
} from "lucide-react";

const API_URL = "http://localhost:8080";

const DriverTopbar = ({
    user,
    onMenuClick,
    onCreateRide,
}) => {

    const name = user?.name || "Driver";

    const initial = name
        .charAt(0)
        .toUpperCase();

    /*
     * Backend stores only the filename:
     *
     * 2301a007-d6a4-41cb-8196-b9df6eca9a90.jpeg
     *
     * Actual image endpoint:
     *
     * http://localhost:8080/api/users/profile-images/{filename}
     */
    const profileImage = user?.profileImage
        ? user.profileImage.startsWith("http")
            ? user.profileImage
            : `${API_URL}/api/users/profile-images/${user.profileImage}`
        : "";

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">

            {/* LEFT */}

            <div className="flex items-center gap-4">

                <button
                    type="button"
                    onClick={onMenuClick}
                    className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white lg:hidden"
                >
                    <Menu size={22} />
                </button>

                <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 sm:flex">

                    <Search
                        size={17}
                        className="text-slate-500"
                    />

                    <span className="text-sm text-slate-500">
                        Search anything...
                    </span>

                    <span className="ml-6 rounded-md border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-500">
                        /
                    </span>

                </div>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-3">

                {/* CREATE RIDE */}

                <button
                    type="button"
                    onClick={onCreateRide}
                    className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 sm:flex"
                >
                    <Plus size={17} />

                    Create ride
                </button>

                {/* NOTIFICATIONS */}

                <button
                    type="button"
                    className="relative rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-400 transition hover:text-white"
                >

                    <Bell size={18} />

                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500" />

                </button>

                <div className="hidden h-8 w-px bg-slate-800 sm:block" />

                {/* DRIVER PROFILE */}

                <div className="flex items-center gap-3">

                    {/* NAME */}

                    <div className="hidden text-right sm:block">

                        <p className="text-sm font-semibold text-white">
                            {name}
                        </p>

                        <p className="text-[11px] text-slate-500">
                            Driver
                        </p>

                    </div>

                    {/* PROFILE IMAGE */}

                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20">

                        {profileImage ? (

                            <img
                                src={profileImage}
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

                </div>

            </div>

        </header>
    );
};

export default DriverTopbar;