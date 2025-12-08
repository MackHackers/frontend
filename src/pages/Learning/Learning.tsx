import { useState, useEffect } from "react";
import { learnService } from "../../api/learnService";
import type { DocumentOut } from "../../api/learnService";
import ArticleView from "../Articles/ArticleWiew";

export default function LearningPage() {
  const [learning, setLearning] = useState<DocumentOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все темы");
  const [selectedItem, setSelectedItem] = useState<DocumentOut | null>(null);

  useEffect(() => {
    loadLearning();
  }, []);

  const loadLearning = async () => {
    try {
      setLoading(true);
      const docs = await learnService.getAllDocuments();
      setLearning(docs);
    } catch (error) {
      console.error("Error loading learning:", error);
    } finally {
      setLoading(false);
    }
  };

  // Получаем категории из тегов материалов
  const getCategories = () => {
    const allTags = new Set<string>();
    learning.forEach((item) => {
      item.tags?.forEach((tag) => {
        if (tag !== "learn") {
          allTags.add(tag);
        }
      });
    });
    return ["Все темы", ...Array.from(allTags).sort()];
  };

  const categories = getCategories();

  // Фильтруем материалы по категории и поисковому запросу
  const filteredLearning = learning.filter((item) => {
    const categoryMatch =
      selectedCategory === "Все темы" ||
      item.tags?.includes(selectedCategory);

    const searchMatch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return categoryMatch && searchMatch;
  });

  // Функция для получения превью текста
  const getPreview = (content: string | undefined): string => {
    if (!content) return "Нет содержимого";
    const text = content.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
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
    // Поиск уже работает через фильтрацию
  };

  const handleItemClick = (item: DocumentOut) => {
    setSelectedItem(item);
  };

  if (loading) {
    return (
      <div className="w-full mx-auto px-6 py-10 flex justify-center items-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Загрузка материалов...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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

        {/* Content */}
        <div className="flex-1 flex flex-col gap-6">
          

          {filteredLearning.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
              {searchQuery || selectedCategory !== "Все темы"
                ? "Материалы не найдены"
                : "Материалов для обучения пока нет"}
            </div>
          ) : (
            filteredLearning.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-xl shadow-sm cursor-pointer hover:shadow transition"
                onClick={() => handleItemClick(item)}
              >
                <div className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                  <span>📅 {formatDate(item.created_at)}</span>
                  {item.author && (
                    <>
                      <span>|</span>
                      <span>Автор: {item.author}</span>
                    </>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{getPreview(item.content)}</p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags
                      .filter((tag) => tag !== "learn")
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
      </div>

      {/* MODAL PREVIEW */}
      {selectedItem && (
        <dialog className="modal modal-open" onClick={() => setSelectedItem(null)}>
          <div
            className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <ArticleView
              blocks={selectedItem.metadata?.blocks}
              htmlContent={selectedItem.metadata?.blocks ? undefined : selectedItem.content}
              title={selectedItem.title}
              author={selectedItem.author}
              subtitle={formatDate(selectedItem.created_at)}
            />
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedItem(null)}>
                Закрыть
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
