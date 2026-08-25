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
    MapPin,
    ShieldCheck,
    Users,
} from "lucide-react";

const API_URL = "http://localhost:8080";

const BookRide = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [ride, setRide] = useState(null);
    const [user, setUser] = useState(null);
    const [seats, setSeats] = useState(1);

    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            toast.error("Please login again.");
            navigate("/login");
            return;
        }

        try {
            setUser(JSON.parse(storedUser));

            const response = await axios.get(
                `${API_URL}/api/rides/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setRide(response.data);
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

            toast.error("Unable to load ride.");
            navigate("/passenger/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const totalPrice =
        Number(ride?.price || 0) * Number(seats);

    const handleSeatsChange = (value) => {
        const selectedSeats = Number(value);

        if (!ride) return;

        if (selectedSeats < 1) {
            setSeats(1);
            return;
        }

        if (
            selectedSeats >
            Number(ride.availableSeats)
        ) {
            setSeats(Number(ride.availableSeats));

            toast.error(
                `Only ${ride.availableSeats} seat(s) available.`
            );

            return;
        }

        setSeats(selectedSeats);
    };

    const handleBooking = async () => {
        const token = localStorage.getItem("token");

        if (!token || !user) {
            toast.error("Please login again.");
            navigate("/login");
            return;
        }

        if (!ride) {
            toast.error("Ride information unavailable.");
            return;
        }

        if (ride.status !== "AVAILABLE") {
            toast.error("This ride is no longer available.");
            return;
        }

        if (Number(ride.availableSeats) < seats) {
            toast.error(
                `Only ${ride.availableSeats} seat(s) available.`
            );
            return;
        }

        setBooking(true);

        try {
            const payload = {
                rideId: Number(id),
                passengerId: Number(user.id),
                seatsBooked: Number(seats),
            };

            console.log(
                "Creating booking:",
                payload
            );

            const response = await axios.post(
                `${API_URL}/api/bookings`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            console.log(
                "Booking successful:",
                response.data
            );

            toast.success(
                "Ride booked successfully! 🎉"
            );

            navigate("/passenger/bookings");
        } catch (error) {
            console.error(
                "Booking failed:",
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
                    "You are not authorized to book this ride."
                );
                return;
            }

            if (error.response?.status === 400) {
                toast.error(
                    error.response?.data?.message ||
                        "Invalid booking request."
                );
                return;
            }

            toast.error(
                error.response?.data?.message ||
                    "Booking failed. Please try again."
            );
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Loader2
                        size={20}
                        className="animate-spin text-blue-500"
                    />
                    Loading booking...
                </div>
            </div>
        );
    }

    if (!ride) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Background */}

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
                                `/passenger/rides/${id}`
                            )
                        }
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white"
                    >
                        <ArrowLeft size={18} />

                        <span className="hidden sm:inline">
                            Back to ride
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

                    <div className="w-20 sm:w-28" />

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

                        <CheckCircle2 size={14} />

                        Secure booking

                    </div>

                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                        Book your ride
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Select your seats and review your
                        booking before confirming.
                    </p>

                </motion.div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">

                    {/* Ride summary */}

                    <motion.section
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

                        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

                            <div className="flex items-center justify-between">

                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
                                    Ride summary
                                </p>

                                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                                    {ride.status}
                                </span>

                            </div>

                            {/* Route */}

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

                            {/* Information */}

                            <div className="mt-8 grid gap-3 sm:grid-cols-3">

                                <Info
                                    icon={CalendarDays}
                                    label="Date"
                                    value={
                                        ride.rideDate
                                    }
                                />

                                <Info
                                    icon={Clock3}
                                    label="Time"
                                    value={
                                        ride.rideTime
                                    }
                                />

                                <Info
                                    icon={Users}
                                    label="Available"
                                    value={`${ride.availableSeats} seats`}
                                />

                            </div>

                        </div>

                        {/* Passenger */}

                        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

                            <div className="flex items-center gap-4">

                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 font-black text-blue-400">
                                    {user?.name
                                        ?.charAt(0)
                                        ?.toUpperCase() ||
                                        "P"}
                                </div>

                                <div>

                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Passenger
                                    </p>

                                    <p className="mt-1 font-bold">
                                        {user?.name}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {user?.email}
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* Trust */}

                        <div className="rounded-3xl border border-blue-500/10 bg-blue-500/5 p-5">

                            <div className="flex gap-3">

                                <ShieldCheck
                                    size={20}
                                    className="mt-0.5 shrink-0 text-blue-400"
                                />

                                <p className="text-xs leading-5 text-slate-500">
                                    Your booking is securely
                                    processed through RideFlow.
                                    Please verify the ride
                                    details before confirming.
                                </p>

                            </div>

                        </div>

                    </motion.section>

                    {/* Booking panel */}

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

                            <div className="p-6 sm:p-7">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">

                                        <Users size={20} />

                                    </div>

                                    <div>

                                        <p className="font-black">
                                            Number of seats
                                        </p>

                                        <p className="text-xs text-slate-600">
                                            Choose how many seats
                                            you need
                                        </p>

                                    </div>

                                </div>

                                {/* Seat selector */}

                                <div className="mt-7 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-3">

                                    <button
                                        type="button"
                                        disabled={
                                            seats <= 1
                                        }
                                        onClick={() =>
                                            handleSeatsChange(
                                                seats - 1
                                            )
                                        }
                                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-xl font-bold transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        −
                                    </button>

                                    <div className="text-center">

                                        <p className="text-2xl font-black">
                                            {seats}
                                        </p>

                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                            {seats === 1
                                                ? "Seat"
                                                : "Seats"}
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        disabled={
                                            seats >=
                                            Number(
                                                ride.availableSeats
                                            )
                                        }
                                        onClick={() =>
                                            handleSeatsChange(
                                                seats + 1
                                            )
                                        }
                                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-xl font-bold transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        +
                                    </button>

                                </div>

                                <p className="mt-3 text-center text-[11px] text-slate-600">
                                    {ride.availableSeats} seat(s)
                                    available
                                </p>

                                {/* Price */}

                                <div className="my-7 border-y border-slate-800 py-6">

                                    <div className="flex items-center justify-between text-sm">

                                        <span className="text-slate-500">
                                            ₹
                                            {Number(
                                                ride.price ||
                                                    0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}{" "}
                                            × {seats} seat
                                            {seats > 1
                                                ? "s"
                                                : ""}
                                        </span>

                                        <span className="font-semibold text-slate-300">
                                            ₹
                                            {totalPrice.toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>

                                    </div>

                                    <div className="mt-4 flex items-end justify-between">

                                        <span className="text-sm font-bold">
                                            Total
                                        </span>

                                        <span className="text-3xl font-black text-white">
                                            ₹
                                            {totalPrice.toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>

                                    </div>

                                </div>

                                {/* Confirm */}

                                <button
                                    type="button"
                                    onClick={
                                        handleBooking
                                    }
                                    disabled={
                                        booking ||
                                        ride.status !==
                                            "AVAILABLE" ||
                                        Number(
                                            ride.availableSeats
                                        ) < seats
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black shadow-xl shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none"
                                >

                                    {booking ? (
                                        <>
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />

                                            Confirming...
                                        </>
                                    ) : (
                                        <>
                                            Confirm booking

                                            <ArrowRight
                                                size={17}
                                            />
                                        </>
                                    )}

                                </button>

                                <p className="mt-4 text-center text-[10px] leading-5 text-slate-600">
                                    By confirming, you agree to
                                    the RideFlow booking terms.
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

const Info = ({
    icon: Icon,
    label,
    value,
}) => {
    return (
        <div className="rounded-2xl bg-slate-950/60 p-4">

            <div className="flex items-center gap-2">

                <Icon
                    size={15}
                    className="text-blue-400"
                />

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {label}
                </p>

            </div>

            <p className="mt-2 text-sm font-bold text-slate-300">
                {value}
            </p>

        </div>
    );
};

export default BookRide;