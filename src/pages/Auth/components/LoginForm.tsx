import React, { useState } from "react";
import { authService } from "../../../api/authService";
import type { LoginData } from "../../../api/authService";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(formData);
      localStorage.setItem("auth_token", response.access_token);
      localStorage.setItem("isAuthenticated", "true");
      navigate("/main");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-300 p-8 rounded-2xl w-md shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Вход в систему</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <div className="alert alert-error py-2 text-sm">{error}</div>}

        <label className="form-control w-full">
          <input
            type="text"
            name="username"
            placeholder="Email или имя пользователя"
            className="input input-bordered w-full"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>

        <label className="form-control w-full">
          <input
            type="password"
            name="password"
            placeholder="Введите пароль"
            className="input input-bordered w-full"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <button
          type="submit"
          className="btn btn-primary w-full mt-2"
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Войти"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
