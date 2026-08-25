import {
    ArrowRight,
    CalendarDays,
    Clock3,
    MapPin,
    Users,
} from "lucide-react";

const RideCard = ({ ride }) => {
    const date = ride.rideDate
        ? new Date(ride.rideDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "—";

    return (
        <div className="group rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5 transition duration-300 hover:border-slate-700 hover:bg-slate-900">

            <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                    <div className="flex items-center gap-2">

                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />

                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                            {ride.status}
                        </span>

                    </div>

                    <div className="mt-4 flex items-center gap-3">

                        <div className="max-w-[130px] truncate text-sm font-semibold text-white">
                            {ride.pickupLocation}
                        </div>

                        <ArrowRight
                            size={15}
                            className="shrink-0 text-slate-600"
                        />

                        <div className="max-w-[130px] truncate text-sm font-semibold text-white">
                            {ride.dropLocation}
                        </div>

                    </div>

                </div>

                <div className="shrink-0 text-right">

                    <p className="text-xs text-slate-500">
                        Fare
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                        ₹{Number(ride.price || 0).toLocaleString("en-IN")}
                    </p>

                </div>

            </div>


            <div className="mt-5 grid grid-cols-3 gap-3">

                <div className="rounded-2xl bg-slate-950/70 p-3">

                    <div className="flex items-center gap-2 text-slate-500">
                        <CalendarDays size={14} />

                        <span className="text-xs">
                            Date
                        </span>
                    </div>

                    <p className="mt-2 text-xs font-semibold text-slate-200">
                        {date}
                    </p>

                </div>


                <div className="rounded-2xl bg-slate-950/70 p-3">

                    <div className="flex items-center gap-2 text-slate-500">
                        <Clock3 size={14} />

                        <span className="text-xs">
                            Time
                        </span>
                    </div>

                    <p className="mt-2 text-xs font-semibold text-slate-200">
                        {ride.rideTime || "—"}
                    </p>

                </div>


                <div className="rounded-2xl bg-slate-950/70 p-3">

                    <div className="flex items-center gap-2 text-slate-500">
                        <Users size={14} />

                        <span className="text-xs">
                            Seats
                        </span>
                    </div>

                    <p className="mt-2 text-xs font-semibold text-slate-200">
                        {ride.availableSeats ?? 0} available
                    </p>

                </div>

            </div>

        </div>
    );
};

export default RideCard;