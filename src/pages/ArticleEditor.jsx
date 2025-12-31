import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";

import {
  createArticle,
  updateArticle,
  getArticleById,
} from "../services/api";

import WysiwygInput from "../components/WysiwygInput";
import ArticlePreview from "../components/ArticlePreview";
import MediaGrid from "../components/MediaGrid";
import { createSlug } from "../services/helper";

/* ================== CONSTANT ================== */
const EMPTY_ARTICLE = {
  title: "",
  subtitle: null,
  excerpt: null,
  category: null,
  slug: "",
  language: "fr",
  hero_url: null,
  hero_file_id: null,
  author_name: null,
  reading_time: null,
  featured: false,
  status: "draft",
  published_at: null,
  meta: {},
  tags: [],
  sections: [],
  version: 1,
};

/* ================== COMPONENT ================== */
export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(EMPTY_ARTICLE);
  const [loading, setLoading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaCtx, setMediaCtx] = useState(null);

  /* ============ LOAD ============ */
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getArticleById(id)
      .then(setArticle)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  /* ============ HELPERS ============ */
  const setField = (key, value) => setArticle((article) => ({ ...article, [key]: value }));
  const updateSections = (fn) =>
    setArticle((article) => ({ ...article, sections: fn(article.sections) }));

  const openHeroMedia = () => {
    setMediaCtx({ type: "hero" });
    setShowMediaLibrary(true);
  };

  

  /* ============ SECTIONS ============ */
  const addSection = () =>
    updateSections((s) => [
      ...s,
      { id: crypto.randomUUID(), title: "", blocks: [] },
    ]);

  const removeSection = (sid) =>
    updateSections((s) => s.filter((x) => x.id !== sid));

  /* ============ BLOCKS ============ */
  const addBlock = (sid, type) =>
    updateSections((s) =>
      s.map((sec) =>
        sec.id === sid
          ? {...sec, blocks: [...sec.blocks, { id: crypto.randomUUID(), type, value: "" }],
        }: sec
      )
    );

  const updateBlock = (sid, bid, value) =>
    updateSections((s) =>
      s.map((sec) =>
        sec.id === sid
          ? {...sec, blocks: sec.blocks.map((block) => block.id === bid ? { ...block, value } : block )}
          : sec
      )
    );

  const removeBlock = (sid, bid) =>
    updateSections((sections) =>
      sections.map((section) =>
        section.id === sid
          ? { ...section, blocks: section.blocks.filter((b) => b.id !== bid) }
          : section
      )
    );

  /* ============ MEDIA ============ */

  const openMedia = (sectionId, blockId) => {
    setMediaCtx({ type: "block", sectionId, blockId });
    setShowMediaLibrary(true);
  };


  const handleMediaSelect = (entries) => {
    if (!mediaCtx || !entries.length) return;
    const url = entries[0]?.urls?.[0] || null;

    if (mediaCtx.type === "hero") {
      setField("hero_url", url);
      setField("hero_file_id", entries[0]?.id || null);
    }

    if (mediaCtx.type === "block") {
      updateBlock(
        mediaCtx.sectionId,
        mediaCtx.blockId,
        url
      );
    }

    setShowMediaLibrary(false);
    setMediaCtx(null);
  };

  /* ============ SAVE ============ */
  const save = () => {
    console.log("Saving article:", article);
    const payload = { ...article, slug: createSlug(article.title) };
    const req = id ? updateArticle(id, payload) : createArticle(payload);
    req.then(() => navigate("/manage")).catch(alert).finally(() => {});
  };

  if (loading) return <div className="p-8">Loading…</div>;

  /* ============ RENDER ============ */
  return (
    <div className="flex h-screen bg-gray-50">
      {/* EDITOR */}
      <div className="w-full md:w-1/2 p-8 overflow-y-auto border-r">
        <h1 className="text-2xl font-bold mb-6">
          {id ? "Edit Article" : "Create Article"}
        </h1>

        <Card>
          <Input label="Title" value={article.title} onChange={(v) => setField("title", v)} />
          <Input label="Subtitle" value={article.subtitle} onChange={(v) => setField("subtitle", v || null)} />
          <Textarea label="Excerpt" value={article.excerpt} onChange={(v) => setField("excerpt", v || null)} />
          <Input label="Category" value={article.category} onChange={(v) => setField("category", v || null)} />
          <div className="mb-3">
            <label className="text-xs text-gray-500">Hero URL</label>
            <div className="flex gap-2">
              <input
                className="flex-1 border p-2 rounded"
                value={article.hero_url || ""}
                onChange={(e) => setField("hero_url", e.target.value || null)}
              />
              <button
                onClick={openHeroMedia}
                className="px-3 text-xs bg-gray-100 rounded hover:bg-gray-200"
              >
                Open media
              </button>
            </div>
          </div>
        </Card>

        <Header title="Sections" action="Add section" onAction={addSection} />

        {article.sections.map((section) => (
          <Card key={section.id}>
            <div className="flex gap-2 mb-3">
              <input
                className="flex-1 font-bold border-b outline-none"
                placeholder="Section title"
                value={section.title}
                onChange={(e) =>
                  updateSections((s) =>
                    s.map((x) =>
                      x.id === section.id ? { ...x, title: e.target.value } : x
                    )
                  )
                }
              />
              <IconBtn onClick={() => removeSection(section.id)}>
                <Trash2 size={14} />
              </IconBtn>
            </div>

            {section.blocks.map((block) => (
              <div key={block.id} className="mb-4 relative">
                <IconBtn
                  className="absolute right-0 top-0"
                  onClick={() => removeBlock(section.id, block.id)}
                >
                  <Trash2 size={14} />
                </IconBtn>

                {["image", "video"].includes(block.type) ? (
                  <>
                    <Input
                      label={`${block.type} URL`}
                      value={block.value}
                      onChange={(v) =>
                        updateBlock(section.id, block.id, v)
                      }
                    />
                    <button
                      onClick={() => openMedia(section.id, block.id)}
                      className="text-xs text-indigo-600"
                    >
                      Open media library
                    </button>
                  </>
                ) : (
                  <WysiwygInput
                    value={block.value}
                    onChange={(v) =>
                      updateBlock(section.id, block.id, v)
                    }
                  />
                )}
              </div>
            ))}

            <BlockBar onAdd={(t) => addBlock(section.id, t)} />
          </Card>
        ))}

        <button
          onClick={save}
          className="w-full mt-6 bg-indigo-600 text-white py-3 rounded font-bold"
        >
          {id ? "Update" : "Publish"}
        </button>
      </div>

      {/* PREVIEW */}
      <div className="hidden md:block md:w-1/2 p-10 bg-white overflow-y-auto">
        <ArticlePreview data={article} />
      </div>

      {/* MEDIA MODAL */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black/40 flex justify-center p-6 z-50">
          <div className="bg-white w-full max-w-4xl p-4 rounded shadow-lg">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Media Library</h3>
              <button
                onClick={() => {
                  setShowMediaLibrary(false);
                  setMediaCtx(null);
                }}
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

/* ================== UI HELPERS ================== */
const Card = ({ children }) => (
  <div className="bg-white p-4 rounded shadow-sm mb-6">{children}</div>
);

const Header = ({ title, action, onAction }) => (
  <div className="flex justify-between mb-4">
    <h2 className="font-semibold">{title}</h2>
    <button onClick={onAction} className="text-sm bg-green-600 text-white px-3 py-1 rounded">
      {action}
    </button>
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div className="mb-3">
    <label className="text-xs text-gray-500">{label}</label>
    <input
      className="w-full border p-2 rounded"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div className="mb-3">
    <label className="text-xs text-gray-500">{label}</label>
    <textarea
      className="w-full border p-2 rounded"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const IconBtn = ({ children, className = "", ...p }) => (
  <button {...p} className={`text-red-500 ${className}`}>
    {children}
  </button>
);

const BlockBar = ({ onAdd }) => (
  <div className="flex gap-2 flex-wrap mt-3">
    {["text", "subtitle", "image", "video", "quote"].map((t) => (
      <button
        key={t}
        onClick={() => onAdd(t)}
        className="bg-gray-100 px-2 py-1 rounded text-xs"
      >
        {t}
      </button>
    ))}
  </div>
);
