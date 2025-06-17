import { IDBModel } from "./general.interface";

export interface ISectorModel extends IDBModel {
    name: string;
}

export interface ISector extends ISectorModel{}

export interface ICreateSector {
    name: string;
}