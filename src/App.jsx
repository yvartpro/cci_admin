import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ArticleEditor from './pages/ArticleEditor';
import ManageArticles from './pages/ManageArticles';
import MediaLibrary from './pages/MediaLibrary';

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar remains static on all pages */}
      <Sidebar />

      {/* Main Content Area changes based on URL */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<ArticleEditor />} />
          <Route path="/media" element={<MediaLibrary />} />
          <Route path="/manage" element={<ManageArticles />} />
          <Route path="/edit/:id" element={<ArticleEditor />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
