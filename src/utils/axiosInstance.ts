import axios from 'axios';
// import Cookies from 'js-cookie';
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

// // Response Interceptor
// axiosInstance.interceptors.response.use((response) => {
//     // Log the response for every successful request
//     // console.log("response: ", response);

//     // If the response status is 403, handle accordingly
//     if (response?.status === 403) {
//         // Optionally, clear the cookies or token if needed
//         Cookies.remove('accessToken');
//         Cookies.remove('refreshToken');
//         Cookies.remove('role');
        
//         // Redirect to login page
//         useRouter().push('/login');
//     }
    
//     return response;
// }, (error) => {
//     // Check for 403 status and redirect to the login page
//     if (error.response?.status === 403) {
//         // Optionally, clear the cookies or token if needed
//         Cookies.remove('accessToken');
//         Cookies.remove('refreshToken');
        
//         // Redirect to login page
//         useRouter().push('/login');
//     }

//     // Log the error for debugging purposes
//     // console.error("Error response: ", error.response);

//     // Return the error so that it can be handled elsewhere as well
//     return Promise.reject(error);
// });

export default axiosInstance;
