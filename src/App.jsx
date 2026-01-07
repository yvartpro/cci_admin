import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ArticleEditor from './pages/ArticleEditor';
import ManageArticles from './pages/ManageArticles';
import MediaLibrary from './pages/MediaLibrary';
import VolunteerEditor from './pages/VolunteerEditor';
import ManageVolunteers from './pages/ManageVolunteers';

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar remains static on all pages */}
      <Sidebar />

      {/* Main Content Area changes based on URL */}
      <main className="flex-1">
        <Routes>
          <Route path="/cci" element={<Dashboard />} />
          <Route path="/cci/create" element={<ArticleEditor />} />
          <Route path="/cci/media" element={<MediaLibrary />} />
          <Route path="/cci/manage" element={<ManageArticles />} />
          <Route path="/cci/edit/:id" element={<ArticleEditor />} />
          <Route path="/cci/volunteers" element={<ManageVolunteers />} />
          <Route path="/cci/volunteers/new" element={<VolunteerEditor />} />
          <Route path="/cci/volunteers/edit/:id" element={<VolunteerEditor />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
