import api from './api';

export interface User {
    id: string;
    username: string;
    role: 'viewer' | 'manager' | 'root';
}

export interface CreateUserData {
    username: string;
    password: string;
    role: 'viewer' | 'manager' | 'root';
}

export interface UpdateUserData {
    username?: string;
    password?: string;
    role?: 'viewer' | 'manager' | 'root';
}

export const userManagementService = {
    async getAllUsers(): Promise<User[]> {
        const response = await api.get<User[]>('/users/');
        return response.data;
    },

    async getUser(userId: string): Promise<User> {
        const response = await api.get<User>(`/users/${userId}`);
        return response.data;
    },

    async createUser(data: CreateUserData): Promise<User> {
        const response = await api.post<User>('/users/', data);
        return response.data;
    },

    async updateUser(userId: string, data: UpdateUserData): Promise<User> {
        const response = await api.put<User>(`/users/${userId}`, data);
        return response.data;
    },

    async deleteUser(userId: string): Promise<void> {
        await api.delete(`/users/${userId}`);
    }
};