import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/v1/";

const defaultAxios = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        Accept: "application/json",
    },
});

export const authAxios = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        Accept: "application/json",
    },
    timeout: 20000,
});

// Interceptors are not needed for adding the Authorization header
// since we rely on HttpOnly cookies which are sent automatically.

authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (!error.response || error.code === "ECONNABORTED") {
            return Promise.reject(error);
        }

        // if (error.response.status === 401) {
        //     if (typeof window !== "undefined") {
        //         localStorage.removeItem("access_cads");
        //     }
        // }

        return Promise.reject(error);
    },
);

export default defaultAxios;