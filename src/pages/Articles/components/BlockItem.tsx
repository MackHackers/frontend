import React from "react";
import type { Block } from "../types";

interface BlockItemProps {
    block: Block;
    editableValue: any;
    onUpdate: (id: string, value: any, isMarkdown?: boolean) => void;
    onRemove: (id: string) => void;
    onAddListItem: (id: string) => void;
    onUpdateListItem: (id: string, index: number, value: string) => void;
    onRemoveListItem: (id: string, index: number) => void;
}

export const BlockItem: React.FC<BlockItemProps> = ({
    block,
    editableValue,
    onUpdate,
    onRemove,
    onAddListItem,
    onUpdateListItem,
    onRemoveListItem
}) => {

    const handleFileRead = (file: File, callback: (result: string) => void) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) callback(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="bg-gray-50 p-4 rounded-xl relative">
            {/* Delete block */}
            <button className="btn btn-xs absolute right-3 top-3" onClick={() => onRemove(block.id)}>
                ✕
            </button>

            {/* Render editor for each type */}
            {block.type === "title" && (
                <input
                    className="input input-bordered w-full text-3xl font-bold"
                    placeholder="Заголовок"
                    value={editableValue || ""}
                    onChange={(e) => onUpdate(block.id, e.target.value)}
                />
            )}

            {block.type === "h2" && (
                <input
                    className="input input-bordered w-full text-xl"
                    placeholder="Подзаголовок H2"
                    value={editableValue || ""}
                    onChange={(e) => onUpdate(block.id, e.target.value)}
                />
            )}

            {block.type === "h3" && (
                <input
                    className="input input-bordered w-full text-lg"
                    placeholder="Подзаголовок H3"
                    value={editableValue || ""}
                    onChange={(e) => onUpdate(block.id, e.target.value)}
                />
            )}

            {block.type === "text" && (
                <textarea
                    className="textarea textarea-bordered w-full min-h-[120px]"
                    placeholder="Текст (Markdown поддерживается). Сохраняются переводы строк."
                    value={editableValue || ""}
                    onChange={(e) => onUpdate(block.id, e.target.value, true)}
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
                                onChange={(e) => onUpdateListItem(block.id, index, e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-error btn-sm"
                                onClick={() => onRemoveListItem(block.id, index)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => onAddListItem(block.id)}
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
                            if (file) {
                                handleFileRead(file, (result) => onUpdate(block.id, result));
                            }
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
                            onUpdate(block.id, { ...current, text: e.target.value }, true);
                        }}
                    />
                    <input
                        className="file-input file-input-bordered w-full"
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                handleFileRead(file, (result) => {
                                    const current = editableValue || { text: "", media: "" };
                                    onUpdate(block.id, { ...current, media: result }, true);
                                });
                            }
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
                            onUpdate(block.id, {
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
                            onUpdate(block.id, {
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
                        onChange={(e) => onUpdate(block.id, e.target.value)}
                    />
                </div>
            )}

            {block.type === "infoBlue" && (
                <div className="alert alert-info p-3">
                    <textarea
                        className="w-full bg-transparent textarea min-h-[50px]"
                        placeholder="Информационный текст"
                        value={editableValue || ""}
                        onChange={(e) => onUpdate(block.id, e.target.value)}
                    />
                </div>
            )}
        </div>
    );
};
