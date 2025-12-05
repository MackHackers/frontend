import { useState } from "react";

export default function ArticlesPage() {
  const categories = [
    "Все темы",
    "Познание и преисполнение",
    "Сущности в виде гномика",
    "Любовь, смерть и роботы",
    "Стройка",
    "Котики и щенки",
    "Хлеб всему голова",
  ];

  const [selected, setSelected] = useState("Все темы");

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 flex gap-10">
      {/* Sidebar */}
      <aside className="w-64 bg-white rounded-xl shadow-sm p-4 h-fit">
        <h2 className="text-lg font-semibold mb-4">Каталог тем</h2>
        <ul className="flex flex-col gap-1">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setSelected(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg transition
${selected === cat ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className="flex-1 flex flex-col gap-6">
        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
          <input
            type="text"
            placeholder="Поиск в базе знаний"
            className="flex-1 input input-bordered"
          />
          <button className="btn btn-primary">🔍</button>
        </div>

        {/* List of articles */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl shadow-sm cursor-pointer hover:shadow transition"
          >
            <div className="text-sm text-gray-500 flex items-center gap-2 mb-1">
              📅 26.02.2025 | Автор Имя
            </div>
            <h3 className="font-semibold text-lg mb-2">
              Название статьи пример {i}
            </h3>
            <p className="text-gray-600">
              Текст статьи. Первые две строки отображаются. Продолжение скрыто
              до открытия...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
