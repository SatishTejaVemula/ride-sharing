import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    CarFront,
    CircleDollarSign,
    Star,
    Users,
} from "lucide-react";
import toast from "react-hot-toast";

import DriverSidebar from "../../components/driver/DriverSidebar";
import DriverTopbar from "../../components/driver/DriverTopbar";
import StatCard from "../../components/driver/StatCard";
import RideCard from "../../components/driver/RideCard";

const API_URL = "http://localhost:8080";

const DriverDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);


    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                console.error("Invalid stored user");
            }
        }

    }, []);


    useEffect(() => {

        const loadRides = async () => {

            try {

                setLoading(true);

                const token =
                    localStorage.getItem("token");

                const response = await axios.get(
                    `${API_URL}/api/rides`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setRides(response.data || []);

            } catch (error) {

                console.error(
                    "Failed to load rides:",
                    error
                );

                toast.error(
                    "Unable to load your rides."
                );

            } finally {

                setLoading(false);

            }
        };

        loadRides();

    }, []);


    const driverId =
        user?.authUserId ||
        user?.id;


    const myRides = useMemo(() => {

        if (!driverId) {
            return rides;
        }

        return rides.filter(
            (ride) =>
                Number(ride.driverId) ===
                Number(driverId)
        );

    }, [rides, driverId]);


    const availableRides = myRides.filter(
        (ride) =>
            ride.status === "AVAILABLE"
    );


    const fullRides = myRides.filter(
        (ride) =>
            ride.status === "FULL"
    );


    const totalSeats = myRides.reduce(
        (total, ride) =>
            total +
            Number(ride.availableSeats || 0),
        0
    );


    const estimatedRevenue = myRides.reduce(
        (total, ride) =>
            total +
            Number(ride.price || 0),
        0
    );


    const upcomingRides = [...myRides]
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


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

    };


    const handleCreateRide = () => {
        navigate("/driver/create-ride");
    };


    return (
        <div className="min-h-screen bg-slate-950 text-white">

            <DriverSidebar
                open={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
                onLogout={handleLogout}
            />


            <div className="lg:pl-72">

                <DriverTopbar
                    user={user}
                    onMenuClick={() =>
                        setSidebarOpen(true)
                    }
                    onCreateRide={handleCreateRide}
                />


                <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

                    {/* Header */}

                    <section className="mb-8">

                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                            <div>

                                <p className="text-sm font-semibold text-blue-400">
                                    Driver overview
                                </p>

                                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                                    Good morning,{" "}
                                    {user?.name?.split(" ")[0] ||
                                        "Driver"}
                                    👋
                                </h1>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                                    Manage your rides, track performance,
                                    and keep your passengers moving.
                                </p>

                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">

                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Account status
                                </p>

                                <div className="mt-1 flex items-center gap-2">

                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                                    <span className="text-sm font-semibold text-emerald-400">
                                        Active driver
                                    </span>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* Stats */}

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <StatCard
                            title="Total rides"
                            value={myRides.length}
                            subtitle="All created rides"
                            icon={CarFront}
                            trend="Active"
                            trendUp
                        />

                        <StatCard
                            title="Available rides"
                            value={availableRides.length}
                            subtitle="Currently accepting"
                            icon={Users}
                            trend="Live"
                            trendUp
                        />

                        <StatCard
                            title="Estimated earnings"
                            value={`₹${estimatedRevenue.toLocaleString(
                                "en-IN"
                            )}`}
                            subtitle="Listed ride value"
                            icon={CircleDollarSign}
                            trend="Revenue"
                            trendUp
                        />

                        <StatCard
                            title="Driver rating"
                            value="5.0"
                            subtitle="Based on your profile"
                            icon={Star}
                            trend="Excellent"
                            trendUp
                        />

                    </section>


                    {/* Main content */}

                    <section className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">

                        {/* Upcoming rides */}

                        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-5 sm:p-6">

                            <div className="mb-6 flex items-center justify-between">

                                <div>

                                    <h2 className="text-lg font-bold">
                                        Your upcoming rides
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Your latest scheduled journeys
                                    </p>

                                </div>

                                <span className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300">
                                    {myRides.length} total
                                </span>

                            </div>


                            {loading ? (

                                <div className="space-y-4">

                                    {[1, 2, 3].map((item) => (

                                        <div
                                            key={item}
                                            className="h-44 animate-pulse rounded-3xl bg-slate-900"
                                        />

                                    ))}

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
                                        No rides yet
                                    </h3>

                                    <p className="mt-1 text-center text-sm text-slate-500">
                                        Create your first ride and
                                        start earning.
                                    </p>

                                </div>

                            )}

                        </div>


                        {/* Performance */}

                        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-5 sm:p-6">

                            <div>

                                <h2 className="text-lg font-bold">
                                    Driver performance
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    A quick look at your activity
                                </p>

                            </div>


                            <div className="mt-6 space-y-5">

                                <div>

                                    <div className="mb-2 flex justify-between">

                                        <span className="text-sm text-slate-400">
                                            Ride availability
                                        </span>

                                        <span className="text-sm font-semibold">
                                            {myRides.length
                                                ? Math.round(
                                                    (availableRides.length /
                                                        myRides.length) *
                                                    100
                                                )
                                                : 0}
                                            %
                                        </span>

                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                                        <div
                                            className="h-full rounded-full bg-blue-500 transition-all"
                                            style={{
                                                width: `${myRides.length
                                                        ? Math.round(
                                                            (availableRides.length /
                                                                myRides.length) *
                                                            100
                                                        )
                                                        : 0
                                                    }%`,
                                            }}
                                        />

                                    </div>

                                </div>


                                <div>

                                    <div className="mb-2 flex justify-between">

                                        <span className="text-sm text-slate-400">
                                            Available seats
                                        </span>

                                        <span className="text-sm font-semibold">
                                            {totalSeats}
                                        </span>

                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                                        <div
                                            className="h-full rounded-full bg-emerald-500"
                                            style={{
                                                width: `${Math.min(
                                                    totalSeats * 10,
                                                    100
                                                )}%`,
                                            }}
                                        />

                                    </div>

                                </div>


                                <div className="rounded-3xl border border-blue-500/10 bg-blue-500/5 p-5">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                                            <Star size={20} />
                                        </div>

                                        <div>

                                            <p className="text-xs text-slate-500">
                                                Current rating
                                            </p>

                                            <p className="mt-1 text-xl font-bold">
                                                5.0
                                                <span className="ml-1 text-sm font-normal text-slate-500">
                                                    / 5.0
                                                </span>
                                            </p>

                                        </div>

                                    </div>

                                    <p className="mt-4 text-sm leading-6 text-slate-400">
                                        Keep providing reliable rides to
                                        maintain your excellent driver
                                        rating.
                                    </p>

                                </div>


                                <div className="grid grid-cols-2 gap-3">

                                    <div className="rounded-2xl bg-slate-950/70 p-4">

                                        <p className="text-xs text-slate-500">
                                            Full rides
                                        </p>

                                        <p className="mt-2 text-2xl font-bold">
                                            {fullRides.length}
                                        </p>

                                    </div>

                                    <div className="rounded-2xl bg-slate-950/70 p-4">

                                        <p className="text-xs text-slate-500">
                                            Seats open
                                        </p>

                                        <p className="mt-2 text-2xl font-bold">
                                            {totalSeats}
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

export default DriverDashboard;