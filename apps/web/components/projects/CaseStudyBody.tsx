/**
 * Renders pre-rendered HTML from build-time Markdown (content/projects/*.json
 * -> lib/content/markdown.ts). Content is first-party and authored in-repo,
 * never user-supplied, so this is not an XSS surface.
 */
export function CaseStudyBody({ html }: { html: string }) {
  return (
    <div className="case-study-body max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
