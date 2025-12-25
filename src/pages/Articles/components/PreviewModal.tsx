import React from "react";
import type { Block } from "../types";

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    blocks: Block[];
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, blocks }) => {
    if (!isOpen) return null;

    return (
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
                    <button className="btn" onClick={onClose}>
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};
