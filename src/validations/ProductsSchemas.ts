import { formatValidationMessage } from '@/utils/formatValiationMessage';
import * as yup from 'yup';

export const addProductSchema = yup.object().shape({
    titleEn: yup.string().required(formatValidationMessage('required')),
    titleAr: yup.string().required(formatValidationMessage('required')),
    descAr: yup.string().optional(),
    descEn: yup.string().optional(),
    basePrice: yup.number().min(0, formatValidationMessage('min', 0)).required(formatValidationMessage('required')),
    discount: yup.number().required(formatValidationMessage("required")).min(0, formatValidationMessage('min', 0)),
    isStock: yup.string().oneOf(['yes', 'no'], formatValidationMessage('required')).required(formatValidationMessage('required')),
    stock: yup.number().optional(),
    timeToMake: yup.number().required(formatValidationMessage("required")).min(1, formatValidationMessage('min', 1)),
    categoryId: yup.string().required(formatValidationMessage('required')),
    subCategoryId: yup.string().required(formatValidationMessage('required')),
    images: yup.array().of(yup.mixed()).max(10, formatValidationMessage('max', 10)).min(1, formatValidationMessage('min', 1)),
});

export const AddToMarketSchema = yup.object().shape({
    basePrice: yup.number()
    .required(formatValidationMessage('required')),
    showEndDate: yup.date()
    .required(formatValidationMessage('required')),
})

