import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Profile from "./pages/profile/Profile";

import CreateRide from "./pages/driver/CreateRide";
import MyRides from "./pages/driver/MyRides";
import DriverBookings from "./pages/driver/DriverBookings";
import EditRide from "./pages/driver/EditRide";
import DriverDashboard from "./pages/driver/DriverDashboard";
import DriverProfile from "./pages/driver/DriverProfile";
import DriverEarnings from "./pages/driver/DriverEarnings";

import FindRides from "./pages/passenger/FindRides";
import PassengerDashboard from "./pages/passenger/PassengerDashboard";
import BookRide from "./pages/passenger/BookRide";
import RideDetails from "./pages/passenger/RideDetails";
import MyBookings from "./pages/passenger/MyBookings";
import PassengerProfile from "./pages/passenger/PassengerProfile";

import Unauthorized from "./pages/public/Unauthorized";
import LandingPage from "./pages/public/LandingPage";

const App = () => {
    return (
        <Routes>

            {/* =================================================
                PUBLIC
            ================================================= */}

            <Route
                path="/"
                element={<LandingPage />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />

            {/* =================================================
                COMMON PROFILE
                Used for viewing another user

                Passenger -> Driver
                Driver -> Passenger
            ================================================= */}

            <Route
                path="/profile/:userId"
                element={<Profile />}
            />


            {/* =================================================
                PROTECTED
            ================================================= */}

            <Route element={<ProtectedRoute />}>

                {/* =================================================
                    DRIVER ROUTES
                ================================================= */}

                <Route
                    element={
                        <RoleRoute
                            allowedRoles={["DRIVER"]}
                        />
                    }
                >

                    <Route
                        path="/driver/dashboard"
                        element={<DriverDashboard />}
                    />

                    <Route
                        path="/driver/create-ride"
                        element={<CreateRide />}
                    />

                    <Route
                        path="/driver/rides"
                        element={<MyRides />}
                    />

                    <Route
                        path="/driver/rides/:id/edit"
                        element={<EditRide />}
                    />

                    <Route
                        path="/driver/bookings"
                        element={<DriverBookings />}
                    />

                    <Route
                        path="/driver/earnings"
                        element={<DriverEarnings />}
                    />

                    {/* Driver's OWN profile */}
                    <Route
                        path="/driver/profile"
                        element={<DriverProfile />}
                    />

                </Route>


                {/* =================================================
                    PASSENGER ROUTES
                ================================================= */}

                <Route
                    element={
                        <RoleRoute
                            allowedRoles={["PASSENGER"]}
                        />
                    }
                >

                    <Route
                        path="/passenger/dashboard"
                        element={<PassengerDashboard />}
                    />

                    <Route
                        path="/passenger/rides"
                        element={<FindRides />}
                    />

                    <Route
                        path="/passenger/rides/:id"
                        element={<RideDetails />}
                    />

                    <Route
                        path="/passenger/rides/:id/book"
                        element={<BookRide />}
                    />

                    <Route
                        path="/passenger/bookings"
                        element={<MyBookings />}
                    />

                    {/* Passenger's OWN profile */}
                    <Route
                        path="/passenger/profile"
                        element={<PassengerProfile />}
                    />

                </Route>

            </Route>


            {/* =================================================
                FALLBACK
            ================================================= */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>
    );
};

export default App;