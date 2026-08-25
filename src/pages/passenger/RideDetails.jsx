import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CarFront,
    CheckCircle2,
    Clock3,
    IndianRupee,
    Loader2,
    ShieldCheck,
    Star,
    Users,
    Phone,
    UserRound,
    ChevronRight,
} from "lucide-react";

const API_URL = "http://localhost:8080";

const RideDetails = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [ride, setRide] = useState(null);
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        loadRide();
    }, [id]);


    const loadRide = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login again.");
            navigate("/login");
            return;
        }

        try {

            setLoading(true);

            const rideResponse = await axios.get(
                `${API_URL}/api/rides/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const rideData = rideResponse.data;

            setRide(rideData);


            /*
             * Passenger -> Driver
             *
             * Get driver information.
             */

            if (rideData.driverId) {

                try {

                    const driverResponse =
                        await axios.get(
                            `${API_URL}/api/rides/driver-profile/${rideData.driverId}`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );

                    setDriver(
                        driverResponse.data
                    );

                } catch (driverError) {

                    console.error(
                        "Failed to load driver profile:",
                        driverError
                    );

                }

            }

        } catch (error) {

            console.error(
                "Failed to load ride:",
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

                toast.error("Ride not found.");

                navigate(
                    "/passenger/dashboard"
                );

                return;
            }

            toast.error(
                "Unable to load ride."
            );

        } finally {

            setLoading(false);

        }
    };


    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );
    };


    /*
     * =========================================================
     * PASSENGER -> DRIVER PROFILE
     *
     * Opens common Profile.jsx
     * =========================================================
     */

    const openDriverProfile = () => {

        if (!ride?.driverId) {

            toast.error(
                "Driver information unavailable."
            );

            return;
        }

        navigate(
            `/profile/${ride.driverId}`
        );
    };


    if (loading) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">

                <div className="flex items-center gap-3 text-sm text-slate-400">

                    <Loader2
                        size={20}
                        className="animate-spin text-blue-500"
                    />

                    Loading ride...

                </div>

            </div>
        );
    }


    if (!ride) {
        return null;
    }


    return (

        <div className="min-h-screen bg-slate-950 text-white">

            {/* Ambient background */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />

                <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-600/10 blur-[130px]" />

            </div>


            {/* Header */}

            <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-2xl">

                <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

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
                            Back to rides
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
                            navigate(
                                "/passenger/bookings"
                            )
                        }
                        className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white"
                    >

                        <span className="hidden sm:inline">
                            My Bookings
                        </span>

                        <span className="sm:hidden">
                            Bookings
                        </span>

                    </button>

                </div>

            </header>


            <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

                {/* Heading */}

                <motion.div
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

                        <CarFront size={14} />

                        Ride details

                    </div>

                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                        Your journey
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Everything you need to know before
                        booking this ride.
                    </p>

                </motion.div>


                {/* Main grid */}

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">


                    {/* LEFT */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -15,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        className="space-y-6"
                    >

                        {/* Route */}

                        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

                            <div className="flex items-center justify-between">

                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
                                    Route
                                </p>

                                <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">

                                    <CheckCircle2 size={13} />

                                    {ride.status}

                                </span>

                            </div>


                            <div className="relative mt-8 space-y-8">

                                <div className="absolute left-[11px] top-8 h-16 border-l border-dashed border-slate-700" />

                                <Location
                                    color="bg-blue-500"
                                    label="Pickup"
                                    value={
                                        ride.pickupLocation
                                    }
                                />

                                <Location
                                    color="bg-indigo-500"
                                    label="Destination"
                                    value={
                                        ride.dropLocation
                                    }
                                />

                            </div>

                        </div>


                        {/* Journey information */}

                        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

                            <h2 className="text-lg font-black">
                                Journey information
                            </h2>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">

                                <InfoCard
                                    icon={CalendarDays}
                                    label="Date"
                                    value={formatDate(
                                        ride.rideDate
                                    )}
                                />

                                <InfoCard
                                    icon={Clock3}
                                    label="Departure"
                                    value={
                                        ride.rideTime
                                    }
                                />

                                <InfoCard
                                    icon={Users}
                                    label="Available seats"
                                    value={`${ride.availableSeats} seats`}
                                />

                                <InfoCard
                                    icon={IndianRupee}
                                    label="Price per seat"
                                    value={`₹${Number(
                                        ride.price || 0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}`}
                                />

                            </div>

                        </div>


                        {/* Trust */}

                        <div className="rounded-3xl border border-blue-500/10 bg-blue-500/5 p-6">

                            <div className="flex gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">

                                    <ShieldCheck
                                        size={22}
                                    />

                                </div>

                                <div>

                                    <h3 className="font-bold">
                                        Travel with confidence
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        RideFlow connects you
                                        with registered users.
                                        Always verify the ride
                                        and driver details before
                                        departure.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </motion.div>


                    {/* RIGHT */}

                    <motion.aside
                        initial={{
                            opacity: 0,
                            x: 15,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        className="lg:sticky lg:top-28 lg:self-start"
                    >

                        <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/70 shadow-2xl backdrop-blur-xl">


                            {/* DRIVER PROFILE */}

                            <button
                                type="button"
                                onClick={
                                    openDriverProfile
                                }
                                className="group w-full border-b border-slate-800 p-6 text-left transition duration-200 hover:bg-slate-800/40"
                            >

                                <div className="flex items-center justify-between">

                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                                        Your driver
                                    </p>

                                    <div className="flex items-center gap-1 text-xs font-semibold text-blue-400 opacity-70 transition group-hover:opacity-100">

                                        <span>
                                            View profile
                                        </span>

                                        <ChevronRight
                                            size={16}
                                            className="transition-transform group-hover:translate-x-1"
                                        />

                                    </div>

                                </div>


                                <div className="mt-5 flex items-center gap-4">

                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-lg font-black text-blue-400 ring-1 ring-blue-500/20">

                                        {driver?.name
                                            ?.charAt(0)
                                            ?.toUpperCase() ||
                                            "D"}

                                    </div>


                                    <div className="min-w-0">

                                        <h2 className="truncate text-lg font-black">

                                            {driver?.name ||
                                                `Driver ${ride.driverId}`}

                                        </h2>


                                        <div className="mt-1 flex items-center gap-2">

                                            <div className="flex items-center gap-1 text-yellow-400">

                                                <Star
                                                    size={13}
                                                    fill="currentColor"
                                                />

                                                <span className="text-xs font-bold">

                                                    {driver?.rating ??
                                                        "New"}

                                                </span>

                                            </div>

                                            <span className="text-slate-700">
                                                •
                                            </span>

                                            <span className="text-xs text-emerald-400">
                                                Verified
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {driver?.phone && (

                                    <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-950/60 p-3">

                                        <Phone
                                            size={15}
                                            className="text-blue-400"
                                        />

                                        <div>

                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                Contact
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-300">
                                                {driver.phone}
                                            </p>

                                        </div>

                                    </div>

                                )}


                                <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-600">

                                    <UserRound size={13} />

                                    <span>
                                        Click to view complete driver profile
                                    </span>

                                </div>

                            </button>


                            {/* PRICE */}

                            <div className="p-6">

                                <div className="flex items-end justify-between">

                                    <div>

                                        <p className="text-xs text-slate-600">
                                            Price per seat
                                        </p>

                                        <p className="mt-1 text-3xl font-black">

                                            ₹
                                            {Number(
                                                ride.price || 0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}

                                        </p>

                                    </div>

                                    <p className="text-xs text-slate-600">
                                        / passenger
                                    </p>

                                </div>


                                <button
                                    onClick={() =>
                                        navigate(
                                            `/passenger/rides/${ride.id}/book`
                                        )
                                    }
                                    disabled={
                                        ride.status !==
                                            "AVAILABLE" ||
                                        Number(
                                            ride.availableSeats
                                        ) <= 0
                                    }
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none"
                                >

                                    {ride.status ===
                                        "AVAILABLE" &&
                                    Number(
                                        ride.availableSeats
                                    ) > 0 ? (
                                        <>
                                            Book this ride

                                            <ArrowRight
                                                size={17}
                                            />
                                        </>
                                    ) : (
                                        "Ride unavailable"
                                    )}

                                </button>


                                <p className="mt-4 text-center text-[11px] leading-5 text-slate-600">
                                    You can choose the number of
                                    seats on the next step.
                                </p>

                            </div>

                        </div>

                    </motion.aside>

                </div>

            </main>

        </div>
    );
};


const Location = ({
    color,
    label,
    value,
}) => {

    return (

        <div className="relative flex items-center gap-5">

            <div
                className={`relative z-10 h-[23px] w-[23px] shrink-0 rounded-full ${color} ring-[6px] ring-slate-900`}
            />

            <div className="min-w-0">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    {label}
                </p>

                <p className="mt-1 truncate text-lg font-black sm:text-xl">
                    {value}
                </p>

            </div>

        </div>
    );
};


const InfoCard = ({
    icon: Icon,
    label,
    value,
}) => {

    return (

        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/50 p-4">

            <div className="flex items-center gap-2">

                <Icon
                    size={16}
                    className="text-blue-400"
                />

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {label}
                </p>

            </div>

            <p className="mt-2 text-sm font-bold text-slate-300">
                {value || "—"}
            </p>

        </div>
    );
};


export default RideDetails;