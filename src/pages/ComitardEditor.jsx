import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTitles } from "../services/title.api";

import {
    createComitard,
    updateComitard,
    getComitardById,
} from "../services/comitard.api";

import WysiwygInput from "../components/WysiwygInput";
import ComitardPreview from "../components/ComitardPreview";
import MediaGrid from "../components/MediaGrid";

/* ================== CONSTANT ================== */
const EMPTY_COMITARD = {
    name: "",
    cv: "",
    links: [],
    image_url: null,
    image_file_id: null,
    titre_id: null,
};


/* ================== COMPONENT ================== */
export default function ComitardEditor() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [comitard, setComitard] = useState(EMPTY_COMITARD);
    const [loading, setLoading] = useState(false);
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [titles, setTitles] = useState([]);


    /* ============ LOAD ============ */
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getComitardById(id)
            .then(setComitard)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    /* ============ HELPERS ============ */
    useEffect(() => {
        getTitles().then(setTitles).catch(console.error);
    }, []);

    const setField = (key, value) => setComitard((comitard) => ({ ...comitard, [key]: value }));

    const openImageMedia = () => {
        setShowMediaLibrary(true);
    };

    const handleMediaSelect = (entries) => {
        if (!entries.length) return;
        const url = entries[0]?.urls?.[0] || null;
        setField("image_url", url);
        setField("image_file_id", entries[0]?.id || null);
        setShowMediaLibrary(false);
    };

    /* ============ SAVE ============ */
    const save = () => {
        const payload = { ...comitard };
        const req = id ? updateComitard(id, payload) : createComitard(payload);
        req.then(() => navigate("/cci/comitards")).catch(alert).finally(() => { });
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-gray-400">Loading…</div>;

    /* ============ RENDER ============ */
    return (
        <div className="flex h-screen bg-gray-50">
            {/* EDITOR */}
            <div className="w-full md:w-1/2 p-8 overflow-y-auto border-r border-gray-200">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                    {id ? "Edit Comitard" : "Create Comitard"}
                </h1>

                <Card>
                    <Input label="Name *" value={comitard.name} onChange={(v) => setField("name", v)} placeholder="Full Name" />

                    <Select
                        label="Titre"
                        value={comitard.titre_id}
                        options={titles}
                        onChange={(v) => setField("titre_id", v || null)}
                    />

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                value={comitard.image_url || ""}
                                onChange={(e) => setField("image_url", e.target.value || null)}
                                placeholder="https://..."
                            />
                            <button
                                onClick={openImageMedia}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Select Media
                            </button>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={comitard.featured}
                                onChange={(e) => setField("featured", e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Featured Comitard</span>
                        </label>
                    </div>

                    <Input
                        label="Display Order"
                        value={comitard.order}
                        onChange={(v) => setField("order", parseInt(v) || 0)}
                        placeholder="0"
                        type="number"
                    />
                </Card>

                <Card>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Biography</h2>
                    <WysiwygInput
                        value={comitard.cv}
                        onChange={(v) => {
                            const normalized = v.replace(/&nbsp;/g, ' ');
                            if (normalized !== comitard.cv) {
                                setField("cv", normalized);
                            }
                        }}
                    />


                </Card>

                <button
                    onClick={save}
                    className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-4 rounded-lg font-semibold shadow-md transition-all transform active:scale-[0.99]"
                >
                    {id ? "Save Changes" : "Create Volunteer"}
                </button>
            </div>

            {/* PREVIEW */}
            <div className="hidden md:block md:w-1/2 p-10 bg-white overflow-y-auto">
                <ComitardPreview data={comitard} titles={titles} />
            </div>

            {/* MEDIA MODAL */}
            {showMediaLibrary && (
                <div className="fixed inset-0 bg-black/40 flex justify-center p-6 z-50">
                    <div className="bg-white w-full max-w-4xl p-4 rounded shadow-lg">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-bold">Media Library</h3>
                            <button
                                onClick={() => setShowMediaLibrary(false)}
                                className="text-sm text-gray-600"
                            >
                                Close
                            </button>
                        </div>
                        <MediaGrid onSelect={handleMediaSelect} />
                    </div>
                </div>
            )}
        </div>
    );
}

const Card = ({ children }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 transition-shadow hover:shadow-md">{children}</div>
);

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    </div>
);

const Select = ({ label, value, options, onChange }) => (
    <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">Sélectionnez un titre...</option>
            {options.map((t) => (
                <option key={t.id} value={t.id}>
                    {t.name}
                </option>
            ))}
        </select>
    </div>
);
