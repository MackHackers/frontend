import { useState, useEffect } from "react";
import { userManagementService } from "../../api/userManagementService";
import type { User } from "../../api/userManagementService";
import { documentService } from "../../api/documentService";
import type { DocumentOut } from "../../api/documentService";
import { userService } from "../../api/userService";
import { Navigate, useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("news");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const role = await userService.getUserRole();
        setUserRole(role);
      } catch (error) {
        console.error("Error loading user role:", error);
        setUserRole("viewer");
      } finally {
        setLoading(false);
      }
    };
    loadUserRole();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Загрузка...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (userRole && !['manager', 'root'].includes(userRole)) {
    return <Navigate to="/docs" replace />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Администрирование</h1>

      <div className="bg-base-100 rounded-3xl shadow-lg overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-4 font-medium transition ${
              activeTab === "news"
                ? "bg-white text-[#41484A] border-b-2 border-[#3C83F6]"
                : "bg-[#EAF0F5] text-[#41484A]"
            }`}
            onClick={() => setActiveTab("news")}
          >
            Новости
          </button>
          <button
            className={`px-6 py-4 font-medium transition relative ${
              activeTab === "articles"
                ? "bg-white text-[#41484A] border-b-2 border-[#3C83F6]"
                : "bg-[#EAF0F5] text-[#41484A]"
            }`}
            onClick={() => setActiveTab("articles")}
          >
            Статьи
            {activeTab !== "articles" && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#E55B54] rounded-full"></span>
            )}
          </button>
          <button
            className={`px-6 py-4 font-medium transition ${
              activeTab === "learning"
                ? "bg-white text-[#41484A] border-b-2 border-[#3C83F6]"
                : "bg-[#EAF0F5] text-[#41484A]"
            }`}
            onClick={() => setActiveTab("learning")}
          >
            Обучение
          </button>
          <button
            className={`px-6 py-4 font-medium transition ${
              activeTab === "users"
                ? "bg-white text-[#41484A] border-b-2 border-[#3C83F6]"
                : "bg-[#EAF0F5] text-[#41484A]"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Пользователи
          </button>
        </div>

        <div className="bg-white rounded-b-3xl p-8">
          {activeTab === "news" && <NewsManagement />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "articles" && <ArticlesManagement />}
          {activeTab === "learning" && <LearningManagement />}
        </div>
      </div>
    </div>
  );
}

