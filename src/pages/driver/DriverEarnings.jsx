import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    CarFront,
    CheckCircle2,
    Clock3,
    IndianRupee,
    MapPin,
    RefreshCw,
    Ticket,
    Users,
} from "lucide-react";

const API_URL = "http://localhost:8080";

const DriverEarnings = () => {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadEarnings = async (isRefresh = false) => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login again.");
            navigate("/login");
            return;
        }

        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const bookingResponse = await axios.get(
                `${API_URL}/api/bookings/driver`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const allBookings = bookingResponse.data || [];

            const confirmedBookings = allBookings.filter(
                (booking) => booking.status === "CONFIRMED"
            );

            setBookings(confirmedBookings);

            const rideIds = [
                ...new Set(
                    confirmedBookings
                        .map((booking) => booking.rideId)
                        .filter(Boolean)
                ),
            ];

            if (rideIds.length === 0) {
                setRides([]);
                return;
            }

            const responses = await Promise.all(
                rideIds.map((rideId) =>
                    axios.get(
                        `${API_URL}/api/rides/${rideId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                )
            );

            setRides(
                responses
                    .map((response) => response.data)
                    .filter(Boolean)
            );
        } catch (error) {
            console.error(
                "Failed to load earnings:",
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
                "Unable to load earnings."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadEarnings();
    }, []);

    const rideMap = useMemo(() => {
        return new Map(
            rides.map((ride) => [ride.id, ride])
        );
    }, [rides]);

    const totalEarnings = useMemo(() => {
        return bookings.reduce(
            (sum, booking) =>
                sum + Number(booking.totalPrice || 0),
            0
        );
    }, [bookings]);

    const totalSeats = useMemo(() => {
        return bookings.reduce(
            (sum, booking) =>
                sum + Number(booking.seatsBooked || 0),
            0
        );
    }, [bookings]);

    const averageBooking = bookings.length
        ? totalEarnings / bookings.length
        : 0;

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
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

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
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
                            loadEarnings(true)
                        }
                        disabled={refreshing}
                        className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        <span className="hidden sm:inline">
                            Refresh
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

                    <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                        Earnings
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        Track your earnings from confirmed
                        passenger bookings.
                    </p>

                </section>

                {/* Stats */}

                <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <SummaryCard
                        label="Total earnings"
                        value={`₹${totalEarnings.toLocaleString(
                            "en-IN"
                        )}`}
                        icon={IndianRupee}
                    />

                    <SummaryCard
                        label="Confirmed bookings"
                        value={bookings.length}
                        icon={CheckCircle2}
                    />

                    <SummaryCard
                        label="Seats sold"
                        value={totalSeats}
                        icon={Users}
                    />

                    <SummaryCard
                        label="Average booking"
                        value={`₹${Math.round(
                            averageBooking
                        ).toLocaleString("en-IN")}`}
                        icon={Ticket}
                    />

                </section>

                {/* Earnings list */}

                {loading ? (

                    <div className="space-y-4">

                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-52 animate-pulse rounded-3xl border border-slate-800 bg-slate-900/50"
                            />
                        ))}

                    </div>

                ) : bookings.length === 0 ? (

                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 px-6 text-center">

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900">
                            <IndianRupee
                                size={28}
                                className="text-slate-600"
                            />
                        </div>

                        <h2 className="mt-5 text-xl font-bold">
                            No earnings yet
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Earnings will appear here after
                            passengers make confirmed bookings
                            on your rides.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/driver/rides")
                            }
                            className="mt-6 flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
                        >
                            <CarFront size={17} />
                            View my rides
                        </button>

                    </div>

                ) : (

                    <section>

                        <div className="mb-4 flex items-center justify-between">

                            <div>

                                <h2 className="text-lg font-bold">
                                    Confirmed bookings
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Earnings generated from completed
                                    booking confirmations.
                                </p>

                            </div>

                        </div>

                        <div className="space-y-4">

                            {bookings.map((booking) => {

                                const ride =
                                    rideMap.get(
                                        booking.rideId
                                    );

                                return (
                                    <article
                                        key={booking.id}
                                        className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-xl transition hover:border-slate-700 sm:p-6"
                                    >

                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                            {/* Ride */}

                                            <div className="min-w-0 flex-1">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                                                        <CarFront
                                                            size={19}
                                                        />
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="text-xs text-slate-500">
                                                            Booking #
                                                            {
                                                                booking.id
                                                            }
                                                        </p>

                                                        <h3 className="mt-1 font-bold">
                                                            {ride
                                                                ? `${ride.pickupLocation} → ${ride.dropLocation}`
                                                                : `Ride #${booking.rideId}`}
                                                        </h3>

                                                    </div>

                                                </div>

                                                {ride && (
                                                    <div className="mt-5 grid gap-3 sm:grid-cols-3">

                                                        <Info
                                                            icon={
                                                                MapPin
                                                            }
                                                            label="Route"
                                                            value={`${ride.pickupLocation} → ${ride.dropLocation}`}
                                                        />

                                                        <Info
                                                            icon={
                                                                Clock3
                                                            }
                                                            label="Ride date"
                                                            value={formatDate(
                                                                ride.rideDate
                                                            )}
                                                        />

                                                        <Info
                                                            icon={
                                                                Users
                                                            }
                                                            label="Seats"
                                                            value={
                                                                booking.seatsBooked
                                                            }
                                                        />

                                                    </div>
                                                )}

                                            </div>

                                            {/* Amount */}

                                            <div className="flex items-center justify-between gap-8 border-t border-slate-800 pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">

                                                <div>

                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                        Passenger
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-slate-300">
                                                        ID #
                                                        {
                                                            booking.passengerId
                                                        }
                                                    </p>

                                                </div>

                                                <div className="text-right">

                                                    <div className="flex items-center justify-end gap-1 text-emerald-400">

                                                        <CheckCircle2
                                                            size={15}
                                                        />

                                                        <span className="text-[10px] font-bold uppercase tracking-wider">
                                                            Confirmed
                                                        </span>

                                                    </div>

                                                    <p className="mt-1 text-2xl font-black">
                                                        ₹
                                                        {Number(
                                                            booking.totalPrice ||
                                                            0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </article>
                                );
                            })}

                        </div>

                    </section>

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

                    <p className="mt-2 text-2xl font-black sm:text-3xl">
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

const Info = ({
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

export default DriverEarnings;