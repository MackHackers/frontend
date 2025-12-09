import { useState, useEffect } from "react";
import { learnService } from "../../../api/learnService";
import type { DocumentOut } from "../../../api/learnService";

export default function LearningManagement() {
  const [learning, setLearning] = useState<DocumentOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLearning, setEditingLearning] = useState<DocumentOut | null>(null);
  const [textContent, setTextContent] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    tags: "",
  });

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

  const handleOpenModal = (item?: DocumentOut) => {
    if (item) {
      setEditingLearning(item);
      setFormData({
        title: item.title,
        tags: item.tags?.filter((t) => t !== "learn").join("; ") || "",
      });
      setTextContent(item.content || "");
    } else {
      setEditingLearning(null);
      setFormData({ title: "", tags: "" });
      setTextContent("");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLearning(null);
    setFormData({ title: "", tags: "" });
    setTextContent("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const contentToSave = textContent.trim();
      const tagsArray = formData.tags
        ? formData.tags.split(";").map((t) => t.trim()).filter(Boolean)
        : [];

      if (editingLearning) {
        await learnService.updateDocument({
          ...editingLearning,
          title: formData.title,
          content: contentToSave,
          tags: [...tagsArray, "learn"],
        });
      } else {
        await learnService.createDocument({
          id: crypto.randomUUID(),
          title: formData.title,
          content: contentToSave,
          tags: [...tagsArray, "learn"],
          metadata: { type: "learn" },
          author: "",
          deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      handleCloseModal();
      loadLearning();
    } catch (error) {
      console.error("Error saving learning:", error);
      alert("Ошибка при сохранении");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Вы уверены, что хотите удалить этот материал?")) {
      try {
        await learnService.deleteDocument(id);
        loadLearning();
      } catch (error) {
        console.error("Error deleting learning:", error);
        alert("Ошибка при удалении");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-medium mb-6">Обучение</h2>

      <div className="mb-6">
        <button
          className="btn bg-[#EFF5FE] hover:bg-[#EFF5FE] text-[#3C83F6] border-none"
          onClick={() => handleOpenModal()}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3V13M3 8H13" stroke="#3C83F6" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Добавить материал
        </button>
      </div>

      <div className="space-y-4">
        {learning.length === 0 ? (
          <p className="text-center py-8 text-gray-500">Материалов для обучения пока нет</p>
        ) : (
          learning.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 hover:shadow-md transition cursor-pointer"
              onClick={() => handleOpenModal(item)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-[#41484A]">{item.title}</h3>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={(e) => handleDelete(e, item.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4H14M12.6667 4V13.3333C12.6667 14.07 12.07 14.6667 11.3333 14.6667H4.66667C3.93 14.6667 3.33333 14.07 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 1.93 5.93 1.33333 6.66667 1.33333H9.33333C10.07 1.33333 10.6667 1.93 10.6667 2.66667V4" stroke="#E55B54" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <p className="text-base text-[#41484A] line-clamp-3">{item.content}</p>
            </div>
          ))
        )}
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
                    placeholder="Название материала"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-[rgba(40,40,40,0.6)] mb-1">Теги</label>
                  <input
                    type="text"
                    className="w-full h-9 px-3 border border-[rgba(40,40,40,0.24)] rounded-md text-sm text-[#41484A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6]"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Тег1; Тег2"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-medium text-[#41484A]">Текст</h3>
                <textarea
                  className="w-full min-h-[200px] px-3 py-2 border border-[rgba(40,40,40,0.24)] rounded-md text-sm text-[#41484A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6] resize-y"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Введите текст материала..."
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
