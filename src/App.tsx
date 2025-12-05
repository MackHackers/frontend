// src/App.tsx
import {lazy, Suspense, useState, useEffect} from 'react'
import LoadingPage from "./components/loading/LoadingPage.tsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RedirectHandler from "./components/RedirectHandler/RedirectHandler.tsx";
import DocsPage from "./pages/Docs/Docs.tsx";
import { userService } from './api/userService';

// const Auth = lazy(() => import('./pages/Auth/Auth.tsx'));
// const NotFound = lazy(() => import('./pages/NotFoundPage/NotFound.tsx'))

import Auth from "./pages/Auth/Auth.tsx";
import NotFound from "./pages/NotFoundPage/NotFound.tsx";
import Main from "./pages/Main/Main.tsx";
import News from "./pages/News/NewsPage.tsx";

function App() {
    const [userRole, setUserRole] = useState<string>('viewer');

    useEffect(() => {
        const loadUserRole = async () => {
            try {
                const role = await userService.getUserRole();
                setUserRole(role);
            } catch (error) {
                console.error('Error loading user role:', error);
            }
        };

        loadUserRole();
    }, []);

    return (
        <Router>
            <div className="App">
                <Suspense fallback={<LoadingPage />}>
                    <Routes>
                        <Route path="/" element={<RedirectHandler />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/main" element={<Main />} />
                        <Route path="/news" element={<News />} />
                        <Route
                            path="/docs"
                            element={<DocsPage />}
                            // element={
                            //     <ProtectedRoute>
                            //         <DocsPage />
                            //     </ProtectedRoute>
                            // }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </div>
        </Router>
    );
}

export default App