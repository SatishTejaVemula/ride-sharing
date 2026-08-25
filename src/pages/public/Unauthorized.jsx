import { Link } from "react-router-dom";

const Unauthorized = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
            <div className="text-center">
                <p className="text-6xl font-black text-red-500">
                    403
                </p>

                <h1 className="mt-4 text-3xl font-bold">
                    Access denied
                </h1>

                <p className="mt-3 text-slate-400">
                    You don't have permission to access this page.
                </p>

                <Link
                    to="/"
                    className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;