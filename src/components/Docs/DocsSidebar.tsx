import React, { useState } from 'react';

interface MenuItem {
    id: string;
    title: string;
    items?: SubMenuItem[];
}

interface SubMenuItem {
    id: string;
    title: string;
}

interface DocsSidebarProps {
    onDocSelect: (docId: string) => void;
}

const DocsSidebar: React.FC<DocsSidebarProps> = ({ onDocSelect }) => {
    const [openSections, setOpenSections] = useState<Set<string>>(
        new Set(['getting-started', 'core-concepts'])
    );

    const menuData: MenuItem[] = [
        {
            id: 'getting-started',
            title: 'Начало работы',
            items: [
                { id: 'installation', title: 'Установка' },
                { id: 'quick-start', title: 'Быстрый старт' },
                { id: 'configuration', title: 'Конфигурация' }
            ]
        },
        {
            id: 'core-concepts',
            title: 'Основные концепции',
            items: [
                { id: 'architecture', title: 'Архитектура' },
                { id: 'components', title: 'Компоненты' },
                { id: 'state-management', title: 'Управление состоянием' }
            ]
        },
        {
            id: 'api',
            title: 'API Reference',
            items: [
                { id: 'core-api', title: 'Core API' },
                { id: 'utils', title: 'Утилиты' },
                { id: 'plugins', title: 'Плагины' }
            ]
        },
        {
            id: 'guides',
            title: 'Руководства',
            items: [
                { id: 'authentication', title: 'Аутентификация' },
                { id: 'database', title: 'Работа с базой данных' },
                { id: 'deployment', title: 'Деплой' }
            ]
        }
    ];

    const toggleSection = (sectionId: string) => {
        const newOpenSections = new Set(openSections);
        if (newOpenSections.has(sectionId)) {
            newOpenSections.delete(sectionId);
        } else {
            newOpenSections.add(sectionId);
        }
        setOpenSections(newOpenSections);
    };

    const handleDocClick = (docId: string) => {
        onDocSelect(docId);
    };

    return (
        <aside className="docs-sidebar">
            <nav className="sidebar-nav">
                <div className="sidebar-search">
                    <input
                        type="text"
                        placeholder="Поиск в документации..."
                        className="search-input"
                    />
                </div>

                <ul className="sidebar-menu">
                    {menuData.map((section) => (
                        <li key={section.id} className="menu-section">
                            <button
                                className={`section-header ${openSections.has(section.id) ? 'open' : ''}`}
                                onClick={() => toggleSection(section.id)}
                            >
                                <span>{section.title}</span>
                                <svg
                                    className={`chevron ${openSections.has(section.id) ? 'rotate-90' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {section.items && openSections.has(section.id) && (
                                <ul className="submenu">
                                    {section.items.map((item) => (
                                        <li key={item.id}>
                                            <button
                                                className="submenu-item"
                                                onClick={() => handleDocClick(item.id)}
                                            >
                                                {item.title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default DocsSidebar;