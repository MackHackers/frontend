import React, { useState, useEffect } from 'react';
import type { User, CreateUserData, UpdateUserData } from '../../api/userManagementService';

interface UserEditorProps {
    user?: User | null;
    mode: 'view' | 'edit' | 'create';
    onSave: (data: CreateUserData | UpdateUserData) => void;
    onCancel: () => void;
    onEdit: () => void;
    onDelete: () => void;
    userRole: string;
    currentUserId?: string;
}

const UserEditor: React.FC<UserEditorProps> = ({
                                                   user,
                                                   mode,
                                                   onSave,
                                                   onCancel,
                                                   onEdit,
                                                   onDelete,
                                                   userRole,
                                                   currentUserId
                                               }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: 'viewer' as 'viewer' | 'manager' | 'root'
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user && mode !== 'create') {
            setFormData({
                username: user.username,
                password: '',
                confirmPassword: '',
                role: user.role
            });
        } else if (mode === 'create') {
            setFormData({
                username: '',
                password: '',
                confirmPassword: '',
                role: 'viewer'
            });
        }
        setErrors({});
    }, [user, mode]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Имя пользователя обязательно';
        }

        if (mode === 'create' && !formData.password) {
            newErrors.password = 'Пароль обязателен';
        }

        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const saveData: CreateUserData | UpdateUserData = {
            username: formData.username,
            role: formData.role
        };

        if (formData.password) {
            saveData.password = formData.password;
        }

        onSave(saveData);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'root':
                return '#dc2626';
            case 'manager':
                return '#2563eb';
            case 'viewer':
                return '#16a34a';
            default:
                return '#6b7280';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'root':
                return 'Администратор';
            case 'manager':
                return 'Менеджер';
            case 'viewer':
                return 'Просмотр';
            default:
                return role;
        }
    };

    if (mode === 'view' && !user) {
        return (
            <div className="user-editor">
                <div className="editor-placeholder">
                    <h2>Выберите пользователя для просмотра или создайте нового</h2>
                    <p>Используйте панель слева для навигации по пользователям</p>
                </div>
            </div>
        );
    }

    if (mode === 'view' && user) {
        const canEdit = userRole === 'root' || (userRole === 'manager' && user.role !== 'root');
        const canDelete = userRole === 'root' && user.id !== currentUserId;

        return (
            <div className="user-editor">
                <div className="editor-header">
                    <h1>Пользователь: {user.username}</h1>
                    <div className="editor-actions">
                        {canEdit && (
                            <button className="btn-edit" onClick={onEdit}>
                                Редактировать
                            </button>
                        )}
                        {canDelete && (
                            <button className="btn-delete" onClick={onDelete}>
                                Удалить
                            </button>
                        )}
                    </div>
                </div>

                <div className="user-meta-info">
                    <div className="meta-item">
                        <strong>ID:</strong> {user.id}
                    </div>
                    <div className="meta-item">
                        <strong>Роль:</strong>
                        <span
                            className="role-badge"
                            style={{ backgroundColor: getRoleColor(user.role) }}
                        >
                            {getRoleLabel(user.role)}
                        </span>
                    </div>
                </div>

                <div className="user-permissions">
                    <h3>Права доступа</h3>
                    <div className="permissions-list">
                        {user.role === 'root' && (
                            <>
                                <div className="permission-item">✓ Полный доступ ко всем функциям</div>
                                <div className="permission-item">✓ Управление пользователями</div>
                                <div className="permission-item">✓ Управление документами</div>
                                <div className="permission-item">✓ Просмотр документации</div>
                            </>
                        )}
                        {user.role === 'manager' && (
                            <>
                                <div className="permission-item">✓ Управление документами</div>
                                <div className="permission-item">✓ Просмотр документации</div>
                                <div className="permission-item">✗ Управление пользователями</div>
                            </>
                        )}
                        {user.role === 'viewer' && (
                            <>
                                <div className="permission-item">✓ Просмотр документации</div>
                                <div className="permission-item">✗ Управление документами</div>
                                <div className="permission-item">✗ Управление пользователями</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const isRoot = userRole === 'root';
    const canChangeRole = isRoot;

    return (
        <div className="user-editor">
            <form onSubmit={handleSubmit}>
                <div className="editor-header">
                    <h1>
                        {mode === 'create' ? 'Создание нового пользователя' : 'Редактирование пользователя'}
                    </h1>
                    <div className="editor-actions">
                        <button type="submit" className="btn-save">
                            Сохранить
                        </button>
                        <button type="button" className="btn-cancel" onClick={onCancel}>
                            Отмена
                        </button>
                    </div>
                </div>

                <div className="editor-form">
                    <div className="form-group">
                        <label htmlFor="username">Имя пользователя *</label>
                        <input
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                            required
                            disabled={mode === 'edit' && !isRoot}
                            className={errors.username ? 'error' : ''}
                        />
                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Пароль {mode === 'create' ? '*' : '(оставьте пустым, чтобы не менять)'}
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Подтверждение пароля</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                            className={errors.confirmPassword ? 'error' : ''}
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>

                    {canChangeRole && (
                        <div className="form-group">
                            <label htmlFor="role">Роль пользователя</label>
                            <select
                                id="role"
                                value={formData.role}
                                onChange={(e) => handleChange('role', e.target.value)}
                            >
                                <option value="viewer">Пользователь</option>
                                <option value="manager">Менеджер</option>
                                <option value="root">Администратор</option>
                            </select>
                        </div>
                    )}

                    <div className="form-info">
                        <h4>Описание ролей:</h4>
                        <ul>
                            <li><strong>Пользователь:</strong> Только чтение документации</li>
                            <li><strong>Менеджер:</strong> Управление документами + чтение</li>
                            <li><strong>Администратор:</strong> Полные права (включая управление пользователями)</li>
                        </ul>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UserEditor;