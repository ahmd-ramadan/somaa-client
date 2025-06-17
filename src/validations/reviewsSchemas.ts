
import { formatValidationMessage } from "@/utils/formatValiationMessage";
import * as yup from 'yup';

export const AddReviewSchema = yup.object().shape({
    rate: yup.number().min(1).max(6)
        .required(formatValidationMessage('required')),
    comment: yup.string()
});