import { useState, useEffect } from "react";
import { newsService } from "../../api/newsService";
import type { DocumentOut } from "../../api/newsService";
import ArticleView from "../Articles/ArticleWiew";

export default function NewsPage() {
  const [news, setNews] = useState<DocumentOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedNews, setSelectedNews] = useState<DocumentOut | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const docs = await newsService.getAllDocuments();
      setNews(docs);
    } catch (error) {
      console.error("Error loading news:", error);
    } finally {
      setLoading(false);
    }
  };

  // Получаем уникальные годы из дат новостей
  const getYears = (): number[] => {
    const years = new Set<number>();
    news.forEach((item) => {
      if (item.created_at) {
        try {
          const year = new Date(item.created_at).getFullYear();
          years.add(year);
        } catch {
          // Игнорируем невалидные даты
        }
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  const years = getYears();

  // Фильтруем новости по году и поисковому запросу
  const filteredNews = news.filter((item) => {
    const yearMatch =
      !selectedYear ||
      (item.created_at &&
        new Date(item.created_at).getFullYear() === selectedYear);

    const searchMatch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return yearMatch && searchMatch;
  });

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  // Функция для получения превью текста
  const getPreview = (content: string | undefined): string => {
    if (!content) return "Нет содержимого";
    const text = content.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
    return text.length > 200 ? text.substring(0, 200) + "..." : text;
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

  // Извлечение изображения из HTML контента
  const getImageFromContent = (content: string | undefined): string | null => {
    if (!content) return null;
    
    // Пробуем найти изображение с двойными кавычками
    let imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
    
    // Пробуем найти изображение без кавычек (для base64 может быть длинным)
    imgMatch = content.match(/<img[^>]+src=([^\s>]+)/i);
    if (imgMatch && imgMatch[1]) {
      const src = imgMatch[1].replace(/["']/g, ""); // Убираем кавычки если есть
      // Проверяем, что это валидный URL или base64
      if (src.startsWith("http") || src.startsWith("data:image") || src.startsWith("/")) {
        return src;
      }
    }
    
    // Также проверяем наличие base64 изображений напрямую в контенте
    const base64Match = content.match(/data:image\/[^;]+;base64,[^"'\s<>]+/i);
    if (base64Match && base64Match[0]) {
      return base64Match[0];
    }
    
    return null;
  };

  const handleSearch = () => {
    // Поиск уже работает через фильтрацию
  };

  if (loading) {
    return (
      <div className="flex w-full max-w-7xl mx-auto pt-6 justify-center items-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Загрузка новостей...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full max-w-7xl mx-auto pt-6 gap-6">
        {/* Left Filter */}
        <aside className="w-40 bg-base-100 shadow rounded-xl p-4 h-fit">
          <h2 className="font-semibold text-lg mb-3">Все годы</h2>
          <div className="flex flex-col gap-2">
            <button
              className={`btn btn-sm btn-ghost justify-start ${
                !selectedYear ? "btn-active" : ""
              }`}
              onClick={() => setSelectedYear(null)}
            >
              Все года
            </button>
            {years.map((year) => (
              <button
                key={year}
                className={`btn btn-sm btn-ghost justify-start ${
                  selectedYear === year ? "btn-active" : ""
                }`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1">
      
          {/* News List */}
          {filteredNews.length === 0 ? (
            <div className="bg-base-100 shadow rounded-xl p-8 text-center text-gray-500">
              {searchQuery || selectedYear
                ? "Новости не найдены"
                : "Новостей пока нет"}
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {filteredNews.slice(0, visibleCount).map((item) => {
                  const imageUrl = getImageFromContent(item.content);
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedNews(item)}
                      className="bg-base-100 shadow rounded-xl p-4 flex gap-4 cursor-pointer hover:bg-base-300 transition"
                    >
                      {/* Image */}
                      {imageUrl && (
                        <div className="w-[280px] h-[160px] overflow-hidden rounded-xl flex-shrink-0">
                          <img
                            src={imageUrl}
                            alt="news"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Text Block */}
                      <div className="flex flex-col justify-between flex-1 overflow-hidden">
                        <div>
                          <p className="text-sm opacity-60 flex items-center gap-2 mb-1">
                            📅 {formatDate(item.created_at)}
                            {item.author && ` | ${item.author}`}
                          </p>
                          <h3 className="font-semibold text-lg mb-1">
                            {item.title}
                          </h3>

                          {/* Обрезка превью */}
                          <p className="text-sm leading-snug line-clamp-2 overflow-hidden">
                            {getPreview(item.content)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load more */}
              {visibleCount < filteredNews.length && (
                <div className="w-full flex justify-center mt-6">
                  <button className="btn btn-outline" onClick={loadMore}>
                    Загрузить ещё
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* MODAL PREVIEW */}
      {selectedNews && (
        <dialog
          className="modal modal-open"
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <ArticleView
              blocks={selectedNews.metadata?.blocks}
              htmlContent={selectedNews.metadata?.blocks ? undefined : selectedNews.content}
              title={selectedNews.title}
              author={selectedNews.author}
              subtitle={formatDate(selectedNews.created_at)}
            />
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedNews(null)}>
                Закрыть
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
