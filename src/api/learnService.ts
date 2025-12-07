import api from './api';

export interface DocumentBase {
    id: string;
    title: string;
    deleted: boolean;
    content: string;
    author: string;
    tags: string[];
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface DocumentOut extends DocumentBase {

}


export interface CreateDocumentData {
    id: string;
    deleted: boolean;
    title: string;
    content: string;
    tags: string[];
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
    author: string;
}

export interface UpdateDocumentData {
    id: string;
    title?: string;
    content?: string;
    tags?: string[];
    metadata?: Record<string, any>;
}

export interface SearchParams {
    q?: string;
    limit?: number;
    offset?: number;
}

export interface SearchResponse {
    results: any;
    total: number;
}

export const documentService = {
    async createDocument(data: CreateDocumentData): Promise<DocumentBase> {
        console.log(data)
        const response = await api.post<DocumentBase>('/learn/create', data);
        return response.data;
    },

    async searchDocuments(params: SearchParams): Promise<SearchResponse> {
        const response = await api.get<SearchResponse>('/learn/search', { params });
        console.log("search resp:")
        console.log(response.data.results)
        return response.data;
    },

    async getDocument(docId: string): Promise<DocumentOut> {
        const response = await api.get<DocumentOut>('/learn/', {
            params: { doc_id: docId }
        });
        return response.data;
    },

    async updateDocument(data: DocumentBase): Promise<DocumentBase> {
        const response = await api.put<DocumentBase>(`/learn/update`, data);
        return response.data;
    },

    async deleteDocument(docId: string): Promise<void> {
        await api.delete(`/learn`, {params: {doc_id: docId}});
    },

    async getAllDocuments(): Promise<DocumentOut[]> {
        const response = await api.get<string[]>('/learn/all');
        console.log(response.data)
        let docs: any[] = []
        for(let i = 0; i < response.data.length; i++){
            const newDoc = await this.getDocument(response.data[i]);
            docs = [...docs, newDoc]
        }
        console.log(docs)
        return docs;
    }
};