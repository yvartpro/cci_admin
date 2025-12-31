const ArticlePreview = ({ data }) => {
  return (
    <article className="max-w-none">

      {/* CATEGORY */}
      {data.category && (
        <div className="mb-3">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
            {data.category}
          </span>
        </div>
      )}

      {/* TITLE */}
      {data.title && (
        <h1 className="text-4xl font-black mb-4 leading-tight">
          {data.title}
        </h1>
      )}

      {/* SUBTITLE */}
      {data.subtitle && (
        <h2 className="text-xl text-gray-600 mb-6">
          {data.subtitle}
        </h2>
      )}

      {/* HERO IMAGE */}
      {data.hero_url && (
        <div className="mb-10 rounded-3xl overflow-hidden">
          <img
            src={data.hero_url}
            alt={data.title || ""}
            className="w-full h-80 object-cover"
          />
        </div>
      )}

      {/* EXCERPT */}
      {data.excerpt && (
        <p className="text-lg text-gray-700 mb-12">
          {data.excerpt}
        </p>
      )}

      {/* SECTIONS */}
      {data.sections?.map(section => (
        <section key={section.id} className="mb-16">
          {section.title && (
            <h3 className="text-2xl font-bold mb-6 border-l-4 border-indigo-600 pl-4">
              {section.title}
            </h3>
          )}

          {section.blocks?.map(block => {
            switch (block.type) {
              case 'text':
                return (
                  <div
                    key={block.id}
                    className="article-prose"
                    dangerouslySetInnerHTML={{ __html: block.value }}
                  />
                );

              case 'subtitle':
                return (
                  <h4
                    key={block.id}
                    className="article-prose text-xl font-semibold mt-8"
                    dangerouslySetInnerHTML={{ __html: block.value }}
                  />
                );

              case 'quote':
                return (
                  <blockquote
                    key={block.id}
                    className="article-prose border-l-4 pl-4 italic my-8"
                    dangerouslySetInnerHTML={{ __html: block.value }}
                  />
                );

              case 'image':
                return (
                  <img
                    key={block.id}
                    src={block.value}
                    alt=""
                    className="w-full rounded-2xl my-10"
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