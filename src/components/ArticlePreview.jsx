const ArticlePreview = ({ data }) => {
  return (
    <div className="prose prose-indigo max-w-none">
      {/* Top Media */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {data.media?.map(m => (
          <div key={m.id} className="overflow-hidden rounded-lg bg-gray-100">
            {m.type === 'image' ? <img src={m.urls[0]} alt="" className="w-full h-48 object-cover" /> : <div className="aspect-video bg-black flex items-center justify-center text-white text-xs text-center p-4">Video: {m.urls[0]}</div>}
          </div>
        ))}
      </div>

      {/* Sections */}
      {data.sections?.map(section => (
        <div key={section.id} className="mb-10">
          {section.title && <h2 className="text-2xl font-bold mb-4 text-gray-800 border-l-4 border-indigo-500 pl-4">{section.title}</h2>}
          {section.blocks?.map(block => (
            <div key={block.id} className="mb-4">
              {block.type === 'text' && <div dangerouslySetInnerHTML={{ __html: block.value }} />}
              {block.type === 'subtitle' && <h3 className="text-xl font-semibold" dangerouslySetInnerHTML={{ __html: block.value }} />}
              {block.type === 'quote' && <blockquote className="italic border-l-4 pl-4 text-gray-600" dangerouslySetInnerHTML={{ __html: block.value }} />}
              {block.type === 'image' && <img src={block.value} className="w-full rounded shadow" alt="content" />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ArticlePreview;
