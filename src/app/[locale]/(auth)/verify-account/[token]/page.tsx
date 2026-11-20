'use client'

import CheckedIcon from "@/components/icons/Checked";
import CloseIcon from "@/components/icons/Close";
import Spinner from "@/components/ui/Spinner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { verifyAccount } from "@/lib/features/auth/authThunks";
import Loading from "@/components/ui/Loading";

interface IVerifyAccountProps {
    params: {
        token: string;
    }
}

const VerifyAccountPage = ({ params: { token }}: IVerifyAccountProps) => {
    const locale = useLocale();
    const t = useTranslations("ActivationAccountPage");

    const { verifyAccountStatus } = useAppSelector((state: RootState) => state.authUser); 

    const dispatch = useAppDispatch();
    const [reqMsg, setReqMsg] = useState<string>("");
    useEffect( () => {
        const verifyAccountFun = async() => {
            const action = await dispatch(verifyAccount(token));
            const { message, success } = action.payload as any;
            if (success) {
                setReqMsg(message || t("successH"));
            } else {
                setReqMsg(message || t("failedH"));
            }
        }
        if (token) verifyAccountFun();
    }, [token, dispatch, locale, t])

    if(verifyAccountStatus === 'idle' || verifyAccountStatus === 'loading') {
        return <Loading />;
    }

    if(verifyAccountStatus === 'failed') {
        return (
            <div className="h-screen flex flex-col justify-center bg-red-200">
                <section className="bg-white w-3/4 md:w-1/2 mx-auto rounded-3xl shadow-2xl p-8 text-center sm:p-12">
                    <div className="relative h-10 w-20 lg:h-20 lg:w-40 mx-auto">
                        <Image 
                            src="/logo.svg"
                            alt="Somaa Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="mt-8 flex items-center flex-col gap-4">
                        
                        <CloseIcon width="100px" height="100px" color="#dc2626"/>
                        
                        <h2 className="text-3xl font-bold">{reqMsg}</h2>

                        <Link
                            className="mt-8 inline-block md:w-1/2 w-full rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl"
                            href={`/${locale}`}
                        >
                            {t('failedBtn')}
                        </Link>
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col justify-center bg-primary bg-opacity-30">
            <section className="bg-white w-3/4 md:w-1/2 mx-auto rounded-3xl shadow-2xl p-8 text-center sm:p-12">
                <div className="relative h-10 w-20 lg:h-20 lg:w-40 mx-auto">
                    <Image 
                        src="/logo.svg"
                        alt="Somaa Logo"
                        objectFit="cover"
                        layout="fill"
                    />
                </div>
                <div className="mt-8 flex flex-col items-center gap-4">
                    {/* <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Your Account Verfiy Successfully
                    </p> */}
                    {/* Thanks for your register, you are Welcome! */}
                    
                    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary">
                        <CheckedIcon width="50px" height="50px" color="#fff"/>
                    </div>
                    <h2 className="text-3xl font-bold">{reqMsg}</h2>

                    <Link
                        className="mt-8 inline-block md:w-1/2 w-full rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl"
                        href={`/${locale}/login`}
                    >
                        {t("successBtn")}
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default VerifyAccountPage;