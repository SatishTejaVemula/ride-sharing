import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CarFront,
    Clock3,
    Edit3,
    Loader2,
    MapPin,
    Plus,
    Trash2,
    Users,
} from "lucide-react";

const API_URL = "http://localhost:8080";

const MyRides = () => {
    const navigate = useNavigate();

    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                console.error("Invalid user data");
            }
        }
    }, []);

    const driverId = user?.authUserId || user?.id;

    useEffect(() => {
        if (!driverId) {
            return;
        }

        const loadRides = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `${API_URL}/api/rides/driver/${driverId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setRides(response.data || []);
            } catch (error) {
                console.error("Failed to load rides:", error);

                if (error.response?.status === 401) {
                    toast.error("Session expired. Please login again.");

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login");
                    return;
                }

                toast.error("Unable to load your rides.");
            } finally {
                setLoading(false);
            }
        };

        loadRides();
    }, [driverId, navigate]);

    const sortedRides = useMemo(() => {
        return [...rides].sort((a, b) => {
            const dateA = new Date(
                `${a.rideDate}T${a.rideTime || "00:00"}`
            );

            const dateB = new Date(
                `${b.rideDate}T${b.rideTime || "00:00"}`
            );

            return dateA - dateB;
        });
    }, [rides]);

    const availableCount = rides.filter(
        (ride) => ride.status === "AVAILABLE"
    ).length;

    const fullCount = rides.filter(
        (ride) => ride.status === "FULL"
    ).length;

    const totalSeats = rides.reduce(
        (sum, ride) => sum + Number(ride.availableSeats || 0),
        0
    );

    const handleDelete = async (rideId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this ride?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(rideId);

            const token = localStorage.getItem("token");

            await axios.delete(
                `${API_URL}/api/rides/${rideId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setRides((previous) =>
                previous.filter((ride) => ride.id !== rideId)
            );

            toast.success("Ride deleted successfully.");
        } catch (error) {
            console.error("Delete ride failed:", error);

            if (error.response?.status === 403) {
                toast.error(
                    "You can only delete your own rides."
                );
            } else if (error.response?.status === 404) {
                toast.error("Ride no longer exists.");
            } else {
                toast.error("Failed to delete ride.");
            }
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusClasses = (status) => {
        if (status === "FULL") {
            return "border-orange-500/20 bg-orange-500/10 text-orange-400";
        }

        if (status === "CANCELLED") {
            return "border-red-500/20 bg-red-500/10 text-red-400";
        }

        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Background */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

                <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />

            </div>


            {/* Header */}

            <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">

                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                    <button
                        onClick={() =>
                            navigate("/driver/dashboard")
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

                        <span className="text-lg font-black">
                            RideFlow
                            <span className="text-blue-500">
                                .
                            </span>
                        </span>

                    </div>


                    <button
                        onClick={() =>
                            navigate("/driver/create-ride")
                        }
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                    >
                        <Plus size={17} />

                        <span className="hidden sm:inline">
                            Create ride
                        </span>
                    </button>

                </div>

            </header>


            {/* Main */}

            <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

                {/* Heading */}

                <section className="mb-8">

                    <p className="text-sm font-semibold text-blue-400">
                        Driver workspace
                    </p>

                    <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-end">

                        <div>

                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                My rides
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                                Manage every journey you've created
                                and keep your ride availability up to
                                date.
                            </p>

                        </div>

                    </div>

                </section>


                {/* Stats */}

                <section className="mb-8 grid gap-4 sm:grid-cols-3">

                    <SummaryCard
                        label="Total rides"
                        value={rides.length}
                        icon={CarFront}
                    />

                    <SummaryCard
                        label="Available"
                        value={availableCount}
                        icon={Users}
                    />

                    <SummaryCard
                        label="Open seats"
                        value={totalSeats}
                        icon={Users}
                    />

                </section>


                {/* Content */}

                {loading ? (

                    <div className="space-y-5">

                        {[1, 2, 3].map((item) => (

                            <div
                                key={item}
                                className="h-56 animate-pulse rounded-3xl border border-slate-800 bg-slate-900/60"
                            />

                        ))}

                    </div>

                ) : sortedRides.length === 0 ? (

                    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 px-6 text-center">

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900">
                            <CarFront
                                size={28}
                                className="text-slate-600"
                            />
                        </div>

                        <h2 className="mt-5 text-xl font-bold">
                            No rides created yet
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Create your first ride and start
                            sharing your journey with passengers.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/driver/create-ride")
                            }
                            className="mt-6 flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                        >
                            <Plus size={17} />

                            Create your first ride
                        </button>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {sortedRides.map((ride) => (

                            <article
                                key={ride.id}
                                className="group overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 shadow-xl shadow-black/5 backdrop-blur-xl transition duration-300 hover:border-slate-700 hover:bg-slate-900/70"
                            >

                                <div className="p-5 sm:p-6">

                                    {/* Top */}

                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                        <div className="min-w-0 flex-1">

                                            <div className="mb-4 flex flex-wrap items-center gap-3">

                                                <span
                                                    className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${getStatusClasses(
                                                        ride.status
                                                    )}`}
                                                >
                                                    {ride.status}
                                                </span>

                                                <span className="text-xs text-slate-600">
                                                    Ride #{ride.id}
                                                </span>

                                            </div>


                                            {/* Route */}

                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">

                                                <div className="flex min-w-0 items-center gap-3">

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                                        <MapPin size={18} />
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                                            Pickup
                                                        </p>

                                                        <p className="truncate text-sm font-bold text-white">
                                                            {ride.pickupLocation}
                                                        </p>

                                                    </div>

                                                </div>


                                                <ArrowRight
                                                    size={18}
                                                    className="hidden shrink-0 text-slate-700 sm:block"
                                                />


                                                <div className="flex min-w-0 items-center gap-3">

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                                        <MapPin size={18} />
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                                            Destination
                                                        </p>

                                                        <p className="truncate text-sm font-bold text-white">
                                                            {ride.dropLocation}
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>


                                        {/* Price */}

                                        <div className="rounded-2xl bg-slate-950/70 px-5 py-4 lg:min-w-36 lg:text-right">

                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                Price / seat
                                            </p>

                                            <p className="mt-1 text-2xl font-black text-white">
                                                ₹
                                                {Number(
                                                    ride.price || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>

                                        </div>

                                    </div>


                                    {/* Details */}

                                    <div className="mt-6 grid gap-3 border-t border-slate-800/70 pt-5 sm:grid-cols-3">

                                        <Detail
                                            icon={CalendarDays}
                                            label="Date"
                                            value={formatDate(
                                                ride.rideDate
                                            )}
                                        />

                                        <Detail
                                            icon={Clock3}
                                            label="Departure"
                                            value={
                                                ride.rideTime ||
                                                "—"
                                            }
                                        />

                                        <Detail
                                            icon={Users}
                                            label="Available seats"
                                            value={
                                                ride.availableSeats ??
                                                0
                                            }
                                        />

                                    </div>


                                    {/* Actions */}

                                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-800/70 pt-5 sm:flex-row sm:justify-end">

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/driver/rides/${ride.id}/edit`
                                                )
                                            }
                                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                        >
                                            <Edit3 size={16} />

                                            Edit ride
                                        </button>


                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    ride.id
                                                )
                                            }
                                            disabled={
                                                deletingId ===
                                                ride.id
                                            }
                                            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {deletingId ===
                                            ride.id ? (
                                                <>
                                                    <Loader2
                                                        size={16}
                                                        className="animate-spin"
                                                    />

                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2
                                                        size={16}
                                                    />

                                                    Delete ride
                                                </>
                                            )}
                                        </button>

                                    </div>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
};


const SummaryCard = ({
    label,
    value,
    icon: Icon,
}) => {
    return (
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-xl">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-xs font-medium text-slate-500">
                        {label}
                    </p>

                    <p className="mt-2 text-3xl font-black">
                        {value}
                    </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                    <Icon size={20} />
                </div>

            </div>

        </div>
    );
};


const Detail = ({
    icon: Icon,
    label,
    value,
}) => {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-slate-950/50 p-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-slate-500">
                <Icon size={16} />
            </div>

            <div className="min-w-0">

                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    {label}
                </p>

                <p className="mt-1 truncate text-xs font-semibold text-slate-300">
                    {value}
                </p>

            </div>

        </div>
    );
};

export default MyRides;