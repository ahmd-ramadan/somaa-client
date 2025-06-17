import { IDecodedToken } from "@/interfaces";
import { jwtVerify } from "jose";

export const verifyRefreshToken = async (token: string) => {
    try {
        const { payload } : { payload: IDecodedToken } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_REFRESH_SECRET));
        return payload;
    } catch (error) {
        // console.error("JWT verification failed:", error);
        return null;
    }
}

export const verifyAccessToken = async (token: string) => {
    try {
        const { payload } : { payload: IDecodedToken } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_ACCESS_SECRET));
        return payload;
    } catch (error) {
        // console.error("JWT verification failed:", error);
        return null;
    }
}