import { formatValidationMessage } from '@/utils/formatValiationMessage';
import * as yup from 'yup';
import { isValidPhoneNumber } from 'libphonenumber-js';

const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
// /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


export const AddUserSchema = yup.object().shape({
    name: yup.string()
        .required(formatValidationMessage('required')),
    email: yup.string()
        .email(formatValidationMessage('email'))
        .required(formatValidationMessage('required')),
    phone: yup
        .string()
        .optional(),
        // .test('is-valid-phone', formatValidationMessage('default'), value => isValidPhoneNumber(value || '')),
    password:  yup.string()
        .matches(passwordRegExp, formatValidationMessage('passMatches'))
        .max(20, formatValidationMessage('maxLength', 20))
        .required(formatValidationMessage('required')),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], formatValidationMessage('matches'))
        .required(formatValidationMessage('required')),
    permissions: yup.array()
        .of(yup.string())
        // .min(1, formatValidationMessage('min', 1))
        .required(formatValidationMessage('required')),
    role: yup.string()
        .oneOf(['user', 'moderator', 'monitor'], formatValidationMessage('required'))
        .required(formatValidationMessage('required')),
});
