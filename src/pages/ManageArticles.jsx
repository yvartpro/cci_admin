import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, X } from 'lucide-react';
import { getArticles, deleteArticle } from '../services/api';
import ArticlePreview from '../components/ArticlePreview';

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [previewArticle, setPreviewArticle] = useState(null);

  useEffect(() => {
    // For now, this will fail until backend is up, 
    // so we use mock data if the catch triggers.
    getArticles()
      .then(data => setArticles(data))
      .catch(() => setArticles([
        { id: '1', title: 'Sample Article', category: 'Tech', updatedAt: '2025-12-29' }
      ]));
  }, []);

  const handleDelete = (id) => {
    if (confirm('Delete this article?')) {
      deleteArticle(id).then(() => setArticles(articles.filter(a => a.id !== id)));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Articles</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{article.title}</td>
                <td className="p-4 text-gray-500">{article.category}</td>
                <td className="p-4 flex gap-4">
                  <button onClick={() => setPreviewArticle(article)} className="text-gray-600 hover:text-gray-900" title="Preview">
                    <Eye size={18} />
                  </button>
                  <Link to={`/edit/${article.id}`} className="text-blue-600 hover:text-blue-800" title="Edit">
                    <Edit size={18} />
                  </Link>
                  <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PREVIEW MODAL */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setPreviewArticle(null)}>
          <div className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-gray-500 uppercase tracking-widest text-xs">Preview Mode</h3>
              <button
                onClick={() => setPreviewArticle(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-10">
              <ArticlePreview data={previewArticle} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageArticles;
