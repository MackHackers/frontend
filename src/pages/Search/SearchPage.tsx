import { useState } from "react";
import { documentService } from "../../api/documentService";
import type { SearchResponse, DocumentOut } from "../../api/documentService";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DocumentOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response: SearchResponse = await documentService.searchDocuments({
        q: query,
        limit: 50,
        offset: 0,
      });
      setResults(response.results || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error("Error searching:", error);
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (docId: string) => {
    navigate(`/docs?doc_id=${docId}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Поиск по базе знаний</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Введите запрос для поиска..."
            className="input input-bordered flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Поиск...
              </>
            ) : (
              "🔍 Поиск"
            )}
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="mb-4 text-sm text-gray-500">
          Найдено результатов: {total}
        </div>
      )}

      <div className="space-y-4">
        {results.length === 0 && !loading && query && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">Ничего не найдено</p>
            <p className="text-sm">Попробуйте изменить запрос</p>
          </div>
        )}

        {results.length === 0 && !loading && !query && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">Введите запрос для поиска</p>
            <p className="text-sm">Поиск выполняется по всем документам, статьям и новостям</p>
          </div>
        )}

        {results.map((result, index) => (
          <div
            key={result.id || index}
            className="bg-base-100 p-5 rounded-xl shadow-sm cursor-pointer hover:shadow transition"
            onClick={() => result.id && handleResultClick(result.id)}
          >
            <div className="text-sm text-gray-500 flex items-center gap-2 mb-1">
              {result.created_at && (
                <>
                  📅 {new Date(result.created_at).toLocaleDateString("ru-RU")}
                  {result.author && ` | Автор: ${result.author}`}
                </>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-2">{result.title || "Без названия"}</h3>
            <p className="text-gray-600 line-clamp-3">
              {result.content || "Нет описания"}
            </p>
            {result.tags && result.tags.length > 0 && (
              <div className="flex gap-2 mt-3">
                {result.tags.map((tag: string, i: number) => (
                  <span key={i} className="badge badge-outline badge-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

