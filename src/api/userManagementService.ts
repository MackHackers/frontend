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
    async getAllUsers() {
        const response: any = await api.get('/users');
        response.data.map((user: any) => {return {username: user, role: "viewer"} as User})
        let data: any[] = []
        response.data.forEach((element: any) => {
            data = [...data, {username: element, role: "viewer"}]
        });
        return data;
    },

    async createUser(data: CreateUserData): Promise<User> {
        const response = await api.post<User>('/users/register', data);
        return response.data;
    },

    async deleteUser(userId: string): Promise<void> {
        await api.delete(`/users/${userId}`);
    }
};