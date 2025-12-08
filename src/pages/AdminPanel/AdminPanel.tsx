import { useState, useEffect } from "react";
import { userService } from "../../api/userService";
import { Navigate } from "react-router-dom";
import NewsManagement from "./components/NewsManagement";
import UserManagement from "./components/UserManagement";
import ArticlesManagement from "./components/ArticlesManagement";
import LearningManagement from "./components/LearningManagement";

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
