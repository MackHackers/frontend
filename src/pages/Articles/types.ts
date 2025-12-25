export type BlockType =
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

export interface Block {
    id: string;
    type: BlockType;
    // content хранится как:
    // - HTML строка для text/title/h2/h3/info
    // - HTML строка (список) для list
    // - {text: string; url: string} для button
    // - base64 строка для media
    content: any;
}
