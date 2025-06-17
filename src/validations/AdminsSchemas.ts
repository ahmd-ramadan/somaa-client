import { formatValidationMessage } from '@/utils/formatValiationMessage';
import * as yup from 'yup';

const egyptianPhoneRegExp = /^(010|011|012|015)\d{8}$/;
const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
// /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


export const AdminSignUpSchema = yup.object().shape({
    name: yup.string()
        .required(formatValidationMessage('required')),
    email: yup.string()
        .email(formatValidationMessage('email'))
        .required(formatValidationMessage('required')),
    // phoneNumber: yup.string()
    //     // .length(11, formatValidationMessage('length', 11))
    //     .matches(egyptianPhoneRegExp, formatValidationMessage('default'))
    //     .required(formatValidationMessage('required')),
    password:  yup.string()
    .matches(passwordRegExp, formatValidationMessage('passMatches'))
    .max(20, formatValidationMessage('maxLength', 20))
    .required(formatValidationMessage('required')),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], formatValidationMessage('matches'))
        .required(formatValidationMessage('required')),
    permissions: yup.array()
        .of(yup.string())
        .min(1, formatValidationMessage('min', 1))
        .required(formatValidationMessage('required')),
});
