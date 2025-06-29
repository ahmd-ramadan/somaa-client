'use client';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputsInfoForm } from '@/data';
import { IInputsInfoForm, ILoggedInUser } from '@/interfaces';
import { useLocale, useTranslations } from 'next-intl';
import FormatErrorMessage from '@/components/ui/FormatErrormessage';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import { updateUserProfile } from '@/lib/features/user/userThunks';
import { getLocalizedMessage } from '@/utils/getLocalizedMessage';
import { handleError } from '@/utils/errorUtils';
import { ProfileInfoSchema } from '@/validations/ProfileInfoSchema';
import Spinner from '../ui/Spinner';
import FullProfileIcon from '../icons/FullProfile';
import EmailFormIcon from '../icons/EmailForm';
import PhoneIcon from '../icons/phone';


interface IInfoFormInputs {
    name: string;
    email: string;
    phone: string;
}

type InfoTypes = keyof IInfoFormInputs;

const ProfileGeneralInfoSection = () => {
    const t = useTranslations('ProfilePage');
    const locale = useLocale();

    const [profile, setProfile] = useState<ILoggedInUser>({} as ILoggedInUser);
    const dispatch = useAppDispatch();
    const { userProfile, userProfileStatus} = useAppSelector((state: RootState) => state.user);
    const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);
    

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
        reset
    } = useForm<IInfoFormInputs>({
        resolver: yupResolver(ProfileInfoSchema),
    });

    useEffect(() => {
        if (userProfileStatus === 'succeeded') {
            setProfile(userProfile);
            reset({ 
                name: userProfile.name,
                email: userProfile.email,
                phone: userProfile.phone
            });
        }
    }, [userProfile, userProfileStatus, reset]);

    const onInfoSubmit = async (data: IInfoFormInputs) => {
        try {
            const formData = {
                name: data.name,
                phone: data.phone
            }
            const action = await dispatch(updateUserProfile({ token: token as string, data: formData }));
            const { success, message } = action.payload as any;
            if (success) {
                toast.success(message ||  'تم تحديث البيانات بنجاح');
            } else {
                toast.error(message || 'فشل في تحديث البيانات');
            }
        } catch (error) {
            const { message } = handleError(error); 
            toast.error(message || 'فشل في تحديث البيانات');
        }
    };
    
    const ProfileIcons = {
        // name: <User className='h-7 w-7 text-primary fill-primary'/>,
        // email: <Mail className="h-6 w-6 fill-primary text-white" />,
        // phone: <Phone className='h-6 w-6 text-primary fill-primary'/>
        name: <FullProfileIcon width="20px" height="20px" />,
        email: <EmailFormIcon width='20px' height='20px' />,
        phone: <PhoneIcon width='20px' height='20px' color="var(--color-primary)"/>
    }
    const renderFormFields = InputsInfoForm.map(({ name, label, type, id }: IInputsInfoForm) => (
        <div key={id} className={`col-span-6`}>
            <div className='flex items-center gap-1'>
                { ProfileIcons[name] || null }
                <label htmlFor={id} className="text-base font-medium text-gray-700">
                    {t(label)}
                </label>
            </div>
            <div className="relative">
                <Controller
                    name={name as InfoTypes}
                    control={control}
                    render={({ field }) => (
                        <input
                            id={id}
                            type="text"
                            readOnly={ name === 'email'}
                            {...field}
                            autoComplete="new-password"
                            className="mt-1 block p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                    )}
                />
            </div>
            {errors[name as InfoTypes] && <FormatErrorMessage message={errors[name as InfoTypes]?.message as string} field={t(label)} />}
        </div>
    ));

    return (
        <div className="border-gray-300 bg-white shadow-lg rounded-md p-5 w-full">
            <h2 className="mb-2 font-semibold">{t('infoTitle')}</h2>
            <hr />
            <form onSubmit={handleSubmit(onInfoSubmit)} className="mt-8 grid grid-cols-6 gap-6">
                {renderFormFields}
                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                        className="w-full md:w-fit flex justify-center shrink-0 rounded-md border border-primary bg-primary px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-primary focus:outline-none focus:ring active:text-blue-500"
                    >
                        { isSubmitting ? 
                                <div className="flex items-center gap-2">
                                    <p>{t("updateBtnLoad")}</p>
                                    <Spinner />
                                </div> : 
                                t('updateBtn')
                            }
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProfileGeneralInfoSection;
