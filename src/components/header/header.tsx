import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { userService } from '../../api/userService';

const DocsHeader: React.FC = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState<string>('viewer');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserRole = async () => {
            try {
                const role = await userService.getUserRole();
                setUserRole(role);
            } catch (error) {
                console.error('Error loading user role:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserRole();
    }, []);

    const handleDocsClick = () => {
        navigate('/docs');
    };

    const handleDocsManagementClick = () => {
        navigate('/docs-management');
    };

    const handleUserManagementClick = () => {
        navigate('/user-management');
    };

    const isManagerOrRoot = ['manager', 'root'].includes(userRole);
    const isRoot = userRole === 'root';

    if (loading) {
        return (
            <header className="header">
                <div className="header-container">
                    <div className="header-left">
                        <div className="logo">
                            <div className="logo-icon">⚡</div>
                            <span className="logo-text">SetlBase</span>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="loading-text">Загрузка...</div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-left">
                    <div className="logo" onClick={handleDocsClick}>
                        <div className="logo-icon">⚡</div>
                        <span className="logo-text">SetlBase</span>
                    </div>
                </div>
                <div className="header-right">
                    <button
                        className="docs-button"
                        onClick={handleDocsClick}
                    >
                        Docs
                    </button>

                    {isManagerOrRoot && (
                        <button
                            className="management-button"
                            onClick={handleDocsManagementClick}
                        >
                            Управление документами
                        </button>
                    )}

                    {isRoot && (
                        <button
                            className="management-button"
                            onClick={handleUserManagementClick}
                        >
                            Управление пользователями
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default DocsHeader;