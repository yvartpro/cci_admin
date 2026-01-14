import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HandGrab, Trash2, X, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Card, Header, Input, Textarea, Select, IconBtn, BlockBar } from "../components/MyUtilities";

import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
  createArticle,
  updateArticle,
  getArticleById,
} from "../services/articles.api";

import WysiwygInput from "../components/WysiwygInput";
import ArticlePreview from "../components/ArticlePreview";
import MediaGrid from "../components/MediaGrid";
import { createSlug } from "../services/helper";
import { ButtonLoadingSpinner } from "../components/LoadingSpinner";

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

/* ========== SORTABLE CONTENT ========== */

const SortableSection = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ attributes, listeners })}
    </div>
  );
};



/* ================== COMPONENT ================== */
export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(EMPTY_ARTICLE);
  const [loading, setLoading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [mediaCtx, setMediaCtx] = useState(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const collapseSection = (id) => {
    setCollapsedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };


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
    setArticle((article) => ({ ...article, author_name: user?.name, sections: fn(article.sections) }));

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
          ? {
            ...sec, blocks: [...sec.blocks, { id: crypto.randomUUID(), type, value: "" }],
          } : sec
      )
    );

  const updateBlock = (sid, bid, value) =>
    updateSections((s) =>
      s.map((sec) =>
        sec.id === sid
          ? { ...sec, blocks: sec.blocks.map((block) => block.id === bid ? { ...block, value } : block) }
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
    setSaving(true);
    const payload = { ...article, slug: createSlug(article.title) };
    const req = id ? updateArticle(id, payload) : createArticle(payload);
    req.then(() => navigate("/cci/manage")).catch(alert).finally(() => setSaving(false));
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-gray-400">Loading…</div>;

  /* ============ RENDER ============ */
  return (
    <div className="flex h-screen bg-gray-50">
      {/* EDITOR */}
      <div className="w-full md:w-1/2 p-8 overflow-y-auto border-r border-gray-200">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
          {id ? "Edit Article" : "Create Article"}
        </h1>

        <Card>
          <Input label="Title" value={article.title} onChange={(v) => setField("title", v)} placeholder="Article Title" />
          <Input label="Subtitle" value={article.subtitle} onChange={(v) => setField("subtitle", v || null)} placeholder="Optional Subtitle" />
          <Textarea label="Excerpt" value={article.excerpt} onChange={(v) => setField("excerpt", v || null)} placeholder="Short summary..." />
          <Select
            label="Category"
            value={article.category}
            options={['LaSTAR', 'CCI Invest', 'CCI Social']}
            onChange={(v) => setField("category", v || null)}
          />
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
            <div className="flex gap-2">
              <input
                className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={article.hero_url || ""}
                onChange={(e) => setField("hero_url", e.target.value || null)}
                placeholder="https://..."
              />
              <button
                onClick={openHeroMedia}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Select Media
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {(Array.isArray(article.tags) ? article.tags : []).map((tag, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                  {tag}
                  <button
                    onClick={() => setField("tags", (Array.isArray(article.tags) ? article.tags : []).filter((_, i) => i !== idx))}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                id="tag-input"
                className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs p-2 border"
                placeholder="Ajouter un tag... (Pressez Entrée)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = e.target.value.trim();
                    const currentTags = Array.isArray(article.tags) ? article.tags : [];
                    if (val && !currentTags.includes(val)) {
                      setField("tags", [...currentTags, val]);
                      e.target.value = "";
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById('tag-input');
                  const val = input.value.trim();
                  const currentTags = Array.isArray(article.tags) ? article.tags : [];
                  if (val && !currentTags.includes(val)) {
                    setField("tags", [...currentTags, val]);
                    input.value = "";
                  }
                }}
                className="p-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 border border-indigo-100"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </Card>

        <Header title="Content Sections" action="Add New Section" onAction={addSection} />

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (!over || active.id === over.id) return;

            updateSections((sections) =>
              arrayMove(
                sections,
                sections.findIndex(s => s.id === active.id),
                sections.findIndex(s => s.id === over.id)
              )
            );
          }}
        >
          <SortableContext
            items={(Array.isArray(article.sections) ? article.sections : []).map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {(Array.isArray(article.sections) ? article.sections : []).map((section) => (
              <SortableSection key={section.id} id={section.id}>
                {({ attributes, listeners }) => (
                  <Card>
                    {/* SECTION HEADER */}
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">

                      {/* DRAG HANDLE */}
                      <span
                        {...attributes}
                        {...listeners}
                        className="cursor-grab text-gray-400"
                        title="Déplacer la section"
                      >
                        <HandGrab size={20} />
                      </span>

                      <input
                        className="flex-1 text-lg font-semibold text-gray-900 placeholder-gray-400 border-none focus:ring-0 p-0"
                        placeholder="Section Title"
                        value={section.title}
                        onChange={(e) =>
                          updateSections((s) =>
                            s.map((x) =>
                              x.id === section.id ? { ...x, title: e.target.value } : x
                            )
                          )
                        }
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => collapseSection(section.id)}
                          className="text-xs text-indigo-600"
                        >
                          {collapsedSections[section.id] ? "Expand" : "Collapse"}
                        </button>

                        <IconBtn onClick={() => removeSection(section.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </IconBtn>
                      </div>
                    </div>

                    {/* BLOCKS (UNCHANGED) */}
                    {!collapsedSections[section.id] && (<>{
                      (Array.isArray(section.blocks) ? section.blocks : []).map((block) => (
                        <div key={block.id} className="mb-4 relative">
                          <IconBtn
                            className="absolute right-0 top-0"
                            onClick={() => removeBlock(section.id, block.id)}
                          >
                            <Trash2 size={14} />
                          </IconBtn>

                          {["image", "video"].includes(block.type) ? (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <Input
                                label={`${block.type === 'image' ? 'Image' : 'Video'} Source URL`}
                                value={block.value}
                                onChange={(v) =>
                                  updateBlock(section.id, block.id, v)
                                }
                                placeholder="https://..."
                              />
                              <button
                                onClick={() => openMedia(section.id, block.id)}
                                className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                              >
                                Browse Media Library →
                              </button>
                            </div>
                          ) : (
                            <WysiwygInput
                              value={block.value}
                              onChange={(v) => {
                                const normalized = v.replace(/&nbsp;/g, ' ');
                                if (normalized !== block.value) {
                                  updateBlock(section.id, block.id, normalized);
                                }
                              }}
                            />
                          )}
                        </div>
                      ))}
                      < BlockBar onAdd={(t) => addBlock(section.id, t)} />
                    </>
                    )}

                  </Card>
                )}
              </SortableSection>
            ))}
          </SortableContext>
        </DndContext>

        <button
          onClick={save}
          disabled={saving}
          className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-4 rounded-lg font-semibold shadow-md transition-all transform active:scale-[0.99]"
        >
          {saving ? <ButtonLoadingSpinner text="Saving..." /> : id ? "Save Changes" : "Publish Article"}
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