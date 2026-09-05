import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import LanguageSwitcher from './components/LanguageSwitcher';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SetPasswordPage from './pages/SetPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import MainPage from './pages/MainPage';
import GeneratePage from './pages/GeneratePage';
import PublicStatePage from './pages/PublicStatePage';
import SharePage from './pages/SharePage';
import DiscoverPage from './pages/DiscoverPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <>
      <LanguageSwitcher />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Anonymous, account-free flow: pick an emotion, get a shareable code */}
        <Route path="/share" element={<SharePage />} />
        <Route path="/discover" element={<DiscoverPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/generate" element={<GeneratePage />} />
        </Route>

        {/* Must stay before the /:username/:code catch-all so it doesn't shadow these */}
        <Route path="/:username/inscription" element={<SetPasswordPage />} />
        <Route path="/:username/reset-password" element={<ResetPasswordPage />} />

        {/* Catch-all: public state page, must stay last so it never shadows an app route */}
        <Route path="/:username/:code" element={<PublicStatePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
