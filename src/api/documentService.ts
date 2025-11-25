import api from './api';

export interface DocumentBase {
    id: string;
    title: string;
    content: string;
    author: string;
    tags: string[];
    metadata: Record<string, any>;
    created_at?: string;
    updated_at?: string;
}

export interface DocumentOut extends DocumentBase {
    created_at: string;
    updated_at: string;
    creator: string;
}

export interface SearchParams {
    q?: string;
    limit?: number;
    offset?: number;
}

export interface SearchResponse {
    documents: DocumentOut[];
    total: number;
}

export interface CreateDocumentData {
    title: string;
    content: string;
    tags: string[];
    metadata?: Record<string, any>;
}

export interface UpdateDocumentData {
    title?: string;
    content?: string;
    tags?: string[];
    metadata?: Record<string, any>;
}

export const documentService = {
    async createDocument(data: CreateDocumentData): Promise<DocumentOut> {
        const response = await api.post<DocumentOut>('/documents/create', data);
        return response.data;
    },

    async searchDocuments(params: SearchParams): Promise<SearchResponse> {
        const response = await api.get<SearchResponse>('/documents/search', { params });
        return response.data;
    },

    async getDocument(docId: string): Promise<DocumentOut> {
        const response = await api.get<DocumentOut>('/documents/', {
            params: { doc_id: docId }
        });
        return response.data;
    },

    async updateDocument(docId: string, data: UpdateDocumentData): Promise<DocumentOut> {
        const response = await api.put<DocumentOut>(`/documents/${docId}`, data);
        return response.data;
    },

    async deleteDocument(docId: string): Promise<void> {
        await api.delete(`/documents/${docId}`);
    },

    async getAllDocuments(): Promise<DocumentOut[]> {
        const response = await api.get<DocumentOut[]>('/documents/all');
        return response.data;
    }
};