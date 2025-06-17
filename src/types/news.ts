export interface INews {
    id: string;
    title: string;
    content: string;
    url: string;
    publishedAt: string;
    source: {
        name: string;
        url: string;
    };
} 