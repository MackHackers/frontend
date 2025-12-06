import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../api/userService";
import logo from "../../icons/logo+module.svg";
import { Link } from "react-router";

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

  const isManagerOrRoot = ["manager", "root"].includes(userRole);
  // const isRoot = userRole === "root";

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
          className="btn btn-ghost"
          src={logo}
          onClick={() => navigate("/main")}
          alt="Logo"
        />
        <Link className="btn btn-ghost" to="/news">
          Новости
        </Link>
        <Link className="btn btn-ghost" to="/learning">
          Обучение
        </Link>
        <Link className="btn btn-ghost" to="/articles">
          Статьи
        </Link>
        <Link className="btn btn-ghost" to="/docs">
          Документы
        </Link>
      </div>

      <div className="navbar-end flex items-center gap-2">
        <Link className="btn btn-ghost" to="/search">
          Поиск
        </Link>

        {isManagerOrRoot && (
          <Link className="btn btn-ghost" to="/adminPanel">
            Администрирование
          </Link>
        )}

        <Link className="btn btn-ghost" to="/account">
          Фамилия Имя
        </Link>
      </div>
    </header>
  );
};

export default DocsHeader;