function NewsManagement() {
  const [news, setNews] = useState<DocumentOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<DocumentOut | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Все темы");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    dateRange: "",
    company: "",
    users: [] as string[],
  });
  const [photo, setPhoto] = useState<{ file: File | null; preview: string | null }>({ file: null, preview: null });
  const [textContent, setTextContent] = useState<string>("");

  const categories = [
    "Все темы",
    "Познание и преисполнение",
    "Сущности в виде гномика",
    "Любовь, смерть и роботы",
    "Стройка",
    "Котики и щенки",
    "Хлеб всему голова",
  ];

  const mockUsers = [
    "Белоконь Анастасия Владимировна",
    "Сенкевич Анастасия Александровна",
    "Иванов Иван Иванович",
    "Сидоров Александр Викторович",
  ];

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const docs = await documentService.getAllDocuments();
      setNews(docs.filter((doc) => 
        !doc.deleted && (doc.tags?.includes("news") || doc.metadata?.type === "news")
      ));
    } catch (error) {
      console.error("Error loading news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: DocumentOut) => {
    if (item) {
      setEditingNews(item);
      setFormData({
        title: item.title,
        content: item.content,
        tags: item.tags || [],
        dateRange: "06.12.2025-31.12.2025",
        company: 'ООО "Вторая тестовая очень длинное название компании которое не вмешается в одну строку"',
        users: mockUsers,
      });
      setTextContent(item.content || "");
      setPhoto({ file: null, preview: null });
    } else {
      setEditingNews(null);
      setFormData({
        title: "",
        content: "",
        tags: [],
        dateRange: "",
        company: "",
        users: [],
      });
      setTextContent("");
      setPhoto({ file: null, preview: null });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNews(null);
    setFormData({
      title: "",
      content: "",
      tags: [],
      dateRange: "",
      company: "",
      users: [],
    });
    setTextContent("");
    setPhoto({ file: null, preview: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await documentService.updateDocument({
          ...editingNews,
          title: formData.title,
          content: textContent,
          tags: formData.tags,
        });
      } else {
        await documentService.createDocument({
          id: crypto.randomUUID(),
          title: formData.title,
          content: textContent,
          tags: [...formData.tags, "news"],
          metadata: { type: "news" },
          author: "",
          deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      handleCloseModal();
      loadNews();
    } catch (error) {
      console.error("Error saving news:", error);
    }
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto({ file, preview: reader.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      setPhoto({ file: null, preview: null });
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Вы уверены, что хотите удалить эту новость?")) {
      try {
        await documentService.deleteDocument(id);
        loadNews();
      } catch (error) {
        console.error("Error deleting news:", error);
        alert("Ошибка при удалении новости");
      }
    }
  };

  const filteredNews = news.filter((item) => {
    const matchesSearch = searchQuery === "" || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Все темы" || item.tags?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      {/* Верхняя секция с информацией о новости */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-3xl font-medium mb-2">Новости</h2>
            <div className="flex items-center gap-2 text-sm text-[#90A5BB]">
              <span>06.12.2025-31.12.2025</span>
              <span>•</span>
              <span className="max-w-md truncate">
                ООО "Вторая тестовая очень длинное название компании которое не вмешается в одну строку"
              </span>
            </div>
          </div>
          <button
            className="btn btn-ghost bg-[#EEF3F9] hover:bg-[#EEF3F9] w-12 h-12 p-0"
            onClick={() => handleOpenModal()}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 14.375V17.5H5.625L14.8417 8.28333L11.7167 5.15833L2.5 14.375ZM17.2583 5.86667C17.5833 5.54167 17.5833 5.01667 17.2583 4.69167L15.3083 2.74167C14.9833 2.41667 14.4583 2.41667 14.1333 2.74167L12.725 4.15L15.85 7.275L17.2583 5.86667Z" fill="#282828"/>
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {mockUsers.map((user, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-2 py-1 bg-[#FBFBFB] border border-[#DDDDDD] rounded text-sm text-[#7E7E7E]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7C8.933 7 10.5 5.433 10.5 3.5C10.5 1.567 8.933 0 7 0C5.067 0 3.5 1.567 3.5 3.5C3.5 5.433 5.067 7 7 7ZM7 8.75C4.58275 8.75 0 9.92275 0 12.25V14H14V12.25C14 9.92275 9.41725 8.75 7 8.75Z" fill="#A9A9A9"/>
              </svg>
              <span>{user}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Двухколоночный макет */}
      <div className="flex gap-6">
        {/* Левая колонка - Каталог тем */}
        <aside className="w-80 bg-white rounded-3xl p-5 h-fit">
          <h3 className="text-lg font-semibold mb-4">Каталог тем</h3>
          <div className="space-y-2">
            {categories.map((cat, idx) => (
              <div key={cat}>
                {idx === 4 && <div className="border-t border-dashed border-gray-300 my-2"></div>}
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    selectedCategory === cat
                      ? "bg-[rgba(60,131,246,0.12)] text-[#3C83F6]"
                      : "hover:bg-gray-50 text-[#41484A]"
                  }`}
                >
                  {cat}
                </button>
              </div>
            ))}
            <div className="border-t border-dashed border-gray-300 my-2"></div>
            <button className="w-full text-left px-4 py-2 rounded-lg text-[#41484A] hover:bg-gray-50">
              + добавить категорию
            </button>
          </div>
        </aside>

        {/* Правая колонка - Поиск и список новостей */}
        <div className="flex-1">
          <div className="mb-6 space-y-6">
            {/* Поиск */}
            <div className="flex items-center gap-2 bg-white border border-[#EAF0F5] rounded-xl px-4 py-2">
              <input
                type="text"
                placeholder="Поиск в базе знаний"
                className="flex-1 outline-none text-sm text-[#CBCBCB]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary btn-sm bg-[#3C83F6] border-none">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.3333 10H10.6267L10.36 9.74667C11.1733 8.76 11.6667 7.49333 11.6667 6.16667C11.6667 2.92667 9.07333 0.333333 5.83333 0.333333C2.59333 0.333333 0 2.92667 0 6.16667C0 9.40667 2.59333 12 5.83333 12C7.16 12 8.42667 11.5067 9.41333 10.6933L9.66667 10.96V11.6667L14.3333 16.2933L15.7067 14.92L11.3333 10ZM5.83333 10C3.53333 10 1.66667 8.13333 1.66667 5.83333C1.66667 3.53333 3.53333 1.66667 5.83333 1.66667C8.13333 1.66667 10 3.53333 10 5.83333C10 8.13333 8.13333 10 5.83333 10Z" fill="white"/>
                </svg>
              </button>
            </div>

            {/* Кнопка добавления */}
            <button
              className="btn bg-[#EFF5FE] hover:bg-[#EFF5FE] text-[#3C83F6] border-none"
              onClick={() => handleOpenModal()}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3V13M3 8H13" stroke="#3C83F6" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Добавить новость
            </button>
          </div>

          {/* Список новостей */}
          <div className="space-y-6">
            {filteredNews.length === 0 ? (
              <p className="text-center py-8 text-gray-500">Новостей пока нет</p>
            ) : (
              filteredNews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-6 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3 text-sm text-[rgba(40,40,40,0.6)]">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.6667 2H3.33333C2.59667 2 2 2.59667 2 3.33333V12.6667C2 13.4033 2.59667 14 3.33333 14H12.6667C13.4033 14 14 13.4033 14 12.6667V3.33333C14 2.59667 13.4033 2 12.6667 2ZM12.6667 12.6667H3.33333V5.33333H12.6667V12.6667Z" fill="rgba(40,40,40,0.6)"/>
                      </svg>
                      <span>{new Date(item.created_at).toLocaleDateString("ru-RU")}</span>
                      <span>|</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 7C9.10457 7 10 6.10457 10 5C10 3.89543 9.10457 3 8 3C6.89543 3 6 3.89543 6 5C6 6.10457 6.89543 7 8 7Z" fill="rgba(40,40,40,0.6)"/>
                        <path d="M8 8.5C5.79086 8.5 4 9.29086 4 10.5V11.5H12V10.5C12 9.29086 10.2091 8.5 8 8.5Z" fill="rgba(40,40,40,0.6)"/>
                      </svg>
                      <span>{item.author || "Константинопольский К.К."}</span>
                    </div>
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
                  {item.tags && item.tags.length > 0 && (
                    <div className="mb-3">
                      <span className="inline-flex items-center px-2 py-1 bg-[#FBFBFB] border border-[#DDDDDD] rounded text-sm text-[#7E7E7E]">
                        {item.tags.find((t) => t !== "news") || item.tags[0]}
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold mb-2 text-[#41484A]">{item.title}</h3>
                  <p className="text-base text-[#41484A] line-clamp-3">{item.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно для создания/редактирования */}
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
              {/* Заголовок */}
              <div>
                <h3 className="text-xl font-medium text-[#41484A] mb-4">Настройка информации</h3>
                
                {/* Поле Наименование */}
                <div className="mb-4">
                  <label className="block text-sm text-[rgba(40,40,40,0.6)] mb-1">Наименование</label>
                  <input
                    type="text"
                    className="w-full h-9 px-3 border border-[rgba(40,40,40,0.24)] rounded-md text-sm text-[#41484A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6]"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Назову планету именем твоим"
                    required
                  />
                </div>
              </div>

              {/* Загрузка фотографии */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-medium text-[#41484A]">Фотография</h3>
                <div className="flex items-center gap-3">
                  {photo.preview ? (
                    <div className="relative">
                      <img
                        src={photo.preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleFileChange(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleFileChange(file);
                        }}
                      />
                      <div className="px-4 py-3 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                        Выберите фотографию
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Секция Текст */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-medium text-[#41484A]">Текст</h3>
                <textarea
                  className="w-full min-h-[200px] px-4 py-3 border border-[rgba(40,40,40,0.24)] rounded-md text-sm text-[#41484A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6] resize-none"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Введите текст новости..."
                />
              </div>

              {/* Кнопки действий */}
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

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    organization: "",
    position: "",
    id: "",
    role: "viewer" as "viewer" | "manager" | "root",
    email: "",
    password: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userManagementService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        fullName: user.username || "",
        username: user.username || "",
        organization: "",
        position: "",
        id: user.id || "",
        role: user.role,
        email: "",
        password: "",
      });
    } else {
      setEditingUser(null);
      setFormData({
        fullName: "",
        username: "",
        organization: "",
        position: "",
        id: "",
        role: "viewer",
        email: "",
        password: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      fullName: "",
      username: "",
      organization: "",
      position: "",
      id: "",
      role: "viewer",
      email: "",
      password: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        alert("Обновление пользователей пока не реализовано в API");
      } else {
        await userManagementService.createUser({
          username: formData.username,
          password: formData.password,
          role: formData.role,
        });
      }
      handleCloseModal();
      loadUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Ошибка при сохранении пользователя");
    }
  };

  const handleDelete = async (e: React.MouseEvent, userId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      try {
        await userManagementService.deleteUser(userId);
        loadUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Ошибка при удалении пользователя");
      }
    }
  };

  const handleResetPassword = async () => {
    if (editingUser && confirm("Вы уверены, что хотите сбросить пароль?")) {
      alert("Сброс пароля пока не реализован в API");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-medium mb-6">Пользователи</h2>

      <div className="bg-white rounded-3xl overflow-hidden border border-[#EAF0F5]">
        <table className="w-full">
          <thead>
            <tr className="bg-[rgba(255,255,255,0.06)] border-b border-white">
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-[#66788C] border-r border-white">
                ФИО
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-[#66788C] border-r border-white">
                Логин
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-[#66788C] border-r border-white">
                Организация
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-[#66788C] border-r border-white">
                Должность
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-[#66788C] border-r border-white">
                ID
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id || index}
                className={`border-b border-white hover:bg-[#EFF5FE] cursor-pointer ${
                  index % 2 === 1 ? "bg-[#EFF5FE]" : "bg-transparent"
                }`}
                onClick={() => handleOpenModal(user)}
              >
                <td className="px-3 py-2.5 text-sm text-[#41484A] border-r border-white">
                  {user.username || "—"}
                </td>
                <td className="px-3 py-2.5 text-sm text-[#41484A] border-r border-white">
                  {user.username || "—"}
                </td>
                <td className="px-3 py-2.5 text-sm text-[#41484A] border-r border-white">—</td>
                <td className="px-3 py-2.5 text-sm text-[#41484A] border-r border-white">—</td>
                <td className="px-3 py-2.5 text-sm text-[#41484A] border-r border-white relative">
                  {user.id || "—"}
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={(e) => handleDelete(e, user.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 4H14M12.6667 4V13.3333C12.6667 14.07 12.07 14.6667 11.3333 14.6667H4.66667C3.93 14.6667 3.33333 14.07 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 1.93 5.93 1.33333 6.66667 1.33333H9.33333C10.07 1.33333 10.6667 1.93 10.6667 2.66667V4" stroke="#E55B54" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            <tr
              className="border-b border-white hover:bg-[#EFF5FE] cursor-pointer"
              onClick={() => handleOpenModal()}
            >
              <td colSpan={5} className="px-3 py-2.5 text-sm text-[#41484A]">
                + Добавить пользователя
              </td>
            </tr>
          </tbody>
        </table>
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
            className="modal-box max-w-2xl bg-white rounded-3xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h3 className="text-xl font-medium text-[#41484A] mb-4">Настройка информации</h3>

              <div>
                <label className="block text-sm text-[rgba(40,40,40,0.6)] mb-1">ФИО</label>
                <input
                  type="text"
                  className="w-full h-9 px-3 border border-[rgba(40,40,40,0.24)] rounded-md text-sm text-[#41484A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6]"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[rgba(40,40,40,0.6)] mb-1">Логин</label>
                <input
                  type="text"
                  className="w-full h-9 px-3 border border-[rgba(40,40,40,0.24)] rounded-md text-sm text-[#41484A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6]"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={!!editingUser}
                />
              </div>

              <div>
                <label className="block text-sm text-[rgba(40,40,40,0.6)] mb-1">Организация</label>
                <input
                  type="text"
                  className="w-full h-9 px-3 border border-[rgba(40,40,40,0.24)] rounded-md text-sm text-[#41484A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6]"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-[rgba(40,40,40,0.6)] mb-1">Должность</label>
                <input
                  type="text"
                  className="w-full h-9 px-3 border border-[rgba(40,40,40,0.24)] rounded-md text-sm text-[#41484A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6]"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-[rgba(40,40,40,0.6)] mb-1">ID</label>
                <input
                  type="text"
                  className="w-full h-9 px-3 border border-[rgba(40,40,40,0.24)] rounded-md text-sm text-[#41484A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6]"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-[rgba(40,40,40,0.6)] mb-1">Роль</label>
                <select
                  className="w-full h-9 px-3 border border-[rgba(40,40,40,0.24)] rounded-md text-sm text-[#41484A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6]"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "viewer" | "manager" | "root",
                    })
                  }
                >
                  <option value="viewer">Reader</option>
                  <option value="manager">Manager</option>
                  <option value="root">Root</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-[rgba(40,40,40,0.6)] mb-1">Электронная почта</label>
                <input
                  type="email"
                  className="w-full h-9 px-3 border border-[rgba(40,40,40,0.24)] rounded-md text-sm text-[#41484A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6]"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {editingUser && (
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="px-4 h-9 border border-[rgba(40,40,40,0.16)] rounded-md text-sm text-[#282828] hover:bg-gray-50"
                >
                  Сброс пароля
                </button>
              )}

              {!editingUser && (
                <div>
                  <label className="block text-sm text-[rgba(40,40,40,0.6)] mb-1">Пароль</label>
                  <input
                    type="password"
                    className="w-full h-9 px-3 border border-[rgba(40,40,40,0.24)] rounded-md text-sm text-[#41484A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6]"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="flex items-center gap-6 justify-end mt-4">
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

function ArticlesManagement() {
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

function LearningManagement() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Управление обучением</h2>
      <p className="text-gray-500">Раздел в разработке</p>
    </div>
  );
}

