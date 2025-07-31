import axios from 'axios';
import Cookies from 'js-cookie';
// import { useRouter } from 'next/navigation';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,  // Ensure cookies are sent with requests
});

// Request Interceptor
axiosInstance.interceptors.request.use(async (config) => {
    // Set the locale dynamically from localStorage if available
    const locale = typeof window !== 'undefined' ? localStorage.getItem('locale') : 'ar';
    if (locale) {
        config.headers['locale'] = locale;
    }

    return config;
}, (error) => {
    // Return the error from request
    return Promise.reject(error);
});

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const locale = Cookies.get('NEXT_LOCALE') || 'ar';

        if (error.response?.status === 401) {
            // Remove tokens/cookies if you use them
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('auth-token');
            Cookies.remove('role');
            // Redirect to login page
            if (typeof window !== 'undefined') {
                // window.location.href = `${locale}/login`;
                window.location.href = `/ar/login`;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
