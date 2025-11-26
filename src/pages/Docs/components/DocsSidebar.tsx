import React, { useState, useEffect } from "react";
import { documentService } from "../../../api/documentService";
import type { DocumentOut, SearchParams } from "../../../api/documentService";

interface DocsSidebarProps {
  onDocSelect: (docId: string) => void;
}

const DocsSidebar = ({ onDocSelect }: DocsSidebarProps) => {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["getting-started", "core-concepts"])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [menuData, setMenuData] = useState<DocumentOut[]>([]);

  const getAllDocs = async () => {
    try {
      const docs = await documentService.getAllDocuments();
      setMenuData(docs);
    } catch {
      console.log("hahah");
    }
  };

  useEffect(() => {
    getAllDocs();
  }, []);

  const handleSearch = async (query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const params: SearchParams = {
        q: query,
        limit: 10,
        offset: 0,
      };
      const response = await documentService.searchDocuments(params);
      setSearchResults(response.results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchResultClick = async (docId: string) => {
    try {
      const document = await documentService.getDocument(docId);
      onDocSelect(docId);
    } catch (error) {
      console.error("Error loading document:", error);
    }
  };

  return (
    <aside className="docs-sidebar">
      <nav className="sidebar-nav">
        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Поиск в документации..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearching && <div className="search-loading">Поиск...</div>}
        </div>

        {searchQuery && (
          <div className="search-results">
            <h4>Результаты поиска:</h4>
            {searchResults && (
              <ul className="search-results-list">
                {searchResults.map((doc) => (
                  !doc.deleted &&
                  <li key={doc.id}>
                    <button
                      className="search-result-item"
                      onClick={() => handleSearchResultClick(doc.id)}
                    >
                      <div className="search-result-title">{doc.title}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {!searchQuery && (
          <ul className="sidebar-menu">
            {menuData.map((section) => (
              <li key={section.id} className="menu-section">
                <button
                  className={`section-header ${
                    openSections.has(section.id) ? "open" : ""
                  }`}
                  onClick={() => onDocSelect(section.id)}
                >
                  {!section.deleted &&
                  <span>{section.title}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
};

export default DocsSidebar;
