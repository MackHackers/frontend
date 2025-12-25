import { marked } from "marked";
import { Block, BlockType } from "../types";

// Утилиты для конвертации в HTML
export const markdownToHtml = (markdown: string): string => {
    if (!markdown) return "";
    try {
        return marked.parse(markdown, { breaks: true }) as string;
    } catch {
        return markdown;
    }
};

export const textToHtml = (text: string, tag: string = "p"): string => {
    if (!text) return "";
    return `<${tag}>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</${tag}>`;
};

export const listToHtml = (items: string[]): string => {
    if (!items || items.length === 0) return "";
    const escapedItems = items.map(item =>
        `<li>${item.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</li>`
    );
    return `<ul>${escapedItems.join("")}</ul>`;
};

// Утилиты для парсинга HTML обратно в редактируемый формат
export const htmlToText = (html: string): string => {
    if (!html) return "";
    // Удаляем теги для простых текстовых блоков
    return html
        .replace(/<[^>]*>/g, "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
};

export const htmlToList = (html: string): string[] => {
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

// Функция для парсинга HTML контента обратно в блоки
export const parseHtmlToBlocks = (html: string, savedBlocks?: Block[]): Block[] => {
    // Если есть сохраненные блоки в metadata, используем их
    if (savedBlocks && savedBlocks.length > 0) {
        return savedBlocks;
    }

    // Иначе пытаемся парсить HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const blocks: Block[] = [];

    // Простой парсер для основных элементов
    Array.from(tempDiv.children).forEach((element) => {
        const tagName = element.tagName.toLowerCase();
        const id = crypto.randomUUID();

        switch (tagName) {
            case "h1":
                blocks.push({
                    id,
                    type: "title",
                    content: textToHtml(element.textContent || "", "h1")
                });
                break;
            case "h2":
                blocks.push({
                    id,
                    type: "h2",
                    content: textToHtml(element.textContent || "", "h2")
                });
                break;
            case "h3":
                blocks.push({
                    id,
                    type: "h3",
                    content: textToHtml(element.textContent || "", "h3")
                });
                break;
            case "ul":
                const items: string[] = [];
                element.querySelectorAll("li").forEach(li => {
                    items.push(li.textContent || "");
                });
                blocks.push({
                    id,
                    type: "list",
                    content: listToHtml(items)
                });
                break;
            case "p":
            case "div":
                blocks.push({
                    id,
                    type: "text",
                    content: element.innerHTML
                });
                break;
            case "img":
                const imgSrc = element.getAttribute("src") || "";
                if (imgSrc.startsWith("data:")) {
                    blocks.push({
                        id,
                        type: "media",
                        content: imgSrc
                    });
                }
                break;
        }
    });

    return blocks;
};

// Функция для объединения всех блоков в HTML контент
export const combineBlocksToHtml = (blocks: Block[]): string => {
    return blocks.map(block => {
        switch (block.type) {
            case "title":
            case "h2":
            case "h3":
            case "text":
            case "infoRed":
            case "infoBlue":
                return block.content;
            case "list":
                return block.content;
            case "media":
                if (typeof block.content === "string" && block.content.startsWith("data:")) {
                    return block.content.startsWith("data:image")
                        ? `<img src="${block.content}" alt="media" class="rounded-md max-w-full" />`
                        : block.content.startsWith("data:video")
                            ? `<video src="${block.content}" controls class="rounded-md max-w-full"></video>`
                            : "";
                }
                return "";
            case "textMedia":
                const textMedia = block.content || { text: "", media: "" };
                let result = textMedia.text || "";
                if (textMedia.media && typeof textMedia.media === "string" && textMedia.media.startsWith("data:")) {
                    if (textMedia.media.startsWith("data:image")) {
                        result += `<img src="${textMedia.media}" alt="media" class="rounded-md max-w-full" />`;
                    } else if (textMedia.media.startsWith("data:video")) {
                        result += `<video src="${textMedia.media}" controls class="rounded-md max-w-full"></video>`;
                    }
                }
                return result;
            case "button":
                const button = block.content || { text: "", url: "" };
                return `<a href="${button.url || "#"}" target="_blank" rel="noreferrer"><button class="btn btn-primary">${button.text || "Кнопка"}</button></a>`;
            default:
                return "";
        }
    }).join("");
};

// Helper для создания контента по умолчанию
export const defaultContentFor = (type: BlockType) => {
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
