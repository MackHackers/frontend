import React, { useState } from 'react';
import type { DocumentOut } from '../../api/documentService';

interface DocsManagementSidebarProps {
    documents: DocumentOut[];
    onDocSelect: (doc: DocumentOut) => void;
    selectedDocId?: string;
    onCreateNew: () => void;
}

const DocsManagementSidebar: React.FC<DocsManagementSidebarProps> = ({
                                                                         documents,
                                                                         onDocSelect,
                                                                         selectedDocId,
                                                                         onCreateNew
                                                                     }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <aside className="docs-management-sidebar">
            <nav className="sidebar-nav">
                <div className="sidebar-header">
                    <h3>Управление документами</h3>
                    <button
                        className="create-new-btn"
                        onClick={onCreateNew}
                    >
                        + Создать новый
                    </button>
                </div>

                <div className="sidebar-search">
                    <input
                        type="text"
                        placeholder="Поиск документов..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="documents-list">
                    {filteredDocs.length === 0 ? (
                        <div className="no-documents">
                            {documents.length === 0 ? 'Нет документов' : 'Документы не найдены'}
                        </div>
                    ) : (
                        <ul className="documents-menu">
                            {filteredDocs.map((doc) => (
                                <li key={doc.id}>
                                    <button
                                        className={`document-item ${selectedDocId === doc.id ? 'active' : ''}`}
                                        onClick={() => onDocSelect(doc)}
                                    >
                                        <div className="document-title">{doc.title}</div>
                                        <div className="document-meta">
                                            <span className="document-date">
                                                {new Date(doc.updated_at).toLocaleDateString()}
                                            </span>
                                            <span className="document-tags">
                                                {doc.tags.slice(0, 2).join(', ')}
                                                {doc.tags.length > 2 && '...'}
                                            </span>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </nav>
        </aside>
    );
};

export default DocsManagementSidebar;