import React from "react";
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

export interface Block {
  id: string;
  type: BlockType;
  content: any;
}

export interface ArticleViewProps {
  blocks: Block[];
  author?: string;
  subtitle?: string;
}

const ArticleView: React.FC<ArticleViewProps> = ({ blocks, author, subtitle }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* HEADER */}
      {author && (
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gray-200 rounded-xl" />
          <div>
            <div className="font-bold">{author}</div>
            {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
          </div>
        </div>
      )}

      {/* BLOCKS */}
      <div className="flex flex-col gap-6 prose max-w-none break-words whitespace-pre-line">
        {blocks.map((block) => (
          <div key={block.id}>
            {block.type === "title" && <h1 className="text-3xl font-bold">{block.content}</h1>}
            {block.type === "h2" && <h2 className="text-2xl">{block.content}</h2>}
            {block.type === "h3" && <h3 className="text-xl">{block.content}</h3>}
            {block.type === "text" && <ReactMarkdown>{block.content || ""}</ReactMarkdown>}

            {block.type === "list" && Array.isArray(block.content) && (
              <ul className="list-disc ml-6">
                {block.content.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

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

            {block.type === "textMedia" && (
              <div className="flex flex-col gap-3">
                <div>
                  <ReactMarkdown>{block.content?.text || ""}</ReactMarkdown>
                </div>
                {block.content?.media && typeof block.content.media === "string" && (
                  <>
                    {block.content.media.startsWith("data:image") && (
                      <img src={block.content.media} alt="media" className="rounded-md max-w-full" />
                    )}
                    {block.content.media.startsWith("data:video") && (
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
    </div>
  );
};

export default ArticleView;
