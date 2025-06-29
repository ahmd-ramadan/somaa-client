'use client';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputsPassForm } from '@/data';
import { IInputPassForm } from '@/interfaces';
import { useLocale, useTranslations } from 'next-intl';
import FormatErrorMessage from '@/components/ui/FormatErrormessage';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import EyeOnIcon from '@/components/icons/EyeOn';
import EyeOffIcon from '@/components/icons/EyeOff';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateUserPassword } from '@/lib/features/user/userThunks';
import { getLocalizedMessage } from '@/utils/getLocalizedMessage';
import { handleError } from '@/utils/errorUtils';
import { UpdatePassSchema } from '@/validations/UpdatePassSchema';
import { useRouter } from 'next/navigation';
import { RootState } from '@/lib/store';
import Spinner from '../ui/Spinner';
import LockIcon from '../icons/Lock';

interface IPassFormInputs {
    newPassword: string;
    confirmedPassword: string;
    oldPassword: string;
}

type PassTypes = keyof IPassFormInputs;

const ProfilePasswordSection = () => {
    const t = useTranslations('ProfilePage');
    const locale = useLocale();
    const router = useRouter();

    const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);

    const [isOpenPassModal, setIsOpenPassModal] = useState(false);
    const [showPassword, setShowPassword] = useState<{
        newPassword: boolean;
        oldPassword: boolean;
        confirmedPassword: boolean;
    }>({
        newPassword: false,
        oldPassword: false,
        confirmedPassword: false
    });

    const dispatch = useAppDispatch();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<IPassFormInputs>({
        resolver: yupResolver(UpdatePassSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmedPassword: ""
        }
    });

    const onPassSubmit = async (data: IPassFormInputs) => {
        try {
            const formData = {
                currentPassword: data.oldPassword,
                newPassword: data.newPassword 
            }
            const action = await dispatch(updateUserPassword({ token: token as string, data: formData }));
            const { success, message } = action.payload as any;
            if (success) {
                toast.success(message ||  'تم تحديث كلمة المرور بنجاح');
                router.push(`/${locale}/login`);
            } else {
                toast.error(message || 'فشل في تحديث كلمة المرور');
            }
        } catch (error) {
            const { message } = handleError(error); 
            toast.error(message ||  'فشل في تحديث كلمة المرور');
        }
    };

    const closePassModal = () => setIsOpenPassModal(false);
    const handleUpdatePassword = () => setIsOpenPassModal(true);

    const handleTogglePassword = (name: string) => () => {
        // event.preventDefault(); // Prevent default action of the button
        setShowPassword((prev) => ({
            ...prev,
            [name]: !prev[name as PassTypes],
        }));
    };

    const renderFormFields = InputsPassForm.map(({ name, label, type, id }: IInputPassForm) => (
        <div key={id} className={`col-span-3`}>
            <label htmlFor={id} className="block text-base font-medium text-gray-700">
                {t(label)}
            </label>
            <div className="relative">
                <Controller
                    name={name as PassTypes}
                    control={control}
                    render={({ field }) => (
                        <input
                            id={id}
                            type={type === 'password' ? (showPassword[name as PassTypes] ? 'text' : 'password') : type}
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
            {errors[name as PassTypes] && <FormatErrorMessage message={errors[name as PassTypes]?.message as string} field={t(label)} />}
        </div>
    ));

    return (
        <div className="rounded-md p-5 w-full border-gray-300 bg-white shadow-lg">
            <h2 className="mb-2 font-semibold">{t('passwordTitle')}</h2>
            <hr />
            <div className="mt-8 bg-white">
                <div className='flex items-center gap-1 mb-2'>
                    <LockIcon width='20px' height='20px' />
                    <h2 className="text-base font-medium text-gray-800">{t('password')}</h2>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-5">
                    <input
                        type="password"
                        readOnly
                        value={"*".repeat(8)}
                        className="p-2 h-10 w-full border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition duration-200"
                    />
                    <button
                        onClick={handleUpdatePassword}
                        className="p-2 h-10 w-full border border-primary bg-primary text-white rounded-md text-sm font-medium transition-colors duration-300 hover:bg-transparent hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        {t('updatePassBtn')}
                    </button>
                </div>
            </div>
            <Modal isOpen={isOpenPassModal} closeModal={closePassModal} title={t('passModalTitle')}>
                <form onSubmit={handleSubmit(onPassSubmit)} className="flex flex-col w-full gap-5">
                    {renderFormFields}
                    <div className="w-full">
                        <button
                            type="submit"
                            disabled={isSubmitting || !isDirty}
                            className="flex justify-center w-full p-2 shrink-0 rounded-md border border-primary bg-primary text-sm font-medium text-white transition hover:bg-transparent hover:text-primary focus:outline-none focus:ring active:text-blue-500"
                        >
                            { isSubmitting ? 
                                <div className="flex items-center gap-2">
                                    <p>{t("saveBtnLoad")}</p>
                                    <Spinner />
                                </div> : 
                                t('saveBtn')
                            }
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default ProfilePasswordSection;
