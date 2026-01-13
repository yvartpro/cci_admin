import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, X, Plus } from 'lucide-react';
import { getPartners, deletePartner } from '../services/partner.api';
import { LoadingSpinner } from '../components/LoadingSpinner';

const ManagePartners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPartners();
    }, []);

    const loadPartners = () => {
        setLoading(true);
        getPartners()
            .then(data => setPartners(data))
            .catch(err => {
                console.error('Failed to load partners:', err);
                setPartners([]);
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = (id) => {
        if (confirm('Delete this partner?')) {
            deletePartner(id)
                .then(() => setPartners(partners.filter(p => p.id !== id)))
                .catch(err => alert('Failed to delete: ' + err.message));
        }
    };



    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Partners</h1>
                <Link
                    to="/cci/partner/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={18} />
                    Add Partner
                </Link>
            </div>

            {loading ? <LoadingSpinner txt="partners" /> : (
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
                            {partners.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        No partners found. Create your first partner!
                                    </td>
                                </tr>
                            ) : (
                                partners.map(partner => (
                                    <tr key={partner.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">
                                            {partner.image_url ? (
                                                <img
                                                    src={partner.image_url}
                                                    alt={partner.title}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                    {partner.title}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium">{partner.title}</td>
                                        <td className="p-4 flex gap-4">

                                            <Link
                                                to={`/cci/partner/edit/${partner.id}`}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(partner.id)}
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

export default ManagePartners;
