"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface INextAuthProviderProps {
    children: ReactNode;
}

const NextAuthProvider = ({ children }: INextAuthProviderProps) => {
    return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthProvider;