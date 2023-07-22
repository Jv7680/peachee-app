const getUserId = () => {
    return +(localStorage.getItem("userID") || 0);
};

const setUserId = (userId: number) => {
    localStorage.setItem("userID", userId as unknown as string);
};

const getUserSetting = () => {
    return localStorage.getItem("userSetting");
};

const setUserSetting = (userSetting: string) => {
    localStorage.setItem("userSetting", userSetting);
};

const getToken = () => {
    return localStorage.getItem("token");
};

const setToken = (token: string) => {
    localStorage.setItem("token", token);
};

const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
};

const setRefreshToken = (refreshToken: string) => {
    localStorage.setItem("refreshToken", refreshToken);
};

const clear = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userID");
};

export const LocalStorage = {
    getUserId,
    setUserId,
    getUserSetting,
    setUserSetting,
    getToken,
    setToken,
    getRefreshToken,
    setRefreshToken,
    clear,
};