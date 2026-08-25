import api from "./axios";

export const getMyProfile = async () => {
    const response = await api.get("/api/users/profile");
    return response.data;
};

export const getUserProfile = async (authUserId) => {
    const response = await api.get(
        `/api/users/profile/${authUserId}`
    );

    return response.data;
};

export const createProfile = async (data) => {
    const response = await api.post(
        "/api/users/profile",
        data
    );

    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.put(
        "/api/users/profile",
        data
    );

    return response.data;
};