export interface IDBModel {
    _id: string;
    createdAt: string;
    upadtedAt: string;
}

export const MongoDBObjectId = /^[a-f\d]{24}$/i;

export interface ICloudinaryIMage {
    secure_url: string;
    public_id: string;
}