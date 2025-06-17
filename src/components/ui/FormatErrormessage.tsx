import { useTranslations } from "next-intl";

interface IProps {
    message: string;
    field: string;
}

const FormatErrorMessage = ( { message, field } : IProps) => {
    const t = useTranslations("FormErrors");
    
    const formatErrorMessage = () => {
        const [type = 'default', number] = message.split('.');
        return t(type, { field, number});
    };

    return (
        <p className="text-red-600 mt-1 dark:text-red-800">{ formatErrorMessage() }</p>
    )

}

export default FormatErrorMessage;
