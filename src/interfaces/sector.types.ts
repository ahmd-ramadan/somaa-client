import { IDBModel } from "./general.interface";

export interface ISectorModel extends IDBModel {
    name: string;
    newsMonitoringCount: number,
    socialMediaMonitoringCount: number
}

export interface ISector extends ISectorModel{}

export interface ICreateSector {
    name: string;
    
}