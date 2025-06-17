import * as yup from 'yup';
import { AnalysisClassifyEnum, ContentTypesEnum, PlatformsEnum } from '@/interfaces/analysis.types';
import { MongoDBObjectId } from '@/interfaces/general.interface';

export const addAnalysisSchema = yup.object().shape({
    url: yup
        .string()
        .required('URL is required'),
        // .url('Please enter a valid URL'),
    platform: yup
        .string()
        .oneOf(Object.values(PlatformsEnum), 'Please select a valid platform')
        .required('Platform is required'),
    classify: yup
        .string()
        .oneOf(Object.values(AnalysisClassifyEnum), 'Please select a valid classification')
        .required('Classification is required'),
    contentType: yup
        .string()
        .oneOf(Object.values(ContentTypesEnum), 'Please select a valid content type')
        .required('Content type is required'),
    sectorId: yup
        .string()
        .required('Sector is required'),
    subAnalysisId: yup
        .string()
        .required('Analysis is required')
        .matches(MongoDBObjectId),
    location: yup.object().shape({
        region: yup
            .string()
            .required('Region is required'),
        city: yup
            .string()
            .required('City is required'),
        district: yup
            .string()
            .required('District is required'),
        lat: yup
            .number()
            .required('lat is required'),
        lng: yup
            .number()
            .required('lng is required')
    }),
    note: yup
        .string()
        .max(1000, 'Note must not exceed 1000 characters')
        .optional(),
    isFlagged: yup
        .boolean()
        .optional(),
    ishighlighted: yup
        .boolean()
        .optional(),
});

