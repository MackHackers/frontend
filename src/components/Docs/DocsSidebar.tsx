// src/components/Docs/DocsSidebar.tsx
import React, { useState, useEffect } from 'react';
import { documentService } from '../../api/documentService';
import type { SearchParams } from '../../api/documentService';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

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

    // Поиск через Elasticsearch
    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const params: SearchParams = {
                q: query,
                limit: 10,
                offset: 0
            };
            const response = await documentService.searchDocuments(params);
            setSearchResults(response.documents || []);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

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

    const handleSearchResultClick = async (docId: string) => {
        try {
            const document = await documentService.getDocument(docId);
            onDocSelect(docId);
        } catch (error) {
            console.error('Error loading document:', error);
        }
    };

    return (
        <aside className="docs-sidebar">
            <nav className="sidebar-nav">
                <div className="sidebar-search">
                    <input
                        type="text"
                        placeholder="Поиск в документации..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {isSearching && <div className="search-loading">Поиск...</div>}
                </div>

                {searchQuery && (
                    <div className="search-results">
                        <h4>Результаты поиска:</h4>
                        {searchResults.length > 0 ? (
                            <ul className="search-results-list">
                                {searchResults.map((doc) => (
                                    <li key={doc.id}>
                                        <button
                                            className="search-result-item"
                                            onClick={() => handleSearchResultClick(doc.id)}
                                        >
                                            <div className="search-result-title">{doc.title}</div>
                                            <div className="search-result-preview">
                                                {doc.content.substring(0, 100)}...
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            !isSearching && <div className="no-results">Ничего не найдено</div>
                        )}
                    </div>
                )}

                {!searchQuery && (
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
                )}
            </nav>
        </aside>
    );
};

export default DocsSidebar;