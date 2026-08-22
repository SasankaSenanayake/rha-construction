import type { LocalizedProject } from "@/lib/content/projects";

export function ProjectGallery({ images }: { images: LocalizedProject["images"] }) {
  if (images.length <= 1) return null;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {images.map((image) => (
        <div key={image.src} className="group aspect-[3/2] overflow-hidden rounded-none bg-ink-800">
          <img
            src={image.src}
            alt={image.alt.en}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </div>
      ))}
    </div>
  );
}
