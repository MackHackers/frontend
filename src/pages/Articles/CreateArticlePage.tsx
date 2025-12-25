import { useEffect, useState } from "react";
import { documentService } from "../../api/documentService";
import type { DocumentOut } from "../../api/documentService";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Block, BlockType } from "./types";
import {
    htmlToText,
    htmlToList,
    parseHtmlToBlocks,
    combineBlocksToHtml,
    defaultContentFor,
    textToHtml,
    markdownToHtml,
    listToHtml
} from "./utils/editorUtils";
import { BlockItem } from "./components/BlockItem";
import { BlockSelector } from "./components/BlockSelector";
import { PreviewModal } from "./components/PreviewModal";

const STORAGE_KEY = "article_editor_blocks_html";
const STORAGE_KEY_TITLE = "article_editor_title";
const STORAGE_KEY_TAGS = "article_editor_tags";

const CreateArticlePage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const articleId = searchParams.get("id");

    const [blocks, setBlocks] = useState<Block[]>([]);
    const [showMenu, setShowMenu] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [editMode, setEditMode] = useState<{ [key: string]: any }>({});
    const [articleTitle, setArticleTitle] = useState("");
    const [articleTags, setArticleTags] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingArticle, setEditingArticle] = useState<DocumentOut | null>(null);

    // Загрузка статьи с бэкенда
    const loadArticle = async (id: string) => {
        try {
            setLoading(true);
            const article = await documentService.getDocument(id);
            setEditingArticle(article);

            // Устанавливаем заголовок и теги
            setArticleTitle(article.title);
            const tagsWithoutArticle = article.tags?.filter(t => t !== "article") || [];
            setArticleTags(tagsWithoutArticle.join("; "));

            // Восстанавливаем блоки из metadata или парсим HTML
            const savedBlocks = article.metadata?.blocks as Block[] | undefined;
            const parsedBlocks = parseHtmlToBlocks(article.content || "", savedBlocks);

            if (parsedBlocks.length > 0) {
                setBlocks(parsedBlocks);
                initializeEditMode(parsedBlocks);
            }
        } catch (error) {
            console.error("Error loading article:", error);
            alert("Ошибка при загрузке статьи");
        } finally {
            setLoading(false);
        }
    };

    const initializeEditMode = (parsedBlocks: Block[]) => {
        const editData: { [key: string]: any } = {};
        parsedBlocks.forEach(block => {
            editData[block.id] = {
                rawText: block.type === "title" || block.type === "h2" || block.type === "h3" ||
                    block.type === "infoRed" || block.type === "infoBlue"
                    ? htmlToText(block.content)
                    : block.type === "text"
                        ? ""
                        : block.type === "list"
                            ? htmlToList(block.content)
                            : block.content,
                markdown: block.type === "text" ? htmlToText(block.content) : ""
            };
        });
        setEditMode(editData);
    };

    // Загрузка из localStorage или с бэкенда
    useEffect(() => {
        if (articleId) {
            loadArticle(articleId);
            return;
        }

        const saved = localStorage.getItem(STORAGE_KEY);
        const savedTitle = localStorage.getItem(STORAGE_KEY_TITLE);
        const savedTags = localStorage.getItem(STORAGE_KEY_TAGS);

        if (savedTitle) setArticleTitle(savedTitle);
        if (savedTags) setArticleTags(savedTags);

        if (saved) {
            try {
                const parsed = JSON.parse(saved) as Block[];
                setBlocks(parsed);
                initializeEditMode(parsed);

                if (!savedTitle && parsed.length > 0) {
                    const firstTitleBlock = parsed.find(b => b.type === "title");
                    if (firstTitleBlock) {
                        setArticleTitle(htmlToText(firstTitleBlock.content));
                    }
                }
            } catch (e) {
                console.warn("Failed to parse saved draft", e);
            }
        }
    }, [articleId]);

    // Автосохранение
    useEffect(() => {
        try {
            if (blocks.length > 0) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
            }
            if (articleTitle) {
                localStorage.setItem(STORAGE_KEY_TITLE, articleTitle);
            }
            if (articleTags) {
                localStorage.setItem(STORAGE_KEY_TAGS, articleTags);
            }
        } catch (e) {
            console.warn("Failed to save draft", e);
        }
    }, [blocks, articleTitle, articleTags]);

    const addBlock = (type: BlockType) => {
        const id = crypto.randomUUID();
        const defaultContent = defaultContentFor(type);

        setBlocks((prev) => [
            ...prev,
            {
                id,
                type,
                content: defaultContent,
            },
        ]);

        setEditMode(prev => ({
            ...prev,
            [id]: {
                rawText: "",
                markdown: "",
                listItems: type === "list" ? ["", ""] : undefined
            }
        }));

        setShowMenu(false);
    };

    const updateBlock = (id: string, value: any, isMarkdown: boolean = false) => {
        let blockType: BlockType | null = null;

        setBlocks((prev) => {
            const updated = prev.map((b) => {
                if (b.id !== id) return b;

                blockType = b.type;
                let htmlContent;

                switch (b.type) {
                    case "title":
                        htmlContent = textToHtml(value, "h1");
                        break;
                    case "h2":
                        htmlContent = textToHtml(value, "h2");
                        break;
                    case "h3":
                        htmlContent = textToHtml(value, "h3");
                        break;
                    case "text":
                        htmlContent = isMarkdown ? markdownToHtml(value) : textToHtml(value);
                        break;
                    case "infoRed":
                    case "infoBlue":
                        htmlContent = textToHtml(value, "div");
                        break;
                    case "list":
                        if (Array.isArray(value)) {
                            htmlContent = listToHtml(value);
                        } else {
                            htmlContent = b.content;
                        }
                        break;
                    default:
                        htmlContent = value;
                }

                return { ...b, content: htmlContent };
            });

            if (blockType) {
                setEditMode(prev => ({
                    ...prev,
                    [id]: {
                        ...prev[id],
                        rawText: blockType === "list" ? value : (isMarkdown ? "" : value),
                        markdown: isMarkdown ? value : (blockType === "text" ? prev[id]?.markdown || "" : "")
                    }
                }));
            }

            return updated;
        });
    };

    const removeBlock = (id: string) => {
        setBlocks((prev) => prev.filter((b) => b.id !== id));
        setEditMode(prev => {
            const newEditMode = { ...prev };
            delete newEditMode[id];
            return newEditMode;
        });
    };

    const addListItem = (id: string) => {
        const block = blocks.find(b => b.id === id);
        if (!block || block.type !== "list") return;

        const currentItems = editMode[id]?.rawText || ["", ""];
        const newItems = [...currentItems, ""];

        updateBlock(id, newItems);
    };

    const updateListItem = (id: string, index: number, value: string) => {
        const block = blocks.find(b => b.id === id);
        if (!block || block.type !== "list") return;

        const currentItems = editMode[id]?.rawText || ["", ""];
        const newItems = [...currentItems];
        newItems[index] = value;

        updateBlock(id, newItems);
    };

    const removeListItem = (id: string, index: number) => {
        const block = blocks.find(b => b.id === id);
        if (!block || block.type !== "list") return;

        const currentItems = editMode[id]?.rawText || ["", ""];
        const newItems = currentItems.filter((_: any, i: number) => i !== index);
        if (newItems.length === 0) newItems.push("");

        updateBlock(id, newItems);
    };

    const handleSave = async () => {
        if (!articleTitle.trim()) {
            alert("Пожалуйста, укажите заголовок статьи");
            return;
        }

        if (blocks.length === 0) {
            alert("Пожалуйста, добавьте хотя бы один блок");
            return;
        }

        try {
            setSaving(true);
            const htmlContent = combineBlocksToHtml(blocks);
            const tagsArray = articleTags
                ? articleTags.split(";").map((t) => t.trim()).filter(Boolean)
                : [];

            if (editingArticle) {
                await documentService.updateDocument({
                    ...editingArticle,
                    title: articleTitle,
                    content: htmlContent,
                    tags: [...tagsArray, "article"],
                    metadata: { ...editingArticle.metadata, type: "article", blocks: blocks },
                    updated_at: new Date().toISOString(),
                });
            } else {
                await documentService.createDocument({
                    id: crypto.randomUUID(),
                    title: articleTitle,
                    content: htmlContent,
                    tags: [...tagsArray, "article"],
                    metadata: { type: "article", blocks: blocks },
                    author: "",
                    deleted: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
            }

            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(STORAGE_KEY_TITLE);
            localStorage.removeItem(STORAGE_KEY_TAGS);
            setBlocks([]);
            setEditMode({});
            setArticleTitle("");
            setArticleTags("");
            setEditingArticle(null);

            alert(editingArticle ? "Статья успешно обновлена!" : "Статья успешно сохранена!");
            navigate("/articles");
        } catch (error) {
            console.error("Error saving article:", error);
            alert("Ошибка при сохранении статьи");
        } finally {
            setSaving(false);
        }
    };

    const getEditableValue = (block: Block) => {
        const editData = editMode[block.id];
        if (!editData) {
            switch (block.type) {
                case "title":
                case "h2":
                case "h3":
                case "infoRed":
                case "infoBlue":
                    return htmlToText(block.content);
                case "text":
                    return editData?.markdown || htmlToText(block.content);
                case "list":
                    return htmlToList(block.content);
                case "button":
                    return block.content || { text: "", url: "" };
                case "media":
                    return block.content || "";
                case "textMedia":
                    return block.content || { text: "", media: "" };
                default:
                    return "";
            }
        }

        if (block.type === "text") {
            return editData.markdown || htmlToText(block.content);
        }

        return editData.rawText !== undefined ? editData.rawText : block.content;
    };

    if (loading) {
        return (
            <div className="p-6 w-4xl mx-auto">
                <div className="bg-white rounded-2xl p-8 shadow-sm border">
                    <div className="text-center py-8">
                        <span className="loading loading-spinner loading-lg"></span>
                        <p className="mt-4">Загрузка статьи...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
                {/* HEADER */}
                <div className="mb-8">
                    {editingArticle && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-700">
                                Редактирование статьи: <strong>{editingArticle.title}</strong>
                            </p>
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Заголовок статьи *
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full text-2xl font-bold"
                            placeholder="Введите заголовок статьи"
                            value={articleTitle}
                            onChange={(e) => setArticleTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Теги (разделите точкой с запятой)
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="Бетон; Монолит; Стройка"
                            value={articleTags}
                            onChange={(e) => setArticleTags(e.target.value)}
                        />
                    </div>
                </div>

                {/* BLOCKS */}
                <div className="flex flex-col gap-6">
                    {blocks.map((block) => (
                        <BlockItem
                            key={block.id}
                            block={block}
                            editableValue={getEditableValue(block)}
                            onUpdate={updateBlock}
                            onRemove={removeBlock}
                            onAddListItem={addListItem}
                            onUpdateListItem={updateListItem}
                            onRemoveListItem={removeListItem}
                        />
                    ))}
                </div>

                {/* ADD BLOCK BUTTON */}
                <BlockSelector
                    isOpen={showMenu}
                    onAdd={addBlock}
                    onToggle={() => setShowMenu(!showMenu)}
                />

                {/* Preview & publish */}
                <div className="flex justify-between mt-10">
                    <button className="btn btn-outline" onClick={() => setPreviewOpen(true)}>
                        Предпросмотр
                    </button>

                    <div className="flex gap-4">
                        <button
                            className="btn btn-neutral"
                            onClick={() => {
                                if (confirm("Очистить черновик?")) {
                                    setBlocks([]);
                                    setEditMode({});
                                    setArticleTitle("");
                                    setArticleTags("");
                                    localStorage.removeItem(STORAGE_KEY);
                                    localStorage.removeItem(STORAGE_KEY_TITLE);
                                    localStorage.removeItem(STORAGE_KEY_TAGS);
                                }
                            }}
                        >
                            Отмена
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={saving || !articleTitle.trim() || blocks.length === 0}
                        >
                            {saving ? "Сохранение..." : "Сохранить"}
                        </button>
                    </div>
                </div>
            </div>

            {/* PREVIEW MODAL */}
            <PreviewModal
                isOpen={previewOpen}
                onClose={() => setPreviewOpen(false)}
                blocks={blocks}
            />
        </div>
    );
};

export default CreateArticlePage;