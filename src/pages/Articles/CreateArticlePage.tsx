import React, { useEffect, useState } from "react";
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
    // content is flexible:
    // - string for text/title/h2/h3/info
    // - string[] for list
    // - {text: string; url: string} for button
    // - dataURL string for media
    content: any;
}

const STORAGE_KEY = "article_editor_blocks_v2";

const CreateArticlePage: React.FC = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [showMenu, setShowMenu] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    // load
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved) as Block[];
                setBlocks(parsed);
            } catch (e) {
                console.warn("Failed to parse saved draft", e);
            }
        }
    }, []);

    // autosave
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
        } catch (e) {
            console.warn("Failed to save draft", e);
        }
    }, [blocks]);

    // helper to create default content depending on type
    const defaultContentFor = (type: BlockType) => {
        switch (type) {
            case "list":
                return ["", ""]; // two empty items by default
            case "button":
                return { text: "", url: "" };
            case "media":
                return ""; // dataURL string
            default:
                return "";
        }
    };

    const addBlock = (type: BlockType) => {
        setBlocks((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                type,
                content: defaultContentFor(type),
            },
        ]);
        setShowMenu(false);
    };

    const updateBlock = (id: string, value: any) => {
        setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content: value } : b)));
    };

    const removeBlock = (id: string) => {
        setBlocks((prev) => prev.filter((b) => b.id !== id));
    };

    // media file -> dataURL
    const handleFileChange = (id: string, file?: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            updateBlock(id, result);
        };
        reader.readAsDataURL(file);
    };

    // list helpers
    const addListItem = (id: string) => {
        setBlocks((prev) =>
            prev.map((b) =>
                b.id === id ? { ...b, content: Array.isArray(b.content) ? [...b.content, ""] : ["", ""] } : b
            )
        );
    };

    const updateListItem = (id: string, index: number, value: string) => {
        setBlocks((prev) =>
            prev.map((b) => {
                if (b.id !== id) return b;
                const arr = Array.isArray(b.content) ? [...b.content] : [];
                arr[index] = value;
                return { ...b, content: arr };
            })
        );
    };

    const removeListItem = (id: string, index: number) => {
        setBlocks((prev) =>
            prev.map((b) => {
                if (b.id !== id) return b;
                const arr = Array.isArray(b.content) ? b.content.filter((_: any, i: number) => i !== index) : [];
                return { ...b, content: arr };
            })
        );
    };

    // layout helper class for wrapper
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
                                    value={block.content || ""}
                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                />
                            )}

                            {block.type === "h2" && (
                                <input
                                    className="input input-bordered w-full text-xl"
                                    placeholder="Подзаголовок H2"
                                    value={block.content || ""}
                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                />
                            )}

                            {block.type === "h3" && (
                                <input
                                    className="input input-bordered w-full text-lg"
                                    placeholder="Подзаголовок H3"
                                    value={block.content || ""}
                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                />
                            )}

                            {block.type === "text" && (
                                <textarea
                                    className="textarea textarea-bordered w-full min-h-[120px]"
                                    placeholder="Текст (Markdown поддерживается). Сохраняются переводы строк."
                                    value={block.content || ""}
                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                />
                            )}

                            {/* LIST: array of items */}
                            {block.type === "list" && (
                                <div className="flex flex-col gap-3">
                                    {(Array.isArray(block.content) ? block.content : []).map((item: string, index: number) => (
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

                            {/* MEDIA: file input -> dataURL */}
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

                            {/* textMedia: text + media*/}
                            {block.type === "textMedia" && (
                                <div className="flex flex-col gap-3">
                  <textarea
                      className="textarea textarea-bordered w-full min-h-[80px]"
                      placeholder="Текст (Markdown)"
                      value={block.content?.text || ""}
                      onChange={(e) => updateBlock(block.id, { ...(block.content || {}), text: e.target.value })}
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
                                                updateBlock(block.id, { ...(block.content || {}), media: result });
                                            };
                                            reader.readAsDataURL(file);
                                        }}
                                    />
                                    {block.content?.media && (
                                        <>
                                            {typeof block.content.media === "string" && block.content.media.startsWith("data:image") && (
                                                <img src={block.content.media} alt="preview" className="mt-2 rounded-md max-h-64 object-contain" />
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
                                        value={block.content?.text || ""}
                                        onChange={(e) =>
                                            updateBlock(block.id, {
                                                ...(block.content || { text: "", url: "" }),
                                                text: e.target.value,
                                            })
                                        }
                                    />
                                    <input
                                        className="input input-bordered w-full"
                                        placeholder="Ссылка (https://...)"
                                        value={block.content?.url || ""}
                                        onChange={(e) =>
                                            updateBlock(block.id, {
                                                ...(block.content || { text: "", url: "" }),
                                                url: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            )}

                            {/* INFO blocks: wider textarea */}
                            {block.type === "infoRed" && (
                                <div className="alert alert-error p-3">
                  <textarea
                      className="w-full bg-transparent textarea min-h-[50px]"
                      placeholder="Информационный текст"
                      value={block.content || ""}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                  />
                                </div>
                            )}

                            {block.type === "infoBlue" && (
                                <div className="alert alert-info p-3">
                  <textarea
                      className="w-full bg-transparent textarea min-h-[50px]"
                      placeholder="Информационный текст"
                      value={block.content || ""}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                  />
                                </div>
                            )}
                        </div>
                    ))}
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
                                // clear local draft (confirm might be added)
                                if (confirm("Очистить черновик?")) {
                                    setBlocks([]);
                                    localStorage.removeItem(STORAGE_KEY);
                                }
                            }}
                        >
                            Отмена
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                // simple publish stub: for now just clear local draft and alert
                                alert("Опубликовать — пока заглушка. Добавьте реализацию отправки на сервер.");
                            }}
                        >
                            Опубликовать
                        </button>
                    </div>
                </div>
            </div>

            {/* PREVIEW MODAL */}
            {previewOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl">
                        <h3 className="font-bold text-lg mb-4">Предпросмотр статьи</h3>

                        <div className="prose max-w-none break-words whitespace-pre-line">
                            {blocks.map((block) => (
                                <div key={block.id} className="mb-6">
                                    {block.type === "title" && <h1 className="text-3xl font-bold">{block.content}</h1>}
                                    {block.type === "h2" && <h2 className="text-2xl">{block.content}</h2>}
                                    {block.type === "h3" && <h3 className="text-xl">{block.content}</h3>}
                                    {block.type === "text" && <ReactMarkdown>{block.content || ""}</ReactMarkdown>}

                                    {/* list */}
                                    {block.type === "list" && Array.isArray(block.content) && (
                                        <ul className="list-disc ml-6">
                                            {block.content.map((item: string, i: number) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
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
                                            <div>
                                                <ReactMarkdown>{block.content?.text || ""}</ReactMarkdown>
                                            </div>
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

                                    {block.type === "infoRed" && <div className="alert alert-error">{block.content}</div>}
                                    {block.type === "infoBlue" && <div className="alert alert-info">{block.content}</div>}
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
