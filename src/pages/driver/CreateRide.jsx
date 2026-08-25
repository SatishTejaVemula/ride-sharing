import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    CarFront,
    MapPin,
    CalendarDays,
    Clock3,
    Users,
    IndianRupee,
    Loader2,
    Route,
} from "lucide-react";

const API_URL = "http://localhost:8080";

const CreateRide = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        pickupLocation: "",
        dropLocation: "",
        rideDate: "",
        rideTime: "",
        availableSeats: 1,
        price: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token) {
            toast.error("Please login again.");
            navigate("/login");
            return;
        }

        if (!storedUser) {
            toast.error("Driver information not found.");
            return;
        }

        let user;

        try {
            user = JSON.parse(storedUser);
        } catch {
            toast.error("Invalid user session.");
            return;
        }

        const driverId = user?.authUserId || user?.id;

        if (!driverId) {
            toast.error("Driver ID not found.");
            return;
        }

        if (!formData.pickupLocation.trim()) {
            toast.error("Enter the pickup location.");
            return;
        }

        if (!formData.dropLocation.trim()) {
            toast.error("Enter the drop location.");
            return;
        }

        if (
            formData.pickupLocation.trim().toLowerCase() ===
            formData.dropLocation.trim().toLowerCase()
        ) {
            toast.error(
                "Pickup and drop locations must be different."
            );
            return;
        }

        if (!formData.rideDate) {
            toast.error("Select a ride date.");
            return;
        }

        if (!formData.rideTime) {
            toast.error("Select a ride time.");
            return;
        }

        const seats = Number(formData.availableSeats);
        const price = Number(formData.price);

        if (!Number.isInteger(seats) || seats < 1 || seats > 10) {
            toast.error("Seats must be between 1 and 10.");
            return;
        }

        if (!Number.isFinite(price) || price <= 0) {
            toast.error("Enter a valid price.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                driverId: Number(driverId),
                pickupLocation: formData.pickupLocation.trim(),
                dropLocation: formData.dropLocation.trim(),
                rideDate: formData.rideDate,
                rideTime: formData.rideTime,
                availableSeats: seats,
                price: price,
                status: "AVAILABLE",
            };

            const response = await axios.post(
                `${API_URL}/api/rides`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Ride created:", response.data);

            toast.success("Ride created successfully! 🚗");

            setTimeout(() => {
                navigate("/driver/dashboard");
            }, 700);
        } catch (error) {
            console.error(
                "Create ride failed:",
                error
            );

            if (error.response?.status === 401) {
                toast.error(
                    "Your session has expired. Please login again."
                );

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");
            } else if (error.response?.status === 403) {
                toast.error(
                    "Only drivers can create rides."
                );
            } else {
                toast.error(
                    error.response?.data?.message ||
                        "Failed to create ride."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Background */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

                <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />

            </div>

            {/* Header */}

            <header className="relative z-10 flex h-20 items-center border-b border-slate-800/80 bg-slate-950/80 px-4 backdrop-blur-xl sm:px-6 lg:px-10">

                <div className="mx-auto flex w-full max-w-6xl items-center justify-between">

                    <button
                        onClick={() =>
                            navigate("/driver/dashboard")
                        }
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
                    >
                        <ArrowLeft size={18} />

                        <span className="hidden sm:inline">
                            Back to dashboard
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

                    <div className="w-28" />

                </div>

            </header>


            {/* Main */}

            <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">

                {/* Heading */}

                <div className="mb-8">

                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">

                        <Route size={14} />

                        Driver workspace

                    </div>

                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                        Create a new ride
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                        Add your journey details and make your
                        available seats visible to passengers.
                    </p>

                </div>


                {/* Form */}

                <form
                    onSubmit={handleSubmit}
                    className="grid gap-6 lg:grid-cols-[1fr_340px]"
                >

                    {/* Form card */}

                    <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-7">

                        <div className="mb-7">

                            <h2 className="text-lg font-bold">
                                Journey details
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Tell passengers where and when
                                you're travelling.
                            </p>

                        </div>


                        {/* Locations */}

                        <div className="grid gap-5 sm:grid-cols-2">

                            <FormField
                                label="Pickup location"
                                icon={MapPin}
                                name="pickupLocation"
                                value={formData.pickupLocation}
                                onChange={handleChange}
                                placeholder="e.g. Hyderabad"
                            />

                            <FormField
                                label="Drop location"
                                icon={MapPin}
                                name="dropLocation"
                                value={formData.dropLocation}
                                onChange={handleChange}
                                placeholder="e.g. Vijayawada"
                            />

                        </div>


                        {/* Date / Time */}

                        <div className="mt-5 grid gap-5 sm:grid-cols-2">

                            <FormField
                                label="Ride date"
                                icon={CalendarDays}
                                type="date"
                                name="rideDate"
                                value={formData.rideDate}
                                onChange={handleChange}
                                min={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                            />

                            <FormField
                                label="Departure time"
                                icon={Clock3}
                                type="time"
                                name="rideTime"
                                value={formData.rideTime}
                                onChange={handleChange}
                            />

                        </div>


                        {/* Seats / Price */}

                        <div className="mt-5 grid gap-5 sm:grid-cols-2">

                            <FormField
                                label="Available seats"
                                icon={Users}
                                type="number"
                                name="availableSeats"
                                value={formData.availableSeats}
                                onChange={handleChange}
                                min="1"
                                max="10"
                            />

                            <FormField
                                label="Price per seat"
                                icon={IndianRupee}
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="e.g. 350"
                                min="1"
                                step="0.01"
                            />

                        </div>


                        {/* Submit */}

                        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/driver/dashboard"
                                    )
                                }
                                className="rounded-2xl border border-slate-800 px-6 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />

                                        Creating ride...
                                    </>
                                ) : (
                                    <>
                                        <CarFront size={17} />

                                        Create ride
                                    </>
                                )}
                            </button>

                        </div>

                    </div>


                    {/* Preview */}

                    <div className="lg:sticky lg:top-8 lg:self-start">

                        <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 shadow-2xl backdrop-blur-xl">

                            <div className="border-b border-slate-800/80 p-6">

                                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                                    Ride preview
                                </p>

                                <h2 className="mt-2 text-lg font-bold">
                                    {formData.pickupLocation ||
                                        "Pickup"}{" "}
                                    →{" "}
                                    {formData.dropLocation ||
                                        "Destination"}
                                </h2>

                            </div>


                            <div className="space-y-4 p-6">

                                <PreviewItem
                                    icon={CalendarDays}
                                    label="Date"
                                    value={
                                        formData.rideDate
                                            ? new Date(
                                                  formData.rideDate
                                              ).toLocaleDateString(
                                                  "en-IN",
                                                  {
                                                      weekday: "short",
                                                      day: "2-digit",
                                                      month: "short",
                                                      year: "numeric",
                                                  }
                                              )
                                            : "Not selected"
                                    }
                                />

                                <PreviewItem
                                    icon={Clock3}
                                    label="Departure"
                                    value={
                                        formData.rideTime ||
                                        "Not selected"
                                    }
                                />

                                <PreviewItem
                                    icon={Users}
                                    label="Available seats"
                                    value={
                                        formData.availableSeats ||
                                        "0"
                                    }
                                />

                                <PreviewItem
                                    icon={IndianRupee}
                                    label="Price per seat"
                                    value={
                                        formData.price
                                            ? `₹${Number(
                                                  formData.price
                                              ).toLocaleString(
                                                  "en-IN"
                                              )}`
                                            : "Not set"
                                    }
                                />

                            </div>


                            <div className="m-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">

                                <div className="flex items-center gap-2">

                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                                    <span className="text-xs font-semibold text-emerald-400">
                                        Available for booking
                                    </span>

                                </div>

                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                    Your ride will be published with
                                    AVAILABLE status.
                                </p>

                            </div>

                        </div>

                    </div>

                </form>

            </main>

        </div>
    );
};


const FormField = ({
    label,
    icon: Icon,
    type = "text",
    ...props
}) => {
    return (
        <label className="block">

            <span className="mb-2 block text-xs font-semibold text-slate-400">
                {label}
            </span>

            <div className="group relative">

                <Icon
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition group-focus-within:text-blue-400"
                />

                <input
                    {...props}
                    type={type}
                    className="h-12 w-full rounded-2xl border border-slate-800 bg-slate-950/80 pl-11 pr-4 text-sm font-medium text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
                />

            </div>

        </label>
    );
};


const PreviewItem = ({
    icon: Icon,
    label,
    value,
}) => {
    return (
        <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-slate-500">
                <Icon size={17} />
            </div>

            <div className="min-w-0">

                <p className="text-[11px] text-slate-600">
                    {label}
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-slate-200">
                    {value}
                </p>

            </div>

        </div>
    );
};

export default CreateRide;