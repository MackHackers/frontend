import React from 'react';

const LoadingPage: React.FC = () => (
    <div className="loading-container">
        <div className="loader">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="loader-dot" />
            ))}
        </div>
    </div>
);

export default LoadingPage;