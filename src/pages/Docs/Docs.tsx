import { useState } from "react";

// mock folders + files
const folderStructure = [
    {
        id: 1,
        name: "Отчёты",
        files: [
            { id: 101, name: "Годовой отчёт.pdf", type: "pdf", size: "2.1 MB" },
            { id: 102, name: "Стратегия 2025.docx", type: "docx", size: "640 KB" },
        ],
    },
    {
        id: 2,
        name: "Регламенты",
        files: [
            { id: 201, name: "Регламент безопасности.pdf", type: "pdf", size: "1.2 MB" },
            { id: 202, name: "Регламент отдела.docx", type: "docx", size: "880 KB" },
        ],
    },
    {
        id: 3,
        name: "Презентации",
        files: [
            { id: 301, name: "Презентация проекта.pptx", type: "pptx", size: "5.3 MB" },
        ],
    },
];

const latestDocs = Array.from({ length: 12 }).map((_, i) => ({
    id: 500 + i,
    name: `Документ №${i + 1}.pdf`,
    type: "pdf",
    size: `${(1 + Math.random() * 4).toFixed(1)} MB`,
}));

export default function DocsPage() {
    const [openFolder, setOpenFolder] = useState<number | null>(null);
    const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

    return (
        <div className="flex w-full max-w-7xl mx-auto pt-6 gap-6">

            {/* LEFT SIDEBAR */}
            <aside className="w-64 bg-base-100 shadow rounded-xl p-4 h-fit">
                <h2 className="font-semibold text-lg mb-3">Категории</h2>

                <div className="flex flex-col">
                    {folderStructure.map((folder) => (
                        <div key={folder.id} className="mb-2">
                            {/* folder button */}
                            <button
                                className="btn btn-sm btn-ghost justify-between w-full"
                                onClick={() =>
                                    setOpenFolder((prev) => (prev === folder.id ? null : folder.id))
                                }
                            >
                                {folder.name}
                                <span>{openFolder === folder.id ? "▲" : "▼"}</span>
                            </button>

                            {/* files inside folder */}
                            {openFolder === folder.id && (
                                <div className="ml-4 mt-2 flex flex-col gap-1">
                                    {folder.files.map((file) => (
                                        <button
                                            key={file.id}
                                            className="btn btn-xs btn-ghost justify-start text-left"
                                            onClick={() => setSelectedDoc(file)}
                                        >
                                            📄 {file.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1">

                {/* Search bar */}
                <div className="flex gap-2 mb-4">
                    <select className="select select-bordered w-40">
                        <option>Все категории</option>
                        {folderStructure.map((f) => (
                            <option key={f.id}>{f.name}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Поиск документов"
                        className="input input-bordered flex-1"
                    />

                    <button className="btn btn-primary">Поиск</button>
                </div>

                <h3 className="font-semibold text-xl mb-3">Последние документы</h3>

                {/* Documents list */}
                <div className="flex flex-col gap-3">
                    {latestDocs.map((doc) => (
                        <div
                            key={doc.id}
                            onClick={() => setSelectedDoc(doc)}
                            className="bg-base-100 shadow rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-base-300 transition"
                        >
                            <div>
                                <h4 className="font-semibold">{doc.name}</h4>
                                <p className="text-sm opacity-60">{doc.size}</p>
                            </div>

                            <div className="text-xl opacity-60">
                                📄
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* MODAL PREVIEW */}
            {selectedDoc && (
                <dialog className="modal modal-open" onClick={() => setSelectedDoc(null)}>
                    <div
                        className="modal-box max-w-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-2">{selectedDoc.name}</h2>
                        <p className="opacity-60 mb-4">Размер: {selectedDoc.size}</p>

                        <div className="p-4 border rounded-xl bg-base-200">
                            <p className="text-sm opacity-70">
                                📄 Это превью документа. Здесь можно отображать:
                                <br /> • PDF-превью,
                                <br /> • текстовую выжимку,
                                <br /> • ссылку на скачивание,
                                <br /> • встроенный viewer.
                            </p>
                        </div>

                        <div className="modal-action">
                            <button className="btn" onClick={() => setSelectedDoc(null)}>
                                Закрыть
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
}
