export const LoadingSpinner = ({ txt }) =>
    <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-gray-500 mt-4">Loading {txt} ...</p>
    </div>
