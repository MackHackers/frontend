import React from 'react';

const DocsHeader: React.FC = () => {
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
                    <button className="docs-button">
                        Docs
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DocsHeader;