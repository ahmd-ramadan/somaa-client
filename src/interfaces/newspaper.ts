import { IDBModel } from "./general.interface";

export interface INewspaperModel extends IDBModel {
    name: string;
    newsMonitoringCount: number
}

export interface INewspaper extends INewspaperModel{}

export interface ICreateNewspaper {
    name: string;   
}