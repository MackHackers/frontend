import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { marked } from "marked";

type BlockType =
    | "title"
    | "h2"
    | "h3"
    | "text"
    | "media"
    | "textMedia"
    | "list"
    | "button"
    | "infoRed"
    | "infoBlue";

interface Block {
    id: string;
    type: BlockType;
    // content хранится как:
    // - HTML строка для text/title/h2/h3/info
    // - HTML строка (список) для list
    // - {text: string; url: string} для button
    // - base64 строка для media
    content: any;
}

const STORAGE_KEY = "article_editor_blocks_html";

// Утилиты для конвертации в HTML
const markdownToHtml = (markdown: string): string => {
    if (!markdown) return "";
    try {
        return marked.parse(markdown, { breaks: true }) as string;
    } catch {
        return markdown;
    }
};

const textToHtml = (text: string, tag: string = "p"): string => {
    if (!text) return "";
    return `<${tag}>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</${tag}>`;
};

const listToHtml = (items: string[]): string => {
    if (!items || items.length === 0) return "";
    const escapedItems = items.map(item =>
        `<li>${item.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</li>`
    );
    return `<ul>${escapedItems.join("")}</ul>`;
};

// Утилиты для парсинга HTML обратно в редактируемый формат
const htmlToText = (html: string): string => {
    if (!html) return "";
    // Удаляем теги для простых текстовых блоков
    return html
        .replace(/<[^>]*>/g, "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
};

const htmlToList = (html: string): string[] => {
    if (!html) return ["", ""];
    try {
        // Извлекаем содержимое li элементов
        const liMatches = html.match(/<li>(.*?)<\/li>/gs);
        if (liMatches) {
            return liMatches.map(li => {
                const content = li.replace(/<\/?li>/g, "");
                return content
                    .replace(/&lt;/g, "<")
                    .replace(/&gt;/g, ">")
                    .trim();
            });
        }
        return ["", ""];
    } catch {
        return ["", ""];
    }
};

const CreateArticlePage: React.FC = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [showMenu, setShowMenu] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [editMode, setEditMode] = useState<{ [key: string]: any }>({});

    // Загрузка из localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved) as Block[];
                setBlocks(parsed);

                // Инициализируем editMode для каждого блока
                const editData: { [key: string]: any } = {};
                parsed.forEach(block => {
                    editData[block.id] = {
                        // Для текстовых блоков извлекаем текст из HTML
                        rawText: block.type === "title" || block.type === "h2" || block.type === "h3" ||
                        block.type === "infoRed" || block.type === "infoBlue"
                            ? htmlToText(block.content)
                            : block.type === "text"
                                ? "" // Для markdown будем хранить оригинальный markdown отдельно
                                : block.type === "list"
                                    ? htmlToList(block.content)
                                    : block.content,
                        // Для текстовых блоков сохраняем оригинальный markdown
                        markdown: block.type === "text" ? htmlToText(block.content) : ""
                    };
                });
                setEditMode(editData);
            } catch (e) {
                console.warn("Failed to parse saved draft", e);
            }
        }
    }, []);

    // Автосохранение в HTML формате
    useEffect(() => {
        if (blocks.length === 0) return;

        try {
            // Сохраняем блоки в HTML формате
            localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
        } catch (e) {
            console.warn("Failed to save draft", e);
        }
    }, [blocks]);

    // Helper для создания контента по умолчанию
    const defaultContentFor = (type: BlockType) => {
        switch (type) {
            case "list":
                return listToHtml(["", ""]);
            case "button":
                return { text: "", url: "" };
            case "media":
                return ""; // base64 строка
            case "textMedia":
                return { text: markdownToHtml(""), media: "" };
            default:
                return ""; // Будет HTML строка
        }
    };

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

        // Инициализируем editMode для нового блока
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

    // Обновление блока с конвертацией в HTML
    const updateBlock = (id: string, value: any, isMarkdown: boolean = false) => {
        setBlocks((prev) =>
            prev.map((b) => {
                if (b.id !== id) return b;

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
            })
        );

        // Обновляем editMode
        setEditMode(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                rawText: b.type === "list" ? value : (isMarkdown ? "" : value),
                markdown: isMarkdown ? value : (b.type === "text" ? prev[id]?.markdown || "" : "")
            }
        }));
    };

    const removeBlock = (id: string) => {
        setBlocks((prev) => prev.filter((b) => b.id !== id));
        setEditMode(prev => {
            const newEditMode = { ...prev };
            delete newEditMode[id];
            return newEditMode;
        });
    };

    // Media file -> base64 dataURL
    const handleFileChange = (id: string, file?: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            updateBlock(id, result);
        };
        reader.readAsDataURL(file);
    };

    // List helpers
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

    // Получение редактируемого значения для блока
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

    return (
        <div className="p-6 w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
                {/* HEADER */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                    <div>
                        <div className="font-bold">Иванов Антон</div>
                        <div className="text-sm text-gray-500">Котики и щенки</div>
                    </div>
                </div>

                {/* BLOCKS */}
                <div className="flex flex-col gap-6">
                    {blocks.map((block) => {
                        const editableValue = getEditableValue(block);

                        return (
                            <div key={block.id} className="bg-gray-50 p-4 rounded-xl relative">
                                {/* Delete block */}
                                <button className="btn btn-xs absolute right-3 top-3" onClick={() => removeBlock(block.id)}>
                                    ✕
                                </button>

                                {/* Render editor for each type */}
                                {block.type === "title" && (
                                    <input
                                        className="input input-bordered w-full text-3xl font-bold"
                                        placeholder="Заголовок"
                                        value={editableValue || ""}
                                        onChange={(e) => updateBlock(block.id, e.target.value)}
                                    />
                                )}

                                {block.type === "h2" && (
                                    <input
                                        className="input input-bordered w-full text-xl"
                                        placeholder="Подзаголовок H2"
                                        value={editableValue || ""}
                                        onChange={(e) => updateBlock(block.id, e.target.value)}
                                    />
                                )}

                                {block.type === "h3" && (
                                    <input
                                        className="input input-bordered w-full text-lg"
                                        placeholder="Подзаголовок H3"
                                        value={editableValue || ""}
                                        onChange={(e) => updateBlock(block.id, e.target.value)}
                                    />
                                )}

                                {block.type === "text" && (
                                    <textarea
                                        className="textarea textarea-bordered w-full min-h-[120px]"
                                        placeholder="Текст (Markdown поддерживается). Сохраняются переводы строк."
                                        value={editableValue || ""}
                                        onChange={(e) => updateBlock(block.id, e.target.value, true)}
                                    />
                                )}

                                {/* LIST: array of items */}
                                {block.type === "list" && (
                                    <div className="flex flex-col gap-3">
                                        {(Array.isArray(editableValue) ? editableValue : []).map((item: string, index: number) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    className="input input-bordered w-full"
                                                    placeholder={`Пункт ${index + 1}`}
                                                    value={item || ""}
                                                    onChange={(e) => updateListItem(block.id, index, e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-error btn-sm"
                                                    onClick={() => removeListItem(block.id, index)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline"
                                                onClick={() => addListItem(block.id)}
                                            >
                                                + Добавить пункт
                                            </button>
                                            <div className="text-sm text-gray-400 self-center">Список будет отображён как пунктный список</div>
                                        </div>
                                    </div>
                                )}

                                {/* MEDIA: file input -> base64 */}
                                {block.type === "media" && (
                                    <div className="flex flex-col gap-2">
                                        <input
                                            className="file-input file-input-bordered w-full"
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                handleFileChange(block.id, file);
                                            }}
                                        />
                                        {block.content ? (
                                            block.content.startsWith("data:image") ? (
                                                <img src={block.content} alt="preview" className="mt-2 rounded-md max-h-64 object-contain" />
                                            ) : block.content.startsWith("data:video") ? (
                                                // eslint-disable-next-line jsx-a11y/media-has-caption
                                                <video src={block.content} controls className="mt-2 rounded-md max-h-64" />
                                            ) : null
                                        ) : null}
                                    </div>
                                )}

                                {/* textMedia: text + media */}
                                {block.type === "textMedia" && (
                                    <div className="flex flex-col gap-3">
                    <textarea
                        className="textarea textarea-bordered w-full min-h-[80px]"
                        placeholder="Текст (Markdown)"
                        value={editableValue?.text || ""}
                        onChange={(e) => {
                            const current = editableValue || { text: "", media: "" };
                            updateBlock(block.id, { ...current, text: e.target.value }, true);
                        }}
                    />
                                        <input
                                            className="file-input file-input-bordered w-full"
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    const result = reader.result as string;
                                                    const current = editableValue || { text: "", media: "" };
                                                    updateBlock(block.id, { ...current, media: result });
                                                };
                                                reader.readAsDataURL(file);
                                            }}
                                        />
                                        {editableValue?.media && (
                                            <>
                                                {typeof editableValue.media === "string" && editableValue.media.startsWith("data:image") && (
                                                    <img src={editableValue.media} alt="preview" className="mt-2 rounded-md max-h-64 object-contain" />
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* BUTTON: text + url */}
                                {block.type === "button" && (
                                    <div className="flex flex-col gap-3">
                                        <input
                                            className="input input-bordered w-full"
                                            placeholder="Текст кнопки"
                                            value={editableValue?.text || ""}
                                            onChange={(e) => {
                                                const current = editableValue || { text: "", url: "" };
                                                updateBlock(block.id, {
                                                    ...current,
                                                    text: e.target.value,
                                                });
                                            }}
                                        />
                                        <input
                                            className="input input-bordered w-full"
                                            placeholder="Ссылка (https://...)"
                                            value={editableValue?.url || ""}
                                            onChange={(e) => {
                                                const current = editableValue || { text: "", url: "" };
                                                updateBlock(block.id, {
                                                    ...current,
                                                    url: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                )}

                                {/* INFO blocks */}
                                {block.type === "infoRed" && (
                                    <div className="alert alert-error p-3">
                    <textarea
                        className="w-full bg-transparent textarea min-h-[50px]"
                        placeholder="Информационный текст"
                        value={editableValue || ""}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                    />
                                    </div>
                                )}

                                {block.type === "infoBlue" && (
                                    <div className="alert alert-info p-3">
                    <textarea
                        className="w-full bg-transparent textarea min-h-[50px]"
                        placeholder="Информационный текст"
                        value={editableValue || ""}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                    />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ADD BLOCK BUTTON */}
                <div className="mt-6">
                    <button className="btn btn-outline w-full" onClick={() => setShowMenu(!showMenu)}>
                        + Добавить блок
                    </button>

                    {showMenu && (
                        <div className="grid grid-cols-3 gap-3 mt-4 bg-gray-50 p-4 rounded-xl">
                            <button className="btn" onClick={() => addBlock("title")}>
                                Заголовок
                            </button>
                            <button className="btn" onClick={() => addBlock("h2")}>
                                Подзаголовок H2
                            </button>
                            <button className="btn" onClick={() => addBlock("h3")}>
                                Подзаголовок H3
                            </button>
                            <button className="btn" onClick={() => addBlock("text")}>
                                Текст
                            </button>
                            <button className="btn" onClick={() => addBlock("list")}>
                                Список
                            </button>
                            <button className="btn" onClick={() => addBlock("media")}>
                                Фото/видео
                            </button>
                            <button className="btn" onClick={() => addBlock("textMedia")}>
                                Текст + фото
                            </button>
                            <button className="btn" onClick={() => addBlock("button")}>
                                Кнопка
                            </button>
                            <button className="btn" onClick={() => addBlock("infoRed")}>
                                Инфо (красный)
                            </button>
                            <button className="btn" onClick={() => addBlock("infoBlue")}>
                                Инфо (синий)
                            </button>
                        </div>
                    )}
                </div>

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
                                    localStorage.removeItem(STORAGE_KEY);
                                }
                            }}
                        >
                            Отмена
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                alert("Сохранено в HTML формате! Картинки как base64, текст как HTML.");
                            }}
                        >
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>

            {/* PREVIEW MODAL */}
            {previewOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl">
                        <h3 className="font-bold text-lg mb-4">Предпросмотр статьи (HTML)</h3>

                        <div className="prose max-w-none break-words">
                            {blocks.map((block) => (
                                <div key={block.id} className="mb-6">
                                    {block.type === "title" && (
                                        <h1 className="text-3xl font-bold"
                                            dangerouslySetInnerHTML={{ __html: block.content }} />
                                    )}
                                    {block.type === "h2" && (
                                        <h2 className="text-2xl"
                                            dangerouslySetInnerHTML={{ __html: block.content }} />
                                    )}
                                    {block.type === "h3" && (
                                        <h3 className="text-xl"
                                            dangerouslySetInnerHTML={{ __html: block.content }} />
                                    )}
                                    {block.type === "text" && (
                                        <div dangerouslySetInnerHTML={{ __html: block.content }} />
                                    )}

                                    {/* list */}
                                    {block.type === "list" && (
                                        <div dangerouslySetInnerHTML={{ __html: block.content }} />
                                    )}

                                    {/* media */}
                                    {block.type === "media" && typeof block.content === "string" && block.content.startsWith("data:") && (
                                        <>
                                            {block.content.startsWith("data:image") && (
                                                <img src={block.content} alt="media" className="rounded-md max-w-full" />
                                            )}
                                            {block.content.startsWith("data:video") && (
                                                <video src={block.content} controls className="rounded-md max-w-full" />
                                            )}
                                        </>
                                    )}

                                    {/* textMedia */}
                                    {block.type === "textMedia" && (
                                        <div className="flex flex-col gap-3">
                                            {block.content?.text && (
                                                <div dangerouslySetInnerHTML={{ __html: block.content.text }} />
                                            )}
                                            {block.content?.media && typeof block.content.media === "string" && block.content.media.startsWith("data:") && (
                                                <>
                                                    {block.content.media.startsWith("data:image") && (
                                                        <img src={block.content.media} alt="media" className="rounded-md max-w-full" />
                                                    )}
                                                    {block.content.media.startsWith("data:video") && (
                                                        // eslint-disable-next-line jsx-a11y/media-has-caption
                                                        <video src={block.content.media} controls className="rounded-md max-w-full" />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {block.type === "button" && (
                                        <a href={block.content?.url || "#"} target="_blank" rel="noreferrer">
                                            <button className="btn btn-primary">{block.content?.text || "Кнопка"}</button>
                                        </a>
                                    )}

                                    {block.type === "infoRed" && (
                                        <div className="alert alert-error"
                                             dangerouslySetInnerHTML={{ __html: block.content }} />
                                    )}
                                    {block.type === "infoBlue" && (
                                        <div className="alert alert-info"
                                             dangerouslySetInnerHTML={{ __html: block.content }} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="modal-action">
                            <button className="btn" onClick={() => setPreviewOpen(false)}>
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateArticlePage;