const ArticlePreview = ({ data }) => {
  return (
    <article className="article-prose max-w-none">
      {/* TOP MEDIA (hero / gallery) */}
      {data.media?.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {data.media.map(m => (
            <div key={m.id} className="relative overflow-hidden rounded-3xl bg-slate-100">
              {m.type === 'image' ? (
                <img
                  src={m.urls[0]}
                  alt=""
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="aspect-video bg-black flex items-center justify-center text-white text-sm">
                  Video preview
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SECTIONS */}
      {data.sections?.map(section => (
        <section key={section.id} className="mb-16">
          {section.title && (
            <h2 className="border-l-4 border-indigo-600 pl-4">
              {section.title}
            </h2>
          )}

          {section.blocks?.map(block => {
            switch (block.type) {
              case 'text':
                return (
                  <div
                    key={block.id}
                    dangerouslySetInnerHTML={{ __html: block.value }}
                  />
                );

              case 'subtitle':
                return (
                  <h3
                    key={block.id}
                    dangerouslySetInnerHTML={{ __html: block.value }}
                  />
                );

              case 'quote':
                return (
                  <blockquote
                    key={block.id}
                    dangerouslySetInnerHTML={{ __html: block.value }}
                  />
                );

              case 'image':
                return (
                  <img
                    key={block.id}
                    src={block.value}
                    alt=""
                    className="w-full"
                  />
                );

              case 'video':
                return (
                  <div key={block.id} className="aspect-video my-10">
                    <iframe
                      src={block.value}
                      className="w-full h-full rounded-2xl"
                      allowFullScreen
                    />
                  </div>
                );

              default:
                return null;
            }
          })}
        </section>
      ))}
    </article>
  );
};

export default ArticlePreview;
