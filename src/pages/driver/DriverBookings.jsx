import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

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
    UserRound,
} from "lucide-react";

const API_URL = "http://localhost:8080";

const DriverBookings = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [rides, setRides] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [processingBookingId, setProcessingBookingId] =
        useState(null);

    /*
     * =========================================================
     * LOAD USER
     * =========================================================
     */

    useEffect(() => {
        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            toast.error("Please login again.");
            navigate("/login");
            return;
        }

        try {
            setUser(JSON.parse(storedUser));
        } catch (error) {
            console.error(
                "Invalid stored user:",
                error
            );

            localStorage.removeItem("user");

            toast.error(
                "Invalid user session."
            );

            navigate("/login");
        }
    }, [navigate]);


    /*
     * =========================================================
     * DRIVER ID
     * =========================================================
     */

    const driverId =
        user?.authUserId ||
        user?.id;


    /*
     * =========================================================
     * LOAD BOOKINGS
     * =========================================================
     */

    const loadBookings = async (
        isRefresh = false
    ) => {
        const token =
            localStorage.getItem("token");

        if (!token || !driverId) {
            return;
        }

        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }


            /*
             * Driver bookings
             *
             * GET /api/bookings/driver
             */

            const bookingsResponse =
                await axios.get(
                    `${API_URL}/api/bookings/driver`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            const driverBookings =
                bookingsResponse.data || [];

            setBookings(
                driverBookings
            );


            /*
             * Booking contains rideId.
             *
             * Fetch ride information.
             */

            const uniqueRideIds = [
                ...new Set(
                    driverBookings
                        .map(
                            (booking) =>
                                booking.rideId
                        )
                        .filter(Boolean)
                ),
            ];


            if (
                uniqueRideIds.length === 0
            ) {
                setRides([]);
                return;
            }


            const rideResponses =
                await Promise.all(
                    uniqueRideIds.map(
                        (rideId) =>
                            axios.get(
                                `${API_URL}/api/rides/${rideId}`,
                                {
                                    headers: {
                                        Authorization:
                                            `Bearer ${token}`,
                                    },
                                }
                            )
                    )
                );


            const driverRides =
                rideResponses
                    .map(
                        (response) =>
                            response.data
                    )
                    .filter(Boolean);


            setRides(
                driverRides
            );

        } catch (error) {

            console.error(
                "Failed to load driver bookings:",
                error
            );


            if (
                error.response?.status === 401
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


            if (
                error.response?.status === 403
            ) {

                toast.error(
                    error.response?.data?.message ||
                        "You are not allowed to view these bookings."
                );

                return;
            }


            toast.error(
                error.response?.data?.message ||
                    "Unable to load driver bookings."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    /*
     * =========================================================
     * LOAD WHEN DRIVER ID EXISTS
     * =========================================================
     */

    useEffect(() => {

        if (!driverId) {
            return;
        }

        loadBookings();

    }, [driverId]);


    /*
     * =========================================================
     * RIDE MAP
     * =========================================================
     */

    const rideMap = useMemo(() => {

        return new Map(
            rides.map((ride) => [
                ride.id,
                ride,
            ])
        );

    }, [rides]);


    /*
     * =========================================================
     * BOOKING ROWS
     * =========================================================
     */

    const bookingRows = useMemo(() => {

        return bookings
            .map((booking) => ({
                booking,
                ride: rideMap.get(
                    booking.rideId
                ),
            }))
            .filter(
                (item) => item.ride
            );

    }, [bookings, rideMap]);


    /*
     * =========================================================
     * STATISTICS
     * =========================================================
     */

    const pendingBookings =
        bookings.filter(
            (booking) =>
                booking.status ===
                "PENDING"
        );

    const confirmedBookings =
        bookings.filter(
            (booking) =>
                booking.status ===
                "CONFIRMED"
        );

    const rejectedBookings =
        bookings.filter(
            (booking) =>
                booking.status ===
                "REJECTED"
        );

    const cancelledBookings =
        bookings.filter(
            (booking) =>
                booking.status ===
                "CANCELLED"
        );


    const totalRevenue =
        confirmedBookings.reduce(
            (sum, booking) =>
                sum +
                Number(
                    booking.totalPrice || 0
                ),
            0
        );


    const totalSeatsBooked =
        confirmedBookings.reduce(
            (sum, booking) =>
                sum +
                Number(
                    booking.seatsBooked || 0
                ),
            0
        );


    /*
     * =========================================================
     * DATE
     * =========================================================
     */

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    /*
     * =========================================================
     * STATUS COLORS
     * =========================================================
     */

    const getStatusClasses = (
        status
    ) => {

        switch (status) {

            case "PENDING":
                return "border-amber-500/20 bg-amber-500/10 text-amber-400";

            case "CONFIRMED":
                return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

            case "REJECTED":
                return "border-red-500/20 bg-red-500/10 text-red-400";

            case "CANCELLED":
                return "border-red-500/20 bg-red-500/10 text-red-400";

            default:
                return "border-slate-500/20 bg-slate-500/10 text-slate-400";
        }
    };


    /*
     * =========================================================
     * DRIVER -> PASSENGER PROFILE
     *
     * Opens common Profile.jsx
     * =========================================================
     */

    const openPassengerProfile = (
        passengerId
    ) => {

        if (!passengerId) {

            toast.error(
                "Passenger information unavailable."
            );

            return;
        }


        navigate(
            `/profile/${passengerId}`
        );
    };


    /*
     * =========================================================
     * ACCEPT BOOKING
     * =========================================================
     */

    const handleAccept = async (
        bookingId
    ) => {

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

            setProcessingBookingId(
                bookingId
            );


            await axios.put(
                `${API_URL}/api/bookings/${bookingId}/accept`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            toast.success(
                "Booking accepted successfully."
            );


            await loadBookings(true);

        } catch (error) {

            console.error(
                "Failed to accept booking:",
                error
            );


            if (
                error.response?.status === 401
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
                    "Unable to accept booking."
            );

        } finally {

            setProcessingBookingId(
                null
            );

        }
    };


    /*
     * =========================================================
     * REJECT BOOKING
     * =========================================================
     */

    const handleReject = async (
        bookingId
    ) => {

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

            setProcessingBookingId(
                bookingId
            );


            await axios.put(
                `${API_URL}/api/bookings/${bookingId}/reject`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            toast.success(
                "Booking rejected."
            );


            await loadBookings(true);

        } catch (error) {

            console.error(
                "Failed to reject booking:",
                error
            );


            if (
                error.response?.status === 401
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
                    "Unable to reject booking."
            );

        } finally {

            setProcessingBookingId(
                null
            );

        }
    };


    /*
     * =========================================================
     * UI
     * =========================================================
     */

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
                            navigate(
                                "/driver/dashboard"
                            )
                        }
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
                    >

                        <ArrowLeft
                            size={18}
                        />

                        <span className="hidden sm:inline">
                            Dashboard
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


                    <button
                        onClick={() =>
                            loadBookings(true)
                        }
                        disabled={refreshing}
                        className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
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


                    <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                Booking Requests
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                                Review passengers requesting
                                seats on your rides and manage
                                their booking requests.
                            </p>

                        </div>


                        {pendingBookings.length >
                            0 && (

                            <div className="flex w-fit items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">

                                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />

                                <span className="text-sm font-bold text-amber-400">

                                    {
                                        pendingBookings.length
                                    }

                                    {" pending "}

                                    {pendingBookings.length ===
                                    1
                                        ? "request"
                                        : "requests"}

                                </span>

                            </div>

                        )}

                    </div>

                </section>


                {/* Stats */}

                <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <SummaryCard
                        label="Total bookings"
                        value={
                            bookings.length
                        }
                        icon={Ticket}
                    />

                    <SummaryCard
                        label="Pending requests"
                        value={
                            pendingBookings.length
                        }
                        icon={Clock3}
                    />

                    <SummaryCard
                        label="Confirmed"
                        value={
                            confirmedBookings.length
                        }
                        icon={CheckCircle2}
                    />

                    <SummaryCard
                        label="Booking value"
                        value={`₹${totalRevenue.toLocaleString(
                            "en-IN"
                        )}`}
                        icon={
                            IndianRupee
                        }
                    />

                </section>


                {/* Content */}

                {loading ? (

                    <div className="space-y-5">

                        {[1, 2, 3].map(
                            (item) => (

                                <div
                                    key={item}
                                    className="h-80 animate-pulse rounded-3xl border border-slate-800 bg-slate-900/60"
                                />

                            )
                        )}

                    </div>

                ) : bookingRows.length ===
                  0 ? (

                    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 px-6 text-center">

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900">

                            <Ticket
                                size={28}
                                className="text-slate-600"
                            />

                        </div>


                        <h2 className="mt-5 text-xl font-bold">
                            No booking requests yet
                        </h2>


                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                            When passengers book one
                            of your rides, their booking
                            requests will appear here.
                        </p>


                        <button
                            onClick={() =>
                                navigate(
                                    "/driver/rides"
                                )
                            }
                            className="mt-6 flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                        >

                            <CarFront
                                size={17}
                            />

                            View my rides

                        </button>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {bookingRows.map(
                            ({
                                booking,
                                ride,
                            }) => {

                                const isProcessing =
                                    processingBookingId ===
                                    booking.id;

                                const isPending =
                                    booking.status ===
                                    "PENDING";


                                return (

                                    <article
                                        key={
                                            booking.id
                                        }
                                        className={`overflow-hidden rounded-3xl border bg-slate-900/50 shadow-xl shadow-black/5 backdrop-blur-xl transition ${
                                            isPending
                                                ? "border-amber-500/20 hover:border-amber-500/40"
                                                : "border-slate-800/80 hover:border-slate-700"
                                        }`}
                                    >

                                        <div className="p-5 sm:p-6">

                                            {/* Header */}

                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                                                <div className="flex items-center gap-4">

                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">

                                                        <Ticket
                                                            size={
                                                                21
                                                            }
                                                        />

                                                    </div>


                                                    <div>

                                                        <div className="flex flex-wrap items-center gap-2">

                                                            <h2 className="font-bold">

                                                                Booking #
                                                                {
                                                                    booking.id
                                                                }

                                                            </h2>


                                                            <span
                                                                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusClasses(
                                                                    booking.status
                                                                )}`}
                                                            >

                                                                {
                                                                    booking.status
                                                                }

                                                            </span>

                                                        </div>


                                                        <p className="mt-1 text-xs text-slate-500">

                                                            Passenger ID:{" "}

                                                            {
                                                                booking.passengerId
                                                            }

                                                        </p>

                                                    </div>

                                                </div>


                                                <div className="rounded-2xl bg-slate-950/70 px-5 py-3 lg:text-right">

                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                        Total
                                                    </p>

                                                    <p className="mt-1 text-xl font-black">

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


                                            {/* =================================================
                                                PASSENGER PROFILE
                                            ================================================= */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openPassengerProfile(
                                                        booking.passengerId
                                                    )
                                                }
                                                className="group mt-5 w-full rounded-2xl border border-slate-800/70 bg-slate-950/50 p-4 text-left transition hover:border-blue-500/30 hover:bg-slate-900"
                                            >

                                                <div className="flex items-center justify-between">

                                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                                                        Passenger
                                                    </p>


                                                    <div className="flex items-center gap-1 text-xs font-semibold text-blue-400">

                                                        <span>
                                                            View profile
                                                        </span>

                                                        <ArrowRight
                                                            size={
                                                                15
                                                            }
                                                            className="transition-transform group-hover:translate-x-1"
                                                        />

                                                    </div>

                                                </div>


                                                <div className="mt-4 flex items-center gap-4">

                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">

                                                        <UserRound
                                                            size={
                                                                20
                                                            }
                                                        />

                                                    </div>


                                                    <div className="min-w-0">

                                                        <h3 className="truncate text-base font-black">

                                                            Passenger #
                                                            {
                                                                booking.passengerId
                                                            }

                                                        </h3>


                                                        <p className="mt-1 text-xs text-slate-500">

                                                            Click to view
                                                            passenger
                                                            profile

                                                        </p>

                                                    </div>

                                                </div>

                                            </button>


                                            {/* Route */}

                                            <div className="mt-5 rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4">

                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                                                    <div className="flex min-w-0 flex-1 items-center gap-3">

                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">

                                                            <MapPin
                                                                size={
                                                                    18
                                                                }
                                                            />

                                                        </div>


                                                        <div className="min-w-0">

                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                                Pickup
                                                            </p>

                                                            <p className="truncate text-sm font-bold">

                                                                {
                                                                    ride.pickupLocation
                                                                }

                                                            </p>

                                                        </div>

                                                    </div>


                                                    <ArrowRight
                                                        size={
                                                            18
                                                        }
                                                        className="hidden text-slate-700 sm:block"
                                                    />


                                                    <div className="flex min-w-0 flex-1 items-center gap-3">

                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">

                                                            <MapPin
                                                                size={
                                                                    18
                                                                }
                                                            />

                                                        </div>


                                                        <div className="min-w-0">

                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                                Destination
                                                            </p>

                                                            <p className="truncate text-sm font-bold">

                                                                {
                                                                    ride.dropLocation
                                                                }

                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* Details */}

                                            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                                                <Detail
                                                    icon={
                                                        CalendarDays
                                                    }
                                                    label="Ride date"
                                                    value={formatDate(
                                                        ride.rideDate
                                                    )}
                                                />

                                                <Detail
                                                    icon={
                                                        Clock3
                                                    }
                                                    label="Departure"
                                                    value={
                                                        ride.rideTime ||
                                                        "—"
                                                    }
                                                />

                                                <Detail
                                                    icon={
                                                        Users
                                                    }
                                                    label="Seats requested"
                                                    value={
                                                        booking.seatsBooked
                                                    }
                                                />

                                                <Detail
                                                    icon={
                                                        IndianRupee
                                                    }
                                                    label="Price / seat"
                                                    value={`₹${Number(
                                                        ride.price ||
                                                            0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}`}
                                                />

                                            </div>


                                            {/* Actions */}

                                            {isPending && (

                                                <div className="mt-6 flex flex-col gap-3 border-t border-slate-800/70 pt-5 sm:flex-row sm:justify-end">

                                                    <button
                                                        onClick={() =>
                                                            handleReject(
                                                                booking.id
                                                            )
                                                        }
                                                        disabled={
                                                            isProcessing
                                                        }
                                                        className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >

                                                        {isProcessing ? (

                                                            <Loader2
                                                                size={
                                                                    17
                                                                }
                                                                className="animate-spin"
                                                            />

                                                        ) : (

                                                            <XCircle
                                                                size={
                                                                    17
                                                                }
                                                            />

                                                        )}

                                                        Reject

                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            handleAccept(
                                                                booking.id
                                                            )
                                                        }
                                                        disabled={
                                                            isProcessing
                                                        }
                                                        className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >

                                                        {isProcessing ? (

                                                            <Loader2
                                                                size={
                                                                    17
                                                                }
                                                                className="animate-spin"
                                                            />

                                                        ) : (

                                                            <CheckCircle2
                                                                size={
                                                                    17
                                                                }
                                                            />

                                                        )}

                                                        Accept booking

                                                    </button>

                                                </div>

                                            )}


                                            {/* Confirmed */}

                                            {booking.status ===
                                                "CONFIRMED" && (

                                                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-3">

                                                    <CheckCircle2
                                                        size={
                                                            18
                                                        }
                                                        className="shrink-0 text-emerald-400"
                                                    />

                                                    <p className="text-sm font-medium text-emerald-300">

                                                        This booking has
                                                        been confirmed.

                                                    </p>

                                                </div>

                                            )}


                                            {/* Rejected */}

                                            {booking.status ===
                                                "REJECTED" && (

                                                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-red-500/10 bg-red-500/5 px-4 py-3">

                                                    <XCircle
                                                        size={
                                                            18
                                                        }
                                                        className="shrink-0 text-red-400"
                                                    />

                                                    <p className="text-sm font-medium text-red-300">

                                                        This booking request
                                                        was rejected.

                                                    </p>

                                                </div>

                                            )}


                                            {/* Cancelled */}

                                            {booking.status ===
                                                "CANCELLED" && (

                                                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-700/50 bg-slate-800/20 px-4 py-3">

                                                    <XCircle
                                                        size={
                                                            18
                                                        }
                                                        className="shrink-0 text-slate-500"
                                                    />

                                                    <p className="text-sm font-medium text-slate-400">

                                                        This booking has
                                                        been cancelled.

                                                    </p>

                                                </div>

                                            )}

                                        </div>

                                    </article>
                                );
                            }
                        )}

                    </div>

                )}

            </main>

        </div>
    );
};


/*
 * =========================================================
 * SUMMARY CARD
 * =========================================================
 */

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


/*
 * =========================================================
 * DETAIL
 * =========================================================
 */

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


export default DriverBookings;