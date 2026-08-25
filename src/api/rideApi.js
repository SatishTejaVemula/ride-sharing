import api from "./axios";

export const createRide = async (data) => {
    const response = await api.post(
        "/api/rides",
        data
    );

    return response.data;
};

export const getAllRides = async () => {
    const response = await api.get(
        "/api/rides"
    );

    return response.data;
};

export const getRideById = async (id) => {
    const response = await api.get(
        `/api/rides/${id}`
    );

    return response.data;
};

export const getRidesByDriver = async (driverId) => {
    const response = await api.get(
        `/api/rides/driver/${driverId}`
    );

    return response.data;
};

export const getRidesByStatus = async (status) => {
    const response = await api.get(
        `/api/rides/status/${status}`
    );

    return response.data;
};

export const searchRides = async (
    pickupLocation,
    dropLocation
) => {
    const response = await api.get(
        "/api/rides/search",
        {
            params: {
                pickupLocation,
                dropLocation,
            },
        }
    );

    return response.data;
};

export const updateRide = async (id, data) => {
    const response = await api.put(
        `/api/rides/${id}`,
        data
    );

    return response.data;
};

export const deleteRide = async (id) => {
    const response = await api.delete(
        `/api/rides/${id}`
    );

    return response.data;
};

export const getDriverProfile = async (driverId) => {
    const response = await api.get(
        `/api/rides/driver-profile/${driverId}`
    );

    return response.data;
};