import axios from "axios";

// Configuración base
const api = axios.create({
    baseURL: "https://checador.integranet.xyz/api/v1.2/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Token fijo o dinámico
const getToken = () => localStorage.getItem("api_token") || "4eab26591c630177e69d4b43540e98654c6189b182746dcd1f518b893b969ede";

// Interceptor opcional (token, logs, etc.)
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🔁 Métodos reutilizables

export const httpGet = (endpoint, params = {}) => {
    return api.get(endpoint, {
        params: {
            token: getToken(),
            ...params,
        },
    });
};

export const httpPost = (endpoint, data = {}, params = {}) => {
    return api.post(endpoint, data, {
        params: {
            token: getToken(),
            ...params,
        },
    });
};

export const httpPut = (endpoint, data = {}, params = {}) => {
    return api.put(endpoint, data, {
        params: {
            token: getToken(),
            ...params,
        },
    });
};

export const httpDelete = (endpoint, params = {}) => {
    return api.delete(endpoint, {
        params: {
            token: getToken(),
            ...params,
        },
    });
};

export default api;