import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SetPasswordPage from './pages/SetPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import MainPage from './pages/MainPage';
import GenerateCategoriesPage from './pages/GenerateCategoriesPage';
import GenerateSubcategoriesPage from './pages/GenerateSubcategoriesPage';
import PublicStatePage from './pages/PublicStatePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/generate" element={<GenerateCategoriesPage />} />
        <Route path="/generate/:stepId" element={<GenerateSubcategoriesPage />} />
      </Route>

      {/* Must stay before the /:username/:code catch-all so it doesn't shadow these */}
      <Route path="/:username/inscription" element={<SetPasswordPage />} />
      <Route path="/:username/reset-password" element={<ResetPasswordPage />} />

      {/* Catch-all: public state page, must stay last so it never shadows an app route */}
      <Route path="/:username/:code" element={<PublicStatePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
