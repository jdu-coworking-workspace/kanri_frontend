import fetcher from "@/utils/fetcher";

// 1. Yangi foydalanuvchi yaratish (POST)
export const createUser = async (userData) => {
    return fetcher(
        "/users", {
            method: "POST",
            body: JSON.stringify(userData),
        }, {}, // params (agar parametr bo'lmasa bo'sh object)
        true // auth (Token yuborilishi kerak bo'lsa true)
    );
};

// 2. Foydalanuvchi ma'lumotlarini yangilash (PUT)
export const updateUser = async (userId, updateData) => {
    return fetcher(
        `/users/${userId}`, {
            method: "PUT",
            body: JSON.stringify(updateData),
        }, {},
        true
    );
};

// 3. Foydalanuvchini o'chirish (DELETE)
export const deleteUser = async (userId) => {
    return fetcher(
        `/users/${userId}`, {
            method: "DELETE",
        }, {},
        true
    );
};

// usage for inside components
// import { createUser } from "../api/userApi";
// try catch const newUser = await createUser(formData);