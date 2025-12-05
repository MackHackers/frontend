import DocsHeader from '../../components/header/header.tsx';
import {useState} from "react";

const mockNews = Array.from({ length: 40 }).map((_, i) => ({
    id: i + 1,
    title: `Новость номер ${i + 1}`,
    date: '26.02.2025',
    preview: 'Таким образом реалищация намеченных плановых заданий позволяет оценить значимость модели развития. Разнообразный и богатый опыт дальнейшее развитие различных форм деятельности влечет за собой процесс...',
    image: 'https://via.placeholder.com/280x160',
}));

export default function NewsPage() {
    const years = [2025, 2024, 2023, 2022, 2021, 2020];
    const [visibleCount, setVisibleCount] = useState(10);

    const loadMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    return (
        <div className="min-h-screen bg-base-200">
            <DocsHeader />

            <div className="flex w-full max-w-7xl mx-auto pt-6 gap-6">
                {/* Left Year Filter */}
                <aside className="w-40 bg-base-100 shadow rounded-xl p-4 h-fit">
                    <h2 className="font-semibold text-lg mb-3">Все годы</h2>
                    <div className="flex flex-col gap-2">
                        {years.map((year) => (
                            <button key={year} className="btn btn-sm btn-ghost justify-start">{year}</button>
                        ))}
                    </div>
                </aside>

                {/* Main News Section */}
                <main className="flex-1">
                    {/* Search and Filter */}
                    <div className="flex gap-2 mb-4">
                        <select className="select select-bordered w-40">
                            <option>Все года</option>
                            {years.map((year) => (
                                <option key={year}>{year}</option>
                            ))}
                        </select>
                        <input type="text" placeholder="Поиск в базе знаний" className="input input-bordered flex-1" />
                        <button className="btn btn-primary">Поиск</button>
                    </div>

                    {/* News List */}
                    <div className="flex flex-col gap-4">
                        {mockNews.slice(0, visibleCount).map((item) => (
                            <div
                                key={item.id}
                                className="bg-base-100 shadow rounded-xl p-4 flex gap-4 cursor-pointer hover:bg-base-300 transition"
                            >
                                <div className="w-[280px] h-[160px] overflow-hidden rounded-xl">
                                    <img src={item.image} alt="news" className="w-full h-full object-cover" />
                                </div>

                                <div className="flex flex-col justify-between">
                                    <div>
                                        <p className="text-sm opacity-60 flex items-center gap-2 mb-1">📅 {item.date}</p>
                                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                                        <p className="text-sm leading-snug line-clamp-2">{item.preview}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More */}
                    {visibleCount < mockNews.length && (
                        <div className="w-full flex justify-center mt-6">
                            <button className="btn btn-outline" onClick={loadMore}>Загрузить ещё</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
