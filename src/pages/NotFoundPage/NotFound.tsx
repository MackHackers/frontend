import React from 'react';
import { Link } from 'react-router-dom';
import Header from "../../components/header/header.tsx";
import Footer from "../../components/Footer/Footer.tsx";

const NotFound: React.FC = () => (
    <div className="not-found-container">
        <Header />
        <h1 className="not-found-title">Error 404</h1>
        <p className="not-found-message">Page not found</p>
        <Link to="/home">
            <button className="not-found-button">Перейти на главную страницу</button>
        </Link>
        <Footer/>
    </div>
);

export default NotFound;