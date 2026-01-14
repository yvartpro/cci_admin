import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTitles } from "../services/title.api";
import { Card, Input, Select } from "../components/MyUtilities";

import {
    createComitard,
    updateComitard,
    getComitardById,
} from "../services/comitard.api";

import WysiwygInput from "../components/WysiwygInput";
import ComitardPreview from "../components/ComitardPreview";
import MediaGrid from "../components/MediaGrid";
import { AddLinks } from "../components/AddLinks";

/* ================== CONSTANT ================== */
const EMPTY_COMITARD = {
    name: "",
    cv: "",
    links: [],
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

    const setField = (key, value) => {
        setComitard((comitard) => ({ ...comitard, [key]: value }));
    };

    const addLink = () => {
        const newLinks = [...(comitard.links || []), { label: "", url: "" }];
        setField("links", newLinks);
    };

    const removeLink = (index) => {
        const newLinks = (comitard.links || []).filter((_, i) => i !== index);
        setField("links", newLinks);
    };

    const updateLink = (index, key, val) => {
        const newLinks = [...(comitard.links || [])];
        newLinks[index] = { ...newLinks[index], [key]: val };
        setField("links", newLinks);
    };

    const openImageMedia = () => {
        setShowMediaLibrary(true);
    };

    const handleMediaSelect = (entries) => {
        if (!entries.length) return;
        setField("image", entries[0]); // for preview
        setField("image_file_id", entries[0]?.id || null);
        setShowMediaLibrary(false);
    };

    /* ============ SAVE ============ */
    const save = () => {
        const { image: _image, ...payload } = comitard;
        const req = id ? updateComitard(id, payload) : createComitard(payload);
        req.then(() => navigate("/cci/comitard")).catch(alert).finally(() => { });
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
                        <div className="flex items-center gap-4">
                            {comitard.image?.urls?.[0] && (
                                <img
                                    src={comitard.image.urls[0]}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-full object-cover border border-gray-200 shadow-sm"
                                />
                            )}
                            <button
                                onClick={openImageMedia}
                                className="inline-flex items-center px-4 py-2 border border-indigo-600 shadow-sm text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                {comitard.image_file_id ? "Change Image" : "Select Image"}
                            </button>
                            {comitard.image_file_id && (
                                <span className="text-xs text-gray-500 font-mono">ID: {comitard.image_file_id}</span>
                            )}
                        </div>
                    </div>

                </Card>

                <AddLinks
                    addLink={addLink}
                    data={comitard}
                    updateLink={updateLink}
                    removeLink={removeLink}
                />



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
                <ComitardPreview data={comitard} titles={titles} image={comitard.image} />
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