// // import { ILoggedInUser } from "@/interfaces";
// // import { IAdminPermissions, UserRoleTypes } from "@/types";
// // import { postData } from "@/utils/apiService";
// // import { NextAuthOptions, User, Account } from "next-auth";
// // import GoogleProvider from "next-auth/providers/google";
// // import { getLocale } from "@/lib/getLocale";
// // import { cookies } from "next/headers";

// // declare module "next-auth" {
// //     interface Session {
// //         user: {
// //             email: string;
// //             name: string;
// //             role?: UserRoleTypes;
// //             userId?: string;
// //             permissions: IAdminPermissions[];
// //         };
// //     }
// //     interface User {
// //         role?: UserRoleTypes;
// //         userId?: string;
// //         permissions: IAdminPermissions[];
// //     }
// // }

// // declare module "next-auth/jwt" {
// //     interface JWT {
// //         role?: UserRoleTypes;
// //         userId?: string;
// //         permissions: IAdminPermissions[];
// //         redirectUrl?: string;
// //     }
// // }

// // export const authOptions: NextAuthOptions = {
// //     providers: [
// //         GoogleProvider({
// //             clientId: process.env.GOOGLE_CLIENT_ID as string,
// //             clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
// //         }),
// //     ],
// //     callbacks: {
        
// //         async signIn({ user, account }) {
// //             if (account?.provider === "google") {
// //                 const locale = getLocale();
// //                 try {
// //                     const response = await postData<ILoggedInUser>({
// //                         endpoint: '/auth/callback/google',
// //                         data: { email: user?.email, name: user?.name },
// //                     }) as { success: boolean, data: ILoggedInUser };

// //                     if (response?.success && response?.data) {
// //                         user.role = response?.data?.role;
// //                         user.userId = response?.data?.userId;
// //                         user.permissions = response?.data?.permissions;

// //                         const cookieStore = cookies();
// //                         cookieStore.set({
// //                             name: 'accessToken',
// //                             value: response?.data?.accessToken || "",
// //                             httpOnly: true,
// //                             secure: process.env.NODE_ENV === 'production',
// //                             path: '/',
// //                             maxAge: Number(process.env.ACCESS_TOKEN_EXPIRES_TIME_COOKIES)
// //                         });
// //                         cookieStore.set({
// //                             name: 'refreshToken',
// //                             value: response?.data?.token, //! refreshToken
// //                             httpOnly: true,
// //                             secure: process.env.NODE_ENV === 'production',
// //                             path: '/',
// //                             maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_TIME_COOKIES )
// //                         });

// //                         //! Redirect Based On role
// //                         switch (user.role) {
// //                             case 'admin':
// //                             case 'super_admin':
// //                                 return `/${locale}/admin/profile`;
// //                             case 'vendor':
// //                                 return `/${locale}/vendor/profile`;
// //                             default:
// //                                 return `/${locale}`;
// //                         }
// //                     }
// //                     return false; // Google sign-in failed
// //                 } catch (error) {
// //                     console.error("Google sign-in error:", error);
// //                     return `/${locale}/login`;
// //                 }
// //             }
// //             const locale = getLocale();
// //             return `/${locale}`;
// //         },
// //         async jwt({ token, user }) {
// //             if (user) {
// //                 token.role = user?.role;
// //                 token.userId = user?.userId;
// //                 token.permissions = user?.permissions;
// //             }
// //             return token;
// //         },
// //         async session({ session, token }) {
// //             if (session.user) {
// //                 session.user.role = token?.role;
// //                 session.user.userId = token?.userId;
// //                 session.user.permissions = token?.permissions;
// //             }
// //             return session;
// //         },
// //     },
// //     session: {
// //         strategy: "database",
// //     },
// // };


// import { IDecodedToken, ILoggedInUser } from "@/interfaces";
// import { postData } from "@/utils/apiService";
// import { getLocalizedMessage } from "@/utils/getLocalizedMessage";
// import NextAuth, { AuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { cookies } from "next/headers";
// import { verifyRefreshToken } from "@/utils/auth";

// export const authOptions: AuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account }) {
//       try {
//         const locale = await getLocale() || "ar";
//         if (!user.email || !account?.provider) {
//           throw new Error("Missing user email or provider");
//         }
        
//         const response = await postData<ILoggedInUser>({
//             endpoint: '/auth/callback/google',
//             data: { email: user?.email, name: user?.name },
//         }) as { success: boolean, msgEn: string, msgAr: string, data: ILoggedInUser };

//         if (response?.success && response?.data) {
//             (user as any).role = response?.data?.role;
//             (user as any).userId = response?.data?.userId;
//             (user as any).permissions = response?.data?.permissions;

//             const cookieStore = cookies();
//             cookieStore.set({
//                 name: 'accessToken',
//                 value: response?.data?.accessToken || "",
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production',
//                 path: '/',
//                 maxAge: Number(process.env.ACCESS_TOKEN_EXPIRES_TIME_COOKIES)
//             });
//             cookieStore.set({
//                 name: 'refreshToken',
//                 value: response?.data?.token, //! refreshToken
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production',
//                 path: '/',
//                 maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_TIME_COOKIES )
//             });
//             return true;
//         }
//         return `/login/error?message=${getLocalizedMessage({ locale, msgEn: response?.msgEn, msgAr: response?.msgAr, msg: "فشلت عملية تسجيل الدخول"})}`;
//       } catch (error: any) {
//         return `/login/error?message=${encodeURIComponent(error.message)}`;
//       }
//     },
//     async redirect({ url, baseUrl }) {
//       const cookieStore = cookies();
//       const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
//       const refreshToken = cookieStore.get("refreshToken")?.value || "";
//       const lastVisitedPage = cookieStore.get("lastVisitedPage")?.value || "";
    
//       let role = null;
//       if (refreshToken) {
//         try {
//           const decoded: IDecodedToken | null = await verifyRefreshToken(refreshToken);
//           role = decoded?.role;
//         } catch (error) {
//           console.error("Failed to verify refresh token:", error);
//         }
//       }
    
//       if (!role) return `${baseUrl}/${locale}/login`;
    
//       if (role === "admin" || role === "super-admin") {
//         return `${baseUrl}/${locale}/admin`;
//       } else if (role === "vendor") {
//         return `${baseUrl}/${locale}/vendor`;
//       }
    
//       return lastVisitedPage ? `${baseUrl}/${lastVisitedPage}` : `${baseUrl}/${locale}`;
//     }
    
//   },
//   pages: {
//     signIn: "/login",
//     error: "/login/error",
//   },
// };

// const getLocale = async () => {
//   const cookieStore = cookies();
//   const locale = cookieStore.get('NEXT_LOCALE')?.value;
//   return locale;
// }

// const getUserRole = async () => {
//   const cookieStore = cookies();
//   const refreshToken = cookieStore.get('refreshToken')?.value || "";
//   const decoded: IDecodedToken | null = await verifyRefreshToken(refreshToken);
//   if (decoded) return decoded?.role;
//   else return null;
// }

// const getLastVisitedPage = async () => {
//   const cookieStore = cookies();
//   const lastVisitedPage = cookieStore.get('lastVistedPage')?.value;
//   return lastVisitedPage;
// }

// export default NextAuth(authOptions);