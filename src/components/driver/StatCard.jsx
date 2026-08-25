import {
    ArrowDownRight,
    ArrowUpRight,
} from "lucide-react";

const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendUp = true,
}) => {
    return (
        <div className="group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-xl shadow-black/5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl">
            
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl transition group-hover:bg-blue-500/10" />

            <div className="relative">

                <div className="flex items-start justify-between">

                    <div>
                        <p className="text-sm font-medium text-slate-400">
                            {title}
                        </p>

                        <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
                            {value}
                        </h3>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                        <Icon size={21} />
                    </div>

                </div>

                <div className="mt-5 flex items-center gap-2">

                    {trend && (
                        <span
                            className={`flex items-center gap-0.5 text-xs font-semibold ${
                                trendUp
                                    ? "text-emerald-400"
                                    : "text-red-400"
                            }`}
                        >
                            {trendUp ? (
                                <ArrowUpRight size={14} />
                            ) : (
                                <ArrowDownRight size={14} />
                            )}

                            {trend}
                        </span>
                    )}

                    <span className="text-xs text-slate-500">
                        {subtitle}
                    </span>

                </div>

            </div>
        </div>
    );
};

export default StatCard;