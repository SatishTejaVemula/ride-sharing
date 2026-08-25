import api from "./axios";

export const createBooking = async (data) => {
    const response = await api.post(
        "/api/bookings",
        data
    );

    return response.data;
};

export const getBookingById = async (id) => {
    const response = await api.get(
        `/api/bookings/${id}`
    );

    return response.data;
};

export const getPassengerBookings = async (passengerId) => {
    const response = await api.get(
        `/api/bookings/passenger/${passengerId}`
    );

    return response.data;
};

export const getRideBookings = async (rideId) => {
    const response = await api.get(
        `/api/bookings/ride/${rideId}`
    );

    return response.data;
};

export const cancelBooking = async (id) => {
    const response = await api.put(
        `/api/bookings/${id}/cancel`
    );

    return response.data;
};