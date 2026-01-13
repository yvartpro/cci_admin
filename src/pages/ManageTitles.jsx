import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, X, Plus } from 'lucide-react';
import { getTitles, deleteTitle } from '../services/title.api';
import { LoadingSpinner } from '../components/LoadingSpinner';

const ManageTitles = () => {
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTitles();
    }, []);

    const loadTitles = () => {
        setLoading(true);
        getTitles()
            .then(data => setTitles(data))
            .catch(err => {
                console.error('Failed to load titles:', err);
                setTitles([]);
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = (id) => {
        if (confirm('Delete this title?')) {
            deleteTitle(id)
                .then(() => setTitles(titles.filter(t => t.id !== id)))
                .catch(err => alert('Failed to delete: ' + err.message));
        }
    };



    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Titles</h1>
                <Link
                    to="/cci/title/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={18} />
                    Add Title
                </Link>
            </div>

            {loading ? <LoadingSpinner txt="titles" /> : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4">Image</th>
                                <th className="p-4">Titre</th>
                                <th className="p-4">Ordre</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {titles.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        No titles found. Create your first title!
                                    </td>
                                </tr>
                            ) : (
                                titles.map(title => (
                                    <tr key={title.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">
                                            {title.image_url ? (
                                                <img
                                                    src={title.image_url}
                                                    alt={title.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                    {title.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium">{title.name}</td>
                                        <td className="p-4 font-medium">{title.ordre}</td>
                                        <td className="p-4 flex gap-4">

                                            <Link
                                                to={`/cci/title/edit/${title.id}`}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(title.id)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageTitles;
