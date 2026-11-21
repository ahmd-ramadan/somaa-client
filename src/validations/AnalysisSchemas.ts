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
            .optional(),
        city: yup
            .string()
           .optional(),
        district: yup
            .string()
            .optional(),
        lat: yup
            .number()
            .optional(),
        lng: yup
            .number()
            .optional()
    }).optional(),
    note: yup
        .string()
        .max(1000, 'Note must not exceed 1000 characters')
        .optional(),
    // isFlagged: yup
    //     .boolean()
    //     .optional(),
    ishighlighted: yup
        .boolean()
        .optional(),
    publishDate: yup
        .date()
        .optional(),
    // Manual data for platforms that can't be scraped (facebook, linkedin)
    contentBody: yup
        .string()
        .optional(),
    publisherName: yup
        .string()
        .optional(),
    publisherHandle: yup
        .string()
        .optional(),
    publisherAvatar: yup
        .string()
        .optional(),
    publisherFollowers: yup
        .string()
        .optional(),
    reactions: yup
        .string()
        .optional(),
    comments: yup
        .string()
        .optional(),
    shares: yup
        .string()
        .optional(),
    views: yup
        .string()
        .optional(),
    appearance: yup
        .string()
        .optional(),
});

