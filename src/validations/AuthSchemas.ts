import { formatValidationMessage } from '@/utils/formatValiationMessage';
import * as yup from 'yup';

const egyptianPhoneRegExp = /^(010|011|012|015)\d{8}$/;
const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
// /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const SignUpSchema = yup.object().shape({
    name: yup.string()
        .required(formatValidationMessage('required')),
    email: yup.string()
        .email(formatValidationMessage('email'))
        .required(formatValidationMessage('required')),
    phone: yup.string()
        .matches(egyptianPhoneRegExp, formatValidationMessage('default'))
        .required(formatValidationMessage('required')),
    password: yup.string()
        .matches(passwordRegExp, formatValidationMessage('passMatches'))
        .max(20, formatValidationMessage('maxLength', 20))
        .required(formatValidationMessage('required')),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], formatValidationMessage('matches'))
        .required(formatValidationMessage('required')),
    // marketing: yup.boolean(),
});


export const BecomeVendorSchema = yup.object().shape({
    name: yup.string()
        .required(formatValidationMessage('required')),
    email: yup.string()
        .email(formatValidationMessage('email'))
        .required(formatValidationMessage('required')),
    phoneNumber: yup.string()
        // .length(11, formatValidationMessage('length', 11))
        .matches(egyptianPhoneRegExp, formatValidationMessage('default'))
        .required(formatValidationMessage('required')),
    // password:  yup.string()
        // .matches(passwordRegExp, formatValidationMessage('passMatches'))
        // .max(20, formatValidationMessage('maxLength', 20))
        // .required(formatValidationMessage('required')),
    // confirmPassword: yup.string()
    //     .oneOf([yup.ref('password')], formatValidationMessage('matches'))
    //     .required(formatValidationMessage('required')),
    taxNumber: yup.string()
        .required(formatValidationMessage('required')),
    factoryName: yup.string()
        .required(formatValidationMessage('required')),
    factoryAddress: yup.string()
        .required(formatValidationMessage('required')),
    tradeMark: yup.string().optional(),
    facebookLink: yup.string().optional(),
    websiteLink: yup.string().optional(),
    instagramLink: yup.string().optional()
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

