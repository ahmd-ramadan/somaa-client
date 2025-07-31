import { formatValidationMessage } from '@/utils/formatValiationMessage';
import * as yup from 'yup';
import { isValidPhoneNumber } from 'libphonenumber-js';

const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
// /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const SignUpSchema = yup.object().shape({
    name: yup.string()
        .required(formatValidationMessage('required')),
    email: yup.string()
        .email(formatValidationMessage('email'))
        .required(formatValidationMessage('required')),
    phone: yup
        .string()
        .required('Phone number is required')
        .test('is-valid-phone', formatValidationMessage('default'), value => isValidPhoneNumber(value || '')),
    password: yup.string()
        .matches(passwordRegExp, formatValidationMessage('passMatches'))
        .max(20, formatValidationMessage('maxLength', 20))
        .required(formatValidationMessage('required')),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], formatValidationMessage('matches'))
        .required(formatValidationMessage('required')),
    // marketing: yup.boolean(),
});


export const LogInSchema = yup.object().shape({
    email: yup.string()
    .email(formatValidationMessage('email'))
    .required(formatValidationMessage('required')),
    password:  yup.string()
    .matches(passwordRegExp, formatValidationMessage('passMatches'))
    .max(20, formatValidationMessage('maxLength', 20))
    .required(formatValidationMessage('required')),
})

export const ForgetPasswordSchema = yup.object().shape({
    email: yup.string()
    .email(formatValidationMessage('email'))
    .required(formatValidationMessage('required')),
})
export const ResetPasswordSchema = yup.object().shape({
    newPassword:  yup.string()
    .matches(passwordRegExp, formatValidationMessage('passMatches'))
    .max(20, formatValidationMessage('maxLength', 20))
    .required(formatValidationMessage('required')),
    confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], formatValidationMessage('matches'))
    .required(formatValidationMessage('required')),
})

