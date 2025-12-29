import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { getArticles, deleteArticle } from '../services/api';

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);

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
                  <Link to={`/edit/${article.id}`} className="text-blue-600 hover:text-blue-800">
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
    </div>
  );
};

export default ManageArticles;
