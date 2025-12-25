import { useEffect } from "react";
import type { Block } from "./types";

const fadeInStyle = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export interface ArticleViewProps {
  blocks?: Block[];
  htmlContent?: string;
  author?: string;
  subtitle?: string;
  title?: string;
}

const ArticleView: React.FC<ArticleViewProps> = ({ blocks, htmlContent, author, subtitle, title }) => {
  useEffect(() => {
    if (typeof document !== "undefined") {
      const styleId = "data-article-view";
      if (!document.head.querySelector(`style[${styleId}]`)) {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = fadeInStyle;
        styleSheet.setAttribute(styleId, "true");
        document.head.appendChild(styleSheet);
      }
    }
  }, []);

  if (blocks && blocks.length > 0) {
    return (
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <header className="mb-10 pb-8 border-b border-gray-200">
          {title && (
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h1>
          )}
          {(author || subtitle) && (
            <div className="flex items-center gap-4">
              {author && (
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{author}</div>
                    {subtitle && (
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {subtitle}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </header>

        {/* BLOCKS */}
        <div className="flex flex-col gap-8 prose prose-lg max-w-none break-words">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              style={{
                animation: `fadeIn 0.5s ease-in-out forwards`,
                animationDelay: `${index * 50}ms`,
                opacity: 0,
              }}
            >
              {block.type === "title" && (
                <h1
                  className="text-4xl font-bold text-gray-900 mb-6 leading-tight"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              )}
              {block.type === "h2" && (
                <h2
                  className="text-3xl font-bold text-gray-800 mt-10 mb-4 leading-tight border-l-4 border-blue-500 pl-4"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              )}
              {block.type === "h3" && (
                <h3
                  className="text-2xl font-semibold text-gray-800 mt-8 mb-3 leading-tight"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              )}
              {block.type === "text" && (
                <div
                  className="text-gray-700 leading-relaxed text-lg"
                  style={{ lineHeight: "1.8" }}
                  dangerouslySetInnerHTML={{ __html: block.content || "" }}
                />
              )}
              {block.type === "list" && (
                <div
                  className="text-gray-700 leading-relaxed text-lg my-4"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              )}
              {block.type === "media" && typeof block.content === "string" && block.content.startsWith("data:") && (
                <div className="my-8 rounded-2xl overflow-hidden shadow-xl">
                  {block.content.startsWith("data:image") && (
                    <img src={block.content} alt="media" className="w-full h-auto object-cover" />
                  )}
                  {block.content.startsWith("data:video") && (
                    <video src={block.content} controls className="w-full h-auto rounded-2xl" />
                  )}
                </div>
              )}
              {block.type === "textMedia" && (
                <div className="flex flex-col gap-6 my-8">
                  {block.content?.text && (
                    <div
                      className="text-gray-700 leading-relaxed text-lg"
                      dangerouslySetInnerHTML={{ __html: block.content.text }}
                    />
                  )}
                  {block.content?.media && typeof block.content.media === "string" && (
                    <div className="rounded-2xl overflow-hidden shadow-xl">
                      {block.content.media.startsWith("data:image") && (
                        <img src={block.content.media} alt="media" className="w-full h-auto object-cover" />
                      )}
                      {block.content.media.startsWith("data:video") && (
                        <video src={block.content.media} controls className="w-full h-auto rounded-2xl" />
                      )}
                    </div>
                  )}
                </div>
              )}
              {block.type === "button" && (
                <div className="my-6">
                  <a href={block.content?.url || "#"} target="_blank" rel="noreferrer" className="inline-block">
                    <button className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      {block.content?.text || "Кнопка"}
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </a>
                </div>
              )}
              {block.type === "infoRed" && (
                <div
                  className="alert alert-error shadow-lg my-6 rounded-xl border-l-4 border-red-500"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              )}
              {block.type === "infoBlue" && (
                <div
                  className="alert alert-info shadow-lg my-6 rounded-xl border-l-4 border-blue-500"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              )}
            </div>
          ))}
        </div>
      </article>
    );
  }

  // Render raw HTML content if blocks are not provided
  if (htmlContent) {
    return (
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-10 pb-8 border-b border-gray-200">
          {title && (
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h1>
          )}
          {(author || subtitle) && (
            <div className="flex items-center gap-4">
              {author && (
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{author}</div>
                    {subtitle && (
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {subtitle}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </header>
        <div
          className="prose prose-lg max-w-none break-words text-gray-700 leading-relaxed"
          style={{ lineHeight: "1.8" }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    );
  }

  // Fallback when no content
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="text-gray-400 text-lg">Нет содержимого для отображения</div>
    </div>
  );
};

export default ArticleView;
