// src/App.tsx
import { Suspense, useEffect } from "react";
import LoadingPage from "./components/loading/LoadingPage.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RedirectHandler from "./components/RedirectHandler/RedirectHandler.tsx";
import { userService } from "./api/userService";

// const Auth = lazy(() => import('./pages/Auth/Auth.tsx'));
// const NotFound = lazy(() => import('./pages/NotFoundPage/NotFound.tsx'))
import ScrollToTop from "./components/ScrollToTop.tsx";
import DocsHeader from "./components/header/header.tsx";
import Footer from "./components/Footer/Footer.tsx";
import Auth from "./pages/Auth/Auth.tsx";
import NotFound from "./pages/NotFoundPage/NotFound.tsx";
import Main from "./pages/Main/Main.tsx";
import News from "./pages/News/NewsPage.tsx";
import LearningPage from "./pages/Learning/Learning.tsx";
import ArticlesPage from "./pages/Articles/Articles.tsx";
import { Outlet } from "react-router";
import CreateArticlePage from "./pages/Articles/CreateArticlePage.tsx";
import AdminPanel from "./pages/AdminPanel/AdminPanel.tsx";
import SearchPage from "./pages/Search/SearchPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";

function BaseLayout() {
  return (
    <>
      <DocsHeader />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  useEffect(() => {
    const loadUserRole = async () => {
      try {
        await userService.getUserRole();
      } catch (error) {
        console.error("Error loading user role:", error);
      }
    };

    loadUserRole();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-w-sceen min-h-screen flex justify-center items-center bg-base-200">
        <div className="flex flex-col min-h-screen items-center w-[85%]">
          <Suspense fallback={<LoadingPage />}>
            <Routes>
              <Route path="/" element={<RedirectHandler />} />
              <Route path="/auth" element={<Auth />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<BaseLayout />}>
                  <Route path="/main" element={<Main />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/learning" element={<LearningPage />} />
                  <Route path="/articles" element={<ArticlesPage />} />
                  <Route
                    path="/create-articles"
                    element={<CreateArticlePage />}
                  />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/adminPanel" element={<AdminPanel />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}

export default App;
