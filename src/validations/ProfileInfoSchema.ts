import { formatValidationMessage } from "@/utils/formatValiationMessage";
import * as yup from "yup"

const egyptianPhoneRegExp = /^(010|011|012|015)\d{8}$/;

export const ProfileInfoSchema = yup.object().shape({
    name: yup.string()
        .required(formatValidationMessage('required')),
    email: yup.string()
        .email(formatValidationMessage('email'))
        .required(formatValidationMessage('required')),
    phone: yup.string()
        // .length(11, formatValidationMessage('length', 11))
        .matches(egyptianPhoneRegExp, formatValidationMessage('default'))
        .required(formatValidationMessage('required')),
});