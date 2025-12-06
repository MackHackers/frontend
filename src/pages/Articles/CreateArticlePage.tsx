import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

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
    content: string;
}

const STORAGE_KEY = "article_editor_blocks";

const CreateArticlePage: React.FC = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [showMenu, setShowMenu] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    // ---------------------------
    // LOAD DRAFT FROM LOCALSTORAGE
    // ---------------------------
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setBlocks(JSON.parse(saved));
            } catch {}
        }
    }, []);

    // ---------------------------
    // AUTOSAVE TO LOCALSTORAGE
    // ---------------------------
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
    }, [blocks]);

    const addBlock = (type: BlockType) => {
        setBlocks((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                type,
                content: "",
            },
        ]);
        setShowMenu(false);
    };

    const updateBlock = (id: string, value: string) => {
        setBlocks((prev) =>
            prev.map((b) => (b.id === id ? { ...b, content: value } : b))
        );
    };

    const removeBlock = (id: string) => {
        setBlocks((prev) => prev.filter((b) => b.id !== id));
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
                    {blocks.map((block) => (
                        <div
                            key={block.id}
                            className="bg-gray-50 p-4 rounded-xl relative"
                        >
                            {/* Delete block */}
                            <button
                                className="btn btn-xs absolute right-3 top-3"
                                onClick={() => removeBlock(block.id)}
                            >
                                ✕
                            </button>

                            {/* Render */}
                            {block.type === "title" && (
                                <input
                                    className="input input-bordered w-full text-3xl font-bold"
                                    placeholder="Заголовок"
                                    value={block.content}
                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                />
                            )}

                            {block.type === "h2" && (
                                <input
                                    className="input input-bordered w-full text-xl"
                                    placeholder="Подзаголовок H2"
                                    value={block.content}
                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                />
                            )}

                            {block.type === "h3" && (
                                <input
                                    className="input input-bordered w-full text-lg"
                                    placeholder="Подзаголовок H3"
                                    value={block.content}
                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                />
                            )}

                            {block.type === "text" && (
                                <textarea
                                    className="textarea textarea-bordered w-full min-h-[120px]"
                                    placeholder="Текст (Markdown поддерживается)"
                                    value={block.content}
                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                />
                            )}

                            {block.type === "list" && (
                                <textarea
                                    className="textarea textarea-bordered w-full min-h-[120px]"
                                    placeholder="- Элемент 1\n- Элемент 2"
                                    value={block.content}
                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                />
                            )}

                            {block.type === "media" && (
                                <input
                                    className="file-input file-input-bordered w-full"
                                    type="file"
                                />
                            )}

                            {block.type === "button" && (
                                <input
                                    className="input input-bordered w-full"
                                    placeholder="Текст кнопки"
                                    value={block.content}
                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                />
                            )}

                            {block.type === "infoRed" && (
                                <div className="alert alert-error">
                                    <input
                                        className="w-full bg-transparent"
                                        placeholder="Информационный текст"
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, e.target.value)}
                                    />
                                </div>
                            )}

                            {block.type === "infoBlue" && (
                                <div className="alert alert-info">
                                    <input
                                        className="w-full bg-transparent"
                                        placeholder="Информационный текст"
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* ADD BLOCK BUTTON */}
                <div className="mt-6">
                    <button
                        className="btn btn-outline w-full"
                        onClick={() => setShowMenu(!showMenu)}
                    >
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
                    <label
                        htmlFor="preview-modal"
                        className="btn btn-outline"
                        onClick={() => setPreviewOpen(true)}
                    >
                        Предпросмотр
                    </label>

                    <div className="flex gap-4">
                        <button className="btn btn-neutral">Отмена</button>
                        <button className="btn btn-primary">Опубликовать</button>
                    </div>
                </div>
            </div>

            {/* ------------------------------------
            MODAL PREVIEW (DaisyUI)
      ------------------------------------- */}
            {previewOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl">
                        <h3 className="font-bold text-lg mb-4">Предпросмотр статьи</h3>

                        <div className="prose max-w-none">
                            {blocks.map((block) => (
                                <div key={block.id} className="mb-6">
                                    {block.type === "title" && (
                                        <h1 className="text-3xl font-bold">{block.content}</h1>
                                    )}
                                    {block.type === "h2" && (
                                        <h2 className="text-2xl">{block.content}</h2>
                                    )}
                                    {block.type === "h3" && (
                                        <h3 className="text-xl">{block.content}</h3>
                                    )}
                                    {block.type === "text" && (
                                        <ReactMarkdown>{block.content}</ReactMarkdown>
                                    )}
                                    {block.type === "list" && (
                                        <ReactMarkdown>{block.content}</ReactMarkdown>
                                    )}
                                    {block.type === "button" && (
                                        <button className="btn btn-primary">
                                            {block.content || "Кнопка"}
                                        </button>
                                    )}
                                    {block.type === "infoRed" && (
                                        <div className="alert alert-error">{block.content}</div>
                                    )}
                                    {block.type === "infoBlue" && (
                                        <div className="alert alert-info">{block.content}</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() => setPreviewOpen(false)}
                            >
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
