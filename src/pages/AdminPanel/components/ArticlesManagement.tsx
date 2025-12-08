import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { documentService } from "../../../api/documentService";
import type { DocumentOut } from "../../../api/documentService";

export default function ArticlesManagement() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<DocumentOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<DocumentOut | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [textContent, setTextContent] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    parentCategory: "",
    tags: "",
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const docs = await documentService.getAllDocuments();
      // Фильтруем только статьи
      setArticles(
        docs.filter(
          (doc) => !doc.deleted && (doc.tags?.includes("article") || doc.metadata?.type === "article")
        )
      );
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (article?: DocumentOut) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        parentCategory: "",
        tags: article.tags?.filter((t) => t !== "article").join("; ") || "",
      });
      setTextContent(article.content || "");
    } else {
      setEditingArticle(null);
      setFormData({ title: "", parentCategory: "", tags: "" });
      setTextContent("");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingArticle(null);
    setFormData({ title: "", parentCategory: "", tags: "" });
    setTextContent("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const contentToSave = textContent.trim();
      const tagsArray = formData.tags
        ? formData.tags.split(";").map((t) => t.trim()).filter(Boolean)
        : [];

      if (editingArticle) {
        await documentService.updateDocument({
          ...editingArticle,
          title: formData.title,
          content: contentToSave,
          tags: [...tagsArray, "article"],
        });
      } else {
        await documentService.createDocument({
          id: crypto.randomUUID(),
          title: formData.title,
          content: contentToSave,
          tags: [...tagsArray, "article"],
          metadata: { type: "article" },
          author: "",
          deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      handleCloseModal();
      loadArticles();
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Вы уверены, что хотите удалить эту статью?")) {
      try {
        await documentService.deleteDocument(id);
        loadArticles();
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  const categories = [
    { id: "1", name: "Категория 1", subcategories: [
      { id: "1-1", name: "Подкатегория 1", articles: ["Статья 1", "Статья 2", "Статья 3"] },
      { id: "1-2", name: "Подкатегория 2", articles: ["Этаж 11", "Этаж 12"] },
    ]},
    { id: "2", name: "Категория 2", subcategories: [] },
  ];

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-medium mb-6">Статьи</h2>

      <div className="flex gap-6">
        <aside className="w-80 bg-white rounded-3xl p-5 h-fit">
          <h3 className="text-lg font-semibold mb-4">Структура разделов</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id}>
                <button
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? "bg-[rgba(60,131,246,0.12)] text-[#3C83F6]"
                      : "hover:bg-gray-50 text-[#41484A]"
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  {category.name}
                </button>
                {selectedCategory === category.id && category.subcategories.map((subcat) => (
                  <div key={subcat.id} className="ml-6 mt-2">
                    <button
                      className="w-full text-left px-4 py-2 rounded-lg transition hover:bg-gray-50 text-[#41484A]"
                    >
                      {subcat.name}
                    </button>
                    {subcat.articles.map((article, idx) => (
                      <div key={idx} className="ml-6 mt-1">
                        <button
                          className="w-full text-left px-4 py-2 rounded-lg transition hover:bg-gray-50 text-[#41484A]"
                          onClick={() => {
                            const found = articles.find((a) => a.title === article);
                            if (found) handleOpenModal(found);
                          }}
                        >
                          {article}
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
            <div className="border-t border-dashed border-gray-300 my-2"></div>
            <button className="w-full text-left px-4 py-2 rounded-lg text-[#41484A] hover:bg-gray-50">
              + Добавить категорию
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6">
            <button
              className="btn bg-[#EFF5FE] hover:bg-[#EFF5FE] text-[#3C83F6] border-none"
              onClick={() => navigate("/create-articles")}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3V13M3 8H13" stroke="#3C83F6" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Добавить статью
            </button>
          </div>

          <div className="space-y-4">
            {articles.length === 0 ? (
              <p className="text-center py-8 text-gray-500">Статей пока нет</p>
            ) : (
              articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-3xl p-6 hover:shadow-md transition cursor-pointer"
                  onClick={() => handleOpenModal(article)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-[#41484A]">{article.title}</h3>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => handleDelete(e, article.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4H14M12.6667 4V13.3333C12.6667 14.07 12.07 14.6667 11.3333 14.6667H4.66667C3.93 14.6667 3.33333 14.07 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 1.93 5.93 1.33333 6.66667 1.33333H9.33333C10.07 1.33333 10.6667 1.93 10.6667 2.66667V4" stroke="#E55B54" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <p className="text-base text-[#41484A] line-clamp-3">{article.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="modal modal-open"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div
            className="modal-box max-w-4xl bg-white rounded-3xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div>
                <h3 className="text-xl font-medium text-[#41484A] mb-4">Настройка информации</h3>

                <div className="mb-4">
                  <label className="block text-sm text-[rgba(40,40,40,0.6)] mb-1">Наименование</label>
                  <input
                    type="text"
                    className="w-full h-9 px-3 border border-[rgba(40,40,40,0.24)] rounded-md text-sm text-[#41484A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6]"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Статья 1"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-[rgba(40,40,40,0.6)] mb-1">Родительская подкатегория</label>
                  <input
                    type="text"
                    className="w-full h-9 px-3 border border-[rgba(40,40,40,0.24)] rounded-md text-sm text-[#41484A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6]"
                    value={formData.parentCategory}
                    onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                    placeholder="Подкатегория 1"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[rgba(40,40,40,0.6)] mb-1">Теги</label>
                  <input
                    type="text"
                    className="w-full h-9 px-3 border border-[rgba(40,40,40,0.24)] rounded-md text-sm text-[#41484A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6]"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Бетон; Монолит"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium text-[#41484A]">Текст</h3>
                  <button
                    type="button"
                    className="px-4 h-9 bg-[#3C83F6] rounded-md text-sm text-white hover:bg-[#2d6fd1] flex items-center gap-1"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.75 1.75L3.5 7L8.75 12.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Редактировать текст
                  </button>
                </div>
                <textarea
                  className="w-full min-h-[200px] px-3 py-2 border border-[rgba(40,40,40,0.24)] rounded-md text-sm text-[#41484A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6] resize-y"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Введите текст статьи..."
                  required
                />
              </div>

              <div className="flex items-center gap-6 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 h-9 border border-[rgba(40,40,40,0.16)] rounded-md text-sm text-[#282828] hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 h-9 bg-[#3C83F6] rounded-md text-sm text-white hover:bg-[#2d6fd1] flex items-center gap-1"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.6667 3.5L5.25 10.5L2.33333 7.58333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

