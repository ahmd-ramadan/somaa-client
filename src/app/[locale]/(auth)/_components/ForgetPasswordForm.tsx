'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { ForgetPasswordSchema } from '@/validations/AuthSchemas';
import FormatErrorMessage from '@/components/ui/FormatErrormessage';
import { forgetPassword } from '@/lib/features/auth/authThunks';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import EmailIcon from '@/components/icons/Email';
import Spinner from '@/components/ui/Spinner';
import EmailFormIcon from '@/components/icons/EmailForm';

interface IFormInputs {
    email: string;
}

const ForgetPasswordForm = () => {
    const t = useTranslations('ForgetPasswordPage');
    const locale = useLocale();

    const dispatch = useAppDispatch();
    const { forgetPasswordStatus } = useAppSelector((state: RootState) => state.authUser);
    const [next, setNext] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch
    } = useForm<IFormInputs>({
        resolver: yupResolver(ForgetPasswordSchema)
    })

    const onSubmit = async (data: IFormInputs) => {
        // console.log(data);
        try {
            const action = await dispatch(forgetPassword({ data: { email: data.email } }));
            const { success } = action.payload as any;
            if ( success ) localStorage.clear();
            setNext(true);
        } catch (error) {
            // console.error("Login failed:", error);
        }
    };

    const email = watch('email');

    if (next) {
        const noreplyEmail = process.env.NEXT_PUBLIC_NOREPLY_EMAIL;
        return (
            <div className="flex flex-col items-center gap-4">
                <EmailIcon width="150px" height="150px" color="#fff" />
                <div className="text-xsm font-semibold flex flex-col md:flex-row items-cneter md:gap-2">
                    <p>
                        {t('emailH')}:
                    </p>
                    <p className="text-primary">
                        {noreplyEmail}
                    </p>
                </div>
                <p className="text-2xl font-bold text-center">{t("emailMsg")}</p>
                <Link
                    className="flex items-center justify-center my-8 md:w-1/2 w-full rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl"
                    href={`/${locale}`}
                >
                    {t("homePage")}
                </Link>
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-4 mt-4'>
            <div className="flex flex-col gap items-center">
                {/* <ForgetPassIcon width="150px" height="150px" /> */}
                <h2 className="text-2xl font-bold text-primary">{t("forgetPass")}</h2>
                <p className="lg:text-lg mt-4 text-gray-500">{t("forgetPassMsg")}</p>
            </div>

            <div className="w-full">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={`w-full p-3 border border-gray-300 rounded-md ${errors.email ? 'border-red-500' : ''} mb-4 flex items-center gap-2`}>
                        {/* <label
                            className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                            {t('emailLabel')}
                        </label> */}
                        <EmailFormIcon width='20px' height='20px' />
                        <input
                            type="email"
                            {...register('email')}
                            placeholder="you@example.com"
                            className="flex-1 focus:outline-none w-full" 
                        />
                        {errors.email && (
                            <FormatErrorMessage message={errors.email?.message as string} field={t('email')} />
                        )}
                    </div>


                    <button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className="w-full flex justify-center bg-primary text-white p-3 rounded-md transition-colors disabled:opacity-70"
                    >
                        {isSubmitting ? <div className="flex items-center gap-1"><span>{t("submitBtnLoad")}</span><Spinner /></div> : t('submitBtn')}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default ForgetPasswordForm;
