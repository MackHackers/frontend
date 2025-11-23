import {lazy, Suspense, useState} from 'react'
import LoadingPage from "./components/loading/LoadingPage.tsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RedirectHandler from "./components/RedirectHandler/RedirectHandler.tsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";

const Auth = lazy(() => import('./pages/Auth/Auth.tsx'));
//const Home = lazy(() => import("./pages/Home.tsx"));
const NotFound = lazy(() => import('./pages/NotFoundPage/NotFound.tsx'))

function App() {
  const [count, setCount] = useState(0)

    return (
        <Router>
            <div className="App">
                <Suspense fallback={<LoadingPage />}>
                    <Routes>
                        <Route path="/" element={<RedirectHandler />} />
                        <Route path="/auth" element={<Auth />} />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </div>
        </Router>
    );
}

export default App
