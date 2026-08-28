import DOMPurify from "isomorphic-dompurify";

export const sanitizeHtml = (dirty: string): string => {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
  });
};

export const sanitizeBrief = sanitizeHtml;
