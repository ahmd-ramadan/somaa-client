'use client';

import { InputsSignUpForm } from "@/data";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FormatErrorMessage from "@/components/ui/FormatErrormessage";
import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { signUp } from "@/lib/features/auth/authThunks";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";
import EyeOffIcon from "@/components/icons/EyeOff";
import EyeOnIcon from "@/components/icons/EyeOn";
import { SignUpSchema } from "@/validations/AuthSchemas";
import CheckedIcon from "@/components/icons/Checked";
import LockIcon from "@/components/icons/Lock";
import FullProfileIcon from "@/components/icons/FullProfile";
import PhoneIcon from "@/components/icons/phone";
import EmailFormIcon from "@/components/icons/EmailForm";
import { ApiResponse } from "@/utils/apiService";
import { Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '@/cssModules/phoneInput.module.css';

interface IFormInputs {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

interface IReqForm {
    name: string;
    email: string;
    phone: string;
    password: string;
}

const SignUpForm = () => {
    const t = useTranslations("AuthForms");
    const locale = useLocale();
    const router = useRouter();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<IFormInputs>({
        resolver: yupResolver(SignUpSchema),
    });

    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(false);
    const [registerationSuccess, setRegisterationSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string>("");

    const onSubmit = async (data: IFormInputs) => {
        // console.log(data.phone)
        let newData: IReqForm = {
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone
        }
        try {
            setIsLoading(true);
            const action = await dispatch(signUp(newData));
            const { success, message } = action.payload as ApiResponse<any>;
            if(success) {
                setRegisterationSuccess(true);
                setSuccessMsg(message || " تم إنشاء الحساب بنجاح ... برجاء التحقق من بريدك الإلكتروني لتفعيل الحساب خلال يوم علي الأكثر")
            } else {
                toast.error(message || "فشل في إنشاء الحساب");
            }
        }  catch (err) {
            // console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const FormIcons = {
        name: <FullProfileIcon width="20px" height="20px"/>,
        email: <EmailFormIcon width="20px" height="20px"/>,
        phone: <PhoneIcon width="20px" height="20px" color="var(--color-primary)"/>,
        password: <LockIcon width="20px" height="20px"/>,
        confirmPassword: <LockIcon width="20px" height="20px" />,
    }

    const renderInputsSignUpForm = InputsSignUpForm.map((input) => {
        const { label, name, type, id } = input;
        return (
            id === 'Phone' ? (
                <Controller
                    key={name}
                    name="phone"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <div className="col-span-2">
                            <div className="relative flex gap-2 items-center bg-white py-2 px-3 mt-1 w-full rounded-md border border-gray-300 text-sm text-gray-700 shadow-sm">
                                <PhoneInput
                                    {...field}
                                    defaultCountry="SA"
                                    international
                                    countryCallingCodeEditable={false}
                                    className="w-full"
                                    placeholder="Enter phone number"
                                />
                            </div>
                            {errors['phone'] && (
                                <FormatErrorMessage message={errors['phone'].message as string} field={t('phone')} />
                            )}
                        </div>
                    )}
                />
            ) : (    
                <div key={name} className="col-span-2">
                    <div
                        className={`relative flex gap-2 items-center bg-white py-2 px-3 mt-1 w-full rounded-md border border-gray-300 text-sm text-gray-700 shadow-sm`}
                    >
                        { FormIcons[name] || null }
                        <input
                            type={type === 'password' && (name === 'password' && showPassword) || (name === 'confirmPassword' && showConfirmPassword) ? 'text' : type}
                            {...register(name)}
                            placeholder={t(label)}
                            autoComplete={name === 'email' ? 'new-email' : name === 'password' ? 'new-password' : ''}
                            className={`flex-1 focus:outline-none w-full`}
                        />
                        
                        {   type === 'password' && (
                            <button
                                type="button"
                                className={`absolute inset-y-0 flex items-center ${locale === 'en' ? 'right-0 pr-3' : 'left-0 pl-3'}`}
                                onClick={() => (name === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword))}
                            >
                                {name === 'password' ? (showPassword ? <EyeOnIcon width="20px" height="20px"/> : <EyeOffIcon width="20px" height="20px" />) : (showConfirmPassword ? <EyeOnIcon width="20px" height="20px" /> : <EyeOffIcon width="20px" height="20px"/>)}
                            </button>
                        )}
                    </div>
                    {errors[name] && <FormatErrorMessage message={errors[name].message as string} field={t(label)} />}
                </div>
            )
    )});

    if (registerationSuccess === true) {
        return (
            <div className="mt-4 flex flex-col items-center gap-4">
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary">
                    <CheckedIcon width="50px" height="50px" color="#fff"/>
                </div>
                <h2 className="text-xl font-bold text-center">{successMsg}</h2>

                <Link
                    className="my-8 text-center md:w-1/2 w-full rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl"
                    href={`/${locale}/login`}
                >
                    {t("loginLink")}
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-4">
            <div>
                <p className={`text-primary p-2 ${ locale == 'ar' ? 'border-r-3' : 'border-l-3'} border-primary bg-primary/20 rounded-md`}>
                    {t("signUpFormMsg")}
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="grid grid-cols-2 gap-3">
                    {renderInputsSignUpForm}
                </div>
                <div className="mt-8 flex items-center gap-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`inline-block shrink-0 rounded-md border border-primary ${isLoading ? 'bg-transparent text-primary' : 'bg-primary text-white'} px-4 py-2 text-sm font-medium transition hover:bg-transparent hover:text-primary focus:outline-none focus:ring active:text-blue-500`}
                    >
                        { isLoading ? <div className="flex items-center gap-1"><span>{t("signUpSubmitBtnLoad")}</span><Spinner /></div> : t('signUpSubmitBtn') }
                    </button>
                    <p className="text-sm text-gray-500">
                        { t('loginMsg') }
                        <Link
                            href={`/${locale}/login`}
                            className="text-gray-700 underline font-semibold"> { t('loginLink') }
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;
