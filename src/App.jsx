import { Routes, Route, useLocation } from 'react-router-dom';
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
import CarouselEditor from './pages/CarouselEditor';
import ManageCarousels from './pages/ManageCarousels';
import PartnerEditor from './pages/PartnerEditor';
import ManagePartners from './pages/ManagePartners';
import TitleEditor from './pages/TitleEditor';
import ManageTitles from './pages/ManageTitles';
import ManageComitards from './pages/ManageComitards';
import ComitardEditor from './pages/ComitardEditor';

function App() {
  const location = useLocation();
  const hideSidebar = location.pathname === '/cci/login' || location.pathname === '/cci/register';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {!hideSidebar && <Sidebar />}

      <main className="flex-1 flex flex-col overflow-y-auto">
        <Routes>
          <Route path="/cci" element={<ProtectedRoute allowedRoles={["admin", "editor"]}><Dashboard /></ProtectedRoute>} />
          <Route path="/cci/create" element={<ProtectedRoute allowedRoles={["admin", "editor"]}><ArticleEditor /></ProtectedRoute>} />
          <Route path="/cci/media" element={<ProtectedRoute allowedRoles={["admin", "editor"]}><MediaLibrary /></ProtectedRoute>} />
          <Route path="/cci/manage" element={<ProtectedRoute allowedRoles={["admin", "editor"]}><ManageArticles /></ProtectedRoute>} />
          <Route path="/cci/edit/:id" element={<ProtectedRoute allowedRoles={["admin", "editor"]}><ArticleEditor /></ProtectedRoute>} />
          <Route path="/cci/volunteer" element={<ProtectedRoute allowedRoles={["admin"]}><ManageVolunteers /></ProtectedRoute>} />
          <Route path="/cci/volunteer/new" element={<ProtectedRoute allowedRoles={["admin"]}><VolunteerEditor /></ProtectedRoute>} />
          <Route path="/cci/volunteer/edit/:id" element={<ProtectedRoute allowedRoles={["admin"]}><VolunteerEditor /></ProtectedRoute>} />
          <Route path="/cci/carousel" element={<ProtectedRoute allowedRoles={["admin"]}><ManageCarousels /></ProtectedRoute>} />
          <Route path="/cci/carousel/new" element={<ProtectedRoute allowedRoles={["admin"]}><CarouselEditor /></ProtectedRoute>} />
          <Route path="/cci/carousel/edit/:id" element={<ProtectedRoute allowedRoles={["admin"]}><CarouselEditor /></ProtectedRoute>} />
          <Route path="/cci/partner" element={<ProtectedRoute allowedRoles={["admin"]}><ManagePartners /></ProtectedRoute>} />
          <Route path="/cci/partner/new" element={<ProtectedRoute allowedRoles={["admin"]}><PartnerEditor /></ProtectedRoute>} />
          <Route path="/cci/partner/edit/:id" element={<ProtectedRoute allowedRoles={["admin"]}><PartnerEditor /></ProtectedRoute>} />
          <Route path="/cci/title" element={<ProtectedRoute allowedRoles={["admin"]}><ManageTitles /></ProtectedRoute>} />
          <Route path="/cci/title/new" element={<ProtectedRoute allowedRoles={["admin"]}><TitleEditor /></ProtectedRoute>} />
          <Route path="/cci/title/edit/:id" element={<ProtectedRoute allowedRoles={["admin"]}><TitleEditor /></ProtectedRoute>} />
          <Route path="/cci/comitard" element={<ProtectedRoute allowedRoles={["admin"]}><ManageComitards /></ProtectedRoute>} />
          <Route path="/cci/comitard/new" element={<ProtectedRoute allowedRoles={["admin"]}><ComitardEditor /></ProtectedRoute>} />
          <Route path="/cci/comitard/edit/:id" element={<ProtectedRoute allowedRoles={["admin"]}><ComitardEditor /></ProtectedRoute>} />
          <Route path="/cci/login" element={<Login />} />
          <Route path="/cci/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
