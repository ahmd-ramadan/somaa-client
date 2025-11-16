import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateAdminPermissions } from '@/lib/features/admin/adminThunks';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { IAdmin } from '@/interfaces';
import { getLocalizedMessage } from '@/utils/getLocalizedMessage';
import { handleError } from '@/utils/errorUtils';
import { AdminPermissionsOptions } from './AddAdmin';
import Spinner from '@/components/ui/Spinner';
import { RootState } from '@/lib/store';
import { IAdminPermissions } from '@/types';

const permissionsSchema = yup.object().shape({
    permissions: yup.array().of(yup.string()).min(1, 'At least one permission is required').required('Permissions are required'),
});

interface IFormInputs {
    permissions: IAdminPermissions[];
}

interface IUpdatePermissionsProps {
    admin: IAdmin
}

const UpdatePermissions = ({ admin }: IUpdatePermissionsProps) => {
    const t = useTranslations("AdminsPage");
    const locale = useLocale();
    const dispatch = useAppDispatch();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<IFormInputs>({
        resolver: yupResolver(permissionsSchema) as any,
        defaultValues: { permissions: admin.permissions }
    });


    const { updateAdminPerStatus } = useAppSelector((state: RootState) => state.admins);
    const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);

    const onSubmit = async (data: IFormInputs) => {
        try {
            // Dispatch the action to update permissions
            const formData = { adminId: admin._id, permissions: data.permissions }
            const action = await dispatch(updateAdminPermissions({token: token as string, data: formData }));
            const { success, message } = action.payload as any;
            if (success) {
                toast.success(message || "Admin updated successfully");
            } else {
                toast.error(message || 'Operation failed');
            }
        } catch (error) {
            const { message } = handleError(error);
            toast.error(message || 'Error updating permissions');
        }
    };

    return (
        <section className="bg-white">
            <main className="flex items-center justify-center">
                <div className="w-full ">
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                        <fieldset>
                            <legend className="block text-lg font-medium text-gray-700">
                                {t('permissions')}
                            </legend>
                            {AdminPermissionsOptions.map((option) => (
                                <div key={option} className="flex items-center mt-2 gap-2">
                                    <Controller
                                        name="permissions"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="checkbox"
                                                value={option}
                                                checked={field.value.includes(option)}
                                                onChange={(e) => {
                                                    const { value, checked } = e.target;
                                                    const newPermissions = checked
                                                        ? [...field.value, value]
                                                        : field.value.filter(v => v !== value);
                                                    field.onChange(newPermissions);
                                                }}
                                                className="text-lg"
                                            />
                                        )}
                                    />
                                    <label className="text-lg text-gray-700">
                                        {t(option)}
                                    </label>
                                </div>
                            ))}
                            {errors.permissions && (
                                <p className="text-red-500 text-sm">{errors.permissions.message}</p>
                            )}
                        </fieldset>
                        <div className="w-1/2 mx-auto mt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-block w-full rounded-md border border-primary bg-primary p-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-primary focus:outline-none focus:ring"
                            >
                                { updateAdminPerStatus === 'loading' ? 
                                    (
                                        <div className="flex items-center w-fit mx-auto gap-2">
                                            <p>{t("updatePerBtnLoad")}</p>
                                            <Spinner />
                                        </div>
                                    ) :
                                    t("updatePerBtn")
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </section>
    );
};

export default UpdatePermissions;
