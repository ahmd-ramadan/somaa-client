import * as yup from 'yup';
import { NewsAdTypesEnum, NewsClassifyEnum, NewsGeographicalClassifyEnum, NewsPressTypesEnum } from '@/interfaces/news.types';

export const addNewsSchema = yup.object().shape({
    url: yup
        .string()
        .required('URL is required'),
        // .url('Please enter a valid URL'),
    title: yup
        .string()
        .required('Title is required'),
    newspaper: yup
        .string()
        .required('Newspaper is required'),
    classify: yup
        .string()
        .oneOf(Object.values(NewsClassifyEnum), 'Please select a valid classification')
        .required('Classification is required'),
    adType: yup
        .string()
        .oneOf(Object.values(NewsAdTypesEnum), 'Please select a valid Ad Type')
        .required('Ad Types is required'),
    pressType: yup
        .string()
        .oneOf(Object.values(NewsPressTypesEnum), 'Please select a valid Press Type')
        .required('Press Types is required'),
    geoClassify: yup
        .string()
        .oneOf(Object.values(NewsGeographicalClassifyEnum), 'Please select a valid Geo news Type')
        .required('Geo News Type is required'),
    sectorId: yup
        .string()
        .required('Sector is required'),
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