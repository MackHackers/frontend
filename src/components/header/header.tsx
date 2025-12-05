import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../api/userService";
import logo from "../../icons/logo+module.svg";

const DocsHeader: React.FC = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>("viewer");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const role = await userService.getUserRole();
        setUserRole(role);
      } catch (error) {
        console.error("Error loading user role:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserRole();
  }, []);

  const handleDocsClick = () => {
    navigate("/docs");
  };

  const handleDocsManagementClick = () => {
    navigate("/docs-management");
  };

  const handleNewsClick = () => {
    navigate("/news");
  };

  const handleMainClick = () => {
    navigate("/main");
  };

  const isManagerOrRoot = ["manager", "root"].includes(userRole);
  const isRoot = userRole === "root";

  if (loading) {
    return (
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <img className="logo" src={logo} alt="Логотип" />
            <div className="loading-text">Загрузка...</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="navbar bg-base-200 rounded-xl shadow-md">
      <div className="navbar-start flex items-center gap-8">
        <img
          className="logo"
          src={logo}
          onClick={handleMainClick}
          alt="Логотип"
        />
        <button className="btn btn-ghost" onClick={handleNewsClick}>
          Новости
        </button>
        <button className="btn btn-ghost">Обучение</button>
        <button className="btn btn-ghost">Статьи</button>
        <button className="btn btn-ghost" onClick={handleDocsClick}>
          Документы
        </button>
      </div>

      <div className="navbar-end flex items-center gap-2">
        {isManagerOrRoot && (
          <button className="btn btn-ghost" onClick={handleDocsManagementClick}>
            Администрирование
          </button>
        )}

        <button className="btn btn-ghost">Фамилия Имя</button>
      </div>
    </header>
  );
};

export default DocsHeader;
