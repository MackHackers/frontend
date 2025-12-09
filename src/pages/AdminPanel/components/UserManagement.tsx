import { useState, useEffect } from "react";
import { userManagementService } from "../../../api/userManagementService";
import type { User } from "../../../api/userManagementService";

export default function UserManagement() {
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
                    onClick={(e) => handleDelete(e, user.username || user.id)}
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

