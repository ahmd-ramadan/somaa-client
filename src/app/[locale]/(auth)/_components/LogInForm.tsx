'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import EyeOffIcon from '@/components/icons/EyeOff';
import EyeOnIcon from '@/components/icons/EyeOn';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation';
import { LogInSchema } from '@/validations/AuthSchemas';
import { useAppDispatch } from '@/lib/hooks';
import { login } from '@/lib/features/auth/authThunks';
import FormatErrorMessage from '@/components/ui/FormatErrormessage';
import Spinner from '@/components/ui/Spinner';
import EmailFormIcon from '@/components/icons/EmailForm';
import LockIcon from '@/components/icons/Lock';
import { ApiResponse } from '@/utils/apiService';
import { ILoggedInUser } from '@/interfaces';

interface IFormInputs {
    email: string;
    password: string;
}

const LogInForm = () => {
    const t = useTranslations('LoginPage');
    const router = useRouter();
    const locale = useLocale();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { 
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<IFormInputs>({
        resolver: yupResolver(LogInSchema)
    })

    const dispatch = useAppDispatch();
    const onSubmit = async (data: IFormInputs) => {
        try {
            const action = await dispatch(login(data));
            const { success, message }  = action.payload as any;
            console.log(action.payload)
            if (success) {
                toast.success(message || "!مرحبا بعودتك");
                let path = 'dashboard';
                router.push(`/${locale}/${path}`);
            } else {
                toast.error(message || "فشل في تسجيل الدخول");
            }
        } catch (error) {
            // console.error("Login failed:", error);
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex justify-center">
                <p className="text-primary font-semibold">{t("pageHeader")}👋</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-primary mb-1"
                    >
                        {t('email')}
                    </label>
                    <div className={`flex items-center gap-2 w-full py-2 px-3 border border-gray-300 rounded-md ${errors.email ? 'border-red-500' : ''}`}>
                        <EmailFormIcon width="20px" height="20px"/>
                        <input
                            type="email"
                            { ...register('email') }
                            placeholder="you@example.com"
                            autoComplete='email'
                            className={`flex-1 focus:outline-none w-full text-primary`}
                        />
                    </div>
                    {errors.email && 
                        <FormatErrorMessage message={errors['email'].message as string} field={t('email')} />
                    }
                </div>

                <div className="mb-6 relative">
                    <label
                        className="block text-sm font-medium text-primary mb-1"
                    >
                        {t('password')}
                    </label>
                    <div className={`flex items-center gap-2 relative w-full py-2 px-3 border border-gray-300 rounded-md ${ errors.password ? 'border-red-500' : ''}`}>
                        <LockIcon width="20px" height="20px"/>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            placeholder="********"
                            autoComplete='current-password'
                            className={`focus:outline-none flex-1 w-full text-primary`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute inset-y-0 ${locale === 'ar' ? 'left-3' : 'right-3'} flex items-center text-gray-400`}
                        >
                            {showPassword ? (
                                <EyeOnIcon width="20px" height="20px" />
                            ) : (
                                <EyeOffIcon width="20px" height="20px" />
                            )}
                        </button>
                    </div>
                    { errors.password && 
                        <FormatErrorMessage message={errors['password'].message as string} field={t('pssword')} />
                    }
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center bg-primary text-white p-3 rounded-md opacity-80 hover:opacity-100 transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 
                        <div className="flex items-center gap-2">
                            <p>{t('submitBtnLoad')}</p>
                            <Spinner />
                        </div> 
                        : t('submitBtn')}
                </button>
            </form>

            <div className="my-4 text-semibold w-full flex items-center justify-between">
                <Link href={`/${locale}/forgot-password`} className="text-primary hover:underline">
                    {t('forgetPassMsg')}
                </Link>
                <Link 
                    href={`/${locale}/signup`}
                    className="text-secondary hover:underline"
                >
                    {t('signupMsg')}
                </Link>
            </div>
        </div>
    );
}

export default LogInForm;