import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createTitle,
    updateTitle,
    getTitleById,
} from "../services/title.api";

import MediaGrid from "../components/MediaGrid";
import { ButtonLoadingSpinner } from "../components/LoadingSpinner";

/* ================== CONSTANT ================== */
const EMPTY_TITLE = {
    name: "",
    ordre: null,
    description: ""
};


/* ================== COMPONENT ================== */
export default function TitleEditor() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState(EMPTY_TITLE);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    /* ============ LOAD ============ */
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getTitleById(id)
            .then(setTitle)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    /* ============ HELPERS ============ */
    const setField = (key, value) => setTitle((title) => ({ ...title, [key]: value }));

    /* ============ SAVE ============ */
    const save = () => {
        setSaving(true);
        const payload = { ...title };
        const req = id ? updateTitle(id, payload) : createTitle(payload);
        req.then(() => navigate("/cci/title")).catch(alert).finally(() => { setSaving(false); });
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-gray-400">Loading…</div>;

    /* ============ RENDER ============ */
    return (
        <div className="flex h-screen bg-gray-50">
            {/* EDITOR */}
            <div className="w-full md:w-1/2 p-8 overflow-y-auto border-r border-gray-200">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                    {id ? "Edit Title" : "Create Title"}
                </h1>

                <Card>
                    <Input label="Titre *" value={title.name} onChange={(val) => setField("name", val)} placeholder="Titre" />
                    <Input label="Description" value={title.description} onChange={(val) => setField("description", val || "")} placeholder="Description" />
                    <Input type="number" label="Ordre" value={title.ordre} onChange={(val) => setField("ordre", val || "")} placeholder="Ordre" />
                </Card>

                <button
                    onClick={save}
                    className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-4 rounded-lg font-semibold shadow-md transition-all transform active:scale-[0.99]"
                >
                    {saving ? <ButtonLoadingSpinner /> : id ? "Save Changes" : "Create Title"}
                </button>
            </div>
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

const Textarea = ({ label, value, onChange, placeholder, rows = 3 }) => (
    <div className="mb-5">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <textarea
            rows={rows}
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
            <option value="">Select an option...</option>
            {options.map((o) => (
                <option key={o} value={o}>
                    {o}
                </option>
            ))}
        </select>
    </div>
);
