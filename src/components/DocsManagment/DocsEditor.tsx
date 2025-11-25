import React, { useState, useEffect } from 'react';
import type { DocumentOut, CreateDocumentData, UpdateDocumentData } from '../../api/documentService';

interface DocsEditorProps {
    document?: DocumentOut | null;
    mode: 'view' | 'edit' | 'create';
    onSave: (data: CreateDocumentData | UpdateDocumentData) => void;
    onCancel: () => void;
    onEdit: () => void;
    onDelete: () => void;
    userRole: string;
}

const DocsEditor: React.FC<DocsEditorProps> = ({
                                                   document,
                                                   mode,
                                                   onSave,
                                                   onCancel,
                                                   onEdit,
                                                   onDelete,
                                                   userRole
                                               }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: [] as string[],
        metadata: {} as Record<string, any>
    });
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (document && mode !== 'create') {
            setFormData({
                title: document.title,
                content: document.content,
                tags: document.tags,
                metadata: document.metadata || {}
            });
        } else if (mode === 'create') {
            setFormData({
                title: '',
                content: '',
                tags: [],
                metadata: {}
            });
        }
    }, [document, mode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const saveData = {
            title: formData.title,
            content: formData.content,
            tags: formData.tags,
            metadata: formData.metadata
        };

        onSave(saveData);
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    if (mode === 'view' && !document) {
        return (
            <div className="docs-editor">
                <div className="editor-placeholder">
                    <h2>Выберите документ для просмотра или создайте новый</h2>
                    <p>Используйте панель слева для навигации по документам</p>
                </div>
            </div>
        );
    }

    if (mode === 'view' && document) {
        return (
            <div className="docs-editor">
                <div className="editor-header">
                    <h1>{document.title}</h1>
                    <div className="editor-actions">
                        <button className="btn-edit" onClick={onEdit}>
                            Редактировать
                        </button>
                        {userRole === 'root' && (
                            <button className="btn-delete" onClick={onDelete}>
                                Удалить
                            </button>
                        )}
                    </div>
                </div>

                <div className="document-meta-info">
                    <div className="meta-item">
                        <strong>Автор:</strong> {document.author}
                    </div>
                    <div className="meta-item">
                        <strong>Создан:</strong> {new Date(document.created_at).toLocaleString()}
                    </div>
                    <div className="meta-item">
                        <strong>Обновлен:</strong> {new Date(document.updated_at).toLocaleString()}
                    </div>
                    {document.tags.length > 0 && (
                        <div className="meta-item">
                            <strong>Теги:</strong> {document.tags.join(', ')}
                        </div>
                    )}
                </div>

                <div className="document-content">
                    <div
                        className="prose"
                        dangerouslySetInnerHTML={{ __html: document.content }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="docs-editor">
            <form onSubmit={handleSubmit}>
                <div className="editor-header">
                    <h1>
                        {mode === 'create' ? 'Создание нового документа' : 'Редактирование документа'}
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
                        <label htmlFor="title">Заголовок</label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Содержание (HTML)</label>
                        <textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            rows={20}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Теги</label>
                        <div className="tags-input">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={handleTagInputKeyPress}
                                placeholder="Введите тег и нажмите Enter"
                            />
                            <button type="button" onClick={handleAddTag}>
                                Добавить
                            </button>
                        </div>
                        <div className="tags-list">
                            {formData.tags.map(tag => (
                                <span key={tag} className="tag">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Предпросмотр</label>
                        <div
                            className="preview-content"
                            dangerouslySetInnerHTML={{ __html: formData.content || '<em>Введите содержание для предпросмотра</em>' }}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DocsEditor;