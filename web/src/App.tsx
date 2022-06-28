import { BrowserRouter, Routes, Route, Navigate, RoutesProps } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { FeedbacksPage } from './pages/FeedbacksPage';
import { AuthContextProvider } from './contexts/AuthContext'
import { UserFeedbacks } from './pages/UserFeedbacks';
import { useAuth } from './hooks/useAuth';

const isAuthenticated = () => true;



export function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/feedbacks" element={<FeedbacksPage />} />
          <Route path="/feedbacks/:id" element={<UserFeedbacks />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

