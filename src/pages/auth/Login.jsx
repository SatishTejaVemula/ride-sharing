import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    Bike,
    LockKeyhole,
    Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.email.trim()) {
            toast.error("Please enter your email.");
            return;
        }

        if (!form.password) {
            toast.error("Please enter your password.");
            return;
        }

        try {
            setLoading(true);

            const user = await login({
                email: form.email.trim(),
                password: form.password,
            });

            toast.success(`Welcome back, ${user.name || "User"}!`);

            const from = location.state?.from?.pathname;

            if (from) {
                navigate(from, {
                    replace: true,
                });

                return;
            }

            if (user.role?.toUpperCase() === "DRIVER") {
                navigate("/driver/dashboard", {
                    replace: true,
                });
            } else {
                navigate("/passenger/dashboard", {
                    replace: true,
                });
            }
        } catch (error) {
            console.error("Login failed:", error);

            const status = error.response?.status;

            let message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Invalid email or password.";

            if (status === 401 || status === 403) {
                message = "Invalid email or password.";
            }

            if (status >= 500) {
                message = "Server error. Please try again later.";
            }

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#080B0E] text-white">

            {/* =========================================================
                GLOBAL BACKGROUND
            ========================================================== */}

            <div className="pointer-events-none fixed inset-0">

                <div
                    className="
                        absolute
                        -left-48
                        -top-48
                        h-[500px]
                        w-[500px]
                        rounded-full
                        bg-[#E8FF3D]/[0.05]
                        blur-[140px]
                        sm:h-[600px]
                        sm:w-[600px]
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-48
                        -right-48
                        h-[500px]
                        w-[500px]
                        rounded-full
                        bg-[#E8FF3D]/[0.035]
                        blur-[140px]
                        sm:h-[600px]
                        sm:w-[600px]
                    "
                />

            </div>


            {/* =========================================================
                PAGE
            ========================================================== */}

            <div className="relative z-10 min-h-screen">


                {/* =====================================================
                    NAVBAR
                ====================================================== */}

                <header className="absolute left-0 right-0 top-0 z-30">

                    <div
                        className="
                            mx-auto
                            flex
                            max-w-[1600px]
                            items-center
                            justify-between
                            px-5
                            py-5
                            sm:px-8
                            sm:py-6
                            lg:px-14
                        "
                    >

                        {/* LOGO */}

                        <Link
                            to="/"
                            className="group flex items-center gap-3"
                        >

                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-white/[0.08]
                                    bg-white/[0.04]
                                    backdrop-blur-xl
                                    transition-all
                                    duration-300
                                    group-hover:border-[#E8FF3D]/30
                                    group-hover:bg-[#E8FF3D]/[0.05]
                                    sm:h-11
                                    sm:w-11
                                    sm:rounded-2xl
                                "
                            >

                                <Bike
                                    size={20}
                                    strokeWidth={2.2}
                                    className="
                                        text-[#E8FF3D]
                                        sm:h-[23px]
                                        sm:w-[23px]
                                    "
                                />

                            </div>


                            <div>

                                <p
                                    className="
                                        text-lg
                                        font-black
                                        tracking-tight
                                        sm:text-xl
                                    "
                                >
                                    Ride
                                    <span className="text-[#E8FF3D]">
                                        Share
                                    </span>
                                </p>

                                <p
                                    className="
                                        hidden
                                        text-[8px]
                                        font-bold
                                        uppercase
                                        tracking-[0.3em]
                                        text-slate-600
                                        sm:block
                                    "
                                >
                                    Move differently
                                </p>

                            </div>

                        </Link>


                        {/* REGISTER */}

                        <Link
                            to="/"
                            className="
                                rounded-full
                                border
                                border-white/[0.08]
                                bg-white/[0.03]
                                px-4
                                py-2
                                text-[11px]
                                font-semibold
                                text-slate-400
                                backdrop-blur-xl
                                transition-all
                                hover:border-[#E8FF3D]/30
                                hover:bg-[#E8FF3D]/[0.05]
                                hover:text-[#E8FF3D]
                                sm:px-5
                                sm:py-2.5
                                sm:text-xs
                            "
                        >
                            Go to Home
                        </Link>

                    </div>

                </header>


                {/* =====================================================
                    MAIN
                ====================================================== */}

                <main className="flex min-h-screen items-center">

                    <div
                        className="
                            mx-auto
                            grid
                            w-full
                            max-w-[1600px]
                            grid-cols-1
                            gap-8
                            px-5
                            pb-8
                            pt-24
                            sm:px-8
                            sm:pb-10
                            sm:pt-28
                            lg:grid-cols-[1fr_500px]
                            lg:gap-14
                            lg:px-14
                            lg:pt-28
                            xl:grid-cols-[1fr_540px]
                        "
                    >


                        {/* =================================================
                            LEFT SIDE
                            DESKTOP
                        ================================================== */}

                        <section
                            className="
                                relative
                                hidden
                                min-h-[680px]
                                overflow-hidden
                                rounded-[2.5rem]
                                border
                                border-white/[0.06]
                                bg-[#0B0F13]
                                lg:flex
                                lg:items-center
                            "
                        >

                            {/* GRID */}

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    opacity-[0.035]
                                "
                                style={{
                                    backgroundImage:
                                        "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                                    backgroundSize: "65px 65px",
                                }}
                            />


                            {/* MAIN GLOW */}

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    left-[5%]
                                    top-[20%]
                                    h-[500px]
                                    w-[500px]
                                    rounded-full
                                    bg-[#E8FF3D]/[0.05]
                                    blur-[120px]
                                "
                            />


                            {/* DECORATIVE CIRCLE */}

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-[280px]
                                    top-[50%]
                                    h-[700px]
                                    w-[700px]
                                    -translate-y-1/2
                                    rounded-full
                                    border
                                    border-[#E8FF3D]/[0.05]
                                "
                            />

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-[190px]
                                    top-[50%]
                                    h-[520px]
                                    w-[520px]
                                    -translate-y-1/2
                                    rounded-full
                                    border
                                    border-white/[0.03]
                                "
                            />


                            {/* CONTENT */}

                            <div
                                className="
                                    relative
                                    z-10
                                    w-full
                                    p-10
                                    xl:p-16
                                "
                            >

                                {/* BADGE */}

                                <div
                                    className="
                                        mb-7
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-[#E8FF3D]/20
                                        bg-[#E8FF3D]/[0.05]
                                        px-4
                                        py-2
                                    "
                                >

                                    <Sparkles
                                        size={14}
                                        className="text-[#E8FF3D]"
                                    />

                                    <span
                                        className="
                                            text-[9px]
                                            font-bold
                                            uppercase
                                            tracking-[0.25em]
                                            text-[#E8FF3D]
                                        "
                                    >
                                        Welcome back
                                    </span>

                                </div>


                                {/* HEADING */}

                                <h1
                                    className="
                                        max-w-2xl
                                        text-5xl
                                        font-black
                                        leading-[0.92]
                                        tracking-[-0.05em]
                                        xl:text-8xl
                                    "
                                >

                                    Ride
                                    <span className="text-[#E8FF3D]">
                                        .
                                    </span>

                                    <br />

                                    Your way.

                                </h1>


                                <p
                                    className="
                                        mt-7
                                        max-w-lg
                                        text-base
                                        leading-7
                                        text-slate-500
                                    "
                                >
                                    Pick up where you left off.
                                    Your rides, bookings and journeys
                                    are waiting for you.
                                </p>


                                {/* =================================================
                                    BIKE AREA
                                ================================================== */}

                                <div
                                    className="
                                        relative
                                        mt-6
                                        h-[250px]
                                        overflow-hidden
                                    "
                                >

                                    {/* Glow */}

                                    <div
                                        className="
                                            absolute
                                            bottom-5
                                            left-1/2
                                            h-28
                                            w-[75%]
                                            -translate-x-1/2
                                            rounded-full
                                            bg-[#E8FF3D]/[0.08]
                                            blur-[65px]
                                        "
                                    />


                                    {/* Road */}

                                    <div
                                        className="
                                            absolute
                                            bottom-[30px]
                                            left-[-5%]
                                            right-[-5%]
                                            h-px
                                            bg-gradient-to-r
                                            from-transparent
                                            via-[#E8FF3D]/50
                                            to-transparent
                                        "
                                    />


                                    {/* Road markings */}

                                    <div
                                        className="
                                            absolute
                                            bottom-[25px]
                                            left-[4%]
                                            right-[4%]
                                            flex
                                            justify-between
                                            opacity-40
                                        "
                                    >

                                        <span className="h-px w-12 bg-[#E8FF3D]" />
                                        <span className="h-px w-20 bg-[#E8FF3D]" />
                                        <span className="h-px w-8 bg-[#E8FF3D]" />
                                        <span className="h-px w-16 bg-[#E8FF3D]" />
                                        <span className="h-px w-12 bg-[#E8FF3D]" />

                                    </div>


                                    {/* BIKE */}

                                    <div
                                        className="
                                            absolute
                                            bottom-[32px]
                                            left-1/2
                                            z-20
                                            w-[300px]
                                            -translate-x-1/2
                                            xl:w-[390px]
                                        "
                                    >

                                        <img
                                            src="/images/rideflow-bike.png"
                                            alt="RideFlow motorcycle"
                                            className="
                                                block
                                                h-auto
                                                w-full
                                                object-contain
                                                drop-shadow-[0_25px_35px_rgba(0,0,0,0.75)]
                                                drop-shadow-[0_0_25px_rgba(232,255,61,0.08)]
                                                transition-transform
                                                duration-500
                                                hover:scale-[1.04]
                                            "
                                        />

                                    </div>


                                    {/* Bike shadow */}

                                    <div
                                        className="
                                            absolute
                                            bottom-[14px]
                                            left-1/2
                                            z-10
                                            h-5
                                            w-[210px]
                                            -translate-x-1/2
                                            rounded-full
                                            bg-[#E8FF3D]/10
                                            blur-xl
                                        "
                                    />

                                </div>


                                {/* FEATURES */}

                                <div className="mt-2 grid grid-cols-3 gap-3">

                                    <div
                                        className="
                                            rounded-2xl
                                            border
                                            border-white/[0.06]
                                            bg-white/[0.025]
                                            p-4
                                        "
                                    >

                                        <p className="text-sm font-semibold">
                                            Simple
                                        </p>

                                        <p className="mt-1 text-[10px] text-slate-600">
                                            Easy booking
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            rounded-2xl
                                            border
                                            border-white/[0.06]
                                            bg-white/[0.025]
                                            p-4
                                        "
                                    >

                                        <p className="text-sm font-semibold">
                                            Secure
                                        </p>

                                        <p className="mt-1 text-[10px] text-slate-600">
                                            Built for trust
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            rounded-2xl
                                            border
                                            border-white/[0.06]
                                            bg-white/[0.025]
                                            p-4
                                        "
                                    >

                                        <p className="text-sm font-semibold">
                                            Connected
                                        </p>

                                        <p className="mt-1 text-[10px] text-slate-600">
                                            Better journeys
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            MOBILE HERO
                        ================================================== */}

                        <section
                            className="
                                relative
                                overflow-hidden
                                rounded-[2rem]
                                border
                                border-white/[0.06]
                                bg-[#0B0F13]
                                px-6
                                pb-2
                                pt-6
                                sm:rounded-[2.5rem]
                                sm:px-8
                                lg:hidden
                            "
                        >

                            {/* GRID */}

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    opacity-[0.03]
                                "
                                style={{
                                    backgroundImage:
                                        "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                                    backgroundSize: "45px 45px",
                                }}
                            />


                            {/* Glow */}

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-32
                                    -top-32
                                    h-80
                                    w-80
                                    rounded-full
                                    bg-[#E8FF3D]/[0.06]
                                    blur-[100px]
                                "
                            />


                            <div className="relative z-10">

                                {/* MOBILE BADGE */}

                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-[#E8FF3D]/20
                                        bg-[#E8FF3D]/[0.05]
                                        px-3
                                        py-1.5
                                    "
                                >

                                    <Sparkles
                                        size={12}
                                        className="text-[#E8FF3D]"
                                    />

                                    <span
                                        className="
                                            text-[8px]
                                            font-bold
                                            uppercase
                                            tracking-[0.22em]
                                            text-[#E8FF3D]
                                        "
                                    >
                                        Welcome back
                                    </span>

                                </div>


                                {/* MOBILE HEADING */}

                                <h1
                                    className="
                                        mt-5
                                        text-5xl
                                        font-black
                                        leading-[0.9]
                                        tracking-[-0.055em]
                                        sm:text-6xl
                                    "
                                >

                                    Ride
                                    <span className="text-[#E8FF3D]">
                                        .
                                    </span>

                                    <br />

                                    Your way.

                                </h1>


                                <p
                                    className="
                                        mt-4
                                        max-w-md
                                        text-sm
                                        leading-6
                                        text-slate-600
                                    "
                                >
                                    Pick up where you left off.
                                    Your journey is waiting.
                                </p>


                                {/* MOBILE BIKE */}

                                <div
                                    className="
                                        relative
                                        mt-2
                                        h-[150px]
                                        sm:h-[180px]
                                    "
                                >

                                    <div
                                        className="
                                            absolute
                                            bottom-3
                                            left-1/2
                                            h-14
                                            w-[70%]
                                            -translate-x-1/2
                                            rounded-full
                                            bg-[#E8FF3D]/[0.08]
                                            blur-2xl
                                        "
                                    />


                                    <div
                                        className="
                                            absolute
                                            bottom-5
                                            left-0
                                            right-0
                                            h-px
                                            bg-gradient-to-r
                                            from-transparent
                                            via-[#E8FF3D]/40
                                            to-transparent
                                        "
                                    />


                                    <img
                                        src="/images/rideflow-bike.png"
                                        alt="RideFlow motorcycle"
                                        className="
                                            absolute
                                            bottom-4
                                            left-1/2
                                            z-10
                                            w-[230px]
                                            -translate-x-1/2
                                            object-contain
                                            drop-shadow-[0_18px_25px_rgba(0,0,0,0.8)]
                                            sm:w-[280px]
                                        "
                                    />

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            LOGIN FORM
                        ================================================== */}

                        <section className="flex items-center">

                            <div className="w-full">


                                {/* HEADER */}

                                <div className="mb-6 sm:mb-7">

                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.3em]
                                            text-[#E8FF3D]
                                        "
                                    >
                                        Sign in
                                    </p>


                                    <h2
                                        className="
                                            mt-3
                                            text-4xl
                                            font-black
                                            tracking-[-0.04em]
                                            sm:text-5xl
                                        "
                                    >
                                        Welcome back.
                                    </h2>


                                    <p
                                        className="
                                            mt-3
                                            text-sm
                                            leading-6
                                            text-slate-600
                                        "
                                    >
                                        Sign in to continue your
                                        RideShare journey.
                                    </p>

                                </div>


                                {/* LOGIN CARD */}

                                <div
                                    className="
                                        rounded-[2rem]
                                        border
                                        border-white/[0.08]
                                        bg-[#0D1115]
                                        p-5
                                        shadow-2xl
                                        sm:p-8
                                    "
                                >

                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-5"
                                    >


                                        {/* EMAIL */}

                                        <div>

                                            <label
                                                htmlFor="email"
                                                className="
                                                    mb-2
                                                    block
                                                    text-[10px]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.18em]
                                                    text-slate-500
                                                "
                                            >
                                                Email address
                                            </label>


                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder="you@example.com"
                                                disabled={loading}
                                                className="
                                                    h-14
                                                    w-full
                                                    rounded-2xl
                                                    border
                                                    border-white/[0.08]
                                                    bg-[#11161B]
                                                    px-4
                                                    text-sm
                                                    text-white
                                                    outline-none
                                                    transition-all
                                                    placeholder:text-slate-700
                                                    hover:border-white/[0.14]
                                                    focus:border-[#E8FF3D]/50
                                                    focus:bg-[#151B20]
                                                    focus:ring-4
                                                    focus:ring-[#E8FF3D]/[0.08]
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-50
                                                "
                                            />

                                        </div>


                                        {/* PASSWORD */}

                                        <div>

                                            <div className="mb-2 flex items-center justify-between">

                                                <label
                                                    htmlFor="password"
                                                    className="
                                                        block
                                                        text-[10px]
                                                        font-bold
                                                        uppercase
                                                        tracking-[0.18em]
                                                        text-slate-500
                                                    "
                                                >
                                                    Password
                                                </label>

                                            </div>


                                            <div className="relative">

                                                <input
                                                    id="password"
                                                    name="password"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    autoComplete="current-password"
                                                    value={form.password}
                                                    onChange={handleChange}
                                                    placeholder="Enter your password"
                                                    disabled={loading}
                                                    className="
                                                        h-14
                                                        w-full
                                                        rounded-2xl
                                                        border
                                                        border-white/[0.08]
                                                        bg-[#11161B]
                                                        px-4
                                                        pr-14
                                                        text-sm
                                                        text-white
                                                        outline-none
                                                        transition-all
                                                        placeholder:text-slate-700
                                                        hover:border-white/[0.14]
                                                        focus:border-[#E8FF3D]/50
                                                        focus:bg-[#151B20]
                                                        focus:ring-4
                                                        focus:ring-[#E8FF3D]/[0.08]
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-50
                                                    "
                                                />


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            (previous) =>
                                                                !previous
                                                        )
                                                    }
                                                    disabled={loading}
                                                    aria-label={
                                                        showPassword
                                                            ? "Hide password"
                                                            : "Show password"
                                                    }
                                                    className="
                                                        absolute
                                                        right-2
                                                        top-1/2
                                                        -translate-y-1/2
                                                        rounded-xl
                                                        p-3
                                                        text-slate-600
                                                        transition
                                                        hover:bg-white/[0.04]
                                                        hover:text-[#E8FF3D]
                                                    "
                                                >

                                                    {showPassword ? (
                                                        <EyeOff size={18} />
                                                    ) : (
                                                        <Eye size={18} />
                                                    )}

                                                </button>

                                            </div>

                                        </div>


                                        {/* SECURITY */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                                rounded-xl
                                                border
                                                border-white/[0.05]
                                                bg-white/[0.02]
                                                px-3
                                                py-3
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-[#E8FF3D]/[0.07]
                                                "
                                            >

                                                <LockKeyhole
                                                    size={14}
                                                    className="text-[#E8FF3D]"
                                                />

                                            </div>


                                            <div>

                                                <p className="text-[11px] font-semibold text-slate-400">
                                                    Secure sign in
                                                </p>

                                                <p className="mt-0.5 text-[9px] text-slate-700">
                                                    Your account is protected.
                                                </p>

                                            </div>

                                        </div>


                                        {/* SUBMIT */}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="
                                                group
                                                relative
                                                flex
                                                h-14
                                                w-full
                                                items-center
                                                justify-center
                                                gap-2
                                                overflow-hidden
                                                rounded-2xl
                                                bg-[#E8FF3D]
                                                font-bold
                                                text-[#080B0E]
                                                shadow-[0_12px_40px_rgba(232,255,61,0.15)]
                                                transition-all
                                                duration-300
                                                hover:-translate-y-0.5
                                                hover:bg-[#F0FF70]
                                                hover:shadow-[0_18px_55px_rgba(232,255,61,0.25)]
                                                active:translate-y-0
                                                disabled:cursor-not-allowed
                                                disabled:opacity-60
                                            "
                                        >

                                            {!loading && (
                                                <span
                                                    className="
                                                        absolute
                                                        inset-y-0
                                                        -left-20
                                                        w-16
                                                        rotate-12
                                                        bg-white/50
                                                        blur-md
                                                        transition-all
                                                        duration-700
                                                        group-hover:left-[120%]
                                                    "
                                                />
                                            )}


                                            <span
                                                className="
                                                    relative
                                                    z-10
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                            >

                                                {loading ? (
                                                    <>

                                                        <span
                                                            className="
                                                                h-5
                                                                w-5
                                                                animate-spin
                                                                rounded-full
                                                                border-2
                                                                border-black/20
                                                                border-t-black
                                                            "
                                                        />

                                                        Signing in...

                                                    </>
                                                ) : (
                                                    <>

                                                        Sign in

                                                        <ArrowRight
                                                            size={18}
                                                            className="
                                                                transition-transform
                                                                duration-300
                                                                group-hover:translate-x-1
                                                            "
                                                        />

                                                    </>
                                                )}

                                            </span>

                                        </button>

                                    </form>


                                    {/* REGISTER */}

                                    <div
                                        className="
                                            mt-7
                                            border-t
                                            border-white/[0.06]
                                            pt-6
                                            text-center
                                        "
                                    >

                                        <p
                                            className="
                                                text-sm
                                                text-slate-600
                                            "
                                        >

                                            Don't have an account?

                                            <Link
                                                to="/register"
                                                className="
                                                    ml-1.5
                                                    font-semibold
                                                    text-[#E8FF3D]
                                                    transition
                                                    hover:text-[#F0FF70]
                                                "
                                            >
                                                Create one
                                            </Link>

                                        </p>

                                    </div>

                                </div>


                                {/* SECURITY FOOTER */}

                                <div
                                    className="
                                        mt-5
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        text-[9px]
                                        font-medium
                                        uppercase
                                        tracking-[0.15em]
                                        text-slate-700
                                        sm:mt-6
                                    "
                                >

                                    <ShieldCheck size={13} />

                                    Secure account access

                                </div>

                            </div>

                        </section>

                    </div>

                </main>

            </div>

        </div>
    );
};

export default Login;