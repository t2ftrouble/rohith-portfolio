import { useState, useEffect } from "react";
import type { ProjectFormData } from "@/lib/project-cms";
import { assetOptions, getAssetById } from "@/lib/asset-registry";

interface ProjectFormProps {
  project?: any;
  onSave: (project: ProjectFormData) => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<{
    slug: string;
    number: string;
    title: string;
    type: string;
    role: string;
    year: string;
    status: string;
    description: string;
    process: string[];
    visuals: string;
    image: string;
    category: "FILMMAKING" | "VFX / CG" | "EDITING" | "DESIGN" | "CONTENT";
    hasVideo: boolean;
    videoId: string;
    credits: { role: string; name: string }[];
    fullCredits: string;
    galleryImages: string[];
    client: string;
  }>(
    project
      ? {
          slug: project.slug,
          number: project.number,
          title: project.title,
          type: project.type,
          role: project.role,
          year: project.year || "",
          status: project.status || "",
          description: project.description,
          process: project.process,
          visuals: project.visuals,
          image: project.image,
          category: project.category,
          hasVideo: project.hasVideo || false,
          videoId: project.videoId || "",
          credits: project.credits || [],
          fullCredits: project.fullCredits || "",
          galleryImages: project.galleryImages || [],
          client: project.client || "",
        }
      : {
          slug: "",
          number: "",
          title: "",
          type: "",
          role: "",
          year: "",
          status: "",
          description: "",
          process: [],
          visuals: "",
          image: "",
          category: "FILMMAKING",
          hasVideo: false,
          videoId: "",
          credits: [],
          fullCredits: "",
          galleryImages: [],
          client: "",
        }
  );

  const [selectedCoverAsset, setSelectedCoverAsset] = useState<string | null>(null);
  const [selectedGalleryAssets, setSelectedGalleryAssets] = useState<string[]>([]);
  const [coverImageUpload, setCoverImageUpload] = useState<string | null>(null);
  const [posterImageUpload, setPosterImageUpload] = useState<string | null>(null);
  const [galleryImageUploads, setGalleryImageUploads] = useState<string[]>([]);
  const [useBeforeAfter, setUseBeforeAfter] = useState(false);
  const [beforeImageUpload, setBeforeImageUpload] = useState<string | null>(null);
  const [afterImageUpload, setAfterImageUpload] = useState<string | null>(null);
  const [selectedBeforeAsset, setSelectedBeforeAsset] = useState<string | null>(null);
  const [selectedAfterAsset, setSelectedAfterAsset] = useState<string | null>(null);
  const [processText, setProcessText] = useState(
    project?.process?.join("\n") || ""
  );
  const [creditsText, setCreditsText] = useState(
    project?.credits?.map((c: { role: string; name: string }) => `${c.role}: ${c.name}`).join("\n") || ""
  );

  // Initialize selected assets when editing
  useEffect(() => {
    if (project?.image) {
      const matchingAsset = assetOptions.find((a) => a.path === project.image);
      if (matchingAsset) {
        setSelectedCoverAsset(matchingAsset.id);
      } else {
        // If not in asset registry, it's a custom URL
        setCoverImageUpload(project.image);
      }
    }
    if (project?.galleryImages && project.galleryImages.length > 0) {
      const matchedIds: string[] = [];
      const customUrls: string[] = [];
      project.galleryImages.forEach((url: string) => {
        const match = assetOptions.find((a) => a.path === url);
        if (match) {
          matchedIds.push(match.id);
        } else {
          customUrls.push(url);
        }
      });
      setSelectedGalleryAssets(matchedIds);
      setGalleryImageUploads(customUrls);
    }
    if (project?.posterImage) {
      const match = assetOptions.find((a) => a.path === project.posterImage);
      if (match) {
        // You could add poster to asset registry if needed
      } else {
        setPosterImageUpload(project.posterImage);
      }
    }
    if (project?.showBeforeAfter) {
      setUseBeforeAfter(true);
    }
    if (project?.beforeImage) {
      const match = assetOptions.find((a) => a.path === project.beforeImage);
      if (match) {
        setSelectedBeforeAsset(match.id);
      } else {
        setBeforeImageUpload(project.beforeImage);
      }
    }
    if (project?.afterImage) {
      const match = assetOptions.find((a) => a.path === project.afterImage);
      if (match) {
        setSelectedAfterAsset(match.id);
      } else {
        setAfterImageUpload(project.afterImage);
      }
    }
  }, [project]);

