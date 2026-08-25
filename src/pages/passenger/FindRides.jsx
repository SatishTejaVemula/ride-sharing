import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    Search,
    MapPin,
    CalendarDays,
    Clock3,
    Users,
    IndianRupee,
    ArrowRight,
    CarFront,
    X,
} from "lucide-react";

import toast from "react-hot-toast";

import PassengerSidebar from "../../components/passenger/PassengerSidebar";
import PassengerTopbar from "../../components/passenger/PassengerTopbar";


const API_URL = "http://localhost:8080";


const FindRides = () => {

    const navigate = useNavigate();


    // =========================
    // STATE
    // =========================

    const [rides, setRides] = useState([]);

    const [loading, setLoading] = useState(true);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [pickup, setPickup] = useState("");

    const [drop, setDrop] = useState("");

    const [date, setDate] = useState("");


    // =========================
    // LOAD RIDES
    // =========================

    useEffect(() => {

        const fetchRides = async () => {

            try {

                setLoading(true);

                const token =
                    localStorage.getItem("token");


                if (!token) {

                    navigate("/login");

                    return;

                }


                const response = await axios.get(
                    `${API_URL}/api/rides`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


                setRides(
                    response.data || []
                );

            } catch (error) {

                console.error(
                    "Error loading rides:",
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
                    "Failed to load rides."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchRides();

    }, [navigate]);


    // =========================
    // FILTER RIDES
    // =========================

    const filteredRides = useMemo(() => {

        return rides.filter((ride) => {

            const status =
                String(
                    ride.status || ""
                ).toUpperCase();


            const availableSeats =
                Number(
                    ride.availableSeats || 0
                );


            // Only available rides

            if (
                status &&
                status !== "AVAILABLE"
            ) {
                return false;
            }


            if (availableSeats <= 0) {

                return false;

            }


            // Pickup filter

            if (pickup.trim()) {

                const ridePickup =
                    String(
                        ride.pickupLocation || ""
                    ).toLowerCase();


                if (
                    !ridePickup.includes(
                        pickup
                            .trim()
                            .toLowerCase()
                    )
                ) {

                    return false;

                }

            }


            // Drop filter

            if (drop.trim()) {

                const rideDrop =
                    String(
                        ride.dropLocation || ""
                    ).toLowerCase();


                if (
                    !rideDrop.includes(
                        drop
                            .trim()
                            .toLowerCase()
                    )
                ) {

                    return false;

                }

            }


            // Date filter

            if (date) {

                if (
                    ride.rideDate !== date
                ) {

                    return false;

                }

            }


            return true;

        });

    }, [
        rides,
        pickup,
        drop,
        date,
    ]);


    // =========================
    // CLEAR FILTERS
    // =========================

    const clearFilters = () => {

        setPickup("");

        setDrop("");

        setDate("");

    };


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );


        navigate("/login", {
            replace: true,
        });

    };


    // =========================
    // VIEW RIDE
    // =========================

    const viewRide = (rideId) => {

        navigate(
            `/passenger/rides/${rideId}`
        );

    };


    // =========================
    // PAGE
    // =========================

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
                    PASSENGER TOPBAR
                ================================= */}

                <PassengerTopbar
                    onMenuClick={() =>
                        setSidebarOpen(true)
                    }
                    onLogout={handleLogout}
                />


                {/* =================================
                    MAIN CONTENT
                ================================= */}

                <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">


                    {/* =================================
                        HEADER
                    ================================= */}

                    <div className="mb-8">

                        <p className="text-sm font-semibold text-blue-400">
                            Passenger workspace
                        </p>


                        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                            Find Rides
                        </h1>


                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                            Search available rides and
                            choose the journey that works
                            best for you.
                        </p>

                    </div>


                    {/* =================================
                        SEARCH PANEL
                    ================================= */}

                    <section className="mb-8 rounded-3xl border border-slate-800/80 bg-slate-900/50 p-5 sm:p-6">


                        {/* Search heading */}

                        <div className="mb-5 flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">

                                <Search size={19} />

                            </div>


                            <div>

                                <h2 className="font-bold">
                                    Search rides
                                </h2>


                                <p className="text-xs text-slate-500">
                                    Find a ride for your journey
                                </p>

                            </div>

                        </div>


                        {/* Search inputs */}

                        <div className="grid gap-4 lg:grid-cols-3">


                            {/* Pickup */}

                            <div>

                                <label className="mb-2 block text-xs font-semibold text-slate-400">
                                    Pickup location
                                </label>


                                <div className="relative">

                                    <MapPin
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                                    />


                                    <input
                                        type="text"
                                        value={pickup}
                                        onChange={(e) =>
                                            setPickup(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Where are you starting?"
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-500"
                                    />

                                </div>

                            </div>


                            {/* Drop */}

                            <div>

                                <label className="mb-2 block text-xs font-semibold text-slate-400">
                                    Drop location
                                </label>


                                <div className="relative">

                                    <MapPin
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                                    />


                                    <input
                                        type="text"
                                        value={drop}
                                        onChange={(e) =>
                                            setDrop(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Where are you going?"
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-500"
                                    />

                                </div>

                            </div>


                            {/* Date */}

                            <div>

                                <label className="mb-2 block text-xs font-semibold text-slate-400">
                                    Travel date
                                </label>


                                <div className="relative">

                                    <CalendarDays
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                                    />


                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) =>
                                            setDate(
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-blue-500"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Clear filters */}

                        {(pickup ||
                            drop ||
                            date) && (

                            <div className="mt-4 flex justify-end">

                                <button
                                    type="button"
                                    onClick={
                                        clearFilters
                                    }
                                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                >

                                    <X size={14} />

                                    Clear filters

                                </button>

                            </div>

                        )}

                    </section>


                    {/* =================================
                        RESULTS HEADER
                    ================================= */}

                    <div className="mb-5">

                        <h2 className="text-lg font-bold">
                            Available rides
                        </h2>


                        <p className="mt-1 text-xs text-slate-500">

                            {loading
                                ? "Loading rides..."
                                : `${filteredRides.length} ride${
                                      filteredRides.length !== 1
                                          ? "s"
                                          : ""
                                  } available`}

                        </p>

                    </div>


                    {/* =================================
                        LOADING
                    ================================= */}

                    {loading ? (

                        <div className="grid gap-5 xl:grid-cols-2">

                            {[1, 2, 3, 4].map(
                                (item) => (

                                    <div
                                        key={item}
                                        className="h-64 animate-pulse rounded-3xl border border-slate-800 bg-slate-900/50"
                                    />

                                )
                            )}

                        </div>

                    ) : filteredRides.length === 0 ? (

                        /* =================================
                           EMPTY STATE
                        ================================= */

                        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/20 px-6 text-center">


                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900">

                                <CarFront
                                    size={28}
                                    className="text-slate-600"
                                />

                            </div>


                            <h3 className="mt-5 text-lg font-bold">
                                No rides found
                            </h3>


                            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                                We couldn't find any
                                available rides matching
                                your search.
                            </p>


                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500"
                            >
                                Show all rides
                            </button>

                        </div>

                    ) : (

                        /* =================================
                           RIDE CARDS
                        ================================= */

                        <div className="grid gap-5 xl:grid-cols-2">

                            {filteredRides.map(
                                (ride) => {

                                    const seats =
                                        Number(
                                            ride.availableSeats ||
                                            0
                                        );


                                    const price =
                                        Number(
                                            ride.price ||
                                            0
                                        );


                                    return (

                                        <article
                                            key={ride.id}
                                            className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-5 transition hover:border-blue-500/30 hover:bg-slate-900/80 sm:p-6"
                                        >


                                            {/* Card header */}

                                            <div className="flex items-center justify-between">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">

                                                        <CarFront
                                                            size={21}
                                                        />

                                                    </div>


                                                    <div>

                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                            Ride
                                                        </p>


                                                        <p className="font-bold">
                                                            Ride #{ride.id}
                                                        </p>

                                                    </div>

                                                </div>


                                                <span className="rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
                                                    Available
                                                </span>

                                            </div>


                                            {/* Route */}

                                            <div className="mt-6 flex gap-4">

                                                <div className="flex flex-col items-center">

                                                    <div className="h-3 w-3 rounded-full border-2 border-blue-400" />

                                                    <div className="my-1 h-12 border-l border-dashed border-slate-700" />

                                                    <div className="h-3 w-3 rounded-full bg-blue-500" />

                                                </div>


                                                <div className="space-y-5">

                                                    <div>

                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                            Pickup
                                                        </p>


                                                        <p className="mt-1 font-semibold">
                                                            {ride.pickupLocation ||
                                                                "Pickup location"}
                                                        </p>

                                                    </div>


                                                    <div>

                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                            Destination
                                                        </p>


                                                        <p className="mt-1 font-semibold">
                                                            {ride.dropLocation ||
                                                                "Drop location"}
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* Ride details */}

                                            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">


                                                {/* Date */}

                                                <div className="rounded-2xl bg-slate-950/70 p-3">

                                                    <CalendarDays
                                                        size={16}
                                                        className="text-blue-400"
                                                    />

                                                    <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-600">
                                                        Date
                                                    </p>


                                                    <p className="mt-1 text-xs font-bold text-slate-300">
                                                        {ride.rideDate ||
                                                            "—"}
                                                    </p>

                                                </div>


                                                {/* Time */}

                                                <div className="rounded-2xl bg-slate-950/70 p-3">

                                                    <Clock3
                                                        size={16}
                                                        className="text-blue-400"
                                                    />

                                                    <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-600">
                                                        Time
                                                    </p>


                                                    <p className="mt-1 text-xs font-bold text-slate-300">
                                                        {ride.rideTime ||
                                                            "—"}
                                                    </p>

                                                </div>


                                                {/* Seats */}

                                                <div className="rounded-2xl bg-slate-950/70 p-3">

                                                    <Users
                                                        size={16}
                                                        className="text-blue-400"
                                                    />

                                                    <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-600">
                                                        Seats
                                                    </p>


                                                    <p className="mt-1 text-xs font-bold text-slate-300">
                                                        {seats}
                                                    </p>

                                                </div>


                                                {/* Price */}

                                                <div className="rounded-2xl bg-slate-950/70 p-3">

                                                    <IndianRupee
                                                        size={16}
                                                        className="text-emerald-400"
                                                    />

                                                    <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-600">
                                                        Price
                                                    </p>


                                                    <p className="mt-1 text-xs font-bold text-slate-300">
                                                        ₹{price}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* Card footer */}

                                            <div className="mt-5 flex items-center justify-between border-t border-slate-800/70 pt-5">


                                                <p className="text-xs text-slate-500">

                                                    Seats available:{" "}

                                                    <span className="font-bold text-slate-300">
                                                        {seats}
                                                    </span>

                                                </p>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        viewRide(
                                                            ride.id
                                                        )
                                                    }
                                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500"
                                                >

                                                    View ride

                                                    <ArrowRight
                                                        size={15}
                                                    />

                                                </button>

                                            </div>

                                        </article>

                                    );

                                }
                            )}

                        </div>

                    )}

                </main>

            </div>

        </div>
    );
};


export default FindRides;