import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    CarFront,
    CalendarCheck,
    MapPin,
    Search,
    Star,
    Users,
} from "lucide-react";
import toast from "react-hot-toast";

import PassengerSidebar from "../../components/passenger/PassengerSidebar";
import PassengerTopbar from "../../components/passenger/PassengerTopbar";
import StatCard from "../../components/driver/StatCard";
import RideCard from "../../components/driver/RideCard";

const API_URL = "http://localhost:8080";

const PassengerDashboard = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [rides, setRides] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);


    // =========================
    // LOAD USER
    // =========================

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
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
            navigate("/login");
        }

    }, [navigate]);


    // =========================
    // LOAD RIDES + BOOKINGS
    // =========================

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);

                const token =
                    localStorage.getItem("token");

                const storedUser =
                    localStorage.getItem("user");

                if (!token || !storedUser) {
                    navigate("/login");
                    return;
                }

                const currentUser =
                    JSON.parse(storedUser);

                const passengerId =
                    currentUser.authUserId ||
                    currentUser.id ||
                    currentUser.userId;


                // Load all rides

                const ridesResponse =
                    await axios.get(
                        `${API_URL}/api/rides`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );


                setRides(
                    ridesResponse.data || []
                );


                // Load passenger bookings

                if (passengerId) {

                    // Load passenger bookings

                    const bookingsResponse =
                        await axios.get(
                            `${API_URL}/api/bookings/passenger`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );

                    setBookings(
                        bookingsResponse.data || []
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to load passenger dashboard:",
                    error
                );

                if (
                    error.response?.status === 401
                ) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    toast.error(
                        "Session expired. Please login again."
                    );

                    navigate("/login");

                    return;
                }

                toast.error(
                    "Unable to load dashboard data."
                );

            } finally {

                setLoading(false);

            }

        };


        loadDashboard();

    }, [navigate]);


    // =========================
    // AVAILABLE RIDES
    // =========================

    const availableRides = useMemo(() => {

        return rides.filter(
            (ride) =>
                ride.status === "AVAILABLE" &&
                Number(ride.availableSeats || 0) > 0
        );

    }, [rides]);


    // =========================
    // UPCOMING RIDES
    // =========================

    const upcomingRides = useMemo(() => {

        return [...availableRides]
            .sort((a, b) => {

                const dateA = new Date(
                    `${a.rideDate}T${a.rideTime || "00:00"}`
                );

                const dateB = new Date(
                    `${b.rideDate}T${b.rideTime || "00:00"}`
                );

                return dateA - dateB;

            })
            .slice(0, 4);

    }, [availableRides]);


    // =========================
    // ACTIVE BOOKINGS
    // =========================

    const activeBookings = useMemo(() => {

        return bookings.filter(
            (booking) =>
                booking.status === "PENDING" ||
                booking.status === "CONFIRMED"
        );

    }, [bookings]);


    // =========================
    // COMPLETED BOOKINGS
    // =========================

    const completedBookings = useMemo(() => {

        return bookings.filter(
            (booking) =>
                booking.status === "COMPLETED"
        );

    }, [bookings]);


    // =========================
    // TOTAL SEATS
    // =========================

    const availableSeats = useMemo(() => {

        return availableRides.reduce(
            (total, ride) =>
                total +
                Number(
                    ride.availableSeats || 0
                ),
            0
        );

    }, [availableRides]);


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

    };


    // =========================
    // FIND RIDES
    // =========================

    const handleFindRides = () => {

        navigate("/passenger/rides");

    };


    // =========================
    // MY BOOKINGS
    // =========================

    const handleBookings = () => {

        navigate("/passenger/bookings");

    };


    return (
        <div className="min-h-screen bg-slate-950 text-white">


            {/* =========================
                SIDEBAR
            ========================= */}

            <PassengerSidebar
                open={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
                onLogout={handleLogout}
            />


            {/* =========================
                CONTENT
            ========================= */}

            <div className="lg:pl-72">


                {/* =========================
                    TOPBAR
                ========================= */}

                <PassengerTopbar
                    user={user}
                    onMenuClick={() =>
                        setSidebarOpen(true)
                    }
                    onLogout={handleLogout}
                />


                {/* =========================
                    MAIN
                ========================= */}

                <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">


                    {/* =========================
                        HEADER
                    ========================= */}

                    <section className="mb-8">

                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">


                            <div>

                                <p className="text-sm font-semibold text-blue-400">

                                    Passenger overview

                                </p>


                                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">

                                    Good morning,{" "}

                                    {user?.name?.split(" ")[0] ||
                                        "Passenger"}

                                    👋

                                </h1>


                                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">

                                    Find rides, manage your bookings,
                                    and enjoy a smooth journey.

                                </p>

                            </div>


                            {/* Account Status */}

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">

                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">

                                    Account status

                                </p>


                                <div className="mt-1 flex items-center gap-2">

                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                                    <span className="text-sm font-semibold text-emerald-400">

                                        Active passenger

                                    </span>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =========================
                        STATS
                    ========================= */}

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


                        <StatCard
                            title="Available rides"
                            value={availableRides.length}
                            subtitle="Currently accepting"
                            icon={CarFront}
                            trend="Live"
                            trendUp
                        />


                        <StatCard
                            title="My bookings"
                            value={bookings.length}
                            subtitle="Total bookings"
                            icon={CalendarCheck}
                            trend="Bookings"
                            trendUp
                        />


                        <StatCard
                            title="Active bookings"
                            value={activeBookings.length}
                            subtitle="Pending or confirmed"
                            icon={Users}
                            trend="Active"
                            trendUp
                        />


                        <StatCard
                            title="Available seats"
                            value={availableSeats}
                            subtitle="Across available rides"
                            icon={MapPin}
                            trend="Open"
                            trendUp
                        />

                    </section>


                    {/* =========================
                        MAIN CONTENT
                    ========================= */}

                    <section className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">


                        {/* =========================
                            AVAILABLE RIDES
                        ========================= */}

                        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-5 sm:p-6">


                            <div className="mb-6 flex items-center justify-between">

                                <div>

                                    <h2 className="text-lg font-bold">

                                        Available rides

                                    </h2>


                                    <p className="mt-1 text-xs text-slate-500">

                                        Find your next journey

                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={handleFindRides}
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-500"
                                >

                                    <Search size={15} />

                                    Find rides

                                </button>

                            </div>


                            {loading ? (

                                <div className="space-y-4">

                                    {[1, 2, 3].map(
                                        (item) => (

                                            <div
                                                key={item}
                                                className="h-44 animate-pulse rounded-3xl bg-slate-900"
                                            />

                                        )
                                    )}

                                </div>

                            ) : upcomingRides.length > 0 ? (

                                <div className="space-y-4">

                                    {upcomingRides.map(
                                        (ride) => (

                                            <RideCard
                                                key={ride.id}
                                                ride={ride}
                                            />

                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900">

                                        <CarFront
                                            size={24}
                                            className="text-slate-600"
                                        />

                                    </div>


                                    <h3 className="mt-4 font-semibold">

                                        No rides available

                                    </h3>


                                    <p className="mt-1 text-center text-sm text-slate-500">

                                        There are no available rides
                                        right now.

                                    </p>


                                    <button
                                        type="button"
                                        onClick={handleFindRides}
                                        className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500"
                                    >

                                        <Search size={15} />

                                        Search rides

                                    </button>

                                </div>

                            )}

                        </div>


                        {/* =========================
                            PASSENGER ACTIVITY
                        ========================= */}

                        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-5 sm:p-6">


                            <div>

                                <h2 className="text-lg font-bold">

                                    Your activity

                                </h2>


                                <p className="mt-1 text-xs text-slate-500">

                                    A quick look at your bookings

                                </p>

                            </div>


                            <div className="mt-6 space-y-5">


                                {/* Active Booking */}

                                <div>

                                    <div className="mb-2 flex justify-between">

                                        <span className="text-sm text-slate-400">

                                            Active bookings

                                        </span>


                                        <span className="text-sm font-semibold">

                                            {activeBookings.length}

                                        </span>

                                    </div>


                                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                                        <div
                                            className="h-full rounded-full bg-blue-500 transition-all"
                                            style={{
                                                width: `${Math.min(
                                                    activeBookings.length *
                                                    20,
                                                    100
                                                )}%`,
                                            }}
                                        />

                                    </div>

                                </div>


                                {/* Available Rides */}

                                <div>

                                    <div className="mb-2 flex justify-between">

                                        <span className="text-sm text-slate-400">

                                            Available rides

                                        </span>


                                        <span className="text-sm font-semibold">

                                            {availableRides.length}

                                        </span>

                                    </div>


                                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                                        <div
                                            className="h-full rounded-full bg-emerald-500"
                                            style={{
                                                width: `${Math.min(
                                                    availableRides.length *
                                                    10,
                                                    100
                                                )}%`,
                                            }}
                                        />

                                    </div>

                                </div>


                                {/* Booking Summary */}

                                <div className="rounded-3xl border border-blue-500/10 bg-blue-500/5 p-5">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">

                                            <CalendarCheck
                                                size={20}
                                            />

                                        </div>


                                        <div>

                                            <p className="text-xs text-slate-500">

                                                Total bookings

                                            </p>


                                            <p className="mt-1 text-xl font-bold">

                                                {bookings.length}

                                            </p>

                                        </div>

                                    </div>


                                    <p className="mt-4 text-sm leading-6 text-slate-400">

                                        Keep track of your upcoming
                                        journeys and booking status
                                        from My Bookings.

                                    </p>

                                </div>


                                {/* Quick Actions */}

                                <div className="grid grid-cols-2 gap-3">


                                    <button
                                        type="button"
                                        onClick={handleFindRides}
                                        className="rounded-2xl bg-slate-950/70 p-4 text-left transition hover:bg-slate-950"
                                    >

                                        <Search
                                            size={18}
                                            className="text-blue-400"
                                        />


                                        <p className="mt-3 text-xs text-slate-500">

                                            Find rides

                                        </p>


                                        <p className="mt-1 text-sm font-bold">

                                            Search

                                        </p>

                                    </button>


                                    <button
                                        type="button"
                                        onClick={handleBookings}
                                        className="rounded-2xl bg-slate-950/70 p-4 text-left transition hover:bg-slate-950"
                                    >

                                        <CalendarCheck
                                            size={18}
                                            className="text-emerald-400"
                                        />


                                        <p className="mt-3 text-xs text-slate-500">

                                            My bookings

                                        </p>


                                        <p className="mt-1 text-sm font-bold">

                                            View all

                                        </p>

                                    </button>

                                </div>


                                {/* Rating */}

                                <div className="rounded-3xl border border-amber-500/10 bg-amber-500/5 p-5">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">

                                            <Star size={20} />

                                        </div>


                                        <div>

                                            <p className="text-xs text-slate-500">

                                                Passenger experience

                                            </p>


                                            <p className="mt-1 text-xl font-bold">

                                                Great

                                            </p>

                                        </div>

                                    </div>


                                    <p className="mt-4 text-sm leading-6 text-slate-400">

                                        Book reliable rides and keep
                                        your journey history organized.

                                    </p>

                                </div>


                                {/* Completed */}

                                <div className="grid grid-cols-2 gap-3">

                                    <div className="rounded-2xl bg-slate-950/70 p-4">

                                        <p className="text-xs text-slate-500">

                                            Completed

                                        </p>


                                        <p className="mt-2 text-2xl font-bold">

                                            {completedBookings.length}

                                        </p>

                                    </div>


                                    <div className="rounded-2xl bg-slate-950/70 p-4">

                                        <p className="text-xs text-slate-500">

                                            Seats booked

                                        </p>


                                        <p className="mt-2 text-2xl font-bold">

                                            {bookings.reduce(
                                                (
                                                    total,
                                                    booking
                                                ) =>
                                                    total +
                                                    Number(
                                                        booking.seatsBooked ||
                                                        0
                                                    ),
                                                0
                                            )}

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>

                </main>

            </div>

        </div>
    );
};

export default PassengerDashboard;