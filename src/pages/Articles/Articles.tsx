import { useState, useEffect } from "react";
import { documentService } from "../../api/documentService";
import type { DocumentOut } from "../../api/documentService";
import ArticleView from "./ArticleWiew";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<DocumentOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все темы");
  const [selectedArticle, setSelectedArticle] = useState<DocumentOut | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const docs = await documentService.getAllDocuments();
      // Фильтруем только статьи
      const articlesData = docs.filter(
        (doc) => !doc.deleted && (doc.tags?.includes("article") || doc.metadata?.type === "article")
      );
      setArticles(articlesData);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Получаем категории из тегов статей
  const getCategories = () => {
    const allTags = new Set<string>();
    articles.forEach((article) => {
      article.tags?.forEach((tag) => {
        if (tag !== "article") {
          allTags.add(tag);
        }
      });
    });
    return ["Все темы", ...Array.from(allTags).sort()];
  };

  const categories = getCategories();

  // Фильтруем статьи по категории и поисковому запросу
  const filteredArticles = articles.filter((article) => {
    // Фильтр по категории
    const categoryMatch =
      selectedCategory === "Все темы" ||
      article.tags?.includes(selectedCategory);

    // Фильтр по поисковому запросу
    const searchMatch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return categoryMatch && searchMatch;
  });

  // Функция для получения превью текста статьи
  const getArticlePreview = (content: string | undefined): string => {
    if (!content) return "Нет содержимого";
    // Удаляем HTML теги для превью
    const text = content.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
    // Берем первые 150 символов
    return text.length > 150 ? text.substring(0, 150) + "..." : text;
  };

  // Форматирование даты
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Дата не указана";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Дата не указана";
    }
  };

  const handleSearch = () => {
    // Поиск уже работает через фильтрацию в filteredArticles
    // Можно добавить вызов API поиска здесь, если нужно
  };

  const handleArticleClick = (article: DocumentOut) => {
    // Открываем модальное окно для просмотра статьи
    setSelectedArticle(article);
  };

  if (loading) {
    return (
      <div className="w-full mx-auto px-6 py-10 flex justify-center items-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Загрузка статей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-6 py-10 flex gap-10">
      <aside className="w-64 bg-white rounded-xl shadow-sm p-4 h-fit">
        <h2 className="text-lg font-semibold mb-4">Каталог тем</h2>
        <ul className="flex flex-col gap-1">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg transition
${selectedCategory === cat ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className="flex-1 flex flex-col gap-6">
        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
          <input
            type="text"
            placeholder="Поиск в базе знаний"
            className="flex-1 input input-bordered"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            🔍
          </button>
        </div>

        {/* List of articles */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
            {searchQuery || selectedCategory !== "Все темы"
              ? "Статьи не найдены"
              : "Статей пока нет"}
          </div>
        ) : (
          filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white p-5 rounded-xl shadow-sm cursor-pointer hover:shadow transition"
              onClick={() => handleArticleClick(article)}
            >
              <div className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                <span>📅 {formatDate(article.created_at)}</span>
                {article.author && (
                  <>
                    <span>|</span>
                    <span>Автор: {article.author || "Не указан"}</span>
                  </>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
              <p className="text-gray-600">{getArticlePreview(article.content)}</p>
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {article.tags
                    .filter((tag) => tag !== "article")
                    .map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* MODAL PREVIEW */}
      {selectedArticle && (
        <dialog className="modal modal-open" onClick={() => setSelectedArticle(null)}>
          <div
            className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <ArticleView
              blocks={selectedArticle.metadata?.blocks}
              htmlContent={selectedArticle.metadata?.blocks ? undefined : selectedArticle.content}
              title={selectedArticle.title}
              author={selectedArticle.author}
              subtitle={formatDate(selectedArticle.created_at)}
            />
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedArticle(null)}>
                Закрыть
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
