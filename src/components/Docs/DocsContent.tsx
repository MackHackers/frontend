import React from 'react';

interface DocsContentProps {
    content?: {
        title: string;
        description: string;
        content: string;
    };
}

const DocsContent: React.FC<DocsContentProps> = ({ content }) => {
    // Заглушка если контент не передан
    const defaultContent = {
        title: "Добро пожаловать в документацию SetlBase",
        description: "Выберите раздел документации в боковой панели",
        content: `
<div class="info-box">
  <div class="info-icon">💡</div>
  <div class="info-content">
    <strong>Совет:</strong> Используйте поиск в боковой панели для быстрого доступа к нужным разделам документации.
  </div>
</div>
        `
    };

    const currentContent = content || defaultContent;

    return (
        <main className="docs-content">
            <div className="content-container">
                <h1>{currentContent.title}</h1>
                <p className="lead">{currentContent.description}</p>

                <div className="prose" dangerouslySetInnerHTML={{ __html: currentContent.content }} />
            </div>
        </main>
    );
};

export default DocsContent;