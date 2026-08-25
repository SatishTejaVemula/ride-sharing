import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    Save,
} from "lucide-react";

const API_URL = "http://localhost:8080";

const EditRide = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        pickupLocation: "",
        dropLocation: "",
        rideDate: "",
        rideTime: "",
        availableSeats: 1,
        price: "",
        status: "AVAILABLE",
    });

    useEffect(() => {
        const loadRide = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login again.");
                navigate("/login");
                return;
            }

            try {
                setLoading(true);

                const response = await axios.get(
                    `${API_URL}/api/rides/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const ride = response.data;

                setFormData({
                    pickupLocation: ride.pickupLocation || "",
                    dropLocation: ride.dropLocation || "",
                    rideDate: ride.rideDate || "",
                    rideTime: ride.rideTime || "",
                    availableSeats:
                        ride.availableSeats ?? 1,
                    price: ride.price ?? "",
                    status: ride.status || "AVAILABLE",
                });
            } catch (error) {
                console.error("Failed to load ride:", error);

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
                        "You cannot edit this ride."
                    );

                    navigate("/driver/rides");
                    return;
                }

                if (error.response?.status === 404) {
                    toast.error("Ride not found.");

                    navigate("/driver/rides");
                    return;
                }

                toast.error("Failed to load ride.");
            } finally {
                setLoading(false);
            }
        };

        loadRide();
    }, [id, navigate]);

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

        if (!token) {
            toast.error("Please login again.");
            navigate("/login");
            return;
        }

        if (!formData.pickupLocation.trim()) {
            toast.error("Enter pickup location.");
            return;
        }

        if (!formData.dropLocation.trim()) {
            toast.error("Enter drop location.");
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
            setSaving(true);

            const response = await axios.put(
                `${API_URL}/api/rides/${id}`,
                {
                    pickupLocation:
                        formData.pickupLocation.trim(),

                    dropLocation:
                        formData.dropLocation.trim(),

                    rideDate: formData.rideDate,

                    rideTime: formData.rideTime,

                    availableSeats: seats,

                    price: price,

                    status: formData.status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Ride updated:", response.data);

            toast.success("Ride updated successfully! 🚗");

            setTimeout(() => {
                navigate("/driver/rides");
            }, 700);
        } catch (error) {
            console.error("Update ride failed:", error);

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
                    "You can only edit your own rides."
                );
                return;
            }

            if (error.response?.status === 404) {
                toast.error("Ride not found.");
                navigate("/driver/rides");
                return;
            }

            toast.error(
                error.response?.data?.message ||
                    "Failed to update ride."
            );
        } finally {
            setSaving(false);
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
                    Loading ride...
                </div>
            </div>
        );
    }

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
                            navigate("/driver/rides")
                        }
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
                    >
                        <ArrowLeft size={18} />

                        <span className="hidden sm:inline">
                            Back to My Rides
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

                <div className="mb-8">

                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
                        <CarFront size={14} />
                        Ride management
                    </div>

                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                        Edit ride
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Update the details of your journey.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid gap-6 lg:grid-cols-[1fr_340px]"
                >

                    {/* Form */}

                    <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-2xl backdrop-blur-xl sm:p-7">

                        <div className="mb-7">

                            <h2 className="text-lg font-bold">
                                Journey details
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Modify your ride information below.
                            </p>

                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">

                            <FormField
                                label="Pickup location"
                                icon={MapPin}
                                name="pickupLocation"
                                value={
                                    formData.pickupLocation
                                }
                                onChange={handleChange}
                                placeholder="e.g. Hyderabad"
                            />

                            <FormField
                                label="Drop location"
                                icon={MapPin}
                                name="dropLocation"
                                value={
                                    formData.dropLocation
                                }
                                onChange={handleChange}
                                placeholder="e.g. Vijayawada"
                            />

                        </div>

                        <div className="mt-5 grid gap-5 sm:grid-cols-2">

                            <FormField
                                label="Ride date"
                                icon={CalendarDays}
                                type="date"
                                name="rideDate"
                                value={formData.rideDate}
                                onChange={handleChange}
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

                        <div className="mt-5 grid gap-5 sm:grid-cols-2">

                            <FormField
                                label="Available seats"
                                icon={Users}
                                type="number"
                                name="availableSeats"
                                value={
                                    formData.availableSeats
                                }
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
                                min="1"
                                step="0.01"
                            />

                        </div>

                        <div className="mt-5">

                            <label className="block">

                                <span className="mb-2 block text-xs font-semibold text-slate-400">
                                    Ride status
                                </span>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="h-12 w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 text-sm font-medium text-white outline-none transition focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
                                >
                                    <option value="AVAILABLE">
                                        AVAILABLE
                                    </option>

                                    <option value="FULL">
                                        FULL
                                    </option>

                                    <option value="CANCELLED">
                                        CANCELLED
                                    </option>
                                </select>

                            </label>

                        </div>

                        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/driver/rides")
                                }
                                className="rounded-2xl border border-slate-800 px-6 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? (
                                    <>
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={17} />
                                        Save changes
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                    {/* Preview */}

                    <div className="lg:sticky lg:top-8 lg:self-start">

                        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">

                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                                Current preview
                            </p>

                            <h2 className="mt-3 text-xl font-black">
                                {formData.pickupLocation ||
                                    "Pickup"}{" "}
                                →{" "}
                                {formData.dropLocation ||
                                    "Destination"}
                            </h2>

                            <div className="mt-6 space-y-4">

                                <PreviewItem
                                    icon={CalendarDays}
                                    label="Date"
                                    value={
                                        formData.rideDate ||
                                        "Not selected"
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
                                    label="Seats"
                                    value={
                                        formData.availableSeats
                                    }
                                />

                                <PreviewItem
                                    icon={IndianRupee}
                                    label="Price"
                                    value={`₹${Number(
                                        formData.price || 0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}`}
                                />

                            </div>

                            <div className="mt-6 rounded-2xl border border-blue-500/10 bg-blue-500/5 p-4">

                                <p className="text-xs font-semibold text-blue-400">
                                    Ride #{id}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Changes will be saved to your
                                    ride immediately after you
                                    click Save changes.
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

export default EditRide;