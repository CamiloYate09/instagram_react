import Axios from "axios";


const TOKEN_KEY = 'INSTAGRAM_TOKEN';


/**
 * Guardar el Token
 * @param token
 */
export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Leer el token
 */
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Eliminar el Token
 */

export function deleteToken() {
    localStorage.removeItem(TOKEN_KEY);
}


/**
 * Interceptar las llamadas en las peticiones
 */

export function initAxiosInterceptors() {
    Axios.interceptors.request.use(function (config) {
        const token = getToken();
        if (token) {
            console.log(token)
            config.headers.Authorization = `bearer ${token}`;
        }
        return config;
    });

    Axios.interceptors.response.use(
        function (response) {
            return response;

        },
        function (error) {
            if (error.response.status === 401) {
                deleteToken();
                window.location = '/login';
            } else {
                return Promise.reject(error);
            }
        }
    )


}






