import { Card } from "./MyUtilities"
import { Plus, Trash2 } from "lucide-react"

export const AddLinks = ({ updateLink, addLink, removeLink, data }) => {
    return (

        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Réseaux Sociaux & Liens</h2>
                <button
                    onClick={addLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors text-xs font-bold"
                >
                    <Plus size={14} />
                    Ajouter un lien
                </button>
            </div>

            {(Array.isArray(data.links) ? data.links : []).length === 0 ? (
                <p className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    Aucun lien ajouté. Cliquez sur le bouton ci-dessus pour en ajouter.
                </p>
            ) : (
                <div className="space-y-3">
                    {(Array.isArray(data.links) ? data.links : []).map((link, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                            <div className="flex-1">
                                <input
                                    className="block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs p-2 border"
                                    value={link.label || ""}
                                    onChange={(e) => updateLink(idx, "label", e.target.value)}
                                    placeholder="Label (ex: LinkedIn)"
                                />
                            </div>
                            <div className="flex-[2]">
                                <input
                                    className="block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs p-2 border"
                                    value={link.url || ""}
                                    onChange={(e) => updateLink(idx, "url", e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                            <button
                                onClick={() => removeLink(idx)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Card>

    )
}