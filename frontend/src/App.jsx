import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { PublicLayout, AdminLayout } from './components/layout';

// Public Pages
import Home from './pages/public/Home';
import AboutPage from './pages/public/AboutPage';
import WorkPage from './pages/public/WorkPage';
import ContactPage from './pages/public/ContactPage';
import NotFound from './pages/public/NotFound';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProjects from './pages/admin/ManageProjects';
import ManageSkills from './pages/admin/ManageSkills';
import ManageExperience from './pages/admin/ManageExperience';
import ManageCertificates from './pages/admin/ManageCertificates';
import ManageSocials from './pages/admin/ManageSocials';
import ViewContacts from './pages/admin/ViewContacts';
import Profile from './pages/admin/Profile';
import EditAbout from './pages/admin/EditAbout';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Admin Login (No Layout) */}
            <Route path="/admin/login" element={<Login />} />

            {/* Admin Routes (Protected) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="skills" element={<ManageSkills />} />
              <Route path="experience" element={<ManageExperience />} />
              <Route path="certificates" element={<ManageCertificates />} />
              <Route path="socials" element={<ManageSocials />} />
              <Route path="contacts" element={<ViewContacts />} />
              <Route path="about" element={<EditAbout />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
