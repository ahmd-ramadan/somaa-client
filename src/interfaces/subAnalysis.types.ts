import { IDBModel } from "./general.interface";

export interface ISubAnalysisModel extends IDBModel {
    body: string;
}

export interface ISubAnalysis extends ISubAnalysisModel {}

export interface ICreateSubAnalysis {
    body: string;
}