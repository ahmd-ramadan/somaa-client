import { formatValidationMessage } from "@/utils/formatValiationMessage";
import * as yup from 'yup';

const passwordRegExp =
/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


export const UpdatePassSchema = yup.object().shape({
    oldPassword:  yup.string()
    .matches(passwordRegExp, formatValidationMessage('passMatches'))
    .max(10, formatValidationMessage('maxLength', 10))
    .required(formatValidationMessage('required')),
    newPassword:  yup.string()
    .matches(passwordRegExp, formatValidationMessage('passMatches'))
    .max(10, formatValidationMessage('maxLength', 10))
    .required(formatValidationMessage('required')),
    confirmedPassword: yup.string()
        .oneOf([yup.ref('newPassword')], formatValidationMessage('matches'))
        .required(formatValidationMessage('required'))
});