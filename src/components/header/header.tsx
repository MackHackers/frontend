import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { userService } from '../../api/userService';
import logo from "../../icons/logo+module.svg";

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
                        <img className="logo" src={logo} alt="Логотип"/>
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
                    <img
                        className="logo"
                        src={logo}
                        onClick={handleDocsClick}
                        alt="Логотип"
                    />
                    <nav className="header-nav">
                        <button className="nav-button">Новости</button>
                        <button className="nav-button">Обучение</button>
                        <button className="nav-button">Статьи</button>
                        <button className="nav-button">Документы</button>
                        <button className="nav-button">FAQ</button>
                    </nav>
                </div>

                <div className="header-right">
                    {isManagerOrRoot && (
                        <button
                            className="admin-button"
                            onClick={handleDocsManagementClick}
                        >
                            Администрирование
                        </button>
                    )}

                    <button className="user-name-button">
                        Фамилия Имя
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DocsHeader;