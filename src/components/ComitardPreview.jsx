import PropTypes from 'prop-types';
import { ExternalLink } from 'lucide-react';

const ComitardPreview = ({ data, local_url, titles = [] }) => {
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

    // Dynamic resolution of image and title
    const displayImage = local_url || data.image_url || data.image?.url;
    const displayTitle = data.titre?.name || titles.find(t => String(t.id) === String(data.titre_id))?.name;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                {/* Image or Initials */}
                <div className="mb-6 flex justify-center">
                    {displayImage ? (
                        <img
                            src={displayImage}
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
                    {displayTitle && (
                        <p className="text-lg text-indigo-600 font-semibold tracking-wide uppercase text-sm">
                            {displayTitle}
                        </p>
                    )}
                </div>

                {/* Links / Socials */}
                {Array.isArray(data.links) && data.links.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {data.links.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:border-slate-200 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                            >
                                <ExternalLink size={12} className="text-indigo-400" />
                                {link.label || 'Lien'}
                            </a>
                        ))}
                    </div>
                )}

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
