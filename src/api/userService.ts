import api from './api';

export interface UserInfo {
    username: string;
    role: 'viewer' | 'manager' | 'root';
}

export let me: any = null; 

export const userService = {


    async getCurrentUser(): Promise<UserInfo | null> {
        const token = localStorage.getItem('auth_token');
        if (token) {
            const response = await api.get<UserInfo>('/me');
            me = response.data;
            return response.data;
        }
        return null;
    },

    async getUserRole(): Promise<string> {
        try {
            const user = await this.getCurrentUser();
            return user?.role || "";
        } catch (error) {
            console.error('Error getting user role:', error);
            return 'root';
        }
    }
};