  const handleFileUpload = (file: File, setter: (url: string) => void) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrl = (url: string, setter: (url: string) => void) => {
    if (url && url.trim().length > 0) {
      setter(url.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse process lines
    const process = processText
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);

    // Parse credits lines
    const credits: { role: string; name: string }[] = [];
    creditsText.split("\n").forEach((line: string) => {
      const match = line.match(/^(.+?):\s*(.+)$/);
      if (match && match[1] && match[2]) {
        credits.push({ role: match[1].trim(), name: match[2].trim() });
      }
    });

    // Extract YouTube video ID from URL if provided
    let videoId: string | undefined = formData.videoId || undefined;
    if (videoId && !videoId.match(/^[a-zA-Z0-9_-]{11}$/)) {
      const match = videoId.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      );
      if (match && match[1]) {
        videoId = match[1];
      } else {
        videoId = undefined;
      }
    }

    // Combine asset registry selections with custom uploads
    const finalGalleryImages = [
      ...selectedGalleryAssets.map((id) => {
        const asset = getAssetById(id);
        return asset?.path || "";
      }),
      ...galleryImageUploads,
    ].filter((url) => url.trim().length > 0);

    const projectData: ProjectFormData = {
      slug: formData.slug,
      number: formData.number,
      title: formData.title,
      type: formData.type,
      role: formData.role,
      description: formData.description,
      process,
      visuals: formData.visuals,
      image: coverImageUpload || (selectedCoverAsset ? getAssetById(selectedCoverAsset)?.path : "") || formData.image,
      category: formData.category,
      hasVideo: !!videoId,
      credits,
    };

    // Add optional fields only if they have values
    if (formData.year) projectData.year = formData.year;
    if (formData.status) projectData.status = formData.status;
    if (videoId) projectData.videoId = videoId;
    if (formData.fullCredits) projectData.fullCredits = formData.fullCredits;
    if (finalGalleryImages.length > 0) {
      projectData.galleryImages = finalGalleryImages;
    }
    if (formData.client) projectData.client = formData.client;
    if (posterImageUpload) projectData.posterImage = posterImageUpload;
    if (useBeforeAfter) projectData.showBeforeAfter = true;
    if (beforeImageUpload) projectData.beforeImage = beforeImageUpload;
    if (afterImageUpload) projectData.afterImage = afterImageUpload;

    onSave(projectData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <h2 className="title-card text-2xl text-ivory">
          {project ? "Edit Project" : "Add New Project"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="label-track text-gold hover:text-ivory transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="label-track text-gold">Basic Information</h3>

        <div>
          <label className="block text-sm text-ivory/80 mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
            placeholder="Project title"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ivory/80 mb-2">Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
              placeholder="project-slug (URL-friendly)"
            />
          </div>

          <div>
            <label className="block text-sm text-ivory/80 mb-2">Type *</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
              placeholder="Short Film, Pilot Film, etc."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-ivory/80 mb-2">Year</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
              placeholder="2024"
            />
          </div>

          <div>
            <label className="block text-sm text-ivory/80 mb-2">Status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
              placeholder="Released, In Progress, etc."
            />
          </div>

          <div>
            <label className="block text-sm text-ivory/80 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
            >
              <option value="FILMMAKING">FILMMAKING</option>
              <option value="VFX / CG">VFX / CG</option>
              <option value="EDITING">EDITING</option>
              <option value="DESIGN">DESIGN</option>
              <option value="CONTENT">CONTENT</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-ivory/80 mb-2">Client (Optional)</label>
          <input
            type="text"
            name="client"
            value={formData.client || ""}
            onChange={handleChange}
            className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
            placeholder="Client name"
          />
        </div>
      </div>

      {/* Role & Description */}
      <div className="space-y-4">
        <h3 className="label-track text-gold">Details</h3>

        <div>
          <label className="block text-sm text-ivory/80 mb-2">Your Role *</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
            placeholder="Director, Editor, CG Artist, etc."
          />
        </div>

        <div>
          <label className="block text-sm text-ivory/80 mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none resize-none"
            placeholder="Brief description of the project"
          />
        </div>

        <div>
          <label className="block text-sm text-ivory/80 mb-2">
            Process (one per line)
          </label>
          <textarea
            value={processText}
            onChange={(e) => setProcessText(e.target.value)}
            rows={4}
            className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none resize-none"
            placeholder="Story development&#10;Direction on set&#10;Editing"
          />
        </div>

        <div>
          <label className="block text-sm text-ivory/80 mb-2">Visuals</label>
          <input
            type="text"
            name="visuals"
            value={formData.visuals}
            onChange={handleChange}
            className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
            placeholder="Video, poster, stills, etc."
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="label-track text-gold">Images</h3>

        {/* Cover Image */}
        <div>
          <label className="block text-sm text-ivory/80 mb-2">
            Cover Image *
          </label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => document.getElementById("cover-upload")?.click()}
                className="flex-1 label-track border border-gold/60 px-4 py-2 !text-[10px] !text-gold hover:bg-gold/10 transition-colors"
              >
                Upload File
              </button>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, setCoverImageUpload);
                }}
              />
            </div>
            <input
              type="text"
              value={coverImageUpload || ""}
              onChange={(e) => handleImageUrl(e.target.value, setCoverImageUpload)}
              className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
              placeholder="Or paste image URL..."
            />
            <select
              value={selectedCoverAsset || ""}
              onChange={(e) => {
                const assetId = e.target.value;
                setSelectedCoverAsset(assetId || null);
                if (assetId) {
                  const asset = getAssetById(assetId);
                  if (asset) {
                    setCoverImageUpload(asset.path);
                  }
                }
              }}
              className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
            >
              <option value="">Or select from portfolio assets...</option>
              {assetOptions.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name}
                </option>
              ))}
            </select>
          </div>
          {(coverImageUpload || selectedCoverAsset) && (
            <div className="mt-2">
              <img
                src={coverImageUpload || (selectedCoverAsset ? getAssetById(selectedCoverAsset)?.path : "")}
                alt="Cover preview"
                className="h-32 w-full object-cover rounded border border-border"
              />
            </div>
          )}
        </div>

        {/* Poster Image */}
        <div>
          <label className="block text-sm text-ivory/80 mb-2">
            Poster Image (Optional)
          </label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => document.getElementById("poster-upload")?.click()}
                className="flex-1 label-track border border-gold/60 px-4 py-2 !text-[10px] !text-gold hover:bg-gold/10 transition-colors"
              >
                Upload File
              </button>
              <input
                id="poster-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, setPosterImageUpload);
                }}
              />
            </div>
            <input
              type="text"
              value={posterImageUpload || ""}
              onChange={(e) => handleImageUrl(e.target.value, setPosterImageUpload)}
              className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
              placeholder="Or paste image URL..."
            />
          </div>
          {posterImageUpload && (
            <div className="mt-2">
              <img
                src={posterImageUpload}
                alt="Poster preview"
                className="h-32 w-full object-cover rounded border border-border"
              />
            </div>
          )}
        </div>

        {/* Gallery Images */}
        <div>
          <label className="block text-sm text-ivory/80 mb-2">
            Gallery Images (Optional)
          </label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => document.getElementById("gallery-upload")?.click()}
                className="flex-1 label-track border border-gold/60 px-4 py-2 !text-[10px] !text-gold hover:bg-gold/10 transition-colors"
              >
                Add Image
              </button>
              <input
                id="gallery-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file, (url) => {
                      setGalleryImageUploads([...galleryImageUploads, url]);
                    });
                  }
                }}
              />
            </div>
            <input
              type="text"
              className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
              placeholder="Or paste image URL..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const input = e.target as HTMLInputElement;
                  if (input.value.trim()) {
                    setGalleryImageUploads([...galleryImageUploads, input.value.trim()]);
                    input.value = "";
                  }
                }
              }}
            />
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {galleryImageUploads.map((url, index) => (
                <div key={index} className="flex items-center gap-3 p-2 border border-border rounded">
                  <img
                    src={url}
                    alt={`Gallery ${index + 1}`}
                    className="h-12 w-12 object-cover rounded"
                  />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                      const updated = [...galleryImageUploads];
                      updated[index] = e.target.value;
                      setGalleryImageUploads(updated);
                    }}
                    className="flex-1 bg-navy border-none px-2 py-1 text-sm text-ivory focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryImageUploads(galleryImageUploads.filter((_, i) => i !== index));
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {assetOptions.map((asset) => (
                <label
                  key={asset.id}
                  className="flex items-center gap-3 p-2 border border-border rounded hover:border-gold/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedGalleryAssets.includes(asset.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGalleryAssets([...selectedGalleryAssets, asset.id]);
                      } else {
                        setSelectedGalleryAssets(selectedGalleryAssets.filter((id) => id !== asset.id));
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <img
                    src={asset.path}
                    alt={asset.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                  <span className="text-sm text-ivory/80">{asset.name}</span>
                </label>
              ))}
            </div>
            {(galleryImageUploads.length > 0 || selectedGalleryAssets.length > 0) && (
              <p className="text-xs text-muted-foreground">
                {galleryImageUploads.length + selectedGalleryAssets.length} image(s) selected
              </p>
            )}
          </div>
        </div>

        {/* Before/After Toggle */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useBeforeAfter}
              onChange={(e) => setUseBeforeAfter(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm text-ivory/80">Show Before/After Slider</span>
          </label>
        </div>

        {/* Before/After Images */}
        {useBeforeAfter && (
          <div className="space-y-4 border-t border-border pt-4">
            <div>
              <label className="block text-sm text-ivory/80 mb-2">
                Before Image *
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById("before-upload")?.click()}
                    className="flex-1 label-track border border-gold/60 px-4 py-2 !text-[10px] !text-gold hover:bg-gold/10 transition-colors"
                  >
                    Upload File
                  </button>
                  <input
                    id="before-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, setBeforeImageUpload);
                    }}
                  />
                </div>
                <input
                  type="text"
                  value={beforeImageUpload || ""}
                  onChange={(e) => handleImageUrl(e.target.value, setBeforeImageUpload)}
                  className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
                  placeholder="Or paste image URL..."
                />
                <select
                  value={selectedBeforeAsset || ""}
                  onChange={(e) => {
                    const assetId = e.target.value;
                    setSelectedBeforeAsset(assetId || null);
                    if (assetId) {
                      const asset = getAssetById(assetId);
                      if (asset) {
                        setBeforeImageUpload(asset.path);
                      }
                    }
                  }}
                  className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
                >
                  <option value="">Or select from portfolio assets...</option>
                  {assetOptions.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name}
                    </option>
                  ))}
                </select>
              </div>
              {(beforeImageUpload || selectedBeforeAsset) && (
                <div className="mt-2">
                  <img
                    src={beforeImageUpload || (selectedBeforeAsset ? getAssetById(selectedBeforeAsset)?.path : "")}
                    alt="Before preview"
                    className="h-32 w-full object-cover rounded border border-border"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-ivory/80 mb-2">
                After Image *
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById("after-upload")?.click()}
                    className="flex-1 label-track border border-gold/60 px-4 py-2 !text-[10px] !text-gold hover:bg-gold/10 transition-colors"
                  >
                    Upload File
                  </button>
                  <input
                    id="after-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, setAfterImageUpload);
                    }}
                  />
                </div>
                <input
                  type="text"
                  value={afterImageUpload || ""}
                  onChange={(e) => handleImageUrl(e.target.value, setAfterImageUpload)}
                  className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
                  placeholder="Or paste image URL..."
                />
                <select
                  value={selectedAfterAsset || ""}
                  onChange={(e) => {
                    const assetId = e.target.value;
                    setSelectedAfterAsset(assetId || null);
                    if (assetId) {
                      const asset = getAssetById(assetId);
                      if (asset) {
                        setAfterImageUpload(asset.path);
                      }
                    }
                  }}
                  className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
                >
                  <option value="">Or select from portfolio assets...</option>
                  {assetOptions.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name}
                    </option>
                  ))}
                </select>
              </div>
              {(afterImageUpload || selectedAfterAsset) && (
                <div className="mt-2">
                  <img
                    src={afterImageUpload || (selectedAfterAsset ? getAssetById(selectedAfterAsset)?.path : "")}
                    alt="After preview"
                    className="h-32 w-full object-cover rounded border border-border"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Video */}
      <div className="space-y-4">
        <h3 className="label-track text-gold">Video (Optional)</h3>

        <div>
          <label className="block text-sm text-ivory/80 mb-2">
            YouTube URL or Video ID
          </label>
          <input
            type="text"
            name="videoId"
            value={formData.videoId || ""}
            onChange={handleChange}
            className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
            placeholder="https://youtube.com/watch?v=... or video ID"
          />
        </div>
      </div>

      {/* Credits */}
      <div className="space-y-4">
        <h3 className="label-track text-gold">Credits (Optional)</h3>

        <div>
          <label className="block text-sm text-ivory/80 mb-2">
            Full Credits
          </label>
          <textarea
            name="fullCredits"
            value={formData.fullCredits || ""}
            onChange={handleChange}
            rows={6}
            className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none resize-none"
            placeholder="Director: John Doe&#10;Producer: Jane Smith&#10;..."
          />
        </div>

        <div>
          <label className="block text-sm text-ivory/80 mb-2">
            Key Credits (one per line: Role: Name)
          </label>
          <textarea
            value={creditsText}
            onChange={(e) => setCreditsText(e.target.value)}
            rows={4}
            className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none resize-none"
            placeholder="Director: John Doe&#10;DOP: Jane Smith&#10;Editor: Bob Johnson"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-border">
        <button
          type="submit"
          className="label-track bg-gold px-8 py-4 !text-[10px] !text-charcoal hover:bg-gold/90 transition-colors"
        >
          {project ? "Update Project" : "Add Project"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="label-track border border-gold/60 px-8 py-4 !text-[10px] !text-gold hover:bg-gold/10 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
