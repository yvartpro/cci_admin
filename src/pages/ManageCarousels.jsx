import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, X, Plus } from 'lucide-react';
import { getCarousels, deleteCarousel } from '../services/carousel.api';
import { LoadingSpinner } from '../components/LoadingSpinner';

const ManageCarousels = () => {
    const [carousels, setCarousels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCarousels();
    }, []);

    const loadCarousels = () => {
        setLoading(true);
        getCarousels()
            .then(data => setCarousels(data))
            .catch(err => {
                console.error('Failed to load carousels:', err);
                setCarousels([]);
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = (id) => {
        if (confirm('Delete this carousel?')) {
            deleteCarousel(id)
                .then(() => setCarousels(carousels.filter(c => c.id !== id)))
                .catch(err => alert('Failed to delete: ' + err.message));
        }
    };



    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Carousels</h1>
                <Link
                    to="/cci/carousel/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={18} />
                    Add Carousel
                </Link>
            </div>

            {loading ? <LoadingSpinner txt="carousels" /> : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4">Image</th>
                                <th className="p-4">Title</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carousels.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        No carousels found. Create your first carousel!
                                    </td>
                                </tr>
                            ) : (
                                carousels.map(carousel => (
                                    <tr key={carousel.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">
                                            {carousel.image_url ? (
                                                <img
                                                    src={carousel.image_url}
                                                    alt={carousel.title}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                    {carousel.title}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium">{carousel.title}</td>
                                        <td className="p-4 flex gap-4">

                                            <Link
                                                to={`/cci/carousel/edit/${carousel.id}`}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(carousel.id)}
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

export default ManageCarousels;
