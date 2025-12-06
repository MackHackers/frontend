import { useState } from "react";

// MOCK DATA
const mockNews = Array.from({ length: 40 }).map((_, i) => ({
  id: i + 1,
  title: `Новость номер ${i + 1}`,
  date: "26.02.2025",
  preview:
      "Таким образом реалищация намеченных плановых заданий позволяет оценить значимость модели развития. Разнообразный и богатый опыт дальнейшее развитие различных форм деятельности влечет за собой процесс...",
  image: "https://via.placeholder.com/280x160",
  fullText:
      "Полный текст новости. Здесь может быть большое количество информации, параграфы, описания, что угодно..."
}));

export default function NewsPage() {
  const years = [2025, 2024, 2023, 2022, 2021, 2020];
  const [visibleCount, setVisibleCount] = useState(10);

  // modal state
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
      <div className="flex w-full max-w-7xl mx-auto pt-6 gap-6">

        {/* Left Filter */}
        <aside className="w-40 bg-base-100 shadow rounded-xl p-4 h-fit">
          <h2 className="font-semibold text-lg mb-3">Все годы</h2>
          <div className="flex flex-col gap-2">
            {years.map((year) => (
                <button key={year} className="btn btn-sm btn-ghost justify-start">
                  {year}
                </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1">

          {/* Search */}
          <div className="flex gap-2 mb-4">
            <select className="select select-bordered w-40">
              <option>Все года</option>
              {years.map((year) => (
                  <option key={year}>{year}</option>
              ))}
            </select>
            <input
                type="text"
                placeholder="Поиск в базе знаний"
                className="input input-bordered flex-1"
            />
            <button className="btn btn-primary">Поиск</button>
          </div>

          {/* News List */}
          <div className="flex flex-col gap-4">
            {mockNews.slice(0, visibleCount).map((item) => (
                <div
                    key={item.id}
                    onClick={() => setSelectedNews(item)}
                    className="bg-base-100 shadow rounded-xl p-4 flex gap-4 cursor-pointer hover:bg-base-300 transition"
                >
                  {/* Image */}
                  <div className="w-[280px] h-[160px] overflow-hidden rounded-xl">
                    <img
                        src={item.image}
                        alt="news"
                        className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Text Block */}
                  <div className="flex flex-col justify-between max-h-[66%] overflow-hidden">
                    <div>
                      <p className="text-sm opacity-60 flex items-center gap-2 mb-1">
                        📅 {item.date}
                      </p>
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>

                      {/* Обрезка превью */}
                      <p className="text-sm leading-snug line-clamp-2 overflow-hidden">
                        {item.preview}
                      </p>
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {/* Load more */}
          {visibleCount < mockNews.length && (
              <div className="w-full flex justify-center mt-6">
                <button className="btn btn-outline" onClick={loadMore}>
                  Загрузить ещё
                </button>
              </div>
          )}
        </main>

        {/* MODAL PREVIEW */}
        {selectedNews && (
            <dialog className="modal modal-open" onClick={() => setSelectedNews(null)}>
              <div
                  className="modal-box max-w-3xl"
                  onClick={(e) => e.stopPropagation()} // предотвращает закрытие при клике внутри окна
              >
                <img
                    src={selectedNews.image}
                    alt="preview"
                    className="w-full h-64 object-cover rounded-xl mb-4"
                />

                <h2 className="text-2xl font-bold mb-2">
                  {selectedNews.title}
                </h2>

                <p className="text-sm opacity-60 mb-4">
                  📅 {selectedNews.date}
                </p>

                <p className="leading-relaxed whitespace-pre-line">
                  {selectedNews.fullText}
                </p>

                <div className="modal-action">
                  <button
                      className="btn"
                      onClick={() => setSelectedNews(null)}
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </dialog>
        )}
      </div>
  );
}
