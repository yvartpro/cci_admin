import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Input, Textarea, Select } from "../components/MyUtilities";
import {
    createVolunteer,
    updateVolunteer,
    getVolunteerById,
} from "../services/volunteers.api";

import WysiwygInput from "../components/WysiwygInput";
import VolunteerPreview from "../components/VolunteerPreview";
import MediaGrid from "../components/MediaGrid";
import { AddLinks } from "../components/AddLinks";

/* ================== CONSTANT ================== */
const EMPTY_VOLUNTEER = {
    name: "",
    role: "",
    category: null,
    bio: "",
    testimonial: "",
    links: [],
    image_file_id: null,
    status: "active",
    featured: false,
    order: null,
};




/* ================== COMPONENT ================== */
export default function VolunteerEditor() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [volunteer, setVolunteer] = useState(EMPTY_VOLUNTEER);
    const [loading, setLoading] = useState(false);
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);

    /* ============ LOAD ============ */
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getVolunteerById(id)
            .then(setVolunteer)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    /* ============ HELPERS ============ */
    const setField = (key, value) => setVolunteer((volunteer) => ({ ...volunteer, [key]: value }));

    const addLink = () => {
        const newLinks = [...(volunteer.links || []), { label: "", url: "" }];
        setField("links", newLinks);
    };

    const removeLink = (index) => {
        const newLinks = (volunteer.links || []).filter((_, i) => i !== index);
        setField("links", newLinks);
    };

    const updateLink = (index, key, val) => {
        const newLinks = [...(volunteer.links || [])];
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
        const { image: _image, ...payload } = volunteer;
        const req = id ? updateVolunteer(id, payload) : createVolunteer(payload);
        req.then(() => navigate("/cci/volunteer")).catch(alert).finally(() => { });
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-gray-400">Loading…</div>;

    /* ============ RENDER ============ */
    return (
        <div className="flex h-screen bg-gray-50">
            {/* EDITOR */}
            <div className="w-full md:w-1/2 p-8 overflow-y-auto border-r border-gray-200">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                    {id ? "Edit Volunteer" : "Create Volunteer"}
                </h1>

                <Card>
                    <Input label="Name *" value={volunteer.name} onChange={(v) => setField("name", v)} placeholder="Full Name" />
                    <Input label="Role" value={volunteer.role} onChange={(v) => setField("role", v || "")} placeholder="e.g., Tuteur Académique" />

                    <Select
                        label="Category"
                        value={volunteer.category}
                        options={['Education', 'Environment', 'Formation', 'Leadership']}
                        onChange={(v) => setField("category", v || null)}
                    />

                    <Select
                        label="Status"
                        value={volunteer.status}
                        options={['active', 'inactive', 'archived']}
                        onChange={(v) => setField("status", v)}
                    />

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                        <div className="flex items-center gap-4">
                            {volunteer.image?.urls?.[0] && (
                                <img
                                    src={volunteer.image.urls[0]}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-full object-cover border border-gray-200"
                                />
                            )}
                            <button
                                onClick={openImageMedia}
                                className="inline-flex items-center px-4 py-2 border border-indigo-600 shadow-sm text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                {volunteer.image_file_id ? "Change Image" : "Select Image"}
                            </button>
                            {volunteer.image_file_id && (
                                <span className="text-xs text-gray-500 font-mono">ID: {volunteer.image_file_id}</span>
                            )}
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={volunteer.featured}
                                onChange={(e) => setField("featured", e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Featured Volunteer</span>
                        </label>
                    </div>

                    <Input
                        label="Display Order"
                        value={volunteer.order}
                        onChange={(v) => setField("order", parseInt(v) || 0)}
                        placeholder="0"
                        type="number"
                    />
                </Card>

                <AddLinks
                    addLink={addLink}
                    data={volunteer}
                    updateLink={updateLink}
                    removeLink={removeLink}
                />

                <Card>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Biography</h2>
                    <WysiwygInput
                        value={volunteer.bio}
                        onChange={(v) => {
                            const normalized = v.replace(/&nbsp;/g, ' ');
                            if (normalized !== volunteer.bio) {
                                setField("bio", normalized);
                            }
                        }}
                    />


                </Card>

                <Card>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Testimonial (Optional)</h2>
                    <Textarea
                        value={volunteer.testimonial}
                        onChange={(v) => setField("testimonial", v || "")}
                        placeholder="Optional testimonial from the volunteer..."
                        rows={4}
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
                <VolunteerPreview data={volunteer} />
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