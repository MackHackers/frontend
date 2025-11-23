import React from 'react';
import {useNavigate} from "react-router-dom";

const DocsHeader: React.FC = () => {
    const navigate = useNavigate();

    const handleDocsClick = () => {
        navigate('/docs');
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-left">
                    <div className="logo">
                        <div className="logo-icon">⚡</div>
                        <span className="logo-text">SetlBase</span>
                    </div>
                </div>
                <div className="header-right">
                    <button
                        className="docs-button"
                        onClick={handleDocsClick}
                    >
                        Docs
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DocsHeader;