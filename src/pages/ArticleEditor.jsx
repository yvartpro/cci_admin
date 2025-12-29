import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Image as ImageIcon, Type, List, Quote, Video } from 'lucide-react';
import { createArticle, updateArticle, getArticleById } from '../services/api';
import MediaGrid from '../components/MediaGrid';
import WysiwygInput from '../components/WysiwygInput';
import ArticlePreview from '../components/ArticlePreview';

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState({
    title: '', category: '', description: '',
    media: [], sections: []
  });
  const [filesMap, setFilesMap] = useState({}); // retained but unused for now
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  useEffect(() => {
    if (id) {
      getArticleById(id).then(data => setArticle(data));
    }
  }, [id]);

  // --- Handlers ---
  const addMedia = () => setArticle({ ...article, 
    media: [...article.media, { id: crypto.randomUUID(), type: 'image', urls: [''] }] 
  });

  const addSection = () => setArticle({ ...article, 
    sections: [...article.sections, { id: crypto.randomUUID(), title: '', blocks: [] }] 
  });

  const addBlock = (sectionId, type) => {
    const newSections = article.sections.map(s => {
      if (s.id !== sectionId) return s;
      return { ...s, blocks: [...s.blocks, { id: crypto.randomUUID(), type, value: type === 'ol' || type === 'ul' ? [] : '' }] };
    });
    setArticle({ ...article, sections: newSections });
  };

  const updateBlock = (sectionId, blockId, value) => {
    const newSections = article.sections.map(s => {
      if (s.id !== sectionId) return s;
      return { ...s, blocks: s.blocks.map(b => b.id === blockId ? { ...b, value } : b) };
    });
    setArticle({ ...article, sections: newSections });
  };

  const handleSave = () => {
    const request = id ? updateArticle(id, article) : createArticle(article);
    request.then(() => navigate('/manage')).catch(err => alert("Error saving"));
  };

  return (
    <div className="flex h-screen bg-gray-50 md:flex-row flex-col">
      {/* Editor Panel */}
      <div className={`md:w-1/2 w-full overflow-y-auto p-8 border-r bg-gray-50 ${showPreviewMobile ? 'hidden' : ''}`}>
        <h1 className="text-2xl font-bold mb-6">{id ? 'Edit' : 'Create'} Article</h1>
        
        <div className="space-y-4 mb-8 bg-white p-4 rounded shadow-sm">
          <input className="w-full p-2 border rounded" placeholder="Title" value={article.title} onChange={e => setArticle({...article, title: e.target.value})} />
          <input className="w-full p-2 border rounded" placeholder="Category" value={article.category} onChange={e => setArticle({...article, category: e.target.value})} />
        </div>

        {/* Media Manager */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Article-Level Media</h2>
            <button onClick={addMedia} className="text-sm bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1">
              <Plus size={14}/> Add Media
            </button>
          </div>
          {article.media.map((m, idx) => (
            <div key={m.id} className="flex gap-2 mb-3 items-center">
              <select className="border rounded p-2" value={m.type} onChange={e => {
                const newMedia = [...article.media];
                newMedia[idx].type = e.target.value;
                setArticle({...article, media: newMedia});
              }}>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>

              <input className="flex-1 border rounded p-2" placeholder="Media URL" value={m.urls[0] || ''} onChange={e => {
                const newMedia = [...article.media];
                newMedia[idx].urls = [e.target.value];
                setArticle({...article, media: newMedia});
              }} />

              <div>
                <button onClick={() => setShowMediaLibrary(true)} className="text-sm px-2 py-1 bg-gray-100 rounded">Choose from library</button>
              </div>
            </div>
          ))}

          {/* Media Library Modal */}
          {showMediaLibrary && (
            <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-6 z-50">
              <div className="bg-white rounded w-full max-w-4xl p-4 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">Media Library</h3>
                  <button onClick={() => setShowMediaLibrary(false)} className="text-sm text-gray-600">Close</button>
                </div>
                <MediaGrid onSelect={(entries) => {
                  // entries is an array of media items from the library
                  const newMedia = [...article.media]
                  entries.forEach(ent => newMedia.push({ id: crypto.randomUUID(), type: ent.type, urls: ent.urls }))
                  setArticle({...article, media: newMedia})
                  setShowMediaLibrary(false)
                }} />
              </div>
            </div>
          )}
        </section>

        {/* Sections Manager */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Content Sections</h2>
            <button onClick={addSection} className="text-sm bg-green-600 text-white px-3 py-1 rounded">Add Section</button>
          </div>
          {article.sections.map(section => (
            <div key={section.id} className="border-2 border-dashed p-4 rounded-lg mb-6 bg-white">
              <input className="font-bold mb-4 border-b w-full outline-none" placeholder="Section Title (Optional)" value={section.title} onChange={e => {
                const newSecs = article.sections.map(s => s.id === section.id ? {...s, title: e.target.value} : s);
                setArticle({...article, sections: newSecs});
              }} />
              
              {section.blocks.map(block => (
                <div key={block.id} className="mb-4 relative group">
                  <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => {
                      const newSecs = article.sections.map(s => s.id === section.id ? {...s, blocks: s.blocks.filter(b => b.id !== block.id)} : s);
                      setArticle({...article, sections: newSecs});
                    }}><Trash2 size={16} className="text-red-500"/></button>
                  </div>
                  {['text', 'quote', 'citation', 'subtitle'].includes(block.type) ? (
                    <WysiwygInput value={block.value} onChange={(val) => updateBlock(section.id, block.id, val)} />
                  ) : (
                    <input className="w-full p-2 border rounded" placeholder={`${block.type} URL`} value={block.value} onChange={e => updateBlock(section.id, block.id, e.target.value)} />
                  )}
                </div>
              ))}

              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                <BlockBtn icon={<Type size={14}/>} label="Text" onClick={() => addBlock(section.id, 'text')} />
                <BlockBtn icon={<ImageIcon size={14}/>} label="Img" onClick={() => addBlock(section.id, 'image')} />
                <BlockBtn icon={<Video size={14}/>} label="Vid" onClick={() => addBlock(section.id, 'video')} />
                <BlockBtn icon={<Quote size={14}/>} label="Quote" onClick={() => addBlock(section.id, 'quote')} />
              </div>
            </div>
          ))}
        </section>

        <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold mt-8 hover:bg-indigo-700 transition">
          {id ? 'Update' : 'Publish'} Article
        </button>

        {/* Mobile preview toggle button */}
        <div className="md:hidden fixed right-4 bottom-6">
          <button onClick={() => setShowPreviewMobile(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg">Show preview</button>
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className={`md:w-1/2 w-full overflow-y-auto bg-white p-12 ${showPreviewMobile ? '' : 'md:block'}`}>
        {/* mobile: show Edit mode button */}
        <div className="md:hidden mb-4">
          <button onClick={() => setShowPreviewMobile(false)} className="bg-gray-100 px-3 py-1 rounded">Edit mode</button>
        </div>
        <div className="max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">{article.category || 'Category'}</span>
          <h1 className="text-4xl font-extrabold mt-2 mb-8">{article.title || 'Article Title'}</h1>
          <ArticlePreview data={article} />
        </div>
      </div>
    </div>
  );
};

const BlockBtn = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-xs">
    {icon} {label}
  </button>
);

export default ArticleEditor;
