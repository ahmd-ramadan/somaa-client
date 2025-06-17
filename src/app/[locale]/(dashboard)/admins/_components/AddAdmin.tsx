import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import FormatErrorMessage from "@/components/ui/FormatErrormessage";
import { addAdmin } from "@/lib/features/admin/adminThunks";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { handleError } from "@/utils/errorUtils";
import { useTranslations } from "next-intl";
import { InputsAdminSignUpForm } from "@/data";
import { IAdminPermissions } from "@/types";
import { RootState } from "@/lib/store";
import Spinner from "@/components/ui/Spinner";
import { AdminSignUpSchema } from "@/validations/AdminsSchemas";

interface IFormInputs {
    name: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string;
    permissions: IAdminPermissions[];
}

interface IReqData {
    name: string;
    email: string;
    phone?: string;
    password: string;
    permissions: IAdminPermissions[];
}

export const AdminPermissionsOptions: IAdminPermissions[] = [
    'manage_analysis',
    'manage_news'
]

const AddAdmin = () => {
    const t = useTranslations("AdminsPage");
    const dispatch = useAppDispatch();

    const { addAdminStatus } = useAppSelector((state: RootState) => state.admins);
    const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<IFormInputs>({
        resolver: yupResolver(AdminSignUpSchema) as any,
        defaultValues: {
            permissions: []
        }
    });

    const onSubmit = async (data: IFormInputs) => {
        try {
            let formData: IReqData = {
                name: data.name,
                email: data.email,
                password: data.password,
                permissions: data.permissions
            };
            if (data?.phone) formData.phone = data.phone;
            console.log(formData)
            const action = await dispatch(addAdmin({ token: token as string, data: formData }));
            const { success, message } = action.payload as any;
            if (success) {
                toast.success(message || 'تمت إضافة الأدمن بنجاح');
            } else {
                toast.error(message || 'فشل في إضافة الأدمن');
            }
        } catch (error) {
            const { message } = handleError(error);
            toast.error(message || 'فشل في إضافة الأدمن');
        }
    };

    const giveColSpan = (name: string): string => {
        return ["email", "phone"].includes(name) ? "sm:col-span-2" : "col-span-1";
    };

    const renderInputsSignUpForm = InputsAdminSignUpForm.map((input) => {
        const { label, name, type } = input;
        return (
            <div key={name} className={`${giveColSpan(name)}`}>
                <label className="block text-sm font-medium text-gray-700">
                    {t(label)}
                </label>
                <input
                    type={type}
                    {...register(name)}
                    className={`bg-white px-3 py-1 mt-1 w-full rounded-md border border-gray-300 dark:border-white text-md text-gray-700 shadow-sm`}
                />
                {errors[name] && <FormatErrorMessage message={errors[name].message as string} field={t(label)} />}
            </div>
        );
    });

    return (
        <section className="bg-white">
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-2">
                
                <div className="w-full grid lg:grid-cols-2 gap-4">
                    {renderInputsSignUpForm}
                </div>
                
                <div className="w-full">
                    <fieldset>
                        <legend className="block text-lg font-medium text-gray-700">
                            {t('permissions')}
                        </legend>
                        {AdminPermissionsOptions.map((option) => (
                            <div key={option} className="flex items-center gap-2 text-lg mt-2">
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
                                            className={`${field.value.includes(option) ? 'font-semibold text-adminPrimary' : ''}`}
                                        />
                                    )}
                                />
                                <label className="text-sm text-gray-700">
                                    {t(option)}
                                </label>
                            </div>
                        ))}
                        {errors.permissions&& <FormatErrorMessage message={errors.permissions.message as string} field={t('permissions')} />}
                    </fieldset>
                </div>

                <div className="w-1/2 mx-auto">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-md w-full border font-semibold text-white bg-adminPrimary p-3 px-6"
                    >
                        { addAdminStatus === 'loading' ? 
                        (
                            <div className="flex items-center w-fit mx-auto gap-2">
                                <p>{t("addAdminBtnLoad")}</p>
                                <Spinner />
                            </div>
                        ) :
                            t("addAdminBtn")
                    }
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AddAdmin;
