import PropTypes from 'prop-types';

const ComitardPreview = ({ data, titles = [] }) => {
    if (!data) return null;

    const getInitials = (name) => {
        if (!name) return 'C';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const initials = getInitials(data.name);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                {/* Image or Initials */}
                <div className="mb-6 flex justify-center">
                    {data.image_url ? (
                        <img
                            src={data.image_url}
                            alt={data.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-lg"
                        />
                    ) : (
                        <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-lg">
                            {initials}
                        </div>
                    )}
                </div>

                {/* Name and Title */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{data.name || 'Nom du Comitard'}</h1>
                    {data.titre_id && (
                        <p className="text-lg text-indigo-600 font-semibold tracking-wide uppercase text-sm">
                            {titles.find(t => String(t.id) === String(data.titre_id))?.name || `ID Titre: ${data.titre_id}`}
                        </p>
                    )}
                </div>

                {/* Status/Featured Badge */}
                <div className="flex justify-center gap-2 mb-8">
                    {data.featured && (
                        <span className="px-4 py-1 bg-amber-100 text-amber-700 text-xs font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                            ⭐ Vedette
                        </span>
                    )}
                </div>

                {/* CV / Biography */}
                {data.cv && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-px flex-1 bg-slate-100"></div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Biographie & CV</h3>
                            <div className="h-px flex-1 bg-slate-100"></div>
                        </div>
                        <div
                            className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: data.cv }}
                        />
                    </div>
                )}

                {/* Order */}
                {data.order !== undefined && (
                    <div className="mt-10 pt-6 border-t border-slate-50 text-center">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Priorité d'affichage : {data.order}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

ComitardPreview.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string,
        cv: PropTypes.string,
        image_url: PropTypes.string,
        titre_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        featured: PropTypes.bool,
        order: PropTypes.number
    }),
    titles: PropTypes.array
};

export default ComitardPreview;
