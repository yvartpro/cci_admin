import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, X, Plus } from 'lucide-react';
import { getVolunteers, deleteVolunteer, getVolunteerById } from '../services/volunteers.api';
import VolunteerPreview from '../components/VolunteerPreview';
import { LoadingSpinner } from '../components/LoadingSpinner';

const ManageVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [previewVolunteer, setPreviewVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVolunteers();
  }, []);

  const loadVolunteers = () => {
    setLoading(true);
    getVolunteers()
      .then(data => setVolunteers(data))
      .catch(err => {
        console.error('Failed to load volunteers:', err);
        setVolunteers([]);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (confirm('Delete this volunteer?')) {
      deleteVolunteer(id)
        .then(() => setVolunteers(volunteers.filter(v => v.id !== id)))
        .catch(err => alert('Failed to delete: ' + err.message));
    }
  };

  const handlePreview = async (volunteer) => {
    setPreviewVolunteer(volunteer);
    try {
      const fresh = await getVolunteerById(volunteer.id);
      setPreviewVolunteer(fresh);
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
        <h1 className="text-2xl font-bold">Manage Volunteers</h1>
        <Link
          to="/volunteers/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          Add Volunteer
        </Link>
      </div>

      {loading ? <LoadingSpinner txt="volunteers" /> : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No volunteers found. Create your first volunteer!
                  </td>
                </tr>
              ) : (
                volunteers.map(volunteer => (
                  <tr key={volunteer.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      {volunteer.image_url ? (
                        <img
                          src={volunteer.image_url}
                          alt={volunteer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {getInitials(volunteer.name)}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{volunteer.name}</td>
                    <td className="p-4 text-gray-500">{volunteer.role || '-'}</td>
                    <td className="p-4">
                      {volunteer.category ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          {volunteer.category}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${volunteer.status === 'active' ? 'bg-green-100 text-green-700' :
                        volunteer.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {volunteer.status}
                      </span>
                      {volunteer.featured && (
                        <span className="ml-1 text-yellow-500" title="Featured">⭐</span>
                      )}
                    </td>
                    <td className="p-4 flex gap-4">
                      <button
                        onClick={() => handlePreview(volunteer)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Preview"
                      >
                        <Eye size={18} />
                      </button>
                      <Link
                        to={`/cci/volunteers/edit/${volunteer.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(volunteer.id)}
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
      {previewVolunteer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setPreviewVolunteer(null)}
        >
          <div
            className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-gray-500 uppercase tracking-widest text-xs">Preview Mode</h3>
              <button
                onClick={() => setPreviewVolunteer(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-10">
              <VolunteerPreview data={previewVolunteer} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVolunteers;
