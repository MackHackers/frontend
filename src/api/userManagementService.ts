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
        const response = await api.get<User[]>('/users');
        return response.data;
    },

    async createUser(data: CreateUserData): Promise<User> {
        const response = await api.post<User>('/users/register', data);
        return response.data;
    },

    async deleteUser(userId: string): Promise<void> {
        // userId в данном случае это username
        await api.delete(`/users/${userId}`);
    }
};