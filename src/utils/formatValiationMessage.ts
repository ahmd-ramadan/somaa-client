import { InputsFormValidationTypes } from "@/types";

export const formatValidationMessage = (type: InputsFormValidationTypes, number?: number) => {
    return `${type}.${number}`
};
