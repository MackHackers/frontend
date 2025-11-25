import api from './api';

export interface UserInfo {
    username: string;
    role: 'viewer' | 'manager' | 'root';
}

export const userService = {
    async getCurrentUser(): Promise<UserInfo> {
        const response = await api.get<UserInfo>('/users/me');
        return response.data;
    },

    async getUserRole(): Promise<string> {
        try {
            const user = await this.getCurrentUser();
            return user.role;
        } catch (error) {
            console.error('Error getting user role:', error);
            return 'root';
        }
    }
};