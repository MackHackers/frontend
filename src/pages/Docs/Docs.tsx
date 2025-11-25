// src/pages/Docs/Docs.tsx
import React, { useState } from 'react';
import DocsHeader from '../../components/header/header.tsx';
import DocsSidebar from '../../components/Docs/DocsSidebar.tsx';
import DocsContent from '../../components/Docs/DocsContent.tsx';
import ChatWidget from '../../components/Chat/ChatWidget.tsx';
import { documentService } from '../../api/documentService';

interface DocContent {
    title: string;
    description: string;
    content: string;
}

const DocsPage: React.FC = () => {
    const [currentDoc, setCurrentDoc] = useState<DocContent | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const loadDocument = async (docId: string) => {
        setLoading(true);
        try {
            const document = await documentService.getDocument(docId);
            setCurrentDoc({
                title: document.title,
                description: document.metadata?.description || 'Описание документа',
                content: document.content
            });
        } catch (error) {
            console.error('Error loading document:', error);
            const mockDoc: DocContent = {
                title: `Документация: ${docId}`,
                description: `Подробное описание функционала ${docId}`,
                content: `
# ${docId}

Это содержимое документации для раздела "${docId}".

## Основные возможности

- Функция 1
- Функция 2  
- Функция 3

<div class="warning-box">
  <div class="warning-icon">⚠️</div>
  <div class="warning-content">
    <strong>Внимание:</strong> Документ временно недоступен.
  </div>
</div>
                `
            };
            setCurrentDoc(mockDoc);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="docs-layout">
            <DocsHeader />
            <div className="docs-container">
                <DocsSidebar onDocSelect={loadDocument} />
                <DocsContent content={currentDoc} loading={loading} />
            </div>
            <ChatWidget />
        </div>
    );
};

export default DocsPage;