export interface ErrorResponse {
    success: boolean;
    // msgEn: string;
    // msgAr: string;
    message: string;
    cause: number;
}

export const handleError = (error: any): ErrorResponse => {
    // console.log(error);

    const defaultError: ErrorResponse = { 
        success: false,
        // msgEn: 'An unexpected error occurred.', 
        // msgAr: 'لقد حدث خطأ',
        message: "لقد حدث خطأ",
        cause: 500
    };

    if (error.response) {
        // Server responded with an error
        const { message } = error.response.data;

        return {
            success: false,
            message,
            cause: error.response.status // Optional: include status code
        };
    } 
    // else if (error.request) {
    //     // Request was made but no response received
    //     console.error('Error request:', error.request);
    // } else {
    //     // Error in setting up the request
    //     console.error('Error message:', error.message);
    // }

    return defaultError;
};
