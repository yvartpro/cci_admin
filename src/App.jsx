import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ArticleEditor from './pages/ArticleEditor';
import ManageArticles from './pages/ManageArticles';
import MediaLibrary from './pages/MediaLibrary';
import VolunteerEditor from './pages/VolunteerEditor';
import ManageVolunteers from './pages/ManageVolunteers';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {window.location.pathname !== '/cci/login' && window.location.pathname !== '/cci/register' && <Sidebar />}

      <main className="flex-1">
        <Routes>
          <Route path="/cci" element={<ProtectedRoute allowedRoles={[]}><Dashboard /></ProtectedRoute>} />
          <Route path="/cci/create" element={<ProtectedRoute allowedRoles={[]}><ArticleEditor /></ProtectedRoute>} />
          <Route path="/cci/media" element={<ProtectedRoute allowedRoles={[]}><MediaLibrary /></ProtectedRoute>} />
          <Route path="/cci/manage" element={<ProtectedRoute allowedRoles={[]}><ManageArticles /></ProtectedRoute>} />
          <Route path="/cci/edit/:id" element={<ProtectedRoute allowedRoles={[]}><ArticleEditor /></ProtectedRoute>} />
          <Route path="/cci/volunteers" element={<ProtectedRoute allowedRoles={[]}><ManageVolunteers /></ProtectedRoute>} />
          <Route path="/cci/volunteers/new" element={<ProtectedRoute allowedRoles={[]}><VolunteerEditor /></ProtectedRoute>} />
          <Route path="/cci/volunteers/edit/:id" element={<ProtectedRoute allowedRoles={[]}><VolunteerEditor /></ProtectedRoute>} />
          <Route path="/cci/login" element={<Login />} />
          <Route path="/cci/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
