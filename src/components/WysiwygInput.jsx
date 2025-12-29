import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

/**
 * Minimal toolbar configuration for structured output.
 * We stick to basic formatting to maintain data model integrity.
 */
const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
};

const formats = [
  'bold', 'italic', 'underline',
  'list', 'bullet'
];

const WysiwygInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
      <ReactQuill 
        theme="snow" 
        value={value || ''} 
        onChange={onChange} 
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Start writing..."}
      />
    </div>
  );
};

export default WysiwygInput;
