import PropTypes from 'prop-types';

const VolunteerPreview = ({ data }) => {
    if (!data) return null;

    const categoryColors = {
        'Education': 'bg-blue-100 text-blue-700',
        'Environment': 'bg-emerald-100 text-emerald-700',
        'Formation': 'bg-purple-100 text-purple-700',
        'Leadership': 'bg-amber-100 text-amber-700'
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const categoryClass = categoryColors[data.category] || 'bg-gray-100 text-gray-700';
    const initials = getInitials(data.name || 'V');

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                {/* Image or Initials */}
                <div className="mb-6 flex justify-center">
                    {data.image_url ? (
                        <img
                            src={data.image_url}
                            alt={data.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-emerald-100"
                        />
                    ) : (
                        <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-black text-3xl">
                            {initials}
                        </div>
                    )}
                </div>

                {/* Name and Role */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{data.name}</h1>
                    {data.role && <p className="text-lg text-slate-500">{data.role}</p>}
                </div>

                {/* Category Badge */}
                {data.category && (
                    <div className="flex justify-center mb-6">
                        <span className={`px-4 py-2 ${categoryClass} text-xs font-black uppercase tracking-widest rounded-full`}>
                            {data.category}
                        </span>
                    </div>
                )}

                {/* Status Badge */}
                <div className="flex justify-center gap-2 mb-6">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${data.status === 'active' ? 'bg-green-100 text-green-700' :
                        data.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {data.status}
                    </span>
                    {data.featured && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            ⭐ Featured
                        </span>
                    )}
                </div>

                {/* Bio */}
                {data.bio && (
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Biography</h3>
                        <div
                            className="article-prose prose prose-sm max-w-none text-slate-600"
                            dangerouslySetInnerHTML={{ __html: data.bio }}
                        />
                    </div>
                )}

                {/* Testimonial */}
                {data.testimonial && (
                    <div className="pt-6 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Testimonial</h3>
                        <p className="text-slate-600 italic">"{data.testimonial}"</p>
                    </div>
                )}

                {/* Order */}
                {data.order !== undefined && (
                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                        <span className="text-xs text-slate-400">Display Order: {data.order}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

VolunteerPreview.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string,
        role: PropTypes.string,
        category: PropTypes.string,
        bio: PropTypes.string,
        testimonial: PropTypes.string,
        image_url: PropTypes.string,
        status: PropTypes.string,
        featured: PropTypes.bool,
        order: PropTypes.number
    })
};

export default VolunteerPreview;
