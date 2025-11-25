import api from './api';

export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    password: string;
    role?: 'viewer' | 'manager' | 'root';
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export const authService = {
    async login(data: LoginData): Promise<TokenResponse> {
        const formData = new URLSearchParams();
        formData.append('username', data.username);
        formData.append('password', data.password);

        const response = await api.post<TokenResponse>('/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    },

    async register(data: RegisterData): Promise<void> {
        await api.post('/register', data);
    }
};