export const Card = ({ children }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 transition-shadow hover:shadow-md">{children}</div>
);

export const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
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

export const Select = ({ label, value, options, onChange }) => (
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


export const Textarea = ({ label, value, onChange, placeholder, rows = 3 }) => (
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

export const BlockBar = ({ onAdd }) => (
    <div className="flex gap-3 flex-wrap mt-4 pt-4 border-t border-gray-50">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider py-1">Add Block:</span>
        {["text", "subtitle", "image", "video", "quote"].map((t) => (
            <button
                key={t}
                onClick={() => onAdd(t)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-100"
            >
                {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
        ))}
    </div>
);

export const IconBtn = ({ children, className = "", ...p }) => (
    <button {...p} className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${className}`}>
        {children}
    </button>
);

export const Header = ({ title, action, onAction }) => (
    <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button
            onClick={onAction}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
            {action}
        </button>
    </div>
);