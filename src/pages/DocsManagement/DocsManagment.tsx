import React, { useState, useEffect } from 'react';
import DocsHeader from '../../components/header/header.tsx';
import { documentService, type DocumentBase, type CreateDocumentData, type UpdateDocumentData } from '../../api/documentService';
import { userService } from '../../api/userService';
import { useNavigate } from 'react-router-dom';
import DocsManagementSidebar from "./components/DocsManagementSidebar.tsx";
import DocsEditor from "./components/DocsEditor.tsx";

const DocsManagement: React.FC = () => {
    const [documents, setDocuments] = useState<DocumentBase[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<DocumentBase | null>(null);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState<string>('viewer');
    const [mode, setMode] = useState<'view' | 'edit' | 'create'>('view');
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const role = await userService.getUserRole();
                setUserRole(role);

                if (!['manager', 'root'].includes(role)) {
                    navigate('/docs');
                    return;
                }

                const docs = await documentService.getAllDocuments();
                setDocuments(docs);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [navigate]);

    const handleDocSelect = (doc: DocumentBase) => {
        setSelectedDoc(doc);
        setMode('view');
    };

    const handleEdit = () => {
        if (selectedDoc) {
            setMode('edit');
        }
    };

    const handleCreate = () => {
        setSelectedDoc(null);
        setMode('create');
    };

    const handleSave = async (data: CreateDocumentData) => {
        try {
            if (mode === 'create') {
                const newDoc = await documentService.createDocument(data );
                setDocuments(prev => [...prev, newDoc]);
                setSelectedDoc(newDoc);
                setMode('view');
            }
            
            if (mode === 'edit' && selectedDoc) {
                data.id = selectedDoc.id;
                const updatedDoc = await documentService.updateDocument(data);
                setDocuments(prev => prev.map(doc =>
                    doc.id === selectedDoc.id ? updatedDoc : doc
                ));
                setSelectedDoc(updatedDoc);
                setMode('view');
            }
        } catch (error) {
            console.error('Error saving document:', error);
            alert('Ошибка при сохранении документа');
        }
    };

    const handleDelete = async () => {
        if (!selectedDoc) return;

        if (window.confirm(`Вы уверены, что хотите удалить документ "${selectedDoc.title}"?`)) {
            try {
                await documentService.deleteDocument(selectedDoc.id);
                setSelectedDoc(null);
                setMode('view');
            } catch (error) {
                console.error('Error deleting document:', error);
                alert('Ошибка при удалении документа');
            }
        }
    };

    const handleCancel = () => {
        if (mode === 'create') {
            setSelectedDoc(null);
        }
        setMode('view');
    };

    if (loading) {
        return (
            <div className="docs-management-layout">
                <DocsHeader />
                <div className="loading-container">Загрузка...</div>
            </div>
        );
    }

    return (
        <div className="docs-management-layout">
            <DocsHeader />
            <div className="docs-management-container">

                <DocsManagementSidebar
                    documents={documents}
                    onDocSelect={handleDocSelect}
                    selectedDocId={selectedDoc?.id}
                    onCreateNew={handleCreate}
                />

                <div className="docs-management-content">
                    <DocsEditor
                        document={selectedDoc}
                        mode={mode}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        userRole={userRole}
                    />
                </div>
            </div>
        </div>
    );
};

export default DocsManagement;