import { formatValidationMessage } from "@/utils/formatValiationMessage";
import { isValidPhoneNumber } from "libphonenumber-js";
import * as yup from "yup"

export const ProfileInfoSchema = yup.object().shape({
    name: yup.string()
        .required(formatValidationMessage('required')),
    email: yup.string()
        .email(formatValidationMessage('email'))
        .required(formatValidationMessage('required')),
    phone: yup
        .string()
        .required('Phone number is required')
        .test('is-valid-phone', formatValidationMessage('default'), value => isValidPhoneNumber(value || '')),
});