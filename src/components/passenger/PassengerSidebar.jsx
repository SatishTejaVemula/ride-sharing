import { useNavigate } from "react-router-dom";
import {
    CalendarCheck,
    CarFront,
    LayoutDashboard,
    LogOut,
    UserRound,
    Search,
    X,
} from "lucide-react";

const PassengerSidebar = ({
    open,
    onClose,
    onLogout,
}) => {

    const navigate = useNavigate();

    const navigation = [
        {
            label: "Overview",
            icon: LayoutDashboard,
            path: "/passenger/dashboard",
            active: false,
        },
        {
            label: "Find Rides",
            icon: Search,
            path: "/passenger/rides",
            active: false,
        },
        {
            label: "My Bookings",
            icon: CalendarCheck,
            path: "/passenger/bookings",
            active: false,
        },
        {
            label: "Profile",
            icon: UserRound,
            path: "/passenger/profile",
            active: false,
        },
    ];

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800/80 bg-slate-950 transition-transform duration-300 lg:translate-x-0 ${
                    open
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >

                {/* Logo */}

                <div className="flex h-20 items-center justify-between border-b border-slate-800/80 px-6">

                    <div>

                        <h1 className="text-xl font-black tracking-tight text-white">

                            RideFlow
                            <span className="text-blue-500">
                                .
                            </span>

                        </h1>

                        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">

                            Passenger Console

                        </p>

                    </div>


                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 text-slate-500 hover:bg-slate-900 hover:text-white lg:hidden"
                    >
                        <X size={19} />
                    </button>

                </div>


                {/* Navigation */}

                <div className="flex-1 px-4 py-6">

                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">

                        Workspace

                    </p>


                    <nav className="space-y-1">

                        {navigation.map((item) => {

                            const Icon = item.icon;

                            return (
                                <button
                                    key={item.label}
                                    onClick={() => {
                                        navigate(item.path);
                                        onClose?.();
                                    }}
                                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                                        item.active
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                            : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                    }`}
                                >

                                    <Icon size={18} />

                                    {item.label}

                                </button>
                            );

                        })}

                    </nav>

                </div>


                {/* Logout */}

                <div className="border-t border-slate-800/80 p-4">

                    <button
                        onClick={onLogout}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                    >

                        <LogOut size={18} />

                        Sign out

                    </button>

                </div>

            </aside>
        </>
    );
};

export default PassengerSidebar;