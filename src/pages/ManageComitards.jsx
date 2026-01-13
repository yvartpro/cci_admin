import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, X, Plus } from 'lucide-react';
import { getComitards, deleteComitard, getComitardById } from '../services/comitard.api';
import ComitardPreview from '../components/ComitardPreview';
import { LoadingSpinner } from '../components/LoadingSpinner';

const ManageComitards = () => {
    const [comitards, setComitards] = useState([]);
    const [previewComitard, setPreviewComitard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadComitards();
    }, []);

    const loadComitards = () => {
        setLoading(true);
        getComitards()
            .then(data => setComitards(data))
            .catch(err => {
                console.error('Failed to load comitards:', err);
                setComitards([]);
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = (id) => {
        if (confirm('Delete this comitard?')) {
            deleteComitard(id)
                .then(() => setComitards(comitards.filter(c => c.id !== id)))
                .catch(err => alert('Failed to delete: ' + err.message));
        }
    };

    const handlePreview = async (comitard) => {
        setPreviewComitard(comitard);
        try {
            const fresh = await getComitardById(comitard.id);
            setPreviewComitard(fresh);
        } catch (err) {
            console.error("Failed to refresh preview", err);
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Comitards</h1>
                <Link
                    to="/cci/comitard/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={18} />
                    Ajouter un comitard
                </Link>
            </div>

            {loading ? <LoadingSpinner txt="comitards" /> : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4">Image</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Ordre</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comitards.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        No comitards found. Create your first comitard!
                                    </td>
                                </tr>
                            ) : (
                                comitards.map(comitard => (
                                    <tr key={comitard.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">
                                            {comitard.image?.url ? (
                                                <img
                                                    src={comitard.image?.url}
                                                    alt={comitard.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                    {getInitials(comitard.name)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium">{comitard.name}</td>
                                        <td className="p-4 text-gray-500">{comitard.titre?.name || '-'}</td>
                                        <td className="p-4 text-gray-500">{comitard.titre?.ordre || '-'}</td>
                                        <td className="p-4 flex gap-4">
                                            <button
                                                onClick={() => handlePreview(comitard)}
                                                className="text-gray-600 hover:text-gray-900"
                                                title="Preview"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <Link
                                                to={`/cci/comitard/edit/${comitard.id}`}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(comitard.id)}
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

            {/* PREVIEW MODAL */}
            {previewComitard && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => setPreviewComitard(null)}
                >
                    <div
                        className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-bold text-gray-500 uppercase tracking-widest text-xs">Preview Mode</h3>
                            <button
                                onClick={() => setPreviewComitard(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-10">
                            <ComitardPreview data={previewComitard} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageComitards;
