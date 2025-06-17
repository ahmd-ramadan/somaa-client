import { formatValidationMessage } from '@/utils/formatValiationMessage';
import * as yup from 'yup';

export const AddCitySchema = yup.object().shape({
    city: yup.object().shape({
        en: yup.string().required(formatValidationMessage("required")),
        ar: yup.string().required(formatValidationMessage("required")),
    }).required(formatValidationMessage("required")),
    cost: yup.number().required(formatValidationMessage("required"))
});