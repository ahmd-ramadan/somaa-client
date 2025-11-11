import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import FormatErrorMessage from "@/components/ui/FormatErrormessage";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { handleError } from "@/utils/errorUtils";
import { useTranslations } from "next-intl";
import { InputsUserSignUpForm } from "@/data";
import { UserPermissions } from "@/types";
import { RootState } from "@/lib/store";
import Spinner from "@/components/ui/Spinner";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { AddUserSchema } from "@/validations/UsersSchemas";
import { createNewUserRole } from "@/lib/features/user/userThunks";

interface IFormInputs {
    name: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string;
    role: 'user' | 'moderator' | 'monitor';
    permissions: UserPermissions[];
}

interface IReqData {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: 'user' | 'moderator' | 'monitor';
    permissions: UserPermissions[];
}

export const UserPermissionsOptions: UserPermissions[] = [
    'manage_analysis',
    'manage_news'
]

const AddUser = () => {
    const t = useTranslations("UsersPage");
    const dispatch = useAppDispatch();

    const { createNewUserRoleStatus } = useAppSelector((state: RootState) => state.user);
    const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<IFormInputs>({
        resolver: yupResolver(AddUserSchema) as any,
        defaultValues: {
            phone: '',
            permissions: [],
            role: 'user'
        }
    });

    const phone = useWatch({ control, name: 'phone' });
    console.log(phone)

    const onSubmit = async (data: IFormInputs) => {
        try {
            let formData: IReqData = {
                name: data.name,
                email: data.email,
                phone: data.phone || '',
                password: data.password,
                permissions: data.permissions,
                role: data.role
            };
            if (data?.phone) formData.phone = data.phone;
            console.log(formData)
            const action = await dispatch(createNewUserRole({ token: token as string, data: formData }));
            const { success, message } = action.payload as any;
            if (success) {
                toast.success(message || 'تمت إضافة المستخدم بنجاح');
            } else {
                toast.error(message || 'فشل في إضافة المستخدم');
            }
        } catch (error) {
            const { message } = handleError(error);
            toast.error(message || 'فشل في إضافة المستخدم');
        }
    };

    const giveColSpan = (name: string): string => {
        return ["email", "phone", "name", "role"].includes(name) ? "sm:col-span-2" : "col-span-1";
    };

    const role = useWatch({ control, name: 'role' });

    const renderInputsSignUpForm = InputsUserSignUpForm.map((input) => {
        const { label, name, type, id } = input;
        return (
            <div key={name} className={`${giveColSpan(name)}`}>
                <label className="block text-sm font-medium text-gray-700">
                    {t(label)}
                </label>
                <Controller
                    name={name as any}
                    control={control}
                    render={({ field }) => (
                        name === 'phone' ? (
                            <PhoneInput
                                {...field}
                                defaultCountry="SA"
                                international
                                countryCallingCodeEditable={false}
                                className="p-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="Enter phone number"
                            />
                        ) : type === 'select' ? (
                            <select
                                id={id}
                                {...field}
                                className="mt-1 block p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            >
                                <option value="">{t('selectRole')}</option>
                                <option value="user">{t('user')}</option>
                                <option value="moderator">{t('moderator')}</option>
                                <option value="monitor">{t('monitor')}</option>
                            </select>
                        ) : (
                            <input
                                id={id}
                                type="text"
                                {...field}
                                autoComplete="new-password"
                                className="mt-1 block p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            />
                        )
                    )}
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
                
                { role !== 'user' && 
                    <div className="w-full">
                        <fieldset>
                            <legend className="block text-lg font-medium text-gray-700">
                                {t('permissions')}
                            </legend>
                            {UserPermissionsOptions.map((option) => (
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
                }


                <div className="w-1/2 mx-auto mt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-md w-full border font-semibold text-white bg-adminPrimary p-3 px-6"
                    >
                        { createNewUserRoleStatus === 'loading' ? 
                        (
                            <div className="flex items-center w-fit mx-auto gap-2">
                                <p>{t("addUserBtnLoad")}</p>
                                <Spinner />
                            </div>
                        ) :
                            t("addUserBtn")
                    }
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AddUser;
