import React, { useState } from 'react';
import DocsHeader from '../../components/header/header.tsx';
import DocsSidebar from '../../components/Docs/DocsSidebar.tsx';
import DocsContent from '../../components/Docs/DocsContent.tsx';
import ChatWidget from '../../components/Chat/ChatWidget.tsx';

interface DocContent {
    title: string;
    description: string;
    content: string;
}

const DocsPage: React.FC = () => {
    const [currentDoc, setCurrentDoc] = useState<DocContent | undefined>(undefined);

    // Функция для загрузки документа (с заглушка)
    const loadDocument = (docId: string) => {
        // Здесь будет логика загрузки документа
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

## Пример использования

\`\`\`javascript
import { ${docId} } from 'setlbase';

const result = ${docId}.method();
\`\`\`

## Параметры

| Параметр | Тип | Описание |
|----------|-----|----------|
| param1   | string | Описание параметра |
| param2   | number | Описание параметра |

<div class="warning-box">
  <div class="warning-icon">⚠️</div>
  <div class="warning-content">
    <strong>Внимание:</strong> Этот функционал находится в стадии разработки.
  </div>
</div>
            `
        };
        setCurrentDoc(mockDoc);
    };

    return (
        <div className="docs-layout">
            <DocsHeader />
            <div className="docs-container">
                <DocsSidebar onDocSelect={loadDocument} />
                <DocsContent content={currentDoc} />
            </div>
            <ChatWidget />
        </div>
    );
};

export default DocsPage;