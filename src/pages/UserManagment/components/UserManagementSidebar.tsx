import React, { useState } from "react";
import type { User } from "../../../api/userManagementService";

interface UserManagementSidebarProps {
  users: User[];
  onUserSelect: (user: User) => void;
  selectedUserId?: string;
  onCreateNew: () => void;
  currentUserRole: string;
}

const UserManagementSidebar: React.FC<UserManagementSidebarProps> = ({
  users,
  onUserSelect,
  selectedUserId,
  onCreateNew,
  currentUserRole,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "root":
        return "#dc2626";
      case "manager":
        return "#2563eb";
      case "viewer":
        return "#16a34a";
      default:
        return "#6b7280";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "root":
        return "Администратор";
      case "manager":
        return "Менеджер";
      case "viewer":
        return "Просмотр";
      default:
        return role;
    }
  };

  return (
    <aside className="user-management-sidebar">
      <nav className="sidebar-nav">
        <div className="sidebar-header">
          <h3>Управление пользователями</h3>
          {currentUserRole === "root" && (
            <button className="create-new-btn" onClick={onCreateNew}>
              + Создать пользователя
            </button>
          )}
        </div>

        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Поиск пользователей..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="users-list">
          {filteredUsers.length === 0 ? (
            <div className="no-users">
              {users.length === 0
                ? "Нет пользователей"
                : "Пользователи не найдены"}
            </div>
          ) : (
            <ul className="users-menu">
              {filteredUsers.map((user) => (
                <li key={user.id}>
                  <button
                    className={`user-item ${
                      selectedUserId === user.id ? "active" : ""
                    }`}
                    onClick={() => onUserSelect(user)}
                  >
                    <div className="user-main-info">
                      <div className="user-username">{user.username}</div>
                      <div
                        className="user-role-badge"
                        style={{ backgroundColor: getRoleColor(user.role) }}
                      >
                        {getRoleLabel(user.role)}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default UserManagementSidebar;
