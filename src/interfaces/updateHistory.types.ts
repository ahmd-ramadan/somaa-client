export type UpdateHistoryEntityType = 'analysis' | 'news';

export type UpdateHistoryAction = 'create' | 'update' | 'groupUpdate';

export interface IUpdateHistoryChange {
    field: string;
    from?: string;
    to?: string;
}

export interface IUpdateHistoryEntry {
    _id: string;
    entityType: UpdateHistoryEntityType;
    entityId: string;
    entityLabel?: string;
    action: UpdateHistoryAction;
    changedByName?: string;
    changedByData?: {
        name?: string;
    };
    changes: IUpdateHistoryChange[];
    createdAt: string;
}
