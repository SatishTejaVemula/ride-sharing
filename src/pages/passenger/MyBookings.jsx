import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PassengerSidebar from "../../components/passenger/PassengerSidebar";
import PassengerTopbar from "../../components/passenger/PassengerTopbar";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CarFront,
    CheckCircle2,
    Clock3,
    IndianRupee,
    Loader2,
    MapPin,
    RefreshCw,
    Ticket,
    Users,
    XCircle,
    AlertTriangle,
} from "lucide-react";

const API_URL = "http://localhost:8080";

const MyBookings = () => {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

    // Confirmation popup
    const [confirmCancelId, setConfirmCancelId] = useState(null);

    // Sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.success("Logged out successfully.");
        navigate("/login");
    };

    // ==========================================
    // LOAD BOOKINGS
    // ==========================================

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            toast.error("Please login again.");
            navigate("/login");
            return;
        }

        try {
            setLoading(true);

            const user = JSON.parse(storedUser);

            /*
             * IMPORTANT:
             * passengerId should be the USER SERVICE ID.
             *
             * Your backend currently resolves the authenticated
             * passenger as ID 10.
             */
            const passengerId = user.id;

            const response = await axios.get(
                `${API_URL}/api/bookings/passenger`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const bookingData = response.data || [];

            // Fetch ride details for every booking
            const bookingsWithRides = await Promise.all(
                bookingData.map(async (booking) => {
                    try {
                        const rideResponse = await axios.get(
                            `${API_URL}/api/rides/${booking.rideId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        return {
                            ...booking,
                            ride: rideResponse.data,
                        };
                    } catch (error) {
                        console.error(
                            `Failed to load ride ${booking.rideId}`,
                            error
                        );

                        return {
                            ...booking,
                            ride: null,
                        };
                    }
                })
            );

            setBookings(bookingsWithRides);
        } catch (error) {
            console.error("Failed to load bookings:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                toast.error(
                    "Session expired. Please login again."
                );

                navigate("/login");
                return;
            }

            if (error.response?.status === 403) {
                toast.error(
                    "You are not authorized to view these bookings."
                );
                return;
            }

            toast.error(
                error.response?.data?.message ||
                    "Unable to load bookings."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // CANCEL BOOKING
    // ==========================================

    const cancelBooking = async (bookingId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setCancellingId(bookingId);

            const response = await axios.put(
                `${API_URL}/api/bookings/${bookingId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                "Booking cancelled successfully."
            );

            setBookings((current) =>
                current.map((booking) =>
                    booking.id === bookingId
                        ? {
                              ...booking,
                              status:
                                  response.data?.status ||
                                  "CANCELLED",
                          }
                        : booking
                )
            );
        } catch (error) {
            console.error(
                "Failed to cancel booking:",
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

            if (error.response?.status === 403) {
                toast.error(
                    "You are not authorized to cancel this booking."
                );
                return;
            }

            toast.error(
                error.response?.data?.message ||
                    "Unable to cancel booking."
            );
        } finally {
            setCancellingId(null);
        }
    };

    // ==========================================
    // STATS
    // ==========================================

    const confirmedCount = bookings.filter(
        (booking) =>
            booking.status === "CONFIRMED"
    ).length;

    const pendingCount = bookings.filter(
        (booking) =>
            booking.status === "PENDING"
    ).length;

    const cancelledCount = bookings.filter(
        (booking) =>
            booking.status === "CANCELLED"
    ).length;

    const totalSpent = bookings
        .filter(
            (booking) =>
                booking.status === "CONFIRMED"
        )
        .reduce(
            (total, booking) =>
                total +
                Number(booking.totalPrice || 0),
            0
        );

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* =================================
                PASSENGER SIDEBAR
            ================================= */}

            <PassengerSidebar
                open={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
                onLogout={handleLogout}
            />

            {/* =================================
                CONTENT AREA
            ================================= */}

            <div className="lg:pl-72">

                {/* =================================
                    TOPBAR
                ================================= */}

                <PassengerTopbar
                    onMenuClick={() =>
                        setSidebarOpen(true)
                    }
                    onLogout={handleLogout}
                />

                {/* =================================
                    AMBIENT BACKGROUND
                ================================= */}

                <div className="pointer-events-none fixed inset-0 overflow-hidden">

                    <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />

                    <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-600/10 blur-[130px]" />

                </div>

                {/* =================================
                    HEADER
                ================================= */}

                <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-2xl">

                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                        <button
                            onClick={() =>
                                navigate(
                                    "/passenger/dashboard"
                                )
                            }
                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white"
                        >
                            <ArrowLeft size={18} />

                            <span className="hidden sm:inline">
                                Explore rides
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
                            onClick={loadBookings}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RefreshCw
                                size={16}
                                className={
                                    loading
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

                {/* =================================
                    MAIN
                ================================= */}

                <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

                    {/* =================================
                        HEADING
                    ================================= */}

                    <motion.section
                        initial={{
                            opacity: 0,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                    >

                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-400">

                            <Ticket size={14} />

                            Your journeys

                        </div>

                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                            My bookings
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Manage your upcoming and previous
                            RideFlow journeys.
                        </p>

                    </motion.section>

                    {/* =================================
                        STATS
                    ================================= */}

                    <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">

                        <StatCard
                            icon={Ticket}
                            label="Total bookings"
                            value={bookings.length}
                        />

                        <StatCard
                            icon={Clock3}
                            label="Pending"
                            value={pendingCount}
                            type="pending"
                        />

                        <StatCard
                            icon={CheckCircle2}
                            label="Confirmed"
                            value={confirmedCount}
                            type="confirmed"
                        />

                        <StatCard
                            icon={XCircle}
                            label="Cancelled"
                            value={cancelledCount}
                            type="cancelled"
                        />

                        <StatCard
                            icon={IndianRupee}
                            label="Total spent"
                            value={`₹${totalSpent.toLocaleString(
                                "en-IN"
                            )}`}
                        />

                    </div>

                    {/* =================================
                        BOOKINGS
                    ================================= */}

                    <section className="mt-10">

                        <div className="mb-5 flex items-center justify-between">

                            <h2 className="text-xl font-black">
                                Booking history
                            </h2>

                            <span className="text-xs font-semibold text-slate-600">
                                {bookings.length}{" "}
                                {bookings.length === 1
                                    ? "booking"
                                    : "bookings"}
                            </span>

                        </div>

                        {loading ? (

                            <div className="space-y-4">

                                {[1, 2, 3].map(
                                    (item) => (
                                        <div
                                            key={item}
                                            className="h-48 animate-pulse rounded-3xl border border-slate-800 bg-slate-900/60"
                                        />
                                    )
                                )}

                            </div>

                        ) : bookings.length === 0 ? (

                            <EmptyState
                                onExplore={() =>
                                    navigate(
                                        "/passenger/dashboard"
                                    )
                                }
                            />

                        ) : (

                            <div className="space-y-4">

                                {bookings.map(
                                    (
                                        booking,
                                        index
                                    ) => (
                                        <BookingCard
                                            key={
                                                booking.id
                                            }
                                            booking={
                                                booking
                                            }
                                            index={
                                                index
                                            }
                                            onCancel={
                                                cancelBooking
                                            }
                                            cancellingId={
                                                cancellingId
                                            }
                                        />
                                    )
                                )}

                            </div>

                        )}

                    </section>

                </main>

            </div>

        </div>
    );
};

// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({
    icon: Icon,
    label,
    value,
    type,
}) => {

    let iconClass =
        "bg-blue-500/10 text-blue-400";

    if (type === "pending") {
        iconClass =
            "bg-yellow-500/10 text-yellow-400";
    }

    if (type === "confirmed") {
        iconClass =
            "bg-emerald-500/10 text-emerald-400";
    }

    if (type === "cancelled") {
        iconClass =
            "bg-red-500/10 text-red-400";
    }

    return (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-xl sm:p-5">

            <div className="flex items-center justify-between">

                <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon size={17} />
                </div>

            </div>

            <p className="mt-4 text-2xl font-black">
                {value}
            </p>

            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                {label}
            </p>

        </div>
    );
};

// ======================================================
// BOOKING CARD
// ======================================================

const BookingCard = ({
    booking,
    index,
    onCancel,
    cancellingId,
}) => {

    const navigate = useNavigate();

    const [confirmCancel, setConfirmCancel] =
        useState(false);

    const isCancelled =
        booking.status === "CANCELLED";

    const isConfirmed =
        booking.status === "CONFIRMED";

    const isPending =
        booking.status === "PENDING";

    return (
        <>
            <motion.article
                initial={{
                    opacity: 0,
                    y: 15,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    delay: index * 0.05,
                }}
                className={`overflow-hidden rounded-3xl border bg-slate-900/60 shadow-xl backdrop-blur-xl ${
                    isCancelled
                        ? "border-slate-800/60 opacity-75"
                        : "border-slate-800/80"
                }`}
            >

                <div className="p-5 sm:p-6">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

                        {/* =================================
                            BOOKING ID
                        ================================= */}

                        <div className="flex items-center gap-4 lg:w-44">

                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                                    isCancelled
                                        ? "bg-red-500/10 text-red-400"
                                        : isPending
                                        ? "bg-yellow-500/10 text-yellow-400"
                                        : "bg-blue-500/10 text-blue-400"
                                }`}
                            >

                                {isCancelled ? (
                                    <XCircle size={22} />
                                ) : isPending ? (
                                    <Clock3 size={22} />
                                ) : (
                                    <Ticket size={22} />
                                )}

                            </div>

                            <div>

                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Booking
                                </p>

                                <p className="mt-1 font-black">
                                    #{booking.id}
                                </p>

                            </div>

                        </div>

                        {/* =================================
                            ROUTE
                        ================================= */}

                        <div className="min-w-0 flex-1">

                            {booking.ride ? (

                                <>
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                                        <div className="min-w-0 flex-1">

                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                Pickup
                                            </p>

                                            <div className="mt-1 flex items-center gap-2">

                                                <MapPin
                                                    size={14}
                                                    className="shrink-0 text-blue-400"
                                                />

                                                <p className="truncate text-sm font-bold">
                                                    {
                                                        booking
                                                            .ride
                                                            .pickupLocation
                                                    }
                                                </p>

                                            </div>

                                        </div>

                                        <ArrowRight
                                            size={18}
                                            className="hidden shrink-0 text-slate-700 sm:block"
                                        />

                                        <div className="min-w-0 flex-1">

                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                Destination
                                            </p>

                                            <div className="mt-1 flex items-center gap-2">

                                                <MapPin
                                                    size={14}
                                                    className="shrink-0 text-indigo-400"
                                                />

                                                <p className="truncate text-sm font-bold">
                                                    {
                                                        booking
                                                            .ride
                                                            .dropLocation
                                                    }
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    {/* =================================
                                        RIDE INFO
                                    ================================= */}

                                    <div className="mt-4 flex flex-wrap gap-4">

                                        <SmallInfo
                                            icon={
                                                CalendarDays
                                            }
                                            text={
                                                booking
                                                    .ride
                                                    .rideDate
                                            }
                                        />

                                        <SmallInfo
                                            icon={Clock3}
                                            text={
                                                booking
                                                    .ride
                                                    .rideTime
                                            }
                                        />

                                        <SmallInfo
                                            icon={Users}
                                            text={`${booking.seatsBooked} ${
                                                booking.seatsBooked ===
                                                1
                                                    ? "seat"
                                                    : "seats"
                                            }`}
                                        />

                                        <SmallInfo
                                            icon={
                                                IndianRupee
                                            }
                                            text={`₹${Number(
                                                booking.totalPrice ||
                                                    0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}`}
                                        />

                                    </div>

                                </>

                            ) : (

                                <>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                        Ride
                                    </p>

                                    <p className="mt-1 text-sm font-bold">
                                        Ride #
                                        {
                                            booking.rideId
                                        }
                                    </p>

                                </>

                            )}

                        </div>

                        {/* =================================
                            STATUS + ACTIONS
                        ================================= */}

                        <div className="flex flex-row items-center justify-between gap-4 lg:w-56 lg:flex-col lg:items-end">

                            {/* STATUS */}

                            <StatusBadge
                                status={
                                    booking.status
                                }
                            />

                            {/* ACTIONS */}

                            <div className="flex gap-2">

                                {/* VIEW RIDE */}

                                {(isConfirmed ||
                                    isPending) &&
                                    booking.ride && (
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/passenger/rides/${booking.rideId}`
                                                )
                                            }
                                            className="flex items-center gap-1.5 rounded-xl border border-slate-800 px-3 py-2 text-xs font-bold text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                        >
                                            View ride

                                            <ArrowRight
                                                size={
                                                    13
                                                }
                                            />
                                        </button>
                                    )}

                                {/* CANCEL */}

                                {(isConfirmed ||
                                    isPending) && (
                                    <button
                                        onClick={() =>
                                            setConfirmCancel(
                                                true
                                            )
                                        }
                                        disabled={
                                            cancellingId ===
                                            booking.id
                                        }
                                        className="flex items-center gap-1.5 rounded-xl border border-red-500/10 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {cancellingId ===
                                        booking.id ? (
                                            <>
                                                <Loader2
                                                    size={
                                                        13
                                                    }
                                                    className="animate-spin"
                                                />

                                                Cancelling...
                                            </>
                                        ) : (
                                            "Cancel"
                                        )}

                                    </button>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </motion.article>

            {/* ==========================================
                CUSTOM CANCEL CONFIRMATION MODAL
            ========================================== */}

            <AnimatePresence>

                {confirmCancel && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        onClick={() =>
                            setConfirmCancel(false)
                        }
                    >

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.95,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.95,
                                y: 20,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                            className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
                        >

                            {/* ICON + TEXT */}

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">

                                    <AlertTriangle
                                        size={24}
                                    />

                                </div>

                                <div>

                                    <h3 className="text-lg font-black text-white">
                                        Cancel booking?
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        Are you sure you
                                        want to cancel
                                        booking #
                                        {booking.id}? This
                                        action cannot be
                                        undone.
                                    </p>

                                </div>

                            </div>

                            {/* BUTTONS */}

                            <div className="mt-6 flex justify-end gap-3">

                                <button
                                    onClick={() =>
                                        setConfirmCancel(
                                            false
                                        )
                                    }
                                    disabled={
                                        cancellingId ===
                                        booking.id
                                    }
                                    className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                                >
                                    Keep booking
                                </button>

                                <button
                                    onClick={() => {
                                        setConfirmCancel(
                                            false
                                        );

                                        onCancel(
                                            booking.id
                                        );
                                    }}
                                    disabled={
                                        cancellingId ===
                                        booking.id
                                    }
                                    className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {cancellingId ===
                                    booking.id ? (
                                        <>
                                            <Loader2
                                                size={15}
                                                className="animate-spin"
                                            />

                                            Cancelling...
                                        </>
                                    ) : (
                                        <>
                                            <XCircle
                                                size={15}
                                            />

                                            Yes, cancel
                                        </>
                                    )}

                                </button>

                            </div>

                        </motion.div>

                    </motion.div>
                )}

            </AnimatePresence>
        </>
    );
};

// ======================================================
// STATUS BADGE
// ======================================================

const StatusBadge = ({ status }) => {

    const normalizedStatus =
        String(status || "")
            .toUpperCase();

    if (normalizedStatus === "PENDING") {
        return (
            <div className="flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-yellow-400">

                <Clock3 size={13} />

                PENDING

            </div>
        );
    }

    if (normalizedStatus === "CONFIRMED") {
        return (
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">

                <CheckCircle2 size={13} />

                CONFIRMED

            </div>
        );
    }

    if (normalizedStatus === "CANCELLED") {
        return (
            <div className="flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-400">

                <XCircle size={13} />

                CANCELLED

            </div>
        );
    }

    if (normalizedStatus === "REJECTED") {
        return (
            <div className="flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-400">

                <XCircle size={13} />

                REJECTED

            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {normalizedStatus || "UNKNOWN"}
        </div>
    );
};

// ======================================================
// SMALL INFO
// ======================================================

const SmallInfo = ({
    icon: Icon,
    text,
}) => {
    return (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">

            <Icon size={13} />

            {text}

        </div>
    );
};

// ======================================================
// EMPTY STATE
// ======================================================

const EmptyState = ({
    onExplore,
}) => {
    return (
        <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 px-6 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-slate-600">
                <Ticket size={28} />
            </div>

            <h3 className="mt-5 text-xl font-black">
                No bookings yet
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Find a ride and book your first
                journey with RideFlow.
            </p>

            <button
                onClick={onExplore}
                className="mt-6 flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
                Explore rides

                <ArrowRight size={16} />

            </button>

        </div>
    );
};

export default MyBookings;