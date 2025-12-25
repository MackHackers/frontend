import React from "react";
import type { BlockType } from "../types";

interface BlockSelectorProps {
    isOpen: boolean;
    onAdd: (type: BlockType) => void;
    onToggle: () => void;
}

export const BlockSelector: React.FC<BlockSelectorProps> = ({ isOpen, onAdd, onToggle }) => {
    return (
        <div className="mt-6">
            <button className="btn btn-outline w-full" onClick={onToggle}>
                + Добавить блок
            </button>

            {isOpen && (
                <div className="grid grid-cols-3 gap-3 mt-4 bg-gray-50 p-4 rounded-xl">
                    <button className="btn" onClick={() => onAdd("title")}>
                        Заголовок
                    </button>
                    <button className="btn" onClick={() => onAdd("h2")}>
                        Подзаголовок H2
                    </button>
                    <button className="btn" onClick={() => onAdd("h3")}>
                        Подзаголовок H3
                    </button>
                    <button className="btn" onClick={() => onAdd("text")}>
                        Текст
                    </button>
                    <button className="btn" onClick={() => onAdd("list")}>
                        Список
                    </button>
                    <button className="btn" onClick={() => onAdd("media")}>
                        Фото/видео
                    </button>
                    <button className="btn" onClick={() => onAdd("textMedia")}>
                        Текст + фото
                    </button>
                    <button className="btn" onClick={() => onAdd("button")}>
                        Кнопка
                    </button>
                    <button className="btn" onClick={() => onAdd("infoRed")}>
                        Инфо (красный)
                    </button>
                    <button className="btn" onClick={() => onAdd("infoBlue")}>
                        Инфо (синий)
                    </button>
                </div>
            )}
        </div>
    );
};
