import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
    <div className="not-found-container">
        <h1 className="not-found-title">Error 404</h1>
        <p className="not-found-message">Page not found</p>
        <Link to="/home">
            <button className="not-found-button">Перейти на главную страницу</button>
        </Link>
    </div>
);

export default NotFound;