// src/components/Login/LoginForm.tsx
import React, { useState } from 'react';
import { authService } from '../../api/authService';
import type { LoginData } from '../../api/authService';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState<LoginData>({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(formData);
            localStorage.setItem('auth_token', response.access_token);
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/docs');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ошибка авторизации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-form">
            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                <div className="input-group">
                    <span className="input-icon user-icon-small"></span>
                    <input
                        type="text"
                        name="username"
                        placeholder="Email или имя пользователя"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <span className="input-icon lock-icon"></span>
                    <input
                        type="password"
                        name="password"
                        placeholder="Введите пароль"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="login-button"
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : 'LOGIN'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;