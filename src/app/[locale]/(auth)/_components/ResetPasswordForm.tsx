'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import EyeOffIcon from '@/components/icons/EyeOff';
import EyeOnIcon from '@/components/icons/EyeOn';
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { ResetPasswordSchema } from '@/validations/AuthSchemas';
import FormatErrorMessage from '@/components/ui/FormatErrormessage';
import { checkCodeForResetPassword, resetPassword } from '@/lib/features/auth/authThunks';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import ResetPasswordIcon from '@/components/icons/ResetPassword';
import CheckedIcon from '@/components/icons/Checked';
import CloseIcon from '@/components/icons/Close';
import Loading from '@/components/ui/Loading';
import { ApiResponse } from '@/utils/apiService';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { handleError } from '@/utils/errorUtils';

interface IFormInputs {
    newPassword: string;
    confirmPassword: string;
}

const FormInputs = [
    { name: 'newPassword' },
    { name: 'confirmPassword' }
]

interface IResetPasswordProps {
    params: {
        code: string;
    }
}

type PassTypes = keyof IFormInputs;

const ResetPasswordForm= ({ params: { code } }: IResetPasswordProps) => {
    const t = useTranslations('ResetPasswordPage');
    const locale = useLocale();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState<{
        newPassword: boolean;
        confirmPassword: boolean;
    }>({
        newPassword: false,
        confirmPassword: false
    });

    const dispatch = useAppDispatch();
    const { checkCodeForResetPasswordStatus, resetPasswordStatus } = useAppSelector((state: RootState) => state.authUser);

    const [errorMsg, setErrorMsg] = useState<string>("");
    const [pageLoading, setPageLoading] = useState<boolean>(true);
    useEffect(() => {
        const checkValidCode = async () => {
            try {
                const action = await dispatch(checkCodeForResetPassword({ code }));
                const { message } = action.payload as any;
                setErrorMsg(message || "");
            } catch {}
            finally {
                setPageLoading(false);
            }
        }
        if (code &&  locale) checkValidCode();

    }, [code, dispatch, locale])

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch
    } = useForm<IFormInputs>({
        resolver: yupResolver(ResetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (data: IFormInputs) => {
        try {
            const formData = {
                password: data.newPassword,
                otp: code
            }
            const action = await dispatch(resetPassword(formData));
            const { success, message } = action.payload as ApiResponse<null>;

            if(success) {
                toast.success(message || 'تم تحديث الباسورد بنجاح')
                router.push(`/${locale}/login`)
            } else {
                toast.error(message || 'فشل عملية تحديث الباسورد')
            }
        } catch (error) {
            const { message } = handleError(error); 
            toast.error(message || 'Error updating password');
        }
    };

    const handleTogglePassword = (name: string) => () => {
        // event.preventDefault(); // Prevent default action of the button
        setShowPassword((prev) => ({
            ...prev,
            [name]: !prev[name as PassTypes],
        }));
    };

    const renderFormFields = FormInputs.map(({ name }, idx) => (
        <div key={idx} className={`col-span-3 mb-4`}>
            <label htmlFor={name} className="block text-base font-medium text-gray-700">
                {t(name)}
            </label>
            <div className="relative">
                <Controller
                    name={name as PassTypes}
                    control={control}
                    render={({ field }) => (
                        <input
                            id={name}
                            type={(showPassword[name as PassTypes] ? 'text' : 'password')}
                            {...field}
                            autoComplete="new-password"
                            className="mt-1 block p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                    )}
                />
                <button
                    type="button"
                    onClick={handleTogglePassword(name)}
                    className={`absolute inset-y-0 ${locale === 'ar' ? 'left-3' : 'right-3'} flex items-center text-gray-400`}
                >
                    {showPassword[name as PassTypes] ? (
                        <EyeOnIcon width="20px" height="20px" />
                    ) : (
                        <EyeOffIcon width="20px" height="20px" />
                    )}
                </button>
            </div>
            {errors[name as PassTypes] && <FormatErrorMessage message={errors[name as PassTypes]?.message as string} field={t(name)} />}
        </div>
    ));

    const newPass = watch('newPassword');
    const confirmPass = watch('confirmPassword');

    if (pageLoading) {
        return <Loading />
    }

    if (checkCodeForResetPasswordStatus === 'failed') { 
        return (
            <div className="h-screen flex flex-col justify-center bg-red-500 bg-opacity-30">
                <section className="bg-white w-3/4 md:w-1/2 mx-auto rounded-3xl shadow-2xl p-8 text-center sm:p-12">
                    <div className="relative h-20 w-64 mx-auto mb-2">
                        <Image 
                            src="/auth-image.png"
                            alt="OSUS Solutions Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="mt-8 flex items-center flex-col gap-4">
                        
                        <CloseIcon width="100px" height="100px" color="#dc2626"/>
                        <h2 className="text-3xl font-bold">{errorMsg}</h2>
                        <Link
                            className="mt-8 inline-block md:w-1/2 w-full rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl"
                            href={`/${locale}`}
                        >
                            {t('homePage')}
                        </Link>
                    </div>
                </section>
            </div>
        )
    }

    if (resetPasswordStatus === 'succeeded') {
        return (
            <div className="h-screen flex flex-col justify-center bg-primary bg-opacity-30">
                <section className="bg-white w-3/4 md:w-1/2 mx-auto rounded-3xl shadow-2xl p-8 text-center sm:p-12">
                    <div className="relative h-20 w-64 mx-auto mb-2">
                        <Image 
                            src="/auth-image.png"
                            alt="OSUS Solutions Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="mt-8 flex flex-col items-center gap-4">
                        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary">
                            <CheckedIcon width="50px" height="50px" color="#fff"/>
                        </div>
                        <h2 className="text-3xl font-bold">{t('successH')}</h2>

                        <Link
                            className="mt-8 inline-block md:w-1/2 w-full rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl"
                            href={`/${locale}/login`}
                        >
                            {t("loginPage")}
                        </Link>
                    </div>
                </section>
            </div>
        )
    }

    if (resetPasswordStatus === 'failed') {
        return (
            <div className="h-screen flex flex-col justify-center bg-red-300">
                <section className="bg-white w-3/4 md:w-1/3 mx-auto rounded-3xl shadow-2xl p-8 text-center sm:p-12">
                    <div className="relative h-20 w-64 mx-auto mb-2">
                        <Image 
                            src="/auth-image.png"
                            alt="OSUS Solutions Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="mt-8 flex items-center flex-col gap-4">
                        
                        <CloseIcon width="100px" height="100px" color="#dc2626"/>
                        <h2 className="text-3xl font-bold">{t('failedH')}</h2>
                        <Link
                            className="mt-8 inline-block md:w-1/2 w-full rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl"
                            href={`/${locale}`}
                        >
                            {t('homePage')}
                        </Link>
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50">
            {/* form */}
            <div className="w-3/4 md:w-1/3 px-4 py-4 md:px-8 rounded-lg shadow-lg bg-white ">
                {/* <div className="relative h-20 w-40 mx-auto">
                    <Image 
                        src={'/auth-image.png'}
                        alt="OSUS Solutions Logo"
                        objectFit="cover"
                        layout="fill"
                    />
                </div> */}

                <div className="flex flex-col gap items-center">
                    <ResetPasswordIcon width="150px" height="150px" />
                    <h2 className="text-2xl font-bold">{t("resetPass")}</h2>
                    <p className="lg:text-lg mt-4 text-gray-500">{t("resetPassMsg")}</p>
                </div>

                <div className="w-full md:mt-8 mt-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        { renderFormFields }
                        <button
                            type="submit"
                            disabled={isSubmitting || !newPass || !confirmPass || newPass !== confirmPass}
                            className="mt-4 w-full bg-primary text-white p-3 rounded-md transition-colors disabled:opacity-70"
                        >
                            {isSubmitting ? t('submitBtnLoad') : t('submitBtn')}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default ResetPasswordForm;